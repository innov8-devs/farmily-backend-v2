import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
// import swagger from "./docs/swagger";

import customerRoutes from "./Modules/Customer/customer.routes";
// import { config } from './config/config';

const app = express();

const corsOptions: CorsOptions = {
//   origin: ["http://localhost:3000"],
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"], 
  credentials: true, 
  optionsSuccessStatus: 200, 
};

app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(cookieParser());

// app.use(
//   "/api-docs",
//   swagger.getSwaggerUi().serve,
//   swagger.getSwaggerUi().setup(swagger.getSpecs())
// );
app.use("/api/v2/customers", customerRoutes);

export default app;
