# Claude Sonnet Cost Tracker

A TypeScript utility for analyzing and tracking costs of Claude Sonnet conversations to easily compare claude.ai pricing compared to potential anthropic API credits usage.

## Installation

```bash
npm install @anthropic-ai/sdk dotenv
```

## Usage

```typescript
import AnthropicClass from "./class/anthropic.class";
import { Chat } from "./dts/anthropic";
import fs from "fs";

// Initialize with API key
const anthropic = new AnthropicClass(); // Uses ANTHROPIC_API_KEY from .env
// Or
const anthropic = new AnthropicClass("your-api-key");

// Get info for all conversations
const conversations: Chat[] = // your conversation history 
// OR
const conversations: Chat[] = JSON.parse(fs.readFileSync("conversations.json", "utf8")); // conversations.json from claude.ai "Export data" feature

const info = await anthropic.getInfoHistoryConversation(conversations);

// Get info for specific timeframe
const startDate = 1730305080000; // Unix timestamp in milliseconds
const endDate = 1730391480000;   // Unix timestamp in milliseconds
const timeframeInfo = await anthropic.getInfoHistoryConversation(
    conversations, 
    startDate, 
    endDate
);

// Get info starting from a specific date
const startDate = 1730305080000; // Unix timestamp in milliseconds
const info = await anthropic.getInfoHistoryConversation(
    conversations, 
    startDate
);

```

## API Reference

### `getInfoHistoryConversation(conversations, startDate?, endDate?)`

Returns cost and token information for multiple conversations.

#### Parameters
- `conversations: Chat[]` - Array of conversation objects
- `startDate?: number` - Optional start timestamp in milliseconds
- `endDate?: number` - Optional end timestamp in milliseconds

#### Returns
```typescript
{
    conversationsCost: {
        [uuid: string]: {
            inputPrice: number;
            outputPrice: number;
            totalPrice: number;
            inputTokens: number;
            outputTokens: number;
            totalTokens: number;
        }
    };
    totalCost: number;
    totalInputTokens: number;
    totalOutputTokens: number;
    numberOfConversations: number;
}
```

### `getInfoSingleConversation(conversation)`

Analyzes a single conversation for cost and token usage.

#### Parameters
- `conversation: Chat` - Single conversation object

#### Returns
```typescript
{
    price: {
        input: number;
        output: number;
        total: number;
    };
    tokens: {
        input: number;
        output: number;
        total: number;
    };
}
```

## Pricing

Current rates for Claude Sonnet 3.5:
- Input tokens: $3.00 per million tokens
- Output tokens: $15.00 per million tokens