const { OpenAI } = require('openai');
const { sendMessage } = require('./action-sendMessage');

const CHATBOT_NAME = 'CincoBot';

const PROMPT_SIGNAL = '@computer';

const CHAT_ROLES = {
  user: 'user',
  assistant: 'assistant',
  system: 'system',
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function initCincoBotResponse ({ message, ...messageConfig }) {
  const filteredCollection = await getFilteredBotChat(messageConfig);
  const chatHistory = getChatFormattedForGPT({ filteredCollection, message });
  const aiResponse = await getCincoBotResponse({ chatHistory });
  const usernameOverride = CHATBOT_NAME;
  await sendMessage({ ...messageConfig, message: aiResponse, usernameOverride });
}

async function getFilteredBotChat ({ collection }) {
  const promptFilter = { text: { $regex: PROMPT_SIGNAL, $options: 'i' }};
  const botFilter = { username: CHATBOT_NAME };
  const query = { $or: [promptFilter, botFilter] };
  const options = { sort: { timestamp: -1 }, limit: 20 };
  return await collection.find(query, options).toArray();
}

function getChatFormattedForGPT ({ filteredCollection, message }) {
  const formattedFilteredCollection = filteredCollection.map(({ username, text }) => {
    const role = username === CHATBOT_NAME ? CHAT_ROLES.assistant : CHAT_ROLES.user;
    return { role, content: text };
  });

  const userMessageText = message.replace(PROMPT_SIGNAL, '').trim();
  const userMessage = { role: CHAT_ROLES.user, content: userMessageText };
  return [...formattedFilteredCollection, userMessage];
}

const getCincoBotResponse = async ({ chatHistory }) => {
  try {
    const response = await openai.chat.completions
      .create({ messages: chatHistory, model: 'gpt-3.5-turbo' });

    const aiMessage = response?.choices[0]?.message?.content;
    return `${CHATBOT_NAME}: ${aiMessage}`;
  } catch (error) {
    console.error('Error communicating with OpenAI API:', error);
    return `${CHATBOT_NAME}: Sorry, there was an error processing your request.`;
  }
};

module.exports = { initCincoBotResponse };
