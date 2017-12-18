const router = require('express').Router();
const db = require('../bin/database');
const Request = db.model('Request');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/'));
// const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
const EthereumTx = require('ethereumjs-tx');
const config = require('config');

const privateKey = new Buffer.from(config.rinkeby.privateKey, 'hex');
const account = config.rinkeby.account;



router.post('/rinkeby/tokensPlease', async function(req, res) {
    const targetWallet = req.body.wallet;
    const networkName = req.body.networkName;
    const userId = req.body.userId;

    let nonce = null;
    let isExisting = false;

    try {
        isExisting = await Request.isExistingRequest(networkName, userId);
    } catch(err) {
        return res.json({success: false, message: err.message})
    }

    if (isExisting) {
        return res.json({success: false, message: 'The last request was less than 24 hours ago. Wait and try again.'})
    }

    try {
        nonce = await web3.eth.getTransactionCount(account, 'pending');
    } catch(err) {
        return res.json({success: false, message: err.message});
    }

    const txData = {
        chainId: web3.utils.toHex('4'),
        nonce: web3.utils.toHex(nonce),
        gasLimit: web3.utils.toHex(50000),
        gasPrice: web3.utils.toHex(20000000000),
        from: account,
        to: targetWallet,
        value: web3.utils.toHex(web3.utils.toWei('0.1', 'ether'))
    };

    const tx = new EthereumTx(txData);
    tx.sign(privateKey);
    const serialized = tx.serialize().toString('hex');

    web3.eth.sendSignedTransaction('0x' + serialized, async function(err, transactionHash) {
        if (err) {
           return res.json({success: false, message: err.message});
        }

        try {
            await Request.storeRequest(networkName, userId);
        } catch(e) {
            return res.json({success: false, message: e.message});
        }


        return res.json({success: true, transactionHash: transactionHash});
    });
});


module.exports = router;
