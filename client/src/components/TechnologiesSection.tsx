import { motion } from "framer-motion";
import { staggerContainer, fadeIn } from "@/lib/animations";
import IconRenderer from "./IconRenderer";
import {
  Code,
  Database,
  Smartphone,
  Server,
  Cloud,
  Layers,
  Lock,
  PenTool,
  Cpu
} from "lucide-react";

export default function TechnologiesSection() {
  const technologiesData = [
    {
      category: "Frontend Development",
      icon: <Code className="w-6 h-6 text-primary" />,
      items: [
        { name: "React", level: 95 },
        { name: "Vue.js", level: 90 },
        { name: "Angular", level: 85 },
        { name: "Next.js", level: 92 },
        { name: "Svelte", level: 88 },
        { name: "TypeScript", level: 95 },
        { name: "Tailwind CSS", level: 98 },
        { name: "SASS/SCSS", level: 90 },
      ]
    },
    {
      category: "Backend Development",
      icon: <Server className="w-6 h-6 text-primary" />,
      items: [
        { name: "Node.js", level: 96 },
        { name: "Python/Django", level: 94 },
        { name: "Ruby on Rails", level: 85 },
        { name: "PHP/Laravel", level: 88 },
        { name: "Java Spring", level: 82 },
        { name: "ASP.NET Core", level: 84 },
        { name: "GraphQL", level: 92 },
        { name: "REST API", level: 98 },
      ]
    },
    {
      category: "Database Technologies",
      icon: <Database className="w-6 h-6 text-primary" />,
      items: [
        { name: "PostgreSQL", level: 96 },
        { name: "MongoDB", level: 94 },
        { name: "MySQL", level: 93 },
        { name: "Redis", level: 90 },
        { name: "Firebase", level: 92 },
        { name: "Supabase", level: 88 },
        { name: "ElasticSearch", level: 85 },
        { name: "DynamoDB", level: 84 },
      ]
    },
    {
      category: "Mobile Development",
      icon: <Smartphone className="w-6 h-6 text-primary" />,
      items: [
        { name: "React Native", level: 93 },
        { name: "Flutter", level: 90 },
        { name: "iOS/Swift", level: 85 },
        { name: "Android/Kotlin", level: 85 },
        { name: "Ionic", level: 88 },
        { name: "Capacitor", level: 87 },
        { name: "PWA", level: 95 },
        { name: "App Store Optimization", level: 90 },
      ]
    },
    {
      category: "DevOps & Cloud",
      icon: <Cloud className="w-6 h-6 text-primary" />,
      items: [
        { name: "Docker", level: 94 },
        { name: "Kubernetes", level: 88 },
        { name: "CI/CD Pipelines", level: 92 },
        { name: "AWS Services", level: 90 },
        { name: "Google Cloud", level: 88 },
        { name: "Azure Services", level: 86 },
        { name: "Serverless", level: 93 },
        { name: "Terraform", level: 85 },
      ]
    },
    {
      category: "Architecture",
      icon: <Layers className="w-6 h-6 text-primary" />,
      items: [
        { name: "Microservices", level: 93 },
        { name: "Serverless", level: 94 },
        { name: "Event-Driven", level: 90 },
        { name: "Monolithic", level: 96 },
        { name: "Domain-Driven Design", level: 88 },
        { name: "Clean Architecture", level: 92 },
        { name: "CQRS", level: 86 },
        { name: "API-First", level: 94 },
      ]
    },
    {
      category: "Security",
      icon: <Lock className="w-6 h-6 text-primary" />,
      items: [
        { name: "OAuth 2.0", level: 95 },
        { name: "JWT", level: 96 },
        { name: "2FA/MFA", level: 92 },
        { name: "HTTPS/TLS", level: 97 },
        { name: "Data Encryption", level: 94 },
        { name: "Secure Coding", level: 93 },
        { name: "Penetration Testing", level: 88 },
        { name: "GDPR Compliance", level: 90 },
      ]
    },
    {
      category: "UI/UX Design",
      icon: <PenTool className="w-6 h-6 text-primary" />,
      items: [
        { name: "Figma", level: 94 },
        { name: "Adobe XD", level: 90 },
        { name: "Sketch", level: 88 },
        { name: "User Research", level: 92 },
        { name: "Wireframing", level: 95 },
        { name: "Prototyping", level: 94 },
        { name: "Accessibility", level: 93 },
        { name: "UX Writing", level: 88 },
      ]
    },
    {
      category: "AI & Machine Learning",
      icon: <Cpu className="w-6 h-6 text-primary" />,
      items: [
        { name: "NLP", level: 88 },
        { name: "Computer Vision", level: 85 },
        { name: "Recommendation Systems", level: 86 },
        { name: "Data Analytics", level: 90 },
        { name: "ChatGPT Integration", level: 94 },
        { name: "Predictive Analytics", level: 87 },
        { name: "Image Recognition", level: 85 },
        { name: "ML Operations", level: 84 },
      ]
    },
  ];

  return (
    <section id="technologies" className="py-24 bg-secondary relative">

      
      <motion.div 
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
      >
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-20"
          variants={fadeIn("up", "tween", 0.1, 1)}
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-widest font-heading">Our Technical Prowess</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-heading font-extrabold text-white">
            Cutting-Edge <span className="text-primary">Technologies</span> We Master
          </h2>
          <p className="mt-6 text-xl text-gray-300">
            With expertise across the entire development stack, we build robust, 
            scalable applications using the latest technologies.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {technologiesData.map((category, index) => (
            <motion.div 
              key={index}
              className="bg-[#f3f4f6] rounded-xl shadow-2xl p-8 border border-gray-300 hover:border-gray-400 transition-colors"
              variants={fadeIn("up", "spring", index * 0.1 + 0.2, 0.75)}
            >
              <div className="flex items-center mb-6">
                <div className="bg-primary/10 p-3 rounded-lg mr-4">
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold text-white">{category.category}</h3>
              </div>
              
              <div className="space-y-4">
                {category.items.slice(0, 5).map((item, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">{item.name}</span>
                      <span className="text-primary-300 font-medium">{item.level}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary/70 to-primary rounded-full"
                        style={{ width: `${item.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
                
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <div className="flex flex-wrap gap-2">
                    {category.items.slice(5).map((item, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-800 text-gray-300 rounded-md text-xs">
                        {item.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-20 bg-dark-600 rounded-2xl p-10 shadow-2xl overflow-hidden border border-gray-800 relative"
          variants={fadeIn("up", "tween", 0.6, 1)}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-grid-white/[0.1]" style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpolygon fill-rule='evenodd' points='20 10 10 0 0 0 20 20'/%3E%3Cpolygon fill-rule='evenodd' points='0 10 0 20 10 20'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '20px 20px'
            }} />
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between relative z-10">
            <div className="md:w-2/3 mb-8 md:mb-0 md:pr-8">
              <h3 className="text-2xl font-bold font-heading text-white mb-4">Need a technology not listed here?</h3>
              <p className="text-gray-300 text-lg">
                Our team continually expands its expertise to embrace emerging technologies. 
                We'll assemble the perfect tech stack for your unique business needs.
              </p>
            </div>
            <div className="md:w-1/3 text-center md:text-right">
              <a href="#contact" className="px-8 py-4 rounded-xl bg-primary text-white font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-primary/90 transition-all transform hover:-translate-y-1 inline-block border border-primary">
                Discuss Your Tech Needs
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}