import JWT from 'jsonwebtoken';

const secretKey = 'mysecretkey';

export const sign = <A extends Object>(profile: A):string => JWT.sign(profile, secretKey);

export const verify = <A extends Object>(token:string):({iat: number} & A) => JWT.verify(token, secretKey) as {iat: number} & A;