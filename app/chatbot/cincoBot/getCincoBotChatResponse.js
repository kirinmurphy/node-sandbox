

const { CHATBOT_NAME, AI_CHAT_ROLES } = require('./constants');
const { queryCincoBot } = require('./queryCincoBot');

const PROMPT_SIGNAL = '@computer';
const MAX_CHAT_HISTORY_COUNT = 20;

async function getCincoBotChatResponse ({ message, collection }) {
  const filteredCollection = await getFilteredBotChatHistory({ collection });
  const messages = getChatFormattedForGPT({ filteredCollection, message });
  return await queryCincoBot({ messages });
}

async function getFilteredBotChatHistory ({ collection }) {
  const promptFilter = { text: { $regex: PROMPT_SIGNAL, $options: 'i' }};
  const botFilter = { username: CHATBOT_NAME };
  const query = { $or: [promptFilter, botFilter] };
  const options = { sort: { timestamp: -1 }, limit: MAX_CHAT_HISTORY_COUNT };
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

module.exports = { getCincoBotChatResponse };
