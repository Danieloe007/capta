# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-01-16

### Added
- Initial implementation of Business Dates API
- Support for Colombian business days calculation
- Timezone handling (America/Bogota to UTC conversion)
- Colombian holidays integration via external API
- Working hours support (8AM-5PM with lunch break 12PM-1PM)
- Comprehensive test suite with 25 test cases
- AWS CDK infrastructure as code
- AWS Lambda + API Gateway deployment
- Complete TypeScript implementation with full typing
- Error handling and validation
- REST API with query parameters support

### Features
- Calculate business dates by adding days and/or hours
- Automatic weekend skipping
- Colombian holidays exclusion
- Work hours enforcement
- Lunch break handling
- Input validation and error responses
- UTC output format (ISO 8601)

### Infrastructure
- AWS Lambda function (Node.js 20.x)
- API Gateway REST API
- CDK deployment automation
- CloudFormation stack management