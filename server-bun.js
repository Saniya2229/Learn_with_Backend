import { serve } from "bun";

serve({
  fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === "/") {
      return new Response("Hello Users From BUN", { status: 200 });
    } else if (url.pathname === "/users-bun") {
      return new Response("Hello Users From Users-bun", { status: 200 });
    } else {
      return new Response("404 Not Found", { status: 404 });
    }
  },
  port: 3000,
  hostname: "127.0.0.1",
});

/*NOTE: When you run this code you need to install BUN in your system.
and then run as same as node like
bun server-bun.js

you can install bun from "https://bun.com/"

for windows: you just type this command
powershell -c "irm bun.sh/install.ps1 | iex"

Now when you run this code also you have application name was postman
you also required to install from your system.
once you can install all the requirements you can just run this code and copy the url like "https:// 127.0.0.1" and go to postman app click the new button select the "http" and paste it here.
*/
