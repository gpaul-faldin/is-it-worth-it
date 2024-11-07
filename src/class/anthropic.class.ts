import Anthropic from "@anthropic-ai/sdk";
import { BetaMessageParam } from "@anthropic-ai/sdk/resources/beta/messages/messages";
import { Chat, RetPrice, RetToken, ReturnedData} from "../dts/anthropic";


export default class AnthropicClass {
  private client: Anthropic;
  private static InputPriceMtok: number = 3.0;
  private static InputPricetok: number = this.InputPriceMtok / 1000000;
  private static OutputPriceMtok: number = 15.0;
  private static OutputPricetok: number = this.OutputPriceMtok / 1000000;

  constructor(apiKey?: string) {
    if (!apiKey) {
      this.client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    } else {
      this.client = new Anthropic({ apiKey });
    }
  }

  private getTokenCount(text: string) {
    return this.countTokens([{ role: "user", content: text }]);
  }

  private getTokenCountFromMessages(messages: BetaMessageParam[]) {
    return this.countTokens(messages);
  }

  private async getPriceBasedOnTokens(tokens: number, io: string = "input") {
    if (io === "input") {
      return AnthropicClass.InputPricetok * tokens;
    } else {
      return AnthropicClass.OutputPricetok * tokens;
    }
  }

  public async getInfoHistoryConversation(conversations: Chat[], startDate?: number, endDate?: number): Promise<ReturnedData> {

  var returnedData: ReturnedData = {
    conversationsCost: {},
    totalCost: 0,
    totalInputTokens: 0,
    totalOutputTokens: 0,
    numberOfConversations: 0,
  }

  if (startDate || endDate) {
    if (startDate) {
      conversations = conversations.filter(conversation => new Date(conversation.created_at).getTime() >= startDate)
    }
    if (endDate) {
      conversations = conversations.filter(conversation => new Date(conversation.created_at).getTime() <= endDate)
    }
  }

  for (let i = 0; i < conversations.length; i++) {
    const { price, tokens } = await this.getInfoSingleConversation(
      conversations[i]
    );

    if (tokens.total > 0) {
      returnedData.conversationsCost[conversations[i].uuid] = {
        inputPrice: price.input,
        outputPrice: price.output,
        totalPrice: price.total,
        inputTokens: tokens.input,
        outputTokens: tokens.output,
        totalTokens: tokens.total,
      };
      returnedData.totalCost += price.total;
      returnedData.totalInputTokens += tokens.input;
      returnedData.totalOutputTokens += tokens.output;
      returnedData.numberOfConversations += 1;
    }
  }

  return returnedData

  }

  public async getInfoSingleConversation(conversation: Chat): Promise<{price: RetPrice, tokens: RetToken}> {

    const messages = conversation.chat_messages
    var context: BetaMessageParam[] = []

    var tokens = {
      input: 0,
      output: 0,
      total: 0
    }

    var price = {
      input: 0,
      output: 0,
      total: 0
    }

    for (let i = 0; i < messages.length; i++) {
      if (messages[i].text.length === 0) {
        continue
      }

      context.push({
        role: messages[i].sender === "human" ? "user" : "assistant",
        content: messages[i].content[0].text
      })
      
      if (messages[i].sender === "human") {
        let inputToken = await this.getTokenCountFromMessages(context)
        tokens.input += inputToken 
        tokens.total += inputToken
        let tempPrice = await this.getPriceBasedOnTokens(tokens.total, "input")
        price.input += tempPrice
      } else if (messages[i].sender === "assistant") {

        let outputToken = await this.getTokenCount(messages[i].content[0].text)
        tokens.output += outputToken
        tokens.total += outputToken
        let tempPrice = await this.getPriceBasedOnTokens(outputToken, "output")
        price.output += tempPrice

      }
    }

    price.total = price.input + price.output

    return {price, tokens}

  }

  private async countTokens(messages: BetaMessageParam[]) {
    const response = await this.client.beta.messages.countTokens({
      betas: ["token-counting-2024-11-01"],
      model: "claude-3-5-sonnet-20241022",
      messages: messages,
    });

    return response.input_tokens;
  }
}
