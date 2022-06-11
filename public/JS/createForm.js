var myForm = document.getElementById("form_create");
const url =
  "https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize?client_id=71c8ebe1-c1eb-4200-9645-0a16441defe8&redirect_uri=http://localhost:3000/canvas.html&scope=user.read&response_type=code&response_mode=query";
myForm.onsubmit = (e) => {
  e.preventDefault();
  const roomData = {};
  roomData.roomName = document.forms["form_create"]["roomName"].value;
  roomData.roomPass = document.forms["form_create"]["roomPass"].value;
  roomData.hostName = document.forms["form_create"]["atd_name"].value;
  console.log(roomData);
  if (!/\?code=[\w+\.\-]{45}/g.test(window.location.search)) {
    window.location.href = url;
  } else {
    window.location.href = "/canvas.html";
  }
};
