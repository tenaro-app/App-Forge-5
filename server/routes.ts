import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { contactSchema, projectSchema, milestoneSchema, chatMessageSchema, chatSessionSchema } from "@shared/schema";
import { type Request, Response, NextFunction } from "express";
import { setupChatService } from "./chatService";
import { setupAuth, isAuthenticated, isAdmin, isSupport } from "./replitAuth";

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

  // Authenticated API routes
  // ----------------------------------------------------------------
  
  // Get current authenticated user
  app.get('/api/auth/user', isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Client Dashboard API routes
  // ----------------------------------------------------------------
  
  // Get all projects (for admin) or client's projects (for client)
  app.get("/api/projects", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
      
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
      const supportId = req.user.claims.sub;
      
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
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
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

  return httpServer;
}
