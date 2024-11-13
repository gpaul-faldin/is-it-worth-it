import dotenv from "dotenv";
import { Command } from 'commander';
import fs from "fs";
dotenv.config(
  {
    path: ".env"
  }
);
import AnthropicClass from "./class/anthropic.class";
import { Chat } from "./dts/anthropic";
import { prettyPrintResults } from "./utils/pretty-print";

const program = new Command();

const asciiArt = `
╭─────────────────────────────╮
│     Is It Worth It? (IIWI)  │
│   AI Conversation Analyzer  │
╰─────────────────────────────╯
`;

program
  .name("iiwi")
  .description("Calculate and compare costs between Claude/ChatGPT Pro subscriptions and API usage")
  .version("1.0.0")
  .usage('[command] [options]')
  .addHelpText('beforeAll', asciiArt)
  .addHelpText('afterAll', `
Examples:
  $ iiwi analyze -i ./conversations.json        # Basic analysis with default output
  $ iiwi analyze -i ./data.json -o ./out.json  # Custom input/output paths
  $ iiwi analyze -k YOUR_API_KEY               # Use custom API key
  `);

program
  .command("analyze")
  .description("Analyze conversations and calculate cost comparison")
  .requiredOption('-i, --input <path>', 'Input file path')
  .option('-o, --output <path>', 'Output file path', 'analysis.json')
  .option('--start <date>', 'Start date (YYYY-MM-DD)')
  .option('--end <date>', 'End date (YYYY-MM-DD)')
  .action(async (options) => {
    try {

      if (!process.env.ANTHROPIC_API_KEY) {
        throw new Error("Anthropic API key not set in .env file or as an option");
      }

      let startDate: Date | undefined = new Date("1970-01-01");
      let endDate: Date | undefined = new Date();
      let startTimestamp: number | undefined = 0;
      let endTimestamp: number | undefined = new Date().getTime();

      if (options.start) {
        startDate = new Date(options.start);
        if (isNaN(startDate.getTime())) {
          throw new Error("Invalid start date format. Please use YYYY-MM-DD");
        }
        startTimestamp = startDate.getTime();
      }

      if (options.end) {
        endDate = new Date(options.end);
        if (isNaN(endDate.getTime())) {
          throw new Error("Invalid end date format. Please use YYYY-MM-DD");
        }
        endDate.setHours(23, 59, 59, 999);
        endTimestamp = endDate.getTime();
      }

      const anthropic = new AnthropicClass();
      const data: Chat[] = JSON.parse(fs.readFileSync(options.input, "utf8"));
      const analysis = await anthropic.getInfoHistoryConversation(data, startTimestamp, endTimestamp);

      const enrichedAnalysis = {
        ...analysis,
        dateRange: {
          start: startDate.toISOString(),
          end: endDate.toISOString()
        },
        recommendation: (analysis.totalCost || 0) > 20 ? "Consider Claude Pro Subscription" : "Consider API credits instead of Claude Pro subscription"
      };

      fs.writeFileSync(options.output, JSON.stringify(enrichedAnalysis, null, 2));
      console.log(`\n✅ Analysis saved to ${options.output}`);

      prettyPrintResults(enrichedAnalysis, startDate, endDate);

    } catch (error: any) {
      console.error('\n❌ Error:', error.message);
      process.exit(1);
    }
  });

if (!process.argv.slice(2).length) {
  program.outputHelp();
} else {
  program.parse();
}

// (async() => {

//   const anthropic = new AnthropicClass();
//   const data: Chat[] = JSON.parse(fs.readFileSync("./data/claude/conversations.json", "utf8"));


//   const info = await anthropic.getInfoHistoryConversation(data)
//   fs.writeFileSync("info.json", JSON.stringify(info, null, 2))

// })()


