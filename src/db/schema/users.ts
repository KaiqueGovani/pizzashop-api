import { pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'

export const userRoleEnum = pgEnum('user_role', ['manager', 'customer'])

export const users = pgTable('user', {
  id: text('id').primaryKey().$defaultFn(createId),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  role: userRoleEnum('role').notNull().default('customer'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})
