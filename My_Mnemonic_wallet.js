const express = require('express');
const router = express.Router();
const lightwallet = require("eth-lightwallet");
const fs = require('fs');

// eth-lightwallet 을 이용해서 니모닉 코드 생성
router.post('/newMnemonic', async(req,res) => {
    let mnemonic;
    try { // 니모닉 코드 생성
        mnemonic = lightwallet.keystore.generateRandomSeed();
        res.json({mnemonic});
    } catch(err) {
        console.log(err);
    }
  });


// 니모닉코드를 통해서 지갑을 생성
router.post('/newWallet', async(req, res) => {
    let password = req.body.password
    let mnemonic = req.body.mnemonic;
  
    try {
        //니모닉을 시드로 키스토어를 생성
        lightwallet.keystore.createVault({
            password: password, 
            seedPhrase: mnemonic,
            hdPathString: "m/0'/0'/0'"
        },
        function (err, ks) {
            ks.keyFromPassword(password, function (err, pwDerivedKey) {
                ks.generateNewAddress(pwDerivedKey, 1);

                let address = (ks.getAddresses()).toString();
                let keystore = ks.serialize();
                
                // fs 모듈을 이용한 키스토어 로컬 저장
                fs.writeFile('wallet_keystore.json',keystore,function(err,data){
                if(err) {
                    res.json({code:999,message:"실패"});
                } else {
                    res.json({code:1,message:"성공"});
                }
                });
            });
        }
      );
    } catch (exception) { 
      console.log("NewWallet ==>>>> " + exception);
    }
  });

module.exports = router;