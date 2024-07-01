const express = require('express')

const app = express()

app.post("/", async(req,res) => {
    console.log("port Run");
})

app.listen(4000);