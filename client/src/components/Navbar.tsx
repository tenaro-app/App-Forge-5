import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, Code, Zap, Package, BarChart, Database, Upload, Lock, Users, FileCheck, Layers } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Close the side menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const sideMenu = document.getElementById('side-menu');
      const toggleButton = document.getElementById('toggle-menu');
      
      if (sideMenu && 
          toggleButton && 
          !sideMenu.contains(event.target as Node) && 
          !toggleButton.contains(event.target as Node)) {
        setSideMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Lock body scroll when side menu is open
  useEffect(() => {
    if (sideMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sideMenuOpen]);

  const toggleSideMenu = () => {
    setSideMenuOpen(!sideMenuOpen);
  };

  const closeSideMenu = () => {
    setSideMenuOpen(false);
  };

  const toggleDropdown = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const navbarClasses = cn(
    "sticky top-0 z-50 transition-shadow duration-300",
    scrolled ? "shadow-lg bg-white" : "bg-secondary text-white"
  );
  
  const solutionsItems = [
    { icon: <Code className="w-5 h-5 text-primary" />, title: "Custom App Development", description: "Bespoke solutions tailored to your exact needs" },
    { icon: <Zap className="w-5 h-5 text-primary" />, title: "Process Automation", description: "Streamline repetitive tasks and workflows" },
    { icon: <Database className="w-5 h-5 text-primary" />, title: "Database Solutions", description: "Robust data architecture and management" },
    { icon: <BarChart className="w-5 h-5 text-primary" />, title: "Business Intelligence", description: "Data-driven insights and visualization" },
    { icon: <Package className="w-5 h-5 text-primary" />, title: "API Integration", description: "Connect your systems and applications" },
    { icon: <Upload className="w-5 h-5 text-primary" />, title: "Cloud Migration", description: "Modernize your infrastructure" },
    { icon: <Lock className="w-5 h-5 text-primary" />, title: "Secure Applications", description: "Enterprise-grade security implementations" },
    { icon: <Users className="w-5 h-5 text-primary" />, title: "User Experience Design", description: "Intuitive interfaces that users love" },
    { icon: <Layers className="w-5 h-5 text-primary" />, title: "Microservices Architecture", description: "Scalable, flexible application design" }
  ];

  const navItems = [
    { href: "#solutions", label: "Solutions", hasDropdown: true, dropdownId: "solutions" },
    { href: "#industries", label: "Industries", hasDropdown: true, dropdownId: "industries" },
    { href: "#case-studies", label: "Success Stories", hasDropdown: false },
    { href: "#technologies", label: "Technologies", hasDropdown: true, dropdownId: "technologies" },
    { href: "#pricing", label: "Pricing", hasDropdown: false },
    { href: "#about", label: "Our Team", hasDropdown: false },
  ];

  const sideVariants = {
    closed: {
      x: '100%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    open: {
      x: '0%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  };

  return (
    <nav className={navbarClasses}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link href="/" onClick={closeSideMenu} className="flex items-center space-x-2 z-10">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                <span className="text-white font-bold text-xl">AF</span>
              </div>
              <span className={`text-2xl font-heading font-bold ${scrolled ? 'text-dark-600' : 'text-white'}`}>AppForge</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => (
              <div key={item.href} className="relative group" ref={el => { dropdownRefs.current[item.dropdownId || ''] = el }}>
                {item.hasDropdown ? (
                  <button 
                    className={`flex items-center text-sm font-medium space-x-1 py-2 ${scrolled ? 'text-gray-800 hover:text-primary' : 'text-white hover:text-primary-100'} transition-colors`}
                    onClick={() => toggleDropdown(item.dropdownId || '')}
                  >
                    <span>{item.label}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === item.dropdownId ? 'rotate-180' : ''}`} />
                  </button>
                ) : (
                  <a 
                    href={item.href}
                    className={`text-sm font-medium py-2 ${scrolled ? 'text-gray-800 hover:text-primary' : 'text-white hover:text-primary-100'} transition-colors`}
                  >
                    {item.label}
                  </a>
                )}

                {/* Mega Menu Dropdown */}
                {item.hasDropdown && item.dropdownId === "solutions" && activeDropdown === "solutions" && (
                  <div className="absolute top-full left-0 z-50 w-[600px] bg-white rounded-lg shadow-xl border border-gray-200 p-6 mt-2 grid grid-cols-3 gap-4">
                    {solutionsItems.map((solution, index) => (
                      <div key={index} className="group">
                        <a href="#solutions" className="block group-hover:bg-gray-50 p-3 rounded-lg transition-colors">
                          <div className="flex items-start">
                            <div className="flex-shrink-0">{solution.icon}</div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">{solution.title}</p>
                              <p className="mt-1 text-xs text-gray-500">{solution.description}</p>
                            </div>
                          </div>
                        </a>
                      </div>
                    ))}
                  </div>
                )}

                {item.hasDropdown && item.dropdownId === "industries" && activeDropdown === "industries" && (
                  <div className="absolute top-full left-0 z-50 w-[650px] bg-white rounded-lg shadow-xl border border-gray-200 p-4 mt-2">
                    <div className="grid grid-cols-3 gap-3">
                      <a href="#industries" className="p-3 hover:bg-gray-50 rounded-lg group transition-colors">
                        <div className="font-medium text-sm text-gray-900 group-hover:text-primary">E-commerce & Retail</div>
                        <div className="text-xs text-gray-500 mt-1">Inventory and order management</div>
                      </a>
                      <a href="#industries" className="p-3 hover:bg-gray-50 rounded-lg group transition-colors">
                        <div className="font-medium text-sm text-gray-900 group-hover:text-primary">Healthcare</div>
                        <div className="text-xs text-gray-500 mt-1">Patient management systems</div>
                      </a>
                      <a href="#industries" className="p-3 hover:bg-gray-50 rounded-lg group transition-colors">
                        <div className="font-medium text-sm text-gray-900 group-hover:text-primary">Professional Services</div>
                        <div className="text-xs text-gray-500 mt-1">Client and project tracking</div>
                      </a>
                      <a href="#industries" className="p-3 hover:bg-gray-50 rounded-lg group transition-colors">
                        <div className="font-medium text-sm text-gray-900 group-hover:text-primary">Real Estate</div>
                        <div className="text-xs text-gray-500 mt-1">Property and tenant management</div>
                      </a>
                      <a href="#industries" className="p-3 hover:bg-gray-50 rounded-lg group transition-colors">
                        <div className="font-medium text-sm text-gray-900 group-hover:text-primary">Education</div>
                        <div className="text-xs text-gray-500 mt-1">Student information systems</div>
                      </a>
                      <a href="#industries" className="p-3 hover:bg-gray-50 rounded-lg group transition-colors">
                        <div className="font-medium text-sm text-gray-900 group-hover:text-primary">Manufacturing</div>
                        <div className="text-xs text-gray-500 mt-1">Inventory and production tracking</div>
                      </a>
                      <a href="#industries" className="p-3 hover:bg-gray-50 rounded-lg group transition-colors">
                        <div className="font-medium text-sm text-gray-900 group-hover:text-primary">Small Retail</div>
                        <div className="text-xs text-gray-500 mt-1">Point of sale and inventory solutions</div>
                      </a>
                      <a href="#industries" className="p-3 hover:bg-gray-50 rounded-lg group transition-colors">
                        <div className="font-medium text-sm text-gray-900 group-hover:text-primary">Food Service</div>
                        <div className="text-xs text-gray-500 mt-1">Order management and scheduling</div>
                      </a>
                      <a href="#industries" className="p-3 hover:bg-gray-50 rounded-lg group transition-colors">
                        <div className="font-medium text-sm text-gray-900 group-hover:text-primary">Home Services</div>
                        <div className="text-xs text-gray-500 mt-1">Job scheduling and client management</div>
                      </a>
                    </div>
                  </div>
                )}

                {item.hasDropdown && item.dropdownId === "technologies" && activeDropdown === "technologies" && (
                  <div className="absolute top-full right-0 z-50 w-[500px] bg-white rounded-lg shadow-xl border border-gray-200 p-4 mt-2">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h4 className="font-bold text-sm text-primary mb-2">Frontend</h4>
                        <ul className="space-y-1">
                          <li className="text-xs text-gray-700">React.js</li>
                          <li className="text-xs text-gray-700">Vue.js</li>
                          <li className="text-xs text-gray-700">Next.js</li>
                          <li className="text-xs text-gray-700">Tailwind CSS</li>
                        </ul>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h4 className="font-bold text-sm text-primary mb-2">Backend</h4>
                        <ul className="space-y-1">
                          <li className="text-xs text-gray-700">Node.js</li>
                          <li className="text-xs text-gray-700">Python</li>
                          <li className="text-xs text-gray-700">Ruby</li>
                          <li className="text-xs text-gray-700">PHP</li>
                        </ul>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h4 className="font-bold text-sm text-primary mb-2">Database</h4>
                        <ul className="space-y-1">
                          <li className="text-xs text-gray-700">PostgreSQL</li>
                          <li className="text-xs text-gray-700">MongoDB</li>
                          <li className="text-xs text-gray-700">MySQL</li>
                          <li className="text-xs text-gray-700">Redis</li>
                        </ul>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h4 className="font-bold text-sm text-primary mb-2">Mobile</h4>
                        <ul className="space-y-1">
                          <li className="text-xs text-gray-700">React Native</li>
                          <li className="text-xs text-gray-700">Flutter</li>
                          <li className="text-xs text-gray-700">Swift</li>
                          <li className="text-xs text-gray-700">Kotlin</li>
                        </ul>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h4 className="font-bold text-sm text-primary mb-2">DevOps</h4>
                        <ul className="space-y-1">
                          <li className="text-xs text-gray-700">Docker</li>
                          <li className="text-xs text-gray-700">Kubernetes</li>
                          <li className="text-xs text-gray-700">CI/CD</li>
                          <li className="text-xs text-gray-700">AWS/GCP/Azure</li>
                        </ul>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h4 className="font-bold text-sm text-primary mb-2">Tools</h4>
                        <ul className="space-y-1">
                          <li className="text-xs text-gray-700">Git</li>
                          <li className="text-xs text-gray-700">Jira</li>
                          <li className="text-xs text-gray-700">Figma</li>
                          <li className="text-xs text-gray-700">Postman</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            <a 
              href="#contact" 
              className="px-5 py-2.5 rounded-lg text-primary font-medium text-sm border-2 border-primary hover:bg-primary/10 transition-colors shadow-sm hover:shadow"
            >
              Contact Us
            </a>
            <a 
              href="#login" 
              className="px-5 py-2.5 rounded-lg bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg transform hover:translate-y-[-2px]"
            >
              Client Login
            </a>
          </div>

          {/* Hamburger Menu Button */}
          <div className="lg:hidden">
            <button 
              id="toggle-menu"
              className={`${scrolled ? 'text-gray-800' : 'text-white'} focus:outline-none`}
              onClick={toggleSideMenu}
              aria-label={sideMenuOpen ? "Close menu" : "Open menu"}
            >
              <Menu className="w-7 h-7" />
            </button>
          </div>
        </div>
      </div>

      {/* Overlay when side menu is open */}
      <AnimatePresence>
        {sideMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black z-40"
            onClick={closeSideMenu}
          />
        )}
      </AnimatePresence>

      {/* Side Menu */}
      <motion.div 
        id="side-menu"
        className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 overflow-y-auto"
        variants={sideVariants}
        initial="closed"
        animate={sideMenuOpen ? "open" : "closed"}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">AF</span>
              </div>
              <span className="text-xl font-heading font-bold text-dark-600">AppForge</span>
            </div>
            <button className="text-gray-500" onClick={closeSideMenu}>
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="space-y-4">
            {navItems.map((item) => (
              <div key={item.href}>
                {item.hasDropdown ? (
                  <div>
                    <button 
                      className="flex items-center justify-between w-full py-2 text-sm font-medium text-gray-800"
                      onClick={() => toggleDropdown(item.dropdownId || '')}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === item.dropdownId ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Side Menu Dropdown Content */}
                    {item.dropdownId === "solutions" && activeDropdown === "solutions" && (
                      <div className="pl-4 space-y-2 mt-2">
                        {solutionsItems.map((solution, index) => (
                          <a 
                            key={index} 
                            href="#solutions" 
                            className="flex items-start py-2 hover:text-primary transition-colors"
                            onClick={closeSideMenu}
                          >
                            <div className="flex-shrink-0 mr-2">{solution.icon}</div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{solution.title}</p>
                              <p className="text-xs text-gray-500">{solution.description}</p>
                            </div>
                          </a>
                        ))}
                      </div>
                    )}
                    
                    {item.dropdownId === "industries" && activeDropdown === "industries" && (
                      <div className="pl-4 space-y-2 mt-2">
                        <a href="#industries" className="block py-2 text-sm hover:text-primary transition-colors" onClick={closeSideMenu}>E-commerce & Retail</a>
                        <a href="#industries" className="block py-2 text-sm hover:text-primary transition-colors" onClick={closeSideMenu}>Healthcare</a>
                        <a href="#industries" className="block py-2 text-sm hover:text-primary transition-colors" onClick={closeSideMenu}>Professional Services</a>
                        <a href="#industries" className="block py-2 text-sm hover:text-primary transition-colors" onClick={closeSideMenu}>Real Estate</a>
                        <a href="#industries" className="block py-2 text-sm hover:text-primary transition-colors" onClick={closeSideMenu}>Education</a>
                        <a href="#industries" className="block py-2 text-sm hover:text-primary transition-colors" onClick={closeSideMenu}>Manufacturing</a>
                      </div>
                    )}
                    
                    {item.dropdownId === "technologies" && activeDropdown === "technologies" && (
                      <div className="pl-4 space-y-3 mt-2">
                        <div>
                          <h4 className="font-bold text-sm text-primary">Frontend</h4>
                          <div className="grid grid-cols-2 gap-1 mt-1">
                            <span className="text-xs text-gray-700">React.js</span>
                            <span className="text-xs text-gray-700">Vue.js</span>
                            <span className="text-xs text-gray-700">Next.js</span>
                            <span className="text-xs text-gray-700">Tailwind CSS</span>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-primary">Backend</h4>
                          <div className="grid grid-cols-2 gap-1 mt-1">
                            <span className="text-xs text-gray-700">Node.js</span>
                            <span className="text-xs text-gray-700">Python</span>
                            <span className="text-xs text-gray-700">Ruby</span>
                            <span className="text-xs text-gray-700">PHP</span>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-primary">Database</h4>
                          <div className="grid grid-cols-2 gap-1 mt-1">
                            <span className="text-xs text-gray-700">PostgreSQL</span>
                            <span className="text-xs text-gray-700">MongoDB</span>
                            <span className="text-xs text-gray-700">MySQL</span>
                            <span className="text-xs text-gray-700">Redis</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <a 
                    href={item.href}
                    className="block py-2 text-sm font-medium text-gray-800 hover:text-primary transition-colors"
                    onClick={closeSideMenu}
                  >
                    {item.label}
                  </a>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-8 space-y-3">
            <a 
              href="#contact" 
              className="block w-full px-4 py-2 text-center rounded-lg text-primary font-medium text-sm border-2 border-primary hover:bg-primary/10 transition-colors"
              onClick={closeSideMenu}
            >
              Contact Us
            </a>
            <a 
              href="#demo" 
              className="block w-full px-4 py-2 text-center rounded-lg bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-colors"
              onClick={closeSideMenu}
            >
              Request Demo
            </a>
          </div>
        </div>
      </motion.div>
    </nav>
  );
}
