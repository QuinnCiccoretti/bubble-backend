const functions = require('firebase-functions');

const admin = require('firebase-admin');
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
  res.send(phone);
});

// exports.addNeighbor = functions.https.onRequest(async (req, res) => {

// })
