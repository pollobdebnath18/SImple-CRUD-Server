const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

//middleware
app.use(cors());
app.use(express.json());

const uri =
  "mongodb://SimpleCrudUsers:U3IjG5iVBPNcBWWr@ac-mpjzkew-shard-00-00.0wxl8hn.mongodb.net:27017,ac-mpjzkew-shard-00-01.0wxl8hn.mongodb.net:27017,ac-mpjzkew-shard-00-02.0wxl8hn.mongodb.net:27017/?ssl=true&replicaSet=atlas-13w1b2-shard-0&authSource=admin&appName=Cluster0";
// const uri = `mongodb+srv://SimpleCrudUsers:U3IjG5iVBPNcBWWr@cluster0.0wxl8hn.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const run = async () => {
  try {
    await client.connect();

    const db = client.db("SimpleCrud");
    const userCollection = db.collection("users");
    // client.db("SimpleCrud").collection("users");

    //READ all user
    app.get("/users", async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //READ user details
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      // res.send("user by id");
      const query = {
        _id: new ObjectId(id),
      };
      const user = await userCollection.findOne(query);
      // console.log(req.params);
      res.send(user);
    });

    //CREATE
    app.post("/users", async (req, res) => {
      const newUser = req.body;
      console.log("Post method: user to be inserted", newUser);
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });

    //UPDATE
    app.patch("/users/:id", async (req, res) => {
      const id = req.params.id;
      const filter = {
        _id: new ObjectId(id),
      };
      const updateUser = req.body;
      const updatedDocument = {
        $set: {
          name: updateUser.name,
          email: updateUser.email,
          role: updateUser.role,
        },
      };
      const result = await userCollection.updateOne(filter, updatedDocument);
      res.send(result);
    });

    //DELETE
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id),
      };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
  }
};
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Simple CRUD operation is serving");
});

app.listen(port, () => {
  console.log(`Simple crud is running on port ${port}`);
});
