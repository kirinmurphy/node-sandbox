const { AI_CHAT_ROLES } = require('./constants.js');
const { thingCheckerPreprompt } = require('./thingCheckerPreprompt.js');
const { queryCincoBot } = require('./queryCincoBot.js');

async function getCincoBotKeywordBlurbs ({ userMessage }) {
  const keywords = getAllCapitalizedWords({ text: userMessage });
  if ( keywords.size === 0 ) { return null; } 
  const keywordString = Array.from(keywords).join(', ');
  const formattedMsg = `${thingCheckerPreprompt} ${keywordString}`;
  const messages = [{ role: AI_CHAT_ROLES.user, content: formattedMsg }]; 
  return await queryCincoBot({ messages }); 
}

function getAllCapitalizedWords ({ text }) {
  // Capitalized words that are together are considered one word
  // All Caps words are also included 
  const regex = /([A-Z][a-z]*([A-Z][a-z]*|\s[A-Z][a-z]*)*)/g;
  const matches = text.match(regex);
  const dedupedSet = new Set(matches);
  return dedupedSet;
}

module.exports = { getCincoBotKeywordBlurbs };