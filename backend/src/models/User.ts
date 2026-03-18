import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

export interface IUser {
  id: string;
  username: string;
  email: string;
  password: string;
  resetToken?: string;
  resetTokenExpiry?: number;
}

export type SafeUser = Omit<IUser, "password" | "resetToken" | "resetTokenExpiry">;

const users: IUser[] = [];

const SALT_ROUNDS = 10;

export const UserModel = {
  findAll(): SafeUser[] {
    return users.map(({ password, ...rest }) => rest);
  },

  findById(id: string): SafeUser | undefined {
    const user = users.find((u) => u.id === id);
    if (!user) return undefined;
    const { password, ...safe } = user;
    return safe;
  },

  findByEmail(email: string): IUser | undefined {
    return users.find((u) => u.email === email);
  },

  findByUsername(username: string): IUser | undefined {
    return users.find((u) => u.username === username);
  },

  async create(username: string, email: string, plainPassword: string): Promise<SafeUser> {
    const hashedPassword = await bcrypt.hash(plainPassword, SALT_ROUNDS);
    const newUser: IUser = {
      id: uuidv4(),
      username,
      email,
      password: hashedPassword,
    };
    users.push(newUser);
    const { password, ...safe } = newUser;
    return safe;
  },

  async verifyPassword(user: IUser, plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, user.password);
  },

  setResetToken(email: string): { token: string; } | undefined {
    const user = users.find((u) => u.email === email);
    if (!user) return undefined;
    const token = uuidv4();
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes
    return { token };
  },

  findByResetToken(token: string): IUser | undefined {
    return users.find(
      (u) => u.resetToken === token && u.resetTokenExpiry && u.resetTokenExpiry > Date.now()
    );
  },

  async updatePassword(user: IUser, newPassword: string): Promise<void> {
    user.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
  },
};
