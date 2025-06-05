import * as cdk from 'aws-cdk-lib';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { Bucket } from 'aws-cdk-lib/aws-s3';

export class NextLevelCdkWithLocalstackStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const logGroup = new LogGroup(this, 'MyLogGroup', {
      logGroupName: '/aws/lambda/my-log-group',
      retention: RetentionDays.ONE_YEAR,
    });

    new Function(this, 'MyLambdaFunction', {
      code: Code.fromInline(`
        exports.handler = async (event) => {
          console.log("Event: ", event);
          return {
            statusCode: 200,
            body: JSON.stringify('Hello from Lambda!'),
          };
        };
      `),
      handler: 'handler',
      logGroup: logGroup,
      runtime: Runtime.NODEJS_20_X,
    });

    new Bucket(this, 'MyBucket', {
      bucketName: 'next-level-cdk-with-localstack-bucket',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      versioned: false,
      encryption: cdk.aws_s3.BucketEncryption.S3_MANAGED,
    });
  }
}
