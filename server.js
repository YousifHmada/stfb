const dotenv = require('dotenv').config();
const express = require('express');
const server = express();
const PORT = process.env.PORT || 8000;

const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key:
    process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url:
      process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  }),
});

async function verifyToken(req, res, next) {
  const idToken = req.headers.authorization
  
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken)
    
    if (decodedToken) {
      console.log(decodedToken)
      req.auth = decodedToken
      next()
    } else {
      return res.status(401).send("You are not authorized!")
    }
    
  } catch (e) {
    console.log(e)
    return res.status(401).send("You are not authorized!")
  }
  
}

const cors = require('cors');

app.use(cors());

server.use('/', verifyToken);

server.get('/verify-auth-token', (req, res) => {
  return res.status(200).json(req.auth)
})

server.listen(PORT, () => {
  console.log(`Server Running on port: ${PORT}`);
});