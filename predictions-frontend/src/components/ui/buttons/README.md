# Centralized Button Component System

This centralized button system provides a comprehensive set of reusable button components designed to replace all button patterns across the predictions league application.

## 📁 Structure

```
src/components/ui/buttons/
├── index.js              # Central export file
├── PrimaryButton.jsx     # Main action buttons
├── SecondaryButton.jsx   # Secondary actions
├── IconButton.jsx        # Icon-only buttons
├── ActionButton.jsx      # Contextual action buttons
├── NavigationButton.jsx  # Navigation and menu buttons
├── ToggleButton.jsx      # Toggle/switch buttons
├── MenuButton.jsx        # Dropdown menu buttons
├── MotionButton.jsx      # Highly animated buttons
├── FormButton.jsx        # Form-specific buttons
├── CarouselButton.jsx    # Carousel navigation
├── ChipButton.jsx        # Selectable chips
└── StatusButton.jsx      # Status indicators
```

## 🚀 Usage

### Import Components

```jsx
import { 
  PrimaryButton, 
  SecondaryButton, 
  IconButton,
  ActionButton,
  NavigationButton,
  ToggleButton,
  MenuButton,
  MotionButton,
  FormButton,
  CarouselButton,
  ChipButton,
  StatusButton
} from '@/components/ui/buttons';
```

### PrimaryButton

Main action buttons with prominent styling for primary CTAs, form submissions, and main actions.

```jsx
<PrimaryButton 
  color="teal" 
  size="lg" 
  variant="solid"
  onClick={handleClick}
  loading={isLoading}
>
  Get Started
</PrimaryButton>
```

**Props:**
- `color`: `'teal' | 'indigo' | 'purple' | 'amber' | 'blue'`
- `size`: `'sm' | 'md' | 'lg' | 'xl'`
- `variant`: `'solid' | 'outline'`
- `loading`: boolean
- `disabled`: boolean

### SecondaryButton

Secondary actions with subtle styling for cancel actions, secondary CTAs, and back buttons.

```jsx
<SecondaryButton 
  variant="outline" 
  size="md"
  onClick={handleCancel}
>
  Cancel
</SecondaryButton>
```

**Props:**
- `variant`: `'outline' | 'ghost' | 'subtle'`
- `size`: `'sm' | 'md' | 'lg'`

### IconButton

Icon-only buttons for actions and navigation.

```jsx
<IconButton 
  icon={<CloseIcon />}
  color="slate"
  size="md"
  variant="ghost"
  ariaLabel="Close modal"
  onClick={handleClose}
/>
```

**Props:**
- `icon`: React element (required)
- `color`: `'slate' | 'teal' | 'red' | 'indigo'`
- `variant`: `'ghost' | 'solid' | 'outline'`
- `ariaLabel`: string (required for accessibility)

### ActionButton

Buttons for specific actions with contextual styling.

```jsx
<ActionButton 
  color="teal"
  variant="primary"
  icon={<PlusIcon />}
  iconPosition="left"
  onClick={handlePredict}
>
  Predict
</ActionButton>
```

**Props:**
- `icon`: React element
- `iconPosition`: `'left' | 'right'`
- `color`: `'teal' | 'indigo' | 'purple' | 'amber' | 'red'`
- `variant`: `'primary' | 'solid' | 'ghost'`

### NavigationButton

Buttons for navigation and menu items.

```jsx
<NavigationButton 
  variant="menu"
  active={isActive}
  icon={<HomeIcon />}
  onClick={handleNavigation}
>
  Dashboard
</NavigationButton>
```

**Props:**
- `variant`: `'menu' | 'tab' | 'back' | 'carousel'`
- `active`: boolean
- `direction`: `'left' | 'right'` (for carousel variant)

### ToggleButton

Buttons with on/off states.

```jsx
<ToggleButton 
  active={isExpanded}
  variant="expand"
  icon={<ChevronDownIcon />}
  onClick={handleToggle}
>
  Show Details
</ToggleButton>
```

**Props:**
- `active`: boolean
- `variant`: `'default' | 'theme' | 'chip' | 'expand'`

### MenuButton & MenuItem

Dropdown menu trigger buttons with menu content.

```jsx
<MenuButton
  isOpen={isMenuOpen}
  onToggle={setIsMenuOpen}
  icon={<DotsHorizontalIcon />}
  variant="actions"
  menuContent={
    <>
      <MenuItem icon={<EditIcon />} onClick={handleEdit}>
        Edit
      </MenuItem>
      <MenuItem icon={<DeleteIcon />} onClick={handleDelete} variant="danger">
        Delete
      </MenuItem>
    </>
  }
>
  Actions
</MenuButton>
```

**MenuButton Props:**
- `isOpen`: boolean
- `onToggle`: function
- `menuContent`: React element
- `position`: `'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'`

**MenuItem Props:**
- `variant`: `'default' | 'danger' | 'success'`

### MotionButton

Highly animated buttons for enhanced interactions.

```jsx
<MotionButton 
  color="teal"
  size="xl"
  animation="glow"
  onClick={handleAction}
>
  Start Predicting
</MotionButton>
```

**Props:**
- `animation`: `'scale' | 'lift' | 'bounce' | 'glow'`
- `variant`: `'primary' | 'outline' | 'gradient'`

### FormButton & StepButton

Specialized buttons for forms and input controls.

```jsx
<FormButton 
  type="submit"
  variant="submit"
  fullWidth
  loading={isSubmitting}
  loadingText="Submitting..."
>
  Submit Prediction
</FormButton>

<StepButton 
  direction="next"
  icon={<ChevronRightIcon />}
  onClick={handleNext}
>
  Continue
</StepButton>
```

**FormButton Props:**
- `variant`: `'primary' | 'secondary' | 'submit' | 'cancel'`
- `fullWidth`: boolean
- `loadingText`: string

**StepButton Props:**
- `direction`: `'next' | 'back' | 'submit'`

### CarouselButton & CarouselDots

Navigation buttons for carousels and sliders.

```jsx
<CarouselButton 
  direction="left"
  onClick={handlePrevious}
  visible={canGoPrevious}
  variant="accent"
/>

<CarouselDots 
  total={totalSlides}
  current={currentSlide}
  onDotClick={handleDotClick}
/>
```

### ChipButton & SimpleChip

Buttons that represent selectable chips/tags.

```jsx
<ChipButton 
  selected={isSelected}
  color="teal"
  icon="2x"
  value={4}
  maxValue={8}
  onClick={handleChipSelect}
>
  Double Down
</ChipButton>

<SimpleChip 
  selected={isActive}
  removable
  onRemove={handleRemove}
>
  Filter Tag
</SimpleChip>
```

### StatusButton & BadgeButton

Buttons that display status with appropriate styling.

```jsx
<StatusButton 
  status="correct"
  showIcon={true}
  onClick={handleStatusClick}
>
  Prediction Correct
</StatusButton>

<BadgeButton 
  variant="success"
  icon={<CheckIcon />}
>
  Active
</BadgeButton>
```

**StatusButton Props:**
- `status`: `'pending' | 'correct' | 'incorrect' | 'active' | 'inactive'`
- `showIcon`: boolean

**BadgeButton Props:**
- `variant`: `'default' | 'success' | 'warning' | 'error' | 'info'`

## 🎨 Design System

### Color Palette
- **Teal**: Primary brand color for main actions
- **Indigo**: Secondary actions and navigation
- **Purple**: Special actions and submissions
- **Amber**: Warnings and highlights
- **Red**: Destructive actions and errors
- **Slate**: Neutral actions and text

### Sizes
- **xs/sm**: Compact interfaces, inline actions
- **md**: Standard interface elements
- **lg**: Important actions, hero sections
- **xl**: Landing page CTAs, major actions

### Animation System
All buttons include Framer Motion animations:
- **Hover**: Scale, lift, or glow effects
- **Tap**: Scale down for feedback
- **Loading**: Spinner animations
- **State transitions**: Smooth property changes

## 🔄 Migration Guide

### Replacing Existing Buttons

**Before:**
```jsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  onClick={handleClick}
  className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg"
>
  Predict
</motion.button>
```

**After:**
```jsx
<ActionButton 
  color="teal"
  variant="solid"
  onClick={handleClick}
>
  Predict
</ActionButton>
```

### Common Patterns

1. **Hero CTAs** → `MotionButton` with `animation="glow"`
2. **Form submissions** → `FormButton` with `variant="submit"`
3. **Navigation items** → `NavigationButton` with `variant="menu"`
4. **Icon actions** → `IconButton` with appropriate `color`
5. **Chip selections** → `ChipButton` or `SimpleChip`
6. **Status displays** → `StatusButton` or `BadgeButton`

## 🧪 Testing

Each button component includes:
- Proper ARIA labels and accessibility
- Keyboard navigation support
- Focus management
- Loading and disabled states
- Comprehensive prop validation

## 📱 Responsive Design

All buttons are designed with responsive behavior:
- Touch-friendly sizes on mobile
- Appropriate spacing and typography
- Consistent behavior across devices
- Proper focus indicators for keyboard users

## 🎯 Best Practices

1. **Use semantic button types** - Choose the right component for the context
2. **Provide proper labels** - Always include `ariaLabel` for icon buttons
3. **Handle loading states** - Use `loading` prop for async actions
4. **Consistent sizing** - Use the design system sizes consistently
5. **Color meaning** - Use colors that match their semantic meaning
6. **Test accessibility** - Verify keyboard navigation and screen readers
