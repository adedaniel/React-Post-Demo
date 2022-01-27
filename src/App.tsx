import React, { useEffect, useState } from "react";
import "./App.css";
import * as firebase from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import Channels from "./modules/Channels/Channels";

const app = firebase.initializeApp({
  apiKey: "AIzaSyCGXeOExauFiDCz-XFkkBp0mn5Gt09yIqo",
  authDomain: "react-fireposts.firebaseapp.com",
  projectId: "react-fireposts",
  storageBucket: "react-fireposts.appspot.com",
  messagingSenderId: "431476950457",
  appId: "1:431476950457:web:9f68ec2d5242a559ece268",
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
        <button onClick={signinWithGoogle}>sign in</button>
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
