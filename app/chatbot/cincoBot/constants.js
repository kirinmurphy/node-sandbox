const CHATBOT_NAME = 'CincoBot';

const AI_MODEL_NAME = 'gpt-3.5-turbo';

const BOT_PROMPT_KEYWORD = '@computer'

const MAX_CHAT_HISTORY_COUNT = 20;

const AI_CHAT_ROLES = {
  user: 'user',
  assistant: 'assistant',
  system: 'system',
}

module.exports = { 
  BOT_PROMPT_KEYWORD,
  CHATBOT_NAME, 
  AI_MODEL_NAME, 
  AI_CHAT_ROLES,
  MAX_CHAT_HISTORY_COUNT
};
