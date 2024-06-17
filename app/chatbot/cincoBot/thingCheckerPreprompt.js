const thingCheckerPreprompt = `I would like you to scan through this list of words, and identify anything that is a proper noun.  Some words are not proper nouns, please ignore those.  For the rest, please give me a rare fact about the topic, something historical or foundational about the entity.  Or if there are any scandals or conflicts in regard to the entity.  

At the end of the message, can you include links to the entitys webpage and their main website (if it is a product or a brand).  The links should be printed in html form with the href link and a target blank. 

Please return the data in json format with properites "entity" and "fact" - like [{ "entity": "Apple", "fact": "Apple was founded by Steve Jobs in 1976 <a href=\"apple.com\"" target=\"_blank\">Apple.com</a>" }, ...].  

Please make sure that the text is in proper JSON format including properly escaping quotes.

Here are the the words: `;


// function getThingCheckerPreprompt({ room: { name, username } }) {
//   return thingCheckerPreprompt.replace(ROOM_NAME, room);
// }


module.exports = { thingCheckerPreprompt };

