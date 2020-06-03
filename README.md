# Nexys web framework

[![npm version](https://badge.fury.io/js/%40nexys%2Fkoa-lib.svg)](https://www.npmjs.com/package/@nexys/koa-lib)
[![npm version](https://img.shields.io/npm/v/@nexys/koa-lib.svg)](https://www.npmjs.com/package/@nexys/koa-lib)
[![CI](https://github.com/Nexysweb/koa-lib-ts/workflows/CI/badge.svg)](https://github.com/Nexysweb/koa-lib-ts/actions)

Nexys typescript web framework (built on top of Koa and Nexys System SDK)

## Setup

### App init
```
import Mount from 'koa-mount';
import { App, Routes } from '@nexys/koa-lib';

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

### Cache
```
import { Cache } from '@nexys/koa-lib';
export default new Cache.Local({persistent: true });
```

### Middleware auth

```
import { Middleware} from '@nexys/koa-lib';
import * as Login from '../service/login';
import cache from '../service/cache';

// initalises the middleware auth with
// - `Profile` defines the JWT Profile shape
// - `UserCache` defines the shape of the information saved in the userCache
// - `cache`reference to the cache
export default new Middleware.Auth<Login.Profile, Login.UserCache>(cache);
```

