import { AppTokenDecoded, Env } from "./type";

export const printAppToken = (decodedAppToken: AppTokenDecoded) => {
  return {
    instance: [decodedAppToken.instance, decodedAppToken.instanceName],
    product: [decodedAppToken.product, decodedAppToken.productName],
    env: Env[decodedAppToken.env],
    issuedAt: new Date(decodedAppToken.iat * 1000),
  };
};
