const { OpenAI } = require('openai');
const { sendMessage } = require('./action-sendMessage');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getChatGPTResponse = async (userMessage) => {
  try {
    const response = await openai.chat.completions.create({
      messages: [{ role: 'user', content: userMessage }],
      model: 'gpt-3.5-turbo',
    });

    return response?.choices[0]?.message?.content;
  } catch (error) {
    console.error('Error communicating with OpenAI API:', error);
    throw new Error('Error communicating with OpenAI API');
  }
};

const getCincoBotResponse = async (msg) => {
  const userMessage = msg.replace('@computer', '').trim();
  try {
    const aiMessage = await getChatGPTResponse(userMessage);
    return `Cinco bot: ${aiMessage}`;
  } catch (error) {
    return 'Cinco bot: Sorry, there was an error processing your request.';
  }
};

async function initCincoBotResponse ({ message, ...messageConfig }) {
  const aiResponse = await getCincoBotResponse(message);
  const usernameOverride = 'CincoBot';
  await sendMessage({ ...messageConfig, message: aiResponse, usernameOverride });
}

module.exports = { initCincoBotResponse };
