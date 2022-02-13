# Nexys web framework

[![CI](https://github.com/nexys-system/core/workflows/CI/badge.svg)](https://github.com/nexys-system/core/actions)
[![NPM package](https://badge.fury.io/js/%40nexys%2Fcore.svg)](https://www.npmjs.com/package/@nexys/core)
[![NPM package](https://img.shields.io/npm/v/@nexys/core.svg)](https://www.npmjs.com/package/@nexys/core)
[![Bundleophobia](https://badgen.net/bundlephobia/min/@nexys/core)](https://bundlephobia.com/result?p=@nexys/core)
[![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io/)

Nexys typescript web framework (built on top of Koa and Nexys System SDK)

to

## Setup

### App init

path suggestion: `src/app.ts`

```
import Mount from 'koa-mount';
import { App, Routes } from '@nexys/core';

// import module/service
import RouteModule from './route/module';

// reference to the instance of nexys-lib
import LibServices from "./service/product-service";

const app = App();
// reference to service/module:
app.use(Mount('/pathTorouteModule', RouteModule));

// this is the reference to the product route modules (i18n, notification, cms)
// [optional]
app.use(Mount("/product", Routes.default(LibServices as any)));


export const startApp = async (port: number) => {
  app.listen(port, () => console.log(`Server started at port ${port}`));
};
```

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

// initalises the middleware auth with
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
