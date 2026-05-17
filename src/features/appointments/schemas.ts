import { z } from "zod";

export const appointmentSchema = z.object({
  branchId:        z.string().min(1),
  doctorInfoId:    z.string().min(1),
  patientId:       z.string().min(1),
  patientName:     z.string(),
  visitTypeId:     z.string().min(1),
  date:            z.string().min(1),   // "YYYY-MM-DD"
  discountPercent: z.coerce.number().min(0).max(100).optional().or(z.literal("")),
  markAsPaid:      z.boolean().default(false),
});

export type AppointmentFormData = z.infer<typeof appointmentSchema>;
