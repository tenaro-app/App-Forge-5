import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  // Session configuration
  const PostgresSessionStore = connectPg(session);
  const sessionStore = new PostgresSessionStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    tableName: "session",
    ttl: 7 * 24 * 60 * 60, // 7 days
  });

  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Local Strategy (Email/Phone + Password)
  passport.use(
    new LocalStrategy(
      {
        usernameField: "identifier", // Can be email or phone
        passwordField: "password",
      },
      async (identifier, password, done) => {
        try {
          let user;
          
          // Check if identifier is email or phone
          if (identifier.includes("@")) {
            user = await storage.getUserByEmail(identifier);
          } else {
            user = await storage.getUserByPhone(identifier);
          }

          if (!user || !user.password) {
            return done(null, false);
          }

          const isValidPassword = await comparePasswords(password, user.password);
          if (!isValidPassword) {
            return done(null, false);
          }

          // Update last login
          await storage.updateLastLogin(user.id);
          
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => done(null, user.id));
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Registration endpoint
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { firstName, lastName, email, phone, password, company } = req.body;

      if (!firstName || !lastName || !password) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      if (!email && !phone) {
        return res.status(400).json({ message: "Either email or phone is required" });
      }

      // Check if user already exists
      let existingUser;
      if (email) {
        existingUser = await storage.getUserByEmail(email);
      }
      if (!existingUser && phone) {
        existingUser = await storage.getUserByPhone(phone);
      }

      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Create new user
      const hashedPassword = await hashPassword(password);
      const newUser = await storage.createUser({
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        firstName,
        lastName,
        email: email || null,
        phone: phone || null,
        password: hashedPassword,
        company: company || null,
        role: "client",
        authProvider: "local",
        emailVerified: false,
        phoneVerified: false,
      });

      // Log in the user
      req.login(newUser, (err) => {
        if (err) {
          return res.status(500).json({ message: "Login failed after registration" });
        }
        res.status(201).json({
          id: newUser.id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          phone: newUser.phone,
          company: newUser.company,
          role: newUser.role,
        });
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  // Login endpoint
  app.post("/api/auth/login", (req: Request, res: Response, next: NextFunction) => {
    const { email, phone, password } = req.body;
    const identifier = email || phone;

    if (!identifier || !password) {
      return res.status(400).json({ message: "Identifier and password are required" });
    }

    // Set the identifier for passport
    req.body.identifier = identifier;

    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        return res.status(500).json({ message: "Authentication error" });
      }
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.login(user, (loginErr) => {
        if (loginErr) {
          return res.status(500).json({ message: "Login failed" });
        }
        res.json({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          company: user.company,
          role: user.role,
        });
      });
    })(req, res, next);
  });

  // Logout endpoint
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Get current user endpoint
  app.get("/api/auth/user", (req: Request, res: Response) => {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = req.user as any;
    res.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      company: user.company,
      role: user.role,
      profileImageUrl: user.profileImageUrl,
    });
  });
}

// Middleware functions
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Authentication required" });
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated() && (req.user as any)?.role === "admin") {
    return next();
  }
  res.status(403).json({ message: "Admin access required" });
};

export const isSupport = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated() && ((req.user as any)?.role === "admin" || (req.user as any)?.role === "support")) {
    return next();
  }
  res.status(403).json({ message: "Support access required" });
};