export interface Message {
  sender: string;
  content: string;
}

export interface CompleteMessage {
  message_ID: number;
  sender: number;
  content: string;
  createdAt: Date;
  receiver: number;
}
