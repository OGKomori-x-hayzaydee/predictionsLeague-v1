# Dual Accuracy System: Results Accuracy + Scoreline Accuracy

## Why

The app currently tracks one accuracy metric — exact scoreline matches (`correct` column). This is extremely strict (~7-8% for most users) and doesn't reflect how well users actually predict outcomes. We're adding a second, result-based accuracy metric so users see two stats:

- **Results Accuracy** — did you predict the right outcome (home win / draw / away win)?
- **Scoreline Accuracy** — did you predict the exact score?

---

## Current State

### How it works today
1. When a match finishes, `PredictionService.updateDatabaseAfterGame()` evaluates every prediction for that match
2. It calls `isPredictionCorrect()` which checks **exact scoreline** (both home AND away scores match)
3. Sets `prediction.correct = true/false`
4. The `GET /dashboard/me` endpoint queries `SUM(CASE WHEN p.correct = TRUE ...)` to compute accuracy %
5. Frontend displays the number as-is

### Files involved
| File | What it does |
|------|--------------|
| `PredictionEntity.java` | Entity with `correct` Boolean field |
| `PredictionService.java:199-201` | `isPredictionCorrect()` — exact scoreline comparison |
| `PredictionService.java:72-97` | `updateDatabaseAfterGame()` — sets `correct` on match completion |
| `PredictionRepository.java:33-40` | SQL query counting `correct = TRUE` |
| `AccuracyStatsProjection.java` | Projection: `total`, `correct`, computed `accuracy` |
| `DashboardEssentials.java:35-56` | Response DTO: `Stats.AccuracyRate { percentage, correct }` |
| `DashboardService.java:60-88` | Builds the dashboard response, calls accuracy query |

---

## Changes Required

### 1. Database — Add column + backfill

```sql
-- Add the new column
ALTER TABLE predictions ADD COLUMN result_correct BOOLEAN DEFAULT FALSE;

-- Backfill all completed predictions using match data
-- SIGN() returns -1 (away win), 0 (draw), or 1 (home win)
UPDATE predictions p
SET result_correct = (
    SIGN(p.home_score - p.away_score) = SIGN(m.home_score - m.away_score)
)
FROM matches m
WHERE p.match_id = m.old_fixture_id
  AND p.status = 'COMPLETED';
```

### 2. PredictionEntity.java

Add one field alongside `correct` (line 31):

```java
private Boolean correct;          // existing — exact scoreline match
private Boolean resultCorrect;    // NEW — correct outcome (win/draw/loss)
```

Initialize in constructor (line 49):

```java
this.correct = false;
this.resultCorrect = false;   // NEW
```

### 3. PredictionService.java

**Add new method** (next to `isPredictionCorrect` at line 199):

```java
private boolean isResultCorrect(PredictionEntity prediction, MatchEntity match) {
    return Integer.compare(prediction.getHomeScore(), prediction.getAwayScore())
        == Integer.compare(match.getHomeScore(), match.getAwayScore());
}
```

**Update `updateDatabaseAfterGame()`** (line 83, add one line after `setCorrect`):

```java
prediction.setCorrect(correct);
prediction.setResultCorrect(isResultCorrect(prediction, match));  // NEW
```

### 4. AccuracyStatsProjection.java — Replace with combined projection

Replace the current `AccuracyStatsProjection` interface (or create a new `CombinedAccuracyProjection`):

```java
public interface CombinedAccuracyProjection {
    Integer getTotal();
    Integer getCorrect();          // scoreline correct count
    Integer getResultCorrect();    // result correct count

    default Double getScorelineAccuracy() {
        return (getTotal() == 0) ? 0.0 : (getCorrect() * 100.0) / getTotal();
    }

    default Double getResultAccuracy() {
        return (getTotal() == 0) ? 0.0 : (getResultCorrect() * 100.0) / getTotal();
    }
}
```

### 5. PredictionRepository.java — Update query (lines 33-40)

Replace the existing `getAccuracyStatsByUserId` query:

```java
@Query(value = """
    SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN p.correct = TRUE THEN 1 ELSE 0 END) AS correct,
        SUM(CASE WHEN p.result_correct = TRUE THEN 1 ELSE 0 END) AS resultCorrect
    FROM predictions p
    WHERE p.user_id = :userId
""", nativeQuery = true)
CombinedAccuracyProjection getCombinedAccuracyByUserId(@Param("userId") Long userId);
```

### 6. DashboardEssentials.java — Add second accuracy field to Stats

Current `Stats` class (line 37-41):
```java
private WeeklyPoints weeklyPoints;
private AccuracyRate accuracyRate;      // single metric
private AvailableChips availableChips;
private GlobalRank globalRank;
```

Change to:
```java
private WeeklyPoints weeklyPoints;
private AccuracyRate resultsAccuracy;     // NEW — result-based (win/draw/loss)
private AccuracyRate scorelineAccuracy;   // RENAMED — exact scoreline
private AvailableChips availableChips;
private GlobalRank globalRank;
```

The `AccuracyRate` inner class stays the same (`{ Double percentage, Integer correct }`), just reused for both.

### 7. DashboardService.java — Populate both metrics (lines 63-78)

Replace the current accuracy block:

```java
// Before (line 63):
AccuracyStatsProjection accuracyStatsProjection = predictionRepository.getAccuracyStatsByUserId(user.getId());

// After:
CombinedAccuracyProjection accuracy = predictionRepository.getCombinedAccuracyByUserId(user.getId());
```

Replace the `Stats` construction (lines 71-78):

```java
.stats(new DashboardEssentials.Stats(
    new DashboardEssentials.Stats.WeeklyPoints(0, globalRank, 0),
    new DashboardEssentials.Stats.AccuracyRate(
        accuracy.getResultAccuracy(), accuracy.getResultCorrect()     // results accuracy
    ),
    new DashboardEssentials.Stats.AccuracyRate(
        accuracy.getScorelineAccuracy(), accuracy.getCorrect()        // scoreline accuracy
    ),
    new DashboardEssentials.Stats.AvailableChips(0, "No chips available to use"),
    new DashboardEssentials.Stats.GlobalRank(globalRank, (globalRank * 100.0) / totalUsers)
))
```

---

## API Response Shape (before → after)

**Before:**
```json
{
  "stats": {
    "accuracyRate": { "percentage": 7.84, "correct": 4 }
  }
}
```

**After:**
```json
{
  "stats": {
    "resultsAccuracy": { "percentage": 52.94, "correct": 27 },
    "scorelineAccuracy": { "percentage": 7.84, "correct": 4 }
  }
}
```

---

## Frontend Impact (handled separately)

Once the backend changes are deployed, the frontend needs to update field references:
- `stats.accuracyRate` → `stats.resultsAccuracy` and `stats.scorelineAccuracy`
- Affects: `ProfileView.jsx`, `DashboardView.jsx`
- Labels: "Results Accuracy" and "Scoreline Accuracy"

---

## Summary of files to change

| # | File | Change |
|---|------|--------|
| 1 | **SQL migration** | `ALTER TABLE` + `UPDATE` backfill |
| 2 | `entity/PredictionEntity.java` | Add `resultCorrect` field + constructor init |
| 3 | `service/PredictionService.java` | Add `isResultCorrect()`, call it in `updateDatabaseAfterGame()` |
| 4 | `dto/projection/AccuracyStatsProjection.java` | Replace with `CombinedAccuracyProjection` (or new file) |
| 5 | `repository/PredictionRepository.java` | Update query to return both counts |
| 6 | `dto/response/DashboardEssentials.java` | Add `scorelineAccuracy` field alongside renamed `resultsAccuracy` |
| 7 | `service/DashboardService.java` | Use combined query, populate both accuracy fields |

---

## Testing

1. Run migration SQL against the database
2. Verify `result_correct` is populated for all `COMPLETED` predictions
3. Hit `GET /dashboard/me` — confirm response has both `resultsAccuracy` and `scorelineAccuracy`
4. Trigger a match completion (or mock one) — confirm both `correct` and `resultCorrect` are set on new predictions
5. Spot-check: a prediction with correct winner but wrong score should have `resultCorrect = true`, `correct = false`
