import { useState } from "react";
import { Link } from "wouter";
import { 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Zap, 
  BarChart3,
  Shield,
  Smartphone,
  Globe,
  Star,
  PlayCircle,
  Phone,
  Mail,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HomeProfessional() {
  const [videoPlaying, setVideoPlaying] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl font-bold text-red-600">AutomateNow</span>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#solutions" className="text-gray-900 hover:text-red-600 px-3 py-2 text-sm font-medium">Solutions</a>
                <a href="#industries" className="text-gray-900 hover:text-red-600 px-3 py-2 text-sm font-medium">Industries</a>
                <a href="#pricing" className="text-gray-900 hover:text-red-600 px-3 py-2 text-sm font-medium">Pricing</a>
                <a href="#contact" className="text-gray-900 hover:text-red-600 px-3 py-2 text-sm font-medium">Contact</a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth">
                <Button variant="outline" size="sm">Login</Button>
              </Link>
              <Link href="/book-consultation">
                <Button className="bg-red-600 hover:bg-red-700" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-6 bg-red-100 text-red-800 border-red-200">
              🚀 Transform Your Business Operations
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Stop Wasting Time on
              <span className="text-red-600 block">Manual Tasks</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Our automation platform eliminates repetitive work, reduces costs by up to 80%, 
              and scales your business operations without hiring additional staff.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book-consultation">
                <Button size="lg" className="bg-red-600 hover:bg-red-700 text-lg px-8 py-4">
                  Start Saving Money Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4" onClick={() => setVideoPlaying(true)}>
                <PlayCircle className="mr-2 h-5 w-5" />
                Watch Demo (2 min)
              </Button>
            </div>
            <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                No Setup Fees
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                14-Day Free Trial
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                ROI Guaranteed
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Calculate Your Potential Savings
            </h2>
            <p className="text-xl text-gray-600">
              See how much money you could save by automating your business processes
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Card className="p-8 border-2 border-red-100">
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      How many employees handle repetitive tasks?
                    </label>
                    <input 
                      type="number" 
                      defaultValue="5"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Average hourly wage ($)
                    </label>
                    <input 
                      type="number" 
                      defaultValue="25"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hours spent on manual tasks per day
                    </label>
                    <input 
                      type="number" 
                      defaultValue="4"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-2xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Potential Savings</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Current Monthly Cost:</span>
                    <span className="text-2xl font-bold text-gray-900">$13,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">With Automation:</span>
                    <span className="text-2xl font-bold text-green-600">$2,600</span>
                  </div>
                  <hr className="border-gray-300" />
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Monthly Savings:</span>
                    <span className="text-3xl font-bold text-red-600">$10,400</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Annual Savings:</span>
                    <span className="text-3xl font-bold text-red-600">$124,800</span>
                  </div>
                </div>
                <Button className="w-full mt-6 bg-red-600 hover:bg-red-700 text-lg py-4">
                  Get My Custom Quote
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Automation Solutions
            </h2>
            <p className="text-xl text-gray-600">
              Custom-built applications that eliminate manual work and scale your operations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <BarChart3 className="h-8 w-8 text-red-600" />,
                title: "Business Process Automation",
                description: "Automate invoicing, reporting, data entry, and approval workflows. Reduce processing time by 90%.",
                savings: "Save $8,000/month"
              },
              {
                icon: <Users className="h-8 w-8 text-red-600" />,
                title: "Customer Management Systems",
                description: "Automated lead tracking, follow-ups, and customer communication. Never lose a prospect again.",
                savings: "Increase revenue 35%"
              },
              {
                icon: <Clock className="h-8 w-8 text-red-600" />,
                title: "Scheduling & Resource Management",
                description: "Smart scheduling, resource allocation, and capacity planning. Optimize your team's productivity.",
                savings: "Save 20 hours/week"
              },
              {
                icon: <DollarSign className="h-8 w-8 text-red-600" />,
                title: "Financial Operations",
                description: "Automated billing, expense tracking, and financial reporting. Real-time insights into your business.",
                savings: "Reduce costs 60%"
              },
              {
                icon: <Shield className="h-8 w-8 text-red-600" />,
                title: "Compliance & Documentation",
                description: "Automated compliance tracking, document generation, and audit trails. Stay compliant effortlessly.",
                savings: "Avoid $50k fines"
              },
              {
                icon: <TrendingUp className="h-8 w-8 text-red-600" />,
                title: "Analytics & Insights",
                description: "Real-time dashboards, automated reports, and predictive analytics. Make data-driven decisions.",
                savings: "Improve efficiency 45%"
              }
            ].map((solution, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow border-2 hover:border-red-100">
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    {solution.icon}
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      {solution.savings}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{solution.title}</h3>
                  <p className="text-gray-600">{solution.description}</p>
                  <Button variant="outline" className="w-full">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section id="industries" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Leading Industries
            </h2>
            <p className="text-xl text-gray-600">
              We've helped businesses across every sector reduce costs and increase efficiency
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: "Healthcare", companies: "50+ clinics", savings: "Average 70% cost reduction" },
              { name: "Manufacturing", companies: "30+ facilities", savings: "40% faster production" },
              { name: "Retail", companies: "200+ stores", savings: "60% inventory efficiency" },
              { name: "Professional Services", companies: "100+ firms", savings: "80% admin time saved" },
              { name: "Real Estate", companies: "75+ agencies", savings: "90% faster closings" },
              { name: "Finance", companies: "40+ institutions", savings: "95% error reduction" },
              { name: "Education", companies: "25+ institutions", savings: "50% admin cost savings" },
              { name: "Non-Profit", companies: "60+ organizations", savings: "65% more impact" }
            ].map((industry, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <CardContent className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">{industry.name}</h3>
                  <p className="text-sm text-gray-600">{industry.companies}</p>
                  <Badge className="bg-red-100 text-red-800 border-red-200 text-xs">
                    {industry.savings}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Real Results from Real Businesses
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "We eliminated 40 hours of manual work per week and saved $180,000 annually. The ROI was immediate.",
                author: "Sarah Johnson",
                title: "Operations Director",
                company: "TechCorp Industries",
                result: "Saved $180k/year"
              },
              {
                quote: "Our customer response time went from 24 hours to 5 minutes. Customer satisfaction increased by 65%.",
                author: "Michael Chen",
                title: "CEO",
                company: "Service Plus LLC",
                result: "65% higher satisfaction"
              },
              {
                quote: "The automation platform paid for itself in 3 months. We're now processing 300% more orders with the same staff.",
                author: "Lisa Rodriguez",
                title: "COO",
                company: "Global Retail Co",
                result: "300% more capacity"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="p-6">
                <CardContent className="space-y-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.author}</p>
                    <p className="text-sm text-gray-600">{testimonial.title}, {testimonial.company}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    {testimonial.result}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that fits your business size and automation needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Starter",
                price: "$2,500",
                period: "one-time setup",
                description: "Perfect for small businesses just getting started with automation",
                features: [
                  "1 Custom Automation App",
                  "Basic Reporting Dashboard", 
                  "Email Support",
                  "30-day Money-back Guarantee",
                  "Mobile-responsive Design"
                ],
                cta: "Start Small",
                popular: false
              },
              {
                name: "Professional", 
                price: "$7,500",
                period: "one-time setup",
                description: "Ideal for growing businesses that need comprehensive automation",
                features: [
                  "3 Custom Automation Apps",
                  "Advanced Analytics Dashboard",
                  "Priority Phone Support", 
                  "Integration with Existing Systems",
                  "Team Training Included",
                  "60-day Money-back Guarantee"
                ],
                cta: "Most Popular",
                popular: true
              },
              {
                name: "Enterprise",
                price: "Custom",
                period: "tailored solution", 
                description: "For large organizations requiring enterprise-grade automation",
                features: [
                  "Unlimited Custom Apps",
                  "White-label Solutions",
                  "Dedicated Success Manager",
                  "24/7 Priority Support",
                  "Advanced Security Features",
                  "Custom Integrations"
                ],
                cta: "Contact Sales",
                popular: false
              }
            ].map((plan, index) => (
              <Card key={index} className={`p-8 ${plan.popular ? 'border-2 border-red-500 ring-4 ring-red-100' : 'border-2 border-gray-200'}`}>
                <CardContent className="space-y-6">
                  {plan.popular && (
                    <Badge className="bg-red-600 text-white mb-4">Most Popular</Badge>
                  )}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                    <div className="mt-2">
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-600 ml-2">{plan.period}</span>
                    </div>
                    <p className="text-gray-600 mt-2">{plan.description}</p>
                  </div>
                  
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-900 hover:bg-gray-800'}`}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-red-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-red-100 mb-8">
            Join hundreds of businesses that have eliminated manual work and increased profits with our automation platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book-consultation">
              <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100 text-lg px-8 py-4">
                Book Free Consultation
                <Calendar className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-red-600 text-lg px-8 py-4">
              <Phone className="mr-2 h-5 w-5" />
              Call (555) 123-4567
            </Button>
          </div>
          <p className="text-red-100 mt-6 text-sm">
            No commitment required • Free consultation • ROI guaranteed
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Get Started Today
            </h2>
            <p className="text-xl text-gray-600">
              Schedule a free consultation to see how we can automate your business
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="h-6 w-6 text-red-600 mr-4" />
                  <div>
                    <p className="font-medium text-gray-900">Phone</p>
                    <p className="text-gray-600">(555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="h-6 w-6 text-red-600 mr-4" />
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-gray-600">hello@automatenow.com</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="h-6 w-6 text-red-600 mr-4" />
                  <div>
                    <p className="font-medium text-gray-900">Business Hours</p>
                    <p className="text-gray-600">Monday - Friday, 9 AM - 6 PM EST</p>
                  </div>
                </div>
              </div>
            </div>
            
            <Card className="p-8">
              <CardContent>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Schedule Free Consultation</h3>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      placeholder="First Name" 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                    <input 
                      type="text" 
                      placeholder="Last Name" 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                  <input 
                    type="tel" 
                    placeholder="Phone Number" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                  <input 
                    type="text" 
                    placeholder="Company Name" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                  <textarea 
                    placeholder="Tell us about your automation needs..." 
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  ></textarea>
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-lg py-4">
                    Schedule Free Consultation
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold text-red-500 mb-4">AutomateNow</div>
              <p className="text-gray-400">
                Transforming businesses through intelligent automation solutions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Solutions</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Process Automation</a></li>
                <li><a href="#" className="hover:text-white">Customer Management</a></li>
                <li><a href="#" className="hover:text-white">Financial Operations</a></li>
                <li><a href="#" className="hover:text-white">Analytics & Insights</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Industries</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Healthcare</a></li>
                <li><a href="#" className="hover:text-white">Manufacturing</a></li>
                <li><a href="#" className="hover:text-white">Retail</a></li>
                <li><a href="#" className="hover:text-white">Professional Services</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>(555) 123-4567</li>
                <li>hello@automatenow.com</li>
                <li>Monday - Friday, 9 AM - 6 PM EST</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AutomateNow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}