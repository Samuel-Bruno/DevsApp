export type AddChatRes = {
  success: boolean;
  error?: {
    code: string;
    message: string;
  }
}

export type OtherUser = {
  id: string;
  email: string;
  avatar: string;
  name: string;
}