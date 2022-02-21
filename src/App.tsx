import React, { useEffect, useState } from "react";
import "./App.css";
import * as firebase from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import Channels from "./modules/Channels/Channels";

const app = firebase.initializeApp({
  apiKey: "AIzaSyAU9Iv5UVs04BBd4UtXD9zg4fRD3VL_UXg",
  authDomain: "deploy-test-8df33.firebaseapp.com",
  projectId: "deploy-test-8df33",
  storageBucket: "deploy-test-8df33.appspot.com",
  messagingSenderId: "443734113980",
  appId: "1:443734113980:web:d127eb38f4cd57b2359ab9",
});

const auth = getAuth();
const db = getFirestore(app);

function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(() => auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      if (initializing) {
        setInitializing(false);
      }
    });
    // Cleanup subscription
    return unsubscribe;
  }, [initializing]);

  const signinWithGoogle = async () => {
    // Retrieve Google provider object
    const provider = new GoogleAuthProvider();
    // Set language to the default browser preference
    auth.useDeviceLanguage();
    // Start sign in process
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
    } catch (error: any) {
      console.log(error.message);
    }
  };

  if (initializing) return <p style={{ textAlign: "center" }}>Loading...</p>;

  if (!user) {
    return (
      <div className="App">
        <button onClick={signinWithGoogle}>Sign In</button>
      </div>
    );
  }

  return (
    <div className="App">
      <button className="w-40 border" onClick={signOut}>
        sign out
      </button>

      <Channels user={user} db={db} />
    </div>
  );
}

export default App;
