#!/usr/bin/env node
import { NextLevelCdkWithLocalstackStack } from '../lib/next-level-cdk-with-localstack-stack';
import { OrganizationalPropsInjector } from '../lib/blueprints/organizational';
import { MyNodejsFunctionPropsInjector } from '../lib/blueprints/my-nodejs-function-props-injector';
import { App, Aspects } from 'aws-cdk-lib';
import { PropsInjectorChecker } from '../lib/aspects/props-injector-checker';
import { EnforceFunctionProperties } from '../lib/aspects/enforce-function-properties';

const app = new App({
  propertyInjectors: OrganizationalPropsInjector,
});
const stack = new NextLevelCdkWithLocalstackStack(app, 'NextLevelCdkWithLocalstackStack', {
  propertyInjectors: [new MyNodejsFunctionPropsInjector()],
});

Aspects.of(app).add(new PropsInjectorChecker());
Aspects.of(stack).add(new EnforceFunctionProperties);