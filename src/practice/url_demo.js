const url = require('url');

const myUrl = new URL('http://mywebsite.com/hello.html?id=100&status=active');

console.log(myUrl);

myUrl.searchParams.append('abc', '123');

console.log(myUrl.searchParams);
