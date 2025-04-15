import User from "./User";

export interface Message {
  id: number;
  sender_id: number;
  recipient_id: number;
  content: string;
  created_at: string;

  recipient?: User;
}
