const { sendMessage } = require('./actions/sendMessage');
const { getCincoBotChatResponse } = require('./cincoBot/getCincoBotChatResponse');
const { getCincoBotKeywordBlurbs } = require('./cincoBot/getCincoBotKeywordBlurbs');
const { saveThings } = require('./mentionedEntities/serverEvent');

const { CHATBOT_NAME } = require("./cincoBot/constants");

async function initCicoBotInteractions ({ userMessage, roomData, ...messageConfig }) {
  const { collection } = messageConfig;
  const messageIsAiPrompt = userMessage && userMessage.startsWith('@computer');

  if ( messageIsAiPrompt ) {
    const message = await getCincoBotChatResponse({ message: userMessage, collection });
    const usernameOverride = CHATBOT_NAME;
    await sendMessage({ ...messageConfig, message, usernameOverride });
  } 

  try {
    const mentionedEntities = await getCincoBotKeywordBlurbs({ userMessage, roomData });
    await saveThings({ mentionedEntities, roomId: Number(roomData.id) });

  } catch (err) {
    console.log('mentionedEntities was not in the correct json format');
  }
}

module.exports = { initCicoBotInteractions };
