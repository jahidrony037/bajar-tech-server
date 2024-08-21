const express = require ('express');
const app = express();
const dotenv = require ('dotenv');
dotenv.config();
const cors = require('cors');

const port = process.env.PORT || 5000;

app.use(cors(['https://bajar-tech.web.app/','https://bajar-tech.firebaseapp.com/','http://localhost:5173/']));
app.use(express.json());



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@atlascluster.k7qynmg.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });

    const productsCollection= client.db("bajar-tech").collection("products");

    //all products api 

    app.get('/allProducts', async(req,res)=>{
      
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const totalProducts = await productsCollection.countDocuments();
   
      const products = await productsCollection.find({}).skip((page-1)*limit).limit(limit).toArray();
      // console.log(products);
      res.json({
        products,
        currentPage:page,
        totalPage:Math.ceil(await productsCollection.countDocuments()/limit), 
        totalProducts
      })
      
    })

    //search by name api
    app.get('/products/search', async(req,res)=>{
      const {name}=req.query;
      // console.log(name);
      const products = await productsCollection.find({name:{$regex:name, $options:'i'}}).toArray();
      res.json(products);
    })




    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req,res)=>{
    res.send('bajar-tech sever is running ....');
})

app.listen(port, ()=> {
    console.log(`app listening on port ${port}`);
})