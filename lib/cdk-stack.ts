import * as cdk from 'aws-cdk-lib';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { Duration } from 'aws-cdk-lib';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { CacheCookieBehavior, CacheHeaderBehavior, CacheQueryStringBehavior, OriginAccessIdentity, OriginRequestCookieBehavior, OriginRequestHeaderBehavior, OriginRequestQueryStringBehavior, ViewerProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { FunctionUrlAuthType } from 'aws-cdk-lib/aws-lambda';
import { BlockPublicAccess, BucketAccessControl } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const svelte = new cdk.aws_lambda.Function(this, 'svelte', {
      runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
      architecture: cdk.aws_lambda.Architecture.ARM_64,
      environment:{
        BLOG_BASE_URL: ssm.StringParameter.valueFromLookup(this, 'yarbsemaj-blog-url'),
        BLOG_API_KEY: ssm.StringParameter.valueFromLookup(this, 'yarbsemaj-blog-api-key'),
        CLIENT_ID: ssm.StringParameter.valueFromLookup(this, 'yarbsemaj-blog-client-id'),
        USER_POOL_ID:ssm.StringParameter.valueFromLookup(this, 'yarbsemaj-blog-user-pool-id'),
      },
      memorySize: 1024,
      timeout: Duration.seconds(30),
      handler: 'serverless.handler',
      code: cdk.aws_lambda.Code.fromAsset(path.join(__dirname, '../build/server')),
    });

    const svelteURL = svelte.addFunctionUrl({ authType: FunctionUrlAuthType.NONE })

    const edgeFunction = new cdk.aws_cloudfront.experimental.EdgeFunction(this, 'edgeRouter', {
      runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
      handler: 'router.handler',
      memorySize: 128,
      code: cdk.aws_lambda.Code.fromAsset(path.join(__dirname, '../build/edge')),
    });

    const staticAssets = new cdk.aws_s3.Bucket(this, 'static-asset-bucket', {
      blockPublicAccess: BlockPublicAccess.BLOCK_ACLS,
      accessControl: BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
    })

    staticAssets.addToResourcePolicy(new PolicyStatement({
      actions: ['s3:GetObject'],
      effect: Effect.ALLOW,
      resources: [staticAssets.arnForObjects('*')],
      sid: 'PublicReadGetObject',
      principals: [new cdk.aws_iam.AnyPrincipal()]
    }))

    const forwardHeaderFunction = new cdk.aws_cloudfront.Function(this, 'forward-header-function', {
      code: cdk.aws_cloudfront.FunctionCode.fromInline('function handler(event) { return event.request }'),
    });

    new cdk.aws_s3_deployment.BucketDeployment(this, 'deploy-pre-render', {
      sources: [cdk.aws_s3_deployment.Source.asset(path.join(__dirname, '../build/prerendered'))],
      destinationBucket: staticAssets,
      prune: false,
      cacheControl: [
        cdk.aws_s3_deployment.CacheControl.maxAge(Duration.minutes(5)),
      ],
    });

    new cdk.aws_s3_deployment.BucketDeployment(this, 'deploy-assets', {
      sources: [cdk.aws_s3_deployment.Source.asset(path.join(__dirname, '../build/assets/'), {
        exclude: ['**.glb', '_app/**'],
      })],
      destinationBucket: staticAssets,
      prune: false,
      cacheControl: [
        cdk.aws_s3_deployment.CacheControl.maxAge(Duration.days(365)),
        cdk.aws_s3_deployment.CacheControl.immutable(),
      ],
    });

    new cdk.aws_s3_deployment.BucketDeployment(this, 'deploy-static', {
      sources: [cdk.aws_s3_deployment.Source.asset(path.join(__dirname, '../build/assets/_app'))],
      destinationBucket: staticAssets,
      destinationKeyPrefix: '_app',
      prune: false,
      cacheControl: [
        cdk.aws_s3_deployment.CacheControl.maxAge(Duration.days(365)),
        cdk.aws_s3_deployment.CacheControl.immutable(),
      ],
    });


    const certificate = Certificate.fromCertificateArn(this, 'Certificate', ssm.StringParameter.valueForStringParameter(this, 'yarbsemaj-cert-arn'));


    new cdk.aws_cloudfront.Distribution(this, 'svelte-website', {
      defaultBehavior: {
        allowedMethods: cdk.aws_cloudfront.AllowedMethods.ALLOW_ALL,
        origin: new cdk.aws_cloudfront_origins.HttpOrigin(cdk.Fn.select(2, cdk.Fn.split('/', svelteURL.url)), {
          customHeaders: {
            's3-host': staticAssets.virtualHostedUrlForObject().replace('https://', '')
          }
        }),
        edgeLambdas: [
          {
            functionVersion: edgeFunction.currentVersion,
            eventType: cdk.aws_cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
          }
        ],
        functionAssociations: [{
          function: forwardHeaderFunction,
          eventType: cdk.aws_cloudfront.FunctionEventType.VIEWER_REQUEST,
        }],
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        compress: true,
        originRequestPolicy: new cdk.aws_cloudfront.OriginRequestPolicy(this, 'svelte-orp', {
          cookieBehavior: OriginRequestCookieBehavior.allowList('userid'),
          queryStringBehavior: OriginRequestQueryStringBehavior.all(),
          headerBehavior: OriginRequestHeaderBehavior.allowList('x-forwarded-host')
        }),
        cachePolicy: new cdk.aws_cloudfront.CachePolicy(this, 'svelte-cp', {
          cookieBehavior: CacheCookieBehavior.allowList('userid'),
          queryStringBehavior: CacheQueryStringBehavior.all(),
          headerBehavior: CacheHeaderBehavior.allowList('x-forwarded-host'),
          enableAcceptEncodingBrotli: true,
          enableAcceptEncodingGzip: true
        })

      },
      certificate: certificate,
      domainNames: ['www.yarbsemaj.com', 'yarbsemaj.com', 'james.bray.im']
    });
  }
}
