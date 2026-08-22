import Container from '../ui/Container';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

const FOCUS =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal rounded-sm';

const footerSections = [
  {
    title: 'Quick Links',
    links: [
      { text: 'Home', url: '/' },
      { text: 'How to Play', url: '/howToPlay' },
      { text: 'Log In', url: '/login' },
      { text: 'Sign Up', url: '/signup' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { text: 'Terms of Service', url: '/terms-of-service' },
      { text: 'Privacy Policy', url: '/privacy-policy' },
    ],
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border-card bg-surface-bar font-outfit text-text-primary">
      <Container size="4" className="px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4 lg:col-span-2">
            <Link to="/" className={`inline-flex items-center gap-3 ${FOCUS}`}>
              <img src={logo} alt="Predictions League" className="h-7" />
              <span className="font-dmSerif text-2xl text-brand-teal">predictionsLeague</span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-text-muted">
              Premier League predictions as a desk of slips and chips. Built for fans who actually watch the matches.
            </p>
          </div>

          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="text-xs font-semibold tracking-[0.14em] text-brand-teal uppercase">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.text}>
                    <Link
                      to={link.url}
                      className={`text-sm text-text-muted transition-colors hover:text-brand-teal ${FOCUS}`}
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border-card pt-6 text-xs text-text-muted sm:flex-row">
          <p>&copy; {currentYear} OGKomori x hayzaydee. All rights reserved.</p>
          <p>
            Club crests and football data provided by{' '}
            <a
              href="https://www.football-data.org"
              target="_blank"
              rel="noopener noreferrer"
              className={`underline hover:text-brand-teal ${FOCUS}`}
            >
              Football-Data.org
            </a>
            .
          </p>
        </div>
      </Container>
    </footer>
  );
}
