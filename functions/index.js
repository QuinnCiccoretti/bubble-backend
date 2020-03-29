const functions = require('firebase-functions');
const admin = require('firebase-admin');
const accountSid = functions.config().twilio.account_sid;
const authToken = functions.config().twilio.auth_token;
const twilioClient = require('twilio')(accountSid, authToken);

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
  // const timestamp = admin.database.ServerValue.TIMESTAMP
  let snapshot = admin.database().ref('users/'+myphone);
  snapshot.push({
    'phone': theirphone
  });
  res.send(theirphone);

});

// broadcast alarm to everyone you have been near
exports.broadcast = functions.https.onRequest(async (req, res) => {
  const myphone = req.query.text;
  const enable_twilio = req.query.devmode;
  // console.log(myphone);

  // source: https://firebase.google.com/docs/reference/js/firebase.database.DataSnapshot
  var query = admin.database().ref('users/'+myphone).orderByKey();
  query.once("value")
    .then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        // console.log('hi');
        // var key = childSnapshot.key;
        // console.log(key);
        // childData will be the actual contents of the child
        var childData = childSnapshot.val();
        var theirphones = childData.phone;
        console.log(theirphones);
        if(theirphones !== null && enable_twilio){
          console.log("twilio enabled!");
          twilioClient.messages
            .create({
               body: 'A person who you have approached recently has contracted the coronavirus. Self quarantine is advised.',
               from: '+12024103519',
               to: "+1"+theirphones
             })
            .then(message => console.log(message.sid))
            .catch(error => console.log(error));
        }
    });
    return null;
  }).catch();
  res.send("myphone");
});