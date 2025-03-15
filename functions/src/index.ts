import * as v2 from "firebase-functions/v2";
import { auth } from "firebase-functions/v1";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

// Initialize Firebase Admin SDK
initializeApp();

// Get Firestore instance
const db = getFirestore();

// Get Auth instance
const authInstance = getAuth();

export const helloWorld = v2.https.onRequest((req, res) => {
  res.send("Hello from Firebase!");
});

export const getUserToken = v2.https.onRequest(async (req, res) => {
  const pathSegments = req.path.split("/").filter((segment) => segment);
  const uid = pathSegments[pathSegments.length - 1];

  if (!uid || uid === "getUserToken") {
    res.status(400).send("Missing UID");
    return;
  }

  try {
    const user = await authInstance.getUser(uid);
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(`Error getting user: ${error}`);
  }
});

export const createUser = v2.https.onRequest(async (req, res) => {
  const { email, password, username } = req.body;
  if (!email || !password || !username) {
    res.status(400).send("Missing email or password");
    return;
  }

  try {
    const user = await authInstance.createUser({
      displayName: username,
      email,
      password,
    });
    res.status(200).send(`User created with ID: ${user.uid}`);
  } catch (error) {
    res.status(500).send(`Error creating user: ${error}`);
  }
});

export const onCreateUser = auth.user().onCreate(async (user) => {
  authInstance.setCustomUserClaims(user.uid, { admin: false });
  try {
    const res = await db.collection("users").add({
      username: user.displayName,
      email: user.email,
      uid: user.uid,
      createdAt: FieldValue.serverTimestamp(),
    });
    console.log("Dcument data:", res.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
});
