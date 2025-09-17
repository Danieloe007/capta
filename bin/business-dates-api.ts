#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { BusinessDatesStack } from '../lib/business-dates-stack';

const app = new cdk.App();
new BusinessDatesStack(app, 'BusinessDatesApiStack', {});