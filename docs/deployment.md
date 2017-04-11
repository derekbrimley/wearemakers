# Deployment

## Prerequisites

- Install the [AWS CLI](http://docs.aws.amazon.com/cli/latest/userguide/installing.html)
- Get the AWS Credentials (Access/Secret keys) for the we are makers AWS account (not username/password)

## Preparation
- After installing the CLI run the command `aws configure --profile wearemakers`
- Input the following information as prompted:
    - AWS Access Key ID     : (Access key for your AWS account)
    - AWS Secret Access Key : (Secret key for AWS account)
    - Default region name   : `us-west-2`
    - Default output format : `json`

## Deploying
- After configuring the CLI, navigate to the project root folder in the command line and run `npm run deploy`

## Debugging deployment errors
- If a deploy fails, it either has to do with the server side code or an package.json dependency that requires a more involved installation. To debug what went wrong, run the command `eb logs` from the project root folder.

## Infrastructure
The project uses AWS elastic beanstalk for deployment and auto-scaling and an S3 bucket is used to host admin-uploaded files specific for each class. The database is hosted in AWS RDS as well.
