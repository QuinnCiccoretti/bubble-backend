// firebase
const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Twilio
const accountSid = functions.config().twilio.account_sid;
const authToken = functions.config().twilio.auth_token;
const twilioClient = require('twilio')(accountSid, authToken);

// requests
const https = require('https');

// config
const KEY = require('./key.js');

admin.initializeApp();




// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.addUser = functions.https.onRequest(async (req, res) => {
  // Grab the text parameter.
  const phone = req.query.text;
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  // const snapshot = await admin.database().ref('/Users').push({phone: phone});

  let snapshot = admin.database().ref('users/'+phone);
  snapshot.set({
    "name": "test"
  }).then().catch();

  // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
  // res.redirect(303, snapshot.ref.toString());
  twilioClient.messages
  .create({
     body: 'Welcome to bubble.',
     from: '+12024103519',
     to: "+1"+phone
   })
  .then(message => console.log(message.sid))
  .catch(error => console.log(error));
  res.send(phone);
});

// adds info about people that have been in contact
// we can add more fields
exports.addNeighbor = functions.https.onRequest(async (req, res) => {
  const myphone = req.query.ours;
  const theirphone = req.query.theirs;
  const longitude = req.query.long;
  const latitude = req.query.lat;
  const time = req.query.time; 
  // const timestamp = admin.database.ServerValue.TIMESTAMP
  let snapshot = admin.database().ref('users/'+myphone);
  snapshot.push({
    'phone': theirphone,
    'longitude': longitude,
    'latitude': latitude,
    'time': time
  });
  res.send(theirphone);

});




// broadcast alarm to everyone you have been near
exports.broadcast = functions.https.onRequest(async (req, res) => {
  // console.log(KEY.key);
  const myphone = req.query.text;
  var enable_twilio = false;
  // console.log(req.query.devmode);
  if(req.query.devmode==="0"){
    enable_twilio = true;
  }
  // console.log(enable_twilio);

  // source: https://firebase.google.com/docs/reference/js/firebase.database.DataSnapshot
  // url = "https://maps.googleapis.com/maps/api/geocode/json?latlng="40.714224,-73.961452&
  
  var query = admin.database().ref('users/'+myphone).orderByKey();
  query.once("value")
    .then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        https.get('')
        // console.log('hi');
        var key = childSnapshot.key;
        // console.log(key);
        // childData will be the actual contents of the child
        var childData = childSnapshot.val();
        var theirphones = childData.phone;
        // console.log(theirphones);
        // console.log(key !== "name" && enable_twilio);
        // url = "https://maps.googleapis.com/maps/api/geocode/json?latlng="40.714224,-73.961452&
        https.get('', (resp)=>{
          if(key !== "name" && enable_twilio){
          // console.log("twilio enabled!");
          twilioClient.messages
            .create({
               body: 'A person who you have approached recently has contracted the coronavirus.\
                Self quarantine is advised.',
               from: '+12024103519',
               to: "+1"+theirphones
             })
            .then(message => console.log(message.sid))
            .catch(error => console.log(error));
          }
        })
        
    });
    return null;
  }).catch();
  res.send("myphone");
});