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

// exports.addNeighbor = functions.https.onRequest(async (req, res) => {

// })
