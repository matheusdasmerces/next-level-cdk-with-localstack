import * as cdk from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { NextLevelCdkWithLocalstackStack } from '../lib/next-level-cdk-with-localstack-stack';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { OrganizationalPropsInjector } from '../lib/blueprints/organizational';
import { MyFunctionPropsInjector } from '../lib/blueprints/function-props-injector';
import { Aspects } from 'aws-cdk-lib';
import { PropsInjectorChecker } from '../lib/aspects/props-injector-checker';

describe('Fine-Grained Asssertions', () => {
    const app = new cdk.App({
        propertyInjectors: OrganizationalPropsInjector
    });
    const stack = new NextLevelCdkWithLocalstackStack(app, 'MyTestStack', {
        propertyInjectors: [new MyFunctionPropsInjector()]
    });
    const template = Template.fromStack(stack);

    Aspects.of(app).add(new PropsInjectorChecker());

    describe('CloudWatch Resources', () => {
        it('should create a LogGroup with the correct properties', () => {
            template.hasResource('AWS::Logs::LogGroup', {
                Type: 'AWS::Logs::LogGroup',
                DeletionPolicy: 'Delete',
                Properties: {
                    LogGroupName: '/aws/lambda/my-log-group',
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
                    Handler: 'handler',
                    Runtime: 'nodejs22.x',
                    MemorySize: 128,
                    Timeout: 30,
                    Code: {
                        ZipFile: Match.anyValue(),
                    },
                }
            });
        });
    });
});
