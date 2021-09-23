export const domainFromEmail = (email: string) => {
  const s = email.split("@");
  try {
    return s[1];
  } catch (err) {
    throw Error("domain could not be extracted");
  }
};
