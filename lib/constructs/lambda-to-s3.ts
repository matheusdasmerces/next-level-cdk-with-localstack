import * as cdk from 'aws-cdk-lib';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { Bucket, IBucket } from 'aws-cdk-lib/aws-s3';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';

interface LambdaToS3Props {
    readonly lambdaFunctionName: string;
    readonly bucketName?: string;
}

export class LambdaToS3 extends Construct {
    public readonly bucketName: string;
    constructor(scope: Construct, id: string, props: LambdaToS3Props) {
        super(scope, id);

        const logGroup = new LogGroup(this, 'MyLogGroup', {
            logGroupName: `/aws/lambda/${props.lambdaFunctionName}-log-group`,
            retention: RetentionDays.ONE_YEAR,
        });

        let bucket: IBucket;
        if (props.bucketName) {
            bucket = Bucket.fromBucketName(this, 'MyBucket', props.bucketName);
        } else {
            bucket = new Bucket(this, 'MyBucket', {
                bucketName: 'next-level-cdk-with-localstack-bucket',
                removalPolicy: cdk.RemovalPolicy.DESTROY,
                autoDeleteObjects: true,
                versioned: false,
                encryption: cdk.aws_s3.BucketEncryption.S3_MANAGED,
            });
        }

        this.bucketName = bucket.bucketName;

        const lambda = new NodejsFunction(this, 'MyLambdaFunction', {
            entry: path.resolve(__dirname, '../../src/my-lambda-function.ts'),
            logGroup: logGroup,
            runtime: Runtime.NODEJS_20_X,
            functionName: props.lambdaFunctionName,
            environment: {
                BUCKET_NAME: bucket.bucketName,
            }
        });

        bucket.grantWrite(lambda);
    }
}
