import { UploadApiErrorResponse, UploadApiOptions, UploadApiResponse } from "cloudinary";
import cloudinary from "./cloudinary.config";
import { error } from "console";
import { Readable } from "stream";
import { buffer } from "stream/consumers";


export class CloudinaryServices {
  // Upload a Single File In Cloudinary Using The Direct Method
  async uploadFile (filePath: string, options: Record<string, any> = {}): Promise<UploadApiResponse> {
    try {
      const result: UploadApiResponse= await cloudinary.uploader.upload(filePath, options);  
      return result;
    } catch (error) {
      console.log(`Cloudinary uploadFile error: ${error.message}`);
      throw error;
    }
  }

  // Upload a Single File In Cloudinary Using The Stream Method
  async uploadStreamFile (fileBufer: Buffer, options: Record<string, any> = {}): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
        if (error)
          return reject(new Error (`Cloudinary UploadStreamFile error: ${error.message}`));

        resolve(result);
      });
      Readable.from(fileBufer).pipe(stream);
    })
  }

  // Upload Multiple Files Using The Direct Method
  async uploadFiles (filesPaths: string[], options: Record<string, any> = {}): Promise<UploadApiResponse[]> {
    const uploadPromises = filesPaths.map(path => this.uploadFile(path, options));
    return Promise.all(uploadPromises);
  }

  // Upload Multiple Files Using The Stream Method
  async uploadStreamFiles (filesBuffers: Buffer[], options: Record<string, any> = {}): Promise<UploadApiResponse[]> {
    const uploadPromises = filesBuffers.map(buffer => this.uploadStreamFile(buffer, options));
    return Promise.all(uploadPromises);
  }

  // Destroy (delete) a File by Public ID
  async destroy (publicID: string, options: UploadApiOptions = {}): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicID, options);

    } catch (error) {
      console.log(`Cloudinary destroy error: ${error.message}`);
      throw error;
    }
  }
}