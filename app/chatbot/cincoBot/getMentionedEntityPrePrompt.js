const mentionedEntityPreprompt = `I would like you to scan through this list of entities, and identify anything that is a proper noun or a unique entity.  Some words are not proper nouns, please ignore those.  For the rest.  

Please give me a rare fact about each topic, related to the theme of this conversation.  The theme of this conversation is ROOM_NAME - ROOM_DESCRIPTION.  Please make sure that the fact is unique to the topic and the theme.

At the end of the message, can you include links to the entitys webpage and their main website (if it is a product or a brand).  The links should be printed in html form with the href link and a target blank. 

Please return the data in json format with properites "entity" and "fact" - like [{ "entity": "Apple", "fact": "Apple was founded by Steve Jobs in 1976 <a href=\"apple.com\"" target=\"_blank\">Apple.com</a>" }, ...].  

Please make sure that the text is in proper JSON format including properly escaping quotes.

Please limit th fact for each entity to under 100 characters.  

Here are the entities: `;


function getMentionedEntityPrePrompt({ roomProps = {} }) {
  const { name, description } = roomProps;
  return mentionedEntityPreprompt
    .replace('ROOM_NAME', name)
    .replace('ROOM_DESCRIPTION', description);
}

module.exports = { getMentionedEntityPrePrompt };
