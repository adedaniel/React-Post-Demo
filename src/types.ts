export interface IChannel {
  id: string;
  body: string;
  subject: string;
  createdAt: { seconds: number; nanoseconds: number } | Date;
}

export interface IReplies {
  text: string;
  authorEmail: string;
  authorImage: string;
  authorName: string;
  channelId: string;
  id: string;
  createdAt: { seconds: number; nanoseconds: number } | Date;
}
