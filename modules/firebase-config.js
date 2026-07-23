/**
 * Abyssus - Firebase Configuration
 * Cloud setup for authentication and real-time database
 */

// Use global Firebase if available, or load from CDN
if (typeof firebase === 'undefined') {
  console.error('Firebase not loaded. Add this to index.html head:')
  console.error('<script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js"></script>')
  console.error('<script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js"></script>')
  console.error('<script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js"></script>')
}

const firebaseConfig = {
  apiKey: "AIzaSyA7OxNqHBiVsCNxdhatWRY1WUHYPaO1AmM",
  authDomain: "abyssus-1eb8b.firebaseapp.com",
  projectId: "abyssus-1eb8b",
  storageBucket: "abyssus-1eb8b.firebasestorage.app",
  messagingSenderId: "801360821944",
  appId: "1:801360821944:web:fb267bd710f067bf027e4d",
  databaseURL: "https://abyssus-1eb8b-default-rtdb.europe-west1.firebasedatabase.app"
};

// Initialize Firebase with global firebase
if (typeof firebase !== 'undefined') {
  firebase.initializeApp(firebaseConfig);
  console.log('✅ Firebase initialized');
}