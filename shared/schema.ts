import { pgTable, text, serial, boolean, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  nombre: text("nombre").notNull(),
  apellido: text("apellido").notNull(),
  cedula: text("cedula").unique().notNull(),
  celular: text("celular").notNull(),
  clave: text("clave").notNull(),
  tipoUsuario: text("tipo_usuario").notNull(),
  correo: text("correo").notNull(),
  aceptoPolitica: boolean("acepto_politica").default(false),
  fechaAceptacion: timestamp("fecha_aceptacion"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const quejas = pgTable("quejas", {
  id: serial("id").primaryKey(),
  usuarioId: integer("usuario_id").references(() => users.id),
  problema: text("problema").notNull(),
  detalle: text("detalle").notNull(),
  ciudad: text("ciudad").notNull(),
  departamento: text("departamento").notNull(),
  correo: text("correo").notNull(),
  clasificacion: text("clasificacion").notNull(),
  soporte: text("soporte"),
  paraBeneficiario: boolean("para_beneficiario").default(false),
  estado: text("estado").default("pendiente"),
  fechaCreacion: timestamp("fecha_creacion").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertQuejaSchema = createInsertSchema(quejas).omit({
  id: true,
  fechaCreacion: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertQueja = z.infer<typeof insertQuejaSchema>;
export type Queja = typeof quejas.$inferSelect;