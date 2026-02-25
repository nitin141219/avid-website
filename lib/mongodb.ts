import { MongoClient } from "mongodb";

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise && process.env.MONGODB_URI) {
    client = new MongoClient(process.env.MONGODB_URI);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise as Promise<MongoClient>;
} else {
  if (process.env.MONGODB_URI) {
    client = new MongoClient(process.env.MONGODB_URI);
    clientPromise = client.connect();
  }
}

export async function getMongoDb() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured");
  }
  if (!clientPromise) {
    client = new MongoClient(process.env.MONGODB_URI);
    clientPromise = client.connect();
  }
  const connectedClient = await clientPromise;
  const dbName = process.env.MONGODB_DB_NAME;
  return dbName ? connectedClient.db(dbName) : connectedClient.db();
}
