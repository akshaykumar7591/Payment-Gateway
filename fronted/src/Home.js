import React from "react";
import { Box, Stack } from "@chakra-ui/react";
import Card from "./Card";
import axios from "axios";

const Home = () => {
  const checkoutHandler = async (amount, img) => {
    const {
      data: { key },
    } = await axios.get("http://www.localhost:5000/getkey");

    const res = await axios.post("http://localhost:5000/checkout", {
      amount,
    });
    const order = res.data.order;
    // console.log(data);
    const options = {
      key,
      amount: order.amount,
      currency: "INR",
      name: "Online Shop",
      description: "testing purpose",
      image: img,
      order_id: order.id,
      callback_url: "http://localhost:5000/paymentverification",
      prefill: {
        name: "Akshay Kumar",
        email: "akshay.kumar@example.com",
        contact: "9999999999",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };
    const razor = new window.Razorpay(options);
    razor.open();
  };
  const checkoutHandlerPhonePe = async (amount, img) => {
    try {
      console.log(amount);
       const res=await axios.post("http://localhost:5000/payment", {
        amount,
      });
    //   console.log(data.data.url)
    window.location.href=res.data;
      
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <Box>
      <Stack
        h={"100vh"}
        alignItems="center"
        justifyContent="center"
        direction={["column", "row"]}
      >
        <Card
          amount={5000}
          img={
            "https://cdn.shopify.com/s/files/1/1684/4603/products/MacBookPro13_Mid2012_NonRetina_Silver.png"
          }
          checkoutHandler={checkoutHandler}
        />
        <Card
          amount={3000}
          img={
            "http://i1.adis.ws/i/canon/eos-r5_front_rf24-105mmf4lisusm_32c26ad194234d42b3cd9e582a21c99b"
          }
          checkoutHandler={checkoutHandler}
        />
        <Card
          amount={2000}
          img={
            "http://i1.adis.ws/i/canon/eos-r5_front_rf24-105mmf4lisusm_32c26ad194234d42b3cd9e582a21c99b"
          }
          checkoutHandler={checkoutHandlerPhonePe}
        />
      </Stack>
    </Box>
  );
};

export default Home;
