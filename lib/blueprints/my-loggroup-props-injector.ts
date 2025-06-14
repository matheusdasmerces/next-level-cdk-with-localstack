import { RetentionDays } from "aws-cdk-lib/aws-logs";
import { LogGroupPropsInjector } from "./organizational/loggroup-props-injector";

export class MyLogGroupPropsInjector extends LogGroupPropsInjector {
    protected getRetentionPeriod(): RetentionDays {
        return RetentionDays.TWO_WEEKS; // Override to set a specific retention period
    }
}


