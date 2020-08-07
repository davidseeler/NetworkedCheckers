const connection = new WebSocket('ws://127.0.0.1:4444');

connection.onopen = function () {
    console.log('Connected!');
};

// Log errors
connection.onerror = function (error) {
    console.log('WebSocket Error ' + error);
};

// Log messages from the server
connection.onmessage = function (e) {
    let msg = (getTime() + e.data + "\n");
    document.getElementById("chatLog").value += msg;
};

function send(){
    if (document.getElementById("textField").value != null){
        connection.send(document.getElementById("textField").value);
        document.getElementById("textField").value = "";
    }
}

function getTime(){
    let date = new Date();
    let hours = "";
    let minutes = "";
    let symbol = "";
    if (date.getHours() >= 12){
        hours = date.getHours() - 12;
        symbol = "PM";
    }
    else{
        hours = date.getHours();
        symbol = "AM";
    }
    if (date.getMinutes() < 10){
        return "(" + hours + ":0" + date.getMinutes() + " " + symbol + ") ";
    }
    else{
        return "(" + hours + ":" + date.getMinutes() + " " + symbol + ") ";
    }
}