// var phone_number = "";

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

function addUser(phone_number){
  console.log(phone_number)
  const url = "http://us-central1-bubble-07.cloudfunctions.net/addUser?text="+phone_number;
  httpGetAsync(url, null);
}