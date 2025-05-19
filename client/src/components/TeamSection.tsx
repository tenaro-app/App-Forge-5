import { Linkedin, Twitter, GitPullRequest, Dribbble } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, fadeIn } from "@/lib/animations";
import { teamMembersData } from "@/lib/data";

export default function TeamSection() {
  return (
    <section id="about" className="py-20 bg-white">
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
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Our Team</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-heading font-bold text-dark-600">Meet the Experts Behind Your Apps</h2>
          <p className="mt-4 text-lg text-gray-600">
            Our team of seasoned developers, designers, and business analysts work together to deliver exceptional custom applications.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembersData.map((member, index) => (
            <motion.div 
              key={index}
              className="text-center"
              variants={fadeIn("up", "spring", index * 0.1 + 0.2, 0.75)}
            >
              <div className="mb-4 rounded-xl overflow-hidden">
                <img 
                  src={member.photoUrl} 
                  alt={`${member.name} portrait`} 
                  className="w-full h-auto object-cover aspect-square"
                />
              </div>
              <h3 className="text-lg font-semibold font-heading">{member.name}</h3>
              <p className="text-primary text-sm mb-2">{member.role}</p>
              <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
              <div className="flex justify-center space-x-3">
                {member.socialLinks.map((social, socialIndex) => (
                  <a 
                    key={socialIndex}
                    href={social.url} 
                    className="text-gray-400 hover:text-primary transition-colors"
                    aria-label={`${member.name}'s ${social.type} profile`}
                  >
                    {social.type === 'linkedin' && <Linkedin className="h-5 w-5" />}
                    {social.type === 'twitter' && <Twitter className="h-5 w-5" />}
                    {social.type === 'github' && <GitPullRequest className="h-5 w-5" />}
                    {social.type === 'dribbble' && <Dribbble className="h-5 w-5" />}
                  </a>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
