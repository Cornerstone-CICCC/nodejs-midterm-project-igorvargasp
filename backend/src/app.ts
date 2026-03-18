import express from "express";
import cookieSession from "cookie-session";
import authRoutes from "./routes/authRoutes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "session",
    keys: ["super-secret-key-change-in-prod"],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

// Routes
app.use("/api/auth", authRoutes);

export default app;
