import express, { Application } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import swagger from "./docs/swagger";
import YAML from "yamljs";
import morgan from "morgan";
import { appLogger, morganLogger } from "./Shared/utils/logger";

// Routes
import customerRoutes from "./Modules/Customer/customer.routes";
import googleOauthRoutes from "./Modules/Oauth/Google/googleOauth.routes";
import imageRoutes from "./Modules/Image/image.routes";
import productSectionRoutes from "./Modules/ProductSection/productSection.routes";
import productCategoryRoutes from "./Modules/ProductCategory/productCategory.routes";
import productSubCategoryRoutes from "./Modules/ProductSubCategory/productSubCategory.routes";
import productRoutes from "./Modules/Product/product.routes";
import cartRoutes from "./Modules/Cart/cart.routes";
import paymentRoutes from "./Modules/Payment/payment.routes";
// import wishlistRoutes from "./Modules/WishList/wishlist.routes";
import cardRoutes from "./Modules/Payment/Card/card.routes";

const app: Application = express();

const corsOptions: CorsOptions = {
  //   origin: ["http://localhost:3000"],
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};

const swaggerDocument = YAML.load("./swagger.yaml");

app.set("trust proxy", 1); // Trust the first proxy

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms", {
    stream: {
      write: (message) => morganLogger.info(message.trim()), // Forward Morgan logs to Winston
    },
  })
);

app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(cookieParser());

app.use(
  "/docs",
  swagger.getSwaggerUi().serve,
  swagger.getSwaggerUi().setup(swaggerDocument)
);

app.use("/v2/customers", customerRoutes);
app.use("/v2/auth/google", googleOauthRoutes);
app.use("/v2/images", imageRoutes);
app.use("/v2/products/sections", productSectionRoutes);
app.use("/v2/products/categories", productCategoryRoutes);
app.use("/v2/products/subcategories", productSubCategoryRoutes);
app.use("/v2/products", productRoutes);
app.use("/v2/carts", cartRoutes);
app.use("/v2/payments", paymentRoutes);
app.use("/v2/cards", cardRoutes);
// app.use("/v2/wishlists", wishlistRoutes);

export default app;
