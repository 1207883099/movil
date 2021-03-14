export function trunc(x, posiciones = 0) {
  var s = x.toString();
  var decimalLength = s.indexOf('.') + 1;
  if (decimalLength) {
    var numStr = s.substr(0, decimalLength + posiciones);
    return Number(numStr);
  }
  return Number(x);
}
