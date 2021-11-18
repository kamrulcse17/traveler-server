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
  const productsCollection = client.db("final-project").collection("products");
  const ordersCollection = client.db("final-project").collection("orders");
  const usersCollection = client.db("final-project").collection("users");
  const reviewCollection = client.db("final-project").collection("review");

  console.log('hiting the database');
  app.get('/',async(req,res)=>{
    res.send('Hello from My First ever node')
    
    });
  app.get('/products', async(req,res)=>{
    const result = await productsCollection.find({}).limit(6).toArray();
    res.send(result);
    });
  app.get('/allproducts', async(req,res)=>{
    const result = await productsCollection.find({}).toArray();
    res.send(result);
    });
  app.get('/dashboardhome/managproducts', async(req,res)=>{
    const result = await productsCollection.find({}).toArray();
    res.send(result);
    });
  app.get('/reviews', async(req,res)=>{
    const result = await reviewCollection.find({}).toArray();
    res.send(result);
    });
  app.get('/dashboardhome/manageorders', async(req,res)=>{
    const result = await ordersCollection.find({}).toArray();
    res.send(result);
    });

    app.get("/placeorder/:id",async(req,res)=>{ 
      await productsCollection.findOne({_id:ObjectId(req.params.id)})
        .then((result) =>{
            res.json(result);
        })
    });
    app.get("/dashboardhome/manageproducts/singleproduct/:id",async(req,res)=>{ 
      await productsCollection.findOne({_id:ObjectId(req.params.id)})
        .then((result) =>{
            res.json(result);
        })
    });
    app.delete("/dashboardhome/myorders/deleteone/:id",async(req,res)=>{ 
      await ordersCollection.deleteOne({_id:ObjectId(req.params.id)})
        .then((result) =>{
            res.json(result);
        })
      })
    
    app.delete("/dashboardhome/manageproducts/deleteone/:id",async(req,res)=>{ 
      await productsCollection.deleteOne({_id:ObjectId(req.params.id)})
        .then((result) =>{
            res.json(result);
        })
    });
    app.get("/dashboardhome/myorders/:email",async(req,res)=>{ 
        const email = req.params.email;
        const query= {email:email};
      await ordersCollection.find(query).toArray()
        .then((result) =>{
            res.send(result);
        })
        
    });
   app.post('/addorder',(req,res)=>{
       const order=req.body;
       order.status='Pending';
        ordersCollection.insertOne(order)
        .then((result)=>{
         res.send(result.insertedId);
         });
    });
   app.post('/dashboardhome/addproduct',async(req,res)=>{
          const newProduct = req.body;
         await productsCollection.insertOne(newProduct)
          .then((result)=>{
          res.send(result.insertedId);
         });
        
    });
   app.post('/dashboardhome/placereview',(req,res)=>{
       const review=req.body;
        reviewCollection.insertOne(review)
        .then((result)=>{
         res.send(result.insertedId);
         });
    });
    app.get('/setusername/:email',async(req,res)=>{
        const filter={email:req.params.email};
        const result = await usersCollection.findOne(filter);
        console.log(result);
        res.send(result);
       
    });
    app.put('/users',async(req,res)=>{
        const user=req.body;
        const filter={email:user.email};
        const options={upsert:true};
        const updateDoc = {$set:user};
        const result = await usersCollection.updateOne(filter,updateDoc,options);
        res.json(result);
    });
    app.put('/dashboardhome/updateproduct/:id',async(req,res)=>{
        const doc= req.body;
        const filter={_id:ObjectId(req.params.id)};
        const options={upsert:true};
        const updateDoc = {$set:{brand:doc.brand,img:doc.img,price:doc.price,
        size:doc.size,color:doc.color,model:doc.model}};
        const result = await productsCollection.updateOne(filter,updateDoc,options);
        res.json(result);
        console.log(result);
    });
    app.put('/users/admin',async(req,res)=>{
            const user=req.body;
            const filter={email:user.email};
            const updateDoc = {$set:{role:'admin'}};
            const result = await usersCollection.updateOne(filter,updateDoc);
           
            res.json(result);  
    });
    app.put('/updatestatus/:id',async(req,res)=>{
            const user=req.body;
            const filter={_id:ObjectId(req.params.id)};
            const updateDoc = {$set:{status:'Approved'}};
            const result = await ordersCollection.updateOne(filter,updateDoc);
            res.json(result);
    });
    app.get('/users/:email',async(req,res)=>{
        const email = req.params.email;
        const query= {email:email};
        const user = await usersCollection.findOne(query);
        let isAdmin = false;
        if(user?.role==='admin'){
            isAdmin=true;
        }
        res.json({admin:isAdmin});
    });
    app.listen(port,()=>{
      console.log('listening to port',port)
    });
});
     
