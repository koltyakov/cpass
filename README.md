# cpass - simplified secured password two-ways encryption

[![NPM](https://nodei.co/npm/cpass.png?mini=true&downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/cpass/)

[![npm version](https://badge.fury.io/js/cpass.svg)](https://badge.fury.io/js/cpass)
[![Downloads](https://img.shields.io/npm/dm/cpass.svg)](https://www.npmjs.com/package/cpass)
[![Build Status](https://dev.azure.com/koltyakov/SPNode/_apis/build/status/cpass?branchName=master)](https://dev.azure.com/koltyakov/SPNode/_build/latest?definitionId=5&branchName=master)

> Encrypts password to some sort of a 'secure string' to be stored in text configs to reduce risks of a silly leak.

Decripts a 'secure string' to plain password.

## Installation

```bash
npm install cpass --save-dev
```

or

```bash
yarn add cpass --dev
```

## Usage

### JavaScript

```javascript
const Cpass = require('cpass').Cpass;
const cpass = new Cpass();

const password = 'password';

let secured = cpass.encode(password);
// secured: "40bbb043608f54d....MhKghXTcaR2A//yNXg==" - is unique on different machines

let unsecured = cpass.decode(secured);
// unsecured: 'password'
```

### TypeScript

```javascript
import { Cpass } from 'cpass';
const cpass = new Cpass();

const password = 'password';

let secured = cpass.encode(password);
// secured: "40bbb043608f54d....MhKghXTcaR2A//yNXg==" - is unique on different machines

let unsecured = cpass.decode(secured);
// unsecured: 'password'
```

Decoding plain text will return it back:

```javascript
let plainText = 'plain (not encoded text)';
let decodedText = cpass.decode(plainText);
// decodedText: 'plain (not encoded text)'
// plainText === decodedText
```

### Encryption with master key

```javascript
import { Cpass } from 'cpass';
const cpass = new Cpass('MasterKey');
```

## Tests

### Local run

```bash
npm run test
```

### Run in Docker for specific Node.js version

```bash
# Build an image
docker build -f ./docker/Dockerfile.node8 -t cpass.node8 .
# Run tests
docker run cpass.node8
```

## Comments

This module is not for a real security purposes. Just for 'dummy hackers' secure and minifying risks of any password storage in a plain form.

Once encoded, the password secured form can be decoded only on the same machine, but the logic behind this is very straightforward.
