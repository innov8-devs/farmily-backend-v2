import express, { Application } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import swagger from "./docs/swagger";
import YAML from 'yamljs';

import customerRoutes from "./Modules/Customer/customer.routes";
import googleOauthRoutes from "./Modules/Oauth/Google/googleOauth.routes";
import imageRoutes from "./Modules/Image/image.routes";
import productSectionRoutes from "./Modules/ProductSection/productSection.routes";
import productCategoryRoutes from "./Modules/ProductCategory/productCategory.routes";
import productSubCategoryRoutes from "./Modules/ProductSubCategory/productSubCategory.routes";
import productRoutes from "./Modules/Product/product.routes";
import cartRoutes from "./Modules/Cart/cart.routes";

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

app.set('trust proxy', 1); // Trust the first proxy

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
app.use("/api/v2/images", imageRoutes);
app.use("/api/v2/products/sections", productSectionRoutes);
app.use("/api/v2/products/categories", productCategoryRoutes);
app.use("/api/v2/products/subcategories", productSubCategoryRoutes);
app.use("/api/v2/products", productRoutes);
app.use("/api/v2/carts", cartRoutes);


export default app;
