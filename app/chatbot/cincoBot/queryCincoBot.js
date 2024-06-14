const { AI_MODEL_NAME } = require("./constants.js");
const { openAiClient } = require("./openAiClient.js")

async function queryCincoBot ({ messages }) {
  try {
    const response = await openAiClient.chat.completions
      .create({ messages, model: AI_MODEL_NAME });

    return response?.choices[0]?.message?.content;
  } catch (error) {
    console.error('Error communicating with OpenAI API:', error);
    return `Sorry, there was an error processing your request.`;
  }
};

module.exports = { queryCincoBot };