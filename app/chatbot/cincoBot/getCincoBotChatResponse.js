

const { CHATBOT_NAME, AI_CHAT_ROLES, BOT_PROMPT_KEYWORD, MAX_CHAT_HISTORY_COUNT } = require('./constants');
const { queryCincoBot } = require('./queryCincoBot');

async function getCincoBotChatResponse ({ message, collection }) {
  const filteredCollection = await getFilteredBotChatHistory({ collection });
  const messages = getChatFormattedForGPT({ filteredCollection, message });
  return await queryCincoBot({ messages });
}

module.exports = { getCincoBotChatResponse };

async function getFilteredBotChatHistory ({ collection }) {
  const promptFilter = { text: { $regex: BOT_PROMPT_KEYWORD, $options: 'i' }};
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

  const userMessageText = message.replace(BOT_PROMPT_KEYWORD, '').trim();
  const userMessage = { role: AI_CHAT_ROLES.user, content: userMessageText };
  return [...formattedFilteredCollection, userMessage];
}
