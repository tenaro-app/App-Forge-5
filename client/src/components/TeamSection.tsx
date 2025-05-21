import { Code, Database, Palette, Search, PenTool, BarChart4, Cpu, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, fadeIn } from "@/lib/animations";

export default function TeamSection() {
  const teamMembersData = [
    {
      name: "Alex Morgan",
      role: "Lead Developer & Architect",
      bio: "10+ years building enterprise applications with a focus on scalable architecture and performance optimization.",
      specialties: ["Backend Systems", "API Design", "Cloud Infrastructure"],
      color: "primary"
    },
    {
      name: "Jamie Chen",
      role: "Frontend Engineer",
      bio: "Specialist in creating responsive, intuitive user interfaces with modern JavaScript frameworks and animation libraries.",
      specialties: ["React", "UI/UX Implementation", "Frontend Performance"],
      color: "orange-600"
    },
    {
      name: "Morgan Taylor",
      role: "Database Specialist",
      bio: "Expert in designing efficient database schemas and optimization strategies for high-performance applications.",
      specialties: ["Database Design", "Query Optimization", "Data Modeling"],
      color: "blue-600"
    },
    {
      name: "Riley Johnson",
      role: "UX/UI Designer",
      bio: "Creates beautiful, user-centered designs focused on conversion optimization and intuitive user journeys.",
      specialties: ["UI Design", "User Research", "Interaction Design"],
      color: "purple-600"
    },
    {
      name: "Jordan Smith",
      role: "Business Analyst",
      bio: "Translates complex business requirements into technical specifications that meet client expectations.",
      specialties: ["Requirements Gathering", "Process Mapping", "ROI Analysis"],
      color: "green-600"
    },
    {
      name: "Casey Wilson",
      role: "DevOps Engineer",
      bio: "Ensures smooth deployment pipelines and robust infrastructure for all client applications.",
      specialties: ["CI/CD", "Infrastructure", "Performance Monitoring"],
      color: "teal-600"
    },
    {
      name: "Taylor Rivera",
      role: "AI Integration Specialist",
      bio: "Implements cutting-edge AI solutions to enhance application capabilities and automate complex processes.",
      specialties: ["Machine Learning", "NLP", "Predictive Analytics"],
      color: "indigo-600"
    },
    {
      name: "Sam Patel",
      role: "Project Manager",
      bio: "Oversees project timelines and resources to ensure on-time, on-budget delivery of all client applications.",
      specialties: ["Agile Methodologies", "Resource Planning", "Client Communication"],
      color: "rose-600"
    }
  ];

  const getIconByRole = (role: string) => {
    switch (role) {
      case "Lead Developer & Architect":
        return <Code className="w-6 h-6" />;
      case "Frontend Engineer":
        return <PenTool className="w-6 h-6" />;
      case "Database Specialist":
        return <Database className="w-6 h-6" />;
      case "UX/UI Designer":
        return <Palette className="w-6 h-6" />;
      case "Business Analyst":
        return <BarChart4 className="w-6 h-6" />;
      case "DevOps Engineer":
        return <Globe className="w-6 h-6" />;
      case "AI Integration Specialist":
        return <Cpu className="w-6 h-6" />;
      case "Project Manager":
        return <Search className="w-6 h-6" />;
      default:
        return <Code className="w-6 h-6" />;
    }
  };

  return (
    <section id="about" className="py-24 bg-white relative">
      <div className="absolute left-0 right-0 h-40 bg-light-500" style={{ top: -40, zIndex: -1 }}></div>
      
      <motion.div 
        className="container mx-auto px-4 sm:px-6 lg:px-8"
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
      >
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-20"
          variants={fadeIn("up", "tween", 0.1, 1)}
        >
          <div className="inline-flex items-center justify-center mb-4">
            <div className="h-1 w-10 bg-primary mr-3"></div>
            <span className="text-sm font-bold text-primary uppercase tracking-widest font-heading">Our Talent</span>
            <div className="h-1 w-10 bg-primary ml-3"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-secondary">
            Meet the <span className="text-primary">Experts</span> Behind Your Success
          </h2>
          <p className="mt-6 text-xl text-gray-600">
            Our elite team of specialists brings decades of experience to every project, 
            ensuring your business automation solution is built to the highest standards.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
          {teamMembersData.map((member, index) => (
            <motion.div 
              key={index}
              className="bg-white rounded-xl shadow-xl overflow-hidden group hover:-translate-y-2 transition-all duration-300"
              variants={fadeIn("up", "spring", index * 0.1 + 0.2, 0.75)}
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="mr-4 p-3 bg-primary/10 rounded-lg">
                    {getIconByRole(member.role)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-heading text-secondary">{member.name}</h3>
                    <p className="text-primary font-medium mt-1">{member.role}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {member.specialties.map((specialty, spIndex) => (
                    <span key={spIndex} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-16 p-8 bg-gray-50 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row items-center justify-between"
          variants={fadeIn("up", "tween", 0.6, 1)}
        >
          <div className="md:w-2/3 mb-6 md:mb-0">
            <h3 className="text-xl font-bold text-secondary mb-2">Want to join our team?</h3>
            <p className="text-gray-600">
              We're always looking for talented developers, designers, and analysts to join our growing team.
            </p>
          </div>
          <a 
            href="#contact" 
            className="px-6 py-3 bg-white border-2 border-primary text-primary rounded-xl font-bold hover:bg-primary hover:text-white transition-colors"
          >
            View Open Positions
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
