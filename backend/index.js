const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;
console.log("DB user name", process.env.DB_USER)

//middleware
app.use(cors());
app.use(express.json());


//mongodb connection
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@yoga-master.lfncmop.mongodb.net/?retryWrites=true&w=majority&appName=yoga-master`;

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
    await client.connect();

    //Create a database and collection

    const database = client.db("yoga-master");
    const usersCollection = database.collection("users");
    const classesCollection = database.collection("classes");
    const cartCollection = database.collection("cart");
    const paymentsCollection = database.collection("payments");
    const enrolledCollection = database.collection("enrolled");
    const appliedCollection = database.collection("applied");

    //classes routes here
    
    app.post('/new-class', async  (req, res) => {
        const newClass = req.body;
        // newClass.availableSeats = parseInt(newClass.availableSeats);  
        const result = await classesCollection.insertOne(newClass);
        res.send(result);
    })

    app.get('/classes', async (req, res) => {
        const query = {status: 'approved'};
        const result = await classesCollection.find().toArray();
        res.send(result);
    })

    //get classes by instructor email address   
    app.get('/classes/:email', async (req, res) => {
        const email = req.params.email;
        const query = {instructorEmail: email};
        const result = await classesCollection.find(query).toArray();
        res.send(result);
    })

    //manage classes
    app.get('/classes-manage',async (req, res) => {
        const result = await classesCollection.find().toArray();
        res.send(result);
    })

    //update classes status and reason
    app.patch('/change-status/:id',async (req, res) => {
        const id = req.params.id;
        const status = req.body.status;
        const reason = req.body.reason;
        const filter = {_id: new ObjectId(id)};
        const options = {upsert: true};
        const updateDoc = {
            $set: {
              status: status,
              reason: reason,
            },
          };
        const result = await classesCollection.updateOne(filter, updateDoc, options);
        res.send(result);
    })

    //get approved classes
    app.get('/approved-classes',async (req, res) => {
        const query = {status: 'approved'};
        const result = await classesCollection.find(query).toArray();
        res.send(result);
    })

    //get single class details
    app.get('/class/:id',async (req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await classesCollection.findOne(query);
        res.send(result);
    })

    //update class details (all data)
    app.put('/update-class/:id',async (req, res) => {
        const id = req.params.id;
        const updateClass = req.body;
        const filter = {_id: new ObjectId(id)};
        const options = {upsert: true};
        const updateDoc = {
            $set:{
                name: updateClass.name,
                description: updateClass.description,
                price: updateClass.price,
                availableSeats: parseInt(updateClass.availableSeats),
                videoLink: updateClass.videoLink,
                status: 'pending',
            }
          };
        const result = await classesCollection.updateOne(filter, updateDoc, options);
        res.send(result);

    })

    //Cart Routes
    















    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello Nisal 2024!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})