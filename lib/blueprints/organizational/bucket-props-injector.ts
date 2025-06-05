import { InjectionContext, IPropertyInjector } from "aws-cdk-lib";
import { Bucket, BucketProps, BlockPublicAccess } from "aws-cdk-lib/aws-s3";

export class BucketPropsInjector implements IPropertyInjector {
    public readonly constructUniqueId: string;

    constructor() {
        this.constructUniqueId = Bucket.PROPERTY_INJECTION_ID;
    }

    public inject(originalProps: BucketProps, _context: InjectionContext): BucketProps {
        return {
            ...originalProps,
            blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
            enforceSSL: true,
        };
    }
}