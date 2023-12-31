const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@cluster0.ktxzlkz.mongodb.net/?retryWrites=true&w=majority`;

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
        const WorkDB = client.db("manageWork").collection("work");

        app.post("/work", async (req, res) => {
            const work = req.body;
            console.log(work);
            const result = await WorkDB.insertOne(work);
            res.send(result);
        })
        app.get('/allWork', async (req, res) => {
            const result = await WorkDB.find().toArray()
            res.send(result);
        })
        app.get('/allWork/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await WorkDB.findOne(query)
            res.send(result);
        })
        app.get('/todo', async (req, res) => {
            const query = { position: 'to do' }
            const result = await WorkDB.find(query).toArray()
            res.send(result);
        })
        app.get('/ongoing', async (req, res) => {
            const query = { position: 'ongoing' }
            const result = await WorkDB.find(query).toArray()
            res.send(result);
        })
        app.get('/completed', async (req, res) => {
            const query = { position: 'completed' }
            const result = await WorkDB.find(query).toArray()
            res.send(result);
        })
        app.patch('/work/:id', async (req, res) => {
            const id = req.params.id
            const { name } = req.body;
            const query = { _id: new ObjectId(id) }
            const updateDoc = {
                $set: {
                    position: name
                }

            };
            const result = await WorkDB.updateOne(query, updateDoc);
            console.log(result);
            res.send(result);
        })
        app.patch('/edit/:id', async (req, res) => {
            const id = req.params.id
            const data = req.body;
            const query = { _id: new ObjectId(id) }
            console.log(data)
            const updateDoc = {
                $set: {
                    titles: data.titles,
                    descriptions: data.descriptions,
                    deadlines: data.deadlines,
                    priority: data.priority
                }

            };
            const result = await WorkDB.updateOne(query, updateDoc);
            console.log(result);
            res.send(result);
        })

        app.delete('/delete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await WorkDB.deleteOne(query);
            res.send(result)
        })
        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('running server')
})
app.listen(port, () => {
    console.log(`this is the port ${port}`)
})
