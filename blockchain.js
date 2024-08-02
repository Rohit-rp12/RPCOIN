const SHA256 = require('crypto-js/sha256');    // import sha256 function
const EC =  require('elliptic').ec;           
const ec = new EC('secp256k1');
                                                                                    //with Proof of Work, mining transactions and rewards
class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    calculateHash(){    //we're just gonna sign the hash of our transaction
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }
     
    // to sign our transaction we'll have to  provide our public and private key
    signTransaction(signingKey){     // signKey is object that we got from elliptic library
        if(signingKey.getPublic('hex') !== this.fromAddress){
            throw new Error('You cannot sign transactions for other wallets!');
        }


        const hashTx = this.calculateHash();          //creating hash of our transaction
        const sig = signingKey.sign(hashTx, 'base64');         // create signature and we're gonna sign hash of our transaction
        this.signature = sig.toDER('hex');                     //we're gonna store our signature , toDER is a special format  -?
    }

    isValid()          // method to verify whether our transactions are correctly signed especially for mining reward transactions which are in itself signed and valid too
    {
        if(this.fromAddress === null){          // if transaction is related to mining rewards
            return true;
        }

        if(!this.signature || this.signature.length === 0){          // if no lenght of signature
            throw new Error('No signature in this transaction');
        }

             //transaction isn't from null address and it has signature, then we verify that the transaction was signed with correct key
             // so we're gonna make a new public key object from the fromAddress(coz it is a publlicKey)
        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);    //we've to verify the hash has this particular siganture
    }
}

class Block{
    constructor(timestamp, transactions, previousHash = ''){    // the transactions argument will provide us with array of transaction(hashTx)
        // this.index = index;       //actually not useful in blockchain, coz order of blocks determined by position in the area and not by the index we pass here
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash  = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty){                           //?
        while(this.hash.substring(0,difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined" + this.hash);
    }

    hasValidTransactions(){               // verify that all the transactions in current block
        for(const tx of this.transactions){   //iterate over all the transactions in the blocj
            if(!tx.isValid()){               // and ensure that every transaction is valid
                return false;                // if not valid return false
            }
        }
        return true;       // if valid return true
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty= 2;
        this.pendingTransactions = [];     // all pending Transactions will be stored here
        this.miningReward = 100;           // miners will get 100 coins as reward
    }

    createGenesisBlock(){
        return new Block("18/07/2024", "Genesis Block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }

    minePendingTransactions(miningRewardAddress){           //?
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined!');
        this.chain.push(block);           //pushing our block to chain

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)  // fromAddress is set to null because in this transaction coins are rewarded from the system and not some specific address
        ];
    }

    addTrasaction(transaction){     //method for receiving transaction and pushing it to pendingTransactions array

        if(!transaction.fromAddress || !transaction.toAddress){    //1st checkpass
            throw new Error("Transaction must include from and to address");
        }

        if(!transaction.isValid()){     //2nd checkpass
            throw new Error('Cannot add invalid transactions to chain');
        }
        //must pass above 2 checkpasses to add the transaction
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 100;       //let our initial balance is 100 coins 
 
        for(const block of this.chain){                   //?
            for(const trans of block.transactions){      //?
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }

                if(trans.toAddress == address){
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }

    // addBlock(newBlock){        //old mining method
    //     newBlock.previousHash = this.getLatestBlock().hash;
    //     // newBlock.hash = newBlock.calculateHash();
    //     newBlock.mineBlock(this.difficulty);
    //     this.chain.push(newBlock);
    // }

    isChainValid(){
        for(let i=1; i<this.chain.length; i++)       // we start iterating from 1 because i=0 is the genesis block
        {
            const currentBlock = this.chain[i];       
            const previousBlock  = this.chain[i-1];

            if(!currentBlock.hasValidTransactions()){
                return false;
            }

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }
        return true;
    }
}

module.exports.Blockchain = Blockchain;          //iska matlab samjhna he ~ ?
module.exports.Transaction = Transaction;       //?


