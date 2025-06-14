import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Handler } from "aws-lambda";

const s3 = new S3Client({});

const bucketName = process.env.BUCKET_NAME;

export const handler: Handler = async (event) => {
    console.log("Event: ", event);

    await s3.send(
        new PutObjectCommand({
            Bucket: bucketName,
            Key: "test-object.txt",
            Body: "Hello, world!",
        })
    );

    return {
        statusCode: 200,
        body: JSON.stringify("Hello from Lambda!"),
    };
};