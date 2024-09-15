import { Response } from "express";
import MongoConnection from "./Infrastructure/Databases/mongoConnection";
import { config } from "./Config/app.config";
import app from "./app"

app.get("/", (_, res: Response) => {
  res.status(200).send({
    message: "Welcome, This is Farmily Africa!",
  });
});

const startServer = async () => {
  try {
    await MongoConnection.connect();
    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
  }
};

startServer();
