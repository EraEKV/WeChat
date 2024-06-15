import { Storage } from '@google-cloud/storage';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_CLOUD_KEYFILE
});

const bucketName = 'your-bucket-name'; 

class CloudStorageService {
  async uploadFile(filePath: string): Promise<string> {
    const bucket = storage.bucket(bucketName);
    const uniqueFileName = `${uuidv4()}-${path.basename(filePath)}`;
    await bucket.upload(filePath, {
      destination: uniqueFileName,
      public: true
    });

    return `https://storage.googleapis.com/${bucketName}/${uniqueFileName}`;
  }
}

export default CloudStorageService;
