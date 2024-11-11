import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode } from '@nestjs/common';
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
  @HttpCode(200)
  @Roles(userTypes.ADMIN)
  async updateProduct(@Param('id') id: ValidateMongoID, @Body() updateProductDto: UpdateProductDto) {
    return await this.productsService.updateProduct(id, updateProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
