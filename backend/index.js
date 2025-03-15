import express from 'express';

const app = express();
const PORT = process.env.PORT || 8000

app.get("/", (req, res)=>{
    res.send("Server is up! 👋👋")
})

app.listen(PORT, ()=>{
    console.log("server is running: http://localhost:"+PORT)
})