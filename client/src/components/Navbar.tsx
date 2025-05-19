import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const navbarClasses = cn(
    "sticky top-0 z-50 bg-white/90 backdrop-blur-md transition-shadow duration-300",
    scrolled ? "shadow-sm" : ""
  );

  const navItems = [
    { href: "#solutions", label: "Solutions" },
    { href: "#industries", label: "Industries" },
    { href: "#case-studies", label: "Case Studies" },
    { href: "#pricing", label: "Pricing" },
    { href: "#about", label: "About Us" },
  ];

  return (
    <nav className={navbarClasses}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link href="/" onClick={closeMobileMenu} className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="text-xl font-heading font-bold text-dark-600">AppForge</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a 
                key={item.href}
                href={item.href}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <a 
              href="#contact" 
              className="px-4 py-2 rounded-lg text-primary font-medium text-sm border border-primary hover:bg-primary/10 transition-colors"
            >
              Contact Us
            </a>
            <a 
              href="#demo" 
              className="px-4 py-2 rounded-lg bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-colors"
            >
              Request Demo
            </a>
          </div>

          <div className="md:hidden flex items-center">
            <button 
              className="text-dark-500 focus:outline-none" 
              onClick={toggleMobileMenu}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <motion.div 
        className={`md:hidden bg-white border-t ${mobileMenuOpen ? 'block' : 'hidden'}`}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: mobileMenuOpen ? 1 : 0, height: mobileMenuOpen ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto px-4 py-4 space-y-3">
          {navItems.map((item) => (
            <a 
              key={item.href}
              href={item.href}
              className="block text-sm font-medium hover:text-primary transition-colors"
              onClick={closeMobileMenu}
            >
              {item.label}
            </a>
          ))}
          <div className="pt-3 space-y-2">
            <a 
              href="#contact" 
              className="block w-full px-4 py-2 text-center rounded-lg text-primary font-medium text-sm border border-primary hover:bg-primary/10 transition-colors"
              onClick={closeMobileMenu}
            >
              Contact Us
            </a>
            <a 
              href="#demo" 
              className="block w-full px-4 py-2 text-center rounded-lg bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-colors"
              onClick={closeMobileMenu}
            >
              Request Demo
            </a>
          </div>
        </div>
      </motion.div>
    </nav>
  );
}
