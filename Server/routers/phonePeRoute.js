const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const axios = require("axios");

function getTranctionId() {
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 1000000);
  const merchantPrefix = "T";
  const transtionId = `${merchantPrefix}${timestamp}${randomNum}`;
  return transtionId;
}
// payment router

router.post("/payment", async (req, res) => {
  try {
    const { amount } = req.body;
    data = {
      merchantId: "PGTESTPAYUAT",
      merchantTransactionId: getTranctionId(),
      merchantUserId: "MUID123",
      amount: amount*100,
      redirectUrl: "http://localhost:5000/status",
      redirectMode: "POST",
      mobileNumber: "9999999999",
      paymentInstrument: { 
        type: "PAY_PAGE",
      },
    }; 

    const payload = JSON.stringify(data);
    const payloadMain = Buffer.from(payload,"utf-8").toString("base64");
    const key = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399"; // from testing purpose
    const keyIndex = 1;
    const stringdata = payloadMain + "/pg/v1/pay" + key;
    const sha256Hash = crypto
      .createHash("sha256")
      .update(stringdata)
      .digest("hex");
    const checksum = sha256Hash + "###" + keyIndex;

   console.log(checksum);
    
    const options = {
      method: "POST",
      url: "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY":checksum
      },
      data: {  
        request:payloadMain
      },
    };

    axios.request(options).then(function (response) {
        // console.log(response.data)
        return res.send(response.data.data.instrumentResponse.redirectInfo.url)
    })
    .catch(function (error) {
        console.error(error);
    });

     
  } catch (e) {
    console.log("error mane likha");
  }
});

router.post("/status",(req,res)=>{
    
    console.log(req.body);
    // return res.req.body;
    const merchantTransactionId = res.req.body.transactionId
    const merchantId = res.req.body.merchantId

    const keyIndex = 1;
    const salt_key="099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
    const string = `/pg/v1/status/${merchantId}/${merchantTransactionId}` + salt_key;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    const checksum = sha256 + "###" + keyIndex;

    const options = {
    method: 'GET',
    url: `https://api.phonepe.com/apis/hermes/pg/v1/status/${merchantId}/${merchantTransactionId}`,
    headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
        'X-MERCHANT-ID': `${merchantId}`
    }
    };

    // CHECK PAYMENT TATUS
    axios.request(options).then(async(response) => {
        if (response.data.success === true) {
            const url = `http://localhost:3000/paymentsuccess?reference=${merchantTransactionId}`
            return res.redirect(url)
           return  res.status(200).json({success:true})
        } else {
            // const url = `http://localhost:3000/failure`
            // return res.redirect(url)
           return  res.status(404).json({success:false});
        }
    })
    .catch((error) => {
        console.error(error);
    });
})
module.exports = router;
