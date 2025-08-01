const http = require("http");

const hostname = "127.0.0.1";
const port = 3000;

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Hello Users");
  } else if (req.url === "/users") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Thanks for visiting the users page");
  } else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.end("404 Not found");
  }
});

server.listen(port, hostname, () => {
  console.log(`Server is listening at http://${hostname}:${port}/`);
});

/*
when you run this code also you have application name was postman
you also required to install from your system.
once you can install all the requirements you can just 
1.run this code 
2.copy the url like "https:// 127.0.0.1" 
3.go to postman app 
4.click the new button 
5.select the "http"
6.paste it here.
*/
