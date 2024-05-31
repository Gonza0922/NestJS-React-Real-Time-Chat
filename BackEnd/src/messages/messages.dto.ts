export interface CreateMessageDto {
  sender: number;
  content: string;
  type: string;
}

export interface finalReceiverDto {
  name: string;
  data: number[] | undefined;
}
