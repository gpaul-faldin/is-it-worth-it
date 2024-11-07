// Token-related interfaces
export interface RetToken {
  input: number;
  output: number;
  total: number;
}

export interface RetPrice {
  input: number;
  output: number;
  total: number;
}

// Chat-related interfaces
export interface MessageContent {
  type: string;
  text: string;
}

export interface ChatMessage {
  uuid: string;
  text: string;
  content: MessageContent[];
  sender: string;
  created_at: string;
  updated_at: string;
  attachments: any[];
  files: any[];
}

export interface Account {
  uuid: string;
}

export interface Chat {
  uuid: string;
  name: string;
  created_at: string;
  updated_at: string;
  account: Account;
  chat_messages: ChatMessage[];
}

// Cost-related interfaces
export interface ConversationCost {
  inputPrice: number;
  outputPrice: number;
  totalPrice: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
}

export interface ReturnedData {
  conversationsCost: {
    [uuid: string]: ConversationCost;
  };
  totalCost: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  numberOfConversations: number;
}