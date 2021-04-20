const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()


const port = process.env.PORT || 5000

app.use(cors());
app.use(bodyParser.json());

// console.log(process.env.DB_USER);
app.get('/', (req, res) => {
  res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v0opz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log('connection err', err);
  const serviceCollection = client.db("moveon").collection("services");
  // console.log('Database connected successfully');
  app.post('/addService', (req, res) => {
    const newService = req.body;
    console.log('adding new service: ', newService);
    serviceCollection.insertOne(newService)
    .then(result => {
      console.log('inserted count', result.insertedCount)
      res.send(result.insertedCount > 0)
    })
  })

  app.get('/services', (req, res) => {
    serviceCollection.find()
      .toArray((err, items) => {
        res.send(items)
        // console.log('from database', items);
      })
  })

  app.get('/reviews', (req, res) => {
    reviewCollection.find()
      .toArray((err, items) => {
        res.send(items)
        // console.log('from database', items);
      })
  })
  
  const ObjectID = require('mongodb').ObjectID
  app.delete('/deleteService/:id', (req, res) => {
    const id = ObjectID(req.params.id);
    console.log('delete this');
    serviceCollection.deleteOne({ _id: id })
    .then((err, documents) => res.send(documents))
  })

  const reviewCollection = client.db("moveon").collection("reviews");
  app.post('/addReview', (req, res) => {
    const newService = req.body;
    console.log('adding new service: ', newService);
    reviewCollection.insertOne(newService)
    .then(result => {
      console.log('inserted count', result.insertedCount)
      res.send(result.insertedCount > 0)
    })
  })

  const tripCollection = client.db("moveon").collection("tripList");
  app.post('/hire', (req, res) => {
    const newOrder = req.body;
    console.log('adding new order: ', newOrder);
    tripCollection.insertOne(newOrder)
    .then(result => {
      console.log('inserted count: ', result.insertedCount);
      res.send(result.insertedCount > 0)
    })
  })

  // get tripList list from database
  app.get('/tripList', (req, res) => {
    console.log(req.query.email);
    tripCollection.find({email: req.query.email})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  // client.close();
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})