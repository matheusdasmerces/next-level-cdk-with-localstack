import { BucketPropsInjector } from "./bucket-props-injector";
import { LogGroupPropsInjector } from "./loggroup-props-injector";

export const OrganizationalPropsInjector = [new BucketPropsInjector(), new LogGroupPropsInjector()];
