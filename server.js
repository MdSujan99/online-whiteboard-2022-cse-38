const express = require('express');
const app = express();
port = 3000;

const server = app.listen(port, function(error){
    if (error){
        console.log("Error:"+error);
    }else{
        console.log("listening on port:"+port);
    }
});

app.use(express.static('public'));
