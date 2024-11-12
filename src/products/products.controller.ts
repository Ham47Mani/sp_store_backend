import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Roles } from 'src/shared/guards/role.decorators';
import { userTypes } from 'src/enums/users.enums';
import { ValidateMongoID } from 'src/shared/pipes/ValidateMongoId.pipe';

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

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  // --- Get One Products
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ValidateMongoID) id: string) {
    return this.productsService.findOneProduct(id);
  }

  // --- Remove One Products
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async removeProduct(@Param('id', ValidateMongoID) id: string) {
    return this.productsService.removeProduct(id);
  }
}
