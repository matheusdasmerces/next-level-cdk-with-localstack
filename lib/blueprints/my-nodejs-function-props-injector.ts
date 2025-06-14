import { Duration, InjectionContext, IPropertyInjector } from "aws-cdk-lib";
import { FunctionProps, Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

export class MyNodejsFunctionPropsInjector implements IPropertyInjector {
    public readonly constructUniqueId: string;

    constructor() {
        this.constructUniqueId = NodejsFunction.PROPERTY_INJECTION_ID;
    }

    public inject(originalProps: FunctionProps, _context: InjectionContext): FunctionProps {
        return {
            ...originalProps,
            runtime: Runtime.NODEJS_22_X,
            memorySize: 128,
            timeout: Duration.seconds(30),
        };
    }
}