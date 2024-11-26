import * as ExcekJs from "exceljs";
import * as fs from "fs";
import * as path from "path";

// --- Excel Column Type
export type ExcelColumn = {
  header: string;
  key: string;
  width?: number
}

// --- Excel Management Class
export class ExcelManagment {
  /**
   * Export Orders to an excel file and save it locally
   * 
   * @Param orders => Array of order objects to be included in the excel file.
   * @Param columns => Array of column definitions for the excel file.
   * @Param filePath => The path where the excel file should be stored
   * 
   * @Return An object containing the path of the excel file and its buffer.
   * 
   */

  static async exportOrders (orders: any[], columns: ExcelColumn[], folderPath: string): Promise<{filePath: string, buffer: ExcekJs.Buffer }> {
    try {
      // Ensure the directory exists
      if (!fs.existsSync(folderPath))
        fs.mkdirSync(folderPath, {recursive: true});

      // Generate a unique filename for excel file
      const fileName = `orders_${Date.now()}.xlsx`;
      const filePath = path.join(folderPath, fileName);

      // Create a new workbook and worksheet
      const workbook = new ExcekJs.Workbook();
      const worksheet = workbook.addWorksheet('Orders');

      // Set up columns
      worksheet.columns = columns;
      // Add rows of data
      worksheet.addRows(orders);

      // Apply styling to the header row
      worksheet.getRow(1).font = {bold: true};

      // Save the excel file to the given path
      await workbook.xlsx.writeFile(filePath);

      // Get the buffer of the excel file
      const buffer = await workbook.xlsx.writeBuffer();

      // return file path and buffer
      return {filePath, buffer}

    } catch (error) {
      console.log(`Error exporting orders to Excel: ${error.message}`);
      throw error
    }
  }
}

// Example Usage in a Controller:
/*

import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('export')
  async exportOrders(@Query('folderPath') folderPath: string, @Res() res: Response) {
    const orders = await this.ordersService.findAll(); // Fetch all orders

    const { filePath, buffer } = await this.ordersService.exportOrdersToExcel(orders, folderPath);

    // Send the file buffer as a downloadable attachment
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="orders.xlsx"`,
    });

    res.send(buffer);

    console.log(`Excel file saved at: ${filePath}`); // Optional: Log file path
  }
}
 */