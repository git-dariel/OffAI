export interface MessageType {
  content: string | { text: string; image?: string };
  isUser: boolean;
}
