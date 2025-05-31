import { users, quejas, type User, type InsertUser, type Queja, type InsertQueja } from "../shared/schema.js";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByCedula(cedula: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Quejas methods
  createQueja(queja: InsertQueja): Promise<Queja>;
  getQuejasByUserId(userId: number): Promise<Queja[]>;
  getQuejaById(id: number): Promise<Queja | undefined>;
  updateQueja(id: number, updates: Partial<Queja>): Promise<Queja | undefined>;
  deleteQueja(id: number): Promise<boolean>;
  getAllQuejas(): Promise<Queja[]>;
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
    const [user] = await db
      .insert(users)
      .values(insertUser)
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

  async getQuejasByUserId(userId: number): Promise<Queja[]> {
    return await db
      .select()
      .from(quejas)
      .where(eq(quejas.usuarioId, userId))
      .orderBy(desc(quejas.createdAt));
  }

  async getQuejaById(id: number): Promise<Queja | undefined> {
    const [queja] = await db.select().from(quejas).where(eq(quejas.id, id));
    return queja || undefined;
  }

  async updateQueja(id: number, updates: Partial<Queja>): Promise<Queja | undefined> {
    const [queja] = await db
      .update(quejas)
      .set(updates)
      .where(eq(quejas.id, id))
      .returning();
    return queja || undefined;
  }

  async deleteQueja(id: number): Promise<boolean> {
    const result = await db.delete(quejas).where(eq(quejas.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getAllQuejas(): Promise<Queja[]> {
    return await db
      .select()
      .from(quejas)
      .orderBy(desc(quejas.createdAt));
  }
}

export const storage = new DatabaseStorage();
