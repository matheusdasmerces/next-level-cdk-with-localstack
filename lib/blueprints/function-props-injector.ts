import { Duration, InjectionContext, IPropertyInjector } from "aws-cdk-lib";
import { FunctionProps, Function, Runtime } from "aws-cdk-lib/aws-lambda";

export class MyFunctionPropsInjector implements IPropertyInjector {
    public readonly constructUniqueId: string;

    constructor() {
        this.constructUniqueId = Function.PROPERTY_INJECTION_ID;
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