import React, { useEffect } from "react";
import { Box, Container } from "@radix-ui/themes";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { 
  StarIcon, 
  BarChartIcon, 
  LightningBoltIcon, 
  PersonIcon, 
  UpdateIcon,
  MagicWandIcon, 
   
} from '@radix-ui/react-icons';

export default function WhyJoin() {
  // Features with Radix icons
  const features = [
    {
      title: "'Big Six' focus",
      description:
        "concentrate on the most exciting matches featuring Manchester United, Manchester City, Liverpool, Chelsea, Arsenal, and Tottenham.",
      icon: <StarIcon className="w-8 h-8" />,
    },
    {
      title: "multi-dimensional scoring",
      description:
        "earn points for correct winners, exact scores, goalscorers, and special events like clean sheets and comebacks.",
      icon: <BarChartIcon className="w-8 h-8" />,
    },
    {
      title: "strategic gameplay",
      description:
        "use special 'chips' like Double Down, Wildcard, and All-In Week to maximize your points at crucial moments.",
      icon: <LightningBoltIcon className="w-8 h-8" />,
    },
    {
      title: "private leagues",
      description:
        "create private leagues to compete with friends, family, or colleagues in your own exclusive competition.",
      icon: <PersonIcon className="w-8 h-8" />,
    },
    {
      title: "real-time updates",
      description:
        "experience the excitement of live score updates and see your points change as matches unfold.",
      icon: <UpdateIcon className="w-8 h-8" />,
    },
    {
      title: "seasonal awards",
      description:
        "compete for prestigious end-of-season awards like Prediction Champion, Oracle Award, and Goalscorer Guru.",
      icon: <MagicWandIcon className="w-8 h-8" />,
    },
  ];

  // Animation controls
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const childVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <Box className="bg-gradient-to-b from-primary-500 to-primary-600 py-24">
      <Container size="3">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-teal-100 text-4xl md:text-5xl font-bold font-dmSerif mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            why play predictionsLeague?
          </motion.h2>
          <motion.div 
            className="w-24 h-1 bg-teal-400 mx-auto mb-6"
            initial={{ width: 0 }}
            animate={{ width: "6rem" }}
            transition={{ duration: 0.8, delay: 0.6 }}
          />
          <motion.p
            className="text-white font-outfit text-lg mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            our unique approach to football predictions makes the game more
            engaging, strategic, and social than traditional prediction games.
          </motion.p>
        </motion.div>

        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={childVariants}
              whileHover={{ 
                y: -5, 
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" 
              }}
              className="bg-primary-500/60 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-primary-400/20 hover:border-teal-500/30 transition-all duration-300"
            >
              <div className="p-8">
                <motion.div 
                  className="mb-4 text-teal-300 flex justify-center items-center w-12 h-12 rounded-full bg-teal-900/50 mx-auto"
                  whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-teal-200 text-lg font-bold mb-3 font-dmSerif text-center">
                  {feature.title}
                </h3>
                <p className="text-white/80 font-outfit text-base leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
        

      </Container>
    </Box>
  );
}