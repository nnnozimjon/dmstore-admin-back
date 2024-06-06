import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';

type FileRoute = 'categories' | 'products' | 'merchants' | 'widgets';

export const uploadImage = async (
  images: Express.Multer.File[] | undefined,
  fileRoute: FileRoute
): Promise<string[] | null> => {
  if (!images || images.length === 0) {
    return null;
  }

  try {
    const uploadedImages: string[] = [];

    for (const image of images) {
      const filename = `${uuidv4()}.${image.originalname.split('.').pop()}`;
      const imagePath = `src/assets/${fileRoute}/${filename}`;

      await fs.writeFile(imagePath, image.buffer);

      uploadedImages.push(filename);
    }

    return uploadedImages;
  } catch (error) {
    console.error('Error uploading image:', error);
    // Handle error as needed
    throw error; // Rethrow the error for higher-level handling
  }
};
