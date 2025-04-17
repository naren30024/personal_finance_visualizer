import { MongoClient, ServerApiVersion } from 'mongodb';

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

const uri = process.env.MONGODB_URI;

const options = {
  maxPoolSize: 10,
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
};

if (!global._mongoClientPromise) {
  const client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect()
    .then(client => {
      console.log('Successfully connected to MongoDB');
      const db = client.db('finance-tracker');
      return db.command({ ping: 1 }).then(() => {
        console.log('Successfully pinged database');
        return client;
      });
    })
    .catch(err => {
      console.error('Failed to connect to MongoDB:', err);
      throw err;
    });
}

const clientPromise = global._mongoClientPromise;

export default clientPromise;
