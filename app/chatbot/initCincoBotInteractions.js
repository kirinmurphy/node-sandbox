const { sendMessage } = require('./actions/sendMessage');
const { getCincoBotChatResponse } = require('./cincoBot/getCincoBotChatResponse');
const { getCincoBotKeywordBlurbs } = require('./cincoBot/getCincoBotKeywordBlurbs');
const { saveThings } = require('./mentionedEntities/serverEvents');

const { CHATBOT_NAME } = require("./cincoBot/constants");

async function initCicoBotInteractions ({ userMessage, roomData, ...messageConfig }) {
  const { collection } = messageConfig;
  const messageIsAiPrompt = userMessage && userMessage.startsWith('@computer');

  if ( messageIsAiPrompt ) {
    const message = await getCincoBotChatResponse({ message: userMessage, collection });
    const usernameOverride = CHATBOT_NAME;
    await sendMessage({ ...messageConfig, message, usernameOverride });
  } 

  const entities = await getCincoBotKeywordBlurbs({ userMessage, roomData });
  try {
    const mentionedEntities = JSON.parse(entities);
    await saveThings({ mentionedEntities, roomId: roomData.roomId });

  } catch (err) {
    console.log('mentionedEntities was not in the correct json format');
  }
}

module.exports = { initCicoBotInteractions };
