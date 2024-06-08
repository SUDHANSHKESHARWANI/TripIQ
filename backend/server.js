const PORT=8000
const express=require('express')
const cors=require('cors')
const axios = require('axios');
require('dotenv').config();

const app=express()
app.use(express.json())
const corsOptions = {
    origin: "https://tripiq.vercel.app", // Allow requests from this origin
    // origin: "*",
  };
  
app.use(cors(corsOptions));

// Define a route handler for the default home page
app.get('/', (req, res) => {
  res.send("server is running");
});

app.post("/completions",async (req,res)=>{
    const options={
        mode:"cors",
        method:"POST",
        headers:{
            "Authorization":`Bearer ${process.env.CHATGPT_KEY}`,
            "Content-Type":"application/json",
            "Origin":"https://tripiq.vercel.app"
        },
        
        body:JSON.stringify({
            model:"gpt-3.5-turbo",
            messages:[{role:"user",content:req.body.message}], // just need to pass content : req.body.message
            max_tokens:6000
        })
    }

    try {
       const response=await fetch("https://api.openai.com/v1/chat/completions",options)
      //  console.log(req.body.message)
       const data=await response.json()
      //  console.log(data.choices[0].message)
       res.send(data)
    } catch (error) {
        console.log(error)
    }
})

app.get('/api/google-maps', async (req, res) => {
    const { location } = req.query;
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${location}&inputtype=textquery&fields=photos&key=${process.env.GMAP_API_KEY}`
      );
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching image link:', error);
      res.status(500).json({ error: 'An error occurred while fetching image link' });
    }
  });
app.listen(PORT,()=>console.log("Your server is running"))

