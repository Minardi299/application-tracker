import type { Request } from "express";

export interface ApplicationUserDTO {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  profilePictureUrl: string | null;
  totalApplicationCount: number;
  createdAt: Date;
}

export interface FolderDTO {
  id: string;
  name: string;
  createdAt: Date;
  ownerId: string;
  applicationCount: number;
}

export type ApplicationStatus =
  | "Wishlist"
  | "Applied"
  | "Interviewing"
  | "Offered"
  | "Rejected"
  | "Accepted"
  | "Withdrawn";

export const STATUS_MAP: ApplicationStatus[] = [
  "Wishlist",
  "Applied",
  "Interviewing",
  "Offered",
  "Rejected",
  "Accepted",
  "Withdrawn",
];

export function statusToInt(status: ApplicationStatus | number | string): number {
  if (typeof status === "number") return status;
  const idx = STATUS_MAP.indexOf(status as ApplicationStatus);
  if (idx >= 0) return idx;
  const parsed = parseInt(String(status));
  if (!Number.isNaN(parsed)) return parsed;
  throw new Error(`Invalid status: ${status}`);
}

export function statusToString(status: number): ApplicationStatus {
  const value = STATUS_MAP[status];
  if (!value) throw new Error(`Invalid status int: ${status}`);
  return value;
}

export interface JobApplicationDTO {
  id: string;
  companyName: string | null;
  position: string | null;
  jobPostingUrl: string | null;
  notes: string | null;
  status: ApplicationStatus;
  createdAt: Date;
  updatedDate: Date | null;
  ownerId: string;
  folders: FolderDTO[];
}

export interface TodoItemDTO {
  id: number;
  name: string | null;
  isComplete: boolean;
  description: string | null;
}

export interface AuthenticatedRequest extends Request {
  user: { id: string };
}

declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}
