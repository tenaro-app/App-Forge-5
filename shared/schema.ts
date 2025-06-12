import { pgTable, text, serial, integer, boolean, timestamp, varchar, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Sessions for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table - Enhanced for custom authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey(), // UUID for user identification
  email: text("email").unique(),
  phone: text("phone").unique(),
  password: text("password"), // Hashed password for email/phone login
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  company: text("company"),
  companyAddress: text("company_address"),
  companyEmail: text("company_email"),
  companyWebsite: text("company_website"),
  industry: text("industry"),
  position: text("position"),
  // Social media fields
  socialFacebook: text("social_facebook"),
  socialInstagram: text("social_instagram"),
  socialTiktok: text("social_tiktok"),
  socialX: text("social_x"),
  socialYoutube: text("social_youtube"),
  socialLinkedin: text("social_linkedin"),
  socialOther: text("social_other"),
  profileImageUrl: text("profile_image_url"),
  role: text("role").default("client").notNull(), // client, admin, support
  authProvider: text("auth_provider").default("local"), // local, google, facebook, linkedin
  providerId: text("provider_id"), // ID from OAuth provider
  emailVerified: boolean("email_verified").default(false),
  phoneVerified: boolean("phone_verified").default(false),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  password: true,
  authProvider: true,
  providerId: true,
  emailVerified: true,
  phoneVerified: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
  role: true,
});

export const loginSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  password: z.string().min(6),
}).refine(data => data.email || data.phone, {
  message: "Either email or phone is required"
});

export const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  company: z.string().optional(),
}).refine(data => data.email || data.phone, {
  message: "Either email or phone is required"
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;

// Projects table for client dashboard
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").default("in_progress").notNull(), // in_progress, completed, on_hold, cancelled
  clientId: varchar("client_id").notNull().references(() => users.id),
  replitId: text("replit_id"), // Replit project ID
  replitUrl: text("replit_url"), // URL to the Replit project
  startDate: timestamp("start_date").defaultNow().notNull(),
  dueDate: timestamp("due_date"),
  completedDate: timestamp("completed_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const projectSchema = createInsertSchema(projects).pick({
  name: true,
  description: true,
  status: true,
  clientId: true,
  replitId: true,
  replitUrl: true,
  dueDate: true,
});

export type InsertProject = z.infer<typeof projectSchema>;
export type Project = typeof projects.$inferSelect;

// Project milestones
export const milestones = pgTable("milestones", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projects.id),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").default("pending").notNull(), // pending, in_progress, completed
  dueDate: timestamp("due_date"),
  completedDate: timestamp("completed_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const milestoneSchema = createInsertSchema(milestones).pick({
  projectId: true,
  title: true,
  description: true,
  status: true,
  dueDate: true,
});

export type InsertMilestone = z.infer<typeof milestoneSchema>;
export type Milestone = typeof milestones.$inferSelect;

// Chat messages for live support
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  senderId: varchar("sender_id").notNull().references(() => users.id),
  receiverId: varchar("receiver_id").references(() => users.id),
  sessionId: integer("session_id").references(() => chatSessions.id),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const chatMessageSchema = createInsertSchema(chatMessages).pick({
  senderId: true,
  receiverId: true,
  sessionId: true,
  content: true,
});

export type InsertChatMessage = z.infer<typeof chatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;

// Chat sessions for tracking active chats
export const chatSessions = pgTable("chat_sessions", {
  id: serial("id").primaryKey(),
  clientId: varchar("client_id").notNull().references(() => users.id),
  supportId: varchar("support_id").references(() => users.id),
  projectId: integer("project_id").references(() => projects.id),
  status: text("status").default("active").notNull(), // active, closed
  lastActivity: timestamp("last_activity").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  closedAt: timestamp("closed_at"),
});

export const chatSessionSchema = createInsertSchema(chatSessions).pick({
  clientId: true,
  supportId: true,
  projectId: true,
  status: true,
});

export type InsertChatSession = z.infer<typeof chatSessionSchema>;
export type ChatSession = typeof chatSessions.$inferSelect;

// Contact form submissions - Keep existing but enhance
export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name"),
  email: text("email").notNull(),
  company: text("company"),
  projectType: text("project_type"),
  staffMember: text("staff_member"),
  message: text("message").notNull(),
  status: text("status").default("new").notNull(), // new, in_progress, completed
  assignedTo: varchar("assigned_to").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const contactSchema = createInsertSchema(contacts).pick({
  firstName: true,
  lastName: true,
  email: true,
  company: true,
  projectType: true,
  staffMember: true,
  message: true,
}).extend({
  privacy: z.boolean().refine(val => val === true, {
    message: "You must accept the privacy policy",
  }),
});

export type InsertContact = z.infer<typeof contactSchema>;
export type Contact = typeof contacts.$inferSelect;

// Support tickets
export const supportTickets = pgTable("support_tickets", {
  id: serial("id").primaryKey(),
  clientId: varchar("client_id").notNull().references(() => users.id),
  projectId: integer("project_id").references(() => projects.id),
  subject: text("subject").notNull(),
  description: text("description").notNull(),
  priority: text("priority").default("medium").notNull(), // low, medium, high
  status: text("status").default("new").notNull(), // new, in_progress, closed
  assignedTo: varchar("assigned_to").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  closedAt: timestamp("closed_at"),
});

export const supportTicketSchema = createInsertSchema(supportTickets).pick({
  clientId: true,
  projectId: true,
  subject: true,
  description: true,
  priority: true,
});

export type InsertSupportTicket = z.infer<typeof supportTicketSchema>;
export type SupportTicket = typeof supportTickets.$inferSelect;

// Support ticket responses
export const ticketResponses = pgTable("ticket_responses", {
  id: serial("id").primaryKey(),
  ticketId: integer("ticket_id").notNull().references(() => supportTickets.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  isInternal: boolean("is_internal").default(false).notNull(), // For staff-only notes
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const ticketResponseSchema = createInsertSchema(ticketResponses).pick({
  ticketId: true,
  userId: true,
  content: true,
  isInternal: true,
});

export type InsertTicketResponse = z.infer<typeof ticketResponseSchema>;
export type TicketResponse = typeof ticketResponses.$inferSelect;

// Consultation leads table
export const consultationLeads = pgTable("consultation_leads", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  company: varchar("company", { length: 255 }).notNull(),
  website: varchar("website", { length: 255 }),
  message: text("message"),
  status: varchar("status", { length: 50 }).default("new").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const consultationLeadSchema = createInsertSchema(consultationLeads).pick({
  name: true,
  email: true,
  phone: true,
  company: true,
  website: true,
  message: true,
});

export type InsertConsultationLead = z.infer<typeof consultationLeadSchema>;
export type ConsultationLead = typeof consultationLeads.$inferSelect;

// Invoices table
export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  clientId: varchar("client_id").notNull().references(() => users.id),
  projectId: integer("project_id").references(() => projects.id),
  invoiceNumber: varchar("invoice_number", { length: 50 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  amount: integer("amount").notNull(), // Amount in cents
  currency: varchar("currency", { length: 3 }).default("USD").notNull(),
  dueDate: timestamp("due_date").notNull(),
  status: varchar("status", { length: 20 }).default("pending").notNull(), // pending, paid, overdue, cancelled
  pdfUrl: text("pdf_url"), // URL to uploaded PDF invoice
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const invoiceSchema = createInsertSchema(invoices).pick({
  clientId: true,
  projectId: true,
  title: true,
  description: true,
  amount: true,
  currency: true,
  dueDate: true,
});

export type InsertInvoice = z.infer<typeof invoiceSchema>;
export type Invoice = typeof invoices.$inferSelect;
