import { Storage, Bucket } from "@google-cloud/storage";
import oneDriveAPI from "onedrive-api";
import dotenv from "dotenv";
import Axios from "axios";

dotenv.config();

async function main() {
  const storage = new Storage();

  const bucket = storage.bucket(process.env.BUCKET_NAME!);

  try {
    let response = await Axios.get(
      `https://graph.microsoft.com/v1.0/me/drives/${process.env.DRIVE_ID}/root:/${process.env.ONE_DRIVE_FOLDER_RELATIVE_PATH}:/children`,
      { headers: { authorization: "bearer " + process.env.ONE_DRIVE_ACCESS_TOKEN } }
    );
    for (const driveFile of response.data.value) {
      console.log("processing: ", driveFile.name);

      const file = bucket.file(driveFile.name);

      const fileStream = oneDriveAPI.items.download({
        accessToken: process.env.ONE_DRIVE_ACCESS_TOKEN,
        itemId: driveFile.id,
      });
      fileStream.pipe(file.createWriteStream({ gzip: true }));
      try {
        await upload(bucket, driveFile.name, driveFile.id);
      } catch (e) {

      }
    }
  } catch (e) {
    if (!e.response) {
      console.error("Error:", e);
    }

    console.error(`Request failed with code: ${e.response.status}, body: ${JSON.stringify(e.response.data)}`);
  }
}

async function upload(bucket: Bucket, fileName: string, fileId: string) {
  return new Promise((resolve, reject) => {
    const file = bucket.file(fileName);

    const fileStream = oneDriveAPI.items.download({
      accessToken: process.env.ONE_DRIVE_ACCESS_TOKEN,
      itemId: fileId,
    });
    fileStream.pipe(
      file.createWriteStream({ gzip: true })
        .on("error", (err) => {
          console.error("Error in writable stream", err)
          reject();
        })
    )
      .on("error", (err: any) => {
        console.error("Error while uploading: ", err);
        reject();
      })
      .on("finish", () => {
        console.log("finished uploading ", fileName);
        resolve();
      })
  });
}

main();
