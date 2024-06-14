const { sendMessage } = require('./actions/sendMessage');
const { getCincoBotChatResponse } = require('./cincoBot/getCincoBotChatResponse');
const { getCincoBotKeywordBlurbs } = require('./cincoBot/getCincoBotKeywordBlurbs');

const { CHATBOT_NAME } = require("./cincoBot/constants");

async function initCicoBotInteractions ({ userMessage, ...messageConfig }) {
  const { collection } = messageConfig;
  const isAiPrompt = userMessage && userMessage.startsWith('@computer');

  if ( isAiPrompt ) {
    const response = await getCincoBotChatResponse({ message: userMessage, collection });
    const usernameOverride = CHATBOT_NAME;
    await sendMessage({ ...messageConfig, message: response, usernameOverride });
  } else {
    const things = await getCincoBotKeywordBlurbs({ userMessage });
    console.log('thinggggs', things);
  }
}

module.exports = { initCicoBotInteractions };