import dynamic from "next/dynamic";
import ContactHeroSection from "./ContactHeroSection";

// // Lazy load heavy sections
const ContactMainSection = dynamic(() => import("./ContactMainSection"));

const ContactUs = () => {
  return (
    <>
      <ContactHeroSection />
      <ContactMainSection />
    </>
  );
};

export default ContactUs;
