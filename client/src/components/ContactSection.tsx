import { useState } from "react";
import { MapPin, Mail, Phone, MessageCircle, Building, User, Users } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, fadeIn } from "@/lib/animations";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function ContactSection() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    projectType: "",
    staffMember: "",
    message: "",
    privacy: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.firstName || !formData.email || !formData.message || !formData.privacy) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields and accept the privacy policy.",
        variant: "destructive"
      });
      return;
    }

    // Email validation
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await apiRequest("POST", "/api/contact", formData);
      
      toast({
        title: "Message sent!",
        description: "We'll be in touch with you soon.",
        variant: "default"
      });
      
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        company: "",
        projectType: "",
        staffMember: "",
        message: "",
        privacy: false
      });
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Unable to send your message. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-white relative">
      <div className="absolute left-0 right-0 h-32 bg-light-500" style={{ top: -32, zIndex: -1 }}></div>
      
      <motion.div 
        className="container mx-auto px-4 sm:px-6 lg:px-8"
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
      >
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          variants={fadeIn("up", "tween", 0.1, 1)}
        >
          <div className="inline-flex items-center justify-center mb-4">
            <div className="h-1 w-10 bg-primary mr-3"></div>
            <span className="text-sm font-bold text-primary uppercase tracking-widest font-heading">Contact Us</span>
            <div className="h-1 w-10 bg-primary ml-3"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-secondary">
            Ready to <span className="text-primary">Transform</span> Your Business?
          </h2>
          <p className="mt-6 text-xl text-gray-600">
            Let's discuss how our custom automation solutions can eliminate repetitive tasks and save you thousands of hours annually.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <motion.div 
            className="lg:col-span-2 bg-white rounded-xl p-10 shadow-xl border-2 border-gray-100"
            variants={fadeIn("right", "tween", 0.2, 1)}
          >
            <form id="contact-form" className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input 
                    type="text" 
                    id="firstName" 
                    name="firstName" 
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input 
                    type="text" 
                    id="lastName" 
                    name="lastName" 
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input 
                  type="text" 
                  id="company" 
                  name="company" 
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 mb-1">Solution type you're interested in?</label>
                  <select 
                    id="projectType" 
                    name="projectType" 
                    value={formData.projectType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  >
                    <option value="" disabled>Please select</option>
                    <option value="process-automation">Process Automation</option>
                    <option value="data-management">Data Management</option>
                    <option value="customer-management">Customer Management</option>
                    <option value="inventory-management">Inventory Management</option>
                    <option value="scheduling">Scheduling & Booking</option>
                    <option value="document-management">Document Management</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="staffMember" className="block text-sm font-medium text-gray-700 mb-1">Preferred team member to work with</label>
                  <select 
                    id="staffMember" 
                    name="staffMember" 
                    value={formData.staffMember}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  >
                    <option value="">No preference</option>
                    <option value="alex-morgan">Alex Morgan - Lead Developer</option>
                    <option value="jamie-chen">Jamie Chen - Frontend Engineer</option>
                    <option value="morgan-taylor">Morgan Taylor - Database Specialist</option>
                    <option value="riley-johnson">Riley Johnson - UX/UI Designer</option>
                    <option value="jordan-smith">Jordan Smith - Business Analyst</option>
                    <option value="casey-wilson">Casey Wilson - DevOps Engineer</option>
                    <option value="taylor-rivera">Taylor Rivera - AI Integration Specialist</option>
                    <option value="sam-patel">Sam Patel - Project Manager</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Tell us about your project *</label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows={4} 
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  required
                />
              </div>
              
              <div className="flex items-start">
                <input 
                  type="checkbox" 
                  id="privacy" 
                  name="privacy" 
                  checked={formData.privacy}
                  onChange={handleCheckboxChange}
                  className="mt-1 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                  required
                />
                <label htmlFor="privacy" className="ml-2 text-sm text-gray-600">
                  I agree to the <a href="#" className="text-primary hover:underline">Privacy Policy</a> and consent to being contacted about my inquiry. *
                </label>
              </div>
              
              <div>
                <button 
                  type="submit" 
                  className="w-full px-6 py-4 bg-primary text-white font-bold text-lg rounded-xl hover:bg-primary/90 transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-primary/30 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Start Your Transformation"}
                </button>
              </div>
            </form>
          </motion.div>
          
          <motion.div variants={fadeIn("left", "tween", 0.3, 1)}>
            <div className="bg-black rounded-xl p-8 shadow-xl mb-8 text-white">
              <h3 className="text-xl font-bold mb-6 border-b border-white/20 pb-3">Connect With Us</h3>
              
              <div className="flex items-start mb-6">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                  <MapPin className="h-6 w-6 text-primary-300" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold mb-1">Our Office</h4>
                  <p className="text-white/80">123 Innovation Way<br/>Tech District, CA 94103</p>
                </div>
              </div>
              
              <div className="flex items-start mb-6">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                  <Mail className="h-6 w-6 text-primary-300" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold mb-1">Email Us</h4>
                  <p className="text-white/80">info@appforge.io<br/>support@appforge.io</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                  <Phone className="h-6 w-6 text-primary-300" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold mb-1">Call Us</h4>
                  <p className="text-white/80">(555) 123-4567<br/>Mon-Fri, 9am-5pm PST</p>
                </div>
              </div>
            </div>
            
            <div className="bg-black rounded-xl p-8 border border-gray-700 shadow-lg text-white">
              <h3 className="text-xl font-bold font-heading mb-4 text-white">Business Hours</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-white">Monday - Friday:</span>
                  <span className="text-gray-300">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-white">Saturday:</span>
                  <span className="text-gray-300">10:00 AM - 2:00 PM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-white">Sunday:</span>
                  <span className="text-gray-300">Closed</span>
                </div>
                <div className="pt-3 mt-3 border-t border-gray-700">
                  <p className="text-sm text-gray-300">We typically respond to inquiries within 1 business day.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
