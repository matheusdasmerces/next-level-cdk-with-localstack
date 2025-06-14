import { InvokeCommand, LambdaClient, } from '@aws-sdk/client-lambda';
import { S3Client, ListBucketsCommand, ListBucketsCommandOutput, ListObjectsCommand } from '@aws-sdk/client-s3';

describe('CDK Integration Tests with LocalStack', () => {
    const localStackClientOptions = {
        endpoint: 'http://localhost.localstack.cloud:4566',
        region: 'us-east-1',
        credentials: {
            accessKeyId: 'test',
            secretAccessKey: 'test',
        },
    }

    const lambdaClient = new LambdaClient({
        ...localStackClientOptions,
    });


    const s3 = new S3Client({
        ...localStackClientOptions,
        forcePathStyle: true,
        endpoint: 'http://s3.localhost.localstack.cloud:4566',
    });

    it('should contain an .txt file in the bucket', async () => {
        await lambdaClient.send(new InvokeCommand({
            FunctionName: 'MyLambdaFunction',
        }));

        const listBucketsResponse: ListBucketsCommandOutput = await s3.send(new ListBucketsCommand({}));
        const bucketName = listBucketsResponse.Buckets?.find(bucket => bucket.Name === 'next-level-cdk-with-localstack-bucket')?.Name;
        expect(bucketName).toBeDefined();
        const listObjectsResponse = await s3.send(new ListObjectsCommand({ Bucket: bucketName }));
        expect(listObjectsResponse.Contents).toBeDefined();
        const objectKeys = listObjectsResponse.Contents?.map(object => object.Key);
        expect(objectKeys).toContain('test-object.txt');
    });
});
