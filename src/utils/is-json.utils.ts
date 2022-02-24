export function isJSON(jsonString: any) {
  try {
    var o = JSON.parse(jsonString);
    if (o && typeof o === "object") {
      return true;
    }
  } catch (e) {}

  return false;
}
