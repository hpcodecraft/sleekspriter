const clamp = (min, max, val) => {
  return val < min ? min : val > max ? max : val;
};

const pad = function(s) {
  return (s.length === 1 ? "0" + s : s).toUpperCase();
};

const hex2rgb = function(hex) {
  const r = parseInt(hex.substr(1, 2), 16);
  const g = parseInt(hex.substr(3, 2), 16);
  const b = parseInt(hex.substr(5, 2), 16);
  return { r, g, b };
};

const rgb2hsl = function(rgb) {
  const r = rgb[0] / 255;
  const g = rgb[1] / 255;
  const b = rgb[2] / 255;
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  const delta = max - min;
  let h;
  let s;

  if (max === min) h = 0;
  else if (r === max) h = (g - b) / delta;
  else if (g === max) h = 2 + (b - r) / delta;
  else if (b === max) h = 4 + (r - g) / delta;

  h = Math.min(h * 60, 360);

  if (h < 0) h += 360;

  const l = (min + max) / 2;

  if (max === min) s = 0;
  else if (l <= 0.5) s = delta / (max + min);
  else s = delta / (2 - max - min);

  return [h, s * 100, l * 100];
};

const hsl2rgb = function(hsl) {
  const h = hsl[0] / 360;
  const s = hsl[1] / 100;
  const l = hsl[2] / 100;
  let t2;
  let t3;
  let val;

  if (s === 0) {
    val = l * 255;
    return [val, val, val];
  }

  if (l < 0.5) t2 = l * (1 + s);
  else t2 = l + s - l * s;
  const t1 = 2 * l - t2;

  const rgb = [0, 0, 0];
  for (var i = 0; i < 3; i++) {
    t3 = h + (1 / 3) * -(i - 1);
    t3 < 0 && t3++;
    t3 > 1 && t3--;

    if (6 * t3 < 1) val = t1 + (t2 - t1) * 6 * t3;
    else if (2 * t3 < 1) val = t2;
    else if (3 * t3 < 2) val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
    else val = t1;

    rgb[i] = val * 255;
  }

  return rgb;
};

const changeColorLightness = function({ r, g, b }, delta) {
  const hsl = rgb2hsl([r, g, b]);
  let l = hsl[2];

  l += delta;

  const newHsl = [hsl[0], hsl[1], clamp(0, 100, l)];
  const newRgb = hsl2rgb(newHsl).map(val => Math.round(val));

  return newRgb;
};

class Color {
  constructor(c) {
    this.r = null;
    this.g = null;
    this.b = null;

    if (undefined !== c.rgb) {
      // expects c = {rgb: [255, 255, 255]}
      this.r = c.rgb[0];
      this.g = c.rgb[1];
      this.b = c.rgb[2];
    } else if (undefined !== c.hex) {
      // expects c = {hex: "#ffffff"}
      const ch = hex2rgb(c.hex);
      this.r = ch.r;
      this.g = ch.g;
      this.b = ch.b;
    }

    return this;
  }

  hex() {
    return `#${pad(this.r.toString(16))}${pad(this.g.toString(16))}${pad(
      this.b.toString(16)
    )}`;
  }

  rgb() {
    const { r, g, b } = this;
    return {
      r,
      g,
      b,
    };
  }

  rgbHuman() {
    return `${this.r}, ${this.g}, ${this.b}`;
  }

  changeBrightness(amount) {
    const newColor = changeColorLightness(this, amount);
    this.r = newColor[0];
    this.g = newColor[1];
    this.b = newColor[2];
    return this;
  }
}

export default Color;