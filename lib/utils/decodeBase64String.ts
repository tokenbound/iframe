export function decodeBase64String(str: string) {
  const base64string = str.replace("data:application/json;base64,", "");

  let res = atob(base64string);
  try {
    return JSON.parse(res);
  } catch (err) {
    // console.error(err)
    console.log({ res });
    return null;
  }
}
