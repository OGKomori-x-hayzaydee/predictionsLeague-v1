import React from "react";
import { Box, Container, Flex } from "@radix-ui/themes";
import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box className="bg-gradient-to-b  from-primary-500 to-primary-600 text-white font-outfit">
      <Container size="3" className="pt-2 pb-8">

        {/* copyright */}
        <motion.div 
          className="border-t border-white/10 mt-3 pt-6 text-center text-white/50 text-xs"
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