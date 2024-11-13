import { ReturnedData } from "dts/anthropic";

export const prettyPrintResults = (analysis: ReturnedData, startDate: Date, endDate: Date) => {
  console.log("\n📊 Analysis Summary");
  console.log("═════════════════\n");

  console.log("📅 Date Range:");
  console.log(`├─ From: ${startDate ? startDate.toLocaleDateString() : 'Beginning'}`);
  console.log(`└─ To: ${endDate ? endDate.toLocaleDateString() : 'Present'}\n`);

  console.log("📝 Usage Statistics:");
  console.log(`├─ Total Input Tokens: ${analysis.totalInputTokens?.toLocaleString()}`);
  console.log(`├─ Total Output Tokens: ${analysis.totalOutputTokens?.toLocaleString()}`);
  console.log(`└─ Total Tokens: ${(analysis.totalInputTokens + analysis.totalOutputTokens)?.toLocaleString()}\n`);

  console.log("💰 Cost Breakdown:");
  console.log(`└─ Total Cost: $${analysis.totalCost?.toFixed(2)}\n`);

  const monthlyApiCostEstimation = analysis.totalCost || 0;
  const claudePro = 20;

  console.log("💡 Subscription Comparison:");
  console.log(`├─ Chat usage cost based on API prices: $${monthlyApiCostEstimation.toFixed(2)}`);
  console.log(`├─ Claude Pro: $${claudePro.toFixed(2)}`);
  console.log(`└─ Recommendation: ${monthlyApiCostEstimation > claudePro ? "Consider Claude Pro Subscription" : "Consider API credits instead of Claude Pro subscription"}\n`);
}