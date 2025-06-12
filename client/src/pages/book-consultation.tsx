import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Calendar, CheckCircle, ArrowRight, Building, Globe, Mail, Phone, User, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { consultationLeadSchema, type InsertConsultationLead } from "@shared/schema";
import { fadeIn } from "@/lib/animations";

export default function BookConsultation() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<InsertConsultationLead>({
    resolver: zodResolver(consultationLeadSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      website: "",
      message: "",
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: InsertConsultationLead) => {
      const response = await apiRequest("POST", "/api/consultation-leads", data);
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Consultation Request Submitted!",
        description: "We'll get back to you within 24 hours to schedule your free consultation.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertConsultationLead) => {
    submitMutation.mutate(data);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center">
        <motion.div
          className="text-center max-w-2xl mx-auto px-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <CheckCircle className="h-20 w-20 text-primary mx-auto" />
          </motion.div>
          <h1 className="text-4xl font-bold font-heading mb-6">Thank You!</h1>
          <p className="text-xl text-gray-600 mb-8">
            Your consultation request has been submitted successfully. Our team will review your information and contact you within 24 hours to schedule your free consultation.
          </p>
          <Button
            onClick={() => window.location.href = "/"}
            className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-4 rounded-lg transition-all duration-300"
          >
            Return to Home
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-primary/10"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            variants={fadeIn("up", "tween", 0.1, 1)}
            initial="hidden"
            animate="show"
          >
            <div className="inline-flex items-center justify-center mb-6">
              <Calendar className="w-8 h-8 text-primary mr-3" />
              <span className="text-sm font-semibold text-primary uppercase tracking-widest font-heading">Free Consultation</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-heading font-extrabold mb-6">
              Book Your <span className="text-primary">Free</span> Consultation
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Ready to transform your business with custom automation solutions? Let's discuss your unique needs and explore how we can help you reduce costs and increase efficiency.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section className="pb-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-2xl mx-auto"
            variants={fadeIn("up", "tween", 0.2, 1)}
            initial="hidden"
            animate="show"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Name Field */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium flex items-center">
                          <User className="w-4 h-4 mr-2 text-primary" />
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John Doe"
                            className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-primary"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email and Phone Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium flex items-center">
                            <Mail className="w-4 h-4 mr-2 text-primary" />
                            Email Address
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="john@company.com"
                              className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-primary"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium flex items-center">
                            <Phone className="w-4 h-4 mr-2 text-primary" />
                            Phone Number
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="+1 (555) 123-4567"
                              className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-primary"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Company and Website Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium flex items-center">
                            <Building className="w-4 h-4 mr-2 text-primary" />
                            Company Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your Company Inc."
                              className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-primary"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium flex items-center">
                            <Globe className="w-4 h-4 mr-2 text-primary" />
                            Website (Optional)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="url"
                              placeholder="https://yourcompany.com"
                              className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-primary"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Message Field */}
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium flex items-center">
                          <MessageSquare className="w-4 h-4 mr-2 text-primary" />
                          Tell us about your project (Optional)
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your business needs, current challenges, or what you'd like to automate..."
                            className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-primary min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={submitMutation.isPending}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-lg transition-all duration-300 flex items-center justify-center"
                  >
                    {submitMutation.isPending ? (
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                    ) : (
                      <>
                        <span>Book Your Free Consultation</span>
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>

              {/* Additional Info */}
              <div className="mt-8 pt-8 border-t border-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-primary font-bold text-lg">100% Free</div>
                    <div className="text-gray-400 text-sm">No commitments required</div>
                  </div>
                  <div>
                    <div className="text-primary font-bold text-lg">24hr Response</div>
                    <div className="text-gray-400 text-sm">Quick scheduling guaranteed</div>
                  </div>
                  <div>
                    <div className="text-primary font-bold text-lg">Expert Guidance</div>
                    <div className="text-gray-400 text-sm">Tailored solutions for you</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}