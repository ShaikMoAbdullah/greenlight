export type Role = "requester" | "approver";

export type RequestStatus = "pending" | "approved" | "denied" | "cancelled";

export type LeaveType = "vacation" | "sick" | "personal" | "other";

export interface Profile {
  id: string;
  full_name: string;
  role: Role;
  created_at: string;
}

export interface TimeOffRequest {
  id: string;
  requester_id: string;
  leave_type: LeaveType;
  start_date: string; // ISO date (YYYY-MM-DD)
  end_date: string; // ISO date (YYYY-MM-DD)
  reason: string;
  status: RequestStatus;
  reviewer_id: string | null;
  review_note: string | null;
  decided_at: string | null;
  created_at: string;
}

/** A request joined with the requester's and reviewer's display names. */
export interface RequestWithPeople extends TimeOffRequest {
  requester: Pick<Profile, "full_name"> | null;
  reviewer: Pick<Profile, "full_name"> | null;
}

export const LEAVE_TYPE_LABELS: Record<LeaveType, string> = {
  vacation: "Vacation",
  sick: "Sick leave",
  personal: "Personal",
  other: "Other",
};

export const STATUS_LABELS: Record<RequestStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  denied: "Denied",
  cancelled: "Cancelled",
};
