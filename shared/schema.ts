import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  nombre: varchar("nombre", { length: 100 }).notNull(),
  apellido: varchar("apellido", { length: 100 }).notNull(),
  cedula: varchar("cedula", { length: 20 }).notNull().unique(),
  celular: varchar("celular", { length: 20 }).notNull(),
  correo: varchar("correo", { length: 255 }).notNull().unique(),
  tipoUsuario: varchar("tipo_usuario", { length: 50 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const quejas = pgTable("quejas", {
  id: serial("id").primaryKey(),
  usuarioId: integer("usuario_id").references(() => users.id).notNull(),
  problema: varchar("problema", { length: 255 }).notNull(),
  detalle: text("detalle").notNull(),
  ciudad: varchar("ciudad", { length: 100 }).notNull(),
  departamento: varchar("departamento", { length: 100 }).notNull(),
  clasificacion: varchar("clasificacion", { length: 50 }).notNull(),
  soporte: text("soporte"), // JSON string of file paths
  paraBeneficiario: boolean("para_beneficiario").default(false),
  estado: varchar("estado", { length: 50 }).default("en_proceso"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  quejas: many(quejas),
}));

export const quejasRelations = relations(quejas, ({ one }) => ({
  usuario: one(users, {
    fields: [quejas.usuarioId],
    references: [users.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertQuejaSchema = createInsertSchema(quejas).omit({
  id: true,
  createdAt: true,
  estado: true,
});

export const loginSchema = z.object({
  cedula: z.string().min(1, "Cédula es requerida"),
  password: z.string().min(1, "Contraseña es requerida"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertQueja = z.infer<typeof insertQuejaSchema>;
export type Queja = typeof quejas.$inferSelect;
export type LoginData = z.infer<typeof loginSchema>;
