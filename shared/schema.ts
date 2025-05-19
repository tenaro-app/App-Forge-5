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

// Users table - Enhanced to work with Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey(), // Changed to varchar for Replit Auth ID compatibility
  username: text("username").unique(),
  email: text("email").unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  role: text("role").default("client").notNull(), // client, admin, support
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

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
