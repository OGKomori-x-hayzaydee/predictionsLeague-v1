import Navbar from '../components/landingPage/Navbar';
import HeroSection from '../components/landingPage/HeroSection';
import AppPreview from '../components/landingPage/AppPreview';
import HowItWorks from '../components/landingPage/HowItWorks';
import Testimonials from '../components/landingPage/Testimonials';
import Cta from '../components/landingPage/Cta';
import Footer from '../components/landingPage/Footer';

export default function Home() {
  return (
    <div className="min-h-dvh bg-surface-app text-text-primary">
      <Navbar />
      <HeroSection />
      <AppPreview />
      <HowItWorks />
      <Testimonials />
      <Cta />
      <Footer />
    </div>
  );
}
