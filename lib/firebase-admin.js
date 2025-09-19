// Firebase Admin SDK initialization for backend (Node.js)
// Used by pesapal-backend.js and lib/firestore-db.js

const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    // Optionally add databaseURL if needed
  });
}

module.exports = admin;
