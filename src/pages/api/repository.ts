import mongoose from "mongoose";

export async function initDb() {
  const mongoDB =
    process.env.ENV === "PROD"
      ? process.env.DB_CLOUD_URI
      : process.env.DB_LOCAL_URI;

  await mongoose.connect(
    mongoDB as string,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any
  );

  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "MongoDB connection error:"));
}

export async function closeDb() {
  await mongoose.disconnect();
}
