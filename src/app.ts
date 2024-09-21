import express, { Application } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import swagger from "./docs/swagger";
import YAML from 'yamljs';

import customerRoutes from "./Modules/Customer/customer.routes";
import googleOauthRoutes from "./Modules/Oauth/Google/googleOauth.routes";
// import { config } from './config/config';

const app: Application = express();

const corsOptions: CorsOptions = {
//   origin: ["http://localhost:3000"],
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"], 
  credentials: true, 
  optionsSuccessStatus: 200, 
};

const swaggerDocument = YAML.load('./swagger.yaml');

app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(cookieParser());

app.use(
  "/api/docs",
  swagger.getSwaggerUi().serve,
  swagger.getSwaggerUi().setup(swaggerDocument)
);

app.use("/api/v2/customers", customerRoutes);
app.use("/api/v2/auth/google", googleOauthRoutes);

export default app;
