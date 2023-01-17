# KrakenFlex Back End Test

## Introduction

Within this code base, I have created a basic application used to concatenate and post data related to site outages.

## Project Set-up

Within the src folder, you will find:
- main.ts: the main class of the program responsible for running the methods
- services/helper.ts: a class containing various functions needed to complete the actions of this application. Moved into a common file to allow reuse without duplication of code.
    - Accepts an instance of axios into it's constructor to allow injection of this dependency
- models/: This folder contains 3 models for the different types of data created and received throughout this application

Within the test folder, you will find:
- main.test.ts: A file containing various tests that ensure the application code, by function and as a whole, is working as expected.

Within the api_key folder, you will find:
- api-key.txt: A file containing the api key needed to make api calls.

Outside of these, you will find:
- package.json & package-lock.json: Manage the node packages and commands for this application
- jest.config.ts: Testing configuration
- tsconfig.json: TypeScript configuration

## To run this application
# For each of these commands, you will need to be in the root folder e.g. KrakenFlex, not within src or any other location
To install dependencies:
 - npm i
To run test:
 - npm test
To run the code, please use this command, substituting the name of the site e.g. 'norwich-pear-tree' where this command says {site}:
 - npm start {site}