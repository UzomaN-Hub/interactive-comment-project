// I'm creating a central place for my TypeScript types.


// This defines the shape for a single comment or reply.
export interface CommentData {
  id: number;
  content: string;
  createdAt: string;
  score: number;
  user: User;
  replies: CommentData[];
  replyingTo?: string;
}

// This defines the shape for a user object.
export interface User {
  image: {
    png: string;
    webp: string;
  };
  username: string;
}