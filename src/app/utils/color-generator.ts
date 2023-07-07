export function generate(hue: number, saturate: number, lightness: number) {
  let r, g, b;
  if (saturate == 0) {
    r = g = b = lightness;
  } else {
    function hue2rgb(p: number, q: number, t: number) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    }
    var q = lightness < 0.5 ? lightness * (1 + saturate) : lightness + saturate - lightness * saturate;
    var p = 2 * lightness - q;
    r = hue2rgb(p, q, hue + 1 / 3);
    g = hue2rgb(p, q, hue);
    b = hue2rgb(p, q, hue - 1 / 3);
  }
  return '#' + [r * 255, g * 255, b * 255].map((c) => Math.floor(c).toString(16)).join('');
}
