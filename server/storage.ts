import { users, quejas, type User, type InsertUser, type Queja, type InsertQueja } from "../shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByCedula(cedula: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;
  
  // Quejas
  createQueja(insertQueja: InsertQueja): Promise<Queja>;
  getQuejasByUser(userId: number): Promise<Queja[]>;
  getAllQuejas(): Promise<Queja[]>;
  getQueja(id: number): Promise<Queja | undefined>;
  updateQuejaEstado(id: number, estado: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByCedula(cedula: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.cedula, cedula));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Hash password
    const hashedPassword = await bcrypt.hash(insertUser.clave, 10);
    
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        clave: hashedPassword,
        fechaAceptacion: insertUser.aceptoPolitica ? new Date() : null
      })
      .returning();
    return user;
  }

  async createQueja(insertQueja: InsertQueja): Promise<Queja> {
    const [queja] = await db
      .insert(quejas)
      .values(insertQueja)
      .returning();
    return queja;
  }

  async getQuejasByUser(userId: number): Promise<Queja[]> {
    return await db.select().from(quejas).where(eq(quejas.usuarioId, userId));
  }

  async getAllQuejas(): Promise<Queja[]> {
    return await db.select().from(quejas);
  }

  async getQueja(id: number): Promise<Queja | undefined> {
    const [queja] = await db.select().from(quejas).where(eq(quejas.id, id));
    return queja || undefined;
  }

  async updateQuejaEstado(id: number, estado: string): Promise<void> {
    await db.update(quejas).set({ estado }).where(eq(quejas.id, id));
  }
}

export const storage = new DatabaseStorage();