const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json())


app.get('/', (req, res) => {
    res.send({ status: true, Message: 'Moon Tech Server is Running' })
})
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ujhfrio.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const productsCollection = client.db("moontech").collection("products")
        try {
            app.get('/products', async (req, res) => {
                const result = await productsCollection.find({}).toArray();
                res.send(result)
            })
        }
        catch {
            res.send({ status: false, message: "Products Not Found" })
        }
        try {
            app.post('/addproduct', async (req, res) => {
                const product = req.body;
                console.log(product)
                const result = await productsCollection.insertOne(product);
                console.log(result)
                res.send(result)
            })
        }
        catch {
            res.send({ status: false, message: 'Product Not Insert' })
        }
        try {
            app.delete('/deleteproduct/:id', async (req, res) => {
                const id = req.params.id;
                console.log(id)
                const query = { _id: new ObjectId(id) }
                const result = await productsCollection.deleteOne(query);
                console.log(result)
                res.send(result)
            })
        }
        catch {
            res.send({ status: false, message: 'Product Not Deleted' })
        }
    }
    catch {
        res.send({ status: false, Message: "Server Is Down" })
    }

}
run().catch(e => console.log(e))



app.listen(port, () => {
    console.log("Moon Tech Server is running")
})