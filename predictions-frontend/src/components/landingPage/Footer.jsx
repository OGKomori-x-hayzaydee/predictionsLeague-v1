import React from "react";
import { Container } from "@radix-ui/themes";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../../assets/logo.png";

const footerSections = [
  {
    title: "Quick Links",
    links: [
      { text: "Home", url: "/" },
      { text: "How to Play", url: "/howToPlay" },
      { text: "Log In", url: "/login" },
      { text: "Sign Up", url: "/signup" },
    ],
  },
  {
    title: "Legal",
    links: [
      { text: "Terms of Service", url: "/terms-of-service" },
      { text: "Privacy Policy", url: "/privacy-policy" },
    ],
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-100 dark:bg-primary-800 text-light-text dark:text-white font-outfit transition-colors duration-300">
      <Container size="4" className="px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo and tagline */}
          <div className="lg:col-span-2 space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Link to="/" className="inline-flex items-center gap-3">
                <img
                  src={logo}
                  alt="Predictions League Logo"
                  className="h-7"
                />
                <h2 className="text-teal-light dark:text-teal-100 text-2xl font-bold font-dmSerif">
                  predictionsLeague
                </h2>
              </Link>
              <p className="text-light-text-secondary dark:text-slate-400 mt-3 text-sm max-w-sm leading-relaxed">
                The ultimate Premier League prediction game. Focused on the Big
                Six. Built for fans who know their football.
              </p>
            </motion.div>
          </div>

          {/* Link sections */}
          {footerSections.map((section, index) => (
            <motion.div
              key={section.title}
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              viewport={{ once: true }}
            >
              <h3 className="text-teal-light dark:text-teal-dark font-semibold text-sm uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.text}>
                    <Link
                      to={link.url}
                      className="text-light-text-secondary dark:text-slate-400 hover:text-teal-light dark:hover:text-teal-dark transition-colors duration-200 text-sm"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom bar */}
        <motion.div
          className="border-t border-slate-200 dark:border-white/10 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-light-text-secondary dark:text-slate-500 text-xs"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p>&copy; {currentYear} OGKomori x hayzaydee. All rights reserved.</p>
          <p>Made with passion for football.</p>
        </motion.div>
      </Container>
    </footer>
  );
}
