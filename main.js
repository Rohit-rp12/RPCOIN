const {Blockchain, Transaction} = require('./blockchain');        //including exports from blockchain.js file in main.js
const EC =  require('elliptic').ec;           
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('20877cdcb85087326e183ee3a1b3f7d4c8fe6f5e2e8ef125f67e0e329d4da5f0');
const myWalletAddress = myKey.getPublic('hex');          //extract public key or walletAddres in hex format


let rpCoin = new Blockchain();     //instance of savjee coin

const tx1 = new Transaction(myWalletAddress, 'public keys go here', 10);  //line no 15 for more understanding, also public keys go here is just a random toAddress, it could actually contain public key of someone else's address
tx1.signTransaction(myKey);
rpCoin.addTrasaction(tx1);

// rpCoin.createTrasaction(new Transaction('address1', 'address2', 100));  // in reality add2 and add1 will be the public key of someone's wallet
// rpCoin.createTrasaction(new Transaction('address2', 'address1', 50));

console.log('\n Starting the miner...');
rpCoin.minePendingTransactions(myWalletAddress);     //mining reward should go to myWalletAddress

console.log('\nBalance of Rohit is ', rpCoin.getBalanceOfAddress(myWalletAddress));    // to check balance of my wallet

rpCoin.chain[1].transactions[0].amount = 1;  // lets tamper with the data, instead of sending 100 coins we're sending only 1 coin

console.log('Is chain valid?', rpCoin.isChainValid());

// console.log('\n Starting the miner again...');
// rpCoin.minePendingTransactions('rp-address');       //just a fake address

// console.log('\nBalance of Rohit is ', rpCoin.getBalanceOfAddress('rp-address'));































// console.log('Mining Block 1...');
// rpCoin.addBlock(new Block(1, "12/07/2024", { amount: 4}));

// console.log('Mining Block 2...');
// rpCoin.addBlock(new Block(2, "15/07/2024", { amount: 10}));


// // console.log('Is BlockChain valid?' + rpCoin.isChainValid());

// // //lets tamper with the data this time
// // rpCoin.chain[1].data = { amount:100 };
// // rpCoin.chain[1].hash = rpCoin.chain[1].calculateHash();      // it will recalculate the hash for the block whose data was changed, we won't get true even after this once data is altered in one of the blocks(relationship with previous blocks broken) 
// //                                                                        //all blocks hash sequence need to be calculated again

// // console.log('Is Bloclchain Valid?' + rpCoin.isChainValid());    //we'll get false for this time as data is altered causing hash sequenece to change
// console.log(JSON.stringify(rpCoin, null, 4));      // using 4 spaces to format it
