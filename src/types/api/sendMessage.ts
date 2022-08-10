export type SendMessageProps = {
  msgType: 'text';
  msgBody: string;
  chatId: string;
  chatUsers: string[];
  userId: string;
}