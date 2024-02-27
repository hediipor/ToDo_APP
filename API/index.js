var express = require("express")
var mongoclient = require("mongodb").MongoClient;
var cors =require( "cors");
const multer = require("multer")

var app=express();
app.use(cors());

var CONNECTION_STRING = "mongodb+srv://admin:admin@cluster0.nawkt1k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
                        
var DATA_BASE_NAME = "todo-app"
var database;

app.listen(3000 , () => {
    mongoclient.connect(CONNECTION_STRING , (error , client) =>{
        database = client.db(DATA_BASE_NAME);
        console.log("connected to server");
    })
})

app.get( '/api/todoapp/getlists', (request, response) =>{
    database.collection('lists').find({}).toArray((error, result)=>{
        response.send(result);
    })
})