export const check = (res: string) => {
  if (res === "restest") {
    throw new Error(res);
  }
  return res;
};
