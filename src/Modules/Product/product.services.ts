import slugify from "slugify";
import { IProduct, GetAllProductsInput } from "./productTypes";
import ProductRepository from "./product.repository";
import {
  CreateProductInput,
  CreateBulkProductsInput,
  UpdateProductInput,
} from "./productTypes";
import {
  InternalServerException,
  NotFoundException,
} from "../../Shared/Exceptions";

/**
 * Service class for product mutations.
 */
export class ProductServices {
  public static async createProduct(data: CreateProductInput) {
    const slug = this.generateSlugFromName(data.name);

    const createdProduct = await ProductRepository.createOne({ ...data, slug });

    if (!createdProduct)
      throw new InternalServerException("PRODUCT CREATION FAILED");

    return createdProduct;
  }

  public static async createBulkProducts(data: CreateBulkProductsInput) {
    const createdProducts = await ProductRepository.createMany(data.products);

    if (createdProducts.length == 0)
      throw new InternalServerException("The product creation process failed!");

    return createdProducts;
  }

  public static async updateProduct(data: UpdateProductInput) {
    const slug = this.generateSlugFromName(data.payload.name);

    const updatedProduct = await ProductRepository.updateOne(
      { _id: data.productId },
      { ...data.payload, slug }
    );

    if (!updatedProduct)
      throw new NotFoundException("The product is not found!");

    return updatedProduct;
  }

  public static async deleteProduct(productId: string) {
    const deletedProduct = await ProductRepository.deleteOne({
      _id: productId,
    });

    if (deletedProduct.deletedCount === 0)
      throw new InternalServerException("The product delete process failed!");

    return "The product is deleted successfully!";
  }

  public static async assignProductCategory(
    productId: string,
    productCategoryId: string
  ): Promise<string> {
    const updatedProduct = await ProductRepository.updateOne(
      { _id: productId },
      { category: productCategoryId }
    );

    if (!updatedProduct) {
      throw new NotFoundException("The product is not found!");
    }

    return "The product category is assigned to the product successfully!";
  }

  public static async unAssignProductCategory(
    productId: string,
    productCategoryId: string
  ): Promise<string> {
    const updatedProduct = await ProductRepository.updateOne(
      { _id: productId },
      { category: productCategoryId }
    );

    if (!updatedProduct) {
      throw new NotFoundException("The product is not found!");
    }

    return "The product category is unassigned from the product successfully!";
  }

  public static async decrementProductStock(
    productId: string,
    quantity: number
  ) {
    const product = await this.getProduct(productId);

    if (!product) throw new NotFoundException("PRODUCT NOT FOUND");

    const updatedProduct = await ProductRepository.updateOne(
      { _id: productId },
      { quantity: product.stockQty - quantity }
    );

    return updatedProduct;
  }

  public static async getProduct(productId: string): Promise<IProduct> {
    const foundProduct = await ProductRepository.findOne({ _id: productId });

    if (!foundProduct) throw new NotFoundException("The product is not found!");

    const populatedProduct = await this.populateProducts([foundProduct]);

    return populatedProduct[0] as IProduct;
  }

  public static async getProductSuggestions(
    query: string
  ): Promise<IProduct[]> {
    const matchedProducts = await ProductRepository.aggregate([
      {
        $search: {
          index: "autoCompleteSearchProduct",
          text: {
            query,
            path: {
              wildcard: "*",
            },
          },
        },
      },
      { $limit: 8 },
      {
        $project: {
          name: 1,
          description: 1,
          benefits: 1,
          originalPrice: 1,
          discountPrice: 1,
          stockQty: 1,
          image: 1,
          keywords: 1,
          category: 1,
          subCategory: 1,
          discounts: 1,
          brand: 1,
          views: 1,
        },
      },
    ]);

    if (matchedProducts.length < 1) {
      throw new NotFoundException("No products found!");
    }

    return await this.populateProducts(matchedProducts);
  }

  public static async getAllProducts(query: any) {
    const {
      pageNumber,
      pageSize,
      sort,
      subCategory,
      productSection,
      category,
    } = query;
    const skip = (pageNumber - 1) * pageSize;

    return await ProductRepository.findMany(
      {
        $or: [{ subCategory }, { productSection }, { category }],
      },
      { sort, skip, limit: pageSize, populate: ["image", "category"] }
    );
  }

  private static generateSlugFromName(name: string) {
    const randomString = this.generateRandomString();

    const slug = slugify(name, { lower: true });

    return slug + randomString;
  }

  private static generateRandomString(): string {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomString = "";
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }
    return randomString;
  }

  private static async populateProducts(
    products: IProduct[]
  ): Promise<IProduct[]> {
    const populateProducts = await ProductRepository.populate(
      products,
      ["image", "category", "subCategory"],
      ["Image", "ProductCategory", "ProductSubCategory"]
    );

    return populateProducts as IProduct[];
  }
}
