#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
const secretJson = process.env.MYFILE_NPM_AUTH_TOKEN;
const scrubbedJson = secretJson
  .substring(1, secretJson.length - 1)
  .replaceAll('\\', '');
const { authToken } = JSON.parse(scrubbedJson);
const content = `
@myfile:registry=https://pkgs.dev.azure.com/doitt-compute-services/nyco-products/_packaging/myfile/npm/registry/
always-auth=true
; begin myfile auth token
//pkgs.dev.azure.com/doitt-compute-services/nyco-products/_packaging/myfile/npm/registry/:username=doitt-compute-services
//pkgs.dev.azure.com/doitt-compute-services/nyco-products/_packaging/myfile/npm/registry/:_password=${authToken}
//pkgs.dev.azure.com/doitt-compute-services/nyco-products/_packaging/myfile/npm/registry/:email=no-reply@myfile.nycopportunity.nyc.gov
//pkgs.dev.azure.com/doitt-compute-services/nyco-products/_packaging/myfile/npm/:username=doitt-compute-services
//pkgs.dev.azure.com/doitt-compute-services/nyco-products/_packaging/myfile/npm/:_password=${authToken}
//pkgs.dev.azure.com/doitt-compute-services/nyco-products/_packaging/myfile/npm/:email=no-reply@myfile.nycopportunity.nyc.gov
; end myfile auth token
`;

fs.writeFileSync(path.join(process.cwd(), '.npmrc'), content);
