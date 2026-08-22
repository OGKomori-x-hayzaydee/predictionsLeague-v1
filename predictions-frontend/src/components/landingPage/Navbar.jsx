import { useEffect, useState, memo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from '@phosphor-icons/react';
import Container from '../ui/Container';
import Button from '../ui/buttons/Button';
import IconButton from '../ui/buttons/IconButton';
import { useTheme } from '../../hooks/useTheme';
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion';
import logo from '../../assets/logo.png';

const PAGE_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/howToPlay', label: 'How to Play' },
];

const HASH_LINKS = [
  { to: '/howToPlay#basics', label: 'Basics' },
  { to: '/howToPlay#scoring', label: 'Scoring' },
  { to: '/howToPlay#chips', label: 'Chips' },
  { to: '/howToPlay#faq', label: 'FAQ' },
];

const FOCUS =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal';

function NavItem({ to, children, onNavigate }) {
  const location = useLocation();
  const isActive = to.includes('#')
    ? `${location.pathname}${location.hash}` === to
    : location.pathname === to;

  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={`rounded-sm font-outfit text-sm font-medium tracking-wide transition-colors ${FOCUS} ${
        isActive ? 'text-brand-teal' : 'text-text-muted hover:text-brand-teal'
      }`}
    >
      <span className="block px-1 py-1">{children}</span>
    </NavLink>
  );
}

const Navbar = memo(() => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname, location.hash]);

  const closeMenu = () => setIsMenuOpen(false);
  const onHowToPlay = location.pathname === '/howToPlay';

  return (
    <nav
      className={`fixed top-0 left-0 z-50 w-full py-3 transition-colors duration-300 ${
        scrolled || isMenuOpen
          ? 'border-b border-border-card bg-surface-header/90 shadow-card backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <Container size="4" className="mx-auto px-6">
        <div className="flex items-center justify-between">
          <NavLink to="/" onClick={closeMenu} className={`flex items-center rounded-sm ${FOCUS}`}>
            <img src={logo} alt="Predictions League" className="h-8 md:mr-3" />
            <span className="hidden font-dmSerif text-2xl text-brand-teal md:inline">
              predictionsLeague
            </span>
          </NavLink>

          <div className="flex items-center gap-2 md:hidden">
            <IconButton label="Toggle theme" onClick={toggleTheme}>
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </IconButton>
            <IconButton
              label="Menu"
              aria-expanded={isMenuOpen}
              aria-controls="landing-mobile-nav"
              onClick={() => setIsMenuOpen((open) => !open)}
              active={isMenuOpen}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </IconButton>
          </div>

          <div className="hidden items-center gap-7 font-outfit md:flex">
            {PAGE_LINKS.map((link) => (
              <NavItem key={link.to} to={link.to}>
                {link.label}
              </NavItem>
            ))}
            <IconButton label="Toggle theme" onClick={toggleTheme}>
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </IconButton>
            <NavLink to="/login" className={`rounded-sm font-outfit text-sm font-medium text-text-muted hover:text-brand-teal ${FOCUS}`}>
              Log In
            </NavLink>
            <NavLink to="/signup" className={`rounded-md ${FOCUS}`}>
              <Button>Sign Up</Button>
            </NavLink>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              id="landing-mobile-nav"
              className="mt-4 rounded-lg border border-border-card bg-surface-card px-5 py-4 shadow-card md:hidden"
              initial={reduce ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 1 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col gap-3">
                {PAGE_LINKS.map((link) => (
                  <NavItem key={link.to} to={link.to} onNavigate={closeMenu}>
                    {link.label}
                  </NavItem>
                ))}
                {onHowToPlay &&
                  HASH_LINKS.map((link) => (
                    <NavItem key={link.to} to={link.to} onNavigate={closeMenu}>
                      {link.label}
                    </NavItem>
                  ))}
                <div className="my-1 border-t border-border-card" />
                <NavLink to="/login" onClick={closeMenu} className={`py-2 font-outfit text-sm text-text-muted ${FOCUS}`}>
                  Log In
                </NavLink>
                <NavLink to="/signup" onClick={closeMenu}>
                  <Button className="w-full">Sign Up</Button>
                </NavLink>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </nav>
  );
});

export default Navbar;
