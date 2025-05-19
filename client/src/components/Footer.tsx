import { Facebook, Instagram, Linkedin, Twitter, Mail, MapPin, Phone, ArrowRight, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { solutionsData, industriesData } from "@/lib/data";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-black text-gray-400 pt-16 pb-8 relative overflow-hidden">
      {/* Diagonal Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '24px 24px'
        }}></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Contact Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 pb-16 border-b border-gray-800">
          <div className="flex items-start">
            <div className="bg-primary/20 p-3 rounded-xl mr-4">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-white font-bold mb-2">Our Location</h3>
              <p className="text-gray-400">123 Innovation Drive<br />Tech Valley, CA 94103</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-primary/20 p-3 rounded-xl mr-4">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-white font-bold mb-2">Email Us</h3>
              <p className="text-gray-400">hello@appforge.dev<br />support@appforge.dev</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-primary/20 p-3 rounded-xl mr-4">
              <Phone className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-white font-bold mb-2">Call Us</h3>
              <p className="text-gray-400">(555) 123-4567<br />Mon-Fri, 9am-6pm PST</p>
            </div>
          </div>
        </div>
        
        {/* Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-12">
          {/* Company Info */}
          <div className="md:col-span-4">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">A</span>
              </div>
              <span className="text-2xl font-heading font-bold text-white">AppForge</span>
            </Link>
            <p className="mb-8 text-gray-300 text-lg">
              We build custom business automation solutions that eliminate repetitive tasks, reduce operating costs, and drive unprecedented growth.
            </p>
            <div className="flex space-x-4 mb-8">
              <a href="#" className="bg-white/10 hover:bg-primary text-white p-3 rounded-full transition-all duration-300 hover:scale-110">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="bg-white/10 hover:bg-primary text-white p-3 rounded-full transition-all duration-300 hover:scale-110">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-white/10 hover:bg-primary text-white p-3 rounded-full transition-all duration-300 hover:scale-110">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-white/10 hover:bg-primary text-white p-3 rounded-full transition-all duration-300 hover:scale-110">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
            <div className="bg-gradient-to-r from-primary/20 to-primary/5 p-6 rounded-xl">
              <h4 className="text-white font-bold mb-2">Ready to get started?</h4>
              <p className="text-gray-300 mb-4">Book your free consultation now!</p>
              <a 
                href="#contact"
                className="flex items-center justify-between font-medium text-white bg-primary px-5 py-3 rounded-lg hover:bg-white hover:text-primary transition-all duration-300"
              >
                <span>Contact Us</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="md:col-span-2">
            <h3 className="text-white font-bold text-xl mb-6 pb-2 border-b border-primary/30">Company</h3>
            <ul className="space-y-3">
              <li>
                <a href="#about" className="flex items-center text-gray-300 hover:text-primary transition-colors">
                  <ChevronRight className="h-4 w-4 mr-1 text-primary" />
                  <span>About Us</span>
                </a>
              </li>
              <li>
                <a href="#team" className="flex items-center text-gray-300 hover:text-primary transition-colors">
                  <ChevronRight className="h-4 w-4 mr-1 text-primary" />
                  <span>Our Team</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-gray-300 hover:text-primary transition-colors">
                  <ChevronRight className="h-4 w-4 mr-1 text-primary" />
                  <span>Careers</span>
                </a>
              </li>
              <li>
                <a href="#testimonials" className="flex items-center text-gray-300 hover:text-primary transition-colors">
                  <ChevronRight className="h-4 w-4 mr-1 text-primary" />
                  <span>Testimonials</span>
                </a>
              </li>
              <li>
                <a href="#faq" className="flex items-center text-gray-300 hover:text-primary transition-colors">
                  <ChevronRight className="h-4 w-4 mr-1 text-primary" />
                  <span>FAQ</span>
                </a>
              </li>
            </ul>
          </div>
          
          {/* Solutions */}
          <div className="md:col-span-3">
            <h3 className="text-white font-bold text-xl mb-6 pb-2 border-b border-primary/30">Solutions</h3>
            <ul className="space-y-3">
              {solutionsData.slice(0, 6).map((solution, index) => (
                <li key={index}>
                  <a href="#solutions" className="flex items-center text-gray-300 hover:text-primary transition-colors">
                    <ChevronRight className="h-4 w-4 mr-1 text-primary" />
                    <span>{solution.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Industries */}
          <div className="md:col-span-3">
            <h3 className="text-white font-bold text-xl mb-6 pb-2 border-b border-primary/30">Industries</h3>
            <ul className="space-y-3">
              {industriesData.slice(0, 6).map((industry, index) => (
                <li key={index}>
                  <a href="#industries" className="flex items-center text-gray-300 hover:text-primary transition-colors">
                    <ChevronRight className="h-4 w-4 mr-1 text-primary" />
                    <span>{industry.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300">© {currentYear} <span className="text-primary font-bold">AppForge</span>. All rights reserved.</p>
          <div className="mt-6 md:mt-0 space-x-6">
            <a href="#" className="text-gray-300 hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-300 hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-300 hover:text-primary transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
