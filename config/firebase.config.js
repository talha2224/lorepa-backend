const { initializeApp } = require("@firebase/app");
const { getStorage } = require("@firebase/storage");
require("dotenv").config();

// const firebaseConfig = {
//   apiKey:process.env.apiKey,
//   authDomain:process.env.authDomain,
//   projectId:process.env.projectId,
//   storageBucket:process.env.storageBucket,
//   messagingSenderId:process.env.messagingSenderId,
//   appId:process.env.appId,
//   measurementId:process.env.measurementId,
// };

const firebaseConfig = {
  apiKey: "AIzaSyBJNVGiyt8gGAXCZj3B2hemk0nvCptRWbQ",
  authDomain: "lorepe-ec7c8.firebaseapp.com",
  projectId: "lorepe-ec7c8",
  storageBucket: "lorepe-ec7c8.firebasestorage.app",
  messagingSenderId: "760936322590",
  appId: "1:760936322590:web:2d2928ff7d519f1741800f",
  measurementId: "G-ZV0JEXS2HK",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

module.exports = { storage };
