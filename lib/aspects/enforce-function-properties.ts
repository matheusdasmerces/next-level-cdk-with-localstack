import { Annotations, IAspect } from "aws-cdk-lib";
import { CfnFunction } from "aws-cdk-lib/aws-lambda";
import { IConstruct } from "constructs";

export class EnforceFunctionProperties implements IAspect {
    public visit(node: IConstruct): void {
        if (node instanceof CfnFunction) {
            if (node.timeout && node.timeout > 30) {
                Annotations.of(node).addWarning(
                    'Lambda function timeout is greater than 30 seconds. Overriding to 30 seconds to enforce best practices.',
                );
                node.timeout = 30; // Enforce timeout to 30 seconds
            }
        }
    }
}