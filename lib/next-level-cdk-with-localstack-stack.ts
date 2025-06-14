import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { LambdaToS3 } from './constructs/lambda-to-s3';

export class NextLevelCdkWithLocalstackStack extends cdk.Stack {
  public readonly lambdaFunctionName: string;
  public readonly bucketName: string;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.lambdaFunctionName = 'MyLambdaFunction';

    const firstLambdaToS3Pattern = new LambdaToS3(this, 'FirstLambdaToS3Pattern', {
      lambdaFunctionName: 'MyLambdaFunction',
    });

    this.bucketName = firstLambdaToS3Pattern.bucketName;
  }
}
