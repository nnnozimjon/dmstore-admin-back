import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';

type fileRoute = 'categories' | 'products';

export const uploadImage = async (
  image?: any,
  file?: fileRoute
): Promise<string | null> => {
  if (image) {
    try {
      const filename = `${uuidv4()}.${image?.originalname?.split('.')[1]}`;
      const imagePath = `src/assets/${file}/${filename}`;

      await fs.writeFile(imagePath, image.buffer);

      return filename;
    } catch (error) {
      console.error('Error uploading image:', error);
      // Handle error as needed
    }
  }

  return null;
};
