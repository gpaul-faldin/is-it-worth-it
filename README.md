# Is It Worth It? (IIWI)
A CLI tool that analyzes your Claude.ai conversations to help you decide if it's more cost-effective to use Claude Pro subscription or Anthropic API credits. The tool makes calls to Anthropic API for analysis but doesn't consume any of your API credits.

## Installation
```bash
# Install dependencies
npm install
# Create .env file (based on the .env.example file) and add your Anthropic API key
echo "ANTHROPIC_API_KEY=your-api-key" > .env
```

## Usage
```bash
# Basic analysis
npm run analyze -- -i ./conversations.json
# Specify output file
npm run analyze -- -i ./conversations.json -o ./custom-output.json
# Analysis for specific date range
npm run analyze -- -i ./conversations.json --start 2024-01-01 --end 2024-03-31
# Show help
npm run analyze -- --help
```

## Command Line Options
### analyze
Analyzes conversations and calculates cost comparison
Options:
- `-i, --input <path>` - Input file path (required)
- `-o, --output <path>` - Output file path (defaults to analysis.json)
- `--start <date>` - Start date (YYYY-MM-DD)
- `--end <date>` - End date (YYYY-MM-DD)

## Output
The tool provides two types of output:
1. A JSON file containing detailed analysis:
```json
{
  "conversationsCost": {
    "uuid": {
        "inputPrice": 123.45,
        "outputPrice": 123.45,
        "totalPrice": 123.45,
        "inputTokens": 123456789,
        "outputTokens": 123456789,
        "totalTokens": 123456789
    },
    ...
  },
  "totalCost": 85.28,
  "totalInputTokens": 1234567,
  "totalOutputTokens": 890123,
  "dateRange": {
    "start": "2024-01-01T00:00:00.000Z",
    "end": "2024-03-31T23:59:59.999Z"
  },
  "recommendation": "Consider Claude Pro Subscription"
}
```

2. A pretty-printed console output:
```
📊 Analysis Summary
═════════════════
📅 Date Range:
├─ From: 1/1/2024
└─ To: 3/31/2024
📝 Usage Statistics:
├─ Total Input Tokens: 1,234,567
├─ Total Output Tokens: 890,123
└─ Total Tokens: 2,124,690
💰 Cost Breakdown:
└─ Total Cost: $85.28
💡 Subscription Comparison:
├─ Monthly API Cost: $85.28
├─ Claude Pro: $20.00
└─ Recommendation: Consider Claude Pro Subscription
```

## How It Works
The tool connects to Anthropic's servers to analyze your conversation data. Important notes:
- Makes API calls but doesn't consume any of your API credits
- Analysis results help you make informed decisions about subscription vs. API usage

## Pricing Reference
Current rates for Claude Sonnet:
- Input tokens: $3.00 per million tokens
- Output tokens: $15.00 per million tokens
- Claude Pro subscription: $20.00 per month

## License
MIT

## Author
Gpaul | Faldin#8577
