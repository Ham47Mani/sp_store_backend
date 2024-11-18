import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from 'src/shared/repositories/product.repository';
import { GetProductQueryDto } from './dto/get-product-query.dto';
import qsToMongo from 'qs-to-mongo';
import { CloudinaryServices } from 'src/shared/cloudinary/cloudinary.management';
import { UploadApiOptions } from 'cloudinary';
import { unlinkSync } from 'fs';
import { Products } from 'src/shared/schema/products';

@Injectable()
export class ProductsService {
  // Declaration
  private cloudinaryServices: CloudinaryServices;

  // Inject the product repository
  constructor (@Inject(ProductRepository) private readonly productDB: ProductRepository) {
    this.cloudinaryServices = new CloudinaryServices();
  }

  //--- Create a new product
  async createProduct(createProductDto: CreateProductDto) {
    try {
      // Create Product in DB
      const createProductInDB = await this.productDB.createProduct(createProductDto);
      return {
        message: "Product created successfully",
        success: true,
        result: createProductInDB
      }
    } catch (error) {
      console.log("Create new products error : ", error);
      throw error;      
    }
  }

  // --- Get All Products
  async findAllProducts(query: GetProductQueryDto) {
    try {
      let callForHomePage: boolean = false;
      if (query.homePage)
        callForHomePage = true;

      delete query.homePage;
      const {options, links} = qsToMongo(query);

      if (callForHomePage) {
        const products = await this.productDB.findProductsWithGroupBy();

        return {
          message: products.length > 0 ? `Products fetched succesfully` : `No products founds`,
          success: true,
          result: {
            latestProducts: products[0].latestProducts,
            topRatedProducts: products[0].topRatedProducts,
          }
        }
      } else {
        const {totalProductsCount, products} = await this.productDB.find(query);
        
        return {
          message: products.length > 0 ? `Products fetched succesfully` : `No products founds`,
          success: true,
          result: {
            metadata: {
              skip: options.skip || 0,
              limit: options.limit || 10,
              total: totalProductsCount,
              page: options.limit ? Math.ceil(totalProductsCount / options.limit) : 1,
              links: links("/", totalProductsCount),
            },
            products
          }
        }
      }
    } catch (error) {
      console.log("Get all products error");
      throw error;
    }
  }

  //--- Get one product with ID
  async findOneProduct(id: string) {
    try {
      // Check if the product exists
      const product = await this.productDB.findOneProduct(id); 
      if (!product)
        throw new NotFoundException("This product not exists");

      // Get Related Products and Delete The Current Product
      const {products} = await this.productDB.find({category: product.category});
      let relatedProduct: Products[] = []
      if (products.length > 0)
        relatedProduct = products.filter(relatedProduct => relatedProduct._id.toString() !== product._id.toString());

      return {
        message: `Product id [${id}] fetched successufully`,
        success: true,
        result: {product, relatedProduct}
      }
    } catch (error) {
      console.log("Find One Product by ID Error");
      throw error;
    }
  }

  // --- Update a Products
  async updateProduct(id: string, updateProductDto: UpdateProductDto) { 
    try {
      // Check if the product exists
      const product = await this.productDB.findOneProduct(id);
      if (!product)
        throw new NotFoundException("This product not exists");

      // Update the product
      const updatedProduct = await this.productDB.updateOneProduct({_id: id}, updateProductDto);
      
      return {
        message: "Product Updated Successfully",
        suces: true, 
        result: updatedProduct
      }

    } catch (error) {
      console.log("Update product error : ", error);
      throw error;
    }
  }

  // --- Remove a Products
  async removeProduct(id: string) {
    try {
      // Check if the product exists
      const product = await this.productDB.deleteOneProduct(id);
      if (!product)
        throw new NotFoundException("This product not exists");

      return {
        message: `Product id [${id}] Deleted`,
        success: true,
        result: product
      }
    } catch (error) {
      console.log("Remove product error");
      throw error;
    }
  }

  // --- Upload Product Image
  async uploadProductImage (id: string, file: Express.Multer.File): Promise<any> {    
    try {
      // Check if the product exists
      const product = await this.productDB.findOneProduct(id);
      if (!product)
        throw new NotFoundException("Product does not exist");

      // Check the product file exist in cloudinary
      if (product.imageDetails?.public_id) {
        await this.cloudinaryServices.destroy(product.imageDetails?.public_id, {invalidate: true})
      }
      // Options of upload file
      const options: UploadApiOptions = {
        folder: process.env.CLOUDINARY_FOLDER_PATH,
        public_id: process.env.CLOUDINARY_PUBLIC_ID_PREFIX,
        transformation: [
          {
            width: process.env.CLOUDINARY_BIG_SIZE.toString().split('X')[0],
            height: process.env.CLOUDINARY_BIG_SIZE.toString().split('X')[0],
            crop: 'fill'
          },
          { quality: 'auto'}
        ]
      }
      // Upload file
      const resOfCloudinary = await this.cloudinaryServices.uploadFile(file.path, options);
      // Remove the file from local server storage
      unlinkSync(file.path);

      // Update the product with product image info
      const updatedProduct = await this.productDB.updateOneProduct({_id: id}, {
        imageDetails: resOfCloudinary,
        image: resOfCloudinary.secure_url
      });

      return {
        message: "Image uploaded successfully",
        success: true,
        result: {
          product: updatedProduct,
          product_image_url: updatedProduct.image
        }
      }

    } catch (error) {
      console.log("Upload product image error in uploadProductImage [products.service]");
      throw error;
    }
  }
}
