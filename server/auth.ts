import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as LinkedInStrategy } from "passport-linkedin-oauth2";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { v4 as uuidv4 } from "uuid";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";
import { User, LoginData, RegisterData } from "@shared/schema";

declare global {
  namespace Express {
    interface User {
      id: string;
      email?: string;
      phone?: string;
      firstName: string;
      lastName: string;
      company?: string;
      profileImageUrl?: string;
      role: string;
      authProvider: string;
      providerId?: string;
      emailVerified: boolean;
      phoneVerified: boolean;
      lastLoginAt?: Date;
      createdAt: Date;
      updatedAt: Date;
    }
  }
}

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

  // Passport strategies
  
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
            return done(null, false, { message: "Invalid credentials" });
          }

          const isValid = await comparePasswords(password, user.password);
          if (!isValid) {
            return done(null, false, { message: "Invalid credentials" });
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

  // Google OAuth Strategy
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: "/api/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            let user = await storage.getUserByProviderId("google", profile.id);
            
            if (!user) {
              // Create new user from Google profile
              user = await storage.createOAuthUser({
                id: uuidv4(),
                email: profile.emails?.[0]?.value,
                firstName: profile.name?.givenName || "",
                lastName: profile.name?.familyName || "",
                profileImageUrl: profile.photos?.[0]?.value,
                authProvider: "google",
                providerId: profile.id,
                emailVerified: true,
              });
            }

            await storage.updateLastLogin(user.id);
            return done(null, user);
          } catch (error) {
            return done(error);
          }
        }
      )
    );
  }

  // Facebook OAuth Strategy
  if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
    passport.use(
      new FacebookStrategy(
        {
          clientID: process.env.FACEBOOK_APP_ID,
          clientSecret: process.env.FACEBOOK_APP_SECRET,
          callbackURL: "/api/auth/facebook/callback",
          profileFields: ["id", "emails", "name", "photos"],
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            let user = await storage.getUserByProviderId("facebook", profile.id);
            
            if (!user) {
              user = await storage.createOAuthUser({
                id: uuidv4(),
                email: profile.emails?.[0]?.value,
                firstName: profile.name?.givenName || "",
                lastName: profile.name?.familyName || "",
                profileImageUrl: profile.photos?.[0]?.value,
                authProvider: "facebook",
                providerId: profile.id,
                emailVerified: true,
              });
            }

            await storage.updateLastLogin(user.id);
            return done(null, user);
          } catch (error) {
            return done(error);
          }
        }
      )
    );
  }

  // LinkedIn OAuth Strategy
  if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
    passport.use(
      new LinkedInStrategy(
        {
          clientID: process.env.LINKEDIN_CLIENT_ID,
          clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
          callbackURL: "/api/auth/linkedin/callback",
          scope: ["r_emailaddress", "r_liteprofile"],
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            let user = await storage.getUserByProviderId("linkedin", profile.id);
            
            if (!user) {
              user = await storage.createOAuthUser({
                id: uuidv4(),
                email: profile.emails?.[0]?.value,
                firstName: profile.name?.givenName || "",
                lastName: profile.name?.familyName || "",
                profileImageUrl: profile.photos?.[0]?.value,
                authProvider: "linkedin",
                providerId: profile.id,
                emailVerified: true,
              });
            }

            await storage.updateLastLogin(user.id);
            return done(null, user);
          } catch (error) {
            return done(error);
          }
        }
      )
    );
  }

  // Passport serialization
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user || false);
    } catch (error) {
      done(error);
    }
  });

  // Auth routes

  // Register with email/phone
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { firstName, lastName, email, phone, password, company } = req.body as RegisterData & { password: string };

      // Check if user already exists
      if (email) {
        const existingUser = await storage.getUserByEmail(email);
        if (existingUser) {
          return res.status(400).json({ message: "User with this email already exists" });
        }
      }

      if (phone) {
        const existingUser = await storage.getUserByPhone(phone);
        if (existingUser) {
          return res.status(400).json({ message: "User with this phone number already exists" });
        }
      }

      // Hash password and create user
      const hashedPassword = await hashPassword(password);
      const user = await storage.createUser({
        id: uuidv4(),
        firstName,
        lastName,
        email,
        phone,
        company,
        password: hashedPassword,
        authProvider: "local",
        emailVerified: false,
        phoneVerified: false,
      });

      // Log user in
      req.login(user, (err) => {
        if (err) {
          console.error("Login error after registration:", err);
          return res.status(500).json({ message: "Registration successful but login failed" });
        }
        res.status(201).json(user);
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  // Login with email/phone
  app.post("/api/auth/login", (req: Request, res: Response, next: NextFunction) => {
    const { email, phone, password } = req.body as LoginData;
    const identifier = email || phone;

    if (!identifier || !password) {
      return res.status(400).json({ message: "Email/phone and password are required" });
    }

    req.body.identifier = identifier;

    passport.authenticate("local", (err: any, user: User, info: any) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: info?.message || "Invalid credentials" });
      }

      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        res.json(user);
      });
    })(req, res, next);
  });

  // Logout
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Get current user
  app.get("/api/auth/user", (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    res.json(req.user);
  });

  // OAuth routes
  
  // Google OAuth
  app.get("/api/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
  app.get("/api/auth/google/callback", 
    passport.authenticate("google", { failureRedirect: "/auth?error=google_auth_failed" }),
    (req: Request, res: Response) => {
      res.redirect("/");
    }
  );

  // Facebook OAuth
  app.get("/api/auth/facebook", passport.authenticate("facebook", { scope: ["email"] }));
  app.get("/api/auth/facebook/callback",
    passport.authenticate("facebook", { failureRedirect: "/auth?error=facebook_auth_failed" }),
    (req: Request, res: Response) => {
      res.redirect("/");
    }
  );

  // LinkedIn OAuth
  app.get("/api/auth/linkedin", passport.authenticate("linkedin"));
  app.get("/api/auth/linkedin/callback",
    passport.authenticate("linkedin", { failureRedirect: "/auth?error=linkedin_auth_failed" }),
    (req: Request, res: Response) => {
      res.redirect("/");
    }
  );
}

// Middleware to protect routes
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated() || req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

export const isSupport = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated() || (req.user?.role !== "admin" && req.user?.role !== "support")) {
    return res.status(403).json({ message: "Support access required" });
  }
  next();
};