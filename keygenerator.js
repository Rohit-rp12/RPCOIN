const EC =  require('elliptic').ec;           //elliptic library allow us to generate public and private key, it also has methods to sign something and also a method to verify the signature
const ec = new EC('secp256k1');         // ec stands for elliptic curve, we can use any ec, for eg here we use secp256k1
                                         // this is the algorithm which forms basis of bitcoin wallets
            
const key = ec.genKeyPair();           //this genKeyPair is object from elliptic library that contains getPublic and getPrivate as methods
const publicKey = key.getPublic('hex');     
const privateKey = key.getPrivate('hex');

console.log();
console.log('Private key:', privateKey);

console.log();
console.log('Public key:', publicKey);