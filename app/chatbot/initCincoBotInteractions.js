const { sendMessage } = require('./actions/sendMessage');
const { getCincoBotChatResponse } = require('./cincoBot/getCincoBotChatResponse');
const { getCincoBotKeywordBlurbs } = require('./cincoBot/getCincoBotKeywordBlurbs');

const { CHATBOT_NAME } = require("./cincoBot/constants");

async function initCicoBotInteractions ({ userMessage, saveThings, roomProps, ...messageConfig }) {
  const { collection } = messageConfig;
  const messageIsAiPrompt = userMessage && userMessage.startsWith('@computer');

  if ( messageIsAiPrompt ) {
    const response = await getCincoBotChatResponse({ message: userMessage, collection });
    const usernameOverride = CHATBOT_NAME;
    await sendMessage({ ...messageConfig, message: response, usernameOverride });
  } else {
    const entities = await getCincoBotKeywordBlurbs({ userMessage, roomProps });
    try {
      const parsedEntities = JSON.parse(entities);
      await saveThings(parsedEntities);

    } catch (err) {
      console.log('mentionedEntities was not in the correct json format');
    }
  }
}

module.exports = { initCicoBotInteractions };
