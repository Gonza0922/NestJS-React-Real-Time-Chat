export interface Message {
  message_ID?: number;
  sender: string;
  content: string;
  createdAt: string;
  receiver?: string;
}

export interface CompleteMessage {
  message_ID: number;
  sender: number;
  content: string;
  createdAt: Date;
  receiver: number;
}
