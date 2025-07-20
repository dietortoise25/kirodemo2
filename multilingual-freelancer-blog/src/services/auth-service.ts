import { SignJWT, jwtVerify } from "jose";
import type { User } from "../types";

const JWT_SECRET = new TextEncoder().encode(
  "your-super-secret-key-that-is-long-enough"
);

export class AuthService {
  public static async login(
    email: string,
    password: string
  ): Promise<{ user: User; token: string }> {
    if (email === "admin@example.com" && password === "password") {
      const user: User = {
        id: "1",
        email: "admin@example.com",
        settings: { language: "zh", theme: "system" },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const token = await new SignJWT({ id: user.id, email: user.email })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1h")
        .sign(JWT_SECRET);

      return { user, token };
    }
    throw new Error("Invalid credentials");
  }

  public static async verifyToken(token: string): Promise<User> {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);

      const user: User = {
        id: payload.id as string,
        email: payload.email as string,
        settings: { language: "zh", theme: "system" },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return user;
    } catch (error) {
      console.error("Token verification failed:", error);
      throw new Error("Invalid token");
    }
  }
}
