const { OpenAI } = require('openai');
const { sendMessage } = require('../action-sendMessage');
const { CHATBOT_NAME, AI_CHAT_ROLES } = require('./constants');
const { queryCincoBot } = require('./queryCincoBot');


const PROMPT_SIGNAL = '@computer';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function initCincoBotConversation ({ message, ...messageConfig }) {
  const filteredCollection = await getFilteredBotChat(messageConfig);
  const messages = getChatFormattedForGPT({ filteredCollection, message });
  const cincoBotResponse = await queryCincoBot({ openai, messages });
  const usernameOverride = CHATBOT_NAME;
  await sendMessage({ ...messageConfig, message: cincoBotResponse, usernameOverride });
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
    const role = username === CHATBOT_NAME ? AI_CHAT_ROLES.assistant : AI_CHAT_ROLES.user;
    return { role, content: text };
  });

  const userMessageText = message.replace(PROMPT_SIGNAL, '').trim();
  const userMessage = { role: AI_CHAT_ROLES.user, content: userMessageText };
  return [...formattedFilteredCollection, userMessage];
}

module.exports = { initCincoBotConversation };
