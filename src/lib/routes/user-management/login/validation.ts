import { Main as Validation, Type as VT, Utils as VU } from "@nexys/validation";

const loginShape: VT.Shape = {
  email: { extraCheck: VU.emailCheck },
  password: { extraCheck: VU.passwordCheck },
  instance: { $object: { uuid: { extraCheck: VU.checkUuid } }, optional: false }
};

const signupShape: VT.Shape = {
  firstName: {},
  lastName: {},
  email: { extraCheck: VU.emailCheck },
  auth: {type: {}, value: {optional:true}, password:{optional:true, extraCheck: VU.passwordCheck }},
};

export const checkLogin = Validation.isShapeMiddleware(loginShape);

export const isSignupShape = Validation.isShapeMiddleware(signupShape);

export const isUuid = Validation.isShapeMiddleware({
  uuid: { extraCheck: VU.checkUuid },
});
