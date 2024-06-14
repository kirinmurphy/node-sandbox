const { AI_MODEL_NAME } = require("./constants");

async function queryCincoBot ({ openai, messages }) {
  try {
    const response = await openai.chat.completions
      .create({ messages, model: AI_MODEL_NAME });

    return response?.choices[0]?.message?.content;
  } catch (error) {
    console.error('Error communicating with OpenAI API:', error);
    return `Sorry, there was an error processing your request.`;
  }
};

module.exports = { queryCincoBot };