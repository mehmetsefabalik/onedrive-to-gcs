import { Storage } from "@google-cloud/storage";
import oneDriveAPI from "onedrive-api";
import dotenv from "dotenv";
import Axios from "axios";

dotenv.config();

async function upload() {
  const storage = new Storage();

  const bucket = storage.bucket(process.env.BUCKET_NAME!);

  try {
    let response = await Axios.get(`https://graph.microsoft.com/v1.0/me/drives/${process.env.DRIVE_ID}/items/${process.env.FOLDER_ID}/children`);
    for (const driveFile of response.data.value) {
      const file = bucket.file(driveFile.name);

      const fileStream = oneDriveAPI.items.download({
        accessToken: process.env.ONE_DRIVE_ACCESS_TOKEN,
        itemId: driveFile.id,
      });
      fileStream.pipe(file.createWriteStream({ gzip: true }));
    }
  } catch (e) {
    if (!e.response) {
      console.error("Error:", e);
    }

    console.error(`Request failed with code: ${e.response.status}, body: ${JSON.stringify(e.response.data)}`);
  }
}

upload();
