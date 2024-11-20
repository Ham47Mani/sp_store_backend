import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from 'src/shared/repositories/product.repository';
import { GetProductQueryDto } from './dto/get-product-query.dto';
import qsToMongo from 'qs-to-mongo';
import { CloudinaryServices } from 'src/shared/cloudinary/cloudinary.management';
import { UploadApiOptions } from 'cloudinary';
import { unlinkSync } from 'fs';
import { Products } from 'src/shared/schema/products';
import { ProductSkuArrayDto, ProductSkuDto } from './dto/productSku.dto';

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

  // --- Update Or Create Single Or Multiple Sku product
  async updateOrCreateProductSku (productId: string, {skus}: ProductSkuArrayDto) {
    try {
      // Check if the sku array exist
      if (!skus)
        throw new BadRequestException("Please add skus you need to add to the product");

      // Check if the product is exist
      const product = await this.productDB.findOneProduct(productId);
      if (!product)
        throw new NotFoundException("Product does not exist");

      // Generate SkuCode For Each Sku
      skus.map(sku => sku.skuCode = Math.random().toString(36).substring(2,5) + Date.now());

      // Update The Product
      const updatedProduct = await this.productDB.updateOneProduct(
        {_id: productId},
        {$push: {skuDetails: skus}}
      );

      return {
        message: "Product Sku Updated Successfully",
        success: true,
        result: updatedProduct
      }

    } catch (error) {
      console.log(`Update Or Create product sku details error [${error.message}]`);
      throw error
    }
  }

  // --- Update A Single Sku product
  async updateProductSkuById (productId: string, skuCode: string, skuDetails: ProductSkuDto) {
    try {
      // Check if the product is exist
      const product = await this.productDB.findOneProduct(productId);
      if (!product)
        throw new NotFoundException("Product does not exist");

      // Check if the sku is exist
      const sku = product.skuDetails.find(sku => sku.skuCode == skuCode);
      if (!sku)
        throw new NotFoundException("Sku does not exist");

      // Update the sku
      const dataForUpdate = {
        skuCode
      }
      for (const key in skuDetails) {
        if(skuDetails.hasOwnProperty(key)) {
          dataForUpdate[`skuDetails.$.${key}`] = skuDetails[key]
        }
      }
      const updatedProduct = await this.productDB.updateOneProduct(
        {_id: productId, 'skuDetails.skuCode': skuCode},
        {$set: {dataForUpdate}}
      );

      return {
        message: "Product sku updated successfully",
        success: true,
        result: updatedProduct
      }

    } catch (error) {
      console.log(`Upldate Product sku By ID error [${error.message}]`);
      throw error;
    }
  }

  // --- Get All Product Skus
  async getAllProductSkus (productID: string) {
    try {
      // Check if the products exist
      const product = await this.productDB.findOneProduct(productID);
      if (!product)
        throw new NotFoundException("This product does not exist");

      return {
        message: "Fetch all skus product",
        success: true,
        result: product.skuDetails
      }
    } catch (error) {
      console.log(`Fetch all product skus error : ${error.message}`);
      throw error;
    }
  }

  // --- Add Product Sku License
  async addProductSkuLicense (productID:string, skuID: string, licenseKey: string) {
    try {
      // Check if the product exist
      const product = await this.productDB.findOneProduct(productID);
      if (!product)
        throw new NotFoundException("This product does not exist");

      const sku = product.skuDetails.find(sku => sku._id.toString() === skuID);
      if (!sku)
        throw new NotFoundException("This sku does not exist");

      // Add the license key to the product
      const license = await this.productDB.createLicense(productID, skuID, licenseKey);

      return {
        message: "Product license created successfully",
        success: true,
        result: license
      }

    } catch (error) {
      console.log(`Add product sku license error : ${error.message}`);
      throw error;
    }
  }

  // --- Update Licence Key
  async updateLicenseKey (licenseID: string, licenseKey: string) {
    try {
      // Check if the license exist
      const license = await this.productDB.findOneLicense(licenseID);
      if (!license)
        throw new NotFoundException("This license does not exist");

      // Updated license
      const updatedLicense = await this.productDB.updateLicenseKey({_id: licenseID}, licenseKey);
  
      return {
        message: "Updated license successfully",
        success: true, 
        result: updatedLicense
      }

    } catch (error) {
      console.log(`Update Product Sku License error : ${error.message}`);
      throw error;
    }
  }

  // --- Remove License Prduct Sku
  async removeProductSkuLicense (licenseID: string) {
    try {
      // Check if the license exist
      const license = await this.productDB.findOneLicense(licenseID);
      if (!license)
        throw new NotFoundException("This license does not exist");

      const deletedLicense = await this.productDB.removeLicense(licenseID);

      return {
        message: "Delete license successfully",
        success: true,
        result: deletedLicense
      }
    } catch (error) {
      console.log(`Remove Product License Error : ${error.message}`);
      throw error;
    }
  }

  // --- Get License By ID
  async getLicenseById (licenseID: string) {
    try {
      // Check if the license exist
      const license = await this.productDB.findOneLicense(licenseID);
      if (!license)
        throw new NotFoundException('This license does not exist');

      return {
        message: "Fetch license by ID successfully",
        success: true,
        result: license
      }
    } catch (error) {
      console.log("This license does not exist");
      throw error;
    }
  }

  // --- Get All Product Sku Licenses
  async getAllLicenses (productID: string, skuID: string) {
    try {
      // Check if the product exist
      const product = await this.productDB.findOneProduct(productID);
      if (!product)
        throw new NotFoundException('Product does not exist');

      // Check if the sku exist
      const sku = product.skuDetails.find(sku => sku._id.toString() === skuID);
      if (!sku)
        throw new NotFoundException("Sku does not exist");

      // Get licenses
      const licenses = await this.productDB.getAllLicense(productID, skuID);

      return {
        message: "Fetch all license successfully",
        success: true,
        result: licenses
      }

    } catch (error) {
      console.log(`Gett all license for sku product error : ${error.message}`);
      throw error
    }
  }
}
