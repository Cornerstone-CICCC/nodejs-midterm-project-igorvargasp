import { Request, Response } from "express";
import zxcvbn from "zxcvbn";
import { UserModel } from "../models/User";

export const authController = {
  async signup(req: Request, res: Response): Promise<void> {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ error: "Username, email, and password are required" });
      return;
    }

    // Check password strength
    const strength = zxcvbn(password);
    if (strength.score < 2) {
      res.status(400).json({
        error: "Password is too weak",
        feedback: strength.feedback,
      });
      return;
    }

    // Check if user already exists
    if (UserModel.findByEmail(email)) {
      res.status(409).json({ error: "Email already in use" });
      return;
    }

    if (UserModel.findByUsername(username)) {
      res.status(409).json({ error: "Username already taken" });
      return;
    }

    const user = await UserModel.create(username, email, password);

    // Set session (no password stored)
    req.session!.userId = user.id;
    req.session!.username = user.username;

    res.status(201).json({ user });
  },

  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const user = UserModel.findByEmail(email);
    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const valid = await UserModel.verifyPassword(user, password);
    if (!valid) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    // Set session (no password stored)
    req.session!.userId = user.id;
    req.session!.username = user.username;

    const { password: _, ...safeUser } = user;
    res.json({ user: safeUser });
  },

  logout(req: Request, res: Response): void {
    req.session = null; // Clear the cookie session
    res.json({ message: "Logged out successfully" });
  },

  me(req: Request, res: Response): void {
    if (!req.session || !req.session.userId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const user = UserModel.findById(req.session.userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({ user });
  },

  forgotPassword(req: Request, res: Response): void {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: "Email is required" });
      return;
    }

    const result = UserModel.setResetToken(email);
    if (!result) {
      // Don't reveal whether the email exists
      res.json({ message: "If that email is registered, a reset link has been generated.", resetToken: null });
      return;
    }

    // In a real app you'd email this link. Since this is in-memory with no email service,
    // we return the token directly so the frontend can build the reset link.
    res.json({
      message: "Reset link generated",
      resetToken: result.token,
    });
  },

  async resetPassword(req: Request, res: Response): Promise<void> {
    const { token, password } = req.body;

    if (!token || !password) {
      res.status(400).json({ error: "Token and new password are required" });
      return;
    }

    const user = UserModel.findByResetToken(token);
    if (!user) {
      res.status(400).json({ error: "Invalid or expired reset token" });
      return;
    }

    const strength = zxcvbn(password);
    if (strength.score < 2) {
      res.status(400).json({
        error: "Password is too weak",
        feedback: strength.feedback,
      });
      return;
    }

    await UserModel.updatePassword(user, password);
    res.json({ message: "Password has been reset successfully" });
  },
};
