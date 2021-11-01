const express = require('express');

const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
require('dotenv').config();
const mongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const app = express();
const cors = require('cors');
const { ObjectID } = require('bson');
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}))
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
  const serviceCollection = client.db("services").collection("service");
  const ordersCollection = client.db("services").collection("orders");

  console.log('hiting the database');
  app.get('/',async(req,res)=>{
    res.send('Hello from My First ever node')
    
    });
  app.get('/services', async(req,res)=>{
    const result = await serviceCollection.find({}).toArray();
    res.send(result);
    });

   app.post('/addService',(req,res)=>{
        ordersCollection.insertOne(req.body).then((result)=>{
        res.send(result.insertedId);
         });
    });
   app.get('/myorder/:email', async(req,res)=>{ 
        const myorder = await ordersCollection.find({email:(req.params.email)}).toArray();
        res.send(myorder);
    });
   app.get('/manageorder', async(req,res)=>{ 
        const manageorder = await ordersCollection.find({}).toArray();
        res.send(manageorder);
    });
//    app.put('/status/:id', async(req,res)=>{ 
//        const id= req.params.id;
//         const  filter = {_id: ObjectId(id)};
//         const options = {upsert: true};
//         const updateDoc ={ 
//         $set: {
//             status: 'approved'
//         },
//      };
//      const result = await ordersCollection.updateOne(filter,updateDoc,options)
//      res.json(result);
//     });
    // app.delete("/deleteService/:id",async(req,res)=>{
    //     const result = await ordersCollection.deleteOne({
    //         _id: ObjectId(req.params.id)
    //     });
    //     res.send(result);
    //     console.log(result);
    // })

   app.post('/placeorder/:email',(req,res)=>{
            const orderEmail = req.params.email;
            const order = req.body;
            order.email=orderEmail;
            order.status='pending';
            ordersCollection.insertOne(order)
        .then((result)=>{
            res.send(result.insertedId);

             });
        
    });
});
app.listen(port,()=>{
    console.log('listening to port',port)
});


