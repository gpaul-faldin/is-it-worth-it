import dotenv from "dotenv";
import fs from "fs";
dotenv.config(
  {
    path: ".env.local"
  }
);

import AnthropicClass from "./class/anthropic.class";
import { Chat } from "./dts/anthropic";

(async() => {

  const anthropic = new AnthropicClass();
  const data: Chat = JSON.parse(fs.readFileSync("test.json", "utf8"));


  const info = await anthropic.getInfoHistoryConversation([data])
  fs.writeFileSync("info.json", JSON.stringify(info, null, 2))

})()

