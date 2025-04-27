import { z } from "zod";

export const NotificationSchema = z.object({
  id: z.string(),
  message: z.string(),
  type: z.enum(["info", "warning", "error", "success"]),
  createdAt: z.date(),
  updatedAt: z.date(),
  isActive: z.boolean(),
});

export type Notification = z.infer<typeof NotificationSchema>;

export const CreateNotificationSchema = NotificationSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  isActive: true,
});

export type CreateNotification = z.infer<typeof CreateNotificationSchema>; 