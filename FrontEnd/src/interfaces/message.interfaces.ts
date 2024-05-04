export interface Message {
  message_ID?: number;
  sender: string;
  content: string;
  createdAt: string;
  receiver?: string;
}
