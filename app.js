const express = require("express");
const https = require("node:https");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(bodyParser.urlencoded({extended: true}));


app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html");
})

app.post("/",function(req,res){
    console.log(req.body.cityName);


    const weathercityname = req.body.cityName;
    console.log(req.body.cityName);
    const apiKey = process.env.SECRET_KEY;
    const units = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+ weathercityname +"&appid="+ apiKey +"&units="+units;
    https.get(url,function(response){
        console.log(response.statusCode);
    
        if(response.statusCode === 200){
                response.on("data",function(data){
                const weatherData = JSON.parse(data);
                console.log(weatherData.main.temp);
                const temp = weatherData.main.temp;
                const weatherDescrition = weatherData.weather[0].description;
                console.log(weatherDescrition);
                const icon = weatherData.weather[0].icon;
                const imageURL = "https://openweathermap.org/img/wn/"+icon+"@2x.png"
                 res.write("<h1>The weather is currently "+weatherDescrition+" </h1>");
                 res.write("<img src="+imageURL+">");
                 res.write("<h2> The current temp in "+ weathercityname +" is "+temp+" Degree Celcius</h2>");
                 
            })
        }
        else{
            console.log(response.statusMessage);
            res.sendFile(__dirname+"/failure.html");
        }
    })
    
});
console.log("checking...");
app.post("/failure",function(req,res){
    res.redirect("/");
});


app.listen(3000,function(){
    console.log("Server is running on port 3000.");
})