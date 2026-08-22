import { Link } from 'react-router-dom';
import Container from '../ui/Container';
import Button from '../ui/buttons/Button';

export default function Cta() {
  return (
    <section className="bg-surface-bar py-20 md:py-28">
      <Container size="4" className="px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-dmSerif text-4xl text-text-primary md:text-5xl">Ready to file this weekend?</h2>
          <p className="mx-auto mt-4 max-w-lg font-outfit text-lg text-text-muted">
            Open a ledger, stamp a gameweek, and climb with the people you actually watch matches with.
          </p>
          <div className="mt-8 flex justify-center">
            <Link to="/signup">
              <Button size="lg">Get started free</Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
