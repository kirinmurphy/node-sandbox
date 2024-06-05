const { chatRoomResourceProps } = require("./chatRooms");
const { userResourceProps, 
  userResourceCustomRoutes } = require("./users");

const resourceConfig = [
  { 
    endpoint: '/api/users', 
    props: userResourceProps, 
    customRoutes: userResourceCustomRoutes 
  },
  { 
    endpoint: '/api/chatRooms', 
    props: chatRoomResourceProps 
  }
];

module.exports = resourceConfig;
