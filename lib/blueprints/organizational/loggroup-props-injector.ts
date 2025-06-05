import { InjectionContext, IPropertyInjector, RemovalPolicy } from "aws-cdk-lib";
import { LogGroup, LogGroupProps, RetentionDays } from "aws-cdk-lib/aws-logs";

export class LogGroupPropsInjector implements IPropertyInjector {
    public readonly constructUniqueId: string;

    constructor() {
        this.constructUniqueId = LogGroup.PROPERTY_INJECTION_ID;
    }

    public inject(originalProps: LogGroupProps, _context: InjectionContext): LogGroupProps {
        return {
            ...originalProps,
            removalPolicy: RemovalPolicy.DESTROY,
            retention: RetentionDays.ONE_WEEK,
        };
    }
}