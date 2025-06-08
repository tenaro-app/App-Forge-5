import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, Code, Zap, Package, BarChart, Database, Upload, Lock, Users, FileCheck, Layers, User } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const { user, isAuthenticated, isLoading } = useAuth();
  const [location, setLocation] = useLocation();

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
            <div 
              onClick={() => { 
                window.location.href = '/'; 
                closeSideMenu(); 
              }} 
              className="flex items-center space-x-2 z-10 cursor-pointer"
            >
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                <span className="text-white font-bold text-xl">AF</span>
              </div>
              <span className={`text-2xl font-heading font-bold ${scrolled ? 'text-dark-600' : 'text-white'}`}>AppForge</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => (
              <div key={item.href} className="relative group" ref={el => { dropdownRefs.current[item.dropdownId || ''] = el }}>
                {item.hasDropdown ? (
                  <button 
                    className={`flex items-center text-sm font-medium space-x-1 py-2 relative ${scrolled ? 'text-gray-800 hover:text-primary' : 'text-white hover:text-primary-100'} transition-all duration-300 ease-out group`}
                    onClick={() => toggleDropdown(item.dropdownId || '')}
                  >
                    <span className="group-hover:translate-y-[-1px] transition-transform duration-300">{item.label}</span>
                    <ChevronDown className={`w-4 h-4 transition-all duration-300 ${activeDropdown === item.dropdownId ? 'rotate-180' : 'group-hover:translate-y-[1px]'}`} />
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                  </button>
                ) : (
                  <div 
                    onClick={() => { window.location.href = item.href || '#'; }}
                    className={`text-sm font-medium py-2 relative inline-block ${scrolled ? 'text-gray-800 hover:text-primary' : 'text-white hover:text-primary-100'} transition-all duration-300 group cursor-pointer`}
                  >
                    <span className="group-hover:translate-y-[-1px] transition-transform duration-300 inline-block">{item.label}</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                  </div>
                )}

                {/* Mega Menu Dropdown */}
                {item.hasDropdown && item.dropdownId === "solutions" && activeDropdown === "solutions" && (
                  <div className="absolute top-full left-0 z-50 w-[600px] bg-white rounded-lg shadow-xl border border-gray-200 p-6 mt-2 grid grid-cols-3 gap-4">
                    {solutionsItems.map((solution, index) => (
                      <div key={index} className="group">
                        <div 
                          onClick={() => {
                            window.location.href = "#solutions";
                            toggleDropdown("solutions");
                          }} 
                          className="block p-3 rounded-lg transition-all duration-300 hover:shadow-md group-hover:bg-gray-50 transform group-hover:translate-y-[-2px] cursor-pointer"
                        >
                          <div className="flex items-start">
                            <div className="flex-shrink-0 text-primary opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">{solution.icon}</div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900 group-hover:text-primary transition-colors duration-300">{solution.title}</p>
                              <p className="mt-1 text-xs text-gray-500 group-hover:text-gray-700 transition-colors duration-300">{solution.description}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {item.hasDropdown && item.dropdownId === "industries" && activeDropdown === "industries" && (
                  <div className="absolute top-full left-0 z-50 w-[650px] bg-white rounded-lg shadow-xl border border-gray-200 p-4 mt-2">
                    <div className="grid grid-cols-3 gap-3">
                      <div 
                        onClick={() => {
                          window.location.href = "#industries";
                          toggleDropdown("industries");
                        }}
                        className="p-3 rounded-lg group transition-all duration-300 hover:bg-gray-50 hover:shadow-md transform hover:-translate-y-1 cursor-pointer"
                      >
                        <div className="font-medium text-sm text-gray-900 group-hover:text-primary transition-colors duration-300">E-commerce & Retail</div>
                        <div className="text-xs text-gray-500 mt-1 group-hover:text-gray-700 transition-colors duration-300">Inventory and order management</div>
                      </div>
                      <div 
                        onClick={() => {
                          window.location.href = "#industries";
                          toggleDropdown("industries");
                        }}
                        className="p-3 rounded-lg group transition-all duration-300 hover:bg-gray-50 hover:shadow-md transform hover:-translate-y-1 cursor-pointer"
                      >
                        <div className="font-medium text-sm text-gray-900 group-hover:text-primary transition-colors duration-300">Healthcare</div>
                        <div className="text-xs text-gray-500 mt-1 group-hover:text-gray-700 transition-colors duration-300">Patient management systems</div>
                      </div>
                      <div 
                        onClick={() => {
                          window.location.href = "#industries";
                          toggleDropdown("industries");
                        }}
                        className="p-3 rounded-lg group transition-all duration-300 hover:bg-gray-50 hover:shadow-md transform hover:-translate-y-1 cursor-pointer"
                      >
                        <div className="font-medium text-sm text-gray-900 group-hover:text-primary transition-colors duration-300">Professional Services</div>
                        <div className="text-xs text-gray-500 mt-1 group-hover:text-gray-700 transition-colors duration-300">Client and project tracking</div>
                      </div>
                      <div 
                        onClick={() => {
                          window.location.href = "#industries";
                          toggleDropdown("industries");
                        }}
                        className="p-3 rounded-lg group transition-all duration-300 hover:bg-gray-50 hover:shadow-md transform hover:-translate-y-1 cursor-pointer"
                      >
                        <div className="font-medium text-sm text-gray-900 group-hover:text-primary transition-colors duration-300">Real Estate</div>
                        <div className="text-xs text-gray-500 mt-1 group-hover:text-gray-700 transition-colors duration-300">Property and tenant management</div>
                      </div>
                      <div 
                        onClick={() => {
                          window.location.href = "#industries";
                          toggleDropdown("industries");
                        }}
                        className="p-3 rounded-lg group transition-all duration-300 hover:bg-gray-50 hover:shadow-md transform hover:-translate-y-1 cursor-pointer"
                      >
                        <div className="font-medium text-sm text-gray-900 group-hover:text-primary transition-colors duration-300">Education</div>
                        <div className="text-xs text-gray-500 mt-1 group-hover:text-gray-700 transition-colors duration-300">Student information systems</div>
                      </div>
                      <div 
                        onClick={() => {
                          window.location.href = "#industries";
                          toggleDropdown("industries");
                        }}
                        className="p-3 rounded-lg group transition-all duration-300 hover:bg-gray-50 hover:shadow-md transform hover:-translate-y-1 cursor-pointer"
                      >
                        <div className="font-medium text-sm text-gray-900 group-hover:text-primary transition-colors duration-300">Manufacturing</div>
                        <div className="text-xs text-gray-500 mt-1 group-hover:text-gray-700 transition-colors duration-300">Inventory and production tracking</div>
                      </div>
                      <div 
                        onClick={() => {
                          window.location.href = "#industries";
                          toggleDropdown("industries");
                        }}
                        className="p-3 rounded-lg group transition-all duration-300 hover:bg-gray-50 hover:shadow-md transform hover:-translate-y-1 cursor-pointer"
                      >
                        <div className="font-medium text-sm text-gray-900 group-hover:text-primary transition-colors duration-300">Small Retail</div>
                        <div className="text-xs text-gray-500 mt-1 group-hover:text-gray-700 transition-colors duration-300">Point of sale and inventory solutions</div>
                      </div>
                      <div 
                        onClick={() => {
                          window.location.href = "#industries";
                          toggleDropdown("industries");
                        }}
                        className="p-3 rounded-lg group transition-all duration-300 hover:bg-gray-50 hover:shadow-md transform hover:-translate-y-1 cursor-pointer"
                      >
                        <div className="font-medium text-sm text-gray-900 group-hover:text-primary transition-colors duration-300">Food Service</div>
                        <div className="text-xs text-gray-500 mt-1 group-hover:text-gray-700 transition-colors duration-300">Order management and scheduling</div>
                      </div>
                      <div 
                        onClick={() => {
                          window.location.href = "#industries";
                          toggleDropdown("industries");
                        }}
                        className="p-3 rounded-lg group transition-all duration-300 hover:bg-gray-50 hover:shadow-md transform hover:-translate-y-1 cursor-pointer"
                      >
                        <div className="font-medium text-sm text-gray-900 group-hover:text-primary transition-colors duration-300">Home Services</div>
                        <div className="text-xs text-gray-500 mt-1 group-hover:text-gray-700 transition-colors duration-300">Job scheduling and client management</div>
                      </div>
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
              className="px-5 py-2.5 rounded-lg text-primary font-medium text-sm border-2 border-primary hover:bg-primary/10 transition-all duration-300 shadow-sm hover:shadow group relative overflow-hidden"
            >
              <span className="relative z-10 group-hover:translate-y-[-1px] transition-transform duration-300">Contact Us</span>
              <span className="absolute bottom-0 left-0 w-full h-0 bg-primary/5 transition-all duration-300 group-hover:h-full"></span>
            </a>
            {isLoading ? (
              <div className="w-28 h-10 rounded-lg bg-gray-200 animate-pulse"></div>
            ) : isAuthenticated ? (
              <div className="relative group">
                <button 
                  onClick={() => toggleDropdown('user')}
                  className="px-5 py-2.5 rounded-lg border-2 border-primary text-primary font-medium text-sm transition-all duration-300 shadow hover:bg-primary/10 transform hover:-translate-y-1 group relative overflow-hidden flex items-center space-x-2"
                >
                  {user?.profileImageUrl ? (
                    <img 
                      src={user.profileImageUrl} 
                      alt={user.firstName || 'User'} 
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="w-3 h-3 text-primary" />
                    </div>
                  )}
                  <span className="relative z-10">
                    {user?.firstName || 'Dashboard'}
                  </span>
                </button>
                
                {activeDropdown === 'user' && (
                  <div className="absolute top-full right-0 z-50 w-48 bg-white rounded-lg shadow-xl border border-gray-200 p-2 mt-2">
                    <Link href="/dashboard">
                      <a onClick={() => setActiveDropdown(null)} className="block w-full text-left px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition-colors">
                        Dashboard
                      </a>
                    </Link>
                    <Link href="/chat">
                      <a onClick={() => setActiveDropdown(null)} className="block w-full text-left px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition-colors">
                        Support Chat
                      </a>
                    </Link>
                    <div className="my-1 border-t border-gray-200"></div>
                    <a 
                      href="/api/logout"
                      className="block w-full text-left px-3 py-2 text-sm text-red-600 rounded-md hover:bg-red-50 transition-colors"
                    >
                      Logout
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={() => setLocation("/auth")}
                className="px-5 py-2.5 rounded-lg bg-primary text-white font-medium text-sm transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <span className="group-hover:translate-x-[-1px] transition-transform duration-300">Client Login</span>
                  <svg className="w-0 h-4 ml-0 group-hover:w-4 group-hover:ml-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 group-hover:scale-110 transition-transform duration-500 ease-out"></span>
              </button>
            )}
          </div>

          {/* Hamburger Menu Button */}
          <div className="lg:hidden">
            <button 
              id="toggle-menu"
              className={`${scrolled ? 'text-gray-800' : 'text-white'} focus:outline-none group relative p-2 -m-2 transition-all duration-300`}
              onClick={toggleSideMenu}
              aria-label={sideMenuOpen ? "Close menu" : "Open menu"}
            >
              <Menu className="w-7 h-7 transition-all duration-300 transform group-hover:scale-110" />
              <span className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 rounded-full transform scale-0 group-hover:scale-100 transition-all duration-300"></span>
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
                          <div 
                            key={index} 
                            onClick={() => {
                              window.location.href = "#solutions";
                              closeSideMenu();
                            }}
                            className="flex items-start py-2 hover:text-primary transition-colors cursor-pointer"
                          >
                            <div className="flex-shrink-0 mr-2">{solution.icon}</div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{solution.title}</p>
                              <p className="text-xs text-gray-500">{solution.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {item.dropdownId === "industries" && activeDropdown === "industries" && (
                      <div className="pl-4 space-y-2 mt-2">
                        <div className="block py-2 text-sm hover:text-primary transition-colors cursor-pointer" onClick={() => { window.location.href = "#industries"; closeSideMenu(); }}>E-commerce & Retail</div>
                        <div className="block py-2 text-sm hover:text-primary transition-colors cursor-pointer" onClick={() => { window.location.href = "#industries"; closeSideMenu(); }}>Healthcare</div>
                        <div className="block py-2 text-sm hover:text-primary transition-colors cursor-pointer" onClick={() => { window.location.href = "#industries"; closeSideMenu(); }}>Professional Services</div>
                        <div className="block py-2 text-sm hover:text-primary transition-colors cursor-pointer" onClick={() => { window.location.href = "#industries"; closeSideMenu(); }}>Real Estate</div>
                        <div className="block py-2 text-sm hover:text-primary transition-colors cursor-pointer" onClick={() => { window.location.href = "#industries"; closeSideMenu(); }}>Education</div>
                        <div className="block py-2 text-sm hover:text-primary transition-colors cursor-pointer" onClick={() => { window.location.href = "#industries"; closeSideMenu(); }}>Manufacturing</div>
                        <div className="block py-2 text-sm hover:text-primary transition-colors cursor-pointer" onClick={() => { window.location.href = "#industries"; closeSideMenu(); }}>Small Retail</div>
                        <div className="block py-2 text-sm hover:text-primary transition-colors cursor-pointer" onClick={() => { window.location.href = "#industries"; closeSideMenu(); }}>Food Service</div>
                        <div className="block py-2 text-sm hover:text-primary transition-colors cursor-pointer" onClick={() => { window.location.href = "#industries"; closeSideMenu(); }}>Home Services</div>
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
            
            {isLoading ? (
              <div className="w-full h-10 rounded-lg bg-gray-200 animate-pulse"></div>
            ) : isAuthenticated ? (
              <div className="space-y-2">
                <Link href="/dashboard">
                  <a 
                    className="flex items-center justify-center space-x-2 w-full px-4 py-2 text-center rounded-lg border-2 border-primary text-primary font-medium text-sm hover:bg-primary/10 transition-colors"
                    onClick={closeSideMenu}
                  >
                    <User className="w-4 h-4" />
                    <span>Dashboard</span>
                  </a>
                </Link>
                <Link href="/chat">
                  <a 
                    className="flex items-center justify-center space-x-2 w-full px-4 py-2 text-center rounded-lg border-2 border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-100 transition-colors"
                    onClick={closeSideMenu}
                  >
                    <span>Support Chat</span>
                  </a>
                </Link>
                <a 
                  href="/api/logout" 
                  className="block w-full px-4 py-2 text-center rounded-lg bg-red-50 text-red-600 font-medium text-sm hover:bg-red-100 transition-colors"
                  onClick={closeSideMenu}
                >
                  Logout
                </a>
              </div>
            ) : (
              <button 
                onClick={() => {
                  closeSideMenu();
                  setLocation("/login");
                }}
                className="block w-full px-4 py-2 text-center rounded-lg bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-colors"
              >
                Client Login
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </nav>
  );
}
