import { 
  users, type User, type UpsertUser, 
  contacts, type Contact, type InsertContact,
  projects, type Project, type InsertProject,
  milestones, type Milestone, type InsertMilestone,
  chatMessages, type ChatMessage, type InsertChatMessage,
  chatSessions, type ChatSession, type InsertChatSession,
  supportTickets, type SupportTicket, type InsertSupportTicket,
  ticketResponses, type TicketResponse, type InsertTicketResponse,
  consultationLeads, type ConsultationLead, type InsertConsultationLead,
  invoices, type Invoice, type InsertInvoice
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, isNull } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByPhone(phone: string): Promise<User | undefined>;
  getUserByProviderId(provider: string, providerId: string): Promise<User | undefined>;
  createUser(user: UpsertUser): Promise<User>;
  createOAuthUser(user: UpsertUser): Promise<User>;
  updateLastLogin(userId: string): Promise<void>;
  upsertUser(user: UpsertUser): Promise<User>;
  getAllClients(): Promise<User[]>;
  
  // Contact form operations
  createContact(contact: InsertContact): Promise<Contact>;
  getContacts(): Promise<Contact[]>;
  getContactById(id: number): Promise<Contact | undefined>;
  
  // Project operations
  createProject(project: InsertProject): Promise<Project>;
  getProjectById(id: number): Promise<Project | undefined>;
  getProjectsByClientId(clientId: string): Promise<Project[]>;
  getAllProjects(): Promise<Project[]>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project>;
  
  // Milestone operations
  createMilestone(milestone: InsertMilestone): Promise<Milestone>;
  getMilestonesByProjectId(projectId: number): Promise<Milestone[]>;
  updateMilestone(id: number, milestone: Partial<InsertMilestone>): Promise<Milestone>;
  
  // Chat operations
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  getChatSessionById(id: number): Promise<ChatSession | undefined>;
  getChatSessionsByClientId(clientId: string): Promise<ChatSession[]>;
  getChatSessionsByProjectId(projectId: number): Promise<ChatSession[]>;
  getActiveChatSessions(): Promise<ChatSession[]>;
  updateChatSession(id: number, session: Partial<InsertChatSession>): Promise<ChatSession>;
  
  // Chat messages operations
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatMessagesBySessionId(sessionId: number): Promise<ChatMessage[]>;
  markMessagesAsRead(sessionId: number, userId: string): Promise<void>;
  getUnreadMessageCount(userId: string): Promise<number>;
  
  // Support ticket operations
  createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket>;
  getSupportTicketById(id: number): Promise<SupportTicket | undefined>;
  getSupportTicketsByClientId(clientId: string): Promise<SupportTicket[]>;
  getSupportTicketsByProjectId(projectId: number): Promise<SupportTicket[]>;
  getAllSupportTickets(): Promise<SupportTicket[]>;
  updateSupportTicket(id: number, ticket: Partial<InsertSupportTicket>): Promise<SupportTicket>;
  
  // Ticket response operations
  createTicketResponse(response: InsertTicketResponse): Promise<TicketResponse>;
  getTicketResponsesByTicketId(ticketId: number): Promise<TicketResponse[]>;
  
  // Consultation leads operations
  createConsultationLead(lead: InsertConsultationLead): Promise<ConsultationLead>;
  getConsultationLeads(): Promise<ConsultationLead[]>;
  getConsultationLeadById(id: number): Promise<ConsultationLead | undefined>;
  updateConsultationLeadStatus(id: number, status: string): Promise<ConsultationLead>;
  
  // Invoice operations
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  getInvoiceById(id: number): Promise<Invoice | undefined>;
  getInvoicesByClientId(clientId: string): Promise<Invoice[]>;
  getAllInvoices(): Promise<Invoice[]>;
  updateInvoice(id: number, invoice: Partial<InsertInvoice>): Promise<Invoice>;
  updateInvoiceStatus(id: number, status: string, paidAt?: Date): Promise<Invoice>;
  updateInvoicePdf(id: number, pdfUrl: string): Promise<Invoice>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.phone, phone));
    return user;
  }

  async getUserByProviderId(provider: string, providerId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(
      and(eq(users.authProvider, provider), eq(users.providerId, providerId))
    );
    return user;
  }

  async createUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  async createOAuthUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  async updateLastLogin(userId: string): Promise<void> {
    await db
      .update(users)
      .set({ 
        lastLoginAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const now = new Date();
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        updatedAt: now
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: now
        },
      })
      .returning();
    return user;
  }

  async getAllClients(): Promise<User[]> {
    const clientUsers = await db
      .select()
      .from(users)
      .where(eq(users.role, 'client'))
      .orderBy(desc(users.createdAt));
    return clientUsers;
  }
  
  // Contact form operations
  async createContact(contactData: InsertContact): Promise<Contact> {
    const [contact] = await db
      .insert(contacts)
      .values({
        firstName: contactData.firstName,
        lastName: contactData.lastName || null,
        email: contactData.email,
        company: contactData.company || null,
        projectType: contactData.projectType || null,
        message: contactData.message,
        createdAt: new Date()
      })
      .returning();
    return contact;
  }
  
  async getContacts(): Promise<Contact[]> {
    // Select only the columns we know exist in the database
    const results = await db.select({
      id: contacts.id,
      firstName: contacts.firstName,
      lastName: contacts.lastName,
      email: contacts.email,
      company: contacts.company,
      projectType: contacts.projectType,
      message: contacts.message,
      status: contacts.status,
      createdAt: contacts.createdAt
    }).from(contacts).orderBy(desc(contacts.createdAt));
    
    // Add missing fields that might not exist in the database yet
    return results.map(contact => ({
      ...contact,
      updatedAt: null,
      staffMember: null,
      assignedTo: null
    }));
  }
  
  async getContactById(id: number): Promise<Contact | undefined> {
    const [result] = await db.select({
      id: contacts.id,
      firstName: contacts.firstName,
      lastName: contacts.lastName,
      email: contacts.email,
      company: contacts.company,
      projectType: contacts.projectType,
      message: contacts.message,
      status: contacts.status,
      createdAt: contacts.createdAt
    }).from(contacts).where(eq(contacts.id, id));
    
    if (!result) return undefined;
    
    // Add properties that might be missing in the database
    return {
      ...result,
      updatedAt: null,
      staffMember: null,
      assignedTo: null
    };
  }
  
  // Project operations
  async createProject(projectData: InsertProject): Promise<Project> {
    const now = new Date();
    const [project] = await db
      .insert(projects)
      .values({
        ...projectData,
        startDate: now,
        createdAt: now,
        updatedAt: now
      })
      .returning();
    return project;
  }
  
  async getProjectById(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }
  
  async getProjectsByClientId(clientId: string): Promise<Project[]> {
    return await db.select().from(projects)
      .where(eq(projects.clientId, clientId))
      .orderBy(desc(projects.createdAt));
  }
  
  async getAllProjects(): Promise<Project[]> {
    return await db.select().from(projects).orderBy(desc(projects.createdAt));
  }
  
  async updateProject(id: number, projectData: Partial<InsertProject>): Promise<Project> {
    const [project] = await db
      .update(projects)
      .set({
        ...projectData,
        updatedAt: new Date()
      })
      .where(eq(projects.id, id))
      .returning();
    return project;
  }
  
  // Milestone operations
  async createMilestone(milestoneData: InsertMilestone): Promise<Milestone> {
    const now = new Date();
    const [milestone] = await db
      .insert(milestones)
      .values({
        ...milestoneData,
        createdAt: now,
        updatedAt: now
      })
      .returning();
    return milestone;
  }
  
  async getMilestonesByProjectId(projectId: number): Promise<Milestone[]> {
    return await db.select().from(milestones)
      .where(eq(milestones.projectId, projectId))
      .orderBy(desc(milestones.createdAt));
  }
  
  async updateMilestone(id: number, milestoneData: Partial<InsertMilestone>): Promise<Milestone> {
    const [milestone] = await db
      .update(milestones)
      .set({
        ...milestoneData,
        updatedAt: new Date()
      })
      .where(eq(milestones.id, id))
      .returning();
    return milestone;
  }
  
  // Chat operations
  async createChatSession(sessionData: InsertChatSession): Promise<ChatSession> {
    const now = new Date();
    const [session] = await db
      .insert(chatSessions)
      .values({
        ...sessionData,
        lastActivity: now,
        createdAt: now
      })
      .returning();
    return session;
  }
  
  async getChatSessionById(id: number): Promise<ChatSession | undefined> {
    const [session] = await db.select().from(chatSessions).where(eq(chatSessions.id, id));
    return session;
  }
  
  async getChatSessionsByClientId(clientId: string): Promise<ChatSession[]> {
    return await db.select().from(chatSessions)
      .where(eq(chatSessions.clientId, clientId))
      .orderBy(desc(chatSessions.lastActivity));
  }
  
  async getChatSessionsByProjectId(projectId: number): Promise<ChatSession[]> {
    return await db.select().from(chatSessions)
      .where(eq(chatSessions.projectId, projectId))
      .orderBy(desc(chatSessions.lastActivity));
  }
  
  async getActiveChatSessions(): Promise<ChatSession[]> {
    return await db.select().from(chatSessions)
      .where(eq(chatSessions.status, 'active'))
      .orderBy(desc(chatSessions.lastActivity));
  }
  
  async updateChatSession(id: number, sessionData: Partial<InsertChatSession>): Promise<ChatSession> {
    const [session] = await db
      .update(chatSessions)
      .set({
        ...sessionData,
        lastActivity: new Date()
      })
      .where(eq(chatSessions.id, id))
      .returning();
    return session;
  }
  
  // Chat messages operations
  async createChatMessage(messageData: InsertChatMessage): Promise<ChatMessage> {
    const [message] = await db
      .insert(chatMessages)
      .values({
        ...messageData,
        createdAt: new Date()
      })
      .returning();
    
    // Update the associated chat session's last activity
    if (messageData.sessionId) {
      await db
        .update(chatSessions)
        .set({ lastActivity: new Date() })
        .where(eq(chatSessions.id, messageData.sessionId));
    }
    
    return message;
  }
  
  async getChatMessagesBySessionId(sessionId: number): Promise<ChatMessage[]> {
    return await db.select().from(chatMessages)
      .where(eq(chatMessages.sessionId, sessionId))
      .orderBy(chatMessages.createdAt);
  }
  
  async markMessagesAsRead(sessionId: number, userId: string): Promise<void> {
    await db
      .update(chatMessages)
      .set({ isRead: true })
      .where(and(
        eq(chatMessages.sessionId, sessionId),
        eq(chatMessages.receiverId, userId),
        eq(chatMessages.isRead, false)
      ));
  }
  
  async getUnreadMessageCount(userId: string): Promise<number> {
    const messages = await db.select().from(chatMessages)
      .where(and(
        eq(chatMessages.receiverId, userId),
        eq(chatMessages.isRead, false)
      ));
    return messages.length;
  }

  // Support ticket operations
  async createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket> {
    try {
      const [newTicket] = await db
        .insert(supportTickets)
        .values(ticket)
        .returning();
      return newTicket;
    } catch (error) {
      console.error("Error creating support ticket:", error);
      throw error;
    }
  }

  async getSupportTicketById(id: number): Promise<SupportTicket | undefined> {
    try {
      const [ticket] = await db
        .select()
        .from(supportTickets)
        .where(eq(supportTickets.id, id));
      return ticket;
    } catch (error) {
      console.error("Error getting support ticket by ID:", error);
      throw error;
    }
  }

  async getSupportTicketsByClientId(clientId: string): Promise<SupportTicket[]> {
    try {
      return await db
        .select()
        .from(supportTickets)
        .where(eq(supportTickets.clientId, clientId))
        .orderBy(desc(supportTickets.createdAt));
    } catch (error) {
      console.error("Error getting support tickets by client ID:", error);
      throw error;
    }
  }

  async getSupportTicketsByProjectId(projectId: number): Promise<SupportTicket[]> {
    try {
      return await db
        .select()
        .from(supportTickets)
        .where(eq(supportTickets.projectId, projectId))
        .orderBy(desc(supportTickets.createdAt));
    } catch (error) {
      console.error("Error getting support tickets by project ID:", error);
      throw error;
    }
  }

  async getAllSupportTickets(): Promise<SupportTicket[]> {
    try {
      return await db
        .select()
        .from(supportTickets)
        .orderBy(desc(supportTickets.createdAt));
    } catch (error) {
      console.error("Error getting all support tickets:", error);
      throw error;
    }
  }

  async updateSupportTicket(id: number, ticketData: Partial<InsertSupportTicket>): Promise<SupportTicket> {
    try {
      const [updatedTicket] = await db
        .update(supportTickets)
        .set({
          ...ticketData,
          updatedAt: new Date()
        })
        .where(eq(supportTickets.id, id))
        .returning();
      return updatedTicket;
    } catch (error) {
      console.error("Error updating support ticket:", error);
      throw error;
    }
  }

  // Ticket response operations
  async createTicketResponse(response: InsertTicketResponse): Promise<TicketResponse> {
    try {
      const [newResponse] = await db
        .insert(ticketResponses)
        .values(response)
        .returning();
      return newResponse;
    } catch (error) {
      console.error("Error creating ticket response:", error);
      throw error;
    }
  }

  async getTicketResponsesByTicketId(ticketId: number): Promise<TicketResponse[]> {
    try {
      return await db
        .select()
        .from(ticketResponses)
        .where(eq(ticketResponses.ticketId, ticketId))
        .orderBy(ticketResponses.createdAt);
    } catch (error) {
      console.error("Error getting ticket responses:", error);
      throw error;
    }
  }

  // Consultation leads operations
  async createConsultationLead(leadData: InsertConsultationLead): Promise<ConsultationLead> {
    try {
      const [lead] = await db
        .insert(consultationLeads)
        .values(leadData)
        .returning();
      return lead;
    } catch (error) {
      console.error("Error creating consultation lead:", error);
      throw error;
    }
  }

  async getConsultationLeads(): Promise<ConsultationLead[]> {
    try {
      return await db
        .select()
        .from(consultationLeads)
        .orderBy(desc(consultationLeads.createdAt));
    } catch (error) {
      console.error("Error getting consultation leads:", error);
      throw error;
    }
  }

  async getConsultationLeadById(id: number): Promise<ConsultationLead | undefined> {
    try {
      const [lead] = await db
        .select()
        .from(consultationLeads)
        .where(eq(consultationLeads.id, id));
      return lead;
    } catch (error) {
      console.error("Error getting consultation lead by ID:", error);
      throw error;
    }
  }

  async updateConsultationLeadStatus(id: number, status: string): Promise<ConsultationLead> {
    try {
      const [lead] = await db
        .update(consultationLeads)
        .set({ status, updatedAt: new Date() })
        .where(eq(consultationLeads.id, id))
        .returning();
      return lead;
    } catch (error) {
      console.error("Error updating consultation lead status:", error);
      throw error;
    }
  }

  // Invoice operations
  async createInvoice(invoiceData: InsertInvoice): Promise<Invoice> {
    try {
      // Generate unique invoice number
      const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
      
      const [invoice] = await db
        .insert(invoices)
        .values({
          ...invoiceData,
          invoiceNumber
        })
        .returning();
      return invoice;
    } catch (error) {
      console.error("Error creating invoice:", error);
      throw error;
    }
  }

  async getInvoiceById(id: number): Promise<Invoice | undefined> {
    try {
      const [invoice] = await db
        .select()
        .from(invoices)
        .where(eq(invoices.id, id));
      return invoice;
    } catch (error) {
      console.error("Error getting invoice by ID:", error);
      throw error;
    }
  }

  async getInvoicesByClientId(clientId: string): Promise<Invoice[]> {
    try {
      return await db
        .select()
        .from(invoices)
        .where(eq(invoices.clientId, clientId))
        .orderBy(desc(invoices.createdAt));
    } catch (error) {
      console.error("Error getting invoices by client ID:", error);
      throw error;
    }
  }

  async getAllInvoices(): Promise<Invoice[]> {
    try {
      return await db
        .select()
        .from(invoices)
        .orderBy(desc(invoices.createdAt));
    } catch (error) {
      console.error("Error getting all invoices:", error);
      throw error;
    }
  }

  async updateInvoice(id: number, invoiceData: Partial<InsertInvoice>): Promise<Invoice> {
    try {
      const [invoice] = await db
        .update(invoices)
        .set({
          ...invoiceData,
          updatedAt: new Date()
        })
        .where(eq(invoices.id, id))
        .returning();
      return invoice;
    } catch (error) {
      console.error("Error updating invoice:", error);
      throw error;
    }
  }

  async updateInvoiceStatus(id: number, status: string, paidAt?: Date): Promise<Invoice> {
    try {
      const [invoice] = await db
        .update(invoices)
        .set({
          status,
          paidAt,
          updatedAt: new Date()
        })
        .where(eq(invoices.id, id))
        .returning();
      return invoice;
    } catch (error) {
      console.error("Error updating invoice status:", error);
      throw error;
    }
  }

  async updateInvoicePdf(id: number, pdfUrl: string): Promise<Invoice> {
    try {
      const [invoice] = await db
        .update(invoices)
        .set({
          pdfUrl,
          updatedAt: new Date()
        })
        .where(eq(invoices.id, id))
        .returning();
      return invoice;
    } catch (error) {
      console.error("Error updating invoice PDF:", error);
      throw error;
    }
  }
}

export const storage = new DatabaseStorage();
