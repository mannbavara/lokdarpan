// TypeScript interfaces for Corrective Action module

export enum CorrectiveActionStatus {
  OPEN = 'open',
  CLOSED = 'closed'
}

export interface CorrectiveAction {
  id: string;
  complaint_id: string;
  org_id: string;
  ca_number: string;
  target_date?: string;
  action_required: string;
  status: CorrectiveActionStatus;
  closed_by?: string;
  closed_at?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CorrectiveActionCreate {
  action_required: string;
  target_date?: string;
}

export interface CorrectiveActionUpdate {
  action_required?: string;
  target_date?: string;
}

export interface LinkedNCR {
  id: string;
  corrective_action_id: string;
  ncr_id: string;
  created_by: string;
  created_at: string;
}

export interface LinkedRootCause {
  id: string;
  corrective_action_id: string;
  root_cause_id: string;
  created_by: string;
  created_at: string;
}

export interface CANotification {
  id: string;
  corrective_action_id: string;
  sent_to: string;
  action_details: string;
  reply_required_at: string;
  reminder_enabled: boolean;
  reminder_count: number;
  last_reminder_sent_at?: string;
  replied_at?: string;
  reply_comments?: string;
  sent_at: string;
  created_by: string;
  created_at: string;
}

export interface NotificationCreate {
  sent_to: string[];
  action_details: string;
  reply_required_at: string;
  reminder_enabled: boolean;
}

export interface NotificationReply {
  reply_comments: string;
}

export interface CADocument {
  id: string;
  corrective_action_id: string;
  document_name: string;
  document_path: string;
  document_type?: string;
  file_size?: number;
  uploaded_by: string;
  created_at: string;
}

export interface DocumentCreate {
  document_name: string;
  document_path: string;
  document_type?: string;
  file_size?: number;
}
