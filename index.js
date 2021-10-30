const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config()
const app = express();
const cors = require('cors')
const port =process.env.PORT || 5000;

app.use(cors());

// user = traveler
// pass = ahm4QbR5ndCCgeKb


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fdfrc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run(){
    try{
        await client.connect();
    }
    finally{
        //await client.close()
    }
}
run().catch(console.dir);
client.connect(err => {
  const collection = client.db("test").collection("devices");
  const user = {name: 'kamrul', proff: 'developer'};
  collection.insertOne(user)
  console.log('hiting the database');
  // perform actions on the collection object
//   client.close();
});

app.get('/',(req,res)=>{
    res.send('Hello from My First ever node')
});
app.get('/users',(req,res)=>{
    res.send(users);
});

app.listen(port,()=>{
    console.log('listening to port',port)
})