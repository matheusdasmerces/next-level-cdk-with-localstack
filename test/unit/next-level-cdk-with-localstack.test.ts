import * as cdk from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { NextLevelCdkWithLocalstackStack } from '../../lib/next-level-cdk-with-localstack-stack';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { OrganizationalPropsInjector } from '../../lib/blueprints/organizational';
import { MyNodejsFunctionPropsInjector } from '../../lib/blueprints/my-nodejs-function-props-injector';
import { Aspects } from 'aws-cdk-lib';
import { PropsInjectorChecker } from '../../lib/aspects/props-injector-checker';
import { EnforceFunctionProperties } from '../../lib/aspects/enforce-function-properties';

describe('Fine-Grained Asssertions', () => {
    const app = new cdk.App({
        propertyInjectors: OrganizationalPropsInjector
    });
    const stack = new NextLevelCdkWithLocalstackStack(app, 'MyTestStack', {
        propertyInjectors: [new MyNodejsFunctionPropsInjector()]
    });

    Aspects.of(app).add(new PropsInjectorChecker());
    Aspects.of(stack).add(new EnforceFunctionProperties());

    const template = Template.fromStack(stack);


    describe('CloudWatch Resources', () => {
        it('should create a LogGroup with the correct properties', () => {
            template.hasResource('AWS::Logs::LogGroup', {
                Type: 'AWS::Logs::LogGroup',
                DeletionPolicy: 'Delete',
                Properties: {
                    LogGroupName: '/aws/lambda/MyLambdaFunction-log-group',
                    RetentionInDays: RetentionDays.ONE_WEEK,
                }
            });
        });
    });

    describe('Lambda Function', () => {
        it('should create a Lambda Function with the correct properties', () => {
            template.hasResource('AWS::Lambda::Function', {
                Type: 'AWS::Lambda::Function',
                Properties: {
                    Handler: 'index.handler',
                    Runtime: 'nodejs22.x',
                    MemorySize: 128,
                    Timeout: 30,
                    Code: {
                        S3Key: Match.anyValue(),
                    },
                }
            });
        });
    });

    describe('S3 Bucket', () => {
        it('should create an S3 Bucket with the correct properties', () => {
            template.hasResource('AWS::S3::Bucket', {
                Type: 'AWS::S3::Bucket',
                Properties: {
                    BucketName: 'next-level-cdk-with-localstack-bucket',
                    PublicAccessBlockConfiguration: {
                        BlockPublicAcls: true,
                        IgnorePublicAcls: true,
                        BlockPublicPolicy: true,
                        RestrictPublicBuckets: true
                    }
                },
                DeletionPolicy: 'Delete',
                UpdateReplacePolicy: 'Delete'

            });
        }
        );
    });
});
