const { AI_CHAT_ROLES } = require('./constants.js');
const { getMentionedEntityPrePrompt } = require('./getMentionedEntityPrePrompt.js');
const { queryCincoBot } = require('./queryCincoBot.js');

async function getCincoBotKeywordBlurbs ({ userMessage, roomProps }) {
  const keywords = getAllCapitalizedWords({ text: userMessage });
  if ( keywords.size === 0 ) { return null; } 
  const messages = formatMessagePayload({ keywords, roomProps });
  return await queryCincoBot({ messages }); 
}

// Capitalized words that are together are considered one word
// All Caps words are also included 
function getAllCapitalizedWords ({ text }) {
  const regex = /([A-Z][a-z]*([A-Z][a-z]*|\s[A-Z][a-z]*)*)/g;
  const matches = text.match(regex);
  const dedupedSet = new Set(matches);
  return dedupedSet;
}

function formatMessagePayload ({ keywords, roomProps }) {
  const keywordString = Array.from(keywords).join(', ');
  const prePrompt = getMentionedEntityPrePrompt({ roomProps }); 
  const formattedMsg = `${prePrompt} ${keywordString}`;
  return [{ role: AI_CHAT_ROLES.user, content: formattedMsg }]; 
}

module.exports = { getCincoBotKeywordBlurbs };
