import * as T from './type';

export const printAppToken = (decodedAppToken: T.AppTokenDecoded) => {
    return {
      instance: [decodedAppToken.instance, decodedAppToken.instanceName],
      product: [decodedAppToken.product, decodedAppToken.productName],
      env: T.Env[decodedAppToken.env],
      issuedAt: new Date(decodedAppToken.iat * 1000)
    };
  };