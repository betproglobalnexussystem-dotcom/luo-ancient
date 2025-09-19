// Firestore database utility for subscriptions and payments
// Used by pesapal-backend.js

const { getFirestore, doc, setDoc, getDoc, updateDoc } = require('firebase-admin/firestore');
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    // Optionally add databaseURL if needed
  });
}

const db = getFirestore();

// Save or update user subscription
async function saveUserSubscription(phone, plan, expires) {
  const userRef = doc(db, 'subscriptions', phone);
  await setDoc(userRef, { plan, expires }, { merge: true });
}

// Get user subscription
async function getUserSubscription(phone) {
  const userRef = doc(db, 'subscriptions', phone);
  const docSnap = await getDoc(userRef);
  return docSnap.exists() ? docSnap.data() : null;
}

// Save payment record
async function savePaymentRecord(paymentId, data) {
  const paymentRef = doc(db, 'payments', paymentId);
  await setDoc(paymentRef, data, { merge: true });
}

module.exports = {
  saveUserSubscription,
  getUserSubscription,
  savePaymentRecord,
};
