const crypto = require("crypto");
const fs = require("fs");

function genKeyPair() {
  const keyPair = crypto.generateKeyPairSync("rsa", {
    modulusLength: 4096, // bits - standard RSA keys
    privateKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },

    /* 
    // NO NEED FOR PUBLIC KEY IN JWT UNLESS CLIENT NEEDS TO ENCRPT SOMETHING
    publicKeyEncoding: {
      type: "pkcs1", // Public Key Cryptography Standards 1
      format: "pem", // Most common formatting
    }, 
    */
  });

  fs.writeFileSync(__dirname + "/../config/id_rsa_priv.pem", keyPair.privateKey);

  /* 
  // Write Public Key to pem file
  fs.writeFileSync(__dirname + "/../config/id_rsa_pub.pem", keyPair.publicKey); 
  */
}

genKeyPair();