# cpass - secured password simplified conversion

[![NPM](https://nodei.co/npm/cpass.png?mini=true&downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/cpass/)

[![npm version](https://badge.fury.io/js/cpass.svg)](https://badge.fury.io/js/cpass)
[![Downloads](https://img.shields.io/npm/dm/cpass.svg)](https://www.npmjs.com/package/cpass)

> Encrypts password to some sort of a 'secure string' to be stored in text configs to reduce risks of a silly leak.<br>
Decripts a 'secure string' to plain password.


## Installation

```bash
npm install --save-dev cpass
```

## Usage

```javascript
var Cpass = require("cpass");
var cpass = new Cpass();

var password = "password";

var secured = cpass.encode(password);
// secured: "40bbb043608f54d....MhKghXTcaR2A//yNXg==" - is unique on different machines

var unsecured = cpass.decode(secured);
// unsecured: "password"

var blablabla = "blablabla";
var unblablabla = cpass.decode(blablabla);
// unblablabla: "blablabla"
```

## Comments

This module is not for a real security purposes. Just for 'dummy hackers' secure and minifying risks of any password storage in a plain form.

Once encoded, the password secured form can be decoded only on the same machine, but the logic behind this is very straightforward.