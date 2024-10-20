export interface ChatMessage {
    text?: string;
    sender: 'user' | 'bot';
    image?: string;
    videoUrl?: string;
    linkUrl?: string;
    linkText?: string;
  }
  