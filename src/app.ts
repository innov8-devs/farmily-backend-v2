// Packages
import express, { Application } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import YAML from "yamljs";
import morgan from "morgan";
import fileUpload from "express-fileupload";
import fs from "fs";
import path from "path";

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
import cardRoutes from "./Modules/Payment/Card/card.routes";
import orderRoutes from "./Modules/Order/order.routes";
// import wishlistRoutes from "./Modules/WishList/wishlist.routes";

import swagger from "./docs/swagger";
import { morganLogger } from "./Shared/utils/logger";
import { validateImages } from "./Shared/Middlewares/validateImages.middleware";
import { isAuthenticated } from "./Shared/Middlewares/Account/isAuthenticated.middleware";
import { ImageController } from "./Modules/Image/image.controller";

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

app.use(fileUpload());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
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
app.use("/v2/orders", orderRoutes);
// app.use("/v2/wishlists", wishlistRoutes);

// Image Upload
app.post(
  "/v2/images/upload",
  isAuthenticated,
  (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send({ message: "No files were uploaded." });
    }

    // Get the uploaded files (this could be a single file or an array of files)
    let uploadedFiles = req.files.file;

    if (!Array.isArray(uploadedFiles)) {
      uploadedFiles = [uploadedFiles];
    }

    // Process each file
    uploadedFiles.forEach((file) => {
      const uploadPath = path.join(__dirname, "uploads", file.name);

      file.mv(uploadPath, function (err) {
        if (err) {
          return res.status(500).send(err);
        }
      });
    });

    next();
  },
  validateImages,
  ImageController.uploadImage
);

app.put(
  "/v2/images/:imageId",
  isAuthenticated,
  (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send({ message: "No files were uploaded." });
    }

    if (Object.keys(req.files).length > 1) {
      return res.status(400).send({ message: "Single image required!" });
    }

    let uploadedFiles = req.files.file;

    if (!Array.isArray(uploadedFiles)) {
      uploadedFiles = [uploadedFiles];
    }

    uploadedFiles.forEach((file) => {
      const uploadPath = path.join(__dirname, "uploads", file.name);

      file.mv(uploadPath, function (err) {
        if (err) {
          return res.status(500).send(err);
        }
      });
    });

    next();
  },
  validateImages,
  ImageController.handleImageUpdate
);

// Create uploads directory if not exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

export default app;
