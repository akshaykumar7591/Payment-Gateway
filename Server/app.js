const express=require('express');
const app=express();
require('dotenv').config()
const cors=require('cors');
const mongoose=require("mongoose");

// const razorpay=require("razorpay");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));


mongoose.connect("mongodb://127.0.0.1:27017/PaymentTest")
.then(()=>console.log("done"))
.catch(()=>console.log("error"))

const PaymentRoute=require('./routers/paymentRoute')
const Phonepe=require("./routers/phonePeRoute");

app.use(PaymentRoute)
app.use(Phonepe);



app.listen(process.env.PORT,()=>{
    console.log("server start "+process.env.PORT);
})