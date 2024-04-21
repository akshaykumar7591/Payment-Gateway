const express=require('express');
const router=express.Router();
const razorpay=require("razorpay");
const crypto=require("crypto")
const Payment=require("../modal/paymentModel")
var { validatePaymentVerification, validateWebhookSignature } = require("razorpay");

var instance=new razorpay({
    key_id:process.env.RAZORPAY_API_KEY,
    key_secret:process.env.RAZORPAY_API_SECRET
})

// create order
router.post("/checkout",async(req,res)=>{
    // console.log(req.body);
     const option={
        amount:Number(req.body.amount *100) ,
        currency:"INR" 
        // receipt:"order_rcptid_11"
     };

     const order=await instance.orders.create(option);
     console.log(order);
     res.status(200).json({
        success:true,
        order
    });
})

router.get("/getkey",(req,res)=>{
    res.status(200).json({key:process.env.RAZORPAY_API_KEY})
})

router.post("/paymentverification",async(req,res)=>{
    console.log(req.body);
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) { 
    // Database comes here
  console.log("here")
    const data=await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });
    await data.save();

    res.redirect(
      `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`
    );
  } else {
    res.status(400).json({
      success: false,
    });
  }
})


module.exports=router;