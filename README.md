# Nexys web framework

[![Test Package](https://github.com/nexys-system/core/actions/workflows/test.yml/badge.svg)](https://github.com/nexys-system/core/actions/workflows/test.yml)
[![Publish](https://github.com/nexys-system/core/actions/workflows/publish.yml/badge.svg)](https://github.com/nexys-system/core/actions/workflows/publish.yml)
[![NPM package](https://badge.fury.io/js/%40nexys%2Fcore.svg)](https://www.npmjs.com/package/@nexys/core)
[![NPM package](https://img.shields.io/npm/v/@nexys/core.svg)](https://www.npmjs.com/package/@nexys/core)
[![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io/)

Nexys typescript web framework (built on top of Koa and Nexys System SDK)


## Setup

### App init

see `/server` for example implementation or https://github.com/nexys-system/server-boilerplate

### Cache Initialization

path suggestion: `src/service/cache.ts`

```
import { Cache } from '@nexys/core';
export default new Cache.Local({persistent: true });
```

### Middleware Auth

path suggestion: `src/middleware/auth.ts`

```
import { Middleware} from '@nexys/core';
import * as Login from '../service/login';
import cache from '../service/cache';

// initalizes the middleware auth with
// - `Profile` defines the JWT Profile shape
// - `UserCache` defines the shape of the information saved in the userCache
// - `cache`reference to the cache
export default new Middleware.Auth<Login.Profile, Login.UserCache>(cache);
```

### Associated projects

- [Fetch-r](https://github.com/nexys-system/fetch-r)
- [Workflow](https://github.com/nexys-system/workflow)
- [Cache](https://github.com/nexys-system/node-cache-persistent)
- [API-request](https://github.com/nexys-system/api-request)
- [Validation](https://github.com/nexys-system/validation)
- [Crypto](https://github.com/nexys-system/crypto)
- [Social logins](https://github.com/nexys-system/oauth)
