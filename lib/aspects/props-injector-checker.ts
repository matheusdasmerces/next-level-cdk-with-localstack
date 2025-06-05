import { Annotations, CfnDeletionPolicy, IAspect, Tokenization } from "aws-cdk-lib";
import { CfnLogGroup, RetentionDays } from "aws-cdk-lib/aws-logs";
import { CfnBucket } from "aws-cdk-lib/aws-s3";
import { IConstruct } from "constructs";

export class PropsInjectorChecker implements IAspect {
    public visit(node: IConstruct): void {
        if (node instanceof CfnLogGroup) {
            if (node.retentionInDays != RetentionDays.ONE_WEEK) {
                Annotations.of(node).addWarning(
                    'Log group retention is not set to ONE_WEEK. Consider using Organizational LogGroupPropsInjector during App or Stack creation to enforce this.'
                );
            }

            if (node.cfnOptions.deletionPolicy != CfnDeletionPolicy.DELETE) {
                Annotations.of(node).addWarning(
                    'Deletion policy is not set to DELETE. Consider using Organizational LogGroupPropsInjector during App or Stack creation to enforce this.'
                );
            }
        }

        if (node instanceof CfnBucket) {
            if (!node.publicAccessBlockConfiguration
                || (!Tokenization.isResolvable(node.publicAccessBlockConfiguration)
                    && !node.publicAccessBlockConfiguration.blockPublicAcls)) {
                Annotations.of(node).addError(
                    'Bucket is not blocked for public access. Consider using Organization BucetPropsInjector during App or Stack creation to enforce this.'
                );
            }
        }
    }
}