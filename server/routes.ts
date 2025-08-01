import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { contactSchema, projectSchema, milestoneSchema, chatMessageSchema, chatSessionSchema, supportTicketSchema, ticketResponseSchema, invoiceSchema } from "@shared/schema";
import { type Request, Response, NextFunction } from "express";
import { setupChatService } from "./chatService";
import { setupAuth, isAuthenticated, isAdmin, isSupport } from "./simpleAuth";
import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
}) : null;

export async function registerRoutes(app: Express): Promise<Server> {
  // Create the HTTP server
  const httpServer = createServer(app);
  
  // Set up authentication
  await setupAuth(app);
  
  // Set up chat service
  const chatService = setupChatService(httpServer);

  // Public API routes
  // ----------------------------------------------------------------
  
  // Handle contact form submissions
  app.post("/api/contact", async (req: Request, res: Response) => {
    try {
      const validatedData = contactSchema.parse(req.body);
      
      // Store the contact request in the database
      const contact = await storage.createContact(validatedData);
      
      console.log(`New contact form submission from ${validatedData.firstName} ${validatedData.lastName} <${validatedData.email}>`);
      
      res.status(201).json({
        message: "Contact request received successfully",
        id: contact.id,
      });
    } catch (error) {
      console.error("Contact form error:", error);
      res.status(400).json({ 
        message: "Invalid form data", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Admin route to view contact form submissions
  app.get("/api/admin/contacts", isAdmin, async (req: Request, res: Response) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      console.error("Error getting contact submissions:", error);
      res.status(500).json({ message: "Failed to get contact submissions" });
    }
  });

  // Admin Client Management API routes
  // ----------------------------------------------------------------

  // Create new client (admin only)
  app.post("/api/admin/clients", isAdmin, async (req: Request, res: Response) => {
    try {
      const {
        firstName,
        lastName,
        email,
        phone,
        company,
        companyAddress,
        companyEmail,
        companyWebsite,
        industry,
        position,
        socialFacebook,
        socialInstagram,
        socialTiktok,
        socialX,
        socialYoutube,
        socialLinkedin,
        socialOther,
        notes
      } = req.body;

      // Generate unique client ID
      const clientId = `client_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

      // Create user with client role and all additional fields
      const newClient = await storage.createUser({
        id: clientId,
        firstName,
        lastName,
        email,
        phone,
        company,
        companyAddress,
        companyEmail,
        companyWebsite,
        industry,
        position,
        socialFacebook,
        socialInstagram,
        socialTiktok,
        socialX,
        socialYoutube,
        socialLinkedin,
        socialOther,
        role: "client",
        authProvider: "admin_created",
        emailVerified: false,
        phoneVerified: false
      });

      res.status(201).json(newClient);
    } catch (error) {
      console.error("Error creating client:", error);
      res.status(500).json({ 
        message: "Failed to create client",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get all clients (admin only)
  app.get("/api/admin/clients", isAdmin, async (req: Request, res: Response) => {
    try {
      // Get all users with client role
      const clients = await storage.getAllClients();
      res.json(clients);
    } catch (error) {
      console.error("Error fetching clients:", error);
      res.status(500).json({ message: "Failed to fetch clients" });
    }
  });

  // Get specific client (admin only)
  app.get("/api/admin/clients/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      const client = await storage.getUser(req.params.id);
      if (!client || client.role !== 'client') {
        return res.status(404).json({ message: "Client not found" });
      }
      res.json(client);
    } catch (error) {
      console.error("Error fetching client:", error);
      res.status(500).json({ message: "Failed to fetch client" });
    }
  });

  // Authenticated API routes
  // ----------------------------------------------------------------
  
  // Get current authenticated user
  app.get('/api/auth/user', isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Admin Projects API routes
  // ----------------------------------------------------------------
  
  // Get all projects (admin only)
  app.get("/api/admin/projects", isAdmin, async (req: Request, res: Response) => {
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching admin projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  // Client Dashboard API routes
  // ----------------------------------------------------------------
  
  // Get all projects (for admin) or client's projects (for client)
  app.get("/api/projects", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      // Admins can see all projects, clients see only their own
      const projects = user?.role === 'admin' 
        ? await storage.getAllProjects()
        : await storage.getProjectsByClientId(userId);
        
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  // Get specific project by ID
  app.get("/api/projects/:id", isAuthenticated, async (req: any, res: Response) => {
    try {
      const projectId = parseInt(req.params.id);
      const project = await storage.getProjectById(projectId);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      // Check if user has access to this project
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'admin' && project.clientId !== userId) {
        return res.status(403).json({ message: "You don't have access to this project" });
      }
      
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  // Create new project (admin only)
  app.post("/api/projects", isAdmin, async (req: Request, res: Response) => {
    try {
      const validatedData = projectSchema.parse(req.body);
      const newProject = await storage.createProject(validatedData);
      res.status(201).json(newProject);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(400).json({ 
        message: "Invalid project data", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });
  
  // Client project request endpoint
  app.post("/api/projects/request", isAuthenticated, async (req: any, res: Response) => {
    try {
      // Ensure the client ID matches the authenticated user
      if (req.body.clientId !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      // Prepare project data
      const projectData = {
        name: req.body.name,
        description: req.body.description,
        clientId: req.body.clientId,
        status: "requested", // Always start as requested
        budget: req.body.budget,
        timeline: req.body.timeline,
        type: req.body.type,
        requirements: req.body.requirements
      };
      
      const validatedData = projectSchema.parse(projectData);
      const project = await storage.createProject(validatedData);
      
      res.status(201).json(project);
    } catch (error: any) {
      console.error("Error creating project request:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // Update project (admin only)
  app.put("/api/projects/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      const projectId = parseInt(req.params.id);
      const project = await storage.getProjectById(projectId);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      const validatedData = projectSchema.partial().parse(req.body);
      const updatedProject = await storage.updateProject(projectId, validatedData);
      res.json(updatedProject);
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(400).json({ 
        message: "Invalid project data", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Get project milestones
  app.get("/api/projects/:id/milestones", isAuthenticated, async (req: any, res: Response) => {
    try {
      const projectId = parseInt(req.params.id);
      const project = await storage.getProjectById(projectId);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      // Check if user has access to this project
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'admin' && project.clientId !== userId) {
        return res.status(403).json({ message: "You don't have access to this project" });
      }
      
      const milestones = await storage.getMilestonesByProjectId(projectId);
      res.json(milestones);
    } catch (error) {
      console.error("Error fetching milestones:", error);
      res.status(500).json({ message: "Failed to fetch milestones" });
    }
  });

  // Create project milestone (admin only)
  app.post("/api/projects/:id/milestones", isAdmin, async (req: Request, res: Response) => {
    try {
      const projectId = parseInt(req.params.id);
      const project = await storage.getProjectById(projectId);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      const validatedData = milestoneSchema.parse({
        ...req.body,
        projectId
      });
      
      const newMilestone = await storage.createMilestone(validatedData);
      res.status(201).json(newMilestone);
    } catch (error) {
      console.error("Error creating milestone:", error);
      res.status(400).json({ 
        message: "Invalid milestone data", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Update milestone (admin only)
  app.put("/api/milestones/:id", isAdmin, async (req: Request, res: Response) => {
    try {
      const milestoneId = parseInt(req.params.id);
      const validatedData = milestoneSchema.partial().parse(req.body);
      const updatedMilestone = await storage.updateMilestone(milestoneId, validatedData);
      res.json(updatedMilestone);
    } catch (error) {
      console.error("Error updating milestone:", error);
      res.status(400).json({ 
        message: "Invalid milestone data", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Live Chat API routes
  // ----------------------------------------------------------------
  
  // Get chat sessions
  app.get("/api/chat/sessions", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      let sessions;
      if (user?.role === 'admin' || user?.role === 'support') {
        sessions = await storage.getActiveChatSessions();
      } else {
        sessions = await storage.getChatSessionsByClientId(userId);
      }
      
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching chat sessions:", error);
      res.status(500).json({ message: "Failed to fetch chat sessions" });
    }
  });

  // Get specific chat session
  app.get("/api/chat/sessions/:id", isAuthenticated, async (req: any, res: Response) => {
    try {
      const sessionId = parseInt(req.params.id);
      const session = await storage.getChatSessionById(sessionId);
      
      if (!session) {
        return res.status(404).json({ message: "Chat session not found" });
      }
      
      // Check if user has access to this session
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      const isClient = session.clientId === userId;
      const isSupport = session.supportId === userId;
      const isAdmin = user?.role === 'admin';
      
      if (!isClient && !isSupport && !isAdmin) {
        return res.status(403).json({ message: "You don't have access to this chat session" });
      }
      
      res.json(session);
    } catch (error) {
      console.error("Error fetching chat session:", error);
      res.status(500).json({ message: "Failed to fetch chat session" });
    }
  });

  // Create new chat session
  app.post("/api/chat/sessions", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.id;
      
      const validatedData = chatSessionSchema.parse({
        ...req.body,
        clientId: userId,
        status: 'active'
      });
      
      const newSession = await storage.createChatSession(validatedData);
      
      // Notify support staff of new session through socket.io
      res.status(201).json(newSession);
    } catch (error) {
      console.error("Error creating chat session:", error);
      res.status(400).json({ 
        message: "Invalid chat session data", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Assign support to chat session
  app.post("/api/chat/sessions/:id/assign", isSupport, async (req: any, res: Response) => {
    try {
      const sessionId = parseInt(req.params.id);
      const supportId = req.user.id;
      
      const success = await chatService.assignSupportToSession(supportId, sessionId);
      
      if (!success) {
        return res.status(400).json({ message: "Failed to assign support to session" });
      }
      
      res.json({ message: "Support assigned successfully" });
    } catch (error) {
      console.error("Error assigning support to session:", error);
      res.status(500).json({ message: "Failed to assign support to session" });
    }
  });

  // Get chat messages for a session
  app.get("/api/chat/sessions/:id/messages", isAuthenticated, async (req: any, res: Response) => {
    try {
      const sessionId = parseInt(req.params.id);
      const session = await storage.getChatSessionById(sessionId);
      
      if (!session) {
        return res.status(404).json({ message: "Chat session not found" });
      }
      
      // Check if user has access to this session
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      const isClient = session.clientId === userId;
      const isSupport = session.supportId === userId;
      const isAdmin = user?.role === 'admin';
      
      if (!isClient && !isSupport && !isAdmin) {
        return res.status(403).json({ message: "You don't have access to this chat session" });
      }
      
      const messages = await storage.getChatMessagesBySessionId(sessionId);
      
      // Mark messages as read
      await storage.markMessagesAsRead(sessionId, userId);
      
      res.json(messages);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      res.status(500).json({ message: "Failed to fetch chat messages" });
    }
  });

  // Send chat message
  app.post("/api/chat/sessions/:id/messages", isAuthenticated, async (req: any, res: Response) => {
    try {
      const sessionId = parseInt(req.params.id);
      const session = await storage.getChatSessionById(sessionId);
      
      if (!session) {
        return res.status(404).json({ message: "Chat session not found" });
      }
      
      // Check if user has access to this session
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      const isClient = session.clientId === userId;
      const isSupport = session.supportId === userId;
      const isAdmin = user?.role === 'admin';
      
      if (!isClient && !isSupport && !isAdmin) {
        return res.status(403).json({ message: "You don't have access to this chat session" });
      }
      
      // Determine receiver ID
      let receiverId;
      if (isClient) {
        receiverId = session.supportId;
      } else {
        receiverId = session.clientId;
      }
      
      const validatedData = chatMessageSchema.parse({
        ...req.body,
        senderId: userId,
        receiverId,
        sessionId
      });
      
      const newMessage = await storage.createChatMessage(validatedData);
      res.status(201).json(newMessage);
    } catch (error) {
      console.error("Error creating chat message:", error);
      res.status(400).json({ 
        message: "Invalid chat message data", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });
  
  // Support Ticket Routes
  
  // Create a new support ticket
  app.post("/api/chat/tickets", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.id;
      const { subject, description, priority, projectId } = req.body;
      
      // Mock data for demonstration
      const mockTicket = {
        id: Math.floor(Math.random() * 1000) + 1,
        clientId: userId,
        subject,
        description,
        priority: priority || "medium",
        projectId: projectId ? parseInt(projectId) : null,
        status: "new",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      res.status(201).json(mockTicket);
    } catch (error) {
      console.error("Error creating support ticket:", error);
      res.status(500).json({ 
        message: "Failed to create ticket", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });
  
  // Get all tickets for the authenticated user
  app.get("/api/chat/tickets", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.id;
      
      // Mock data for demonstration
      const mockTickets = [
        {
          id: 1,
          clientId: userId,
          subject: "Error in dashboard analytics module",
          description: "I'm seeing incorrect data in the analytics dashboard. Numbers don't match our internal reporting.",
          status: "new",
          priority: "high",
          projectId: 1,
          projectName: "E-commerce Dashboard",
          createdAt: new Date(2023, 4, 15).toISOString(),
          updatedAt: new Date(2023, 4, 15).toISOString()
        },
        {
          id: 2,
          clientId: userId,
          subject: "Feature request: Export to PDF",
          description: "We need to be able to export reports as PDF files for our weekly meetings.",
          status: "in_progress",
          priority: "medium",
          projectId: 2,
          projectName: "Analytics Portal",
          createdAt: new Date(2023, 4, 10).toISOString(),
          updatedAt: new Date(2023, 4, 14).toISOString()
        },
        {
          id: 3,
          clientId: userId,
          subject: "Login issues from mobile app",
          description: "Several of our team members are having trouble logging in from the mobile app but desktop works fine.",
          status: "closed",
          priority: "high",
          projectId: 3,
          projectName: "Mobile Application",
          createdAt: new Date(2023, 4, 5).toISOString(),
          updatedAt: new Date(2023, 4, 8).toISOString()
        }
      ];
      
      res.json(mockTickets);
    } catch (error) {
      console.error("Error fetching support tickets:", error);
      res.status(500).json({ 
        message: "Failed to fetch tickets", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Consultation leads routes
  app.post("/api/consultation-leads", async (req: Request, res: Response) => {
    try {
      const lead = await storage.createConsultationLead(req.body);
      res.status(201).json(lead);
    } catch (error) {
      console.error("Error creating consultation lead:", error);
      res.status(500).json({ message: "Failed to create consultation lead" });
    }
  });

  app.get("/api/admin/consultation-leads", isAdmin, async (req: Request, res: Response) => {
    try {
      const leads = await storage.getConsultationLeads();
      res.json(leads);
    } catch (error) {
      console.error("Error fetching consultation leads:", error);
      res.status(500).json({ message: "Failed to fetch consultation leads" });
    }
  });

  app.put("/api/admin/consultation-leads/:id/status", isAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const lead = await storage.updateConsultationLeadStatus(parseInt(id), status);
      res.json(lead);
    } catch (error) {
      console.error("Error updating consultation lead status:", error);
      res.status(500).json({ message: "Failed to update consultation lead status" });
    }
  });

  // Invoice management routes
  app.post("/api/admin/invoices", isAdmin, async (req: Request, res: Response) => {
    try {
      const validatedData = invoiceSchema.parse(req.body);
      const invoice = await storage.createInvoice(validatedData);
      res.status(201).json(invoice);
    } catch (error: any) {
      console.error("Error creating invoice:", error);
      res.status(500).json({ message: "Failed to create invoice" });
    }
  });

  app.get("/api/admin/invoices", isAdmin, async (req: Request, res: Response) => {
    try {
      const invoices = await storage.getAllInvoices();
      res.json(invoices);
    } catch (error: any) {
      console.error("Error getting invoices:", error);
      res.status(500).json({ message: "Failed to get invoices" });
    }
  });

  app.get("/api/invoices", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user?.id;
      const invoices = await storage.getInvoicesByClientId(userId);
      res.json(invoices);
    } catch (error: any) {
      console.error("Error getting client invoices:", error);
      res.status(500).json({ message: "Failed to get invoices" });
    }
  });

  app.get("/api/invoices/:id", isAuthenticated, async (req: any, res: Response) => {
    try {
      const { id } = req.params;
      const invoice = await storage.getInvoiceById(parseInt(id));
      
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      
      // Check if user owns this invoice or is admin
      if (invoice.clientId !== req.user?.id && req.user?.role !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }
      
      res.json(invoice);
    } catch (error: any) {
      console.error("Error getting invoice:", error);
      res.status(500).json({ message: "Failed to get invoice" });
    }
  });

  app.post("/api/invoices/:id/create-payment-intent", isAuthenticated, async (req: any, res: Response) => {
    try {
      if (!stripe) {
        return res.status(500).json({ message: "Payment processing not configured" });
      }

      const { id } = req.params;
      const invoice = await storage.getInvoiceById(parseInt(id));
      
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      
      if (invoice.clientId !== req.user?.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      if (invoice.status === 'paid') {
        return res.status(400).json({ message: "Invoice already paid" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: invoice.amount,
        currency: invoice.currency.toLowerCase(),
        metadata: {
          invoiceId: invoice.id.toString(),
          clientId: invoice.clientId,
        },
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ message: "Failed to create payment intent" });
    }
  });

  app.post("/api/invoices/:id/confirm-payment", isAuthenticated, async (req: any, res: Response) => {
    try {
      if (!stripe) {
        return res.status(500).json({ message: "Payment processing not configured" });
      }

      const { id } = req.params;
      const { paymentIntentId } = req.body;
      
      const invoice = await storage.getInvoiceById(parseInt(id));
      
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      
      if (invoice.clientId !== req.user?.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Verify payment with Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === 'succeeded') {
        const updatedInvoice = await storage.updateInvoiceStatus(
          invoice.id, 
          'paid', 
          new Date()
        );
        res.json(updatedInvoice);
      } else {
        res.status(400).json({ message: "Payment not completed" });
      }
    } catch (error: any) {
      console.error("Error confirming payment:", error);
      res.status(500).json({ message: "Failed to confirm payment" });
    }
  });

  return httpServer;
}
