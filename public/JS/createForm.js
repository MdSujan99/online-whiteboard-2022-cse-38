var url =
  "https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize?client_id=71c8ebe1-c1eb-4200-9645-0a16441defe8&redirect_uri=";
// var redirect_uri = "https://online-whiteboard-2022-cse-38.herokuapp.com/";
var redirect_uri = "http://localhost:3000/create.html";

var scope = "&scope=user.read&response_type=code&response_mode=query";
url = url + redirect_uri + scope;

if (!/\?code=[\w+\.\-]{45}/g.test(window.location.search)) {
  window.location.href = url;
  console.log("if true");
} else {
  console.log("else false");
}
