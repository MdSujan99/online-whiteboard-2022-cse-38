// const btn_create = document.getElementById("btn_create");
// const btn_join = document.getElementById("btn_join");

// btn_create.addEventListener("submit", createSession);
// btn_join.addEventListener("submit", joinSession);

// function createSession() {
//   initSSO();
//   console.log("creating a new session");
// }

// function joinSession() {
//   initSSO();
//   console.log("joining a new session");
// }

const myForm = document.forms["myForm"];
myForm.onsubmit = (e) => {
  e.preventDefault();

  var submitBtn = document.activeElement;
  console.log(submitBtn);
  var url =
    "https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize?client_id=71c8ebe1-c1eb-4200-9645-0a16441defe8&redirect_uri=";
  var redirect_uri = "https://online-whiteboard-2022-cse-38.herokuapp.com//";
  if (submitBtn.id == "btn_create") redirect_uri = redirect_uri + "create.html";
  else redirect_uri = redirect_uri + "join.html";
  var scope = "&scope=user.read&response_type=code&response_mode=query";
  url = url + redirect_uri + scope;
  console.log(url);
  if (!/\?code=[\w+\.\-]{45}/g.test(window.location.search)) {
    window.location.href = url;
  } else {
    window.location.href = "/create.html";
  }
};

// const roomData = {};
// roomData.roomName = document.forms["form_create"]["roomName"].value;
// roomData.roomPass = document.forms["form_create"]["roomPass"].value;
// roomData.hostName = document.forms["form_create"]["atd_name"].value;
// console.log(roomData);
// function initSSO(e) {
//   e.preventDefault();
//   console.log("initSSO");

//   // const roomData = {};
//   // roomData.roomName = document.forms["form_create"]["roomName"].value;
//   // roomData.roomPass = document.forms["form_create"]["roomPass"].value;
//   // roomData.hostName = document.forms["form_create"]["atd_name"].value;
//   // console.log(roomData);
//   if (!/\?code=[\w+\.\-]{45}/g.test(window.location.search)) {
//     window.location.href = url;
//   } else {
//     window.location.href = "/canvas.html";
//   }
// }
