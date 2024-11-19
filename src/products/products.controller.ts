import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query, UseInterceptors, UploadedFile, Put } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Roles } from 'src/shared/guards/role.decorators';
import { userTypes } from 'src/enums/users.enums';
import { ValidateMongoID } from 'src/shared/pipes/ValidateMongoId.pipe';
import { GetProductQueryDto } from './dto/get-product-query.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductSkuArrayDto, ProductSkuDto } from './dto/productSku.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // --- Create new Products
  @Post()
  @HttpCode(201)
  @Roles(userTypes.ADMIN)
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return await this.productsService.createProduct(createProductDto);
  }

  // --- Update a Products
  @Patch(':id')
  @Roles(userTypes.ADMIN)
  async updateProduct(@Param('id', ValidateMongoID) id: string, @Body() updateProductDto: UpdateProductDto) {
    return await this.productsService.updateProduct(id, updateProductDto);
  }

  // --- Get All Product With query "Search"
  @Get()
  async findAllProducts(@Query() query: GetProductQueryDto) {
    return await this.productsService.findAllProducts(query);
  }

  // --- Get One Products
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOneProduct(@Param('id', ValidateMongoID) id: string) {
    return await this.productsService.findOneProduct(id);
  }

  // --- Remove One Products
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async removeProduct(@Param('id', ValidateMongoID) id: string) {
    return await this.productsService.removeProduct(id);
  }

  // --- Upload Product Image
  @Post(':id/image')
  @Roles(userTypes.ADMIN)
  @UseInterceptors( // Use Built-in FileInterceptor for set Name for the file and set a limit size to 3Mb
    FileInterceptor("product_image", {
      dest: process.env.FILE_STORAGE_PATH || './uploads/',
      limits: {
        fileSize: 3145728 // 1024 * 1024 * 3 = 3MB
      }
    })
  )
  async uploadProductImage (@Param('id', ValidateMongoID) id: string, @UploadedFile() file: Express.Multer.File) {
    return this.productsService.uploadProductImage(id, file);
  }

  // --- Update Or Create Single Or Multiple Sku product
  @Post("/:productId/skus")
  @Roles(userTypes.ADMIN)
  async updateOrCreateProductSku(@Param('productId', ValidateMongoID) productId: string, @Body() productSkuArrayDto: ProductSkuArrayDto) {
    return this.productsService.updateOrCreateProductSku(productId, productSkuArrayDto);
  }

  @Put("/:productId/skus/:skuCode")
  @Roles(userTypes.ADMIN)
  async updateSingleProductSku(
    @Param('productId', ValidateMongoID) productId: string,
    @Param('skuCode') skuCode: string,
    @Body() productSkuDto: ProductSkuDto
  ) {
    return this.productsService.updateProductSkuById(productId, skuCode, productSkuDto);
  }
}
