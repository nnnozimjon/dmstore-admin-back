import { Request, Response } from 'express';
import fs from 'fs';

export class ImageController {
  static async productImage(req: Request, res: Response) {
    const image = req.params.image;

    fs.readFile(`src/assets/products/${image}`, (err, data) => {
      if (err) {
        console.error(`Error reading file: ${err}`);
        return res.status(500).send('Error reading file');
      }
      const contentType = ImageController.getContentType(image);
      res.setHeader('Content-Type', contentType);
      res.send(data);
    });
  }

  static async header(req: Request, res: Response) {
    const image = req.params.image;

    fs.readFile(`src/assets/img/header/${image}`, (err, data) => {
      if (err) {
        console.error(`Error reading file: ${err}`);
        return res.status(500).send('Error reading file');
      }
      const contentType = ImageController.getContentType(image);
      res.setHeader('Content-Type', contentType);
      res.send(data);
    });
  }

  static async posts(req: Request, res: Response) {
    const image = req.params.image;

    fs.readFile(`src/assets/img/posts/${image}`, (err, data) => {
      if (err) {
        console.error(`Error reading file: ${err}`);
        return res.status(500).send('Error reading file');
      }
      const contentType = ImageController.getContentType(image);
      res.setHeader('Content-Type', contentType);
      res.send(data);
    });
  }

  private static getContentType(image: string): string {
    const extension = image.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'gif':
        return 'image/gif';
      default:
        return 'application/octet-stream';
    }
  }
}
