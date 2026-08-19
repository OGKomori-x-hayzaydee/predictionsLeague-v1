import React from "react";
import { Box, Container, Flex } from "@radix-ui/themes";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const footerSections = [
    {
      title: "quick links",
      links: [
        { text: "home", url: "/" },
        { text: "predictions", url: "/predictions" },
        { text: "leaderboard", url: "/leaderboard" },
        { text: "how to play", url: "/how-to-play" },
      ],
    },
    {
      title: "resources",
      links: [
        { text: "FAQ", url: "/faq" },
        { text: "rules", url: "/rules" },
        { text: "support", url: "/support" },
        { text: "blog", url: "/blog" },
      ],
    },
    {
      title: "legal",
      links: [
        { text: "terms of service", url: "/terms-of-service" },
        { text: "privacy policy", url: "/privacy-policy" },
        { text: "cookie policy", url: "/cookie-policy" },
      ],
    },
  ];

  return (
    <Box className="bg-gradient-to-b  from-primary-500 to-primary-600 text-white font-outfit">
      <Container size="3" className="pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo and tagline */}
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Link to="/" className="inline-block">
                <h2 className="text-teal-100 text-2xl font-bold font-dmSerif">
                  predictionsLeague
                </h2>
              </Link>
              <p className="text-white/70 mt-3 text-sm">
                the ultimate Premier League prediction game.
              </p>
            </motion.div>
          </div>

          {/* Quick Links, Resources, Legal */}
          {footerSections.map((section, index) => (
            <motion.div 
              key={index} 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              viewport={{ once: true }}
            >
              <h3 className="text-teal-300 font-bold mb-3 text-lg font-dmSerif">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <Link
                      to={link.url}
                      className="text-white/70 hover:text-teal-200 transition-colors duration-200 text-sm"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom bar with copyright */}
        <motion.div 
          className="border-t border-white/10 mt-12 pt-6 text-center text-white/50 text-xs"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p>© {currentYear} OGKomori x hayzaydee. all rights reserved.</p>
        </motion.div>
      </Container>
    </Box>
  );
}