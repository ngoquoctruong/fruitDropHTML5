window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
        o = b;
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  1: [ function(require, module, exports) {
    "use strict";
    var __importDefault = this && this.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : {
        default: mod
      };
    };
    const simplex_noise_js_1 = __importDefault(require("./simplex-noise.js"));
    simplex_noise_js_1.default["SimplexNoise"] = simplex_noise_js_1.default;
    module.exports = simplex_noise_js_1.default;
  }, {
    "./simplex-noise.js": 2
  } ],
  2: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.buildPermutationTable = exports.SimplexNoise = void 0;
    const F2 = .5 * (Math.sqrt(3) - 1);
    const G2 = (3 - Math.sqrt(3)) / 6;
    const F3 = 1 / 3;
    const G3 = 1 / 6;
    const F4 = (Math.sqrt(5) - 1) / 4;
    const G4 = (5 - Math.sqrt(5)) / 20;
    const grad3 = new Float32Array([ 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0, 1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, -1, 0, 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1 ]);
    const grad4 = new Float32Array([ 0, 1, 1, 1, 0, 1, 1, -1, 0, 1, -1, 1, 0, 1, -1, -1, 0, -1, 1, 1, 0, -1, 1, -1, 0, -1, -1, 1, 0, -1, -1, -1, 1, 0, 1, 1, 1, 0, 1, -1, 1, 0, -1, 1, 1, 0, -1, -1, -1, 0, 1, 1, -1, 0, 1, -1, -1, 0, -1, 1, -1, 0, -1, -1, 1, 1, 0, 1, 1, 1, 0, -1, 1, -1, 0, 1, 1, -1, 0, -1, -1, 1, 0, 1, -1, 1, 0, -1, -1, -1, 0, 1, -1, -1, 0, -1, 1, 1, 1, 0, 1, 1, -1, 0, 1, -1, 1, 0, 1, -1, -1, 0, -1, 1, 1, 0, -1, 1, -1, 0, -1, -1, 1, 0, -1, -1, -1, 0 ]);
    class SimplexNoise {
      constructor(randomOrSeed = Math.random) {
        const random = "function" == typeof randomOrSeed ? randomOrSeed : alea(randomOrSeed);
        this.p = buildPermutationTable(random);
        this.perm = new Uint8Array(512);
        this.permMod12 = new Uint8Array(512);
        for (let i = 0; i < 512; i++) {
          this.perm[i] = this.p[255 & i];
          this.permMod12[i] = this.perm[i] % 12;
        }
      }
      noise2D(x, y) {
        const permMod12 = this.permMod12;
        const perm = this.perm;
        let n0 = 0;
        let n1 = 0;
        let n2 = 0;
        const s = (x + y) * F2;
        const i = Math.floor(x + s);
        const j = Math.floor(y + s);
        const t = (i + j) * G2;
        const X0 = i - t;
        const Y0 = j - t;
        const x0 = x - X0;
        const y0 = y - Y0;
        let i1, j1;
        if (x0 > y0) {
          i1 = 1;
          j1 = 0;
        } else {
          i1 = 0;
          j1 = 1;
        }
        const x1 = x0 - i1 + G2;
        const y1 = y0 - j1 + G2;
        const x2 = x0 - 1 + 2 * G2;
        const y2 = y0 - 1 + 2 * G2;
        const ii = 255 & i;
        const jj = 255 & j;
        let t0 = .5 - x0 * x0 - y0 * y0;
        if (t0 >= 0) {
          const gi0 = 3 * permMod12[ii + perm[jj]];
          t0 *= t0;
          n0 = t0 * t0 * (grad3[gi0] * x0 + grad3[gi0 + 1] * y0);
        }
        let t1 = .5 - x1 * x1 - y1 * y1;
        if (t1 >= 0) {
          const gi1 = 3 * permMod12[ii + i1 + perm[jj + j1]];
          t1 *= t1;
          n1 = t1 * t1 * (grad3[gi1] * x1 + grad3[gi1 + 1] * y1);
        }
        let t2 = .5 - x2 * x2 - y2 * y2;
        if (t2 >= 0) {
          const gi2 = 3 * permMod12[ii + 1 + perm[jj + 1]];
          t2 *= t2;
          n2 = t2 * t2 * (grad3[gi2] * x2 + grad3[gi2 + 1] * y2);
        }
        return 70 * (n0 + n1 + n2);
      }
      noise3D(x, y, z) {
        const permMod12 = this.permMod12;
        const perm = this.perm;
        let n0, n1, n2, n3;
        const s = (x + y + z) * F3;
        const i = Math.floor(x + s);
        const j = Math.floor(y + s);
        const k = Math.floor(z + s);
        const t = (i + j + k) * G3;
        const X0 = i - t;
        const Y0 = j - t;
        const Z0 = k - t;
        const x0 = x - X0;
        const y0 = y - Y0;
        const z0 = z - Z0;
        let i1, j1, k1;
        let i2, j2, k2;
        if (x0 >= y0) if (y0 >= z0) {
          i1 = 1;
          j1 = 0;
          k1 = 0;
          i2 = 1;
          j2 = 1;
          k2 = 0;
        } else if (x0 >= z0) {
          i1 = 1;
          j1 = 0;
          k1 = 0;
          i2 = 1;
          j2 = 0;
          k2 = 1;
        } else {
          i1 = 0;
          j1 = 0;
          k1 = 1;
          i2 = 1;
          j2 = 0;
          k2 = 1;
        } else if (y0 < z0) {
          i1 = 0;
          j1 = 0;
          k1 = 1;
          i2 = 0;
          j2 = 1;
          k2 = 1;
        } else if (x0 < z0) {
          i1 = 0;
          j1 = 1;
          k1 = 0;
          i2 = 0;
          j2 = 1;
          k2 = 1;
        } else {
          i1 = 0;
          j1 = 1;
          k1 = 0;
          i2 = 1;
          j2 = 1;
          k2 = 0;
        }
        const x1 = x0 - i1 + G3;
        const y1 = y0 - j1 + G3;
        const z1 = z0 - k1 + G3;
        const x2 = x0 - i2 + 2 * G3;
        const y2 = y0 - j2 + 2 * G3;
        const z2 = z0 - k2 + 2 * G3;
        const x3 = x0 - 1 + 3 * G3;
        const y3 = y0 - 1 + 3 * G3;
        const z3 = z0 - 1 + 3 * G3;
        const ii = 255 & i;
        const jj = 255 & j;
        const kk = 255 & k;
        let t0 = .6 - x0 * x0 - y0 * y0 - z0 * z0;
        if (t0 < 0) n0 = 0; else {
          const gi0 = 3 * permMod12[ii + perm[jj + perm[kk]]];
          t0 *= t0;
          n0 = t0 * t0 * (grad3[gi0] * x0 + grad3[gi0 + 1] * y0 + grad3[gi0 + 2] * z0);
        }
        let t1 = .6 - x1 * x1 - y1 * y1 - z1 * z1;
        if (t1 < 0) n1 = 0; else {
          const gi1 = 3 * permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]];
          t1 *= t1;
          n1 = t1 * t1 * (grad3[gi1] * x1 + grad3[gi1 + 1] * y1 + grad3[gi1 + 2] * z1);
        }
        let t2 = .6 - x2 * x2 - y2 * y2 - z2 * z2;
        if (t2 < 0) n2 = 0; else {
          const gi2 = 3 * permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]];
          t2 *= t2;
          n2 = t2 * t2 * (grad3[gi2] * x2 + grad3[gi2 + 1] * y2 + grad3[gi2 + 2] * z2);
        }
        let t3 = .6 - x3 * x3 - y3 * y3 - z3 * z3;
        if (t3 < 0) n3 = 0; else {
          const gi3 = 3 * permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]];
          t3 *= t3;
          n3 = t3 * t3 * (grad3[gi3] * x3 + grad3[gi3 + 1] * y3 + grad3[gi3 + 2] * z3);
        }
        return 32 * (n0 + n1 + n2 + n3);
      }
      noise4D(x, y, z, w) {
        const perm = this.perm;
        let n0, n1, n2, n3, n4;
        const s = (x + y + z + w) * F4;
        const i = Math.floor(x + s);
        const j = Math.floor(y + s);
        const k = Math.floor(z + s);
        const l = Math.floor(w + s);
        const t = (i + j + k + l) * G4;
        const X0 = i - t;
        const Y0 = j - t;
        const Z0 = k - t;
        const W0 = l - t;
        const x0 = x - X0;
        const y0 = y - Y0;
        const z0 = z - Z0;
        const w0 = w - W0;
        let rankx = 0;
        let ranky = 0;
        let rankz = 0;
        let rankw = 0;
        x0 > y0 ? rankx++ : ranky++;
        x0 > z0 ? rankx++ : rankz++;
        x0 > w0 ? rankx++ : rankw++;
        y0 > z0 ? ranky++ : rankz++;
        y0 > w0 ? ranky++ : rankw++;
        z0 > w0 ? rankz++ : rankw++;
        const i1 = rankx >= 3 ? 1 : 0;
        const j1 = ranky >= 3 ? 1 : 0;
        const k1 = rankz >= 3 ? 1 : 0;
        const l1 = rankw >= 3 ? 1 : 0;
        const i2 = rankx >= 2 ? 1 : 0;
        const j2 = ranky >= 2 ? 1 : 0;
        const k2 = rankz >= 2 ? 1 : 0;
        const l2 = rankw >= 2 ? 1 : 0;
        const i3 = rankx >= 1 ? 1 : 0;
        const j3 = ranky >= 1 ? 1 : 0;
        const k3 = rankz >= 1 ? 1 : 0;
        const l3 = rankw >= 1 ? 1 : 0;
        const x1 = x0 - i1 + G4;
        const y1 = y0 - j1 + G4;
        const z1 = z0 - k1 + G4;
        const w1 = w0 - l1 + G4;
        const x2 = x0 - i2 + 2 * G4;
        const y2 = y0 - j2 + 2 * G4;
        const z2 = z0 - k2 + 2 * G4;
        const w2 = w0 - l2 + 2 * G4;
        const x3 = x0 - i3 + 3 * G4;
        const y3 = y0 - j3 + 3 * G4;
        const z3 = z0 - k3 + 3 * G4;
        const w3 = w0 - l3 + 3 * G4;
        const x4 = x0 - 1 + 4 * G4;
        const y4 = y0 - 1 + 4 * G4;
        const z4 = z0 - 1 + 4 * G4;
        const w4 = w0 - 1 + 4 * G4;
        const ii = 255 & i;
        const jj = 255 & j;
        const kk = 255 & k;
        const ll = 255 & l;
        let t0 = .6 - x0 * x0 - y0 * y0 - z0 * z0 - w0 * w0;
        if (t0 < 0) n0 = 0; else {
          const gi0 = perm[ii + perm[jj + perm[kk + perm[ll]]]] % 32 * 4;
          t0 *= t0;
          n0 = t0 * t0 * (grad4[gi0] * x0 + grad4[gi0 + 1] * y0 + grad4[gi0 + 2] * z0 + grad4[gi0 + 3] * w0);
        }
        let t1 = .6 - x1 * x1 - y1 * y1 - z1 * z1 - w1 * w1;
        if (t1 < 0) n1 = 0; else {
          const gi1 = perm[ii + i1 + perm[jj + j1 + perm[kk + k1 + perm[ll + l1]]]] % 32 * 4;
          t1 *= t1;
          n1 = t1 * t1 * (grad4[gi1] * x1 + grad4[gi1 + 1] * y1 + grad4[gi1 + 2] * z1 + grad4[gi1 + 3] * w1);
        }
        let t2 = .6 - x2 * x2 - y2 * y2 - z2 * z2 - w2 * w2;
        if (t2 < 0) n2 = 0; else {
          const gi2 = perm[ii + i2 + perm[jj + j2 + perm[kk + k2 + perm[ll + l2]]]] % 32 * 4;
          t2 *= t2;
          n2 = t2 * t2 * (grad4[gi2] * x2 + grad4[gi2 + 1] * y2 + grad4[gi2 + 2] * z2 + grad4[gi2 + 3] * w2);
        }
        let t3 = .6 - x3 * x3 - y3 * y3 - z3 * z3 - w3 * w3;
        if (t3 < 0) n3 = 0; else {
          const gi3 = perm[ii + i3 + perm[jj + j3 + perm[kk + k3 + perm[ll + l3]]]] % 32 * 4;
          t3 *= t3;
          n3 = t3 * t3 * (grad4[gi3] * x3 + grad4[gi3 + 1] * y3 + grad4[gi3 + 2] * z3 + grad4[gi3 + 3] * w3);
        }
        let t4 = .6 - x4 * x4 - y4 * y4 - z4 * z4 - w4 * w4;
        if (t4 < 0) n4 = 0; else {
          const gi4 = perm[ii + 1 + perm[jj + 1 + perm[kk + 1 + perm[ll + 1]]]] % 32 * 4;
          t4 *= t4;
          n4 = t4 * t4 * (grad4[gi4] * x4 + grad4[gi4 + 1] * y4 + grad4[gi4 + 2] * z4 + grad4[gi4 + 3] * w4);
        }
        return 27 * (n0 + n1 + n2 + n3 + n4);
      }
    }
    exports.SimplexNoise = SimplexNoise;
    exports.default = SimplexNoise;
    function buildPermutationTable(random) {
      const p = new Uint8Array(256);
      for (let i = 0; i < 256; i++) p[i] = i;
      for (let i = 0; i < 255; i++) {
        const r = i + ~~(random() * (256 - i));
        const aux = p[i];
        p[i] = p[r];
        p[r] = aux;
      }
      return p;
    }
    exports.buildPermutationTable = buildPermutationTable;
    function alea(seed) {
      let s0 = 0;
      let s1 = 0;
      let s2 = 0;
      let c = 1;
      const mash = masher();
      s0 = mash(" ");
      s1 = mash(" ");
      s2 = mash(" ");
      s0 -= mash(seed);
      s0 < 0 && (s0 += 1);
      s1 -= mash(seed);
      s1 < 0 && (s1 += 1);
      s2 -= mash(seed);
      s2 < 0 && (s2 += 1);
      return function() {
        const t = 2091639 * s0 + 2.3283064365386963e-10 * c;
        s0 = s1;
        s1 = s2;
        return s2 = t - (c = 0 | t);
      };
    }
    function masher() {
      let n = 4022871197;
      return function(data) {
        data = data.toString();
        for (let i = 0; i < data.length; i++) {
          n += data.charCodeAt(i);
          let h = .02519603282416938 * n;
          n = h >>> 0;
          h -= n;
          h *= n;
          n = h >>> 0;
          h -= n;
          n += 4294967296 * h;
        }
        return 2.3283064365386963e-10 * (n >>> 0);
      };
    }
  }, {} ],
  3: [ function(require, module, exports) {
    "use strict";
    var tweenFunctions = {
      linear: function(t, b, _c, d) {
        var c = _c - b;
        return c * t / d + b;
      },
      easeInQuad: function(t, b, _c, d) {
        var c = _c - b;
        return c * (t /= d) * t + b;
      },
      easeOutQuad: function(t, b, _c, d) {
        var c = _c - b;
        return -c * (t /= d) * (t - 2) + b;
      },
      easeInOutQuad: function(t, b, _c, d) {
        var c = _c - b;
        return (t /= d / 2) < 1 ? c / 2 * t * t + b : -c / 2 * (--t * (t - 2) - 1) + b;
      },
      easeInCubic: function(t, b, _c, d) {
        var c = _c - b;
        return c * (t /= d) * t * t + b;
      },
      easeOutCubic: function(t, b, _c, d) {
        var c = _c - b;
        return c * ((t = t / d - 1) * t * t + 1) + b;
      },
      easeInOutCubic: function(t, b, _c, d) {
        var c = _c - b;
        return (t /= d / 2) < 1 ? c / 2 * t * t * t + b : c / 2 * ((t -= 2) * t * t + 2) + b;
      },
      easeInQuart: function(t, b, _c, d) {
        var c = _c - b;
        return c * (t /= d) * t * t * t + b;
      },
      easeOutQuart: function(t, b, _c, d) {
        var c = _c - b;
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
      },
      easeInOutQuart: function(t, b, _c, d) {
        var c = _c - b;
        return (t /= d / 2) < 1 ? c / 2 * t * t * t * t + b : -c / 2 * ((t -= 2) * t * t * t - 2) + b;
      },
      easeInQuint: function(t, b, _c, d) {
        var c = _c - b;
        return c * (t /= d) * t * t * t * t + b;
      },
      easeOutQuint: function(t, b, _c, d) {
        var c = _c - b;
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
      },
      easeInOutQuint: function(t, b, _c, d) {
        var c = _c - b;
        return (t /= d / 2) < 1 ? c / 2 * t * t * t * t * t + b : c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
      },
      easeInSine: function(t, b, _c, d) {
        var c = _c - b;
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
      },
      easeOutSine: function(t, b, _c, d) {
        var c = _c - b;
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
      },
      easeInOutSine: function(t, b, _c, d) {
        var c = _c - b;
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
      },
      easeInExpo: function(t, b, _c, d) {
        var c = _c - b;
        return 0 == t ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
      },
      easeOutExpo: function(t, b, _c, d) {
        var c = _c - b;
        return t == d ? b + c : c * (1 - Math.pow(2, -10 * t / d)) + b;
      },
      easeInOutExpo: function(t, b, _c, d) {
        var c = _c - b;
        if (0 === t) return b;
        if (t === d) return b + c;
        return (t /= d / 2) < 1 ? c / 2 * Math.pow(2, 10 * (t - 1)) + b : c / 2 * (2 - Math.pow(2, -10 * --t)) + b;
      },
      easeInCirc: function(t, b, _c, d) {
        var c = _c - b;
        return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
      },
      easeOutCirc: function(t, b, _c, d) {
        var c = _c - b;
        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
      },
      easeInOutCirc: function(t, b, _c, d) {
        var c = _c - b;
        return (t /= d / 2) < 1 ? -c / 2 * (Math.sqrt(1 - t * t) - 1) + b : c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
      },
      easeInElastic: function(t, b, _c, d) {
        var c = _c - b;
        var a, p, s;
        s = 1.70158;
        p = 0;
        a = c;
        if (0 === t) return b;
        if (1 === (t /= d)) return b + c;
        p || (p = .3 * d);
        if (a < Math.abs(c)) {
          a = c;
          s = p / 4;
        } else s = p / (2 * Math.PI) * Math.asin(c / a);
        return -a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) + b;
      },
      easeOutElastic: function(t, b, _c, d) {
        var c = _c - b;
        var a, p, s;
        s = 1.70158;
        p = 0;
        a = c;
        if (0 === t) return b;
        if (1 === (t /= d)) return b + c;
        p || (p = .3 * d);
        if (a < Math.abs(c)) {
          a = c;
          s = p / 4;
        } else s = p / (2 * Math.PI) * Math.asin(c / a);
        return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
      },
      easeInOutElastic: function(t, b, _c, d) {
        var c = _c - b;
        var a, p, s;
        s = 1.70158;
        p = 0;
        a = c;
        if (0 === t) return b;
        if (2 === (t /= d / 2)) return b + c;
        p || (p = d * (.3 * 1.5));
        if (a < Math.abs(c)) {
          a = c;
          s = p / 4;
        } else s = p / (2 * Math.PI) * Math.asin(c / a);
        return t < 1 ? a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * -.5 + b : a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
      },
      easeInBack: function(t, b, _c, d, s) {
        var c = _c - b;
        void 0 === s && (s = 1.70158);
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
      },
      easeOutBack: function(t, b, _c, d, s) {
        var c = _c - b;
        void 0 === s && (s = 1.70158);
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
      },
      easeInOutBack: function(t, b, _c, d, s) {
        var c = _c - b;
        void 0 === s && (s = 1.70158);
        return (t /= d / 2) < 1 ? c / 2 * (t * t * ((1 + (s *= 1.525)) * t - s)) + b : c / 2 * ((t -= 2) * t * ((1 + (s *= 1.525)) * t + s) + 2) + b;
      },
      easeInBounce: function(t, b, _c, d) {
        var c = _c - b;
        var v;
        v = tweenFunctions.easeOutBounce(d - t, 0, c, d);
        return c - v + b;
      },
      easeOutBounce: function(t, b, _c, d) {
        var c = _c - b;
        return (t /= d) < 1 / 2.75 ? c * (7.5625 * t * t) + b : t < 2 / 2.75 ? c * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + b : t < 2.5 / 2.75 ? c * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + b : c * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + b;
      },
      easeInOutBounce: function(t, b, _c, d) {
        var c = _c - b;
        var v;
        if (t < d / 2) {
          v = tweenFunctions.easeInBounce(2 * t, 0, c, d);
          return .5 * v + b;
        }
        v = tweenFunctions.easeOutBounce(2 * t - d, 0, c, d);
        return .5 * v + .5 * c + b;
      }
    };
    module.exports = tweenFunctions;
  }, {} ],
  AdManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e6d967JR9pLZpk31M/9Qwux", "AdManager");
    "use strict";
    var _constants = _interopRequireDefault(require("./constants"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var DEBUG = _constants["default"].DEBUG;
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        cc.game.addPersistRootNode(this.node);
        this.app = cc.find("app").getComponent("app");
        if (!globalThis.GAMESNACKS && this.app.IS_DEVELOPMENT) {
          var script = document.createElement("script");
          script.src = "https://embed.gamesnacks.com/assets/js/gamesnacks.js";
          script.setAttribute("data-environment", "test");
          script.async = true;
          document.head.appendChild(script);
        }
        this._removeAllRewardedAdsCallback();
      },
      prepareRewardedAds: function prepareRewardedAds(cb) {
        var _this = this;
        if (!globalThis.GAMESNACKS) return;
        this._rewardedAdsFunc && this._removeAllRewardedAdsCallback();
        var rewardedAdOpportunity = function rewardedAdOpportunity() {
          GAMESNACKS.rewardedAdOpportunity({
            beforeReward: function beforeReward(showAdFn) {
              _this._rewardedAdsFunc = showAdFn;
              _this.onRewardedAdLoadSuccess();
              cb && cb(showAdFn);
            },
            beforeBreak: function beforeBreak() {
              _this.onRewardedAdStarted();
            },
            adComplete: function adComplete() {
              return _this.onRewardedAdCompleted();
            },
            adDismissed: function adDismissed() {},
            afterBreak: function afterBreak() {
              _this._rewardedAdsFunc = null;
              _this.onRewardedAdClosed();
            }
          });
        };
        this.app.IS_DEVELOPMENT && DEBUG.DELAYED_AD ? setTimeout(rewardedAdOpportunity, DEBUG.DELAYED_AD) : rewardedAdOpportunity();
      },
      showRewardedAds: function showRewardedAds(data) {
        data || (data = {});
        this.rewardedAdLoadSuccessCallback = data.onRewardedAdLoadSuccess;
        this.rewardedAdLoadFailureCallback = data.onRewardedAdLoadFailure;
        this.rewardedAdStartedCallback = data.onRewardedAdStarted;
        this.rewardedAdShowErrorCallback = data.onRewardedAdShowError;
        this.rewardedAdClickedCallback = data.onRewardedAdClicked;
        this.rewardedAdClosedCallback = data.onRewardedAdClosed;
        this.rewardedAdCompletedCallback = data.onRewardedAdCompleted;
        this._rewardedAdsFunc();
      },
      hasRewardedAds: function hasRewardedAds() {
        return !!this._rewardedAdsFunc;
      },
      onRewardedAdLoadSuccess: function onRewardedAdLoadSuccess() {
        this.onRewardAdsSuccess && this.onRewardAdsSuccess();
        this.rewardedAdLoadSuccessCallback && this.rewardedAdLoadSuccessCallback();
        this.rewardedAdLoadSuccessCallback = null;
      },
      onRewardedAdLoadFailure: function onRewardedAdLoadFailure() {
        cc.director.resume();
        this.app.audioManager.resumeAll();
        this.rewardedAdLoadFailureCallback && this.rewardedAdLoadFailureCallback();
        this._removeAllRewardedAdsCallback();
      },
      onRewardedAdStarted: function onRewardedAdStarted() {
        cc.director.pause();
        this.app.audioManager.pauseAll();
        this.rewardedAdStartedCallback && this.rewardedAdStartedCallback();
        this.rewardedAdStartedCallback = null;
      },
      onRewardedAdShowError: function onRewardedAdShowError() {
        cc.director.resume();
        this.app.audioManager.resumeAll();
        this.rewardedAdShowErrorCallback && this.rewardedAdShowErrorCallback();
        this.rewardedAdShowErrorCallback = null;
      },
      onRewardedAdClicked: function onRewardedAdClicked() {
        this.rewardedAdClickedCallback && this.rewardedAdClickedCallback();
        this.rewardedAdClickedCallback = null;
      },
      onRewardedAdClosed: function onRewardedAdClosed() {
        cc.director.resume();
        this.app.audioManager.resumeAll();
        this.rewardedAdClosedCallback && this.rewardedAdClosedCallback();
        this._removeAllRewardedAdsCallback();
      },
      onRewardedAdCompleted: function onRewardedAdCompleted() {
        cc.director.resume();
        this.app.audioManager.resumeAll();
        this.rewardedAdCompletedCallback && this.rewardedAdCompletedCallback();
        this.rewardedAdCompletedCallback = null;
      },
      _removeAllRewardedAdsCallback: function _removeAllRewardedAdsCallback() {
        this.rewardedAdLoadSuccessCallback = null;
        this.rewardedAdLoadFailureCallback = null;
        this.rewardedAdStartedCallback = null;
        this.rewardedAdShowErrorCallback = null;
        this.rewardedAdClickedCallback = null;
        this.rewardedAdClosedCallback = null;
        this.rewardedAdCompletedCallback = null;
      }
    });
    cc._RF.pop();
  }, {
    "./constants": "constants"
  } ],
  AudioManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b59admMWTxN3pJDDozi2hPl", "AudioManager");
    "use strict";
    function _createForOfIteratorHelperLoose(o, allowArrayLike) {
      var it;
      if ("undefined" === typeof Symbol || null == o[Symbol.iterator]) {
        if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && "number" === typeof o.length) {
          it && (o = it);
          var i = 0;
          return function() {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          };
        }
        throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }
      it = o[Symbol.iterator]();
      return it.next.bind(it);
    }
    function _unsupportedIterableToArray(o, minLen) {
      if (!o) return;
      if ("string" === typeof o) return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      "Object" === n && o.constructor && (n = o.constructor.name);
      if ("Map" === n || "Set" === n) return Array.from(o);
      if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }
    function _arrayLikeToArray(arr, len) {
      (null == len || len > arr.length) && (len = arr.length);
      for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
      return arr2;
    }
    var FILE_PATH = "sounds";
    var SFX_FILES = {
      click: {
        name: "click",
        category: "init",
        volume: .8
      },
      bomb_explosion: {
        name: "bomb_explosion",
        category: "gameplay",
        volume: .8
      },
      clear_stage: {
        name: "clear_stage",
        category: "gameplay",
        volume: .8
      },
      cube_exchange: {
        name: "cube_exchange",
        category: "gameplay",
        volume: .8
      },
      cube_explosion: {
        name: "cube_explosion",
        category: "gameplay",
        volume: .8
      },
      frisbee_launch: {
        name: "frisbee_launch",
        category: "gameplay",
        volume: .8
      },
      game_over: {
        name: "game_over",
        category: "gameplay",
        volume: .8
      },
      lightBall_launch: {
        name: "lightBall_launch",
        category: "gameplay",
        volume: .8
      },
      rocket_launch: {
        name: "rocket_launch",
        category: "gameplay",
        volume: .8
      },
      unlock_new_item: {
        name: "unlock_new_item",
        category: "gameplay",
        volume: .8
      },
      feeding: {
        name: "feeding",
        category: "init",
        volume: .8
      }
    };
    var MUSIC_FILES = {
      bgm_gameplay_1: {
        name: "bgm_gameplay_1",
        category: "bgm_gameplay_1",
        volume: 1
      },
      bgm_gameplay_2: {
        name: "bgm_gameplay_2",
        category: "bgm_gameplay_2",
        volume: 1
      },
      bgm_gameplay_3: {
        name: "bgm_gameplay_3",
        category: "bgm_gameplay_3",
        volume: 1
      },
      bgm_home: {
        name: "bgm_home",
        category: "init",
        volume: 1
      }
    };
    var TOTAL_SFX_SUPPORTED_IN_SAME_TIME = 10;
    var LIMITED_SAME_SFX_PLAY_IN_SAME_TIME = 8;
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        cc.game.addPersistRootNode(this.node);
        this._audioClipDic = {};
        this._curMusicConfig = null;
        this._musicWaiting = {};
        this.musicSource = this.node.addComponent(cc.AudioSource);
        this._sfxSourceIndex = 0;
        this.sfxSources = [];
        for (var index = 0; index < TOTAL_SFX_SUPPORTED_IN_SAME_TIME; index++) {
          var source = this.node.addComponent(cc.AudioSource);
          this.sfxSources.push(source);
        }
      },
      init: function init(musicVolume) {
        this.app = cc.find("app").getComponent("app");
        this._musicVolume = this._lastMusicVolume = musicVolume;
        if (globalThis.GAMESNACKS) {
          this._masterVolume = ~~GAMESNACKS.isAudioEnabled();
          GAMESNACKS.subscribeToAudioUpdates(this.gameSnackAudioConfigChanged.bind(this));
        } else this._masterVolume = 1;
        this.setNextGameplayMusic();
      },
      loadGameplayContent: function loadGameplayContent() {
        return Promise.all([ this._loadContent(FILE_PATH + "/bgm", MUSIC_FILES, this.nextGameplayMusic), this._loadContent(FILE_PATH + "/sfx", SFX_FILES, "gameplay") ]);
      },
      loadHomeContent: function loadHomeContent() {
        return Promise.all([ this._loadContent(FILE_PATH + "/bgm", MUSIC_FILES, "init"), this._loadContent(FILE_PATH + "/sfx", SFX_FILES, "init") ]);
      },
      _loadContent: function _loadContent(contentPath, content, category) {
        var _this = this;
        return new Promise(function(res, rej) {
          var totalTask = Object.keys(content).length;
          var _loop = function _loop(key) {
            totalTask--;
            var file = content[key];
            if (file.category !== category) return "continue";
            cc.resources.load(contentPath + "/" + file.name, cc.AudioClip, function(err, asset) {
              err && rej(err);
              _this._audioClipDic[file.name] = {
                audioClip: asset,
                volume: file.volume
              };
              if (_this._musicWaiting[file.name] && MUSIC_FILES[file.name]) {
                _this.playMusic(file.name);
                delete _this._musicWaiting[file.name];
              }
              0 === totalTask && res();
            });
          };
          for (var key in content) {
            var _ret = _loop(key);
            if ("continue" === _ret) continue;
          }
        });
      },
      setNextGameplayMusic: function setNextGameplayMusic() {
        var index = Math.floor(3 * Math.random()) + 1;
        this.app.catTutorial.getCurrentStep() < 0 && (index = 3);
        this.nextGameplayMusic = "bgm_gameplay_" + index;
      },
      playGameplayMusic: function playGameplayMusic() {
        this.playMusic(this.nextGameplayMusic);
        this.setNextGameplayMusic();
      },
      playSfx: function playSfx(name) {
        if (!this._audioClipDic[name]) return;
        var config = this._audioClipDic[name];
        this.sfxSources[this._sfxSourceIndex].loop = false;
        this.sfxSources[this._sfxSourceIndex].clip = config.audioClip;
        this.sfxSources[this._sfxSourceIndex].volume = config.volume * this._musicVolume * this._masterVolume;
        this.sfxSources[this._sfxSourceIndex].play();
        this._sfxSourceIndex = (this._sfxSourceIndex + 1) % TOTAL_SFX_SUPPORTED_IN_SAME_TIME;
      },
      gameSnackAudioConfigChanged: function gameSnackAudioConfigChanged() {
        this._masterVolume = ~~GAMESNACKS.isAudioEnabled();
      },
      playMusic: function playMusic(name) {
        if (!this._audioClipDic[name]) {
          this._musicWaiting[name] = true;
          return;
        }
        var config = this._audioClipDic[name];
        this._curMusicConfig = config;
        this.musicSource.loop = true;
        this.musicSource.clip = config.audioClip;
        this.musicSource.volume = config.volume * this._musicVolume * this._masterVolume;
        this.musicSource.play();
      },
      setMusicVolume: function setMusicVolume(value) {
        this._musicVolume = this._lastMusicVolume = value;
        this.musicSource.volume = this._curMusicConfig.volume * this._musicVolume * this._masterVolume;
      },
      setSfxVolume: function setSfxVolume(value) {
        this._sfxVolume = value;
      },
      stopMusic: function stopMusic() {
        cc.tween(this.musicSource).to(1.25, {
          volume: 0
        }).start();
      },
      pauseAll: function pauseAll() {
        this.musicSource.pause();
        for (var _iterator = _createForOfIteratorHelperLoose(this.sfxSources), _step; !(_step = _iterator()).done; ) {
          var source = _step.value;
          source.pause();
        }
        this._musicVolume = 0;
      },
      resumeAll: function resumeAll() {
        this.musicSource.resume();
        for (var _iterator2 = _createForOfIteratorHelperLoose(this.sfxSources), _step2; !(_step2 = _iterator2()).done; ) {
          var source = _step2.value;
          source.resume();
        }
        this._musicVolume = this._lastMusicVolume;
      },
      _needPlaySfx: function _needPlaySfx(name) {
        var count = 0;
        for (var index = 0; index < this.sfxSources.length; index++) {
          var source = this.sfxSources[index];
          if (!source.clip) continue;
          source.clip.name === name && count++;
        }
        return count < LIMITED_SAME_SFX_PLAY_IN_SAME_TIME;
      }
    });
    cc._RF.pop();
  }, {} ],
  BagBoosterItem: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "522aaV68pdPjKN16YogApeQ", "BagBoosterItem");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        airplane: {
          default: null,
          type: cc.SpriteFrame
        },
        fairystick: {
          default: null,
          type: cc.SpriteFrame
        },
        hammer: {
          default: null,
          type: cc.SpriteFrame
        },
        paintbrush: {
          default: null,
          type: cc.SpriteFrame
        },
        rocket: {
          default: null,
          type: cc.SpriteFrame
        },
        wheel: {
          default: null,
          type: cc.SpriteFrame
        }
      },
      onLoad: function onLoad() {
        this.icon = this.node.getChildByName("icon").getComponent(cc.Sprite);
        this.quantityLabel = this.node.getChildByName("quantity").getComponent(cc.Label);
        this.button = this.node.getChildByName("button");
        this.infoButton = this.node.getChildByName("infoIcon");
        this.button.on("click", this.onButtonClicked, this);
        this.infoButton.on("click", this.onInfoButtonClicked, this);
      },
      loadData: function loadData(data, onItemClicked, onInfoClicked) {
        this.icon = this.node.getChildByName("icon").getComponent(cc.Sprite);
        this.quantityLabel = this.node.getChildByName("quantity").getComponent(cc.Label);
        this.button = this.node.getChildByName("button");
        this.data = data;
        this.onItemClicked = onItemClicked;
        this.onInfoClicked = onInfoClicked;
        this.icon.spriteFrame = this[data.id];
        this.quantityLabel.string = "x" + (data.amount || 0);
      },
      updateNumber: function updateNumber(number) {
        this.quantityLabel.string = "x" + (0 | number);
      },
      onButtonClicked: function onButtonClicked() {
        this.onItemClicked && this.onItemClicked(this.data.id);
      },
      onInfoButtonClicked: function onInfoButtonClicked() {
        this.onInfoClicked && this.onInfoClicked(this.data.id);
      }
    });
    cc._RF.pop();
  }, {} ],
  BagSubscene: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "813cbcI64NCwrG5dM76T4yo", "BagSubscene");
    "use strict";
    var _constants = _interopRequireDefault(require("../../constants"));
    var _userState = _interopRequireDefault(require("../../userState"));
    var _yard = _interopRequireDefault(require("../../staticData/yard"));
    var _boosters = _interopRequireDefault(require("../../staticData/boosters"));
    var _supplyModel = _interopRequireDefault(require("../../models/supplyModel"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    function _extends() {
      _extends = Object.assign || function(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];
          for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
      };
      return _extends.apply(this, arguments);
    }
    var DEBUG = _constants["default"].DEBUG, TIME_SPAN = _constants["default"].TIME_SPAN;
    var ONE_SECOND = DEBUG.FEEDING_ENVIRONMENT ? 20 : TIME_SPAN.ONE_SECOND;
    var ITEM_WIDTH = 480;
    var BOOSTER_ITEM_HEIGHT = 640;
    var SUPPLY_ITEM_HEIGHT = 500;
    var BOTTOM_SPACE = 162;
    var LIST_SPACING = 50;
    var GLOWING_SPEED = .7;
    cc.Class({
      extends: cc.Component,
      properties: {
        BoosterItem: {
          default: null,
          type: cc.Prefab
        },
        SupplyItem: {
          default: null,
          type: cc.Prefab
        },
        GlowItem: {
          default: null,
          type: cc.Prefab
        },
        material_glow: {
          default: null,
          type: cc.Material
        }
      },
      onLoad: function onLoad() {
        this.app = cc.find("app").getComponent("app");
        this.subsceneController = cc.find("Canvas").getComponent("SubsceneController");
        this.wallpaper = this.node.getChildByName("wallpaper");
        this.topFrame = this.node.getChildByName("topFrame");
        this.topBar = this.topFrame.getChildByName("top");
        this.topBg = this.topFrame.getChildByName("bg");
        this.boostersTab = this.topFrame.getChildByName("boostersTab");
        this.suppliesTab = this.topFrame.getChildByName("suppliesTab");
        this.bottomFrame = this.node.getChildByName("bottomFrame");
        this.bottomFramePlace = this.bottomFrame.getChildByName("frame");
        this.bottomFrameEmpty = this.bottomFrame.getChildByName("placeNotification");
        this.placeButton = this.bottomFramePlace.getChildByName("placeButton").getComponent(cc.Button);
        this.bottomFramePlace.active = false;
        this.bottomFrameEmpty.active = true;
        this.placeButton.node.on("click", this.onPlaceButtonClicked, this);
        this.boostersScrollView = this.node.getChildByName("boostersScrollview");
        this.boostersScrollFrame = this.boostersScrollView.getChildByName("view").getChildByName("content");
        this.suppliesScrollView = this.node.getChildByName("suppliesScrollview");
        this.suppliesScrollFrame = this.suppliesScrollView.getChildByName("view").getChildByName("content");
        this.glowLayer = this.suppliesScrollFrame.getChildByName("GlowLayer");
        this.boosterInfoFrame = this.boostersScrollFrame.getChildByName("infoFrame");
        this.boosterInfoFrame.zIndex = 1;
        this.boostersScrollView.on(cc.Node.EventType.TOUCH_START, this.hideBoosterInfo, this);
        this.glowLayer.zIndex = 2;
        this.topBg.zIndex = -2;
        this.boostersTab.on("click", this.onBoostersTabClicked, this);
        this.suppliesTab.on("click", this.onSuppliesTabClicked, this);
        this.selectTab("boosters");
        this.app.boostersRefreshRequest = true;
        this.app.suppliesRefreshRequest = true;
        this.boosterItems = {};
        this.supplyItems = {};
        this.glowItems = {};
        this.selectingSuppliesCount = 0;
        this.glowTimer = 0;
      },
      onEnable: function onEnable() {
        if (this.app.boostersRefreshRequest) {
          this.loadBoosterItems();
          this.app.boostersRefreshRequest = false;
        }
        if (this.app.suppliesRefreshRequest) {
          this.loadSupplyItems();
          this.app.suppliesRefreshRequest = false;
        }
        this.clearGlowingSupplies();
        this.hideBoosterInfo();
      },
      onOpened: function onOpened(opts) {
        opts && opts.tab && this.selectTab(opts.tab);
      },
      update: function update(dt) {
        if (this.selectingSuppliesCount) {
          this.glowTimer += dt * GLOWING_SPEED;
          this.material_glow.setProperty("hl_timer", this.glowTimer);
        }
      },
      loadBoosterItems: function loadBoosterItems() {
        for (var key in this.boosterItems) {
          var boosterItem = this.boosterItems[key];
          boosterItem.node.destroy();
        }
        this.boosterItems = {};
        var boostersData = _userState["default"].getBoosters();
        var boosterCounter = 0;
        for (var _key in boostersData) {
          var item = boostersData[_key];
          if (item.amount) {
            var goItem = cc.instantiate(this.BoosterItem).getComponent("BagBoosterItem");
            goItem.node.setParent(this.boostersScrollFrame);
            goItem.node.x = boosterCounter % 2 ? .5 * ITEM_WIDTH : .5 * -ITEM_WIDTH;
            goItem.node.y = -LIST_SPACING - Math.floor(.5 * boosterCounter) * BOOSTER_ITEM_HEIGHT;
            goItem.loadData(_extends({
              id: _key
            }, item), this.onBoosterItemClicked.bind(this), this.onBoosterInfoClicked.bind(this));
            this.boosterItems[_key] = goItem;
            boosterCounter++;
          }
        }
        this.boostersScrollFrame.height = BOOSTER_ITEM_HEIGHT * Math.ceil(.5 * boosterCounter) + 2 * LIST_SPACING;
      },
      loadSupplyItems: function loadSupplyItems() {
        for (var key in this.supplyItems) {
          var supplyItem = this.supplyItems[key];
          supplyItem.node.destroy();
        }
        for (var _key2 in this.glowItems) {
          var glowItem = this.glowItems[_key2];
          glowItem.node.destroy();
        }
        this.supplyItems = {};
        this.glowItems = {};
        var supplies = _supplyModel["default"].getSupplyData().items;
        var yardData = _userState["default"].getYard();
        var supplyCounter = 0;
        for (var _key3 in _yard["default"].items) {
          var goItem = cc.instantiate(this.SupplyItem).getComponent("BagSupplyItem");
          goItem.node.setParent(this.suppliesScrollFrame);
          goItem.node.x = supplyCounter % 2 ? .5 * ITEM_WIDTH : .5 * -ITEM_WIDTH;
          goItem.node.y = -LIST_SPACING - Math.floor(.5 * supplyCounter) * SUPPLY_ITEM_HEIGHT;
          supplies.includes(_key3) ? goItem.loadData({
            id: _key3,
            isPlaced: !!yardData[_key3]
          }, this.onSupplyItemClicked.bind(this)) : goItem.loadData(null, null, null);
          this.supplyItems[_key3] = goItem;
          supplyCounter++;
          if (goItem.data) {
            var glowGOItem = cc.instantiate(this.GlowItem).getComponent("YardGlow");
            glowGOItem.node.setParent(this.glowLayer);
            glowGOItem.node.x = goItem.node.x + goItem.icon.node.x;
            glowGOItem.node.y = goItem.node.y + goItem.icon.node.y + goItem.icon.node.height * goItem.icon.node.scale * .5;
            glowGOItem.node.scale = goItem.node.scale;
            this.glowItems[_key3] = glowGOItem;
            glowGOItem.setGlowShape(goItem.data.id);
            glowGOItem.node.active = false;
          }
        }
        this.suppliesScrollFrame.height = SUPPLY_ITEM_HEIGHT * Math.ceil(.5 * supplyCounter) + 2 * LIST_SPACING + this.bottomFrame.height * this.bottomFrame.scale;
      },
      selectTab: function selectTab(tab) {
        if (this.selectingTab === tab) return;
        this.selectingTab = tab;
        if ("boosters" === tab) {
          this.boostersTab.getChildByName("selected").active = true;
          this.boostersTab.getChildByName("unselected").active = false;
          this.suppliesTab.getChildByName("selected").active = false;
          this.suppliesTab.getChildByName("unselected").active = true;
          this.boostersTab.zIndex = 1;
          this.suppliesTab.zIndex = -1;
          this.boostersScrollView.active = true;
          this.suppliesScrollView.active = false;
          this.bottomFrame.active = false;
          this.hideBoosterInfo();
        } else if ("supplies" === tab) {
          this.boostersTab.getChildByName("selected").active = false;
          this.boostersTab.getChildByName("unselected").active = true;
          this.suppliesTab.getChildByName("selected").active = true;
          this.suppliesTab.getChildByName("unselected").active = false;
          this.boostersTab.zIndex = -1;
          this.suppliesTab.zIndex = 1;
          this.boostersScrollView.active = false;
          this.suppliesScrollView.active = true;
          this.bottomFrame.active = true;
          this.clearGlowingSupplies();
        }
      },
      clearGlowingSupplies: function clearGlowingSupplies() {
        this.bottomFramePlace.active = false;
        this.bottomFrameEmpty.active = true;
        this.selectingSuppliesCount = 0;
        this.glowTimer = 0;
        for (var key in this.glowItems) {
          var glowItem = this.glowItems[key];
          glowItem.node.active = false;
        }
      },
      hideBoosterInfo: function hideBoosterInfo() {
        this.boosterInfoFrame.active = false;
      },
      showBoosterInfo: function showBoosterInfo() {
        this.boosterInfoFrame.active = true;
      },
      onBoostersTabClicked: function onBoostersTabClicked() {
        this.app.audioManager.playSfx("click");
        this.selectTab("boosters");
      },
      onSuppliesTabClicked: function onSuppliesTabClicked() {
        this.app.audioManager.playSfx("click");
        this.selectTab("supplies");
      },
      onBoosterItemClicked: function onBoosterItemClicked(id) {
        this.app.audioManager.playSfx("click");
        this.subsceneController.switchScene("shop", {
          id: id
        });
      },
      onBoosterInfoClicked: function onBoosterInfoClicked(id) {
        this.boosterInfoFrame.y = this.boosterItems[id].node.y - .6 * this.boosterItems[id].node.height;
        this.boosterInfoFrame.x = this.boosterItems[id].node.x < 0 ? -125 : 112;
        this.boosterInfoFrame.getChildByName("backer").scaleX = this.boosterItems[id].node.x < 0 ? 1 : -1;
        this.boostersScrollFrame.y += -Math.min(0, this.boostersScrollView.height + (this.boosterInfoFrame.y - .9 * this.boosterInfoFrame.height + (this.boostersScrollFrame.y - .5 * this.boostersScrollView.height)));
        var nameLabel = this.boosterInfoFrame.getChildByName("name").getComponent(cc.Label);
        var descLabel = this.boosterInfoFrame.getChildByName("desc").getComponent(cc.Label);
        nameLabel.string = _boosters["default"][id].name;
        descLabel.string = _boosters["default"][id].description;
        this.showBoosterInfo();
      },
      onSupplyItemClicked: function onSupplyItemClicked(id) {
        if (this.supplyItems[id].isPlaced) return;
        if (this.glowItems[id].node.active) {
          this.glowItems[id].node.active = false;
          this.selectingSuppliesCount--;
        } else {
          this.glowItems[id].node.active = true;
          this.selectingSuppliesCount++;
          this.glowTimer = 0;
        }
        this.bottomFramePlace.active = this.selectingSuppliesCount > 0;
        this.bottomFrameEmpty.active = 0 === this.selectingSuppliesCount;
        this.app.audioManager.playSfx("click");
      },
      onPlaceButtonClicked: function onPlaceButtonClicked() {
        var yardData = _userState["default"].getYard();
        for (var key in this.glowItems) {
          var glowItem = this.glowItems[key];
          var supplyItem = this.supplyItems[key];
          if (glowItem.node.active) {
            yardData[key] || (yardData[key] = {
              playingCat: null,
              nextUpdate: Date.now() + _yard["default"].items[key].interval * ONE_SECOND,
              x: -1,
              y: -1
            });
            supplyItem.setPlaced();
            glowItem.node.active = false;
          }
        }
        _userState["default"].saveYard();
        this.app.yardViewRefreshRequest = true;
        this.clearGlowingSupplies();
        this.app.audioManager.playSfx("click");
      },
      updateScreenSize: function updateScreenSize(frame, uiScale) {
        this.wallpaper.height = this.node.height;
        this.topFrame.y = .5 * this.node.height;
        this.topFrame.scale = uiScale;
        this.topBar.width = this.node.width / uiScale;
        this.topBg.scale = this.node.scale / uiScale;
        var bottomSpace = BOTTOM_SPACE * uiScale;
        this.bottomFrame.scale = uiScale;
        this.bottomFrame.y = .5 * -this.node.height + bottomSpace + .5 * this.bottomFrame.height * uiScale;
        var topSpace = this.topFrame.height * uiScale;
        this.boostersScrollView.height = this.node.height - bottomSpace - topSpace;
        this.boostersScrollView.y = .5 * (bottomSpace - topSpace);
        this.suppliesScrollView.height = this.node.height - bottomSpace - topSpace;
        this.suppliesScrollView.y = .5 * (bottomSpace - topSpace);
      }
    });
    cc._RF.pop();
  }, {
    "../../constants": "constants",
    "../../models/supplyModel": "supplyModel",
    "../../staticData/boosters": "boosters",
    "../../staticData/yard": "yard",
    "../../userState": "userState"
  } ],
  BagSupplyItem: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "73969qcc6xIXYVDwfzZPHIG", "BagSupplyItem");
    "use strict";
    var _yard = _interopRequireDefault(require("../staticData/yard"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var MAX_ICON_SIZE = 400;
    cc.Class({
      extends: cc.Component,
      properties: {
        bed: {
          default: null,
          type: cc.SpriteFrame
        },
        cushion: {
          default: null,
          type: cc.SpriteFrame
        },
        featherToy: {
          default: null,
          type: cc.SpriteFrame
        },
        hamburgerCushion: {
          default: null,
          type: cc.SpriteFrame
        },
        paperBag1: {
          default: null,
          type: cc.SpriteFrame
        },
        paperBag2: {
          default: null,
          type: cc.SpriteFrame
        },
        plushDoll: {
          default: null,
          type: cc.SpriteFrame
        },
        pot: {
          default: null,
          type: cc.SpriteFrame
        },
        rubberBallRainbow: {
          default: null,
          type: cc.SpriteFrame
        },
        rubberBallRed: {
          default: null,
          type: cc.SpriteFrame
        },
        stretchingBoard: {
          default: null,
          type: cc.SpriteFrame
        },
        swimRing: {
          default: null,
          type: cc.SpriteFrame
        },
        swing: {
          default: null,
          type: cc.SpriteFrame
        },
        tent: {
          default: null,
          type: cc.SpriteFrame
        },
        tower: {
          default: null,
          type: cc.SpriteFrame
        },
        tunnel: {
          default: null,
          type: cc.SpriteFrame
        }
      },
      onLoad: function onLoad() {
        this.icon = this.node.getChildByName("icon").getComponent(cc.Sprite);
        this.placedIcon = this.node.getChildByName("placed-icon");
        this.materialNormal = this.icon.getMaterial(0);
        this.node.on("click", this.onClicked, this);
      },
      loadData: function loadData(data, onItemClicked) {
        this.data = data;
        this.icon = this.node.getChildByName("icon").getComponent(cc.Sprite);
        if (data) {
          var maxSize = Math.max(this.icon.node.width, this.icon.node.height, MAX_ICON_SIZE);
          this.icon.node.scale = _yard["default"].items[data.id].spriteScale;
          this.onItemClicked = onItemClicked;
          this.icon.spriteFrame = this[data.id];
          data.isPlaced && this.setPlaced();
        } else {
          this.placedIcon = this.node.getChildByName("placed-icon");
          this.icon.node.active = false;
          this.placedIcon.active = false;
        }
      },
      setPlaced: function setPlaced() {
        this.isPlaced = true;
        this.icon = this.node.getChildByName("icon").getComponent(cc.Sprite);
        this.placedIcon = this.node.getChildByName("placed-icon");
        this.icon.node.active = false;
        this.placedIcon.active = true;
      },
      onClicked: function onClicked() {
        this.onItemClicked && this.onItemClicked(this.data.id);
      }
    });
    cc._RF.pop();
  }, {
    "../staticData/yard": "yard"
  } ],
  BoosterController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "73f37xT8fJBY4i4PELSjVmR", "BoosterController");
    "use strict";
    var _userState = _interopRequireDefault(require("../userState"));
    var _boosters = _interopRequireDefault(require("../staticData/boosters"));
    var _constants = _interopRequireDefault(require("../constants"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var ITEM_SIZE = 160;
    var ITEM_SPACING = 30;
    var ITEM_FIRST_POSITION = [ 0, 20 ];
    var MAX_BOOSTER_SELECTION = _constants["default"].MAX_BOOSTER_SELECTION;
    var EMPTY_METHOD = function EMPTY_METHOD() {};
    cc.Class({
      extends: cc.Component,
      properties: {
        BoosterItem: {
          default: null,
          type: cc.Prefab
        }
      },
      onLoad: function onLoad() {
        this.app = cc.find("app").getComponent("app");
        this.container = this.node.getChildByName("container");
        this.overlay = this.container.getChildByName("overlay");
        this.contentFrame = this.overlay.getChildByName("content");
        this.boostersFrame = this.contentFrame.getChildByName("boosters");
        var fx = this.contentFrame.getChildByName("effect");
        this.lightstar = fx.getChildByName("lightstar");
        this.starFx1 = fx.getChildByName("star1").getComponent(cc.ParticleSystem);
        this.starFx2 = fx.getChildByName("star2").getComponent(cc.ParticleSystem);
        this.overlay.zIndex = 1;
        this.overlay.active = false;
        this.isActive = false;
        this.selectingType = null;
        this.selectingTemporary = null;
        this.lockedUserInteraction = false;
        this.animating = false;
        this.starFx1.node.active = false;
        this.starFx2.node.active = false;
        this.selectedSubcolor = "basic1";
        this.paintbrushFrame = this.boostersFrame.getChildByName("paintbrush");
        this.paintbrushFrame.getChildByName("basic1").on("click", this.onColorSelelected, this);
        this.paintbrushFrame.getChildByName("basic2").on("click", this.onColorSelelected, this);
        this.paintbrushFrame.getChildByName("basic3").on("click", this.onColorSelelected, this);
        this.paintbrushFrame.getChildByName("basic4").on("click", this.onColorSelelected, this);
        this.paintbrushFrame.getChildByName("basic5").on("click", this.onColorSelelected, this);
        this.selectedColorCursor = this.paintbrushFrame.getChildByName("selected");
        this.selectedColorCursor.position = this.paintbrushFrame.getChildByName(this.selectedSubcolor).position;
        this.tutorialBoosterItems = null;
        this.hasSetup = false;
      },
      getPaintbrushTargetType: function getPaintbrushTargetType() {
        return this.selectedSubcolor;
      },
      preAddTemporaryBoosters: function preAddTemporaryBoosters(type, catId, amount) {
        this.temporaryBoosters || (this.temporaryBoosters = {});
        this.temporaryBoosters[type] || (this.temporaryBoosters[type] = {
          amount: 0,
          type: "cat",
          catId: null
        });
        this.temporaryBoosters[type].amount += amount;
        this.temporaryBoosters[type].catId = catId;
        var temp = type;
        this.hasSetup && this.addBoosterAfterSetUp(temp);
      },
      addTutorialBoosters: function addTutorialBoosters(tutorialBoosters) {
        for (var key in tutorialBoosters) {
          this.temporaryBoosters || (this.temporaryBoosters = {});
          this.temporaryBoosters[key] = {
            amount: tutorialBoosters[key],
            type: "tutorial"
          };
        }
      },
      addBoosterAfterSetUp: function addBoosterAfterSetUp(key) {
        var currentBoosters = this.container.children;
        var boosterCount = currentBoosters.length;
        var firstPositionX = ITEM_FIRST_POSITION[0] - (boosterCount - 1) * (ITEM_SPACING + ITEM_SIZE) * .5;
        for (var index = 0; index < currentBoosters.length - 2; index++) {
          var booster = currentBoosters[index];
          var delay = .2 * (index + 1);
          cc.tween(booster).to(.35, {
            x: firstPositionX + (ITEM_SPACING + ITEM_SIZE) * (index + 2)
          }, {
            easing: "sineOut"
          }).delay(delay).start();
        }
        var tutorialBooster = currentBoosters[currentBoosters.length - 2];
        cc.tween(tutorialBooster).to(.35, {
          x: firstPositionX + (ITEM_SPACING + ITEM_SIZE)
        }, {
          easing: "sineOut"
        }).delay(.2).start();
        var boosterItem = {};
        var type = key;
        var number = this.temporaryBoosters[key].amount;
        var catId = this.temporaryBoosters[key].catId;
        var isTemporary = true;
        boosterItem = cc.instantiate(this.BoosterItem).getComponent("BoosterItem");
        this.tempItems[type] = boosterItem;
        boosterItem.node.parent = this.container;
        boosterItem.node.x = -512;
        boosterItem.node.y = ITEM_FIRST_POSITION[1] + .5 * this.node.height;
        boosterItem.node.scale = ITEM_SIZE / boosterItem.node.width;
        boosterItem.loadBooster({
          type: type,
          number: number,
          isTemporary: isTemporary,
          catId: catId
        }, this.onItemClicked.bind(this));
        cc.tween(boosterItem.node).to(.35, {
          x: firstPositionX
        }, {
          easing: "sineOut"
        }).start();
      },
      unlockBoosters: function unlockBoosters(unlockedBoosters) {
        var totalEquipedBooster = this.getTotaEquipedBooster();
        var totalNewBooster = Object.keys(unlockedBoosters).length;
        if (totalEquipedBooster + totalNewBooster > MAX_BOOSTER_SELECTION) {
          var booster = _userState["default"].getBoosters();
          var totalNeededSlot = totalEquipedBooster + totalNewBooster - MAX_BOOSTER_SELECTION;
          for (var key in booster) if (this.data[key].unlocked && this.data[key].selected) {
            this.data[key].selected = false;
            totalNeededSlot--;
            if (0 === totalNeededSlot) break;
          }
        }
        for (var _key in unlockedBoosters) {
          this.data[_key].selected = true;
          this.data[_key].unlocked = true;
          this.data[_key].amount = this.temporaryBoosters[_key].amount;
        }
        _userState["default"].saveBoostersState();
      },
      getTotaEquipedBooster: function getTotaEquipedBooster() {
        var counter = 0;
        for (var key in this.data) this.data[key].selected && counter++;
        return counter;
      },
      init: function init(opts) {
        this.gameBoard = opts.gameBoard;
        this.tutorialController = opts.tutorialController;
        this.isActive = false;
        this.temporaryBoosters || (this.temporaryBoosters = {});
        this.data = _userState["default"].getBoosters();
        this.tempItems = {};
        this.items = {};
        this.lockedUserInteraction = false;
        this.container = this.node.getChildByName("container");
        this.tutorialBoosterItems = {};
      },
      setUpItems: function setUpItems() {
        this.hasSetup = true;
        var numOfBooster = Object.keys(this.temporaryBoosters).length + MAX_BOOSTER_SELECTION;
        var firstPositionX = ITEM_FIRST_POSITION[0] - (numOfBooster - 1) * (ITEM_SPACING + ITEM_SIZE) * .5;
        var i = 0;
        for (var key in this.temporaryBoosters) {
          var boosterItem = {};
          var type = key;
          var number = this.temporaryBoosters[key].amount;
          var temporaryType = this.temporaryBoosters[key].type;
          var catId = this.temporaryBoosters[key].catId;
          var isTemporary = true;
          boosterItem = cc.instantiate(this.BoosterItem).getComponent("BoosterItem");
          this.tempItems[type] = boosterItem;
          boosterItem.node.parent = this.container;
          boosterItem.node.x = firstPositionX + (ITEM_SPACING + ITEM_SIZE) * i;
          boosterItem.node.y = ITEM_FIRST_POSITION[1] + .5 * this.node.height;
          boosterItem.node.scale = ITEM_SIZE / boosterItem.node.width;
          boosterItem.loadBooster({
            type: type,
            number: number,
            isTemporary: isTemporary,
            catId: catId
          }, this.onItemClicked.bind(this));
          i++;
          "tutorial" === temporaryType && (this.tutorialBoosterItems[key] = boosterItem);
        }
        var boostersAdded = 0;
        for (var _type in _boosters["default"]) if (this.data[_type] && this.data[_type].selected) {
          var _boosterItem = {};
          var _number = this.data[_type].amount;
          _boosterItem = cc.instantiate(this.BoosterItem).getComponent("BoosterItem");
          this.items[_type] = _boosterItem;
          _boosterItem.node.parent = this.container;
          _boosterItem.node.x = firstPositionX + (ITEM_SPACING + ITEM_SIZE) * i;
          _boosterItem.node.y = ITEM_FIRST_POSITION[1] + .5 * this.node.height;
          _boosterItem.node.scale = ITEM_SIZE / _boosterItem.node.width;
          _boosterItem.loadBooster({
            type: _type,
            number: _number
          }, this.onItemClicked.bind(this));
          i++;
          boostersAdded++;
        }
        var totalUnlockedSlot = this.getTotalUnlockedSlot();
        if (boostersAdded < totalUnlockedSlot) {
          var totalEmptySlot = totalUnlockedSlot - boostersAdded;
          for (var k = boostersAdded; k < boostersAdded + totalEmptySlot; k++) {
            var _boosterItem2 = cc.instantiate(this.BoosterItem).getComponent("BoosterItem");
            _boosterItem2.node.parent = this.container;
            _boosterItem2.node.x = firstPositionX + (ITEM_SPACING + ITEM_SIZE) * i;
            _boosterItem2.node.y = ITEM_FIRST_POSITION[1] + .5 * this.node.height;
            _boosterItem2.node.scale = ITEM_SIZE / _boosterItem2.node.width;
            _boosterItem2.setEmpty();
            i++;
          }
          boostersAdded += totalEmptySlot;
        }
        for (var j = boostersAdded; j < MAX_BOOSTER_SELECTION; j++) {
          var _boosterItem3 = cc.instantiate(this.BoosterItem).getComponent("BoosterItem");
          _boosterItem3.node.parent = this.container;
          _boosterItem3.node.x = firstPositionX + (ITEM_SPACING + ITEM_SIZE) * i;
          _boosterItem3.node.y = ITEM_FIRST_POSITION[1] + .5 * this.node.height;
          _boosterItem3.node.scale = ITEM_SIZE / _boosterItem3.node.width;
          _boosterItem3.setLocked();
          i++;
        }
      },
      getTotalUnlockedSlot: function getTotalUnlockedSlot() {
        var counter = 0;
        for (var key in this.data) {
          this.data[key].unlocked && counter++;
          if (counter >= MAX_BOOSTER_SELECTION) break;
        }
        return counter;
      },
      update: function update(dt) {
        if (this.lightstar && this.app) {
          this.lightstar.angle += 20 * dt;
          this.lightstar.scale = .9 + .05 * Math.sin(this.app.now / 1e3 * 4);
        }
      },
      onItemClicked: function onItemClicked(type, isTemporary) {
        if (this.animating) return;
        if (this.lockedUserInteraction) return;
        if (!this.tutorialController.validateBooster(type)) return;
        if (this.isActive) {
          this.cancelBoosterMode();
          return;
        }
        if (!this.gameBoard.isIdle) return;
        if (!isTemporary && 0 === this.data[type].amount) return;
        if (isTemporary && 0 === this.temporaryBoosters[type].amount) return;
        if (!this.tutorialController.stepUp("booster")) return;
        this.enterBoosterMode(type, isTemporary);
      },
      onCancelButtonClicked: function onCancelButtonClicked() {
        this.cancelBoosterMode();
      },
      onColorSelelected: function onColorSelelected(e) {
        if (!this.tutorialController.validatePaintbrush(e.node.name)) return;
        if (!this.tutorialController.stepUp("paintbrush")) return;
        this.selectedSubcolor = e.node.name;
        this.selectedColorCursor.position = this.paintbrushFrame.getChildByName(this.selectedSubcolor).position;
        this.tutorialController.triggerTutorial();
      },
      lockUserInteraction: function lockUserInteraction() {
        this.lockedUserInteraction = true;
        this.cancelBoosterMode();
      },
      unlockUserInteraction: function unlockUserInteraction() {
        this.lockedUserInteraction = false;
      },
      enterBoosterMode: function enterBoosterMode(type, isTemporary) {
        var _this = this;
        this.isActive = true;
        this.selectingType = type;
        this.selectingTemporary = isTemporary;
        this.gameBoard.enterBoosterMode(type, isTemporary);
        var items = isTemporary ? this.tempItems : this.items;
        items[type].node.zIndex = 2;
        items[type].setSelected(true);
        this.boostersFrame.children.forEach(function(boosterFrame) {
          boosterFrame.active = boosterFrame.name === type;
        });
        this.starFx1.resetSystem();
        this.starFx2.resetSystem();
        this.animating = true;
        this.overlay.active = true;
        this.overlay.opacity = 0;
        cc.tween(this.overlay).to(.3, {
          opacity: 255
        }, {
          easing: "quadOut"
        }).call(function() {
          _this.starFx1.resetSystem();
          _this.starFx2.resetSystem();
          _this.starFx1.node.active = true;
          _this.starFx2.node.active = true;
          _this.animating = false;
          _this.tutorialController.triggerTutorial();
        }).start();
      },
      exitBoosterMode: function exitBoosterMode(isBoosterActivated, type, isTemporary) {
        var _this2 = this;
        if (!this.isActive) return;
        this.isActive = false;
        var items = isTemporary ? this.tempItems : this.items;
        var selectingItems = this.selectingTemporary ? this.tempItems : this.items;
        this.selectingType && (selectingItems[this.selectingType].node.zIndex = 0);
        this.selectingType && selectingItems[this.selectingType].setSelected(false);
        this.selectingType = null;
        this.selectingTemporary = null;
        this.overlay.active = false;
        isBoosterActivated && this.reduceType(type, isTemporary);
        this.starFx1.node.active = false;
        this.starFx2.node.active = false;
        this.animating = true;
        this.overlay.active = true;
        this.overlay.opacity = 255;
        cc.tween(this.overlay).to(.3, {
          opacity: 0
        }, {
          easing: "quadOut"
        }).call(function() {
          _this2.overlay.active = false;
          _this2.animating = false;
        }).start();
      },
      cancelBoosterMode: function cancelBoosterMode() {
        this.exitBoosterMode(false);
        this.gameBoard.cancelBoosterMode();
      },
      reduceType: function reduceType(type, isTemporary) {
        if (isTemporary) {
          this.temporaryBoosters[type].amount = Math.max(this.temporaryBoosters[type].amount - 1, 0);
          this.tempItems[type].updateNumber(this.temporaryBoosters[type].amount);
        } else {
          this.data[type].amount = Math.max(this.data[type].amount - 1, 0);
          _userState["default"].saveBoostersState();
          this.items[type].updateNumber(this.data[type].amount);
        }
      }
    });
    cc._RF.pop();
  }, {
    "../constants": "constants",
    "../staticData/boosters": "boosters",
    "../userState": "userState"
  } ],
  BoosterItem: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9f92beGPJNOEZqDiRsEd+7l", "BoosterItem");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        airplane: {
          default: null,
          type: cc.SpriteFrame
        },
        fairystick: {
          default: null,
          type: cc.SpriteFrame
        },
        hammer: {
          default: null,
          type: cc.SpriteFrame
        },
        paintbrush: {
          default: null,
          type: cc.SpriteFrame
        },
        rocket: {
          default: null,
          type: cc.SpriteFrame
        },
        wheel: {
          default: null,
          type: cc.SpriteFrame
        },
        bella: {
          default: null,
          type: cc.SpriteFrame
        },
        bob: {
          default: null,
          type: cc.SpriteFrame
        },
        dora: {
          default: null,
          type: cc.SpriteFrame
        },
        leo: {
          default: null,
          type: cc.SpriteFrame
        },
        lily: {
          default: null,
          type: cc.SpriteFrame
        },
        luna: {
          default: null,
          type: cc.SpriteFrame
        },
        max: {
          default: null,
          type: cc.SpriteFrame
        },
        milo: {
          default: null,
          type: cc.SpriteFrame
        }
      },
      onLoad: function onLoad() {
        this.frame = this.node.getChildByName("frame");
        this.frameSelected = this.node.getChildByName("frame_selected");
        this.icon = this.node.getChildByName("icon").getComponent(cc.Sprite);
        this.tempCat = this.node.getChildByName("tempCat").getComponent(cc.Sprite);
        this.numberLabel = this.node.getChildByName("number").getComponent(cc.Label);
        this.redPoint = this.node.getChildByName("redpoint");
        this.lockIcon = this.node.getChildByName("lockIcon");
        this.frameSelected.active = false;
        this.node.on("click", this.onClicked, this);
      },
      loadBooster: function loadBooster(data, onItemClicked) {
        void 0 === onItemClicked && (onItemClicked = null);
        this.onItemClicked = onItemClicked;
        this.type = data.type;
        this.icon.spriteFrame = this[data.type];
        this.numberLabel.string = data.number || 0;
        this.isTemporary = data.isTemporary || false;
        this.icon.node.active = true;
        this.redPoint.active = true;
        this.numberLabel.node.active = true;
        this.lockIcon.active = false;
        this.tempCat.node.active = this.isTemporary;
        this.isTemporary && (this.tempCat.spriteFrame = this[data.catId]);
      },
      setLocked: function setLocked() {
        this.icon.node.active = false;
        this.redPoint.active = false;
        this.numberLabel.node.active = false;
        this.lockIcon.active = true;
        this.tempCat.node.active = false;
      },
      setEmpty: function setEmpty() {
        this.icon.node.active = false;
        this.redPoint.active = false;
        this.numberLabel.node.active = false;
        this.lockIcon.active = false;
        this.tempCat.node.active = false;
      },
      setSelected: function setSelected(selected) {
        this.frame.active = !selected;
        this.frameSelected.active = selected;
      },
      updateNumber: function updateNumber(number) {
        this.numberLabel.string = 0 | number;
      },
      onClicked: function onClicked() {
        this.onItemClicked && this.onItemClicked(this.type, this.isTemporary);
      }
    });
    cc._RF.pop();
  }, {} ],
  BoosterUnlockPopup: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "30c91XzeXJHy6eeV+GMe0gV", "BoosterUnlockPopup");
    "use strict";
    var _boosters = _interopRequireDefault(require("../staticData/boosters"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: cc.Component,
      properties: {
        airplane: {
          default: null,
          type: cc.SpriteFrame
        },
        fairystick: {
          default: null,
          type: cc.SpriteFrame
        },
        hammer: {
          default: null,
          type: cc.SpriteFrame
        },
        paintbrush: {
          default: null,
          type: cc.SpriteFrame
        },
        rocket: {
          default: null,
          type: cc.SpriteFrame
        },
        wheel: {
          default: null,
          type: cc.SpriteFrame
        }
      },
      onLoad: function onLoad() {
        this.app = cc.find("app").getComponent("app");
        this.content = this.node.getChildByName("content");
        this.popup = this.content.getChildByName("popup");
        this.frame = this.popup.getChildByName("frame");
        this.okButton = this.frame.getChildByName("okButton");
        this.innerFrame = this.frame.getChildByName("innerFrame");
        this.giftFrame = this.innerFrame.getChildByName("giftFrame");
        this.lightMask = this.giftFrame.getChildByName("lightMask");
        this.light = this.lightMask.getChildByName("light");
        this.okButton.on("click", this.onCloseClicked, this);
        this.node.active = false;
      },
      update: function update(dt) {
        this.light.angle += 20 * dt;
        this.light.scale = 3.5 + .05 * Math.sin(this.app.now / 1e3 * 4);
      },
      show: function show(boosterUnlockInfo) {
        var _boosterConfig$booste, _boosterConfig$booste2, _this = this;
        this.backer = this.node.getChildByName("backer");
        this.content = this.node.getChildByName("content");
        this.popup = this.content.getChildByName("popup");
        this.frame = this.popup.getChildByName("frame");
        this.innerFrame = this.frame.getChildByName("innerFrame");
        this.nameLabel = this.innerFrame.getChildByName("label").getComponent(cc.Label);
        this.numberLabel = this.innerFrame.getChildByName("number").getComponent(cc.Label);
        this.giftFrame = this.innerFrame.getChildByName("giftFrame");
        this.lightMask = this.giftFrame.getChildByName("lightMask");
        this.gift = this.lightMask.getChildByName("gift").getComponent(cc.Sprite);
        this.descFrame = this.innerFrame.getChildByName("descFrame");
        this.skillLabel = this.descFrame.getChildByName("label").getComponent(cc.Label);
        this.node.active = true;
        this.animating = true;
        this.gift.spriteFrame = this[boosterUnlockInfo.id];
        this.nameLabel.string = null == (_boosterConfig$booste = _boosters["default"][boosterUnlockInfo.id]) ? void 0 : _boosterConfig$booste.name;
        this.skillLabel.string = null == (_boosterConfig$booste2 = _boosters["default"][boosterUnlockInfo.id]) ? void 0 : _boosterConfig$booste2.description;
        this.numberLabel.string = "x" + boosterUnlockInfo.amount;
        var POPUP_DURATION = .6;
        this.backer.opacity = 0;
        cc.tween(this.backer).to(.3, {
          opacity: 200
        }, {
          easing: "quadOut"
        }).start();
        this.popup.active = true;
        this.popup.scale = 0;
        this.popup.opacity = 0;
        cc.tween(this.popup).to(POPUP_DURATION, {
          scale: 1,
          opacity: 255
        }, {
          easing: "backOut"
        }).start();
        this.gift.node.scale = 0;
        cc.tween(this.gift.node).to(POPUP_DURATION, {
          scale: 2
        }, {
          easing: "backOut"
        }).start();
        setTimeout(function() {
          _this.animating = false;
        }, 1e3 * POPUP_DURATION);
      },
      hide: function hide() {
        var _this2 = this;
        this.animating = true;
        var POPUP_DURATION = .3;
        cc.tween(this.backer).to(POPUP_DURATION, {
          opacity: 0
        }, {
          easing: "quadOut"
        }).start();
        cc.tween(this.popup).delay(.1).to(POPUP_DURATION, {
          scale: 0,
          opacity: 0
        }, {
          easing: "sineOut"
        }).call(function() {
          _this2.animating = false;
          _this2.node.active = false;
          _this2.popup.active = false;
          _this2.onClose && _this2.onClose();
        }).start();
      },
      updateScreenSize: function updateScreenSize(frame, uiScale) {
        this.content = this.node.getChildByName("content");
        this.content.scale = uiScale;
        this.content.y = -100 * uiScale;
      },
      onCloseClicked: function onCloseClicked() {
        this.app.audioManager.playSfx("click");
        !this.animating && this.hide();
      }
    });
    cc._RF.pop();
  }, {
    "../staticData/boosters": "boosters"
  } ],
  BottomUIButton: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f724adbdLVFYYWo/SCy2BYs", "BottomUIButton");
    "use strict";
    var ANIMATION_DURATION = .3;
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        this.animating = false;
      },
      setSelected: function setSelected(selected, animate) {
        void 0 === animate && (animate = false);
        this.selectedBacker = this.node.getChildByName("choosebg");
        this.selectedIconBacker = this.node.getChildByName("choose-iconBg");
        this.normalIconBacker = this.node.getChildByName("iconBg");
        this.icon = this.node.getChildByName("icon");
        this.label = this.node.getChildByName("label");
        if (animate) {
          this.animating = true;
          if (selected) {
            this.selectedBacker.active = true;
            this.selectedIconBacker.active = true;
            this.label.active = true;
            cc.tween(this.selectedBacker).to(ANIMATION_DURATION, {
              opacity: 255
            }, {
              easing: "quadOut"
            }).start();
            cc.tween(this.selectedIconBacker).to(ANIMATION_DURATION, {
              opacity: 255,
              y: 50
            }, {
              easing: "quadOut"
            }).start();
            cc.tween(this.normalIconBacker).to(.5 * ANIMATION_DURATION, {
              opacity: 0,
              y: 52
            }, {
              easing: "quadOut"
            }).call(this.normalIconBacker.active = false).start();
            cc.tween(this.label).to(ANIMATION_DURATION, {
              opacity: 255,
              y: -56
            }, {
              easing: "quadOut"
            }).start();
            cc.tween(this.icon).to(ANIMATION_DURATION, {
              scale: 1,
              y: 56
            }, {
              easing: "quadOut"
            }).call(this.animating = false).start();
          } else {
            this.normalIconBacker.active = true;
            cc.tween(this.selectedBacker).to(ANIMATION_DURATION, {
              opacity: 0
            }, {
              easing: "quadOut"
            }).call(this.selectedBacker.active = false).start();
            cc.tween(this.selectedIconBacker).to(ANIMATION_DURATION, {
              opacity: 0,
              y: 0
            }, {
              easing: "quadOut"
            }).call(this.selectedIconBacker.active = false).start();
            cc.tween(this.normalIconBacker).to(ANIMATION_DURATION, {
              opacity: 255,
              y: 0
            }, {
              easing: "quadOut"
            }).start();
            cc.tween(this.label).to(ANIMATION_DURATION, {
              opacity: 0,
              y: -106
            }, {
              easing: "quadOut"
            }).call(this.label.active = false).start();
            cc.tween(this.icon).to(ANIMATION_DURATION, {
              scale: .9,
              y: -4
            }, {
              easing: "quadOut"
            }).call(this.animating = false).start();
          }
        } else {
          this.selectedBacker.active = selected;
          this.selectedIconBacker.active = selected;
          this.normalIconBacker.active = !selected;
          this.label.active = selected;
          this.selectedBacker.opacity = selected ? 255 : 0;
          this.selectedIconBacker.y = selected ? 50 : 0;
          this.selectedIconBacker.opacity = selected ? 255 : 0;
          this.normalIconBacker.opacity = selected ? 0 : 255;
          this.normalIconBacker.y = selected ? 52 : 0;
          this.label.opacity = selected ? 255 : 0;
          this.label.y = selected ? -56 : -106;
          this.icon.y = selected ? 56 : -4;
          this.icon.scale = selected ? 1 : .9;
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  BottomUI: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "5d81bVhjMFBDJtD02dDq0ze", "BottomUI");
    "use strict";
    var ANIMATION_DURATION = .3;
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        this.app = cc.find("app").getComponent("app");
        this.homeButton = this.node.getChildByName("HomeButton").getComponent("BottomUIButton");
        this.shopButton = this.node.getChildByName("ShopButton").getComponent("BottomUIButton");
        this.catButton = this.node.getChildByName("CatButton").getComponent("BottomUIButton");
        this.bagButton = this.node.getChildByName("BagButton").getComponent("BottomUIButton");
        this.settingsButton = this.node.getChildByName("SettingsButton").getComponent("BottomUIButton");
        this.locker = this.node.getChildByName("locker");
        this.homeButton.node.on("click", this.onButtonClicked, this);
        this.shopButton.node.on("click", this.onButtonClicked, this);
        this.catButton.node.on("click", this.onButtonClicked, this);
        this.bagButton.node.on("click", this.onButtonClicked, this);
        this.settingsButton.node.on("click", this.onButtonClicked, this);
        this.buttonMap = {
          home: this.homeButton,
          shop: this.shopButton,
          cat: this.catButton,
          bag: this.bagButton,
          settings: this.settingsButton
        };
        this.selectedId = false;
        this.homeButton.setSelected(false);
        this.shopButton.setSelected(false);
        this.catButton.setSelected(false);
        this.bagButton.setSelected(false);
        this.settingsButton.setSelected(false);
        this.audioManager = cc.find("AudioManager").getComponent("AudioManager");
      },
      onEnable: function onEnable() {
        this.locker.active = this.app.catTutorial.getCurrentStep() < 4;
      },
      onButtonClicked: function onButtonClicked(event) {
        if (this.isButtonAnimating()) return;
        this.audioManager.playSfx("click");
        var id = null;
        for (var key in this.buttonMap) if (this.buttonMap[key].node === event.node) {
          id = key;
          break;
        }
        id && this.selectedId !== id && this.node.emit("buttonClicked", id);
      },
      selectButton: function selectButton(id, animate) {
        void 0 === animate && (animate = false);
        var currentButton = this.buttonMap[this.selectedId];
        var targetButton = this.buttonMap[id];
        this.selectedId && currentButton.setSelected(false, animate);
        targetButton.setSelected(true, animate);
        this.selectedId = id;
      },
      isButtonAnimating: function isButtonAnimating() {
        return this.homeButton.animating || this.shopButton.animating || this.catButton.animating || this.bagButton.animating || this.settingsButton.animating;
      },
      show: function show(animate) {
        var _this = this;
        void 0 === animate && (animate = false);
        this.node.active = true;
        if (animate) {
          this.animating = true;
          cc.tween(this.node).to(ANIMATION_DURATION, {
            opacity: 255
          }, {
            easing: "quadOut"
          }).call(function() {
            _this.animating = false;
          }).start();
        } else this.node.opacity = 255;
      },
      hide: function hide(animate) {
        var _this2 = this;
        void 0 === animate && (animate = false);
        if (animate) {
          this.animating = true;
          cc.tween(this.node).to(ANIMATION_DURATION, {
            opacity: 0
          }, {
            easing: "quadOut"
          }).call(function() {
            _this2.node.active = false;
            _this2.animating = false;
          }).start();
        } else {
          this.node.active = false;
          this.node.opacity = 0;
        }
      },
      updateScreenSize: function updateScreenSize(frame, uiScale) {
        this.node.scale = uiScale;
        var botUIbacker = this.node.getChildByName("backer");
        botUIbacker.width = this.node.width / uiScale * Math.max(1, frame.ratio);
      }
    });
    cc._RF.pop();
  }, {} ],
  ButtonState: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2431eVm1bdPiJ4+Yd4rQq5a", "ButtonState");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        button: cc.Button,
        element: [ cc.Sprite ],
        enabledSprite: [ cc.SpriteFrame ],
        disableSprite: [ cc.SpriteFrame ]
      },
      setState: function setState(isEnable) {
        for (var index = 0; index < this.element.length; index++) {
          var element = this.element[index];
          element.spriteFrame = isEnable ? this.enabledSprite[index] : this.disableSprite[index];
        }
        this.button.interactable = isEnable;
      }
    });
    cc._RF.pop();
  }, {} ],
  CatAlert: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "18314rtsn1MQYkLBD8lHAqi", "CatAlert");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        text: {
          default: null,
          type: cc.Label
        }
      },
      show: function show(msg) {
        var _this = this;
        this.text.string = msg;
        this.node.active = true;
        this.node.opacity = 0;
        if (this.animating) {
          var _this$_tweenHandle;
          this.node.opacity = 0;
          null == (_this$_tweenHandle = this._tweenHandle) ? void 0 : _this$_tweenHandle.stop();
        }
        this.animating = true;
        this._tweenHandle = cc.tween(this.node).to(.4, {
          opacity: 255
        }, {
          easing: "quadOut"
        }).delay(1).to(.3, {
          opacity: 0
        }, {
          easing: "sineOut"
        }).call(function() {
          _this.animating = false;
          _this.node.active = false;
          _this._tweenHandle = false;
        }).start();
      },
      updateScreenSize: function updateScreenSize(frame, uiScale) {
        this.node.scale = uiScale;
      }
    });
    cc._RF.pop();
  }, {} ],
  CatCommands: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "724e2Ntk2BA9b92owQ+pVr/", "CatCommands");
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var _userState = _interopRequireDefault(require("../userState"));
    var _catModels = _interopRequireDefault(require("../models/catModels"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    function feed(catId, number) {
      var cat = _catModels["default"].getCat(catId);
      var fishes = _userState["default"].getFish();
      var addableNumber = Math.min(fishes, number, cat.config.feedablePerDay - cat.data.dailyFed, cat.intimacyCap - cat.data.fishFed);
      var result = {
        cat: cat,
        dailyFeedChanged: false,
        intimacyChanged: false
      };
      if (!addableNumber) return result;
      var prevLevel = cat.getIntimacyLevel();
      result.dailyFeedChanged = true;
      cat.data.dailyFed += addableNumber;
      cat.data.fishFed += addableNumber;
      _userState["default"].updateFish(-addableNumber);
      _userState["default"].saveCats();
      var level = cat.getIntimacyLevel();
      result.intimacyChanged = level !== prevLevel;
      return result;
    }
    var _default = {
      feed: feed
    };
    exports["default"] = _default;
    module.exports = exports["default"];
    cc._RF.pop();
  }, {
    "../models/catModels": "catModels",
    "../userState": "userState"
  } ],
  CatDialog: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "dd1b0TZL+pNwLl/inAlQUUv", "CatDialog");
    "use strict";
    var DEFAULT_TEXT_FRAME_HEIGHT = 160;
    var TEXT_FRAME_PER_LINE = 42;
    cc.Class({
      extends: cc.Component,
      properties: {
        Diaglog: cc.Node,
        DiaglogText: cc.Label,
        FocusTarget: cc.Node,
        InteractiveArea: cc.Node,
        TextFrame: cc.Node
      },
      onLoad: function onLoad() {
        this.Diaglog.active = false;
        this.Diaglog.opacity = 0;
      },
      show: function show(text, offsetY, onTouchCb, enableFocusLayer) {
        var _this = this;
        void 0 === offsetY && (offsetY = 0);
        this.resizeContent(text);
        this.InteractiveArea.active = !!onTouchCb;
        this.onTouchCb = onTouchCb;
        this.hide(function() {
          _this.Diaglog.y = 0 + offsetY;
          _this.DiaglogText.string = text;
          _this.Diaglog.active = true;
          _this.FocusTarget.active = !!enableFocusLayer;
          cc.tween(_this.Diaglog).to(.45, {
            opacity: 255
          }, {
            easing: "quadOut"
          }).start();
        });
      },
      hide: function hide(cb) {
        var _this2 = this;
        cc.tween(this.Diaglog).to(.2, {
          opacity: 0
        }, {
          easing: "quadOut"
        }).call(function() {
          _this2.Diaglog.active = false;
          _this2.FocusTarget.active = false;
          cb && cb();
        }).start();
      },
      resizeContent: function resizeContent(text) {
        var totalLine = text.split(/\r\n|\r|\n/).length;
        this.TextFrame.height = Math.max(DEFAULT_TEXT_FRAME_HEIGHT, DEFAULT_TEXT_FRAME_HEIGHT + (totalLine - 1) * TEXT_FRAME_PER_LINE);
      },
      updateScreenSize: function updateScreenSize(frame, uiScale) {
        this.node.scale = uiScale;
      },
      onTouchArea: function onTouchArea() {
        this.InteractiveArea.active = false;
        this.onTouchCb && this.onTouchCb();
      }
    });
    cc._RF.pop();
  }, {} ],
  CatItem: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "73eebhOTUhA8bG8m3daRema", "CatItem");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        normalBacker: {
          default: null,
          type: cc.SpriteFrame
        },
        lockedBacker: {
          default: null,
          type: cc.SpriteFrame
        },
        thumbnail_bella: {
          default: null,
          type: cc.SpriteFrame
        },
        thumbnail_bob: {
          default: null,
          type: cc.SpriteFrame
        },
        thumbnail_dora: {
          default: null,
          type: cc.SpriteFrame
        },
        thumbnail_leo: {
          default: null,
          type: cc.SpriteFrame
        },
        thumbnail_lily: {
          default: null,
          type: cc.SpriteFrame
        },
        thumbnail_luna: {
          default: null,
          type: cc.SpriteFrame
        },
        thumbnail_max: {
          default: null,
          type: cc.SpriteFrame
        },
        thumbnail_milo: {
          default: null,
          type: cc.SpriteFrame
        },
        thumbnail_locked: {
          default: null,
          type: cc.SpriteFrame
        },
        normalColor: {
          default: cc.Color.WHITE,
          type: cc.Color
        },
        lockedColor: {
          default: cc.Color.WHITE,
          type: cc.Color
        }
      },
      loadItem: function loadItem(cat, onClicked) {
        void 0 === onClicked && (onClicked = null);
        this.onClickCb = onClicked;
        this.cat = cat;
        var unlocked = cat.data.unlocked;
        var level = cat.getIntimacyLevel();
        var backer = this.node.getComponent(cc.Sprite);
        var nameLabel = this.node.getChildByName("nameLabel").getComponent(cc.Label);
        var catImage = this.node.getChildByName("catImage").getComponent(cc.Sprite);
        backer.spriteFrame = unlocked ? this.normalBacker : this.lockedBacker;
        nameLabel.string = cat.config.name;
        nameLabel.node.color = unlocked ? this.normalColor : this.lockedColor;
        catImage.spriteFrame = unlocked ? this["thumbnail_" + cat.id] : this.thumbnail_locked;
        for (var i = 1; i <= 3; i++) {
          var currentLevelBar = this.node.getChildByName("intimacyBar_" + i);
          currentLevelBar.active = i <= level && unlocked;
        }
        unlocked && this.node.on("click", this.onClicked, this);
      },
      onClicked: function onClicked() {
        this.onClickCb && this.onClickCb(this.cat);
      }
    });
    cc._RF.pop();
  }, {} ],
  CatSubscene: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2c554SOoSBPrrxCAZVTgPLw", "CatSubscene");
    "use strict";
    var _catModels = _interopRequireDefault(require("../../models/catModels"));
    var _cats = _interopRequireDefault(require("../../staticData/cats"));
    var _userState = _interopRequireDefault(require("../../userState"));
    var _CircleProgress = _interopRequireDefault(require("../CircleProgress"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: cc.Component,
      properties: {
        yardItemView: {
          default: null,
          type: cc.Prefab
        },
        material_greyOut: {
          default: null,
          type: cc.Material
        },
        giftprogress: [ _CircleProgress["default"] ]
      },
      onLoad: function onLoad() {
        this.app = cc.find("app").getComponent("app");
        this.subsceneController = cc.find("Canvas").getComponent("SubsceneController");
        var popup = this.node.getChildByName("popup");
        var frame = popup.getChildByName("frame");
        var innerFrame = frame.getChildByName("innerFrame");
        this.catContainer = innerFrame.getChildByName("catContainer");
        this.detailFrame = this.node.getChildByName("detailFrame");
        var backIcon = this.detailFrame.getChildByName("backIcon");
        backIcon.on("click", this.hideDetail, this);
        this.app.catRefreshRequest = true;
      },
      onEnable: function onEnable() {
        this.detailFrame.active = false;
        if (this.app.catRefreshRequest) {
          this.refreshCatItems();
          this.app.catRefreshRequest = false;
        }
        this.updateCatPool();
      },
      updateCatPool: function updateCatPool() {
        var allCatNames = Object.keys(_cats["default"]);
        var userCat = _userState["default"].getCats();
        this.catPool = allCatNames.filter(function(cat) {
          return userCat[cat].unlocked;
        });
      },
      refreshCatItems: function refreshCatItems() {
        var _this = this;
        _catModels["default"].getAllCats().forEach(function(cat) {
          var catItem = _this.catContainer.getChildByName("CatItem_" + cat.id).getComponent("CatItem");
          if (!catItem) return;
          catItem.loadItem(cat, _this.showDetail.bind(_this));
        });
      },
      updateScreenSize: function updateScreenSize(frame, uiScale) {
        this.uiScale = uiScale;
        this.frame = frame;
        var wallpaper = this.node.getChildByName("wallpaper");
        var originScale = 1024 / 1940;
        wallpaper.scale = Math.max(originScale / frame.ratio, .7);
        var popup = this.node.getChildByName("popup");
        popup.scale = Math.min(1.15 * uiScale, 1.1);
        popup.y = 64 * popup.scale;
        var detailFrame = this.node.getChildByName("detailFrame");
        var backIcon = detailFrame.getChildByName("backIcon");
        var name = detailFrame.getChildByName("name");
        var intimacyFrame = detailFrame.getChildByName("intimacyFrame");
        var skillFrame = detailFrame.getChildByName("skillFrame");
        var favoriteFrame = detailFrame.getChildByName("favoriteFrame");
        var catTiltleBg = detailFrame.getChildByName("catTiltleBg");
        var friendShipFrame = detailFrame.getChildByName("friendshipFrame");
        backIcon.scale = uiScale;
        backIcon.x = .5 * this.node.width - 100 * uiScale;
        backIcon.y = .5 * this.node.height - 100 * uiScale;
        name.scale = uiScale;
        name.y = .5 * this.node.height - 100 * uiScale;
        intimacyFrame.scale = uiScale;
        intimacyFrame.y = name.y - .5 * name.height * name.scale - (.5 * intimacyFrame.height * intimacyFrame.scale + 20 * uiScale);
        friendShipFrame.scale = uiScale;
        friendShipFrame.y = intimacyFrame.y - .5 * intimacyFrame.height * intimacyFrame.scale - (.5 * friendShipFrame.height * friendShipFrame.scale + 130 * uiScale);
        skillFrame.scale = uiScale;
        skillFrame.y = friendShipFrame.y - .5 * friendShipFrame.height * friendShipFrame.scale - (.5 * skillFrame.height * skillFrame.scale + 130 * uiScale);
        favoriteFrame.scale = uiScale;
        favoriteFrame.y = skillFrame.y - .5 * skillFrame.height * skillFrame.scale - (.5 * favoriteFrame.height * favoriteFrame.scale + 130 * uiScale);
        catTiltleBg.scale = uiScale;
      },
      showDetail: function showDetail(cat) {
        this.curDetailCatId = cat.id;
        this.app.audioManager.playSfx("click");
        this.detailFrame.active = true;
        this.updateScreenSize(this.frame, this.uiScale);
        var backIcon = this.detailFrame.getChildByName("backIcon");
        var nameLabel = this.detailFrame.getChildByName("name").getComponent(cc.Label);
        var intimacyFrame = this.detailFrame.getChildByName("intimacyFrame");
        var catImageFrame = intimacyFrame.getChildByName("catImageFrame");
        var catView = catImageFrame.getChildByName("cat").getComponent("CatView");
        var numberLabel = catImageFrame.getChildByName("number").getComponent(cc.Label);
        var intimacyProgressBar = intimacyFrame.getChildByName("progressBar").getComponent(cc.ProgressBar);
        var gift1 = intimacyProgressBar.node.getChildByName("gift1");
        var gift2 = intimacyProgressBar.node.getChildByName("gift2");
        var skillFrame = this.detailFrame.getChildByName("skillFrame");
        var skillLabel = skillFrame.getChildByName("label").getComponent(cc.Label);
        var favoriteFrame = this.detailFrame.getChildByName("favoriteFrame");
        var favoriteContainer = favoriteFrame.getChildByName("container");
        var catTiltleBg = this.detailFrame.getChildByName("catTiltleBg");
        nameLabel.string = cat.config.name;
        numberLabel.string = String(cat.number).padStart(2, "0");
        skillLabel.string = cat.getCurrentSkillDesc();
        intimacyProgressBar.progress = Math.round(cat.data.fishFed / cat.intimacyCap * 10) / 10;
        gift1.x = .5 * -intimacyProgressBar.node.width + intimacyProgressBar.node.width * (cat.config.feedLevels[1] / cat.intimacyCap);
        gift2.x = .5 * -intimacyProgressBar.node.width + intimacyProgressBar.node.width * (cat.config.feedLevels[2] / cat.intimacyCap);
        catView.loadCat(cat.id);
        var feedLevels = cat.config.feedLevels;
        var giftIndex = 0;
        for (var level in feedLevels) {
          var feedAmountReq = feedLevels[level];
          if (cat.data.fishFed < feedAmountReq) break;
          giftIndex++;
        }
        for (var index = 0; index < this.giftprogress.length; index++) {
          var giftCircleProgress = this.giftprogress[index];
          var lastGiftFeedingAmount = giftIndex > 0 ? ~~feedLevels[index] : 0;
          if (index <= giftIndex) giftCircleProgress.setProgress(Math.min(cat.data.fishFed, ~~feedLevels[index + 1]) - lastGiftFeedingAmount, feedLevels[index + 1] - lastGiftFeedingAmount); else {
            giftCircleProgress.setValueLabel(0, feedLevels[index + 1] - feedLevels[index]);
            giftCircleProgress.setDisable();
          }
        }
        favoriteContainer.children.forEach(function(favorite) {
          favorite.destroy();
        });
        var MAX_ITEMS_PER_LINE = 4;
        var lines = cat.favorites.length > MAX_ITEMS_PER_LINE ? 2 : 1;
        favoriteFrame.height = 2 === lines ? 380 : 240;
        favoriteContainer.height = favoriteFrame.height - 50;
        favoriteFrame.y = skillFrame.y - .5 * skillFrame.height * skillFrame.scale - (.5 * favoriteFrame.height * favoriteFrame.scale + 130 * this.uiScale);
        catTiltleBg.y = favoriteFrame.y + .5 * favoriteFrame.height * favoriteFrame.scale + 32;
        var itemWidth = favoriteContainer.width / Math.min(cat.favorites.length, MAX_ITEMS_PER_LINE);
        var itemHeight = favoriteContainer.height / Math.ceil(cat.favorites.length / MAX_ITEMS_PER_LINE);
        var itemSize = Math.min(itemWidth, itemHeight);
        for (var i = 0; i < cat.favorites.length; i++) {
          var favoriteItem = cc.instantiate(this.yardItemView).getComponent("YardItemView");
          favoriteContainer.addChild(favoriteItem.node);
          favoriteItem.loadItem(cat.favorites[i]);
          var currentLine = Math.floor(i / MAX_ITEMS_PER_LINE);
          var numItemOfCurrentLine = Math.min(cat.favorites.length - MAX_ITEMS_PER_LINE * currentLine, MAX_ITEMS_PER_LINE);
          favoriteItem.node.x = -numItemOfCurrentLine * itemSize * .5 + .5 * itemSize + i % MAX_ITEMS_PER_LINE * itemSize;
          favoriteItem.node.y = itemSize * lines * .5 - .5 * itemSize - currentLine * itemSize;
          var ratio = Math.max(Math.max(favoriteItem.node.width, favoriteItem.node.height) / itemSize, 1);
          favoriteItem.node.width /= ratio;
          favoriteItem.node.height /= ratio;
          cat.lockedFavorites.includes(cat.favorites[i]) && favoriteItem.node.getComponent(cc.Sprite).setMaterial(0, this.material_greyOut);
        }
      },
      hideDetail: function hideDetail() {
        this.app.audioManager.playSfx("click");
        this.detailFrame.active = false;
      },
      onNextCat: function onNextCat() {
        var curIndex = Math.max(0, this.catPool.indexOf(this.curDetailCatId));
        var nextIndex = (curIndex + 1) % this.catPool.length;
        var catName = this.catPool[nextIndex];
        this.showDetail(_catModels["default"].getCat(catName));
      },
      onPreviousCat: function onPreviousCat() {
        var curIndex = Math.max(0, this.catPool.indexOf(this.curDetailCatId));
        var prevIndex = curIndex - 1 >= 0 ? curIndex - 1 : this.catPool.length - 1;
        var catName = this.catPool[prevIndex];
        this.showDetail(_catModels["default"].getCat(catName));
      }
    });
    cc._RF.pop();
  }, {
    "../../models/catModels": "catModels",
    "../../staticData/cats": "cats",
    "../../userState": "userState",
    "../CircleProgress": "CircleProgress"
  } ],
  CatTutorial: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "22d00iyNw5BVqfVU8/olgiy", "CatTutorial");
    "use strict";
    var _userState = _interopRequireDefault(require("../userState"));
    var _catTutorial = _interopRequireDefault(require("../staticData/catTutorial"));
    var _levelModel = _interopRequireDefault(require("../models/levelModel"));
    var _constants = _interopRequireDefault(require("../constants"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        this.app = cc.find("app").getComponent("app");
        this.actionIndex = -1;
        var tutorialSteps = Object.keys(_catTutorial["default"]);
        this.maxStep = ~~tutorialSteps[tutorialSteps.length - 1];
      },
      triggerStep: function triggerStep(stepIndex) {
        if (this.hasCompleted()) return false;
        if (this.getCurrentStep() >= stepIndex) return false;
        if (stepIndex - this.getCurrentStep() > 1) return false;
        this.showStep(stepIndex);
        return true;
      },
      completeStep: function completeStep(stepIndex) {
        this.isInProgress = false;
        this.actionIndex = -1;
        _userState["default"].getStates().tutorial.cat.step = stepIndex;
        _userState["default"].saveStates();
      },
      showStep: function showStep(step) {
        this.curStep = step;
        this.config = null;
        switch (step) {
         case 1:
          this.triggerTutorial_1();
          break;

         case 3:
          this.triggerTutorial_3();
          break;

         case 4:
          this.triggerTutorial_4();
          break;

         case 5:
          this.triggerTutorial_5();
          break;

         case 6:
          this.triggerTutorial_6();
        }
      },
      triggerTutorial_1: function triggerTutorial_1() {
        var _this = this;
        if (2 !== _levelModel["default"].getLevel(_userState["default"].getProgression()).levelNumber) return;
        var config = _catTutorial["default"][1];
        var scaleContainer = cc.find("Canvas").getChildByName("scaleContainer");
        var subscenes = scaleContainer.getChildByName("Subscenes");
        var topUI = scaleContainer.getChildByName("TopUI").getComponent("TopUI");
        var bottomUI = scaleContainer.getChildByName("BotUI").getComponent("BottomUI");
        var homeSubSceneControler = subscenes.getChildByName("HomeSubscene").getComponent("HomeSubscene");
        var catDialog = scaleContainer.getChildByName("catDialog").getComponent("CatDialog");
        var yardData = _userState["default"].getYard();
        yardData["rubberBallRed"].x = 6;
        yardData["rubberBallRed"].y = 2;
        _userState["default"].saveYard();
        homeSubSceneControler.yardView.loadItems();
        var cellInfo = homeSubSceneControler.yardView.wireFrameCells[2][6];
        var yardItem = cellInfo.occupiedBy;
        this.config = config;
        this.isInProgress = true;
        this["action1"] = function() {
          _this.actionIndex = 1;
          topUI.locker.active = true;
          bottomUI.locker.active = true;
          setTimeout(function() {
            return homeSubSceneControler.startButton.node.active = false;
          }, 0);
          homeSubSceneControler.saveButton.node.active = false;
          homeSubSceneControler.homeButton.node.active = false;
          homeSubSceneControler.bagButton.node.active = false;
          homeSubSceneControler.yardView.dim.active = true;
          homeSubSceneControler.yardView.hasLockDraging = true;
          _this.nextAction = _this["action2"];
          homeSubSceneControler.yardView.startTutorialAnim(-500, function() {
            yardItem.paw.active = true;
            catDialog.show(config.catDialog[0]);
          });
        };
        this["action2"] = function() {
          _this.actionIndex = 2;
          yardItem.deletebutton.node.active = false;
          homeSubSceneControler.yardView.dim.active = false;
          homeSubSceneControler.yardView.pawTutorial.active = true;
          catDialog.show(config.catDialog[1], 200);
          yardItem.paw.active = false;
          _this.nextAction = _this["action3"];
        };
        this["action3"] = function() {
          _this.actionIndex = 3;
          homeSubSceneControler.yardView.pawTutorial.active = false;
          homeSubSceneControler.saveButton.node.active = true;
          homeSubSceneControler.arrowTutorial.active = true;
          catDialog.show(config.catDialog[2], 150);
          _this.nextAction = _this["action4"];
        };
        this["action4"] = function() {
          _this.actionIndex = 4;
          homeSubSceneControler.startButton.node.active = true;
          homeSubSceneControler.arrowTutorial.active = false;
          homeSubSceneControler.pawTutorial.active = true;
          homeSubSceneControler.yardView.pawTutorial.active = false;
          catDialog.show(config.catDialog[3], -400);
          _this.nextAction = _this["action5"];
          _this.app.audioManager.playSfx("click");
        };
        this["action5"] = function() {
          _this.actionIndex = 5;
          _this.completeStep(1);
        };
        this["action1"]();
      },
      triggerTutorial_3: function triggerTutorial_3() {
        var _this2 = this;
        var config = _catTutorial["default"][3];
        var scaleContainer = cc.find("Canvas").getChildByName("scaleContainer");
        var rewardPopup = scaleContainer.getChildByName("rewardPopup").getComponent("RewardPopup");
        var home = cc.find("Canvas").getComponent("Home");
        var topUI = scaleContainer.getChildByName("TopUI").getComponent("TopUI");
        var bottomUI = scaleContainer.getChildByName("BotUI").getComponent("BottomUI");
        var subscenes = scaleContainer.getChildByName("Subscenes");
        var homeSubSceneControler = subscenes.getChildByName("HomeSubscene").getComponent("HomeSubscene");
        this.config = config;
        this.isInProgress = true;
        this["action1"] = function() {
          _this2.actionIndex = 1;
          topUI.locker.active = true;
          bottomUI.locker.active = true;
          homeSubSceneControler.yardView.hasLockDraging = true;
          rewardPopup.show("fish", "x" + _constants["default"].FIRST_FISH_REWARD_AMOUNT, function() {
            home.topUI.updateLabels(), _this2.completeStep(3);
            homeSubSceneControler.yardView.hasLockDraging = false;
            _this2.showStep(4);
          });
        };
        this["action1"]();
      },
      triggerTutorial_4: function triggerTutorial_4() {
        var _this3 = this;
        var config = _catTutorial["default"][4];
        var scaleContainer = cc.find("Canvas").getChildByName("scaleContainer");
        var subscenes = scaleContainer.getChildByName("Subscenes");
        var topUI = scaleContainer.getChildByName("TopUI").getComponent("TopUI");
        var bottomUI = scaleContainer.getChildByName("BotUI").getComponent("BottomUI");
        var focusShopLayer = bottomUI.node.getChildByName("focusShopLayer");
        var focusCatLayer = bottomUI.node.getChildByName("focusCatLayer");
        var home = cc.find("Canvas").getComponent("Home");
        var homeSubSceneControler = subscenes.getChildByName("HomeSubscene").getComponent("HomeSubscene");
        var catDialog = scaleContainer.getChildByName("catDialog").getComponent("CatDialog");
        var cellInfo = homeSubSceneControler.yardView.wireFrameCells[1][4];
        var yardItem = cellInfo.occupiedBy;
        this.config = config;
        this.isInProgress = true;
        this["action4"] = function() {
          _this3.actionIndex = 4;
          _this3.nextAction = null;
          _this3.app.audioManager.playSfx("click");
          focusShopLayer.active = true;
          catDialog.show(config.catDialog[3], -500, function() {
            topUI.locker.active = false;
            bottomUI.locker.active = false;
            focusShopLayer.active = false;
            homeSubSceneControler.startButton.node.active = true;
            homeSubSceneControler.yardView.hasLockDraging = false;
            catDialog.hide();
            _this3.completeStep(4);
          });
        };
        this["action3"] = function() {
          _this3.actionIndex = 3;
          _this3.nextAction = _this3["action4"];
          _this3.app.audioManager.playSfx("click");
          focusCatLayer.active = true;
          homeSubSceneControler.yardView.dim.active = false;
          catDialog.show(config.catDialog[2], -500, function() {
            _this3.moveNextAction();
            focusCatLayer.active = false;
          });
        };
        this["action2"] = function() {
          _this3.actionIndex = 2;
          yardItem.deletebutton.node.active = false;
          yardItem.paw.active = false;
          _this3.nextAction = _this3["action3"];
          _this3.app.audioManager.playSfx("click");
          catDialog.show(config.catDialog[1], -600, function() {
            _this3.moveNextAction();
          });
        };
        this["action1"] = function() {
          _this3.actionIndex = 1;
          topUI.locker.active = true;
          bottomUI.locker.active = true;
          yardItem.deletebutton.node.active = false;
          homeSubSceneControler.yardView.dim.active = true;
          homeSubSceneControler.yardView.hasLockDraging = true;
          yardItem.paw.active = false;
          yardItem.setCat("bella");
          yardItem.refreshFeedingInfo();
          _userState["default"].getStates().fish = _constants["default"].FIRST_FISH_REWARD_AMOUNT;
          _userState["default"].getCats()["bella"].fishFed = 0;
          _userState["default"].saveCats();
          _userState["default"].saveStates();
          home.topUI.updateLabels(), _this3.nextAction = _this3["action2"];
          _this3.app.audioManager.playSfx("click");
          setTimeout(function() {
            return homeSubSceneControler.startButton.node.active = false;
          }, 0);
          homeSubSceneControler.yardView.startTutorialAnim(-500, function() {
            yardItem.paw.active = true;
            catDialog.show(config.catDialog[0], -600);
          });
        };
        this["action1"]();
      },
      triggerTutorial_5: function triggerTutorial_5() {
        var _this4 = this;
        var config = _catTutorial["default"][5];
        var scaleContainer = cc.find("Canvas").getChildByName("scaleContainer");
        var selectionPopup = scaleContainer.getChildByName("SelectionPopup").getComponent("StartSelectionPopup");
        this.config = config;
        this.isInProgress = true;
        this["action1"] = function() {
          _this4.actionIndex = 1;
          selectionPopup.catDialog.show(config.catDialog[0], 300, function() {
            selectionPopup.catDialog.hide();
            _this4.completeStep(5);
            _this4.app.audioManager.playSfx("click");
            selectionPopup.onCatChangeClicked();
          }, true);
        };
        this["action1"]();
      },
      triggerTutorial_6: function triggerTutorial_6() {
        var _this5 = this;
        var config = _catTutorial["default"][6];
        if (_levelModel["default"].getLevel(_userState["default"].getProgression()).levelNumber !== config.unlockedLevel) return;
        var scaleContainer = cc.find("Canvas").getChildByName("scaleContainer");
        var subscenes = scaleContainer.getChildByName("Subscenes");
        var topUI = scaleContainer.getChildByName("TopUI").getComponent("TopUI");
        var bottomUI = scaleContainer.getChildByName("BotUI").getComponent("BottomUI");
        var homeSubSceneControler = subscenes.getChildByName("HomeSubscene").getComponent("HomeSubscene");
        var catDialog = scaleContainer.getChildByName("catDialog").getComponent("CatDialog");
        this.config = config;
        this.isInProgress = true;
        var yardData = _userState["default"].getYard();
        yardData["pot"].playingCat = "milo";
        homeSubSceneControler.yardView.loadItems();
        var firstItemXpos = yardData["pot"].x;
        var firstItemYpos = yardData["pot"].y;
        var firstCellInfo = homeSubSceneControler.yardView.wireFrameCells[firstItemYpos][firstItemXpos].occupiedBy;
        _userState["default"].getStates().fish = _constants["default"].FIRST_FISH_REWARD_AMOUNT;
        _userState["default"].getCats()["milo"].fishFed = 0;
        _userState["default"].saveCats();
        _userState["default"].saveStates();
        this["action2"] = function() {
          _this5.actionIndex = 2;
          _this5.app.audioManager.playSfx("click");
          var showCatDialog = function showCatDialog(catDialogPos) {
            catDialog.show(config.catDialog[1], catDialogPos, function() {
              _this5.completeStep(6);
              firstCellInfo.node.active = true;
              topUI.locker.active = false;
              bottomUI.locker.active = false;
              homeSubSceneControler.yardView.dim.active = false;
              homeSubSceneControler.yardView.hasLockDraging = false;
              homeSubSceneControler.startButton.node.active = true;
              catDialog.hide();
            });
          };
          if (yardData["rubberBallRed"]) {
            var secondItemXpos = yardData["rubberBallRed"].x;
            var secondItemYpos = yardData["rubberBallRed"].y;
            var secondCellInfo = homeSubSceneControler.yardView.wireFrameCells[secondItemYpos][secondItemXpos].occupiedBy;
            var catDialogPos = 3 === yardData["rubberBallRed"].y ? 200 : -700;
            firstCellInfo.node.active = false;
            secondCellInfo.setYardIdle();
            homeSubSceneControler.yardView.moveToItem(secondItemXpos, function() {
              return showCatDialog(catDialogPos);
            });
          } else showCatDialog(-700);
        };
        this["action1"] = function() {
          _this5.actionIndex = 1;
          topUI.locker.active = true;
          bottomUI.locker.active = true;
          homeSubSceneControler.yardView.dim.active = true;
          homeSubSceneControler.yardView.hasLockDraging = true;
          setTimeout(function() {
            return homeSubSceneControler.startButton.node.active = false;
          }, 0);
          _this5.nextAction = _this5["action2"];
          var catDialogPos = 3 === yardData["pot"].y ? 200 : -700;
          homeSubSceneControler.yardView.moveToItem(firstItemXpos, function() {
            catDialog.show(config.catDialog[0], catDialogPos, function() {
              catDialog.hide();
              _this5.moveNextAction();
            });
          });
        };
        this["action1"]();
      },
      onPlayNextLevel: function onPlayNextLevel() {
        1 === this.curStep && 4 === this.actionIndex && this.moveNextAction();
      },
      onSaveYard: function onSaveYard() {
        1 === this.curStep && 3 === this.actionIndex && this.moveNextAction();
      },
      onFeedCat: function onFeedCat() {
        4 === this.curStep && this.moveNextAction();
      },
      moveNextAction: function moveNextAction() {
        this.nextAction && this.nextAction();
      },
      hasCompleted: function hasCompleted() {
        return this.getCurrentStep() >= this.maxStep;
      },
      getCurrentStep: function getCurrentStep() {
        return _userState["default"].getStates().tutorial.cat.step;
      },
      getYardItemPosition: function getYardItemPosition() {
        return {
          rubberBallRed: {
            x: 6,
            y: 2
          },
          pot: {
            x: 11,
            y: 1
          }
        };
      },
      getTutorialLevel: function getTutorialLevel() {
        return [ 2, 3, 6 ];
      },
      needLockYard: function needLockYard() {
        if (!this.isInProgress) return false;
        return !!this.config.needLockYard;
      }
    });
    cc._RF.pop();
  }, {
    "../constants": "constants",
    "../models/levelModel": "levelModel",
    "../staticData/catTutorial": "catTutorial",
    "../userState": "userState"
  } ],
  CatView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "5c9e1L16tlFoY74Ty0CinZy", "CatView");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        bella: {
          default: null,
          type: cc.SpriteFrame
        },
        bob: {
          default: null,
          type: cc.SpriteFrame
        },
        dora: {
          default: null,
          type: cc.SpriteFrame
        },
        leo: {
          default: null,
          type: cc.SpriteFrame
        },
        lily: {
          default: null,
          type: cc.SpriteFrame
        },
        luna: {
          default: null,
          type: cc.SpriteFrame
        },
        max: {
          default: null,
          type: cc.SpriteFrame
        },
        milo: {
          default: null,
          type: cc.SpriteFrame
        }
      },
      loadCat: function loadCat(cat) {
        this.node.getComponent(cc.Sprite).spriteFrame = this[cat] || null;
      }
    });
    cc._RF.pop();
  }, {} ],
  CircleProgress: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "782fa8hotpEDpKpLRftjs9K", "CircleProgress");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        label: cc.Label,
        progressBar: cc.ProgressBar,
        idicator: cc.Node,
        lbCurValue: cc.Label
      },
      setProgress: function setProgress(currentValue, maxValue) {
        var percent = currentValue / maxValue;
        this.setValueLabel(currentValue, maxValue);
        this.progressBar.progress = percent;
        this.idicator.angle = -180 * percent / .5;
        this.idicator.active = percent < 1;
        this.node.opacity = 255;
      },
      setValueLabel: function setValueLabel(curValue, totalValue) {
        this.lbCurValue.string = curValue + "/" + totalValue;
      },
      setDisable: function setDisable() {
        this.idicator.active = false;
        this.node.opacity = 100;
        this.progressBar.progress = 0;
      }
    });
    cc._RF.pop();
  }, {} ],
  ConfirmationController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "eb639vxdeZL+LoDGmNo9NYm", "ConfirmationController");
    "use strict";
    var POPUP_DURATION = .4;
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        this.backer = this.node.getChildByName("backer");
        this.popup = this.node.getChildByName("popup");
        this.text = this.popup.getChildByName("text").getComponent(cc.Label);
        this.yesButton = this.popup.getChildByName("yesButton").getComponent(cc.Button);
        this.noButton = this.popup.getChildByName("noButton").getComponent(cc.Button);
        this.animating = false;
        this.audioManager = cc.find("AudioManager").getComponent("AudioManager");
        this.yesButton.node.on("click", this.onYesButtonClicked, this);
        this.noButton.node.on("click", this.onNoButtonClicked, this);
        this.hide();
      },
      hide: function hide(animate) {
        var _this = this;
        void 0 === animate && (animate = false);
        return new Promise(function(resolve) {
          if (!animate) {
            _this.node.active = false;
            resolve();
            return;
          }
          _this.animating = true;
          _this.popup.scale = 1;
          _this.popup.opacity = 255;
          _this.backer.opacity = 200;
          cc.tween(_this.backer).to(.3, {
            opacity: 0
          }, {
            easing: "sineOut"
          }).start();
          cc.tween(_this.popup).to(POPUP_DURATION, {
            scale: 0,
            opacity: 0
          }, {
            easing: "sineOut"
          }).call(function() {
            _this.animating = false;
            _this.node.active = false;
            resolve();
          }).start();
        });
      },
      show: function show(text, callback, animate) {
        var _this2 = this;
        void 0 === animate && (animate = false);
        this.text.string = text;
        this.callback = callback;
        return new Promise(function(resolve) {
          _this2.node.active = true;
          if (!animate) {
            resolve();
            return;
          }
          _this2.animating = true;
          _this2.popup.scale = 0;
          _this2.popup.opacity = 0;
          _this2.backer.opacity = 0;
          cc.tween(_this2.backer).to(.3, {
            opacity: 200
          }, {
            easing: "quadOut"
          }).start();
          _this2.popup.scale = 0;
          _this2.popup.opacity = 0;
          cc.tween(_this2.popup).to(POPUP_DURATION, {
            scale: 1,
            opacity: 255
          }, {
            easing: "quadOut"
          }).call(function() {
            _this2.animating = false;
          }).start();
        });
      },
      updateScreenSize: function updateScreenSize() {
        var parent = this.node.parent;
        this.node.width = parent.width;
        this.node.height = parent.height;
        var backer = this.node.getChildByName("backer");
        backer.height = this.node.height;
      },
      onYesButtonClicked: function onYesButtonClicked() {
        var _this3 = this;
        this.audioManager.playSfx("click");
        this.animating || this.hide(true).then(function() {
          return _this3.callback && _this3.callback();
        });
      },
      onNoButtonClicked: function onNoButtonClicked() {
        this.audioManager.playSfx("click");
        this.animating || this.hide(true);
      }
    });
    cc._RF.pop();
  }, {} ],
  Debugger: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ee21a3k8GhHzbMAz/l30mL6", "Debugger");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {},
      start: function start() {}
    });
    cc._RF.pop();
  }, {} ],
  EndGamePopup: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "125e2XR7tdH7Jev5ROTpEMZ", "EndGamePopup");
    "use strict";
    var _userState = _interopRequireDefault(require("../userState"));
    var _helpers = _interopRequireDefault(require("../helpers"));
    var _constants = _interopRequireDefault(require("../constants"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: cc.Component,
      properties: {
        Popup: {
          default: null,
          type: cc.Node
        }
      },
      onLoad: function onLoad() {
        this.app = cc.find("app").getComponent("app");
      },
      show: function show() {
        this.node.active = true;
        this.Popup.active = true;
        this.Popup.scale = 0;
        this.Popup.opacity = 0;
        cc.tween(this.Popup).to(.6, {
          scale: 1,
          opacity: 255
        }, {
          easing: "backOut"
        }).start();
      },
      hide: function hide() {
        var _this = this;
        cc.tween(this.Popup).to(.4, {
          scale: 0,
          opacity: 0
        }, {
          easing: "sineOut"
        }).call(function() {
          _this.node.active = false;
          _this.Popup.active = false;
        }).start();
      },
      onClose: function onClose() {
        this.app.audioManager.playSfx("click");
        this.hide();
      }
    });
    cc._RF.pop();
  }, {
    "../constants": "constants",
    "../helpers": "helpers",
    "../userState": "userState"
  } ],
  GameBoard: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "85de1ItBUxA9JPr2s2uGZBY", "GameBoard");
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var _bumper = _interopRequireDefault(require("./GameItem/bumper.js"));
    var _cabinet = _interopRequireDefault(require("./GameItem/cabinet.js"));
    var _constants = _interopRequireDefault(require("../constants.js"));
    var _GameItem = _interopRequireDefault(require("./GameItem/GameItem.js"));
    var _helpers = _interopRequireDefault(require("../helpers.js"));
    var _Rnd = _interopRequireDefault(require("./Rnd.js"));
    var _simpleCrate = _interopRequireDefault(require("./GameItem/simpleCrate.js"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    function _createForOfIteratorHelperLoose(o, allowArrayLike) {
      var it;
      if ("undefined" === typeof Symbol || null == o[Symbol.iterator]) {
        if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && "number" === typeof o.length) {
          it && (o = it);
          var i = 0;
          return function() {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          };
        }
        throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }
      it = o[Symbol.iterator]();
      return it.next.bind(it);
    }
    function _unsupportedIterableToArray(o, minLen) {
      if (!o) return;
      if ("string" === typeof o) return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      "Object" === n && o.constructor && (n = o.constructor.name);
      if ("Map" === n || "Set" === n) return Array.from(o);
      if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }
    function _arrayLikeToArray(arr, len) {
      (null == len || len > arr.length) && (len = arr.length);
      for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
      return arr2;
    }
    function _extends() {
      _extends = Object.assign || function(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];
          for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
      };
      return _extends.apply(this, arguments);
    }
    var _constants$GAMEPLAY = _constants["default"].GAMEPLAY, TILE_SIZE = _constants$GAMEPLAY.TILE_SIZE, ITEM_SIZE = _constants$GAMEPLAY.ITEM_SIZE, ITEM_SCALE = _constants$GAMEPLAY.ITEM_SCALE, BOOSTER_SCALE = _constants$GAMEPLAY.BOOSTER_SCALE, GRAVITY = _constants$GAMEPLAY.GRAVITY, LOGIC_UPDATE_INTERVAL = _constants$GAMEPLAY.LOGIC_UPDATE_INTERVAL, Z_INDEX = _constants$GAMEPLAY.Z_INDEX, GROUP_TYPE_PRIORITY = _constants$GAMEPLAY.GROUP_TYPE_PRIORITY, GROUP_TYPE_POWERUP = _constants$GAMEPLAY.GROUP_TYPE_POWERUP, BOMB_EXPLOSION_DURATION = _constants$GAMEPLAY.BOMB_EXPLOSION_DURATION, BOMB_RADIUS = _constants$GAMEPLAY.BOMB_RADIUS, MISSILE_VELOCITY = _constants$GAMEPLAY.MISSILE_VELOCITY, BOOSTER_PROJECTILE_VELOCITY = _constants$GAMEPLAY.BOOSTER_PROJECTILE_VELOCITY, DISCOBALL_DELAY_BETWEEN_ITEMS = _constants$GAMEPLAY.DISCOBALL_DELAY_BETWEEN_ITEMS, SNIPER_SPEED = _constants$GAMEPLAY.SNIPER_SPEED, SNIPER_ROTATION_SPEED = _constants$GAMEPLAY.SNIPER_ROTATION_SPEED, SNIPER_EXPLOSION_DURATION = _constants$GAMEPLAY.SNIPER_EXPLOSION_DURATION, SNIPER_TAKE_OFF_DURATION = _constants$GAMEPLAY.SNIPER_TAKE_OFF_DURATION, ITEM_TRANSFORM_DURATION = _constants$GAMEPLAY.ITEM_TRANSFORM_DURATION, ITEM_EXPLODE_DURATION = _constants$GAMEPLAY.ITEM_EXPLODE_DURATION, DYNAMIC_USER_INTERACTION = _constants$GAMEPLAY.DYNAMIC_USER_INTERACTION, NO_MOVE_DETECTION_DELAY = _constants$GAMEPLAY.NO_MOVE_DETECTION_DELAY, NO_MOVE_FIX_DURATION = _constants$GAMEPLAY.NO_MOVE_FIX_DURATION, SPINE_NAMES = _constants$GAMEPLAY.SPINE_NAMES, RAY_OF_LIGHT_SCALE = _constants$GAMEPLAY.RAY_OF_LIGHT_SCALE, HINT_DELAY = _constants$GAMEPLAY.HINT_DELAY;
    var AROUND = [ {
      x: -1,
      y: 0
    }, {
      x: 1,
      y: 0
    }, {
      x: 0,
      y: -1
    }, {
      x: 0,
      y: 1
    } ];
    var EMPTY_METHOD = function EMPTY_METHOD() {};
    function debugLog() {}
    var GameBoard = function() {
      function GameBoard(options) {
        var _this = this;
        var app = options.app;
        var pattern = _helpers["default"].deepCopy(options.pattern);
        var spawnPattern = _helpers["default"].deepCopy(options.spawnPattern);
        var underlayPattern = options.underlayPattern;
        var view = options.view;
        var GameTile = options.GameTile;
        var GameItem = options.GameItem;
        var GameItemSpawner = options.GameItemSpawner;
        var boosterController = options.boosterController;
        var tutorialController = options.tutorialController;
        var objectiveController = options.objectiveController;
        var spriteCollection = options.spriteCollection;
        var availablePowerUps = options.availablePowerUps;
        var onGameItemDestroy = options.onGameItemDestroy || EMPTY_METHOD;
        var onIdle = options.onIdle || EMPTY_METHOD;
        var onMoveTriggered = options.onMoveTriggered || EMPTY_METHOD;
        var onBoosterModeEnd = options.onBoosterModeEnd || EMPTY_METHOD;
        var onCombo = options.onCombo || EMPTY_METHOD;
        var onPowerUpSpawn = options.onPowerUpSpawn || EMPTY_METHOD;
        var onPowerUpTrigger = options.onPowerUpTrigger || EMPTY_METHOD;
        this.app = app;
        this.view = view;
        this.GameItem = GameItem;
        this.spriteCollection = spriteCollection;
        this.boosterController = boosterController;
        this.tutorialController = tutorialController;
        this.objectiveController = objectiveController;
        this.onGameItemDestroy = onGameItemDestroy;
        this.onIdle = onIdle;
        this.onMoveTriggered = onMoveTriggered;
        this.onBoosterModeEnd = onBoosterModeEnd;
        this.onCombo = onCombo;
        this.onPowerUpSpawn = onPowerUpSpawn;
        this.onPowerUpTrigger = onPowerUpTrigger;
        this.validatePattern(pattern, spawnPattern);
        this.rnd = new _Rnd["default"]();
        console.log("Rnd seed:", this.rnd.getSeed());
        this.width = pattern[0].length;
        this.height = pattern.length + 1;
        this.background = [];
        this.board = [];
        this.previous = [];
        this.next = [];
        this["final"] = [];
        this.spawnBlindSpot = [];
        this.spawners = [];
        this.underlay = [];
        this.isCascading = false;
        this.startCascadeRequest = false;
        this.checkMatchesRequest = false;
        this.updateSpawnBlindSpotRequest = false;
        this.checkRespawnRequest = false;
        this.movingSprites = [];
        this.explodingDiscoBalls = [];
        this.sniperTargets = {};
        this.borders = [];
        this.isBeingDestroyed = false;
        this.itemsWaitingForDisappear = 0;
        this.switchingCount = 0;
        this.isIdle = this.app.now;
        this.booster = null;
        this.isTemporaryBooster = null;
        this.lockedUserInteractionReasons = {};
        this.lockedUserInteraction = false;
        this.comboReport = {};
        this.groupTypePowerup = _extends({}, GROUP_TYPE_POWERUP);
        for (var groupType in this.groupTypePowerup) availablePowerUps[this.groupTypePowerup[groupType]] || delete this.groupTypePowerup[groupType];
        this.dragging = {
          gameItem: null,
          startX: null,
          startY: null
        };
        this.highlightTimer = 0;
        this.matchGroupUid = 0;
        this.isMoveAvailableNow = null;
        this.showHintCounter = 0;
        this.lastHints = null;
        for (var boardY = 0; boardY < this.height; boardY++) {
          this.previous[boardY] = [];
          this.next[boardY] = [];
          this["final"][boardY] = [];
          this.spawnBlindSpot[boardY] = [];
          for (var boardX = 0; boardX < this.width; boardX++) {
            this.previous[boardY][boardX] = null;
            this.next[boardY][boardX] = null;
            this["final"][boardY][boardX] = null;
            this.spawnBlindSpot[boardY][boardX] = null;
          }
        }
        for (var _boardY = 0; _boardY < this.height; _boardY++) {
          this.background[_boardY] = [];
          if (0 === _boardY) continue;
          for (var _boardX = 0; _boardX < this.width; _boardX++) {
            var gameTile = null;
            if (pattern[_boardY - 1][_boardX]) {
              gameTile = cc.instantiate(GameTile).getComponent("GameTile");
              gameTile.boardX = _boardX;
              gameTile.boardY = _boardY;
              gameTile.setBg((_boardY * this.width + _boardX) % 2);
              gameTile.node.x = this.boardXToViewX(_boardX);
              gameTile.node.y = this.boardYToViewY(_boardY);
              view.addChild(gameTile.node);
            }
            this.background[_boardY][_boardX] = gameTile;
          }
        }
        for (var _boardY2 = 0; _boardY2 < this.height; _boardY2++) {
          this.underlay[_boardY2] = [];
          if (0 === _boardY2) continue;
          for (var _boardX2 = 0; _boardX2 < this.width; _boardX2++) {
            var gameItem = null;
            var blueprint = underlayPattern && underlayPattern[_boardY2 - 1][_boardX2];
            blueprint && (gameItem = this.getNewGameItemFromBlueprint({
              blueprint: blueprint,
              view: view,
              boardX: _boardX2,
              boardY: _boardY2,
              x: this.background[_boardY2][_boardX2].node.x,
              y: this.background[_boardY2][_boardX2].node.y
            }));
            this.underlay[_boardY2][_boardX2] = gameItem;
          }
        }
        _GameItem["default"].preParsePattern(this, pattern);
        for (var _boardY3 = 0; _boardY3 < this.height; _boardY3++) {
          this.board[_boardY3] = [];
          if (0 === _boardY3) continue;
          for (var _boardX3 = 0; _boardX3 < this.width; _boardX3++) {
            var _gameItem = null;
            var _blueprint = pattern[_boardY3 - 1][_boardX3];
            _blueprint && (_gameItem = this.getNewGameItemFromBlueprint({
              blueprint: _blueprint,
              view: view,
              boardX: _boardX3,
              boardY: _boardY3,
              x: this.background[_boardY3][_boardX3].node.x,
              y: this.background[_boardY3][_boardX3].node.y
            }));
            this.board[_boardY3][_boardX3] = _gameItem;
          }
        }
        for (var _boardX4 = 0; _boardX4 < this.width; _boardX4++) {
          var spawnerBoardY = null;
          for (var _boardY4 = 1; _boardY4 < this.height; _boardY4++) if (this.background[_boardY4][_boardX4] && (0 === _boardY4 || !this.background[_boardY4 - 1][_boardX4])) {
            spawnerBoardY = _boardY4 - 1;
            break;
          }
          if (null === spawnerBoardY) {
            this.spawners.push(null);
            continue;
          }
          var spawner = cc.instantiate(GameItemSpawner);
          spawner.boardX = _boardX4;
          spawner.boardY = spawnerBoardY;
          spawner.x = 0;
          spawner.y = 0;
          spawner.anchorX = this.width / 2 - _boardX4;
          spawner.anchorY = -this.height / 2 + spawnerBoardY + .5;
          spawner.zIndex = Z_INDEX.ITEM;
          spawner.blueprint = spawnPattern[_boardX4];
          spawner.active = false;
          view.addChild(spawner);
          this.spawners.push(spawner);
        }
        var b = this.background;
        for (var x = 0; x <= this.width; x++) for (var y = 1; y <= this.height; y++) {
          var topLeft = !(y < 2 || x < 1 || !b[y - 1][x - 1]);
          var topRight = !(y < 2 || x >= this.width || !b[y - 1][x]);
          var bottomLeft = !(y >= this.height || x < 1 || !b[y][x - 1]);
          var bottomRight = !(y >= this.height || x >= this.width || !b[y][x]);
          var borderType = null;
          var angle = 0;
          if (!topLeft && !topRight && bottomLeft && bottomRight) borderType = 1; else if (!topLeft && topRight && !bottomLeft && bottomRight) {
            borderType = 1;
            angle = 90;
          } else if (topLeft && !topRight && bottomLeft && !bottomRight) {
            borderType = 1;
            angle = 270;
          } else if (topLeft && topRight && !bottomLeft && !bottomRight) {
            borderType = 1;
            angle = 180;
          } else if (topLeft || topRight || bottomLeft || !bottomRight) if (topLeft || topRight || !bottomLeft || bottomRight) if (!topLeft || topRight || bottomLeft || bottomRight) if (topLeft || !topRight || bottomLeft || bottomRight) {
            if (!topLeft && topRight && bottomLeft && bottomRight) borderType = 3; else if (topLeft && !topRight && bottomLeft && bottomRight) {
              borderType = 3;
              angle = 270;
            } else if (topLeft && topRight && !bottomLeft && bottomRight) {
              borderType = 3;
              angle = 90;
            } else if (topLeft && topRight && bottomLeft && !bottomRight) {
              borderType = 3;
              angle = 180;
            }
          } else {
            borderType = 2;
            angle = 90;
          } else {
            borderType = 2;
            angle = 180;
          } else {
            borderType = 2;
            angle = 270;
          } else borderType = 2;
          if (borderType) {
            var node = _helpers["default"].createSprite({
              spriteFrame: this.spriteCollection["border" + borderType],
              view: view,
              zIndex: Z_INDEX.BORDER,
              x: this.boardXToViewX(x) - TILE_SIZE / 2,
              y: this.boardYToViewY(y) + TILE_SIZE / 2,
              width: TILE_SIZE,
              height: TILE_SIZE,
              angle: angle
            });
            this.borders.push(node);
          }
        }
        this.updateSpawnBlindSpot(true);
        this.updateInterval = setInterval(function() {
          _this.updateSpawnBlindSpot();
          _this.checkRespawn();
          _this.processMatches();
          _this.startCascade();
          _this.updateIdleState();
        }, LOGIC_UPDATE_INTERVAL);
        this.app.IS_DEVELOPMENT && (globalThis.gameBoard = this);
      }
      var _proto = GameBoard.prototype;
      _proto.update = function update(dt) {
        if (this.isBeingDestroyed) return;
        this.isCascading && this.update_cascade(dt);
        this.movingSprites.length && this.updateMovingSprites(dt);
        this.highlightTimer += dt;
        if (this.dragging.gameItem) {
          this.spriteCollection.material_highlight.setProperty("hl_timer", this.highlightTimer);
          this.spriteCollection.material_spineHighlight.setProperty("hl_timer", this.highlightTimer);
        }
      };
      _proto.updateMovingSprites = function updateMovingSprites(dt) {
        var itemData;
        for (var i = this.movingSprites.length - 1; i >= 0; i--) {
          itemData = this.movingSprites[i];
          itemData.onTick(itemData, dt);
        }
      };
      _proto.updateIdleState = function updateIdleState() {
        var wasIdle = this.isIdle;
        if (this.itemsWaitingForDisappear) return this._notIdle();
        if (this.isCascading) return this._notIdle();
        if (this.switchingCount) return this._notIdle();
        if (this.checkRespawnRequest) return this._notIdle();
        if (this.startCascadeRequest) return this._notIdle();
        if (this.checkMatchesRequest) return this._notIdle();
        if (this.updateSpawnBlindSpotRequest) return this._notIdle();
        if (this.movingSprites.length) return this._notIdle();
        this.isIdle = wasIdle || this.app.now;
        if (wasIdle) {
          if (this.tutorialController.isTutorialShowing || this.lockedUserInteraction) {
            this.isIdle = this.app.now;
            return;
          }
          if (this.isMoveAvailableNow) {
            var _timeSinceIdle = this.app.now - wasIdle;
            var hintCounter = Math.floor(_timeSinceIdle / HINT_DELAY);
            if (hintCounter !== this.showHintCounter) {
              this.showHintCounter = hintCounter;
              var randomCouple = this.isMoveAvailableNow[Math.floor(Math.random() * this.isMoveAvailableNow.length)];
              this.lastHints = [];
              for (var i = 0; i < randomCouple.length; i++) {
                randomCouple[i].startHint();
                this.lastHints.push(randomCouple[i]);
              }
            }
          } else {
            var timeSinceIdle = this.app.now - wasIdle;
            if (timeSinceIdle > NO_MOVE_DETECTION_DELAY) {
              this.isMoveAvailableNow = this.isMoveAvailable();
              if (false === this.isMoveAvailableNow) {
                this.fixNoMoveAvailable();
                this.isMoveAvailableNow = true;
                this.isIdle = this.app.now;
              }
            }
          }
        } else this.onIdle();
      };
      _proto._notIdle = function _notIdle() {
        this.isIdle = false;
        this.isMoveAvailableNow = null;
        this.showHintCounter = 0;
        if (this.lastHints) {
          for (var i = 0; i < this.lastHints.length; i++) this.lastHints[i].stopHint();
          this.lastHints = null;
        }
      };
      _proto.processMatches = function processMatches() {
        if (!this.checkMatchesRequest) return;
        this.checkMatchesRequest = false;
        var _this$getMatchable = this.getMatchable(), matched = _this$getMatchable.matched, matchGroups = _this$getMatchable.matchGroups;
        if (!Object.keys(matched).length) return;
        for (var key in matchGroups) {
          var matchGroup = matchGroups[key];
          var groupType = matchGroup.groupType;
          var newPowerUp = this.groupTypePowerup[groupType];
          if (!matchGroup.gameItems.length) continue;
          var comboId = matchGroup.gameItems[0].uid;
          this.comboReportStart(comboId);
          for (var i = 0; i < matchGroup.gameItems.length; i++) {
            var gameItem = matchGroup.gameItems[i];
            var shouldSpawnPowerUp = gameItem.boardX === matchGroup.targetPosition.boardX && gameItem.boardY === matchGroup.targetPosition.boardY;
            var powerUp = shouldSpawnPowerUp ? newPowerUp : null;
            this.hitUnderlay(gameItem.boardX, gameItem.boardY, "match");
            this.hitGameItem(gameItem, {
              type: "match",
              uid: comboId
            }, newPowerUp ? matchGroup.targetPosition : null, powerUp);
            this.comboReportAdd(comboId, gameItem);
          }
          this.comboReportEnd(comboId, "match");
        }
      };
      _proto.hitGameItem = function hitGameItem(gameItem, reason, targetPosition, replaceWithPowerUpType) {
        var _this2 = this;
        this.dragging.gameItem === gameItem && this.resetDrag();
        if ("bomb" === gameItem.type) return this.triggerBomb(gameItem);
        if ("sniper" === gameItem.type) return this.triggerSniper(gameItem);
        if ("missiles1" === gameItem.type || "missiles2" === gameItem.type) return this.triggerMissile(gameItem);
        if ("discoball" === gameItem.type) return this.triggerDiscoball(gameItem);
        var x = gameItem.boardX;
        var y = gameItem.boardY;
        var powerUpItem = null;
        if (replaceWithPowerUpType) {
          powerUpItem = cc.instantiate(this.GameItem).getComponent("GameItem");
          this.view.addChild(powerUpItem.node);
          powerUpItem.init({
            app: this.app,
            onDestroyCb: this.onGameItemDestroy,
            type: replaceWithPowerUpType
          });
          powerUpItem.node.x = this.boardXToViewX(targetPosition.boardX);
          powerUpItem.node.y = this.boardYToViewY(targetPosition.boardY);
          powerUpItem.boardX = targetPosition.boardX;
          powerUpItem.boardY = targetPosition.boardY;
          this.onPowerUpSpawn(replaceWithPowerUpType);
        }
        if ("match" === reason.type || "discoball" === reason.subType) for (var i = 0; i < 4; i++) {
          var xi = x + AROUND[i].x;
          var yi = y + AROUND[i].y;
          if (!this.isValidCoordinate(xi, yi)) continue;
          var gi = this.board[yi][xi];
          if (!gi) continue;
          if (!gi.isSensitive) continue;
          if (!gi.isIdle()) continue;
          this.hitGameItem(gi, {
            type: "sensitive:" + gameItem.type,
            uid: reason.uid + "_" + i
          });
        }
        if (targetPosition) {
          var targetX = this.boardXToViewX(targetPosition.boardX);
          var targetY = this.boardYToViewY(targetPosition.boardY);
          if (powerUpItem) {
            this.itemsWaitingForDisappear++;
            return Promise.all([ gameItem.explodeForPowerUp(targetX, targetY), powerUpItem.spawnPowerUp().then(function() {
              _this2.board[y][x] = powerUpItem;
            }) ]).then(function() {
              _this2.itemsWaitingForDisappear--;
              _this2.gameItemDisappearanceFinished(gameItem);
            });
          }
          this.itemsWaitingForDisappear++;
          return gameItem.explodeForPowerUp(targetX, targetY).then(function() {
            _this2.itemsWaitingForDisappear--;
            _this2.board[y][x] = null;
            _this2.gameItemDisappearanceFinished(gameItem);
          });
        }
        this.itemsWaitingForDisappear++;
        var linkedGamesItemsCoords = null;
        if (gameItem.linkedGamesItems) {
          linkedGamesItemsCoords = [];
          for (var _iterator = _createForOfIteratorHelperLoose(gameItem.linkedGamesItems), _step; !(_step = _iterator()).done; ) {
            var _gi = _step.value;
            linkedGamesItemsCoords.push({
              gi: _gi,
              boardX: _gi.boardX,
              boardY: _gi.boardY
            });
          }
        }
        return gameItem.gotHit(reason).then(function() {
          _this2.itemsWaitingForDisappear--;
          if (0 === gameItem.lifePoints) {
            _this2.board[y][x] === gameItem ? _this2.board[y][x] = null : null !== _this2.board[y][x] && console.error(new Error("a game item is not in the board anymore when trying to remove it"));
            if (linkedGamesItemsCoords) {
              gameItem.linkedGamesItems = null;
              for (var _iterator2 = _createForOfIteratorHelperLoose(linkedGamesItemsCoords), _step2; !(_step2 = _iterator2()).done; ) {
                var ref = _step2.value;
                if (ref.gi === gameItem) continue;
                _this2.board[ref.boardY][ref.boardX] === ref.gi ? _this2.board[ref.boardY][ref.boardX] = null : null !== _this2.board[ref.boardY][ref.boardX] && console.error(new Error("a game item is not in the board anymore when trying to remove it"));
                ref.gi.linkedGamesItems = null;
              }
            }
            _this2.gameItemDisappearanceFinished(gameItem);
          }
        });
      };
      _proto.hitGameItemCoordinate = function hitGameItemCoordinate(gameItem, reason) {
        var boardX = gameItem.boardX, boardY = gameItem.boardY;
        var underlayItem = this.underlay[boardY][boardX];
        var overlayItem = this.board[boardY][boardX];
        underlayItem && underlayItem.isDying && (underlayItem = null);
        overlayItem && overlayItem.isDying && (overlayItem = null);
        if (!underlayItem && !overlayItem) return false;
        underlayItem && this.hitUnderlay(boardX, boardY, reason);
        overlayItem && this.hitGameItem(overlayItem, reason);
        return true;
      };
      _proto.hitUnderlay = function hitUnderlay(x, y, reason) {
        var _this3 = this;
        var gameItem = this.board[y][x];
        if (gameItem && gameItem.isBlockingCascade && !gameItem.isDying) return;
        var underlayItem = this.underlay[y][x];
        if (!underlayItem) return;
        if (underlayItem.isDying) return;
        this.itemsWaitingForDisappear++;
        underlayItem.gotHit(reason).then(function() {
          _this3.itemsWaitingForDisappear--;
          0 === underlayItem.lifePoints && (_this3.underlay[y][x] = null);
        });
      };
      _proto.gameItemDisappearanceFinished = function gameItemDisappearanceFinished(gameItem) {
        this.updateSpawnBlindSpotRequest = true;
        this.checkRespawnRequest = true;
        this.startCascadeRequest = true;
      };
      _proto.getMatchable = function getMatchable(replacementMap) {
        void 0 === replacementMap && (replacementMap = null);
        var matched = {};
        var matchGroups = {};
        var notStableEnoughItems = {};
        var candidates = [];
        var type = null;
        var x, y;
        for (y = 1; y < this.height; y++) {
          candidates.length = 0;
          type = null;
          for (x = 0; x <= this.width; x++) {
            var result = this._getMatchable(x, y, replacementMap, candidates, matchGroups, matched, type, notStableEnoughItems, "line");
            type = result.type;
          }
        }
        for (x = 0; x < this.width; x++) {
          candidates.length = 0;
          type = null;
          for (y = 1; y <= this.height; y++) {
            var _result = this._getMatchable(x, y, replacementMap, candidates, matchGroups, matched, type, notStableEnoughItems, "column");
            type = _result.type;
          }
        }
        if (this.groupTypePowerup.square) for (y = 1; y < this.height - 1; y++) for (x = 0; x < this.width - 1; x++) {
          candidates.length = 0;
          type = null;
          for (var subY = y; subY <= y + 1; subY++) for (var subX = x; subX <= x + 1; subX++) {
            var _result2 = this._getMatchable(subX, subY, replacementMap, candidates, matchGroups, matched, type, notStableEnoughItems, "square");
            type = _result2.type;
          }
          this._getMatchable(-1, -1, replacementMap, candidates, matchGroups, matched, type, notStableEnoughItems, "square");
        }
        var matchGroupsToDelete = {};
        for (var gameItemId in matched) notStableEnoughItems[gameItemId] && (matchGroupsToDelete[matched[gameItemId].matchGroupId] = true);
        for (var matchGroupId in matchGroupsToDelete) {
          for (var i = 0; i < matchGroups[matchGroupId].gameItems.length; i++) delete matched[matchGroups[matchGroupId].gameItems[i].uid];
          delete matchGroups[matchGroupId];
        }
        return {
          matched: matched,
          matchGroups: matchGroups
        };
      };
      _proto._getMatchable = function _getMatchable(x, y, replacementMap, candidates, matchGroups, matched, type, notStableEnoughItems, matchType) {
        var gameItem = y >= 1 && y < this.height && x >= 0 && x < this.width ? this.board[y][x] || this.next[y][x] : null;
        replacementMap && void 0 !== replacementMap[x + "_" + y] && (gameItem = replacementMap[x + "_" + y]);
        if (!gameItem || gameItem.type !== type || !gameItem.isMatchable) {
          var toReach = "square" === matchType ? 4 : 3;
          if (candidates.length >= toReach) {
            var isStable = true;
            for (var i = 0; i < candidates.length; i++) {
              if (notStableEnoughItems[candidates[i].uid]) {
                isStable = false;
                break;
              }
              isStable = isStable && this.isGameItemStableForMatch(candidates[i]);
              if (!isStable) break;
            }
            if (isStable) {
              var bestTargetPosition = this.getMostRecentlySwitchedItem(candidates);
              if (!bestTargetPosition) {
                var c = candidates[Math.floor(candidates.length / 2)];
                bestTargetPosition = {
                  boardX: c.boardX,
                  boardY: c.boardY
                };
              }
              var matchGroupUid = null;
              var gameItemIdsAlreadyInOtherGroups = null;
              var groupType = "square" === matchType ? "square" : 3 === candidates.length ? "three" : 4 === candidates.length ? "line" === matchType ? "four_h" : "four_v" : "five";
              var alreadyInMatchGroups = null;
              for (var _i = 0; _i < candidates.length; _i++) {
                if (!matched[candidates[_i].uid]) continue;
                gameItemIdsAlreadyInOtherGroups || (gameItemIdsAlreadyInOtherGroups = {});
                gameItemIdsAlreadyInOtherGroups[candidates[_i].uid] = true;
                var groupId = matched[candidates[_i].uid].matchGroupId;
                alreadyInMatchGroups || (alreadyInMatchGroups = {});
                alreadyInMatchGroups[groupId] = true;
                "square" !== matchType && (bestTargetPosition = {
                  boardX: candidates[_i].boardX,
                  boardY: candidates[_i].boardY
                });
              }
              if (alreadyInMatchGroups) {
                var bestMatchType = groupType;
                "square" !== matchType && GROUP_TYPE_PRIORITY["cross"] > GROUP_TYPE_PRIORITY[bestMatchType] && (bestMatchType = "cross");
                for (var evaluatedMatchGroupId in alreadyInMatchGroups) {
                  var evaluatedMatchGroupType = matchGroups[evaluatedMatchGroupId].groupType;
                  if (GROUP_TYPE_PRIORITY[evaluatedMatchGroupType] > GROUP_TYPE_PRIORITY[bestMatchType]) {
                    bestMatchType = evaluatedMatchGroupType;
                    bestTargetPosition = matchGroups[evaluatedMatchGroupId].targetPosition;
                  }
                }
                for (var _groupId in alreadyInMatchGroups) {
                  for (var j = 0; j < matchGroups[_groupId].gameItems.length; j++) {
                    var item = matchGroups[_groupId].gameItems[j];
                    gameItemIdsAlreadyInOtherGroups[item.uid] || candidates.push(item);
                    delete matched[item.uid];
                  }
                  delete matchGroups[_groupId];
                }
                groupType = bestMatchType;
              }
              this.matchGroupUid++;
              matchGroupUid = this.matchGroupUid;
              matchGroups[matchGroupUid] = {
                groupType: groupType,
                gameItems: [],
                targetPosition: {
                  boardX: bestTargetPosition.boardX,
                  boardY: bestTargetPosition.boardY
                }
              };
              for (var _i2 = 0; _i2 < candidates.length; _i2++) if (matched[candidates[_i2].uid]) console.warn("a game item already had a matched entry"); else {
                matched[candidates[_i2].uid] = {
                  matchGroupId: matchGroupUid,
                  gameItem: candidates[_i2]
                };
                matchGroups[matchGroupUid].gameItems.push(candidates[_i2]);
              }
            } else for (var _i3 = 0; _i3 < candidates.length; _i3++) notStableEnoughItems[candidates[_i3].uid] = true;
          }
          candidates.length = 0;
        }
        gameItem && gameItem.type && gameItem.isMatchable && candidates.push(gameItem);
        type = gameItem ? gameItem.type : null;
        return {
          x: x,
          y: y,
          replacementMap: replacementMap,
          candidates: candidates,
          matchGroups: matchGroups,
          matched: matched,
          type: type
        };
      };
      _proto.isGameItemStableForMatch = function isGameItemStableForMatch(gameItem) {
        if (!gameItem.isIdle()) return false;
        var leftStable = !this.next[gameItem.boardY][gameItem.boardX - 1];
        var rightStable = !this.next[gameItem.boardY][gameItem.boardX + 1];
        var topStable = !this.next[gameItem.boardY - 1] || !this.next[gameItem.boardY - 1][gameItem.boardX];
        var bottomStable = !this.next[gameItem.boardY + 1] || !this.next[gameItem.boardY + 1][gameItem.boardX];
        return leftStable && rightStable && topStable && bottomStable;
      };
      _proto.updateSpawnBlindSpot = function updateSpawnBlindSpot(forceImmediate) {
        void 0 === forceImmediate && (forceImmediate = false);
        if (!this.updateSpawnBlindSpotRequest && !forceImmediate) return;
        this.updateSpawnBlindSpotRequest = false;
        var blockedColumns = [];
        for (var y = 1; y < this.height; y++) for (var x = 0; x < this.width; x++) {
          if (blockedColumns[x]) {
            this.spawnBlindSpot[y][x] = true;
            continue;
          }
          var gameItem = this.board[y][x];
          gameItem && gameItem.isBlockingCascade && (blockedColumns[x] = true);
          this.spawnBlindSpot[y][x] = blockedColumns[x];
        }
      };
      _proto.startCascade = function startCascade() {
        if (!this.startCascadeRequest) return;
        this.startCascadeRequest = false;
        for (var y = this.height - 2; y >= 1; y--) for (var d = 0; d < 2; d++) {
          var diagonals = !!d;
          for (var x = 0; x < this.width; x++) {
            var gameItem = this.board[y][x];
            if (!gameItem) continue;
            if (gameItem.isBlockingCascade) continue;
            if (!gameItem.isIdle()) continue;
            var cascading = this.getCascadingTarget(x, y, diagonals);
            if (!cascading) continue;
            this.isCascading = true;
            debugLog(x + " x " + y + ": cascading to ", cascading);
            this._startCascadeItemTo(gameItem, cascading);
            this.checkRespawnRequest = true;
          }
        }
      };
      _proto._startCascadeItemTo = function _startCascadeItemTo(gameItem, cascading) {
        this.dragging.gameItem === gameItem && this.resetDrag();
        var alreadyCascading = gameItem.cascade.isCascading;
        if (alreadyCascading) {
          this.previous[gameItem.cascade.previous.boardY][gameItem.cascade.previous.boardX] = null;
          this.next[gameItem.cascade.next.boardY][gameItem.cascade.next.boardX] = null;
          this["final"][gameItem.cascade["final"].boardY][gameItem.cascade["final"].boardX] = null;
        } else this.board[gameItem.boardY][gameItem.boardX] = null;
        gameItem.lastSwitch = null;
        gameItem.cascade.previous = {
          boardX: alreadyCascading ? gameItem.cascade.next.boardX : gameItem.boardX,
          boardY: alreadyCascading ? gameItem.cascade.next.boardY : gameItem.boardY
        };
        gameItem.cascade["final"] = {
          boardX: cascading["final"].boardX,
          boardY: cascading["final"].boardY
        };
        gameItem.cascade.next = {
          boardX: cascading.next.boardX,
          boardY: cascading.next.boardY
        };
        if (this.previous[gameItem.cascade.previous.boardY][gameItem.cascade.previous.boardX]) {
          console.error("There is already an item in this.previous[" + gameItem.cascade.previous.boardY + "][" + gameItem.cascade.previous.boardX + "]");
          if (this.app.IS_DEVELOPMENT) debugger;
        }
        if (this.next[gameItem.cascade.next.boardY][gameItem.cascade.next.boardX]) {
          console.error("There is already an item in this.next[" + gameItem.cascade.next.boardY + "][" + gameItem.cascade.next.boardX + "]");
          if (this.app.IS_DEVELOPMENT) debugger;
        }
        if (this["final"][gameItem.cascade["final"].boardY][gameItem.cascade["final"].boardX]) {
          console.error("There is already an item in this.final[" + gameItem.cascade["final"].boardY + "][" + gameItem.cascade["final"].boardX + "]");
          if (this.app.IS_DEVELOPMENT) debugger;
        }
        this.previous[gameItem.cascade.previous.boardY][gameItem.cascade.previous.boardX] = gameItem;
        this.next[gameItem.cascade.next.boardY][gameItem.cascade.next.boardX] = gameItem;
        this["final"][gameItem.cascade["final"].boardY][gameItem.cascade["final"].boardX] = gameItem;
        if (!alreadyCascading) {
          gameItem.cascade.isCascading = true;
          gameItem.boardX = null;
          gameItem.boardY = null;
        }
      };
      _proto.update_cascade = function update_cascade(dt) {
        if (!this.isCascading) return;
        var now = this.app.now;
        var stillCascading = false;
        var FRAME_ID = performance.now();
        for (var y = this.height - 1; y >= 1; y--) {
          var handled = {};
          for (var d = 0; d < 2; d++) {
            var diagonals = !!d;
            for (var x = 0; x < this.width; x++) {
              var gameItem = this.next[y][x];
              if (!gameItem) continue;
              if (handled[gameItem.uid]) continue;
              if (gameItem.cascade.delayUntil > now) {
                stillCascading = true;
                continue;
              }
              var velocity = gameItem.velocity + GRAVITY * dt * TILE_SIZE;
              var nextY = gameItem.node.y - velocity;
              var itemBelow = this.previous[gameItem.cascade.next.boardY][gameItem.cascade.next.boardX];
              if (itemBelow && nextY - TILE_SIZE / 2 <= itemBelow.node.y + TILE_SIZE / 2) {
                if (gameItem.cascade.traveled) if (itemBelow.velocity && itemBelow.cascade.traveled) {
                  gameItem.velocity = (itemBelow.velocity + gameItem.velocity) / 2;
                  itemBelow.velocity = gameItem.velocity;
                } else gameItem.velocity = itemBelow.velocity; else {
                  gameItem.cascade.delayUntil = now + 50;
                  if (0 !== gameItem.velocity) {
                    console.error("an item did not travel but its velocity is above 0");
                    gameItem.velocity = 0;
                  }
                }
                velocity = Math.max(0, Math.min(gameItem.velocity, gameItem.node.y - itemBelow.node.y - TILE_SIZE));
                nextY = gameItem.node.y - velocity;
              }
              var nextX = gameItem.node.x + velocity * (gameItem.cascade.next.boardX - gameItem.cascade.previous.boardX);
              if (nextY <= this.boardYToViewY(gameItem.cascade.next.boardY)) {
                debugLog("[" + FRAME_ID + "] " + gameItem.cascade.next.boardX + " x " + gameItem.cascade.next.boardY + ") reached...");
                if (gameItem.isSpawning) {
                  gameItem.isSpawning = false;
                  gameItem.spawner.active = false;
                  gameItem.node.parent.removeChild(gameItem.node);
                  this.view.addChild(gameItem.node);
                }
                this.startCascadeRequest = true;
                if (gameItem.shouldExplode) {
                  handled[gameItem.uid] = true;
                  debugLog("[" + FRAME_ID + "] ... now stopping for explosion");
                  this._itemStopCascading(gameItem);
                  this.hitGameItem(gameItem, gameItem.shouldExplodeReason);
                  continue;
                }
                if (!diagonals) {
                  var _cascading = this.getCascadingTarget(x, y, false, gameItem.uid);
                  if (!_cascading) {
                    debugLog("[" + FRAME_ID + "] ... cannot continue drop vertically, will retry with diagonals");
                    continue;
                  }
                  handled[gameItem.uid] = true;
                  stillCascading = true;
                  gameItem.velocity = velocity;
                  this._weCanCascade(gameItem, _cascading, nextY);
                  this.checkRespawnRequest = true;
                  debugLog("[" + FRAME_ID + "] ... now heading to:", _cascading);
                  continue;
                }
                handled[gameItem.uid] = true;
                var cascading = this.getCascadingTarget(x, y, true, gameItem.uid);
                if (!cascading) {
                  debugLog("[" + FRAME_ID + "] ... now stopping");
                  this.checkRespawnRequest = true;
                  this._itemStopCascading(gameItem);
                  gameItem.bounce();
                  continue;
                }
                stillCascading = true;
                gameItem.velocity = velocity;
                this._weCanCascade(gameItem, cascading, nextY);
                this.checkRespawnRequest = true;
                debugLog("[" + FRAME_ID + "] ... now heading to:", cascading);
                continue;
              }
              gameItem.node.x = nextX;
              gameItem.node.y = nextY;
              gameItem.cascade.traveled = true;
              handled[gameItem.uid] = true;
              gameItem.velocity = velocity;
              stillCascading = true;
            }
          }
        }
        this.isCascading = stillCascading;
      };
      _proto._weCanCascade = function _weCanCascade(gameItem, cascading, nextY) {
        var reachedFinal = gameItem.cascade["final"].boardX === gameItem.cascade.next.boardX && gameItem.cascade["final"].boardY === gameItem.cascade.next.boardY;
        reachedFinal || gameItem.cascade["final"].boardX === cascading["final"].boardX && gameItem.cascade["final"].boardY === cascading["final"].boardY || console.warn("Final tile changed during the drop");
        this._startCascadeItemTo(gameItem, cascading);
        gameItem.node.y = nextY;
        var deltaY = this.boardYToViewY(gameItem.cascade.previous.boardY) - gameItem.node.y;
        gameItem.node.x = this.boardXToViewX(gameItem.cascade.previous.boardX) + deltaY * (gameItem.cascade.next.boardX - gameItem.cascade.previous.boardX);
      };
      _proto._itemStopCascading = function _itemStopCascading(gameItem) {
        gameItem.node.x = this.boardXToViewX(gameItem.cascade.next.boardX);
        gameItem.node.y = this.boardYToViewY(gameItem.cascade.next.boardY);
        gameItem.boardX = gameItem.cascade.next.boardX;
        gameItem.boardY = gameItem.cascade.next.boardY;
        this.board[gameItem.boardY][gameItem.boardX] = gameItem;
        this.previous[gameItem.cascade.previous.boardY][gameItem.cascade.previous.boardX] = null;
        this.next[gameItem.cascade.next.boardY][gameItem.cascade.next.boardX] = null;
        this["final"][gameItem.cascade["final"].boardY][gameItem.cascade["final"].boardX] = null;
        gameItem.cascade.next = null;
        gameItem.cascade["final"] = null;
        gameItem.cascade.previous = null;
        gameItem.cascade.delayUntil = null;
        gameItem.cascade.traveled = false;
        gameItem.cascade.isCascading = false;
        gameItem.velocity = 0;
        this.checkMatchesRequest = true;
      };
      _proto.getCascadingTarget = function getCascadingTarget(boardX, boardY, checkDiagonals, ignoreItemUid) {
        void 0 === checkDiagonals && (checkDiagonals = false);
        void 0 === ignoreItemUid && (ignoreItemUid = -1);
        if (boardY === this.height - 1) return null;
        if (boardX < 0 || boardX > this.width - 1) return null;
        if (checkDiagonals) {
          var droppedVerticallyFirst = false;
          for (var _y = boardY; _y < this.height - 1; _y++) {
            if (this.spawnBlindSpot[_y][boardX - 1]) {
              var leftBelowFreeSpace = this.getCascadingTarget(boardX - 1, _y, false, ignoreItemUid);
              if (leftBelowFreeSpace) return {
                next: {
                  boardX: boardX - (droppedVerticallyFirst ? 0 : 1),
                  boardY: boardY + 1
                },
                final: {
                  boardX: leftBelowFreeSpace["final"].boardX,
                  boardY: leftBelowFreeSpace["final"].boardY
                }
              };
            }
            if (this.spawnBlindSpot[_y][boardX + 1]) {
              var rightBelowFreeSpace = this.getCascadingTarget(boardX + 1, _y, false, ignoreItemUid);
              if (rightBelowFreeSpace) return {
                next: {
                  boardX: boardX + (droppedVerticallyFirst ? 0 : 1),
                  boardY: boardY + 1
                },
                final: {
                  boardX: rightBelowFreeSpace["final"].boardX,
                  boardY: rightBelowFreeSpace["final"].boardY
                }
              };
            }
            if (this.background[_y + 1][boardX] || this.board[_y + 1][boardX] || this.next[_y + 1][boardX] && this.next[_y + 1][boardX].uid !== ignoreItemUid || this["final"][_y + 1][boardX] && this["final"][_y + 1][boardX].uid !== ignoreItemUid) break;
            droppedVerticallyFirst = true;
          }
        } else for (var y = boardY + 1; y < this.height; y++) {
          if (this.board[y][boardX]) return null;
          var next = this.next[y][boardX];
          if (next && next.uid !== ignoreItemUid) return null;
          var _final = this["final"][y][boardX];
          if (_final && _final.uid !== ignoreItemUid) return null;
          if (this.background[y][boardX]) return {
            next: {
              boardX: boardX,
              boardY: boardY + 1
            },
            final: {
              boardX: boardX,
              boardY: y
            }
          };
        }
        return null;
      };
      _proto.lockUserInteraction = function lockUserInteraction(reason) {
        if (!reason) {
          console.warn("Please provide a reason when locking user interaction");
          reason = "unknown";
        }
        this.lockedUserInteractionReasons[reason] && console.warn('GameBoard is already locked for reason "' + reason + '"');
        this.lockedUserInteractionReasons[reason] = true;
        this.lockedUserInteraction = true;
      };
      _proto.unlockUserInteraction = function unlockUserInteraction(reason) {
        if (!reason) {
          console.warn("Please provide a reason when unlocking user interaction");
          reason = "unknown";
        }
        this.lockedUserInteractionReasons[reason] || console.error('GameBoard is not locked for reason "' + reason + '"');
        this.lockedUserInteractionReasons[reason] = false;
        for (reason in this.lockedUserInteractionReasons) if (this.lockedUserInteractionReasons[reason]) {
          this.lockedUserInteraction = true;
          return;
        }
        this.lockedUserInteraction = false;
      };
      _proto.onTouchStart = function onTouchStart(e) {
        if (this.lockedUserInteraction) return;
        if (this.booster) return;
        if (this.explodingDiscoBalls.length > 0) return this.resetDrag();
        if (!DYNAMIC_USER_INTERACTION && !this.isIdle) return this.resetDrag();
        this.resetDrag();
        var location = e.getLocation();
        var _this$view$convertToN = this.view.convertToNodeSpaceAR(location), x = _this$view$convertToN.x, y = _this$view$convertToN.y;
        var gameItem = this.gameItemFromTouchEvent(e);
        if (!gameItem) return;
        if (gameItem.isBlockingCascade) return;
        if (!gameItem.isIdle()) return;
        this.dragging.gameItem = gameItem;
        this.dragging.startX = x;
        this.dragging.startY = y;
        var material = this.spriteCollection.material_highlight;
        var spineMaterial = this.spriteCollection.material_spineHighlight;
        this.highlightTimer = 0;
        material.setProperty("hl_timer", this.highlightTimer);
        spineMaterial.setProperty("hl_timer", this.highlightTimer);
        gameItem.highlight(material, spineMaterial);
      };
      _proto.onTouchMove = function onTouchMove(e) {
        var _this4 = this;
        if (this.lockedUserInteraction) return this.resetDrag();
        if (this.explodingDiscoBalls.length > 0) return this.resetDrag();
        if (!this.dragging.gameItem) return;
        var gameItem = this.dragging.gameItem;
        var location = e.getLocation();
        var _this$view$convertToN2 = this.view.convertToNodeSpaceAR(location), x = _this$view$convertToN2.x, y = _this$view$convertToN2.y;
        var deltaX = this.dragging.startX - x;
        var deltaY = this.dragging.startY - y;
        var distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        if (distance < .5 * TILE_SIZE) return;
        var target = null;
        Math.abs(deltaX) >= Math.abs(2 * deltaY) ? target = {
          boardX: deltaX > 0 ? gameItem.boardX - 1 : gameItem.boardX + 1,
          boardY: gameItem.boardY
        } : Math.abs(deltaY) >= Math.abs(2 * deltaX) && (target = {
          boardX: gameItem.boardX,
          boardY: deltaY > 0 ? gameItem.boardY + 1 : gameItem.boardY - 1
        });
        if (!this.tutorialController.validateMove("swap", gameItem, target)) return;
        var isValid = true;
        var targetItem = null;
        var lockedGameItems = null;
        var srcWillMatch = false;
        var targetWillMatch = false;
        var containsPowerup = false;
        target ? target.boardX > this.width - 1 ? isValid = false : target.boardX < 0 ? isValid = false : target.boardY > this.height - 1 ? isValid = false : target.boardY < 1 ? isValid = false : null === this.background[target.boardY][target.boardX] && (isValid = false) : isValid = false;
        if (isValid) {
          targetItem = this.board[target.boardY][target.boardX];
          if (targetItem) !targetItem.isBlockingCascade && targetItem.isIdle() || (isValid = false); else {
            this.next[target.boardY][target.boardX] && (isValid = false);
            this["final"][target.boardY][target.boardX] && (isValid = false);
          }
        }
        if (isValid) {
          "bomb" === gameItem.type && (containsPowerup = true);
          "sniper" === gameItem.type && (containsPowerup = true);
          "discoball" === gameItem.type && (containsPowerup = true);
          "missiles1" === gameItem.type && (containsPowerup = true);
          "missiles2" === gameItem.type && (containsPowerup = true);
          if (targetItem) {
            "bomb" === targetItem.type && (containsPowerup = true);
            "sniper" === targetItem.type && (containsPowerup = true);
            "discoball" === targetItem.type && (containsPowerup = true);
            "missiles1" === targetItem.type && (containsPowerup = true);
            "missiles2" === targetItem.type && (containsPowerup = true);
          }
        }
        if (!containsPowerup && isValid) {
          var replacementMap = {};
          replacementMap[gameItem.boardX + "_" + gameItem.boardY] = targetItem;
          replacementMap[target.boardX + "_" + target.boardY] = gameItem;
          var _this$getMatchable2 = this.getMatchable(replacementMap), matched = _this$getMatchable2.matched, matchGroups = _this$getMatchable2.matchGroups;
          if (matched[gameItem.uid] || targetItem && matched[targetItem.uid]) {
            lockedGameItems = [];
            var matchGroup1Id = matched[gameItem.uid] && matched[gameItem.uid].matchGroupId;
            var matchGroup2Id;
            targetItem && (matchGroup2Id = matched[targetItem.uid] && matched[targetItem.uid].matchGroupId);
            if (matchGroup1Id) {
              srcWillMatch = true;
              for (var i = 0; i < matchGroups[matchGroup1Id].gameItems.length; i++) {
                matchGroups[matchGroup1Id].gameItems[i].locksForUpcomingMatch++;
                lockedGameItems.push(matchGroups[matchGroup1Id].gameItems[i]);
              }
            }
            if (matchGroup2Id) {
              targetWillMatch = true;
              for (var _i4 = 0; _i4 < matchGroups[matchGroup2Id].gameItems.length; _i4++) {
                matchGroups[matchGroup2Id].gameItems[_i4].locksForUpcomingMatch++;
                lockedGameItems.push(matchGroups[matchGroup2Id].gameItems[_i4]);
              }
            }
          } else isValid = false;
        }
        if (!isValid) {
          this.resetDrag();
          return;
        }
        var tmpX = gameItem.boardX;
        var tmpY = gameItem.boardY;
        gameItem.boardX = target.boardX;
        gameItem.boardY = target.boardY;
        if (targetItem) {
          targetItem.boardX = tmpX;
          targetItem.boardY = tmpY;
        }
        this.board[gameItem.boardY][gameItem.boardX] = gameItem;
        this.board[targetItem ? targetItem.boardY : tmpY][targetItem ? targetItem.boardX : tmpX] = targetItem;
        this.resetDrag();
        var promisesCollection = [];
        promisesCollection.push(gameItem.switchSpriteTo(this.boardXToViewX(gameItem.boardX), this.boardYToViewY(gameItem.boardY), srcWillMatch));
        targetItem && promisesCollection.push(targetItem.switchSpriteTo(this.boardXToViewX(targetItem.boardX), this.boardYToViewY(targetItem.boardY), targetWillMatch));
        this.switchingCount++;
        this.onMoveTriggered();
        Promise.all(promisesCollection).then(function() {
          if (lockedGameItems) for (var _i5 = 0; _i5 < lockedGameItems.length; _i5++) {
            lockedGameItems[_i5] && lockedGameItems[_i5].locksForUpcomingMatch || console.warn("an item locked for upcoming match had his status changed");
            lockedGameItems[_i5].locksForUpcomingMatch--;
          }
          "sniper" === gameItem.type && _this4.triggerSniper(gameItem);
          "bomb" === gameItem.type && _this4.triggerBomb(gameItem);
          "discoball" === gameItem.type && _this4.triggerDiscoball(gameItem, targetItem);
          "missiles1" !== gameItem.type && "missiles2" !== gameItem.type || _this4.triggerMissile(gameItem);
          if (targetItem) {
            "sniper" === targetItem.type && _this4.triggerSniper(targetItem);
            "bomb" === targetItem.type && _this4.triggerBomb(targetItem);
            "discoball" === targetItem.type && _this4.triggerDiscoball(targetItem, gameItem);
            "missiles1" !== targetItem.type && "missiles2" !== targetItem.type || _this4.triggerMissile(targetItem);
          }
          _this4.checkMatchesRequest = true;
          _this4.switchingCount--;
          _this4.tutorialController.stepUp("swap");
        });
      };
      _proto.onTouchEnd = function onTouchEnd(e) {
        if (this.booster) {
          var _gameItem2 = this.gameItemFromTouchEvent(e);
          if (!_gameItem2) return;
          if (!this.isValidForBoosterActivation(_gameItem2)) return;
          if (!this.tutorialController.stepUp("tapBooster")) return;
          this.exitBoosterMode(this.activateBooster(_gameItem2));
        }
        if (this.lockedUserInteraction) return this.resetDrag();
        if (this.explodingDiscoBalls.length > 0) return this.resetDrag();
        var gameItem = this.dragging.gameItem;
        this.tutorialController.stepUp("tapAny");
        if (!this.tutorialController.validateMove("tap", gameItem)) return this.resetDrag();
        if (gameItem && !gameItem.isSwitching) {
          var isValidMove;
          isValidMove = "bomb" === gameItem.type ? this.triggerBomb(gameItem) : "sniper" === gameItem.type ? this.triggerSniper(gameItem) : "missiles1" === gameItem.type || "missiles2" === gameItem.type ? this.triggerMissile(gameItem) : "discoball" === gameItem.type && this.triggerDiscoball(gameItem);
          if (isValidMove) {
            this.tutorialController.stepUp("tap");
            this.onMoveTriggered();
          }
        }
        this.resetDrag();
      };
      _proto.onTouchCancel = function onTouchCancel(e) {
        if (this.explodingDiscoBalls.length > 0) return this.resetDrag();
        this.onTouchEnd(e);
      };
      _proto.resetDrag = function resetDrag() {
        this.dragging.gameItem && this.dragging.gameItem.unHighlight();
        this.dragging = {
          gameItem: null,
          startX: null,
          startY: null
        };
      };
      _proto.gameItemFromTouchEvent = function gameItemFromTouchEvent(e) {
        var location = e.getLocation();
        var _this$view$convertToN3 = this.view.convertToNodeSpaceAR(location), x = _this$view$convertToN3.x, y = _this$view$convertToN3.y;
        var boardX = this.viewXToBoardX(x);
        var boardY = this.viewYToBoardY(y);
        if (!this.isValidCoordinate(boardX, boardY)) return null;
        return this.board[boardY][boardX] || this.underlay[boardY][boardX];
      };
      _proto.enterBoosterMode = function enterBoosterMode(type, isTemporary) {
        this.booster = type;
        this.isTemporaryBooster = isTemporary;
      };
      _proto.exitBoosterMode = function exitBoosterMode(boosterActivated) {
        this.onBoosterModeEnd(boosterActivated, this.booster, this.isTemporaryBooster);
        this.booster = null;
        this.isTemporaryBooster = null;
      };
      _proto.cancelBoosterMode = function cancelBoosterMode() {
        this.booster = null;
      };
      _proto.isValidForBoosterActivation = function isValidForBoosterActivation(gameItem) {
        switch (this.booster) {
         case "paintbrush":
          return gameItem.isBasicType() && gameItem.type !== this.boosterController.getPaintbrushTargetType();

         case "fairystick":
          return gameItem.isBasicType();

         default:
          return true;
        }
      };
      _proto.activateBooster = function activateBooster(gameItem) {
        if (!this.booster) return false;
        if (this.lockedUserInteraction) return false;
        if (this.explodingDiscoBalls.length > 0) return false;
        if (!DYNAMIC_USER_INTERACTION && !this.isIdle) return false;
        if (!gameItem) return false;
        if (!gameItem.isIdle()) return false;
        this.resetDrag();
        switch (this.booster) {
         case "airplane":
          return this.triggerAirplane(gameItem);

         case "rocket":
          return this.triggerRocket(gameItem);

         case "paintbrush":
          return this.triggerPaintbrush(gameItem);

         case "fairystick":
          return this.triggerFairystick(gameItem);

         case "wheel":
          return this.triggerWheel();

         case "hammer":
         default:
          return this.triggerHammer(gameItem);
        }
        this._notIdle();
      };
      _proto.triggerHammer = function triggerHammer(gameItem) {
        return this.hitGameItemCoordinate(gameItem, {
          type: "booster",
          uid: Math.random()
        });
      };
      _proto.triggerAirplane = function triggerAirplane(gameItem) {
        if (!gameItem.isIdle()) return false;
        var _gameItem$node = gameItem.node, x = _gameItem$node.x, y = _gameItem$node.y;
        var node = this._createFlame(this.boardXToViewX(-1), y, 0, .2);
        var projectile = {
          node: node,
          direction: AROUND[1],
          onTick: this._moveMissile.bind(this),
          velocity: BOOSTER_PROJECTILE_VELOCITY,
          startedRemovalAt: 0,
          previousPosition: null,
          affectedTargets: {},
          reason: {
            type: "booster",
            uid: node.uuid
          }
        };
        _helpers["default"].createSprite({
          spriteFrame: this.spriteCollection.airplane,
          view: projectile.node,
          width: ITEM_SIZE,
          height: ITEM_SIZE,
          scale: {
            x: -BOOSTER_SCALE,
            y: BOOSTER_SCALE
          },
          x: 80,
          y: 20
        });
        projectile.previousPosition = {
          boardX: 0,
          boardY: gameItem.boardY
        };
        this.movingSprites.push(projectile);
        return true;
      };
      _proto.triggerRocket = function triggerRocket(gameItem) {
        if (!gameItem.isIdle()) return false;
        var _gameItem$node2 = gameItem.node, x = _gameItem$node2.x, y = _gameItem$node2.y;
        var node = this._createFlame(x, this.boardYToViewY(this.height), 90, .2);
        var projectile = {
          node: node,
          direction: AROUND[3],
          onTick: this._moveMissile.bind(this),
          velocity: BOOSTER_PROJECTILE_VELOCITY,
          startedRemovalAt: 0,
          previousPosition: null,
          affectedTargets: {},
          reason: {
            type: "booster",
            uid: node.uuid
          }
        };
        _helpers["default"].createSprite({
          spriteFrame: this.spriteCollection.rocket,
          view: projectile.node,
          width: ITEM_SIZE,
          height: ITEM_SIZE,
          scale: {
            x: BOOSTER_SCALE,
            y: BOOSTER_SCALE
          },
          angle: 240,
          x: 80
        });
        projectile.previousPosition = {
          boardX: gameItem.boardX,
          boardY: this.height - 1
        };
        this.movingSprites.push(projectile);
        return true;
      };
      _proto.triggerPaintbrush = function triggerPaintbrush(gameItem) {
        var _this5 = this;
        this.itemsWaitingForDisappear++;
        var transformedOpts = _extends({}, gameItem.options);
        transformedOpts.type = this.boosterController.getPaintbrushTargetType();
        this.transformItem(gameItem, transformedOpts).then(function() {
          _this5.itemsWaitingForDisappear--;
          _this5.checkMatchesRequest = true;
        });
        return true;
      };
      _proto.triggerFairystick = function triggerFairystick(gameItem) {
        if (!gameItem.isIdle()) return false;
        this.movingSprites.push({
          targetType: gameItem.type,
          selectedItem: gameItem,
          pool: [],
          nextUpdate: this.app.now + DISCOBALL_DELAY_BETWEEN_ITEMS,
          onTick: this._animateFairystick.bind(this),
          firstItemPushed: false,
          uid: gameItem.uid
        });
        this.explodingDiscoBalls.push(gameItem.type);
        return true;
      };
      _proto.triggerWheel = function triggerWheel() {
        var _this6 = this;
        var items = [];
        for (var y = 0; y < this.height; y++) for (var x = 0; x < this.width; x++) {
          var gameItem = this.board[y][x];
          if (!gameItem) continue;
          if (!gameItem.isBasicType() && !gameItem.isPowerUpType()) continue;
          items.push(gameItem);
        }
        if (items.length <= 1) return false;
        var replacementMap = {};
        var shuffledItems = [].concat(items);
        _helpers["default"].shuffleArray(shuffledItems);
        for (var i = 0; i < items.length; i++) replacementMap[items[i].boardX + "_" + items[i].boardY] = shuffledItems[i];
        this._switchPlaces(replacementMap).then(function() {
          _this6.checkMatchesRequest = true;
        });
        return true;
      };
      _proto.triggerFullTypeWheel = function triggerFullTypeWheel() {
        var _this7 = this;
        if (!this.app.IS_DEVELOPMENT) return;
        var gameItems = [];
        for (var y = 0; y < this.height; y++) for (var x = 0; x < this.width; x++) {
          var gameItem = this.board[y][x];
          if (!gameItem) continue;
          gameItems.push(gameItem);
        }
        var shuffledItemOptions = gameItems.map(function(e) {
          return e.options;
        });
        _helpers["default"].shuffleArray(shuffledItemOptions);
        var promiseCollection = [];
        for (var i = 0; i < gameItems.length; i++) promiseCollection.push(this.transformItem(gameItems[i], _extends({}, shuffledItemOptions[i])));
        this.itemsWaitingForDisappear++;
        Promise.all(promiseCollection).then(function() {
          _this7.itemsWaitingForDisappear--;
          _this7.checkMatchesRequest = true;
        });
        return false;
      };
      _proto._animateFairystick = function _animateFairystick(data, dt) {
        var pool = data.pool, nextUpdate = data.nextUpdate, targetType = data.targetType, selectedItem = data.selectedItem, firstItemPushed = data.firstItemPushed, uid = data.uid;
        var now = this.app.now;
        var delta = now - nextUpdate;
        if (delta < 0) return;
        var newPool = this._discoballGetAllByType(targetType);
        if (!newPool.length) {
          var comboId = uid;
          this.comboReportStart(comboId);
          for (var _iterator3 = _createForOfIteratorHelperLoose(pool), _step3; !(_step3 = _iterator3()).done; ) {
            var _gameItem3 = _step3.value;
            if (!_gameItem3 || _gameItem3.isDying) continue;
            _gameItem3.unhighlightDisco();
            this.hitUnderlay(_gameItem3.boardX, _gameItem3.boardY, "booster");
            this.hitGameItem(_gameItem3, {
              type: "booster",
              uid: comboId
            });
            this.comboReportAdd(comboId, _gameItem3);
          }
          this.comboReportEnd(comboId, "booster");
          _helpers["default"].removeFromArray(targetType, this.explodingDiscoBalls);
          _helpers["default"].removeFromArray(data, this.movingSprites);
          return;
        }
        var gameItem;
        if (firstItemPushed) gameItem = newPool[Math.floor(this.rnd.random() * newPool.length)]; else {
          gameItem = selectedItem;
          data.firstItemPushed = true;
        }
        pool.push(gameItem);
        gameItem.highlightDisco();
        gameItem.lockedForDiscoball = true;
        data.nextUpdate = now + DISCOBALL_DELAY_BETWEEN_ITEMS - delta;
      };
      _proto.triggerBomb = function triggerBomb(gameItem) {
        var RADIUS = BOMB_RADIUS;
        var DURATION = BOMB_EXPLOSION_DURATION;
        if (gameItem.isDying) return false;
        gameItem.isDying = true;
        gameItem.node.zIndex = Z_INDEX.EXPLODING_BOMB;
        var fromX = Math.max(0, gameItem.boardX - RADIUS);
        var toX = Math.min(this.width - 1, gameItem.boardX + RADIUS);
        var fromY = Math.max(1, gameItem.boardY - RADIUS);
        var toY = Math.min(this.height - 1, gameItem.boardY + RADIUS);
        var now = this.app.now;
        var shorterItemExplosionDelay = DURATION / 2;
        var comboId = gameItem.uid;
        this.comboReportStart(comboId);
        var gi;
        var reason = {
          type: "powerup",
          uid: gameItem.node.uuid
        };
        this.comboReportAdd(comboId, gameItem);
        for (var b = 0; b <= 1; b++) for (var y = fromY; y <= toY; y++) for (var x = fromX; x <= toX; x++) {
          b && this.hitUnderlay(x, y, reason);
          gi = (b ? this.board : this.next)[y][x];
          if (!gi) continue;
          if (gi.isDying) continue;
          if (gi.shouldExplode) continue;
          this.comboReportAdd(comboId, gi);
          if (b) this.hitGameItem(gi, reason); else {
            gi.shouldExplode = true;
            gi.shouldExplodeReason = reason;
          }
        }
        this.comboReportEnd(comboId, "powerup");
        gameItem.zIndex = Z_INDEX.EXPLODING_BOMB;
        var bombAnim = gameItem.layers.spine.getComponent(sp.Skeleton);
        bombAnim.setAnimation(0, "boom", false);
        bombAnim.setCompleteListener(function() {
          gameItem.destroyFromBoard();
        });
        gameItem.layers.shadow.active = false;
        this.board[gameItem.boardY][gameItem.boardX] = null;
        this.onPowerUpTrigger(gameItem.type);
        return true;
      };
      _proto.triggerMissile = function triggerMissile(gameItem) {
        var _affectedTargets;
        if (gameItem.isDying) return false;
        gameItem.isDying = true;
        var _gameItem$node3 = gameItem.node, x = _gameItem$node3.x, y = _gameItem$node3.y;
        var missile1, missile2;
        var defaultOptions = {
          onTick: this._moveMissile.bind(this),
          velocity: MISSILE_VELOCITY,
          startedRemovalAt: 0,
          previousPosition: null,
          affectedTargets: (_affectedTargets = {}, _affectedTargets[gameItem.boardX + "_*"] = true, 
          _affectedTargets),
          srcUid: gameItem.uid,
          reason: {
            type: "powerup",
            uid: gameItem.node.uuid
          }
        };
        if ("missiles1" === gameItem.type) {
          missile1 = _extends({
            node: this._createMissile(SPINE_NAMES.rocketSkinLeft, x, y),
            direction: AROUND[0]
          }, defaultOptions);
          missile2 = _extends({
            node: this._createMissile(SPINE_NAMES.rocketSkinRight, x, y),
            direction: AROUND[1]
          }, defaultOptions);
        } else {
          missile1 = _extends({
            node: this._createMissile(SPINE_NAMES.rocketSkinUp, x, y),
            direction: AROUND[3]
          }, defaultOptions);
          missile2 = _extends({
            node: this._createMissile(SPINE_NAMES.rocketSkinDown, x, y),
            direction: AROUND[2]
          }, defaultOptions);
        }
        missile1.previousPosition = {
          boardX: gameItem.boardX,
          boardY: gameItem.boardY
        };
        missile2.previousPosition = {
          boardX: gameItem.boardX,
          boardY: gameItem.boardY
        };
        this.movingSprites.push(missile1, missile2);
        this.board[gameItem.boardY][gameItem.boardX] = null;
        gameItem.destroyFromBoard();
        this.gameItemDisappearanceFinished(gameItem);
        var comboId = gameItem.uid;
        this.comboReportStart(comboId);
        this.comboReportAdd(comboId, gameItem);
        this.comboReportEnd(comboId, "powerup");
        this.onPowerUpTrigger(gameItem.type);
        return true;
      };
      _proto.triggerDiscoball = function triggerDiscoball(gameItem, targetItem) {
        if (gameItem.isDying) return false;
        gameItem.isDying = true;
        var invalidTypes = {};
        for (var _iterator4 = _createForOfIteratorHelperLoose(this.explodingDiscoBalls), _step4; !(_step4 = _iterator4()).done; ) {
          var invalidType = _step4.value;
          invalidTypes[invalidType] = true;
        }
        var targetType = "basic1";
        if (targetItem && targetItem.isMatchable && !invalidTypes[targetItem.type]) targetType = targetItem.type; else {
          var typesCount = {};
          for (var y = 1; y < this.height; y++) for (var x = 0; x <= this.width; x++) {
            var _gameItem4 = this.board[y][x] || this.next[y][x];
            if (!_gameItem4) continue;
            if (!_gameItem4.isMatchable) continue;
            if (_gameItem4.isDying) continue;
            if (_gameItem4.lockedForDiscoball) continue;
            if (invalidTypes[_gameItem4.type]) continue;
            typesCount[_gameItem4.type] || (typesCount[_gameItem4.type] = 0);
            typesCount[_gameItem4.type]++;
          }
          for (var type in typesCount) (!typesCount[targetType] || typesCount[type] > typesCount[targetType]) && (targetType = type);
        }
        gameItem.node.zIndex = Z_INDEX.DISCOBALL_ROTATING;
        gameItem.layers.spine.active = true;
        gameItem.layers["default"].active = false;
        gameItem.layers.shadow.active = false;
        gameItem.currentLayerId = "spine";
        var skeleton = gameItem.layers.spine.getComponent(sp.Skeleton);
        skeleton.setAnimation(0, "start", false);
        skeleton.setCompleteListener(function() {
          skeleton.setCompleteListener(null);
          skeleton.setAnimation(0, "idle", true);
        });
        this.movingSprites.push({
          discoBall: gameItem,
          targetType: targetType,
          pool: [],
          nextUpdate: this.app.now + DISCOBALL_DELAY_BETWEEN_ITEMS,
          onTick: this._animateDiscoBall.bind(this),
          raysOfLightFinished: 0
        });
        this.explodingDiscoBalls.push(targetType);
        this.onPowerUpTrigger(gameItem.type);
        return true;
      };
      _proto.triggerSniper = function triggerSniper(gameItem) {
        if (gameItem.isDying) return false;
        gameItem.isDying = true;
        var target = this._getSniperTarget();
        target && (this.sniperTargets[target.uid] = true);
        gameItem.node.zIndex = Z_INDEX.FLYING_SNIPER;
        var initialAngle;
        if (target) {
          var targetVector = {
            x: target.node.x - gameItem.node.x,
            y: target.node.y - gameItem.node.y
          };
          var targetAngle = _helpers["default"].getAngleFromVector(targetVector.x, targetVector.y);
          initialAngle = targetAngle + 55 * (this.rnd.random() > .5 ? -1 : 1);
        } else {
          initialAngle = gameItem.boardX <= this.width / 2 ? 45 : -45;
          gameItem.boardY <= this.height / 2 && (initialAngle > 0 ? initialAngle += 90 : initialAngle -= 90);
        }
        gameItem.layers.spine.active = true;
        gameItem.layers["default"].active = false;
        gameItem.layers.shadow.active = false;
        gameItem.currentLayerId = "spine";
        var skeleton = gameItem.layers.spine.getComponent(sp.Skeleton);
        skeleton.setAnimation(0, "start", false);
        skeleton.setCompleteListener(function() {
          skeleton.setCompleteListener(null);
          skeleton.setAnimation(0, "frisbee", true);
        });
        this.itemsWaitingForDisappear++;
        this.movingSprites.push({
          startTime: this.app.now,
          gameItem: gameItem,
          target: target,
          targetBoardX: target && target.boardX,
          targetBoardY: target && target.boardY,
          directionAngle: initialAngle,
          nextTargetEvaluation: null,
          onTick: this._animateSniper.bind(this),
          landingStartedAt: null
        });
        this.onPowerUpTrigger(gameItem.type);
        return true;
      };
      _proto._animateSniper = function _animateSniper(sniperData, dt) {
        var gameItem = sniperData.gameItem, target = sniperData.target, targetBoardX = sniperData.targetBoardX, targetBoardY = sniperData.targetBoardY, landingStartedAt = sniperData.landingStartedAt;
        if (sniperData.startTime && (this.app.now - sniperData.startTime > SNIPER_TAKE_OFF_DURATION || sniperData.landingStartedAt)) {
          this.itemsWaitingForDisappear--;
          this.board[gameItem.boardY][gameItem.boardX] = null;
          this.gameItemDisappearanceFinished(gameItem);
          sniperData.startTime = null;
        }
        if (sniperData.landingStartedAt) {
          gameItem.node.x = .9 * gameItem.node.x + .1 * this.boardXToViewX(targetBoardX);
          gameItem.node.y = .9 * gameItem.node.y + .1 * this.boardYToViewY(targetBoardY);
          gameItem.node.scale = .9 * gameItem.node.scale + .1 * ITEM_SCALE * .1;
          gameItem.node.opacity *= .98;
          if (this.app.now > sniperData.landingStartedAt + SNIPER_EXPLOSION_DURATION) {
            gameItem.destroyFromBoard();
            _helpers["default"].removeFromArray(sniperData, this.movingSprites);
          }
          return;
        }
        gameItem.node.scale = .98 * gameItem.node.scale + 1.5 * ITEM_SCALE * .02;
        var isTargetValid = this._isValidSniperTarget(target);
        !isTargetValid || target.boardX === targetBoardX && target.boardY === targetBoardY || (isTargetValid = false);
        if (!isTargetValid) {
          target && delete this.sniperTargets[target.uid];
          target = null;
          if (!sniperData.nextTargetEvaluation || this.app.now >= sniperData.nextTargetEvaluation) {
            var newTarget = this._getSniperTarget();
            if (newTarget) {
              this.sniperTargets[newTarget.uid] = true;
              sniperData.target = newTarget;
              sniperData.targetBoardX = newTarget.boardX;
              sniperData.targetBoardY = newTarget.boardY;
              sniperData.nextTargetEvaluation = null;
              target = newTarget;
            } else sniperData.nextTargetEvaluation = this.app.now + LOGIC_UPDATE_INTERVAL;
          }
        }
        var newAngle = sniperData.directionAngle;
        if (target) {
          var deltaX = target.node.x - gameItem.node.x;
          var deltaY = target.node.y - gameItem.node.y;
          var targetVector = {
            x: deltaX,
            y: deltaY
          };
          var targetAngle = _helpers["default"].getAngleFromVector(targetVector.x, targetVector.y);
          var distanceToTarget = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
          var rotationSpeed = SNIPER_ROTATION_SPEED + Math.pow(1 / distanceToTarget * 1e4, 1.7);
          var minusDifference = (sniperData.directionAngle - targetAngle) % 360;
          minusDifference < 0 && (minusDifference += 360);
          newAngle = minusDifference < 180 ? (sniperData.directionAngle - rotationSpeed * dt + 360) % 360 : (sniperData.directionAngle + rotationSpeed * dt + 360) % 360;
        } else newAngle = (sniperData.directionAngle + SNIPER_ROTATION_SPEED * dt + 360) % 360;
        sniperData.directionAngle = newAngle;
        var distance = SNIPER_SPEED * dt;
        var currentVector = _helpers["default"].getVectorFromAngleAndLength(sniperData.directionAngle, distance);
        gameItem.node.x += currentVector.x;
        gameItem.node.y += currentVector.y;
        var boardX = this.viewXToBoardX(gameItem.node.x);
        var boardY = this.viewYToBoardY(gameItem.node.y);
        if (target && boardX === target.boardX && boardY === target.boardY) {
          this.hitGameItemCoordinate(target, {
            type: "powerup",
            uid: gameItem.node.uuid
          });
          delete this.sniperTargets[target.uid];
          sniperData.landingStartedAt = this.app.now;
          var comboId = gameItem.uid;
          this.comboReportStart(comboId);
          this.comboReportAdd(comboId, gameItem);
          this.comboReportAdd(comboId, target);
          this.comboReportEnd(comboId, "powerup");
        }
      };
      _proto._getSniperTarget = function _getSniperTarget() {
        var bestScore = 0;
        var bestItems = null;
        var objectives = {};
        for (var key in this.objectiveController.items) this.objectiveController.items[key].amount > 0 && (objectives[this.objectiveController.items[key].type] = true);
        for (var y = 1; y < this.height; y++) for (var x = 0; x <= this.width; x++) {
          var score = 0;
          var underlayItem = this.underlay[y][x];
          this._isValidSniperTarget(underlayItem) && (this.sniperTargets[underlayItem.uid] || (score = Math.max(10, score)));
          var gameItem = this.board[y][x] || underlayItem;
          if (!this._isValidSniperTarget(gameItem)) continue;
          if (this.sniperTargets[gameItem.uid]) continue;
          for (var _type in objectives) {
            gameItem.objectiveTypes[_type] && (score = Math.max(100, score));
            underlayItem && underlayItem.objectiveTypes[_type] && (score = Math.max(100, score));
          }
          var type = gameItem.type;
          score = _simpleCrate["default"].is(type) || _bumper["default"].is(type) || _cabinet["default"].is(type) || "movableDestructible1" === type ? Math.max(20, score) : "bomb" === type || "sniper" === type || "discoball" === type || "missiles1" === type || "missiles2" === type ? Math.max(1, score - 1) : Math.max(10, score);
          if (score > bestScore) {
            bestScore = score;
            bestItems = [];
          }
          score === bestScore && bestItems.push(gameItem);
        }
        if (!bestItems) return null;
        return bestItems[Math.floor(this.rnd.random() * bestItems.length)];
      };
      _proto._isValidSniperTarget = function _isValidSniperTarget(gameItem) {
        if (!gameItem) return false;
        if (!gameItem.isIdle()) return false;
        return true;
      };
      _proto._discoballGetAllByType = function _discoballGetAllByType(type) {
        var pool = [];
        for (var y = 0; y < this.height; y++) for (var x = 0; x <= this.width; x++) {
          var gameItem = this.board[y][x];
          if (!gameItem) continue;
          if (!gameItem.isIdle()) continue;
          if (gameItem.type !== type) continue;
          pool.push(gameItem);
        }
        return pool;
      };
      _proto._animateDiscoBall = function _animateDiscoBall(discoBallData, dt) {
        var _this8 = this;
        var pool = discoBallData.pool, nextUpdate = discoBallData.nextUpdate, discoBall = discoBallData.discoBall, targetType = discoBallData.targetType;
        var now = this.app.now;
        var delta = now - nextUpdate;
        if (delta < 0) return;
        discoBallData.nextUpdate = now + DISCOBALL_DELAY_BETWEEN_ITEMS - delta;
        var newPool = this._discoballGetAllByType(targetType);
        if (!newPool.length) {
          if (discoBallData.raysOfLightFinished < pool.length) return;
          var comboId = discoBall.uid;
          this.comboReportStart(comboId);
          this.comboReportAdd(comboId, discoBall);
          for (var _iterator5 = _createForOfIteratorHelperLoose(pool), _step5; !(_step5 = _iterator5()).done; ) {
            var _gameItem5 = _step5.value;
            if (!_gameItem5 || _gameItem5.isDying) continue;
            _gameItem5.unhighlightDisco();
            this.hitUnderlay(_gameItem5.boardX, _gameItem5.boardY, "powerup");
            this.hitGameItem(_gameItem5, {
              type: "powerup",
              uid: comboId,
              subType: "discoball"
            });
            this.comboReportAdd(comboId, _gameItem5);
          }
          this.itemsWaitingForDisappear++;
          discoBall.gotHit({
            type: "selfdestruction",
            uid: comboId
          }).then(function() {
            _this8.itemsWaitingForDisappear--;
            _this8.board[discoBall.boardY][discoBall.boardX] = null;
            _this8.gameItemDisappearanceFinished(discoBall);
          });
          this.hitUnderlay(discoBall.boardX, discoBall.boardY, "selfdestruction");
          this.comboReportEnd(comboId, "powerup");
          _helpers["default"].removeFromArray(targetType, this.explodingDiscoBalls);
          _helpers["default"].removeFromArray(discoBallData, this.movingSprites);
          return;
        }
        var gameItem = newPool[Math.floor(this.rnd.random() * newPool.length)];
        pool.push(gameItem);
        gameItem.lockedForDiscoball = true;
        var distance = Math.sqrt(Math.pow(gameItem.boardX - discoBall.boardX, 2) + Math.pow(gameItem.boardY - discoBall.boardY, 2));
        var targetVector = {
          x: gameItem.node.x - discoBall.node.x,
          y: gameItem.node.y - discoBall.node.y
        };
        var targetAngle = _helpers["default"].getAngleFromVector(targetVector.x, targetVector.y);
        var node = cc.instantiate(this.spriteCollection.rayOfLight);
        var anim = node.getComponent(sp.Skeleton);
        node.scaleX = distance * RAY_OF_LIGHT_SCALE;
        node.angle = 360 - targetAngle + 90;
        this.view.addChild(node);
        anim.setAnimation(0, "ray", false);
        anim.setCompleteListener(function() {
          discoBallData.raysOfLightFinished++;
          cc.tween(node).to(.5, {
            opacity: 0
          }, {
            easing: "sineIn"
          }).call(function() {
            node.destroy();
          }).start();
        });
        this.app.scheduler.setTimeout(function() {
          gameItem.highlightDisco();
        }, 200);
        node.zIndex = Z_INDEX.DISOBALL_RAY_OF_LIGHT;
        node.x = discoBall.node.x;
        node.y = discoBall.node.y;
      };
      _proto._moveMissile = function _moveMissile(missileData, dt) {
        missileData.startTime || (missileData.startTime = this.app.now);
        var node = missileData.node, direction = missileData.direction, velocity = missileData.velocity, previousPosition = missileData.previousPosition, affectedTargets = missileData.affectedTargets, reason = missileData.reason, startTime = missileData.startTime;
        node.x += direction.x * dt * velocity;
        node.y += direction.y * dt * velocity;
        if (missileData.startedRemovalAt) {
          var DISPARITION_DURATION = 1e3;
          node.opacity = 255 * Math.max(0, missileData.startedRemovalAt + DISPARITION_DURATION - this.app.now) / DISPARITION_DURATION;
          if (0 === node.opacity) {
            node.parent.removeChild(node);
            node.destroy();
            _helpers["default"].removeFromArray(missileData, this.movingSprites);
          }
          return;
        }
        var boardX = this.viewXToBoardX(node.x + direction.x * TILE_SIZE);
        var boardY = this.viewYToBoardY(node.y + direction.y * TILE_SIZE);
        var now = this.app.now;
        if (!this.isValidCoordinate(boardX, boardY)) {
          missileData.startedRemovalAt = now;
          return;
        }
        var comboId = missileData.srcUid;
        this.comboReportStart(comboId);
        var fromX = Math.min(previousPosition.boardX, boardX);
        var fromY = Math.min(previousPosition.boardY, boardY);
        var toX = Math.max(previousPosition.boardX, boardX);
        var toY = Math.max(previousPosition.boardY, boardY);
        for (var bx = fromX; bx <= toX; bx++) for (var by = fromY; by <= toY; by++) for (var b = 0; b <= 1; b++) {
          if (b) {
            var underlayItem = this.underlay[by][bx];
            if (underlayItem && !underlayItem.isDying && !affectedTargets[underlayItem.uid] && !affectedTargets["u_" + bx + "_" + by]) {
              affectedTargets[underlayItem.uid] = true;
              affectedTargets["u_" + bx + "_" + by] = true;
              this.hitUnderlay(bx, by, reason);
            }
          }
          var gameItem = (b ? this.board : this.next)[by][bx];
          if (!gameItem) continue;
          if (affectedTargets[gameItem.uid]) continue;
          if (direction.x && affectedTargets[bx + "_*"]) continue;
          if (gameItem.creationTime >= startTime) continue;
          if (gameItem.isDying) continue;
          if (gameItem.lockedForDiscoball) continue;
          if (gameItem.shouldExplode) continue;
          gameItem.explosionDuration = ITEM_EXPLODE_DURATION / 2;
          affectedTargets[gameItem.uid] = true;
          direction.x && (affectedTargets[bx + "_*"] = true);
          if (b) this.hitGameItem(gameItem, reason); else {
            gameItem.shouldExplode = true;
            gameItem.shouldExplodeReason = reason;
          }
          this.comboReportAdd(comboId, gameItem);
        }
        this.comboReportEnd(comboId, reason);
        missileData.previousPosition.boardX = boardX;
        missileData.previousPosition.boardY = boardY;
      };
      _proto._createMissile = function _createMissile(skinId, x, y) {
        var node = cc.instantiate(this.spriteCollection.missileAnim);
        var anim = node.getComponent(sp.Skeleton);
        this.view.addChild(node);
        anim.setSkin(skinId);
        anim.setAnimation(0, "rocket", false);
        node.zIndex = Z_INDEX.FLYING_MISSILE;
        node.x = x;
        node.y = y;
        skinId === SPINE_NAMES.rocketSkinLeft ? node.angle = 180 : skinId === SPINE_NAMES.rocketSkinUp ? node.angle = 90 : skinId === SPINE_NAMES.rocketSkinDown && (node.angle = 270);
        return node;
      };
      _proto._createFlame = function _createFlame(x, y, angle, startAt) {
        var node = cc.instantiate(this.spriteCollection.flameAnim);
        this.view.addChild(node);
        var anim = node.getComponent(sp.Skeleton);
        anim.getCurrent(0).trackTime = startAt || 0;
        node.zIndex = Z_INDEX.BOOSTER_PROJECTILE;
        node.x = x;
        node.y = y;
        node.angle = angle;
        return node;
      };
      _proto.comboReportStart = function comboReportStart(comboId) {
        this.comboReport[comboId] = {};
      };
      _proto.comboReportAdd = function comboReportAdd(comboId, gameItem) {
        this.comboReport[comboId][gameItem.uid] = gameItem.type;
      };
      _proto.comboReportEnd = function comboReportEnd(comboId, comboType) {
        var report = [];
        var comboReport = this.comboReport[comboId];
        for (var gameItemUid in comboReport) report.push(comboReport[gameItemUid]);
        report.length && this.onCombo({
          type: comboType,
          items: report
        });
        delete this.comboReport[comboId];
      };
      _proto.isMoveAvailable = function isMoveAvailable() {
        if (!this.isIdle) return null;
        var moves = [];
        for (var y = 1; y < this.height; y++) for (var x = 0; x < this.width; x++) {
          var gameItem = this.board[y][x];
          if (!gameItem) continue;
          gameItem.isPowerUpType() && moves.push([ gameItem ]);
        }
        for (var _y2 = 1; _y2 < this.height; _y2++) for (var _x = 0; _x < this.width; _x++) {
          var _gameItem6 = this.board[_y2][_x];
          if (!_gameItem6) continue;
          if (!_gameItem6.isBasicType()) continue;
          if (this.isValidCoordinate(_x - 1, _y2)) {
            var giLeft = this.board[_y2][_x - 1];
            if (giLeft && !giLeft.isBlockingCascade) {
              var replacementMap = {};
              replacementMap[giLeft.boardX + "_" + giLeft.boardY] = _gameItem6;
              replacementMap[_gameItem6.boardX + "_" + _gameItem6.boardY] = giLeft;
              var _this$getMatchable3 = this.getMatchable(replacementMap), matched = _this$getMatchable3.matched, matchGroups = _this$getMatchable3.matchGroups;
              if (Object.keys(matchGroups).length) for (var i in matchGroups) moves.push([ _gameItem6, giLeft ]);
            }
          }
          if (this.isValidCoordinate(_x, _y2 - 1)) {
            var giUp = this.board[_y2 - 1][_x];
            if (giUp && !giUp.isBlockingCascade) {
              var _replacementMap = {};
              _replacementMap[giUp.boardX + "_" + giUp.boardY] = _gameItem6;
              _replacementMap[_gameItem6.boardX + "_" + _gameItem6.boardY] = giUp;
              var _this$getMatchable4 = this.getMatchable(_replacementMap), _matched = _this$getMatchable4.matched, _matchGroups = _this$getMatchable4.matchGroups;
              if (Object.keys(_matchGroups).length) for (var _i6 in _matchGroups) moves.push([ _gameItem6, giUp ]);
            }
          }
        }
        return !!moves.length && moves;
      };
      _proto.fixNoMoveAvailable = function fixNoMoveAvailable() {
        var gameItemsByType = {};
        var gameItemsById = {};
        var coordinatesPool = [];
        var coordinatesPoolMap = {};
        for (var y = 1; y < this.height; y++) for (var x = 0; x < this.width; x++) {
          var gameItem = this.board[y][x];
          if (!gameItem) continue;
          if (!gameItem.isBasicType()) continue;
          gameItemsByType[gameItem.type] || (gameItemsByType[gameItem.type] = []);
          gameItemsByType[gameItem.type].push(gameItem);
          gameItemsById[gameItem.uid] = gameItem;
          coordinatesPool.push({
            x: x,
            y: y
          });
          coordinatesPoolMap[x + "_" + y] = true;
        }
        for (var type in gameItemsByType) gameItemsByType[type].length < 3 && delete gameItemsByType[type];
        var typeCandidates = Object.keys(gameItemsByType);
        if (!typeCandidates.length) return this._fixNoMoveAvailableReplaceAll(gameItemsById);
        var selectedType = typeCandidates[Math.floor(this.rnd.random() * typeCandidates.length)];
        var candidates = gameItemsByType[selectedType];
        _helpers["default"].shuffleArray(candidates);
        var travelers = [ candidates[0], candidates[1], candidates[2] ];
        var destinationCandidates = [];
        var tb = this.board;
        var cpm = coordinatesPoolMap;
        var x1, y1, x2, y2, x3, y3, checkHorizontal, checkVertical;
        for (var _y3 = 1; _y3 < this.height; _y3++) for (var _x2 = 0; _x2 < this.width; _x2++) {
          checkHorizontal = true;
          this.isValidCoordinate(_x2, _y3) && this.isValidCoordinate(_x2 + 1, _y3) && this.isValidCoordinate(_x2 + 2, _y3) || (checkHorizontal = false);
          checkHorizontal && tb[_y3][_x2] && tb[_y3][_x2 + 1] && tb[_y3][_x2 + 2] || (checkHorizontal = false);
          (!checkHorizontal || tb[_y3][_x2].isBlockingCascade || tb[_y3][_x2 + 1].isBlockingCascade || tb[_y3][_x2 + 2].isBlockingCascade) && (checkHorizontal = false);
          if (checkHorizontal) {
            x1 = _x2 - 1;
            y1 = _y3;
            x2 = _x2 + 1;
            y2 = _y3;
            x3 = _x2 + 2;
            y3 = _y3;
            cpm[x1 + "_" + y1] && cpm[x2 + "_" + y2] && cpm[x3 + "_" + y3] && destinationCandidates.push([ {
              x: x1,
              y: y1
            }, {
              x: x2,
              y: y2
            }, {
              x: x3,
              y: y3
            } ]);
            x1 = _x2;
            y1 = _y3 - 1;
            x2 = _x2 + 1;
            y2 = _y3;
            x3 = _x2 + 2;
            y3 = _y3;
            cpm[x1 + "_" + y1] && cpm[x2 + "_" + y2] && cpm[x3 + "_" + y3] && destinationCandidates.push([ {
              x: x1,
              y: y1
            }, {
              x: x2,
              y: y2
            }, {
              x: x3,
              y: y3
            } ]);
            x1 = _x2;
            y1 = _y3 + 1;
            x2 = _x2 + 1;
            y2 = _y3;
            x3 = _x2 + 2;
            y3 = _y3;
            cpm[x1 + "_" + y1] && cpm[x2 + "_" + y2] && cpm[x3 + "_" + y3] && destinationCandidates.push([ {
              x: x1,
              y: y1
            }, {
              x: x2,
              y: y2
            }, {
              x: x3,
              y: y3
            } ]);
            x1 = _x2;
            y1 = _y3;
            x2 = _x2 + 1;
            y2 = _y3 - 1;
            x3 = _x2 + 2;
            y3 = _y3;
            cpm[x1 + "_" + y1] && cpm[x2 + "_" + y2] && cpm[x3 + "_" + y3] && destinationCandidates.push([ {
              x: x1,
              y: y1
            }, {
              x: x2,
              y: y2
            }, {
              x: x3,
              y: y3
            } ]);
            x1 = _x2;
            y1 = _y3;
            x2 = _x2 + 1;
            y2 = _y3 + 1;
            x3 = _x2 + 2;
            y3 = _y3;
            cpm[x1 + "_" + y1] && cpm[x2 + "_" + y2] && cpm[x3 + "_" + y3] && destinationCandidates.push([ {
              x: x1,
              y: y1
            }, {
              x: x2,
              y: y2
            }, {
              x: x3,
              y: y3
            } ]);
            x1 = _x2;
            y1 = _y3;
            x2 = _x2 + 1;
            y2 = _y3;
            x3 = _x2 + 3;
            y3 = _y3;
            cpm[x1 + "_" + y1] && cpm[x2 + "_" + y2] && cpm[x3 + "_" + y3] && destinationCandidates.push([ {
              x: x1,
              y: y1
            }, {
              x: x2,
              y: y2
            }, {
              x: x3,
              y: y3
            } ]);
            x1 = _x2;
            y1 = _y3;
            x2 = _x2 + 1;
            y2 = _y3;
            x3 = _x2 + 2;
            y3 = _y3 - 1;
            cpm[x1 + "_" + y1] && cpm[x2 + "_" + y2] && cpm[x3 + "_" + y3] && destinationCandidates.push([ {
              x: x1,
              y: y1
            }, {
              x: x2,
              y: y2
            }, {
              x: x3,
              y: y3
            } ]);
            x1 = _x2;
            y1 = _y3;
            x2 = _x2 + 1;
            y2 = _y3;
            x3 = _x2 + 2;
            y3 = _y3 + 1;
            cpm[x1 + "_" + y1] && cpm[x2 + "_" + y2] && cpm[x3 + "_" + y3] && destinationCandidates.push([ {
              x: x1,
              y: y1
            }, {
              x: x2,
              y: y2
            }, {
              x: x3,
              y: y3
            } ]);
          }
          checkVertical = true;
          this.isValidCoordinate(_x2, _y3) && this.isValidCoordinate(_x2, _y3 + 1) && this.isValidCoordinate(_x2, _y3 + 2) || (checkVertical = false);
          checkVertical && tb[_y3][_x2] && tb[_y3 + 1] && tb[_y3 + 1][_x2] && tb[_y3 + 2] && tb[_y3 + 2][_x2] || (checkVertical = false);
          (!checkVertical || tb[_y3][_x2].isBlockingCascade || tb[_y3 + 1][_x2].isBlockingCascade || tb[_y3 + 2][_x2].isBlockingCascade) && (checkVertical = false);
          if (checkVertical) {
            x1 = _x2;
            y1 = _y3 - 1;
            x2 = _x2;
            y2 = _y3 + 1;
            x3 = _x2;
            y3 = _y3 + 2;
            cpm[x1 + "_" + y1] && cpm[x2 + "_" + y2] && cpm[x3 + "_" + y3] && destinationCandidates.push([ {
              x: x1,
              y: y1
            }, {
              x: x2,
              y: y2
            }, {
              x: x3,
              y: y3
            } ]);
            x1 = _x2 - 1;
            y1 = _y3;
            x2 = _x2;
            y2 = _y3 + 1;
            x3 = _x2;
            y3 = _y3 + 2;
            cpm[x1 + "_" + y1] && cpm[x2 + "_" + y2] && cpm[x3 + "_" + y3] && destinationCandidates.push([ {
              x: x1,
              y: y1
            }, {
              x: x2,
              y: y2
            }, {
              x: x3,
              y: y3
            } ]);
            x1 = _x2 + 1;
            y1 = _y3;
            x2 = _x2;
            y2 = _y3 + 1;
            x3 = _x2;
            y3 = _y3 + 2;
            cpm[x1 + "_" + y1] && cpm[x2 + "_" + y2] && cpm[x3 + "_" + y3] && destinationCandidates.push([ {
              x: x1,
              y: y1
            }, {
              x: x2,
              y: y2
            }, {
              x: x3,
              y: y3
            } ]);
            x1 = _x2;
            y1 = _y3;
            x2 = _x2 - 1;
            y2 = _y3 + 1;
            x3 = _x2;
            y3 = _y3 + 2;
            cpm[x1 + "_" + y1] && cpm[x2 + "_" + y2] && cpm[x3 + "_" + y3] && destinationCandidates.push([ {
              x: x1,
              y: y1
            }, {
              x: x2,
              y: y2
            }, {
              x: x3,
              y: y3
            } ]);
            x1 = _x2;
            y1 = _y3;
            x2 = _x2 + 1;
            y2 = _y3 + 1;
            x3 = _x2;
            y3 = _y3 + 2;
            cpm[x1 + "_" + y1] && cpm[x2 + "_" + y2] && cpm[x3 + "_" + y3] && destinationCandidates.push([ {
              x: x1,
              y: y1
            }, {
              x: x2,
              y: y2
            }, {
              x: x3,
              y: y3
            } ]);
            x1 = _x2;
            y1 = _y3;
            x2 = _x2;
            y2 = _y3 + 1;
            x3 = _x2;
            y3 = _y3 + 3;
            cpm[x1 + "_" + y1] && cpm[x2 + "_" + y2] && cpm[x3 + "_" + y3] && destinationCandidates.push([ {
              x: x1,
              y: y1
            }, {
              x: x2,
              y: y2
            }, {
              x: x3,
              y: y3
            } ]);
            x1 = _x2;
            y1 = _y3;
            x2 = _x2;
            y2 = _y3 + 1;
            x3 = _x2 - 1;
            y3 = _y3 + 2;
            cpm[x1 + "_" + y1] && cpm[x2 + "_" + y2] && cpm[x3 + "_" + y3] && destinationCandidates.push([ {
              x: x1,
              y: y1
            }, {
              x: x2,
              y: y2
            }, {
              x: x3,
              y: y3
            } ]);
            x1 = _x2;
            y1 = _y3;
            x2 = _x2;
            y2 = _y3 + 1;
            x3 = _x2 + 1;
            y3 = _y3 + 2;
            cpm[x1 + "_" + y1] && cpm[x2 + "_" + y2] && cpm[x3 + "_" + y3] && destinationCandidates.push([ {
              x: x1,
              y: y1
            }, {
              x: x2,
              y: y2
            }, {
              x: x3,
              y: y3
            } ]);
          }
        }
        _helpers["default"].shuffleArray(destinationCandidates);
        for (var destinationIndex = 0; destinationIndex < destinationCandidates.length; destinationIndex++) for (var shuffleAttempts = 0; shuffleAttempts < 10; shuffleAttempts++) {
          var destination = destinationCandidates[destinationIndex];
          _helpers["default"].shuffleArray(travelers);
          _helpers["default"].shuffleArray(coordinatesPool);
          var replacementMap = {};
          var coordinatesPoolIndex = 0;
          for (var gameItemUid in gameItemsById) {
            var _gameItem7 = gameItemsById[gameItemUid];
            var travelerIndex = travelers.indexOf(_gameItem7);
            if (-1 !== travelerIndex) replacementMap[destination[travelerIndex].x + "_" + destination[travelerIndex].y] = _gameItem7; else {
              var c = coordinatesPool[coordinatesPoolIndex];
              while (c.x === destination[0].x && c.y === destination[0].y || c.x === destination[1].x && c.y === destination[1].y || c.x === destination[2].x && c.y === destination[2].y) {
                coordinatesPoolIndex++;
                c = coordinatesPool[coordinatesPoolIndex];
              }
              replacementMap[c.x + "_" + c.y] = _gameItem7;
              coordinatesPoolIndex++;
            }
          }
          var _this$getMatchable5 = this.getMatchable(replacementMap), matched = _this$getMatchable5.matched, matchGroups = _this$getMatchable5.matchGroups;
          if (Object.keys(matchGroups).length) continue;
          return this._switchPlaces(replacementMap);
        }
        this._fixNoMoveAvailableReplaceAll(gameItemsById);
      };
      _proto._switchPlaces = function _switchPlaces(replacementMap) {
        var _this9 = this;
        this.switchingCount++;
        var promiseCollection = [];
        var _loop = function _loop(coordId) {
          var gameItem = replacementMap[coordId];
          var coords = coordId.split("_");
          var x = Number(coords[0]);
          var y = Number(coords[1]);
          promiseCollection.push(gameItem.moveSpriteTo(_this9.boardXToViewX(x), _this9.boardYToViewY(y), NO_MOVE_FIX_DURATION).then(function() {
            gameItem.boardX = x;
            gameItem.boardY = y;
            _this9.board[y][x] = gameItem;
          }));
        };
        for (var coordId in replacementMap) _loop(coordId);
        this.lockUserInteraction("_fixNoMoveAvailableMoveAround");
        return Promise.all(promiseCollection).then(function() {
          _this9.unlockUserInteraction("_fixNoMoveAvailableMoveAround");
          _this9.switchingCount--;
        });
      };
      _proto._fixNoMoveAvailableReplaceAll = function _fixNoMoveAvailableReplaceAll(gameItemsById) {
        var reason = {
          type: "noMoveAvailable",
          uid: Math.random()
        };
        for (var gameItemUid in gameItemsById) {
          var gameItem = gameItemsById[gameItemUid];
          this.hitGameItem(gameItem, reason);
        }
      };
      _proto.boardXToViewX = function boardXToViewX(boardX) {
        return boardX * TILE_SIZE - this.width * TILE_SIZE / 2 + TILE_SIZE / 2;
      };
      _proto.boardYToViewY = function boardYToViewY(boardY) {
        return -(boardY * TILE_SIZE - this.height * TILE_SIZE / 2);
      };
      _proto.viewXToBoardX = function viewXToBoardX(viewX) {
        return Math.floor((viewX + this.width * TILE_SIZE / 2) / TILE_SIZE);
      };
      _proto.viewYToBoardY = function viewYToBoardY(viewY) {
        return Math.round((-viewY + this.height * TILE_SIZE / 2) / TILE_SIZE);
      };
      _proto.isValidCoordinate = function isValidCoordinate(boardX, boardY) {
        if (boardX < 0) return false;
        if (boardY < 1) return false;
        if (boardX > this.width - 1) return false;
        if (boardY > this.height - 1) return false;
        return true;
      };
      _proto.validatePattern = function validatePattern(pattern, spawnPattern) {
        var width = spawnPattern.length;
        for (var y = 0; y < pattern.length; y++) pattern[y].length !== width && console.error("GameBoard - pattern has an inconsistent length");
      };
      _proto.getMostRecentlySwitchedItem = function getMostRecentlySwitchedItem(gameItems) {
        var latest = 0;
        var toReturn = null;
        for (var i = 0; i < gameItems.length; i++) if (gameItems[i].lastSwitch && gameItems[i].lastSwitch > latest) {
          latest = gameItems[i].lastSwitch;
          toReturn = gameItems[i];
        }
        return toReturn;
      };
      _proto.transformItem = function transformItem(gameItem, newOptions) {
        var _this10 = this;
        var boardX = gameItem.boardX, boardY = gameItem.boardY;
        var _gameItem$node4 = gameItem.node, x = _gameItem$node4.x, y = _gameItem$node4.y, opacity = _gameItem$node4.opacity, scale = _gameItem$node4.scale;
        var transformingItem = cc.instantiate(this.GameItem).getComponent("GameItem");
        this.view.addChild(transformingItem.node);
        transformingItem.init(newOptions);
        transformingItem.node.x = x;
        transformingItem.node.y = y;
        transformingItem.boardX = boardX;
        transformingItem.boardY = boardY;
        transformingItem.node.scale = .25 * scale;
        transformingItem.node.opacity = 0;
        return new Promise(function(resolve) {
          cc.tween(gameItem.node).to(ITEM_TRANSFORM_DURATION, {
            scale: .25 * scale,
            opacity: 0
          }, {
            easing: "sineIn"
          }).start();
          cc.tween(transformingItem.node).delay(ITEM_TRANSFORM_DURATION).to(ITEM_TRANSFORM_DURATION, {
            scale: scale,
            opacity: opacity
          }, {
            easing: "backOut"
          }).delay(.1).call(function() {
            _this10.board[boardY][boardX] = transformingItem;
            gameItem.destroy();
            resolve();
          }).start();
        });
      };
      _proto.transformItemToType = function transformItemToType(item, type) {
        var _this11 = this;
        return new Promise(function(resolve) {
          var boardX = item.boardX;
          var boardY = item.boardY;
          var oldItem = item;
          if (!oldItem || !oldItem.isIdle()) return console.error("transformItemToType: item is not idle", oldItem);
          oldItem.node.zIndex = Z_INDEX.BORDER + 1;
          cc.tween(oldItem.node).to(.3, {
            scale: 1.5 * ITEM_SCALE
          }, {
            easing: "sineOut"
          }).call(function() {
            cc.tween(oldItem.node).to(.3, {
              scale: .01
            }, {
              easing: "quartIn"
            }).start();
          }).start();
          var newItem = _this11.getNewGameItemFromBlueprint({
            blueprint: type,
            view: _this11.view,
            boardX: boardX,
            boardY: boardY,
            x: _this11.boardXToViewX(boardX),
            y: _this11.boardYToViewY(boardY)
          });
          newItem.node.opacity = 0;
          newItem.node.scale = 2 * ITEM_SCALE;
          newItem.node.zIndex = Z_INDEX.BORDER + 1;
          cc.tween(newItem.node).delay(.5).to(.4, {
            scale: ITEM_SCALE,
            opacity: 255
          }, {
            easing: "sineOut"
          }).call(function() {
            newItem.node.zIndex = Z_INDEX.ITEM;
            _this11.board[boardY][boardX] = newItem;
            oldItem.destroy();
            resolve();
          }).start();
          _this11._notIdle();
        });
      };
      _proto.transformRandomItemsToType = function transformRandomItemsToType(type, number) {
        var targets = {};
        var targetCount = 0;
        for (var y = 1; y < this.height; y++) for (var x = 0; x <= this.width; x++) {
          var score = 0;
          var underlayItem = this.underlay[y][x];
          var gameItem = this.board[y][x] || underlayItem;
          if (!this._isValidSniperTarget(gameItem)) continue;
          if (targets[gameItem.uid]) continue;
          if (gameItem.isBasicType()) {
            targets[gameItem.uid] = gameItem;
            targetCount++;
          }
        }
        for (var i = 0; i < number; i++) {
          if (0 === targetCount) {
            console.error(new Error("No valid item to transform."));
            return;
          }
          var randomizedIndex = Math.floor(this.rnd.random() * targetCount);
          var randomizedKeys = Object.keys(targets)[randomizedIndex];
          var randomizedItem = targets[randomizedKeys];
          var parsedType = "missiles" === type ? "missiles" + (1 + Math.floor(2 * this.rnd.random())) : type;
          this.transformItemToType(randomizedItem, parsedType);
          delete targets[randomizedKeys];
          targetCount--;
        }
      };
      _proto.getNewGameItemFromBlueprint = function getNewGameItemFromBlueprint(options) {
        var blueprint = options.blueprint, view = options.view, boardX = options.boardX, boardY = options.boardY, x = options.x, y = options.y;
        if (!blueprint) return null;
        var type = blueprint;
        "Array" === type.constructor.name && (type = type[Math.floor(Math.random() * type.length)]);
        var gameItem = cc.instantiate(this.GameItem).getComponent("GameItem");
        view.addChild(gameItem.node);
        gameItem.init({
          app: this.app,
          onDestroyCb: this.onGameItemDestroy,
          type: type,
          gameBoard: this,
          boardX: boardX,
          boardY: boardY,
          viewX: x,
          viewY: y
        });
        return gameItem;
      };
      _proto.checkRespawn = function checkRespawn() {
        if (!this.checkRespawnRequest) return;
        this.checkRespawnRequest = false;
        for (var x = 0; x < this.width; x++) {
          var spawner = this.spawners[x];
          if (this.board[spawner.boardY + 1][x]) continue;
          if (this.next[spawner.boardY + 1][x]) continue;
          if (this["final"][spawner.boardY + 1][x]) continue;
          var blueprint = void 0;
          if ("Object" === spawner.blueprint.constructor.name && spawner.blueprint.sequence) if (1 === spawner.blueprint.sequence.length) {
            spawner.blueprint = spawner.blueprint.sequence[0];
            blueprint = spawner.blueprint;
          } else blueprint = spawner.blueprint.sequence.shift(); else blueprint = spawner.blueprint;
          var spawningItem = this.getNewGameItemFromBlueprint({
            blueprint: blueprint,
            view: spawner,
            boardX: spawner.boardX,
            boardY: spawner.boardY,
            x: this.boardXToViewX(spawner.boardX),
            y: this.boardYToViewY(spawner.boardY)
          });
          spawningItem.isSpawning = true;
          spawningItem.spawner = spawner;
          spawner.active = true;
          this._startCascadeItemTo(spawningItem, {
            next: {
              boardX: spawner.boardX,
              boardY: spawner.boardY + 1
            },
            final: {
              boardX: spawner.boardX,
              boardY: spawner.boardY + 1
            }
          });
          var belowItem = this.previous[spawningItem.cascade.next.boardY][spawningItem.cascade.next.boardX];
          if (belowItem) {
            spawningItem.velocity = belowItem.velocity;
            spawningItem.cascade.traveled = true;
          }
          this.isCascading = true;
        }
      };
      _proto.gameFinished = function gameFinished() {
        if (!this.updateInterval) return;
        clearInterval(this.updateInterval);
        this.updateInterval = null;
      };
      _proto.destroy = function destroy() {
        this.gameFinished();
        this.isBeingDestroyed = true;
      };
      return GameBoard;
    }();
    exports["default"] = GameBoard;
    module.exports = exports["default"];
    cc._RF.pop();
  }, {
    "../constants.js": "constants",
    "../helpers.js": "helpers",
    "./GameItem/GameItem.js": "GameItem",
    "./GameItem/bumper.js": "bumper",
    "./GameItem/cabinet.js": "cabinet",
    "./GameItem/simpleCrate.js": "simpleCrate",
    "./Rnd.js": "Rnd"
  } ],
  GameItem: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fb0165kpG9GX5niWjNvxe4O", "GameItem");
    "use strict";
    var _bumper = _interopRequireDefault(require("./bumper.js"));
    var _cabinet = _interopRequireDefault(require("./cabinet.js"));
    var _constants = _interopRequireDefault(require("../../constants.js"));
    var _helpers = _interopRequireDefault(require("../../helpers.js"));
    var _simpleCrate = _interopRequireDefault(require("./simpleCrate.js"));
    var _underlay = _interopRequireDefault(require("./underlay.js"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    function _extends() {
      _extends = Object.assign || function(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];
          for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
      };
      return _extends.apply(this, arguments);
    }
    var _constants$GAMEPLAY = _constants["default"].GAMEPLAY, TILE_SIZE = _constants$GAMEPLAY.TILE_SIZE, ITEM_SIZE = _constants$GAMEPLAY.ITEM_SIZE, ITEM_SHADOW_SIZE = _constants$GAMEPLAY.ITEM_SHADOW_SIZE, ITEM_SCALE = _constants$GAMEPLAY.ITEM_SCALE, Z_INDEX = _constants$GAMEPLAY.Z_INDEX, ITEM_SWITCH_DURATION = _constants$GAMEPLAY.ITEM_SWITCH_DURATION, ITEM_EXPLODE_DURATION = _constants$GAMEPLAY.ITEM_EXPLODE_DURATION, POWERUP_SPAWN_DURATION = _constants$GAMEPLAY.POWERUP_SPAWN_DURATION, GAME_ITEM_TYPE = _constants$GAMEPLAY.GAME_ITEM_TYPE, ITEM_SHATTER_COLOR = _constants$GAMEPLAY.ITEM_SHATTER_COLOR, ITEMS_GATHERING_DURATION = _constants$GAMEPLAY.ITEMS_GATHERING_DURATION, DISCO_PULSE_SPEED = _constants$GAMEPLAY.DISCO_PULSE_SPEED, DISCO_PULSE_SCALE = _constants$GAMEPLAY.DISCO_PULSE_SCALE, DISCO_GLOW_APPEARANCE_DURATION = _constants$GAMEPLAY.DISCO_GLOW_APPEARANCE_DURATION;
    var UID = 0;
    cc.Class({
      extends: cc.Component,
      properties: _extends({
        basic1: {
          default: null,
          type: cc.SpriteFrame
        },
        basic2: {
          default: null,
          type: cc.SpriteFrame
        },
        basic3: {
          default: null,
          type: cc.SpriteFrame
        },
        basic4: {
          default: null,
          type: cc.SpriteFrame
        },
        basic5: {
          default: null,
          type: cc.SpriteFrame
        },
        basic1shadow: {
          default: null,
          type: cc.SpriteFrame
        },
        basic2shadow: {
          default: null,
          type: cc.SpriteFrame
        },
        basic3shadow: {
          default: null,
          type: cc.SpriteFrame
        },
        basic4shadow: {
          default: null,
          type: cc.SpriteFrame
        },
        basic5shadow: {
          default: null,
          type: cc.SpriteFrame
        },
        basic1glow: {
          default: null,
          type: cc.SpriteFrame
        },
        basic2glow: {
          default: null,
          type: cc.SpriteFrame
        },
        basic3glow: {
          default: null,
          type: cc.SpriteFrame
        },
        basic4glow: {
          default: null,
          type: cc.SpriteFrame
        },
        basic5glow: {
          default: null,
          type: cc.SpriteFrame
        },
        missiles1: {
          default: null,
          type: cc.SpriteFrame
        },
        missiles2: {
          default: null,
          type: cc.SpriteFrame
        },
        missiles1shadow: {
          default: null,
          type: cc.SpriteFrame
        },
        missiles2shadow: {
          default: null,
          type: cc.SpriteFrame
        },
        discoball: {
          default: null,
          type: cc.SpriteFrame
        },
        discoballshadow: {
          default: null,
          type: cc.SpriteFrame
        },
        sniper: {
          default: null,
          type: cc.SpriteFrame
        },
        snipershadow: {
          default: null,
          type: cc.SpriteFrame
        },
        bomb: {
          default: null,
          type: cc.SpriteFrame
        },
        bombshadow: {
          default: null,
          type: cc.SpriteFrame
        },
        material_normal: {
          default: null,
          type: cc.Material
        },
        material_spineNormal: {
          default: null,
          type: cc.Material
        },
        shatterFX: {
          default: null,
          type: cc.Prefab
        },
        bombFX: {
          default: null,
          type: cc.Prefab
        },
        sniperFX: {
          default: null,
          type: cc.Prefab
        },
        discoballFX: {
          default: null,
          type: cc.Prefab
        },
        lightBallFX: {
          default: null,
          type: cc.Prefab
        },
        teacupFX: {
          default: null,
          type: cc.Prefab
        },
        movableDestructible1: {
          default: null,
          type: cc.SpriteFrame
        },
        movableDestructible1shadow: {
          default: null,
          type: cc.SpriteFrame
        }
      }, _simpleCrate["default"].properties, _underlay["default"].properties, _bumper["default"].properties, _cabinet["default"].properties),
      statics: {
        preParsePattern: function preParsePattern(gameBoard, pattern) {
          _cabinet["default"].preParsePattern(gameBoard, pattern);
        }
      },
      ctor: function ctor() {
        this.app = null;
        this.gameBoard = null;
        this.type = null;
        this.boardX = null;
        this.boardY = null;
        this.onDestroyCb = null;
        this.isDying = false;
        this.isSpawning = false;
        this.cascade = {
          isCascading: false,
          previous: null,
          next: null,
          final: null,
          delayUntil: null,
          traveled: false
        };
        this.velocity = 0;
        this.isBlockingCascade = false;
        this.isMatchable = false;
        this.isSwitching = false;
        this.locksForUpcomingMatch = 0;
        this.lockedForDiscoball = false;
        this.shouldExplode = false;
        this.shouldExplodeReason = null;
        this.lastSwitch = null;
        this.explosionDuration = ITEM_EXPLODE_DURATION;
        this.lifePoints = 1;
        this.creationTime = null;
        this.linkedGamesItems = null;
        this.objectiveTypes = null;
        this.uid = ++UID;
        this.options = null;
        this.isSensitive = false;
        this.layers = {};
        this.currentLayerId = null;
        this.onUpdate = null;
        this.bounceTween = null;
      },
      init: function init(options) {
        var _this$objectiveTypes;
        this.options = options;
        var app = options.app, onDestroyCb = options.onDestroyCb, type = options.type, gameBoard = options.gameBoard;
        this.app = app;
        this.gameBoard = gameBoard;
        this.onDestroyCb = onDestroyCb;
        this.layersContainer = new cc.Node();
        this.node.addChild(this.layersContainer);
        void 0 !== options.boardX && (this.boardX = options.boardX);
        void 0 !== options.boardY && (this.boardY = options.boardY);
        void 0 !== options.viewX && (this.node.x = options.viewX);
        void 0 !== options.viewY && (this.node.y = options.viewY);
        this.type = type;
        this.objectiveTypes = (_this$objectiveTypes = {}, _this$objectiveTypes[type] = true, 
        _this$objectiveTypes);
        this.creationTime = this.app.now;
        var spine;
        switch (type) {
         case "basic1":
         case "basic2":
         case "basic3":
         case "basic4":
         case "basic5":
          this.isMatchable = true;
          this.node.zIndex = Z_INDEX.ITEM;
          this._addLayers({
            shadow: this[type + "shadow"]
          });
          this._addLayers({
            default: this[type]
          });
          this.currentLayerId = "default";
          break;

         case "missiles1":
         case "missiles2":
          this.node.zIndex = Z_INDEX.ITEM;
          this._addLayers({
            shadow: this[type + "shadow"]
          });
          this._addLayers({
            default: this[type]
          });
          this.currentLayerId = "default";
          break;

         case "sniper":
          this.node.zIndex = Z_INDEX.ITEM;
          spine = cc.instantiate(this.sniperFX);
          this._addLayers({
            shadow: this[type + "shadow"]
          });
          this._addLayers({
            spine: spine
          });
          this.layers.spine.active = false;
          this._addLayers({
            default: this[type]
          });
          this.currentLayerId = "default";
          break;

         case "discoball":
          this.node.zIndex = Z_INDEX.ITEM;
          spine = cc.instantiate(this.discoballFX);
          this._addLayers({
            shadow: this[type + "shadow"]
          });
          this._addLayers({
            spine: spine
          });
          this.layers.spine.active = false;
          this._addLayers({
            default: this[type]
          });
          this.currentLayerId = "default";
          break;

         case "bomb":
          this.node.zIndex = Z_INDEX.ITEM;
          spine = cc.instantiate(this.bombFX);
          this._addLayers({
            shadow: this[type + "shadow"]
          });
          this._addLayers({
            spine: spine
          });
          this.currentLayerId = "spine";
          var skeleton = spine.getComponent(sp.Skeleton);
          skeleton.setAnimation(0, "idle", true);
          break;

         case "movableDestructible1":
          this.node.zIndex = Z_INDEX.ITEM;
          this._addLayers({
            shadow: this[type + "shadow"]
          });
          this._addLayers({
            default: this[type]
          });
          this.currentLayerId = "default";
          this.isSensitive = true;
          break;

         default:
          if (_simpleCrate["default"].is(type)) _simpleCrate["default"].init(this, options); else if (_underlay["default"].is(type)) _underlay["default"].init(this, options); else if (_bumper["default"].is(type)) _bumper["default"].init(this, options); else {
            if (!_cabinet["default"].is(type)) return console.error(type + " is not a valid item type");
            _cabinet["default"].init(this, options);
          }
        }
        this.node.scale = ITEM_SCALE;
      },
      update: function update(dt) {
        if (!this.onUpdate) return;
        for (var key in this.onUpdate) this.onUpdate[key].update(dt, this.onUpdate[key].data);
      },
      gotHit: function gotHit(reason) {
        var _this = this;
        return new Promise(function(resolve) {
          if (_simpleCrate["default"].is(_this.type)) return _simpleCrate["default"].gotHit(_this, reason, resolve);
          if (_underlay["default"].is(_this.type)) return _underlay["default"].gotHit(_this, reason, resolve);
          if (_bumper["default"].is(_this.type)) return _bumper["default"].gotHit(_this, reason, resolve);
          if (_cabinet["default"].is(_this.type)) return _cabinet["default"].gotHit(_this, reason, resolve);
          _this.lifePoints--;
          _this._checkLifePoints();
          if (0 === _this.lifePoints) {
            if ("movableDestructible1" === _this.type) return _this._teacupExplode(reason, resolve);
            return _this._defaultExplode(reason, resolve);
          }
          return resolve();
        });
      },
      _defaultExplode: function _defaultExplode(reason, resolve, playSimpleExplosion) {
        var _this2 = this;
        void 0 === playSimpleExplosion && (playSimpleExplosion = true);
        this.isDying = true;
        if (playSimpleExplosion) {
          var shatterNode = cc.instantiate(this.shatterFX);
          this.node.parent.addChild(shatterNode);
          shatterNode.position = this.node.position;
          shatterNode.x += (.2 * Math.random() - .1) * TILE_SIZE;
          shatterNode.y += (.2 * Math.random() - .1) * TILE_SIZE;
          shatterNode.zIndex = Z_INDEX.ITEM_SHATTER;
          shatterNode.scale = ITEM_SCALE * (.9 + .2 * Math.random());
          shatterNode.angle = 360 * Math.random();
          var shatterAnim = shatterNode.getComponent(sp.Skeleton);
          shatterAnim.setSkin(ITEM_SHATTER_COLOR[this.type] || "default");
          shatterAnim.setAnimation(0, "boom", false);
          shatterAnim.setCompleteListener(function() {
            shatterNode.destroy();
            if (!resolve) return;
            var r = resolve;
            resolve = null;
            _this2.app.scheduler.setTimeout(function() {
              _this2.destroyFromBoard();
            }, 0);
            _this2._onDestroyCb();
            r();
          });
        }
        cc.tween(this.node).to(this.explosionDuration, {
          opacity: 0
        }, {
          easing: "linear"
        }).call(function() {
          if (!resolve) return;
          var r = resolve;
          resolve = null;
          _this2.app.scheduler.setTimeout(function() {
            _this2.destroyFromBoard();
          }, 0);
          _this2._onDestroyCb();
          r();
        }).start();
      },
      explodeForPowerUp: function explodeForPowerUp(x, y) {
        var _this3 = this;
        return new Promise(function(resolve) {
          _this3.isDying = true;
          cc.tween(_this3.node).to(ITEMS_GATHERING_DURATION, {
            x: x,
            y: y
          }, {
            easing: "linear"
          }).call(function() {
            _this3._onDestroyCb();
            _this3.app.scheduler.setTimeout(function() {
              _this3.destroyFromBoard();
            }, 0);
            resolve();
          }).start();
        });
      },
      switchSpriteTo: function switchSpriteTo(x, y, willMatch) {
        var _this4 = this;
        this.lastSwitch = willMatch ? this.app.now : null;
        this.isSwitching = true;
        return new Promise(function(resolve) {
          cc.tween(_this4.node).to(ITEM_SWITCH_DURATION, {
            x: x,
            y: y
          }, {
            easing: "quadOut"
          }).call(function() {
            _this4.isSwitching = false;
            resolve();
          }).start();
        });
      },
      moveSpriteTo: function moveSpriteTo(x, y, duration) {
        var _this5 = this;
        return new Promise(function(resolve) {
          cc.tween(_this5.node).to(duration, {
            x: x,
            y: y
          }, {
            easing: "quadInOut"
          }).call(resolve).start();
        });
      },
      spawnPowerUp: function spawnPowerUp() {
        var _this6 = this;
        this.node.opacity = 0;
        this.node.scale = 1.5 * ITEM_SCALE;
        return new Promise(function(resolve) {
          cc.tween(_this6.node).to(POWERUP_SPAWN_DURATION, {
            opacity: 255,
            scale: ITEM_SCALE
          }, {
            easing: "linear"
          }).call(function() {
            resolve();
          }).start();
        });
      },
      highlight: function highlight(material, spineMaterial) {
        var currentLayer = this.layers[this.currentLayerId];
        var element = currentLayer.getComponent(cc.Sprite);
        if (element) {
          element.setMaterial(0, material);
          return;
        }
        element = currentLayer.getComponent(sp.Skeleton);
        if (element) {
          element.setMaterial(0, spineMaterial);
          return;
        }
      },
      unHighlight: function unHighlight() {
        var currentLayer = this.layers[this.currentLayerId];
        var element = currentLayer.getComponent(cc.Sprite);
        if (element) {
          element.setMaterial(0, this.material_normal);
          return;
        }
        element = currentLayer.getComponent(sp.Skeleton);
        if (element) {
          element.setMaterial(0, this.material_spineNormal);
          return;
        }
      },
      highlightDisco: function highlightDisco() {
        this._addLayers({
          discoHighlight: this[this.type + "glow"]
        });
        this.layers.discoHighlight.zIndex = -2;
        this.layers.discoHighlight.width = 1.15 * ITEM_SIZE;
        this.layers.discoHighlight.height = 1.15 * ITEM_SIZE;
        this.layers.discoHighlight.opacity = 0;
        var spine = cc.instantiate(this.lightBallFX);
        this._addLayers({
          spine: spine
        });
        spine.zIndex = -1;
        this.layers.spine.opacity = 0;
        this.onUpdate = this.onUpdate || {};
        this.onUpdate.discoPulse = {
          update: this._highlightDiscoUpdate.bind(this),
          data: {
            start: this.app.now
          }
        };
      },
      _highlightDiscoUpdate: function _highlightDiscoUpdate(dt, data) {
        var scale = DISCO_PULSE_SCALE;
        var delta = this.app.now - data.start;
        if (delta < DISCO_GLOW_APPEARANCE_DURATION) {
          var progress = delta / DISCO_GLOW_APPEARANCE_DURATION;
          this.layers["default"].opacity = 170 + 85 * progress;
          this.layers.spine.opacity = 255 * progress;
          this.layers.discoHighlight.opacity = 255 * progress;
          scale *= progress;
        }
        this.node.scale = (Math.cos((this.app.now - data.start) / DISCO_PULSE_SPEED) / 200 * scale + .01 * (100 - scale)) * ITEM_SCALE;
      },
      unhighlightDisco: function unhighlightDisco() {
        this.layers.discoHighlight.destroy();
        delete this.layers.discoHighlight;
        this.layers["default"].opacity = 255;
        delete this.onUpdate.discoPulse;
        this._onUpdateCleanup();
      },
      _teacupExplode: function _teacupExplode(reason, resolve) {
        this.node.opacity = 0;
        var spine = cc.instantiate(this.teacupFX);
        this.gameBoard.view.addChild(spine);
        spine.zIndex = Z_INDEX.CRATE_EXPLOSION;
        spine.x = this.node.x;
        spine.y = this.node.y;
        spine.scale = 1.22 * ITEM_SCALE;
        spine.angle = 8 * Math.random() - 4;
        var anim = spine.getComponent(sp.Skeleton);
        anim.timeScale *= .3 * Math.random() + 1;
        anim.setAnimation(0, "teacup", false);
        anim.setCompleteListener(function() {
          spine.destroy();
        });
        return this._defaultExplode(reason, resolve, false);
      },
      destroyFromBoard: function destroyFromBoard() {
        this.node.parent.removeChild(this.node);
        if (this.bounceTween) {
          this.bounceTween.stop();
          this.bounceTween = null;
        }
        this.node.destroy();
      },
      isBasicType: function isBasicType() {
        return this.type === GAME_ITEM_TYPE.basic1 || this.type === GAME_ITEM_TYPE.basic2 || this.type === GAME_ITEM_TYPE.basic3 || this.type === GAME_ITEM_TYPE.basic4 || this.type === GAME_ITEM_TYPE.basic5;
      },
      isPowerUpType: function isPowerUpType() {
        return this.type === GAME_ITEM_TYPE.missiles1 || this.type === GAME_ITEM_TYPE.missiles2 || this.type === GAME_ITEM_TYPE.discoball || this.type === GAME_ITEM_TYPE.sniper || this.type === GAME_ITEM_TYPE.bomb;
      },
      isIdle: function isIdle() {
        if (this.isDying) return false;
        if (this.isSwitching) return false;
        if (this.lockedForDiscoball) return false;
        if (this.locksForUpcomingMatch) return false;
        if (this.shouldExplode) return false;
        if (this.cascade && this.cascade.isCascading) return false;
        return true;
      },
      startHint: function startHint() {
        var _this7 = this;
        this.onUpdate || (this.onUpdate = {});
        this.onUpdate.hintShake = {
          data: {
            shakeUntil: this.app.now + 1e3,
            resolve: function resolve() {
              _this7.node.angle = 0;
              _this7.layers[_this7.currentLayerId].x = 0;
              _this7.layers[_this7.currentLayerId].y = 0;
              delete _this7.onUpdate.hintShake;
              _this7._onUpdateCleanup();
            }
          },
          update: function update(dt, data) {
            if (_this7.app.now >= data.shakeUntil) return data.resolve();
            _this7.layers[_this7.currentLayerId].x = 10 * _this7.app.noise.noise2D(_this7.app.now / 130, 20 * _this7.uid);
            _this7.layers[_this7.currentLayerId].y = 10 * _this7.app.noise.noise2D(_this7.app.now / 130, 30 * _this7.uid);
          }
        };
      },
      stopHint: function stopHint() {
        this.onUpdate && this.onUpdate.hintShake && this.onUpdate.hintShake.data.resolve();
      },
      bounce: function bounce() {
        var _this8 = this;
        this.bounceTween = cc.tween(this.layersContainer).to(.08, {
          y: -24,
          scaleY: .875,
          scaleX: 1.1
        }, {
          easing: "cubicOut"
        }).to(.56, {
          y: 0,
          scaleY: 1,
          scaleX: 1
        }, {
          easing: "elasticOut"
        }).call(function() {
          _this8.bounceTween = null;
        }).start();
      },
      _addLayers: function _addLayers(layers) {
        for (var layerId in layers) {
          this.layers[layerId] && console.error("GameItem: a layer id " + layerId + " already exists");
          var elementToAdd = layers[layerId];
          if (elementToAdd instanceof cc.SpriteFrame) {
            this.layers[layerId] = _helpers["default"].createSprite({
              spriteFrame: elementToAdd,
              width: this.node.width,
              height: this.node.height,
              view: this.layersContainer
            });
            if ("shadow" === layerId) {
              this.layers[layerId].x = 13;
              this.layers[layerId].y = -13;
              this.layers[layerId].opacity = 128;
              this.layers.shadow.width = ITEM_SHADOW_SIZE;
              this.layers.shadow.height = ITEM_SHADOW_SIZE;
            }
          } else if (elementToAdd instanceof cc.Node) {
            this.layers[layerId] = elementToAdd;
            this.layersContainer.addChild(elementToAdd);
          } else console.error("Impossible to add the following as a GameItem layer:", elementToAdd);
        }
      },
      _checkLifePoints: function _checkLifePoints() {
        if (this.lifePoints < 0) {
          console.error("an item reached negative life points");
          this.lifePoints = 0;
        }
      },
      _onUpdateCleanup: function _onUpdateCleanup() {
        Object.keys(this.onUpdate).length || (this.onUpdate = null);
      },
      _onDestroyCb: function _onDestroyCb() {
        this.onDestroyCb && this.type && this.onDestroyCb(this.type);
      }
    });
    cc._RF.pop();
  }, {
    "../../constants.js": "constants",
    "../../helpers.js": "helpers",
    "./bumper.js": "bumper",
    "./cabinet.js": "cabinet",
    "./simpleCrate.js": "simpleCrate",
    "./underlay.js": "underlay"
  } ],
  GameTile: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "383a9hlWQJBd4i5TQ4psKXx", "GameTile");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        oddBg: {
          default: null,
          type: cc.SpriteFrame
        },
        evenBg: {
          default: null,
          type: cc.SpriteFrame
        }
      },
      ctor: function ctor() {
        this.boardX = null;
        this.boardY = null;
      },
      setBg: function setBg(isOdd) {
        this.node.getComponent(cc.Sprite).spriteFrame = isOdd ? this.oddBg : this.evenBg;
      }
    });
    cc._RF.pop();
  }, {} ],
  Game: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "34330nubVdEFoykqwfo2QXI", "Game");
    "use strict";
    var _catModels = _interopRequireDefault(require("../models/catModels.js"));
    var _cats = _interopRequireDefault(require("../staticData/cats.js"));
    var _constants = _interopRequireDefault(require("../constants.js"));
    var _GameBoard = _interopRequireDefault(require("../gameplay/GameBoard.js"));
    var _levelModel = _interopRequireDefault(require("../models/levelModel.js"));
    var _supplyModel = _interopRequireDefault(require("../models/supplyModel.js"));
    var _userState = _interopRequireDefault(require("../userState"));
    var _powerUpItem = _interopRequireDefault(require("../staticData/powerUpItem.js"));
    var _confettiFx = _interopRequireDefault(require("../confettiFx.js"));
    var _main = require("../staticData/levels/main.js");
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    function _createForOfIteratorHelperLoose(o, allowArrayLike) {
      var it;
      if ("undefined" === typeof Symbol || null == o[Symbol.iterator]) {
        if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && "number" === typeof o.length) {
          it && (o = it);
          var i = 0;
          return function() {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          };
        }
        throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }
      it = o[Symbol.iterator]();
      return it.next.bind(it);
    }
    function _unsupportedIterableToArray(o, minLen) {
      if (!o) return;
      if ("string" === typeof o) return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      "Object" === n && o.constructor && (n = o.constructor.name);
      if ("Map" === n || "Set" === n) return Array.from(o);
      if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }
    function _arrayLikeToArray(arr, len) {
      (null == len || len > arr.length) && (len = arr.length);
      for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
      return arr2;
    }
    var IPAD_RATIO = _constants["default"].IPAD_RATIO, DEBUG = _constants["default"].DEBUG;
    var _constants$GAMEPLAY = _constants["default"].GAMEPLAY, TILE_SIZE = _constants$GAMEPLAY.TILE_SIZE, ITEM_SIZE = _constants$GAMEPLAY.ITEM_SIZE;
    var TOP_AREA_HEIGHT = 320;
    var BOT_AREA_HEIGHT = 226;
    var TOPBG_TOP_MARGIN = 30;
    var TOPBG_BOT_MARGIN = 20;
    var MIN_UI_SCALE = .7;
    var CAT_APPEAR_X = 300;
    var CAT_EXCITED_COMBO = 16;
    cc.Class({
      extends: cc.Component,
      properties: {
        GameTile: {
          default: null,
          type: cc.Prefab
        },
        GameItem: {
          default: null,
          type: cc.Prefab
        },
        GameItemSpawner: {
          default: null,
          type: cc.Prefab
        },
        SpriteCollection: {
          default: null,
          type: cc.Prefab
        },
        brownFont: {
          default: null,
          type: cc.Font
        },
        redFont: {
          default: null,
          type: cc.Font
        },
        confetiiFx: [ _confettiFx["default"] ]
      },
      onLoad: function onLoad() {
        var _this = this;
        this.app = cc.find("app").getComponent("app");
        this.app.info("Game.js - onLoad");
        this.app.IS_DEVELOPMENT && (globalThis.game = this);
        var currentLevel = _userState["default"].getProgression();
        this.turns = 0;
        this.extraLifes = 0;
        this.isGameEnded = false;
        this.isGameWon = false;
        this.scaleContainer = this.node.getChildByName("scaleContainer");
        this.gameBoardContainer = this.scaleContainer.getChildByName("gameBoardContainer");
        this.spriteCollection = cc.instantiate(this.SpriteCollection).getComponent("SpriteCollection");
        this.topUI = this.scaleContainer.getChildByName("top");
        this.catSpine = this.topUI.getChildByName("cat").getComponent(sp.Skeleton);
        this.catBoardAttachment = this.catSpine.findSlot("Cat_Bella/top").attachment;
        this.bottomUI = this.scaleContainer.getChildByName("bottom");
        this.boosterFrame = this.bottomUI.getChildByName("boosterFrame");
        this.boosterController = this.boosterFrame.getComponent("BoosterController");
        this.boosterOverlay = this.boosterFrame.getChildByName("container").getChildByName("overlay");
        this.boosterContent = this.boosterOverlay.getChildByName("content");
        var levelLabel = this.topUI.getChildByName("levelLabel").getComponent(cc.Label);
        this.objectiveController = this.topUI.getChildByName("objectiveFrame").getComponent("ObjectiveController");
        this.tutorialController = this.scaleContainer.getChildByName("Tutorial").getComponent("TutorialController");
        this.result = this.scaleContainer.getChildByName("Result").getComponent("ResultController");
        this.confirmation = this.scaleContainer.getChildByName("Confirmation").getComponent("ConfirmationController");
        this.selectionPopup = this.scaleContainer.getChildByName("SelectionPopup").getComponent("StartSelectionPopup");
        this.pausePopup = this.scaleContainer.getChildByName("PausePopup").getComponent("PausePopup");
        this.pauseButton = this.topUI.getChildByName("pauseButton").getComponent(cc.Button);
        this.quitConfirmation = this.scaleContainer.getChildByName("QuitConfirmation").getComponent("QuitConfirmationPopup");
        this.boosterUnlockPopup = this.scaleContainer.getChildByName("BoosterUnlockPopup").getComponent("BoosterUnlockPopup");
        this.postTutorialInterval = null;
        this.gameBoard = null;
        if (_userState["default"].hasReachedEnd()) {
          globalThis.endGameRandomLevel || (globalThis.endGameRandomLevel = _main.endGameRandomLevels[Math.floor(Math.random() * _main.endGameRandomLevels.length)]);
          currentLevel = globalThis.endGameRandomLevel;
        }
        this.levelData = _levelModel["default"].getLevel(DEBUG.TEST_LEVEL || currentLevel);
        if (!this.levelData) {
          console.error("No level data found");
          return;
        }
        this.createBoard(this.levelData);
        this.turns = this.levelData.turns || 0;
        this.selectedCat = null;
        this.result.node.active = true;
        this.confirmation.node.active = true;
        this.selectionPopup.node.active = true;
        this.pausePopup.node.active = true;
        this.tutorialController.node.active = true;
        this.quitConfirmation.node.active = true;
        this.boosterUnlockPopup.node.active = true;
        void 0 === this.catBoardAttachment.relativeX && (this.catBoardAttachment.relativeX = this.catBoardAttachment.x + this.catSpine.node.x);
        this.catSpine.state = "IDLE";
        this.catSpine.isExcited = false;
        this.catSpine.idleTimer = 0;
        this.catWatchingCombo = 0;
        this.lastCombo = 0;
        this.catSpine.setMix("Cat_idle", "Cat_excited", .5);
        this.catSpine.setMix("Cat_nervous", "Cat_excited", .5);
        this.objectiveController.loadObjectives(this.levelData.objectives, this.onObjectiveCompleted.bind(this));
        levelLabel.string = "LEVEL " + this.levelData.levelNumber;
        this.result.init({
          onHome: this.loadHome.bind(this),
          onTryAgain: this.reloadGame.bind(this),
          onNextLevel: this.reloadGame.bind(this)
        });
        this.pausePopup.init({
          onHome: function onHome() {
            if (0 === ~_userState["default"].getHeart().value) {
              _this.loadHome();
              return;
            }
            var onHomeAction = function onHomeAction() {
              _userState["default"].addHeart(-1);
              _this.loadHome();
            };
            _this.showQuitGameConfirmation(onHomeAction);
          },
          onRestart: function onRestart() {
            if (0 === ~_userState["default"].getHeart().value) return;
            var onReloadAction = function onReloadAction() {
              _userState["default"].addHeart(-1);
              _this.reloadGame();
            };
            _this.showQuitGameConfirmation(onReloadAction);
          }
        });
        this.boosterUnlockPopup.onClose = this.onBoosterUnlockPopupClosed.bind(this);
        this.tutorialController.init(DEBUG.TEST_LEVEL || currentLevel, {
          gameBoard: this.gameBoard,
          topUI: this.topUI,
          bottomUI: this.bottomUI,
          boosterController: this.boosterController
        });
        this.gameBoard.lockUserInteraction("startSelection");
        if (this.app.catTutorial.getCurrentStep() <= 1 || DEBUG.SKIP_SELECTION_POPUP) {
          this.onStartSelectionClosed();
          this.selectionPopup.node.active = false;
        } else {
          this.selectionPopup.init({
            onClose: this.onStartSelectionClosed.bind(this),
            onHome: this.loadHome.bind(this)
          });
          this.catSpine.node.x -= CAT_APPEAR_X;
          this.catBoardAttachment.x = this.catBoardAttachment.relativeX - this.catSpine.node.x;
          this.catBoardAttachment.updateOffset();
          setTimeout(function() {
            _this.selectionPopup.show(_this.levelData);
          }, 200);
        }
        this.gameBoardContainer.on(cc.Node.EventType.TOUCH_START, this.gameBoard.onTouchStart, this.gameBoard);
        this.gameBoardContainer.on(cc.Node.EventType.TOUCH_MOVE, this.gameBoard.onTouchMove, this.gameBoard);
        this.gameBoardContainer.on(cc.Node.EventType.TOUCH_END, this.gameBoard.onTouchEnd, this.gameBoard);
        this.gameBoardContainer.on(cc.Node.EventType.TOUCH_CANCEL, this.gameBoard.onTouchCancel, this.gameBoard);
        this.pauseButton.node.on("click", this.onPauseClicked, this);
        _userState["default"].getStates().isFirstPlay && _userState["default"].updateFirstPlayValue(false);
        this.app.setSceneVisible(this);
      },
      onDestroy: function onDestroy() {
        this.app.info("Game.js - onDestroy");
        if (this.postTutorialInterval) {
          this.app.scheduler.clearInterval(this.postTutorialInterval);
          this.postTutorialInterval = null;
        }
        this.gameBoardContainer.off(cc.Node.EventType.TOUCH_START, this.gameBoard.onTouchStart, this.gameBoard);
        this.gameBoardContainer.off(cc.Node.EventType.TOUCH_MOVE, this.gameBoard.onTouchMove, this.gameBoard);
        this.gameBoardContainer.off(cc.Node.EventType.TOUCH_END, this.gameBoard.onTouchEnd, this.gameBoard);
        this.gameBoardContainer.off(cc.Node.EventType.TOUCH_CANCEL, this.gameBoard.onTouchCancel, this.gameBoard);
        this.app.setSceneHidden(this);
      },
      endGame: function endGame(isWon) {
        this.isGameEnded = true;
        this.isGameWon = isWon;
        this.boosterController.lockUserInteraction();
        this.gameBoard.lockUserInteraction("endGame");
        this.gameBoard.updateIdleState();
        if (this.gameBoard.isIdle) if (this.extraLifes) {
          this.triggerExtraLifeAbilities();
          this.isGameEnded = false;
          this.boosterController.unlockUserInteraction();
          this.gameBoard.unlockUserInteraction("endGame");
        } else this.showResult();
        window.removeEventListener("beforeunload", this.onReloadGame);
      },
      onMoveTriggered: function onMoveTriggered() {
        this.app.audioManager.playSfx("cube_exchange");
        this.turns = Math.max(0, this.turns - 1);
        this.catSpine.state = this.turns <= 5 ? "NERVOUS" : "IDLE";
        this.turnNumLabel.string = this.turns;
        0 === this.turns && this.endGame(false);
      },
      onBoardIdle: function onBoardIdle() {
        this.catWatchingCombo = 0;
        this.tutorialController.triggerTutorial();
        if (this.isGameEnded) if (!this.isGameWon && this.extraLifes) {
          this.triggerExtraLifeAbilities();
          this.isGameEnded = false;
          this.boosterController.unlockUserInteraction();
          this.gameBoard.unlockUserInteraction("endGame");
        } else this.showResult();
        this.lastCombo = 0;
      },
      onCombo: function onCombo(comboInfo) {
        this.app.audioManager.playSfx("cube_explosion");
        this.catWatchingCombo += comboInfo.items.length;
        if (this.catWatchingCombo >= CAT_EXCITED_COMBO && !this.catSpine.isExcited) {
          this.catSpine.isExcited = true;
          this.catWatchingCombo = 0;
        }
      },
      showResult: function showResult() {
        if (!this.result.isShowing) {
          var _this$levelData$rewar, _this$levelData$rewar2;
          this.result.setNextButtonState(this.levelData.id === DEBUG.TEST_LEVEL || _levelModel["default"].hasNextLevel(this.levelData.id));
          var baseCoinReward = (null == (_this$levelData$rewar = this.levelData.rewards) ? void 0 : _this$levelData$rewar.coin) || 0;
          var coinBonus = 5 * this.turns;
          var rewardedCoin = baseCoinReward + coinBonus;
          var rewardedStar = (null == (_this$levelData$rewar2 = this.levelData.rewards) ? void 0 : _this$levelData$rewar2.star) || 0;
          var unlockedData = null;
          if (this.isGameWon) {
            unlockedData = _supplyModel["default"].getNewSupplyByLevel(this.levelData.levelNumber);
            _userState["default"].updateCoin(rewardedCoin);
            _supplyModel["default"].updateSupplyData();
            this.levelData.unlockedBoosters && this.boosterController.unlockBoosters(this.levelData.unlockedBoosters);
          }
          _userState["default"].addHeart(this.isGameWon ? 0 : -1);
          this.pausePopup.isShowing && this.pausePopup.hide(true);
          var performance = {
            isWon: this.isGameWon,
            star: rewardedStar,
            coin: rewardedCoin,
            turnLeftCoinValue: coinBonus,
            turnLeft: this.turns,
            baseReward: baseCoinReward,
            unlockedData: unlockedData
          };
          if (globalThis.GAMESNACKS) {
            this.isGameWon ? GAMESNACKS.levelComplete(this.levelData.levelNumber) : GAMESNACKS.gameOver();
            GAMESNACKS.sendScore(this.levelData.levelNumber);
          }
          this.unlockItem(unlockedData);
          this.app.catTutorial.triggerStep(0) && this.app.catTutorial.completeStep(0);
          this.result.show(performance, this.levelData, true);
          this.gameBoard.gameFinished();
          1 === this.app.catTutorial.getCurrentStep() && this.app.catTutorial.completeStep(2);
          3 === this.app.catTutorial.getCurrentStep() && this.app.catTutorial.completeStep(4);
        }
      },
      unlockItem: function unlockItem(unlockedData) {
        if (!unlockedData || !unlockedData.items || 0 === unlockedData.items.length) return;
        var defaultPos = {
          x: -1,
          y: -1
        };
        var yardData = _userState["default"].getYard();
        for (var _iterator = _createForOfIteratorHelperLoose(unlockedData.items), _step; !(_step = _iterator()).done; ) {
          var itemId = _step.value;
          var tutorialYardItemsPos = this.app.catTutorial.getYardItemPosition();
          var yardItemPos = tutorialYardItemsPos[itemId];
          if (yardItemPos) {
            var hasOccupied = false;
            for (var key in yardData) {
              var item = yardData[key];
              if (item.x === yardItemPos.x && item.y === yardItemPos.y) {
                hasOccupied = true;
                break;
              }
            }
            yardData[itemId] = hasOccupied ? defaultPos : yardItemPos;
          } else yardData[itemId] = defaultPos;
        }
        _catModels["default"].updateLockedFavorite();
        _userState["default"].saveYard(yardData);
      },
      onGameItemDestroy: function onGameItemDestroy(type) {
        var targetDestroyed = this.objectiveController.reduceType(type);
        if (targetDestroyed) {
          this.lastCombo++;
          if (this.lastCombo > 9) for (var index = 0; index < this.confetiiFx.length; index++) {
            var fx = this.confetiiFx[index];
            if (fx.isPlaying) continue;
            fx.play();
            break;
          }
        }
      },
      onObjectiveCompleted: function onObjectiveCompleted() {
        globalThis.endGameRandomLevel = null;
        _userState["default"].stepProgression(1);
        this.endGame(true);
      },
      onPowerUpTrigger: function onPowerUpTrigger(type) {
        this._playSfxByGameItemType(type);
      },
      createBoard: function createBoard(levelData) {
        var spawnPattern = levelData.spawnPattern, pattern = levelData.pattern, underlayPattern = levelData.underlayPattern;
        this.gameBoard = new _GameBoard["default"]({
          spawnPattern: spawnPattern,
          pattern: pattern,
          underlayPattern: underlayPattern,
          view: this.gameBoardContainer,
          GameTile: this.GameTile,
          GameItem: this.GameItem,
          GameItemSpawner: this.GameItemSpawner,
          spriteCollection: this.spriteCollection,
          boosterController: this.boosterController,
          tutorialController: this.tutorialController,
          objectiveController: this.objectiveController,
          app: this.app,
          onGameItemDestroy: this.onGameItemDestroy.bind(this),
          onIdle: this.onBoardIdle.bind(this),
          onMoveTriggered: this.onMoveTriggered.bind(this),
          onBoosterModeEnd: this.boosterController.exitBoosterMode.bind(this.boosterController),
          onCombo: this.onCombo.bind(this),
          onPowerUpTrigger: this.onPowerUpTrigger.bind(this),
          availablePowerUps: {
            bomb: levelData.levelNumber >= _powerUpItem["default"].bomb.unlockedLevel,
            discoball: levelData.levelNumber >= _powerUpItem["default"].discoball.unlockedLevel,
            missiles1: levelData.levelNumber >= _powerUpItem["default"].missiles1.unlockedLevel,
            missiles2: levelData.levelNumber >= _powerUpItem["default"].missiles2.unlockedLevel,
            sniper: levelData.levelNumber >= _powerUpItem["default"].sniper.unlockedLevel
          }
        });
      },
      triggerCatStartingAbilities: function triggerCatStartingAbilities() {
        if (!this.selectedCat) return;
        var intimacyLevel = this.selectedCat.getIntimacyLevel();
        if (!intimacyLevel) return;
        if ("bella" === this.selectedCat.id) {
          this.turns += intimacyLevel;
          this.animateChangingTurnLabel();
        } else "milo" === this.selectedCat.id ? this.gameBoard.transformRandomItemsToType("sniper", intimacyLevel) : "dora" === this.selectedCat.id ? this.gameBoard.transformRandomItemsToType("missiles", intimacyLevel) : "lily" === this.selectedCat.id ? this.gameBoard.transformRandomItemsToType("bomb", intimacyLevel) : "bob" === this.selectedCat.id ? this.gameBoard.transformRandomItemsToType("discoball", intimacyLevel) : "leo" === this.selectedCat.id ? this.boosterController.preAddTemporaryBoosters("hammer", this.selectedCat.id, intimacyLevel) : "max" === this.selectedCat.id ? this.boosterController.preAddTemporaryBoosters("wheel", this.selectedCat.id, intimacyLevel) : "luna" === this.selectedCat.id && (this.extraLifes = 2 * intimacyLevel);
      },
      triggerExtraLifeAbilities: function triggerExtraLifeAbilities() {
        this.turns += this.extraLifes;
        this.catSpine.state = this.turns <= 5 ? "NERVOUS" : "IDLE";
        this.extraLifes = 0;
        this.animateChangingTurnLabel();
      },
      animateChangingTurnLabel: function animateChangingTurnLabel() {
        var _this2 = this;
        this.turnNumLabel.node.scale = 1;
        cc.tween(this.turnNumLabel.node).to(.3, {
          scale: 1.6
        }, {
          easing: "quadOut"
        }).call(function() {
          _this2.turnNumLabel.string = _this2.turns;
        }).delay(.05).to(.2, {
          scale: 1
        }, {
          easing: "linear"
        }).start();
      },
      update: function update(dt) {
        if (!this.gameBoard) return;
        this.gameBoard.update(dt);
        if (this.catSpine.isExcited) {
          if ("Cat_excited" !== this.catSpine.animation) this.catSpine.setAnimation(0, "Cat_excited", false); else if (this.catSpine.getCurrent(0).isComplete()) {
            this.catSpine.isExcited = false;
            this.catSpine.idleTimer = 0;
          }
        } else {
          this.catSpine.idleTimer -= dt;
          if (this.catSpine.getCurrent(0).isComplete() && this.catSpine.idleTimer < 0) {
            this.catSpine.idleTimer = this.catSpine.getCurrent(0).animation.duration + Math.random();
            this.catSpine.setAnimation(0, "NERVOUS" === this.catSpine.state ? "Cat_nervous" : "Cat_idle", false);
          }
        }
        if (this.turns <= 5 && !this.isGameEnded) {
          this.turnNumLabel.node.scale = .9 + (Math.cos(this.app.now / 150) + 1) / 5;
          this.turnNumLabel.beating = true;
          this.turnNumLabel.font = this.redFont;
        } else if (this.turnNumLabel.beating) {
          this.turnNumLabel.node.scale = 1;
          this.turnNumLabel.beating = false;
          this.turnNumLabel.font = this.brownFont;
        }
      },
      updateScreenSize: function updateScreenSize(frame) {
        if (frame.ratio > IPAD_RATIO) {
          this.scaleContainer.height = 1024 / IPAD_RATIO;
          this.scaleContainer.scale = frame.height / this.scaleContainer.height;
        } else {
          this.scaleContainer.scale = frame.width / 1024;
          this.scaleContainer.height = frame.height / this.scaleContainer.scale;
        }
        var topBg = this.scaleContainer.getChildByName("topBg");
        var uiTotalHeight = BOT_AREA_HEIGHT + TOP_AREA_HEIGHT + this.topUI.height - TOPBG_TOP_MARGIN - TOPBG_BOT_MARGIN;
        var uiScale = 1;
        var gameBoardMaxWidth = 1013.76;
        var gameBoardMaxHeight = this.scaleContainer.height - uiTotalHeight;
        var gameBoardMaxSide;
        if (gameBoardMaxHeight >= gameBoardMaxWidth) gameBoardMaxSide = gameBoardMaxWidth; else {
          uiScale = Math.max(gameBoardMaxHeight / gameBoardMaxWidth, MIN_UI_SCALE);
          gameBoardMaxSide = this.scaleContainer.height - uiTotalHeight * uiScale;
        }
        topBg.y = .5 * this.scaleContainer.height;
        var turnFrame = topBg.getChildByName("turnFrame");
        turnFrame.x = 512;
        turnFrame.y = 0;
        turnFrame.scale = uiScale;
        this.turnNumLabel = turnFrame.getChildByName("turnLabel").getComponent(cc.Label);
        this.turnNumLabel.string = this.turns;
        this.topUI.scale = uiScale;
        this.topUI.width = 1049 / uiScale;
        this.topUI.y = this.scaleContainer.height / 2 - (TOP_AREA_HEIGHT - TOPBG_TOP_MARGIN) * uiScale;
        this.pauseButton.node.x = 512 - 80 * uiScale;
        this.catBoardAttachment.width = this.topUI.width;
        this.catBoardAttachment.updateOffset();
        var wallpaper = this.scaleContainer.getChildByName("wallpaper");
        wallpaper.y = -this.scaleContainer.height / 2;
        wallpaper.height = this.scaleContainer.height - TOP_AREA_HEIGHT * uiScale;
        var MAX_SIZE_OF_BOARD = 9;
        this.gameBoardContainer.scale = gameBoardMaxSide / (TILE_SIZE * MAX_SIZE_OF_BOARD);
        this.gameBoardContainer.width = TILE_SIZE * MAX_SIZE_OF_BOARD;
        this.gameBoardContainer.height = TILE_SIZE * MAX_SIZE_OF_BOARD;
        this.gameBoardContainer.y = (BOT_AREA_HEIGHT - TOP_AREA_HEIGHT - this.topUI.height + TOPBG_TOP_MARGIN + TOPBG_BOT_MARGIN) * uiScale * .5;
        this.bottomUI.y = -this.scaleContainer.height / 2;
        this.boosterFrame.scale = uiScale;
        this.boosterOverlay.height = (this.scaleContainer.height + 300) / uiScale;
        this.boosterOverlay.width = this.scaleContainer.width / uiScale;
        this.boosterContent.y = this.boosterOverlay.height - .5 * this.boosterContent.height - 300 / uiScale;
        this.tutorialController.node.width = this.scaleContainer.width;
        this.tutorialController.node.height = this.scaleContainer.height;
        this.tutorialController.updateScreenSize(frame, uiScale);
        this.result.updateScreenSize(frame);
        this.confirmation.updateScreenSize();
        this.boosterUnlockPopup.updateScreenSize(frame, uiScale);
        this.quitConfirmation.updateScreenSize();
      },
      loadHome: function loadHome() {
        !globalThis.GAMESNACKS || this.isGameEnded || this.isGameWon || GAMESNACKS.gameOver();
        this.gameBoard.destroy();
        this.app.changeScene(this, "Home");
      },
      reloadGame: function reloadGame() {
        !globalThis.GAMESNACKS || this.isGameEnded || this.isGameWon || GAMESNACKS.gameOver();
        this.gameBoard.destroy();
        this.app.reloadScene();
      },
      onEnable: function onEnable() {
        this.app.info("Game.js - onEnable");
      },
      start: function start() {
        this.app.info("Game.js - start");
        this.app.audioManager.playGameplayMusic();
      },
      onDisable: function onDisable() {
        this.app.info("Game.js - onDisable");
      },
      onStartSelectionClosed: function onStartSelectionClosed() {
        var catId = _userState["default"].getSelectedCat();
        catId && this.catSpine.setSkin("Cat_" + _cats["default"][catId].name);
        this.selectedCat = _catModels["default"].getCat(catId);
        this.boosterController.init({
          gameBoard: this.gameBoard,
          tutorialController: this.tutorialController,
          level: this.levelData
        });
        this.boosterFrame.y -= 300;
        if (this.levelData.tutorialBoosters) {
          this.boosterController.addTutorialBoosters(this.levelData.tutorialBoosters);
          var boosterBonusData = Object.entries(this.levelData.tutorialBoosters)[0];
          this.boosterUnlockPopup.show({
            id: boosterBonusData[0],
            amount: boosterBonusData[1]
          });
        } else this.startGame();
      },
      onBoosterUnlockPopupClosed: function onBoosterUnlockPopupClosed() {
        this.startGame();
      },
      startGame: function startGame() {
        var _this3 = this;
        this.tutorialController.hasTutorial ? this.postTutorialInterval = this.app.scheduler.setInterval(function() {
          if (!_this3.tutorialController.hasTutorial) {
            _this3.app.scheduler.clearInterval(_this3.postTutorialInterval);
            _this3.gameBoard.lockUserInteraction("triggerCatAbility");
            _this3.postTutorialInterval = _this3.app.scheduler.setInterval(function() {
              if (_this3.gameBoard.isIdle) {
                _this3.app.scheduler.clearInterval(_this3.postTutorialInterval);
                _this3.postTutorialInterval = null;
                _this3.triggerCatStartingAbilities();
                _this3.gameBoard.unlockUserInteraction("triggerCatAbility");
              }
            }, 250);
          }
        }, 100) : this.triggerCatStartingAbilities();
        this.boosterController.setUpItems();
        this.app.IS_DEVELOPMENT && this.app.enableX3Turn && (this.turns *= 3);
        cc.tween(this.catSpine.node).by(.8, {
          x: CAT_APPEAR_X
        }, {
          easing: "quintOut",
          progress: function progress(start, end, current, ratio) {
            var value = start + (end - start) * ratio;
            _this3.catBoardAttachment.x = _this3.catBoardAttachment.relativeX - value;
            _this3.catBoardAttachment.updateOffset();
            return value;
          }
        }).start();
        var boosterFrameOriginY = this.boosterFrame.y + 300;
        cc.tween(this.boosterFrame).to(.5, {
          y: boosterFrameOriginY
        }, {
          easing: "quadOut"
        }).start();
        window.addEventListener("beforeunload", this.onReloadGame);
        setTimeout(function() {
          if (!_this3.gameBoard) return;
          _this3.gameBoard.unlockUserInteraction("startSelection");
          _this3.gameBoard.checkMatchesRequest = true;
          _this3.tutorialController.triggerTutorial();
        }, 400);
      },
      onReloadGame: function onReloadGame() {
        if (this.isGameEnded) return;
        if (!this.app.catTutorial.hasCompleted()) return;
        _userState["default"].addHeart(-1);
      },
      onPauseClicked: function onPauseClicked() {
        if (this.tutorialController.isTutorialShowing) return;
        this.app.audioManager.playSfx("click");
        this.pausePopup.show(true);
      },
      showQuitGameConfirmation: function showQuitGameConfirmation(continueAction) {
        this.quitConfirmation.show(continueAction, true);
      },
      _playSfxByGameItemType: function _playSfxByGameItemType(type) {
        "bomb" === type && this.app.audioManager.playSfx("bomb_explosion");
        "sniper" === type && this.app.audioManager.playSfx("frisbee_launch");
        "discoball" === type && this.app.audioManager.playSfx("lightBall_launch");
        "missiles1" !== type && "missiles2" != type || this.app.audioManager.playSfx("rocket_launch");
      }
    });
    cc._RF.pop();
  }, {
    "../confettiFx.js": "confettiFx",
    "../constants.js": "constants",
    "../gameplay/GameBoard.js": "GameBoard",
    "../models/catModels.js": "catModels",
    "../models/levelModel.js": "levelModel",
    "../models/supplyModel.js": "supplyModel",
    "../staticData/cats.js": "cats",
    "../staticData/levels/main.js": "main",
    "../staticData/powerUpItem.js": "powerUpItem",
    "../userState": "userState"
  } ],
  GiftPopup: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f2a11hgLypJ9qwMEHs5s+mY", "GiftPopup");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        gift_1: {
          default: null,
          type: cc.SpriteFrame
        },
        gift_2: {
          default: null,
          type: cc.SpriteFrame
        },
        gift_3: {
          default: null,
          type: cc.SpriteFrame
        }
      },
      onLoad: function onLoad() {
        this.app = cc.find("app").getComponent("app");
        this.content = this.node.getChildByName("content");
        this.popup = this.content.getChildByName("popup");
        this.frame = this.popup.getChildByName("frame");
        this.okButton = this.frame.getChildByName("okButton");
        this.innerFrame = this.frame.getChildByName("innerFrame");
        this.giftFrame = this.innerFrame.getChildByName("giftFrame");
        this.lightMask = this.giftFrame.getChildByName("lightMask");
        this.light = this.lightMask.getChildByName("light");
        this.okButton.on("click", this.onCloseClicked, this);
      },
      update: function update(dt) {
        this.light.angle += 20 * dt;
        this.light.scale = .9 + .05 * Math.sin(this.app.now / 1e3 * 4);
      },
      show: function show(cat) {
        var _this = this;
        this.backer = this.node.getChildByName("backer");
        this.content = this.node.getChildByName("content");
        this.popup = this.content.getChildByName("popup");
        this.frame = this.popup.getChildByName("frame");
        this.confetti = this.content.getChildByName("confetti");
        this.congrat = this.content.getChildByName("congratulations");
        this.innerFrame = this.frame.getChildByName("innerFrame");
        this.giftFrame = this.innerFrame.getChildByName("giftFrame");
        this.lightMask = this.giftFrame.getChildByName("lightMask");
        this.gift = this.lightMask.getChildByName("gift").getComponent(cc.Sprite);
        this.skillFrame = this.innerFrame.getChildByName("skillFrame");
        this.skillLabel = this.skillFrame.getChildByName("label").getComponent(cc.Label);
        var showCongrat = (null == cat ? void 0 : cat.isMaxed()) || false;
        var giftLevel = (null == cat ? void 0 : cat.getIntimacyLevel()) || 0;
        var skillDesc = (null == cat ? void 0 : cat.getCurrentSkillDesc()) || "";
        this.node.active = true;
        this.animating = true;
        this.gift.spriteFrame = this["gift_" + giftLevel];
        this.skillLabel.string = skillDesc;
        var CONGRAT_DELAY = showCongrat ? .5 : 0;
        var POPUP_DURATION = showCongrat ? .5 : .6;
        var GIFT_DELAY = POPUP_DURATION;
        this.backer.opacity = 0;
        cc.tween(this.backer).to(.3, {
          opacity: 200
        }, {
          easing: "quadOut"
        }).start();
        this.congrat.active = false;
        if (showCongrat) {
          this.congrat.active = true;
          this.congrat.scale = 0;
          cc.tween(this.congrat).delay(CONGRAT_DELAY).to(.4, {
            scale: 1,
            opacity: 255
          }, {
            easing: "backOut"
          }).start();
        }
        this.popup.active = true;
        this.popup.scale = 0;
        this.popup.opacity = 0;
        cc.tween(this.popup).to(POPUP_DURATION, {
          scale: 1,
          opacity: 255
        }, {
          easing: "backOut"
        }).start();
        this.gift.node.scale = 0;
        cc.tween(this.gift.node).delay(GIFT_DELAY).to(POPUP_DURATION, {
          scale: 1
        }, {
          easing: "backOut"
        }).start();
        this.confetti.active = false;
        if (showCongrat) {
          this.confetti.active = true;
          this.confetti.children.forEach(function(paper) {
            var temp_X = paper.x;
            var temp_Y = paper.y;
            var temp_angle = paper.angle;
            var time = .8 + .4 * Math.random();
            var movementY = 400 + 100 * Math.random();
            var movementX = .5 * paper.x + .5 * paper.x * Math.random();
            var rotation = 90 * Math.random();
            paper.x -= movementX;
            paper.y -= movementY;
            paper.opacity = 0;
            cc.tween(paper).delay(.1 + CONGRAT_DELAY).by(.8 * time, {
              x: movementX
            }, {
              easing: "cubicOut"
            }).start();
            cc.tween(paper).delay(.1 + CONGRAT_DELAY).to(.1 * time, {
              opacity: 255
            }).delay(.6 * time).to(.3 * time, {
              opacity: 0
            }).start();
            cc.tween(paper).delay(.1 + CONGRAT_DELAY).by(time, {
              angle: rotation
            }, {
              easing: "linear"
            }).start();
            cc.tween(paper).delay(.1 + CONGRAT_DELAY).by(.4 * time, {
              y: movementY
            }, {
              easing: "cubicOut"
            }).delay(.05).by(.8 * time, {
              y: -movementY
            }, {
              easing: "quadIn"
            }).call(function() {
              paper.x = temp_X;
              paper.y = temp_Y;
              paper.angle = temp_angle;
            }).start();
          });
        }
        setTimeout(function() {
          _this.animating = false;
        }, 1e3 * (POPUP_DURATION + CONGRAT_DELAY));
      },
      hide: function hide(animate) {
        var _this2 = this;
        void 0 === animate && (animate = true);
        if (!animate) {
          this.node.active = false;
          return;
        }
        this.animating = true;
        var POPUP_DURATION = .3;
        var POPUP_DELAY = this.congrat.active ? .2 : 0;
        this.congrat.active && cc.tween(this.congrat).to(.4, {
          scale: 0,
          opacity: 0
        }, {
          easing: "sineOut"
        }).call(function() {
          _this2.congrat.active = false;
        }).start();
        cc.tween(this.backer).delay(POPUP_DELAY).to(POPUP_DURATION, {
          opacity: 0
        }, {
          easing: "quadOut"
        }).start();
        cc.tween(this.popup).delay(POPUP_DELAY + .1).to(POPUP_DURATION, {
          scale: 0,
          opacity: 0
        }, {
          easing: "sineOut"
        }).call(function() {
          _this2.animating = false;
          _this2.node.active = false;
          _this2.popup.active = false;
        }).start();
      },
      updateScreenSize: function updateScreenSize(frame, uiScale) {
        this.content = this.node.getChildByName("content");
        this.content.scale = uiScale;
        this.content.y = -100 * uiScale;
      },
      onCloseClicked: function onCloseClicked() {
        this.app.audioManager.playSfx("click");
        !this.animating && this.hide();
      }
    });
    cc._RF.pop();
  }, {} ],
  HeartFrameView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3938dayqW1JjKHAqTF2q6QA", "HeartFrameView");
    "use strict";
    var _constants = _interopRequireDefault(require("../constants"));
    var _helpers = _interopRequireDefault(require("../helpers"));
    var _userState = _interopRequireDefault(require("../userState"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        this.heartLabel = this.node.getChildByName("heartValueLabel").getComponent(cc.Label);
        this.hearCountDownLabel = this.node.getChildByName("heartCountdownLabel").getComponent(cc.Label);
      },
      addOnChangedListner: function addOnChangedListner(action) {
        this.onChanged = action;
      },
      update: function update(dt) {
        if (_userState["default"].getHeart().value >= _constants["default"].USER_INIT_DATA.MAX_HEART) {
          this.heartLabel.string = _constants["default"].USER_INIT_DATA.MAX_HEART;
          this.hearCountDownLabel.string = "--:--";
          return;
        }
        var heartValue = ~~_userState["default"].getHeart().value;
        this.lastHeartValue !== heartValue && this.onChanged && this.onChanged();
        this.heartLabel.string = heartValue;
        this.lastHeartValue = heartValue;
        var duration = _userState["default"].getHeartRefillDuration();
        this.hearCountDownLabel.string = _helpers["default"].formatTwoLargestUnit(duration);
      }
    });
    cc._RF.pop();
  }, {
    "../constants": "constants",
    "../helpers": "helpers",
    "../userState": "userState"
  } ],
  HomeSubscene: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f6578s1vlpFybbpFit9Cmm+", "HomeSubscene");
    "use strict";
    var _constants = _interopRequireDefault(require("../../constants"));
    var _levelModel = _interopRequireDefault(require("../../models/levelModel.js"));
    var _userState = _interopRequireDefault(require("../../userState"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var PROGRESS_FRAME_OFFSET = 10;
    var START_BUTTON_OFFSET = 320;
    var PAW_TUTORIAL_OFFSET = 240;
    var ANIMATION_DURATION = .4;
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        this.app = cc.find("app").getComponent("app");
        this.home = cc.find("Canvas").getComponent("Home");
        this.subsceneController = cc.find("Canvas").getComponent("SubsceneController");
        this.progressFrame = this.node.getChildByName("ProgressFrame").getComponent("ProgressFrame");
        this.yardView = this.node.getChildByName("YardView").getComponent("YardView");
        this.startButton = this.node.getChildByName("startButton").getComponent(cc.Button);
        this.levelLabel = this.startButton.node.getChildByName("Background").getChildByName("Label").getComponent(cc.Label);
        this.levelLabelEndGame = this.startButton.node.getChildByName("Background").getChildByName("LabelEndGame").getComponent(cc.Label);
        this.pawTutorial = this.node.getChildByName("pawTutorial");
        this.editModeFrame = this.node.getChildByName("EditMode");
        this.editBottomframe = this.editModeFrame.getChildByName("bottomFrame");
        this.editBottomframeNormal = this.editBottomframe.getChildByName("frame");
        this.editBottomframeDrag = this.editBottomframe.getChildByName("dragNotification");
        this.saveButton = this.editBottomframeNormal.getChildByName("saveButton").getComponent(cc.Button);
        this.bagButton = this.editBottomframeNormal.getChildByName("bagButton").getComponent(cc.Button);
        this.homeButton = this.editModeFrame.getChildByName("homeButton").getComponent(cc.Button);
        this.quickBagPopup = this.editModeFrame.getChildByName("BagPopup");
        this.arrowTutorial = this.editBottomframeNormal.getChildByName("arrowTutorial");
        this.editBottomframeDrag.active = false;
        this.quickBagPopup.active = false;
        this.startButton.node.on("click", this.onStartGame, this);
        this.saveButton.node.on("click", this.saveClicked, this);
        this.homeButton.node.on("click", this.homeClicked, this);
        this.bagButton.node.on("click", this.bagClicked, this);
        this.app.yardViewRefreshRequest = true;
      },
      onEnable: function onEnable() {},
      start: function start() {
        var updateResult = _userState["default"].updateDailyState();
        if (this.app.yardViewRefreshRequest || updateResult) {
          this.yardView.loadItems();
          this.progressFrame.updateValues();
          this.app.yardViewRefreshRequest = false;
        }
        var catTutorial = this.app.catTutorial.triggerStep(1);
        catTutorial = catTutorial || this.app.catTutorial.triggerStep(3);
        catTutorial = catTutorial || this.app.catTutorial.triggerStep(4);
        catTutorial = catTutorial || this.app.catTutorial.triggerStep(6);
        if (!catTutorial) {
          var currentLevel = _userState["default"].getProgression();
          var levelNumber = _levelModel["default"].getLevel(currentLevel).levelNumber;
          var isYardLocked = levelNumber <= _constants["default"].UNLOCK_YARD_AFTER_LEVEL;
          if (isYardLocked) {
            this.updateUI();
            this.loadGame();
            return;
          }
        }
        this.updateUI();
        this.exitEditMode();
        var isFirstPlay = this.app.catTutorial.getCurrentStep() < 0 && _userState["default"].getStates().isFirstPlay;
        if (isFirstPlay) {
          _userState["default"].updateFirstPlayValue(false);
          this.loadGame();
          return;
        }
        if (_userState["default"].hasReachedEnd() && !globalThis.endGamePopupShown) {
          globalThis.endGamePopupShown = true;
          this.home.endGamePopup.show();
        }
      },
      updateUI: function updateUI() {
        var currentLevel = _userState["default"].getProgression();
        if (_userState["default"].hasReachedEnd()) {
          this.levelLabelEndGame.node.active = true;
          this.levelLabel.node.active = false;
          this.levelLabel.string = "LEVEL ?";
        } else {
          this.levelLabelEndGame.node.active = false;
          this.levelLabel.node.active = true;
          this.levelLabel.string = "LEVEL " + _levelModel["default"].getLevel(currentLevel).levelNumber;
        }
        this.progressFrame.updateValuesByLevel(_levelModel["default"].getLevel(currentLevel).levelNumber - 1);
      },
      updateScreenSize: function updateScreenSize(frame, uiScale) {
        this.yardView.updateScreenSize(frame, uiScale);
        this.yardView.node.scale = this.node.height / this.yardView.node.height;
        this.progressFrame.originY = .5 * this.node.height - PROGRESS_FRAME_OFFSET * uiScale;
        this.progressFrame.node.y = this.progressFrame.originY;
        this.progressFrame.node.scale = uiScale;
        this.progressFrame.updateScreenSize(frame, uiScale);
        this.startButton.originY = .5 * -this.node.height + START_BUTTON_OFFSET * uiScale;
        this.startButton.node.y = this.startButton.originY;
        this.startButton.node.scale = uiScale;
        this.editModeFrame.width = this.node.width;
        this.editModeFrame.height = this.node.height;
        this.editBottomframe.scale = uiScale;
        this.pawTutorial.originY = .5 * -this.node.height + PAW_TUTORIAL_OFFSET * uiScale;
        this.pawTutorial.y = this.pawTutorial.originY;
        this.pawTutorial.scale = uiScale;
      },
      onStartGame: function onStartGame() {
        var _this = this;
        this.app.audioManager.playSfx("click");
        ~~_userState["default"].getHeart().value > 0 ? this.loadGame() : this.home.noHeartPopup.show(function() {
          return _this.loadGame();
        });
      },
      loadGame: function loadGame() {
        var homeNode = cc.find("Canvas").getComponent("Home");
        this.app.changeScene(homeNode, "Game");
        this.app.catTutorial.onPlayNextLevel();
      },
      saveClicked: function saveClicked() {
        this.app.audioManager.playSfx("click");
        this.yardView.saveYardState();
        this.exitEditMode(true);
        this.app.catTutorial.onSaveYard();
      },
      homeClicked: function homeClicked() {
        this.app.audioManager.playSfx("click");
        this.yardView.loadItems();
        this.exitEditMode(true);
      },
      bagClicked: function bagClicked() {
        this.app.audioManager.playSfx("click");
        this.quickBagPopup.active = true;
      },
      enterEditMode: function enterEditMode(animate) {
        var _this2 = this;
        void 0 === animate && (animate = false);
        this.app.audioManager.playSfx("click");
        this.subsceneController.topUI.hide(animate);
        this.subsceneController.bottomUI.hide(animate);
        this.yardView.enterEditMode(animate);
        if (animate) {
          cc.tween(this.progressFrame.node).to(ANIMATION_DURATION, {
            y: this.progressFrame.originY + this.progressFrame.node.height,
            opacity: 0
          }, {
            easing: "quadOut"
          }).call(function() {
            _this2.progressFrame.node.active = false;
          }).start();
          cc.tween(this.startButton.node).to(ANIMATION_DURATION, {
            y: this.startButton.originY - this.startButton.node.height,
            opacity: 0
          }, {
            easing: "quadOut"
          }).call(function() {
            _this2.startButton.node.active = false;
          }).start();
          this.editModeFrame.active = true;
          this.editModeFrame.opacity = 0;
          cc.tween(this.editModeFrame).to(ANIMATION_DURATION, {
            opacity: 255
          }, {
            easing: "quadOut"
          }).start();
        } else {
          this.progressFrame.node.active = false;
          this.startButton.node.active = false;
          this.editModeFrame.active = true;
          this.editModeFrame.opacity = 255;
        }
      },
      exitEditMode: function exitEditMode(animate) {
        var _this3 = this;
        void 0 === animate && (animate = false);
        this.app.audioManager.playSfx("click");
        this.subsceneController.topUI.show(animate);
        this.subsceneController.bottomUI.show(animate);
        this.yardView.exitEditMode(animate);
        if (animate) {
          this.progressFrame.node.active = true;
          cc.tween(this.progressFrame.node).delay(.1).to(ANIMATION_DURATION, {
            y: this.progressFrame.originY,
            opacity: 255
          }, {
            easing: "quadOut"
          }).start();
          this.startButton.node.active = true;
          cc.tween(this.startButton.node).delay(.1).to(ANIMATION_DURATION, {
            y: this.startButton.originY,
            opacity: 255
          }, {
            easing: "quadOut"
          }).start();
          cc.tween(this.editModeFrame).to(ANIMATION_DURATION, {
            opacity: 0
          }, {
            easing: "quadOut"
          }).call(function() {
            _this3.editModeFrame.active = false;
          }).start();
        } else {
          this.progressFrame.node.opacity = 255;
          this.progressFrame.node.y = this.progressFrame.originY;
          this.progressFrame.node.active = true;
          this.startButton.node.opacity = 255;
          this.startButton.node.y = this.startButton.originY;
          this.startButton.node.active = true;
          this.editModeFrame.active = false;
        }
      },
      editModeDragNotification: function editModeDragNotification(enable) {
        void 0 === enable && (enable = true);
        this.editBottomframeDrag.active = enable;
        this.editBottomframeNormal.active = !enable;
      }
    });
    cc._RF.pop();
  }, {
    "../../constants": "constants",
    "../../models/levelModel.js": "levelModel",
    "../../userState": "userState"
  } ],
  Home: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9b2e01mOmRJNKD1ngSLfNrH", "Home");
    "use strict";
    var _constants = _interopRequireDefault(require("../constants.js"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var IPAD_RATIO = _constants["default"].IPAD_RATIO, DEBUG = _constants["default"].DEBUG;
    var CENTER_HEIGHT = 1600;
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        this.app = cc.find("app").getComponent("app");
        this.app.info("Home.js - onLoad");
        this.app.IS_DEVELOPMENT && (globalThis.home = this);
        this.subsceneController = this.node.getComponent("SubsceneController");
        this.scaleContainer = this.node.getChildByName("scaleContainer");
        this.settingsPopup = this.scaleContainer.getChildByName("SettingsPopup").getComponent("SettingsPopup");
        this.qaPanel = this.scaleContainer.getChildByName("QAPanel").getComponent("QAPanel");
        this.topUI = this.scaleContainer.getChildByName("TopUI").getComponent("TopUI");
        this.giftPopup = this.scaleContainer.getChildByName("GiftPopup").getComponent("GiftPopup");
        this.noHeartPopup = this.scaleContainer.getChildByName("NoHeartPopup").getComponent("NoHeartPopup");
        this.endGamePopup = this.scaleContainer.getChildByName("EndGamePopup").getComponent("EndGamePopup");
        this.catFullAlert = this.scaleContainer.getChildByName("catFullAlert").getComponent("CatAlert");
        this.catDialog = this.scaleContainer.getChildByName("catDialog").getComponent("CatDialog");
        this.rewardPopup = this.scaleContainer.getChildByName("rewardPopup").getComponent("RewardPopup");
        this.catAlert = this.scaleContainer.getChildByName("catFullAlert").getComponent("CatAlert");
        this.app.setSceneVisible(this);
        if (DEBUG.TEST_LEVEL && !globalThis.notFirstTime) {
          globalThis.notFirstTime = true;
          var homeNode = cc.find("Canvas").getComponent("Home");
          this.app.changeScene(homeNode, "Game");
        }
      },
      onDestroy: function onDestroy() {
        this.app.info("Home.js - onDestroy");
        this.app.setSceneHidden(this);
      },
      updateScreenSize: function updateScreenSize(frame) {
        if (frame.ratio > IPAD_RATIO) {
          this.scaleContainer.height = 1024 / IPAD_RATIO;
          this.scaleContainer.scale = frame.height / this.scaleContainer.height;
        } else {
          this.scaleContainer.scale = frame.width / 1024;
          this.scaleContainer.height = frame.height / this.scaleContainer.scale;
        }
        var uiScale = 1;
        var topUI = this.scaleContainer.getChildByName("TopUI").getComponent("TopUI");
        var botUI = this.scaleContainer.getChildByName("BotUI").getComponent("BottomUI");
        var uiTotalHeight = topUI.node.height + botUI.node.height;
        var currentCenterHeight = this.scaleContainer.height - uiTotalHeight;
        currentCenterHeight < CENTER_HEIGHT && (uiScale = currentCenterHeight / CENTER_HEIGHT);
        topUI.node.y = .5 * this.scaleContainer.height;
        topUI.updateScreenSize(frame, uiScale);
        botUI.node.y = .5 * -this.scaleContainer.height;
        botUI.updateScreenSize(frame, uiScale);
        this.settingsPopup.updateScreenSize(frame);
        this.qaPanel.updateScreenSize(frame, uiScale);
        this.subsceneController.updateScreenSize(frame, uiScale);
        this.giftPopup.updateScreenSize(frame, uiScale);
        this.catDialog.updateScreenSize(frame, uiScale);
        this.rewardPopup.updateScreenSize(frame, uiScale);
        this.catAlert.updateScreenSize(frame, uiScale);
      },
      showQAPanel: function showQAPanel() {
        (_constants["default"].FORCE_ENABLE_QA || this.app.IS_DEVELOPMENT) && this.qaPanel.show(true);
      },
      onEnable: function onEnable() {
        this.app.info("Home.js - onEnable");
      },
      start: function start() {
        this.app.info("Home.js - start");
        this.app.audioManager.playMusic("bgm_home");
        this.subsceneController.switchScene("home");
        this.settingsPopup.hide();
        this.qaPanel.hide();
        this.giftPopup.hide(false);
        this.noHeartPopup.hide();
      },
      onDisable: function onDisable() {
        this.app.info("Home.js - onDisable");
      }
    });
    cc._RF.pop();
  }, {
    "../constants.js": "constants"
  } ],
  MarkProgressIconView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "75c6aNjJZ5HMqpyWEH2hzeV", "MarkProgressIconView");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        OnSprite: {
          default: null,
          type: cc.SpriteFrame
        },
        OffSprite: {
          default: null,
          type: cc.SpriteFrame
        },
        Number: {
          default: null,
          type: cc.Label
        }
      },
      changeState: function changeState(isOn) {
        this.node.getComponent(cc.Sprite).spriteFrame = isOn ? this.OnSprite : this.OffSprite;
      },
      setNumber: function setNumber(value) {
        this.Number.string = value;
      }
    });
    cc._RF.pop();
  }, {} ],
  NoHeartPopup: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "7522bv97HRMx4hKo090EibV", "NoHeartPopup");
    "use strict";
    var _userState = _interopRequireDefault(require("../userState"));
    var _helpers = _interopRequireDefault(require("../helpers"));
    var _constants = _interopRequireDefault(require("../constants"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: cc.Component,
      properties: {
        WatchAdFrame: {
          default: null,
          type: cc.Node
        },
        CounterFrame: {
          default: null,
          type: cc.Node
        },
        HeartTimerLabel: {
          default: null,
          type: cc.Label
        },
        HeartValueLabel: {
          default: null,
          type: cc.Label
        },
        SubTitleLabel: {
          default: null,
          type: cc.Label
        },
        BackerLayer: {
          default: null,
          type: cc.Node
        },
        Popup: {
          default: null,
          type: cc.Node
        },
        AdBtn: {
          default: null,
          type: cc.Button
        }
      },
      onLoad: function onLoad() {
        this.app = cc.find("app").getComponent("app");
      },
      update: function update(dt) {
        this.updateHeartCountdown();
      },
      updateHeartCountdown: function updateHeartCountdown() {
        if (!this.isNeedUpdateCountdown) return;
        var duration = _userState["default"].getHeartRefillDuration();
        var time = _helpers["default"].formatTwoLargestUnit(duration);
        this.HeartTimerLabel.string = "Recharge in: " + time;
        if (~~_userState["default"].getHeart().value > 0) {
          this.isNeedUpdateCountdown = false;
          this.hide();
        }
      },
      show: function show(adSuccessCb) {
        this.adSuccessCb = adSuccessCb;
        this.isNeedUpdateCountdown = true;
        this.node.active = true;
        this.Popup.active = true;
        this.Popup.scale = 0;
        this.Popup.opacity = 0;
        this.HeartValueLabel.string = "+" + _constants["default"].AD_HEART_REWARD;
        this.SubTitleLabel.string = "Watch a video to get " + _constants["default"].AD_HEART_REWARD + " lives !";
        this.hadAd = false;
        this.app.adManager.prepareRewardedAds(this.onceAdIsAvailable.bind(this));
        this.updateWatchAdFrame();
        cc.tween(this.BackerLayer).to(.3, {
          opacity: 200
        }, {
          easing: "quadOut"
        }).start();
        cc.tween(this.Popup).to(.6, {
          scale: 1,
          opacity: 255
        }, {
          easing: "backOut"
        }).start();
      },
      onceAdIsAvailable: function onceAdIsAvailable() {
        this.hadAd = true;
        this.updateWatchAdFrame();
      },
      updateWatchAdFrame: function updateWatchAdFrame() {
        this.WatchAdFrame.active = this.hadAd;
        this.CounterFrame.y = this.hadAd ? 44 : -38;
      },
      hide: function hide() {
        var _this = this;
        cc.tween(this.BackerLayer).delay(.15).to(.4, {
          opacity: 0
        }, {
          easing: "quadOut"
        }).start();
        cc.tween(this.Popup).to(.4, {
          scale: 0,
          opacity: 0
        }, {
          easing: "sineOut"
        }).call(function() {
          _this.node.active = false;
          _this.Popup.active = false;
        }).start();
      },
      onClose: function onClose() {
        this.app.audioManager.playSfx("click");
        this.hide();
      },
      onAdClicked: function onAdClicked() {
        var _this2 = this;
        this.app.lockScreen("onAdClicked", true);
        var needUnlockScreen = true;
        this.app.adManager.showRewardedAds({
          onRewardedAdCompleted: function onRewardedAdCompleted() {
            _this2.app.unlockScreen("onAdClicked");
            _userState["default"].addHeart(_constants["default"].AD_HEART_REWARD);
            needUnlockScreen = false;
            _this2.hide();
            _this2.adSuccessCb && _this2.adSuccessCb();
          },
          onRewardedAdClosed: function onRewardedAdClosed() {
            needUnlockScreen && _this2.app.unlockScreen("onAdClicked");
            _this2.hide();
          },
          onRewardedAdLoadFailure: function onRewardedAdLoadFailure() {
            _this2.app.unlockScreen("onAdClicked");
            _this2.hide();
          }
        });
      }
    });
    cc._RF.pop();
  }, {
    "../constants": "constants",
    "../helpers": "helpers",
    "../userState": "userState"
  } ],
  ObjectiveController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b2892ucVxpKq6Eqgn/OGHRl", "ObjectiveController");
    "use strict";
    var ITEM_SIZE = 94;
    var ITEM_SPACING = 36;
    var ITEM_FIRST_POSITION = [ 0, 0 ];
    cc.Class({
      extends: cc.Component,
      properties: {
        ObjectiveItem: {
          default: null,
          type: cc.Prefab
        }
      },
      loadObjectives: function loadObjectives(objectivesData, onObjectiveCompleted) {
        var _this = this;
        this.onObjectiveCompleted = onObjectiveCompleted;
        this.items = {};
        this.typeMap = [];
        this.isCompletedCache = false;
        this.node.width = Math.max(ITEM_SIZE * objectivesData.length + ITEM_SPACING * (objectivesData.length + 3), 100);
        this.node.height = ITEM_SIZE + 2 * ITEM_SPACING;
        var firstPositionX = ITEM_FIRST_POSITION[0] - (objectivesData.length - 1) * (ITEM_SPACING + ITEM_SIZE) * .5;
        var i = 0;
        objectivesData.forEach(function(data) {
          var objectiveItem = {};
          objectiveItem.gameObject = cc.instantiate(_this.ObjectiveItem).getComponent("ObjectiveItem");
          objectiveItem.type = data.type;
          objectiveItem.amount = data.amount;
          _this.items[data.type] = objectiveItem;
          _this.typeMap.push(data.type);
          objectiveItem.gameObject.node.parent = _this.node;
          objectiveItem.gameObject.node.x = firstPositionX + (ITEM_SPACING + ITEM_SIZE) * i;
          objectiveItem.gameObject.node.y = ITEM_FIRST_POSITION[1] + .5 * _this.node.height;
          objectiveItem.gameObject.node.scale = ITEM_SIZE / objectiveItem.gameObject.node.width;
          objectiveItem.gameObject.loadObjective(data);
          i++;
        });
      },
      reduceType: function reduceType(type) {
        if (!this.items[type]) return false;
        if (0 === this.items[type].amount) return false;
        this.items[type].amount = Math.max(0, this.items[type].amount - 1);
        this.items[type].gameObject.numberLabel.string = this.items[type].amount;
        0 === this.items[type].amount && !this.isCompletedCache && this.isCompleted() && this.onObjectiveCompleted && this.onObjectiveCompleted();
        return true;
      },
      isCompleted: function isCompleted() {
        var _this2 = this;
        if (this.isCompletedCache) return this.isCompletedCache;
        var result = true;
        this.typeMap.forEach(function(type) {
          if (_this2.items[type].amount > 0) {
            result = false;
            return false;
          }
        });
        this.isCompletedCache = result;
        return result;
      }
    });
    cc._RF.pop();
  }, {} ],
  ObjectiveItem: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1a5d93C5C1GibhrUOEScpzR", "ObjectiveItem");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        basic1: {
          default: null,
          type: cc.SpriteFrame
        },
        basic2: {
          default: null,
          type: cc.SpriteFrame
        },
        basic3: {
          default: null,
          type: cc.SpriteFrame
        },
        basic4: {
          default: null,
          type: cc.SpriteFrame
        },
        basic5: {
          default: null,
          type: cc.SpriteFrame
        },
        crateBrown1: {
          default: null,
          type: cc.SpriteFrame
        },
        crateRed1: {
          default: null,
          type: cc.SpriteFrame
        },
        crateYellow1: {
          default: null,
          type: cc.SpriteFrame
        },
        crateGreen1: {
          default: null,
          type: cc.SpriteFrame
        },
        crateBlue1: {
          default: null,
          type: cc.SpriteFrame
        },
        cratePurple1: {
          default: null,
          type: cc.SpriteFrame
        },
        crateBrick1: {
          default: null,
          type: cc.SpriteFrame
        },
        shrub1: {
          default: null,
          type: cc.SpriteFrame
        },
        mouseDoor: {
          default: null,
          type: cc.SpriteFrame
        },
        movableDestructible1: {
          default: null,
          type: cc.SpriteFrame
        },
        bomb: {
          default: null,
          type: cc.SpriteFrame
        },
        discoball: {
          default: null,
          type: cc.SpriteFrame
        },
        missiles1: {
          default: null,
          type: cc.SpriteFrame
        },
        missiles2: {
          default: null,
          type: cc.SpriteFrame
        },
        sniper: {
          default: null,
          type: cc.SpriteFrame
        },
        milkBottle: {
          default: null,
          type: cc.SpriteFrame
        },
        jam: {
          default: null,
          type: cc.SpriteFrame
        }
      },
      onLoad: function onLoad() {
        this.numberLabel = this.node.getChildByName("number").getComponent(cc.Label);
      },
      loadObjective: function loadObjective(data) {
        this.data = data;
        this.node.getComponent(cc.Sprite).spriteFrame = this[data.type];
        var textureSize = this[this.data.type].getOriginalSize();
        var ratioW = this.node.width / textureSize.width;
        var ratioH = this.node.height / textureSize.height;
        var ratio = Math.min(ratioW, ratioH);
        this.node.width = textureSize.width * ratio;
        this.node.height = textureSize.height * ratio;
        this.numberLabel.string = 0 | data.amount;
      }
    });
    cc._RF.pop();
  }, {} ],
  PausePopup: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "eb7f8TDrj1N878CcvbpZ0ee", "PausePopup");
    "use strict";
    var _constants = _interopRequireDefault(require("../constants"));
    var _levelModel = _interopRequireDefault(require("../models/levelModel.js"));
    var _userState = _interopRequireDefault(require("../userState"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var EMPTY_METHOD = function EMPTY_METHOD() {};
    var ANIMATION_DURATION = .3;
    cc.Class({
      extends: cc.Component,
      properties: {
        backButton: cc.Button,
        restartButton: cc.Button,
        homeButton: cc.Button,
        homeButtonDisabled: cc.Sprite
      },
      onLoad: function onLoad() {
        this.app = cc.find("app").getComponent("app");
        this.home = cc.find("Canvas").getComponent("Home");
        this.popup = this.node.getChildByName("popup");
        var content = this.popup.getChildByName("content");
        this.musicSlider = content.getChildByName("musicSlider");
        this.musicSlider.on("slide", this.onMusicVolumeChanged, this);
        this.backButton.node.on("click", this.onCloseClicked, this);
        this.restartButton.node.on("click", this.onRestartClicked, this);
        this.homeButton.node.on("click", this.onHomeClicked, this);
        this.node.active = false;
        var currentLevel = _userState["default"].getProgression();
        var levelNumber = _levelModel["default"].getLevel(currentLevel).levelNumber;
        var canGoHome = levelNumber > _constants["default"].UNLOCK_YARD_AFTER_LEVEL;
        this.homeButton.node.active = canGoHome;
        this.homeButtonDisabled.node.active = !canGoHome;
      },
      init: function init(options) {
        this.onHomeCb = options.onHome || EMPTY_METHOD;
        this.onRestartCb = options.onRestart || EMPTY_METHOD;
      },
      show: function show(animate) {
        var _this = this;
        void 0 === animate && (animate = false);
        this.popup = this.node.getChildByName("popup");
        var settings = _userState["default"].getSettings();
        this.restartButton.node.active = ~~_userState["default"].getHeart().value > 1;
        this.isShowing = true;
        this.node.active = true;
        this.musicSlider.getComponent("cc.Slider").progress = settings.music;
        this.musicSlider.getComponent("Slider").onValueChanged();
        if (animate) {
          this.animating = true;
          cc.tween(this.node).to(ANIMATION_DURATION, {
            opacity: 255
          }, {
            easing: "quadOut"
          }).call(function() {
            _this.animating = false;
          }).start();
        } else this.node.opacity = 255;
      },
      hide: function hide(animate) {
        var _this2 = this;
        void 0 === animate && (animate = false);
        this.isShowing = false;
        if (animate) {
          this.animating = true;
          cc.tween(this.node).to(ANIMATION_DURATION, {
            opacity: 0
          }, {
            easing: "quadOut"
          }).call(function() {
            _this2.node.active = false;
            _this2.animating = false;
          }).start();
        } else {
          this.node.active = false;
          this.node.opacity = 0;
        }
      },
      onCloseClicked: function onCloseClicked(animate) {
        void 0 === animate && (animate = false);
        if (this.animating) return;
        this.hide(true);
        this.app.audioManager.playSfx("click");
        this.saveAudioConfig();
      },
      onRestartClicked: function onRestartClicked() {
        if (this.animating) return;
        this.hide(true);
        this.saveAudioConfig();
        this.app.audioManager.playSfx("click");
        this.onRestartCb();
      },
      onHomeClicked: function onHomeClicked() {
        if (this.animating) return;
        this.hide(true);
        this.saveAudioConfig();
        this.app.audioManager.playSfx("click");
        this.onHomeCb();
      },
      onMusicVolumeChanged: function onMusicVolumeChanged() {
        var value = this.musicSlider.getComponent("cc.Slider").progress;
        this.app.audioManager.setMusicVolume(value);
      },
      saveAudioConfig: function saveAudioConfig() {
        var settings = _userState["default"].getSettings();
        settings.music = this.musicSlider.getComponent("cc.Slider").progress;
        _userState["default"].saveSettings();
      },
      updateScreenSize: function updateScreenSize(frame, uiScale) {}
    });
    cc._RF.pop();
  }, {
    "../constants": "constants",
    "../models/levelModel.js": "levelModel",
    "../userState": "userState"
  } ],
  ProgressFrame: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e4cb9a+bv9N0KTzW4rfXiVG", "ProgressFrame");
    "use strict";
    var _levelModel = _interopRequireDefault(require("../models/levelModel.js"));
    var _supplyModel = _interopRequireDefault(require("../models/supplyModel.js"));
    var _userState = _interopRequireDefault(require("../userState.js"));
    var _MarkProgressIconView = _interopRequireDefault(require("./MarkProgressIconView"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var START_PROGRESS_X_POX = -318;
    var END_PROGRESS_X_POX = 318;
    cc.Class({
      extends: cc.Component,
      properties: {
        CheckPoints: {
          default: [],
          type: _MarkProgressIconView["default"]
        },
        label: cc.Label,
        progressBar: cc.ProgressBar
      },
      onLoad: function onLoad() {
        this.data = {};
      },
      updateScreenSize: function updateScreenSize(frame, uiScale) {
        var progressBacker = this.node.getChildByName("backer");
        var progressBar = this.node.getChildByName("progressBar");
        progressBacker.width = this.node.width / uiScale;
        progressBar.scale = 1 / uiScale;
      },
      initNewTemplate: function initNewTemplate() {
        var curLevel = _levelModel["default"].getLevel(_userState["default"].getProgression()).levelNumber - 1;
        var items = _supplyModel["default"].getItemGroups();
        this.label.node.y = -156;
        var nextRewardName;
        var nextLevelReward;
        for (var level in items) {
          if (level <= curLevel) continue;
          var rewards = items[level];
          nextLevelReward = rewards[0].unlockedLevel;
          var rewardNames = [];
          for (var index in rewards) {
            var item = rewards[index];
            rewardNames.push(item.name);
          }
          nextRewardName = rewardNames.join(", ");
          break;
        }
        this.label.string = "Level " + nextLevelReward + " Reward: " + nextRewardName;
        var itemKeys = Object.keys(items);
        var CHUNK_SIZE = 3;
        var itemKeyGroups = [];
        var chunk = [];
        for (var i = 0; i < itemKeys.length; i++) if (chunk.length >= 3) {
          itemKeyGroups.push([].concat(chunk));
          chunk = [];
          chunk.push(itemKeys[i - 1]);
          chunk.push(itemKeys[i]);
          if (i === itemKeys.length - 1) {
            chunk.length < 3 && (chunk = itemKeys.slice(itemKeys.length - CHUNK_SIZE));
            itemKeyGroups.push([].concat(chunk));
          }
        } else chunk.push(itemKeys[i]);
        this.data.itemKeyGroupIndex = 0;
        for (var _index = 0; _index < itemKeyGroups.length; _index++) {
          var _group = itemKeyGroups[_index];
          if (curLevel >= _group[_group.length - 1]) continue;
          this.data.itemKeyGroupIndex = _index;
          break;
        }
        this.data.isFirstProgress = 0 === this.data.itemKeyGroupIndex;
        this.data.group = itemKeyGroups[this.data.itemKeyGroupIndex];
        var group = this.data.group;
        var totalLengthProgress = END_PROGRESS_X_POX - START_PROGRESS_X_POX;
        if (this.data.isFirstProgress) {
          this.data.totalChunkProgress = group[group.length - 1];
          this.progressBar.progress = curLevel / this.data.totalChunkProgress;
        } else {
          this.data.totalChunkProgress = group[group.length - 1] - group[0];
          this.progressBar.progress = (curLevel - group[0]) / this.data.totalChunkProgress;
        }
        for (var _index2 = 0; _index2 < group.length; _index2++) {
          var levelRequire = group[_index2];
          this.CheckPoints[_index2].changeState(levelRequire <= curLevel);
          this.CheckPoints[_index2].setNumber(levelRequire);
          this.data.isFirstProgress ? this.CheckPoints[_index2].node.x = START_PROGRESS_X_POX + group[_index2] / this.data.totalChunkProgress * totalLengthProgress : this.CheckPoints[_index2].node.x = START_PROGRESS_X_POX + (group[_index2] - group[0]) / this.data.totalChunkProgress * totalLengthProgress;
        }
      },
      setUnlockAllToysFrame: function setUnlockAllToysFrame() {
        this.label.string = "All supplies unlocked!";
        this.label.node.y = -195;
        this.progressBar.node.active = false;
      },
      updateValues: function updateValues(needAnim, oldLevel, newLevel) {
        var _this = this;
        void 0 === needAnim && (needAnim = false);
        if (_supplyModel["default"].hasUnlockAllToys()) return this.setUnlockAllToysFrame();
        this.initNewTemplate();
        var group = this.data.group;
        if (needAnim) {
          var oldProgress = this.data.isFirstProgress ? oldLevel / this.data.totalChunkProgress : (oldLevel - group[0]) / this.data.totalChunkProgress;
          var newProgress = this.data.isFirstProgress ? newLevel / this.data.totalChunkProgress : (newLevel - group[0]) / this.data.totalChunkProgress;
          this.progressBar.progress = oldProgress;
          cc.tween(this.progressBar).to(2, {
            progress: newProgress
          }, {
            easing: "quadOut"
          }).call(function() {
            newProgress > .99 && _this.initNewTemplate();
          }).start();
        } else {
          var curLevel = _levelModel["default"].getLevel(_userState["default"].getProgression()).levelNumber - 1;
          this.data.isFirstProgress ? this.progressBar.progress = curLevel / this.data.totalChunkProgress : this.progressBar.progress = (curLevel - group[0]) / this.data.totalChunkProgress;
        }
      },
      updateValuesByLevel: function updateValuesByLevel(level) {
        if (_supplyModel["default"].hasUnlockAllToys()) return this.setUnlockAllToysFrame();
        this.initNewTemplate();
        var group = this.data.group;
        var newProgress = this.data.isFirstProgress ? level / this.data.totalChunkProgress : (level - group[0]) / this.data.totalChunkProgress;
        this.progressBar.progress = newProgress;
      }
    });
    cc._RF.pop();
  }, {
    "../models/levelModel.js": "levelModel",
    "../models/supplyModel.js": "supplyModel",
    "../userState.js": "userState",
    "./MarkProgressIconView": "MarkProgressIconView"
  } ],
  QAPanel: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "5199dPtNs9JjrSwZMWdw3L8", "QAPanel");
    "use strict";
    var _boosters = _interopRequireDefault(require("../staticData/boosters"));
    var _catModels = _interopRequireDefault(require("../models/catModels"));
    var _constants = _interopRequireDefault(require("../constants"));
    var _supplyModel = _interopRequireDefault(require("../models/supplyModel"));
    var _userState = _interopRequireDefault(require("../userState"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var MAX_BOOSTER_SELECTION = _constants["default"].MAX_BOOSTER_SELECTION;
    var ANIMATION_DURATION = .3;
    var MAX_BOOSTER_AMOUNT = 10;
    cc.Class({
      extends: cc.Component,
      properties: {
        contentView: {
          default: null,
          type: cc.Node
        }
      },
      onLoad: function onLoad() {
        this.app = cc.find("app").getComponent("app");
        this.subsceneController = cc.find("Canvas").getComponent("SubsceneController");
        this.home = cc.find("Canvas").getComponent("Home");
        this.popup = this.node.getChildByName("popup");
        var frame = this.popup.getChildByName("frame");
        var innerFrame = frame.getChildByName("innerFrame");
        var scrollView = innerFrame.getChildByName("scrollview").getComponent(cc.ScrollView);
        var scrollFrame = scrollView.content;
        var maxCatIncimaciesButton = scrollFrame.getChildByName("maxCatIncimaciesButton");
        var dayResetButton = scrollFrame.getChildByName("dayResetButton");
        var resetButton = scrollFrame.getChildByName("resetButton");
        this.propertyLines = {};
        this.propertyLines["level"] = this.setupPropertyLine(scrollFrame.getChildByName("level"), "level");
        this.propertyLines["coin"] = this.setupPropertyLine(scrollFrame.getChildByName("coin"), "coin");
        this.propertyLines["fish"] = this.setupPropertyLine(scrollFrame.getChildByName("fish"), "fish");
        this.propertyLines["heart"] = this.setupPropertyLine(scrollFrame.getChildByName("heart"), "heart");
        this.propertyLines["x3Turn"] = this.setupToggleProperty(scrollFrame.getChildByName("x3Turn"), "x3Turn");
        for (var type in _boosters["default"]) this.propertyLines["booster_" + type] = this.setupPropertyLine(scrollFrame.getChildByName("booster_" + type), "booster", type);
        maxCatIncimaciesButton.on("click", this.onMaxCatIntimaciesClicked, this);
        dayResetButton.on("click", this.onDayResetClicked, this);
        resetButton.on("click", this.onResetClicked, this);
      },
      onEnable: function onEnable() {
        this.loadData();
      },
      setupPropertyLine: function setupPropertyLine(lineNode, type, subType) {
        void 0 === subType && (subType = "");
        var leftButtonNode = lineNode.getChildByName("leftButton");
        var rightButtonNode = lineNode.getChildByName("rightButton");
        var numberNode = lineNode.getChildByName("number");
        var toggleNode = lineNode.getChildByName("toggle");
        if ("booster" === type) {
          var label = lineNode.getChildByName("label").getComponent(cc.Label);
          label.string = _boosters["default"][subType].name;
        }
        var propertyLine = {
          type: type,
          subType: subType
        };
        propertyLine.number = numberNode.getComponent(cc.Label);
        if (toggleNode) {
          propertyLine.toggle = toggleNode.getComponent(cc.Toggle);
          toggleNode.on("toggle", this.onPropertyToggle, this, propertyLine);
        }
        leftButtonNode && leftButtonNode.on("click", this.onLeftPropertyClicked, this);
        rightButtonNode && rightButtonNode.on("click", this.onRightPropertyClicked, this);
        return propertyLine;
      },
      setupToggleProperty: function setupToggleProperty(lineNode, type) {
        var toggleNode = lineNode.getChildByName("toggle");
        var propertyLine = {
          type: type
        };
        propertyLine.toggle = toggleNode.getComponent(cc.Toggle);
        toggleNode.on("toggle", this.onPropertyToggle, this, propertyLine);
        return propertyLine;
      },
      loadData: function loadData() {
        this.loadLevel();
        this.loadCoin();
        this.loadFish();
        this.loadHeart();
        this.loadBoosterSelection();
        this.loadBoosterAmount();
        this.loadX3TurnSetting();
      },
      loadLevel: function loadLevel() {
        this.propertyLines["level"].number.string = _userState["default"].getProgression();
        var homeSubscene = this.subsceneController.subsceneMap["home"].object;
        homeSubscene && homeSubscene.updateUI();
        _supplyModel["default"].updateSupplyData();
        this.updateSupply();
      },
      loadCoin: function loadCoin() {
        this.propertyLines["coin"].number.string = _userState["default"].getCoin();
        this.home.topUI.updateLabels();
        var shopSubscene = this.subsceneController.subsceneMap["shop"].object;
        shopSubscene && shopSubscene.updateCoin();
      },
      loadFish: function loadFish() {
        this.propertyLines["fish"].number.string = _userState["default"].getFish();
        this.home.topUI.updateLabels();
      },
      loadX3TurnSetting: function loadX3TurnSetting() {
        this.propertyLines["x3Turn"].toggle.isChecked = !!this.app.enableX3Turn;
      },
      loadHeart: function loadHeart() {
        this.propertyLines["heart"].number.string = ~~_userState["default"].getHeart().value;
        this.home.topUI.updateLabels();
      },
      loadBoosterSelection: function loadBoosterSelection() {
        var boosters = _userState["default"].getBoosters();
        for (var type in _boosters["default"]) this.propertyLines["booster_" + type].toggle.isChecked = boosters[type].selected;
      },
      loadBoosterAmount: function loadBoosterAmount() {
        var boosters = _userState["default"].getBoosters();
        for (var type in _boosters["default"]) this.propertyLines["booster_" + type].number.string = boosters[type].amount;
      },
      show: function show(animate) {
        var _this = this;
        void 0 === animate && (animate = false);
        this.node.active = true;
        if (animate) {
          this.animating = true;
          cc.tween(this.node).to(ANIMATION_DURATION, {
            opacity: 255
          }, {
            easing: "quadOut"
          }).call(function() {
            _this.animating = false;
          }).start();
        } else this.node.opacity = 255;
      },
      hide: function hide(animate) {
        var _this2 = this;
        void 0 === animate && (animate = false);
        if (animate) {
          this.animating = true;
          cc.tween(this.node).to(ANIMATION_DURATION, {
            opacity: 0
          }, {
            easing: "quadOut"
          }).call(function() {
            _this2.node.active = false;
            _this2.animating = false;
          }).start();
        } else {
          this.node.active = false;
          this.node.opacity = 0;
        }
      },
      onHideClicked: function onHideClicked(animate) {
        void 0 === animate && (animate = false);
        if (this.animating) return;
        this.hide(true);
      },
      onLeftPropertyClicked: function onLeftPropertyClicked(event) {
        var nodeKey = event.node.parent.name;
        var propertyLine = this.propertyLines[nodeKey];
        var type = propertyLine.type, subType = propertyLine.subType;
        if ("level" === type) {
          _userState["default"].stepProgression(-1);
          this.loadLevel();
        } else if ("coin" === type) {
          _userState["default"].updateCoin(-1e3);
          this.loadCoin();
        } else if ("fish" === type) {
          _userState["default"].updateFish(-1e3);
          this.loadFish();
        } else if ("heart" === type) {
          _userState["default"].addHeart(-1);
          this.loadHeart();
        } else if ("booster" === type) {
          var boosters = _userState["default"].getBoosters();
          boosters[subType].amount = Math.max(boosters[subType].amount - 1, 0);
          _userState["default"].saveBoostersState();
          this.loadBoosterAmount();
          var bagSubscene = this.subsceneController.subsceneMap["bag"].object;
          bagSubscene && bagSubscene.node.active ? bagSubscene.loadBoosterItems() : this.app.boostersRefreshRequest = true;
        }
      },
      onRightPropertyClicked: function onRightPropertyClicked(event) {
        var nodeKey = event.node.parent.name;
        var propertyLine = this.propertyLines[nodeKey];
        var type = propertyLine.type, subType = propertyLine.subType;
        if ("level" === type) {
          _userState["default"].stepProgression(1);
          this.loadLevel();
        } else if ("coin" === type) {
          _userState["default"].updateCoin(1e3);
          this.loadCoin();
        } else if ("fish" === type) {
          _userState["default"].updateFish(1e3);
          this.loadFish();
        } else if ("heart" === type) {
          _userState["default"].addHeart(1);
          this.loadHeart();
        } else if ("booster" === type) {
          var boosters = _userState["default"].getBoosters();
          boosters[subType].amount = Math.min(boosters[subType].amount + 1, MAX_BOOSTER_AMOUNT);
          boosters[subType].unlocked = true;
          _userState["default"].saveBoostersState();
          this.loadBoosterAmount();
          var bagSubscene = this.subsceneController.subsceneMap["bag"].object;
          bagSubscene && bagSubscene.node.active ? bagSubscene.loadBoosterItems() : this.app.boostersRefreshRequest = true;
        }
      },
      onPropertyToggle: function onPropertyToggle(event) {
        var nodeKey = event.node.parent.name;
        var propertyLine = this.propertyLines[nodeKey];
        var type = propertyLine.type, subType = propertyLine.subType;
        var checkValue = event.isChecked;
        if ("booster" === type) {
          var boosters = _userState["default"].getBoosters();
          if (checkValue && (_userState["default"].getSelectedBoosterCount() >= MAX_BOOSTER_SELECTION || !boosters[subType].unlocked)) {
            event.isChecked = false;
            return;
          }
          boosters[subType].selected = checkValue;
          _userState["default"].saveBoostersState();
          this.loadBoosterSelection();
          var bagSubscene = this.subsceneController.subsceneMap["bag"].object;
          bagSubscene && bagSubscene.node.active ? bagSubscene.loadBoosterItems() : this.app.boostersRefreshRequest = true;
        }
        "x3Turn" === type && (this.app.enableX3Turn = event.isChecked);
      },
      updateSupply: function updateSupply() {
        var homeSubscene = this.subsceneController.subsceneMap["home"].object;
        homeSubscene && homeSubscene.node.active ? homeSubscene.progressFrame.updateValues() : this.app.yardViewRefreshRequest = true;
        var catSubscene = this.subsceneController.subsceneMap["cat"].object;
        catSubscene && catSubscene.node.active ? catSubscene.refreshCatItems() : this.app.catRefreshRequest = true;
        var bagSubscene = this.subsceneController.subsceneMap["bag"].object;
        bagSubscene && bagSubscene.node.active ? bagSubscene.loadSupplyItems() : this.app.suppliesRefreshRequest = true;
      },
      onMaxCatIntimaciesClicked: function onMaxCatIntimaciesClicked(event) {
        var cats = _catModels["default"].getAllCats();
        cats.forEach(function(cat) {
          cat.data.unlocked = true;
          cat.data.fishFed = cat.intimacyCap;
        });
        _userState["default"].saveCats();
        var homeSubscene = this.subsceneController.subsceneMap["home"].object;
        homeSubscene && homeSubscene.node.active ? homeSubscene.yardView.loadItems() : this.app.yardViewRefreshRequest = true;
        var catSubscene = this.subsceneController.subsceneMap["cat"].object;
        catSubscene && catSubscene.node.active ? catSubscene.refreshCatItems() : this.app.catRefreshRequest = true;
      },
      onDayResetClicked: function onDayResetClicked(event) {
        _userState["default"].getStates().dailyUpdate = 0;
        _userState["default"].saveStates();
        var homeSubscene = this.subsceneController.subsceneMap["home"].object;
        if (homeSubscene && homeSubscene.node.active) {
          _userState["default"].updateDailyState();
          homeSubscene.yardView.loadItems();
          homeSubscene.progressFrame.updateValues();
        } else this.app.yardViewRefreshRequest = true;
      },
      onResetClicked: function onResetClicked(event) {
        localStorage.clear();
        document.location.reload();
      },
      updateScreenSize: function updateScreenSize(frame, uiScale) {
        this.popup = this.node.getChildByName("popup");
        this.popup.height = Math.max(1100, frame.height / frame.ratio * .8);
      }
    });
    cc._RF.pop();
  }, {
    "../constants": "constants",
    "../models/catModels": "catModels",
    "../models/supplyModel": "supplyModel",
    "../staticData/boosters": "boosters",
    "../userState": "userState"
  } ],
  QuickBagPopup: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0171cE4dslFZINcwcX/+l49", "QuickBagPopup");
    "use strict";
    var _constants = _interopRequireDefault(require("../constants"));
    var _userState = _interopRequireDefault(require("../userState"));
    var _yard = _interopRequireDefault(require("../staticData/yard"));
    var _supplyModel = _interopRequireDefault(require("../models/supplyModel"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var DEBUG = _constants["default"].DEBUG, TIME_SPAN = _constants["default"].TIME_SPAN;
    var ONE_SECOND = DEBUG.FEEDING_ENVIRONMENT ? 20 : TIME_SPAN.ONE_SECOND;
    var ITEM_WIDTH = 480;
    var SUPPLY_ITEM_HEIGHT = 500;
    var LIST_SPACING = 50;
    var GLOWING_SPEED = .7;
    cc.Class({
      extends: cc.Component,
      properties: {
        Yard: {
          default: null,
          type: cc.Node
        },
        SupplyItem: {
          default: null,
          type: cc.Prefab
        },
        GlowItem: {
          default: null,
          type: cc.Prefab
        },
        material_glow: {
          default: null,
          type: cc.Material
        },
        SuppliesScrollView: {
          default: null,
          type: cc.Node
        },
        SuppliesScrollFrame: {
          default: null,
          type: cc.Node
        },
        GlowLayer: {
          default: null,
          type: cc.Node
        },
        BottomFrame: {
          default: null,
          type: cc.Node
        },
        BottomFramePlace: {
          default: null,
          type: cc.Node
        },
        BottomFrameEmpty: {
          default: null,
          type: cc.Node
        },
        PlaceButton: {
          default: null,
          type: cc.Button
        },
        CloseButton: {
          default: null,
          type: cc.Button
        }
      },
      onLoad: function onLoad() {
        this.app = cc.find("app").getComponent("app");
        this.yardView = this.Yard.getComponent("YardView");
        this.BottomFramePlace.active = false;
        this.BottomFrameEmpty.active = true;
        this.PlaceButton.node.on("click", this.onPlaceButtonClicked, this);
        this.CloseButton.node.on("click", this.onCloseButtonClicked, this);
        this.app.suppliesRefreshRequest = true;
        this.GlowLayer.zIndex = 100;
        this.supplyItems = {};
        this.glowItems = {};
        this.selectingSuppliesCount = 0;
        this.glowTimer = 0;
      },
      onEnable: function onEnable() {
        this.loadSupplyItems();
        this.clearGlowingSupplies();
      },
      update: function update(dt) {
        if (this.selectingSuppliesCount) {
          this.glowTimer += dt * GLOWING_SPEED;
          this.material_glow.setProperty("hl_timer", this.glowTimer);
        }
      },
      loadSupplyItems: function loadSupplyItems() {
        for (var key in this.supplyItems) {
          var supplyItem = this.supplyItems[key];
          supplyItem.node.destroy();
        }
        for (var _key in this.glowItems) {
          var glowItem = this.glowItems[_key];
          glowItem.node.destroy();
        }
        this.supplyItems = {};
        this.glowItems = {};
        var supplies = _supplyModel["default"].getSupplyData().items;
        var yardData = _userState["default"].getYard();
        var supplyCounter = 0;
        for (var _key2 in _yard["default"].items) {
          var goItem = cc.instantiate(this.SupplyItem).getComponent("BagSupplyItem");
          goItem.node.setParent(this.SuppliesScrollFrame);
          goItem.node.x = supplyCounter % 2 ? .5 * ITEM_WIDTH : .5 * -ITEM_WIDTH;
          goItem.node.y = -LIST_SPACING - Math.floor(.5 * supplyCounter) * SUPPLY_ITEM_HEIGHT;
          supplies.includes(_key2) ? goItem.loadData({
            id: _key2,
            isPlaced: !!yardData[_key2]
          }, this.onSupplyItemClicked.bind(this)) : goItem.loadData(null, null);
          this.supplyItems[_key2] = goItem;
          supplyCounter++;
          if (goItem.data) {
            var glowGOItem = cc.instantiate(this.GlowItem).getComponent("YardGlow");
            glowGOItem.node.setParent(this.GlowLayer);
            glowGOItem.node.x = goItem.node.x + goItem.icon.node.x;
            glowGOItem.node.y = goItem.node.y + goItem.icon.node.y + goItem.icon.node.height * goItem.icon.node.scale * .5;
            glowGOItem.node.scale = goItem.node.scale;
            this.glowItems[_key2] = glowGOItem;
            glowGOItem.setGlowShape(goItem.data.id);
            glowGOItem.node.active = false;
          }
        }
        this.SuppliesScrollFrame.height = SUPPLY_ITEM_HEIGHT * Math.ceil(.5 * supplyCounter) + 2 * LIST_SPACING + this.BottomFrame.height * this.BottomFrame.scale;
      },
      onSupplyItemClicked: function onSupplyItemClicked(id) {
        if (this.supplyItems[id].isPlaced) return;
        if (this.glowItems[id].node.active) {
          this.glowItems[id].node.active = false;
          this.selectingSuppliesCount--;
        } else {
          this.glowItems[id].node.active = true;
          this.selectingSuppliesCount++;
          this.glowTimer = 0;
        }
        this.BottomFramePlace.active = this.selectingSuppliesCount > 0;
        this.BottomFrameEmpty.active = 0 === this.selectingSuppliesCount;
        this.app.audioManager.playSfx("click");
      },
      onPlaceButtonClicked: function onPlaceButtonClicked() {
        var yardData = _userState["default"].getYard();
        for (var key in this.glowItems) {
          var glowItem = this.glowItems[key];
          var supplyItem = this.supplyItems[key];
          if (glowItem.node.active) {
            yardData[key] || (yardData[key] = {
              playingCat: null,
              nextUpdate: Date.now() + _yard["default"].items[key].interval * ONE_SECOND,
              x: -1,
              y: -1
            });
            supplyItem.setPlaced();
            glowItem.node.active = false;
          }
        }
        _userState["default"].saveYard();
        this.yardView.loadItems();
        this.clearGlowingSupplies();
        this.app.audioManager.playSfx("click");
      },
      onCloseButtonClicked: function onCloseButtonClicked() {
        this.app.audioManager.playSfx("click");
        this.node.active = false;
        this.yardView.enterEditMode(false);
      },
      clearGlowingSupplies: function clearGlowingSupplies() {
        this.BottomFramePlace.active = false;
        this.BottomFrameEmpty.active = true;
        this.selectingSuppliesCount = 0;
        this.glowTimer = 0;
        for (var key in this.glowItems) {
          var glowItem = this.glowItems[key];
          glowItem.node.active = false;
        }
      }
    });
    cc._RF.pop();
  }, {
    "../constants": "constants",
    "../models/supplyModel": "supplyModel",
    "../staticData/yard": "yard",
    "../userState": "userState"
  } ],
  QuitConfirmationPopup: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "11952O2Zq5CdIZ3p0ifpC2R", "QuitConfirmationPopup");
    "use strict";
    var _userState = _interopRequireDefault(require("../userState"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var POPUP_DURATION = .4;
    var CAT_SPACING = 10;
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        this.backer = this.node.getChildByName("backer");
        this.popup = this.node.getChildByName("popup");
        this.cat = this.node.getChildByName("cat").getComponent(sp.Skeleton);
        this.animating = false;
        this.audioManager = cc.find("AudioManager").getComponent("AudioManager");
        this.confirmBtn = this.popup.getChildByName("confirmBtn");
        this.backBtn = this.popup.getChildByName("backBtn");
        this.heartFrame = this.node.getChildByName("HeartFrame").getComponent("HeartFrameView");
        this.uiScale = 1;
        this.heartFrame.addOnChangedListner(this.onHeartChanged.bind(this));
        this.hide();
      },
      hide: function hide(animate) {
        var _this = this;
        void 0 === animate && (animate = false);
        return new Promise(function(resolve) {
          if (!animate) {
            _this.node.active = false;
            resolve();
            return;
          }
          _this.animating = true;
          _this.popup.scale = 1;
          _this.popup.opacity = 255;
          _this.backer.opacity = 200;
          _this.heartFrame.node.opacity = 255;
          cc.tween(_this.backer).to(.3, {
            opacity: 0
          }, {
            easing: "sineOut"
          }).start();
          cc.tween(_this.heartFrame.node).to(.3, {
            opacity: 0
          }, {
            easing: "sineOut"
          }).start();
          cc.tween(_this.popup).to(POPUP_DURATION, {
            scale: 0,
            opacity: 0
          }, {
            easing: "sineOut"
          }).call(function() {
            _this.animating = false;
            _this.node.active = false;
            resolve();
          }).start();
          cc.tween(_this.cat.node).to(.2, {
            y: -_this.node.height / 2 - _this.cat.node.height,
            opacity: 0
          }, {
            easing: "sineOut"
          }).call(function() {
            _this.cat.node.active = false;
          }).start();
        });
      },
      show: function show(callback, animate) {
        var _this2 = this;
        void 0 === animate && (animate = false);
        this.callback = callback;
        return new Promise(function(resolve) {
          _this2.node.active = true;
          if (!animate) {
            resolve();
            return;
          }
          _this2.animating = true;
          _this2.confirmBtn.active = ~~_userState["default"].getHeart().value > 0;
          _this2.backBtn.x = _this2.confirmBtn.active ? -185 : 0;
          _this2.popup.scale = 0;
          _this2.popup.opacity = 0;
          _this2.backer.opacity = 0;
          _this2.heartFrame.node.opacity = 0;
          cc.tween(_this2.backer).to(.3, {
            opacity: 200
          }, {
            easing: "quadOut"
          }).start();
          cc.tween(_this2.heartFrame.node).delay(.2).to(.3, {
            opacity: 255
          }, {
            easing: "sineOut"
          }).start();
          _this2.popup.scale = 0;
          _this2.popup.opacity = 0;
          cc.tween(_this2.popup).to(POPUP_DURATION, {
            scale: 1,
            opacity: 255
          }, {
            easing: "quadOut"
          }).call(function() {
            _this2.animating = false;
          }).start();
          _this2.cat.node.active = true;
          _this2.cat.node.y = -_this2.node.height / 2 - _this2.cat.node.height * _this2.uiScale;
          _this2.cat.node.opacity = 0;
          cc.tween(_this2.cat.node).delay(.5).to(.6, {
            y: -_this2.node.height / 2 + 10,
            opacity: 255
          }, {
            easing: "cubicOut"
          }).start();
        });
      },
      updateScreenSize: function updateScreenSize() {
        var parent = this.node.parent;
        this.node.width = parent.width;
        this.node.height = parent.height;
        var backer = this.node.getChildByName("backer");
        backer.height = this.node.height;
        var uiTotalHeight = this.cat.node.height + CAT_SPACING + this.popup.height;
        this.uiScale = 1;
        parent.height < uiTotalHeight && (this.uiScale = parent.height / uiTotalHeight);
      },
      onQuitClicked: function onQuitClicked() {
        var _this3 = this;
        this.audioManager.playSfx("click");
        this.animating || this.hide(true).then(function() {
          return _this3.callback && _this3.callback();
        });
      },
      onBackClicked: function onBackClicked() {
        this.audioManager.playSfx("click");
        this.animating || this.hide(true);
      },
      onHeartChanged: function onHeartChanged() {
        this.confirmBtn.active = ~~_userState["default"].getHeart().value > 0;
        this.backBtn.x = this.confirmBtn.active ? -185 : 0;
      }
    });
    cc._RF.pop();
  }, {
    "../userState": "userState"
  } ],
  ResultController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9cc922XOqxKxZQ+UNAiGlw2", "ResultController");
    "use strict";
    var _cats = _interopRequireDefault(require("../staticData/cats"));
    var _yard = _interopRequireDefault(require("../staticData/yard"));
    var _userState = _interopRequireDefault(require("../userState"));
    var _levelModel = _interopRequireDefault(require("../models/levelModel.js"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var EMPTY_METHOD = function EMPTY_METHOD() {};
    var PROGRESS_FRAME_OFFSET = 26;
    var CONGRAT_SPACING = 50;
    var CAT_SPACING = 10;
    cc.Class({
      extends: cc.Component,
      properties: {
        bed: {
          default: null,
          type: cc.SpriteFrame
        },
        cushion: {
          default: null,
          type: cc.SpriteFrame
        },
        featherToy: {
          default: null,
          type: cc.SpriteFrame
        },
        hamburgerCushion: {
          default: null,
          type: cc.SpriteFrame
        },
        paperBag1: {
          default: null,
          type: cc.SpriteFrame
        },
        paperBag2: {
          default: null,
          type: cc.SpriteFrame
        },
        plushDoll: {
          default: null,
          type: cc.SpriteFrame
        },
        pot: {
          default: null,
          type: cc.SpriteFrame
        },
        rubberBallRainbow: {
          default: null,
          type: cc.SpriteFrame
        },
        rubberBallRed: {
          default: null,
          type: cc.SpriteFrame
        },
        stretchingBoard: {
          default: null,
          type: cc.SpriteFrame
        },
        swimRing: {
          default: null,
          type: cc.SpriteFrame
        },
        swing: {
          default: null,
          type: cc.SpriteFrame
        },
        tent: {
          default: null,
          type: cc.SpriteFrame
        },
        tower: {
          default: null,
          type: cc.SpriteFrame
        },
        tunnel: {
          default: null,
          type: cc.SpriteFrame
        },
        cat_bella: {
          default: null,
          type: cc.SpriteFrame
        },
        cat_bob: {
          default: null,
          type: cc.SpriteFrame
        },
        cat_dora: {
          default: null,
          type: cc.SpriteFrame
        },
        cat_leo: {
          default: null,
          type: cc.SpriteFrame
        },
        cat_lily: {
          default: null,
          type: cc.SpriteFrame
        },
        cat_luna: {
          default: null,
          type: cc.SpriteFrame
        },
        cat_max: {
          default: null,
          type: cc.SpriteFrame
        },
        cat_milo: {
          default: null,
          type: cc.SpriteFrame
        }
      },
      onLoad: function onLoad() {
        this.app = cc.find("app").getComponent("app");
        this.backer = this.node.getChildByName("resultBacker");
        this.cat = this.node.getChildByName("cat").getComponent(sp.Skeleton);
        this.topUI = this.node.getChildByName("TopUI").getComponent("TopUI");
        this.progressFrame = this.node.getChildByName("ProgressFrame").getComponent("ProgressFrame");
        this.loseHeartFrame = this.node.getChildByName("LoseHeartFrame");
        this.popup = this.node.getChildByName("resultPopup");
        this.homeButton = this.popup.getChildByName("homeButton").getComponent(cc.Button);
        this.winFrame = this.popup.getChildByName("winFrame");
        this.rewardCoinLabel = this.winFrame.getChildByName("coinLabel").getComponent(cc.Label);
        this.turnLeftValueLabel = this.winFrame.getChildByName("turnLeftValue").getComponent(cc.Label);
        this.turnLeftCoinValueLabel = this.winFrame.getChildByName("turnLeftCoinValue").getComponent(cc.Label);
        this.baseRewardLabel = this.winFrame.getChildByName("baseCoinValue").getComponent(cc.Label);
        this.nextButton = this.winFrame.getChildByName("nextButton").getComponent(cc.Button);
        this.loseFrame = this.popup.getChildByName("loseFrame");
        this.playAgainBtn = this.loseFrame.getChildByName("playAgainButton");
        this.confetti = this.node.getChildByName("confetti");
        this.congrat = this.node.getChildByName("congratulations");
        this.unlockItemFrame = this.node.getChildByName("unlockItemFrame");
        this.loseFrameSubTitle = this.loseFrame.getChildByName("subTitle").getComponent(cc.Label);
        this.loseHeartLabel = this.loseFrame.getChildByName("heartLabel").getComponent(cc.Label);
        var bottomContent = this.unlockItemFrame.getChildByName("bottomContent");
        var putInBagButton = bottomContent.getChildByName("putInBagButton");
        this.originButtonY = putInBagButton.y;
        this.nextAction = EMPTY_METHOD;
        this.animating = false;
        this.isShowing = true;
        this.isThumpUpAnimating = false;
        this.thumpUpTimer = 0;
        this.uiScale = 1;
        this.unlockItemFrame.active = false;
        this.hide();
      },
      onEnable: function onEnable() {
        var curLevel = _levelModel["default"].getLevel(_userState["default"].getProgression()).levelNumber - 1;
        this.progressFrame.updateValuesByLevel(curLevel - 1);
      },
      update: function update(dt) {
        var lightstar = this.unlockItemFrame.getChildByName("lightstar");
        if (lightstar.active) {
          var lightstar1 = lightstar.getChildByName("lightstar1");
          var lightstar2 = lightstar.getChildByName("lightstar2");
          lightstar1.angle += 20 * dt;
          lightstar2.angle += 20 * dt;
          lightstar1.scale = .9 + .05 * Math.sin(this.app.now / 1e3 * 4);
          lightstar2.scale = .9 + .1 * Math.cos((this.app.now + 1e3) / 1e3 * 5);
        }
        if (this.isThumpUpAnimating) {
          this.thumpUpTimer -= dt;
          this.cat.getCurrent(0).isComplete() && (this.thumpUpTimer < 0 ? this.setCatThumpUpAnimation() : this.cat.addAnimation(0, "Cat_idle", false));
        }
        this._isNeedCheckHeartReFill && this.refreshPlayAgainLayout();
      },
      init: function init(options) {
        this.onHomeCb = options.onHome || EMPTY_METHOD;
        this.onTryAgainCb = options.onTryAgain || EMPTY_METHOD;
        this.onNextLevelCb = options.onNextLevel || EMPTY_METHOD;
      },
      hide: function hide(animate) {
        var _this = this;
        void 0 === animate && (animate = false);
        this.isShowing = false;
        return new Promise(function(resolve) {
          if (!animate) {
            _this.node.active = false;
            resolve();
            return;
          }
          _this.animating = true;
          var POPUP_DURATION = .5;
          var POPUP_DELAY = _this.congrat.active ? .2 : 0;
          var COMPONENT_DELAY = POPUP_DELAY + POPUP_DURATION - .2;
          var TOP_DELAY = POPUP_DELAY + 1.5 * (POPUP_DURATION - .2);
          _this.congrat.active && cc.tween(_this.congrat).to(.4, {
            scale: 0,
            opacity: 255
          }, {
            easing: "sineOut"
          }).call(function() {
            _this.congrat.active = false;
          }).start();
          _this.loseHeartFrame.active && cc.tween(_this.loseHeartFrame).delay(COMPONENT_DELAY).to(POPUP_DURATION, {
            scale: 0,
            opacity: 255
          }, {
            easing: "sineOut"
          }).call(function() {
            _this.loseHeartFrame.active = false;
          }).start();
          _this.progressFrame.node.active && cc.tween(_this.progressFrame.node).delay(COMPONENT_DELAY).to(POPUP_DURATION / 2, {
            y: _this.node.height / 2 + _this.progressFrame.node.height * _this.uiScale
          }, {
            easing: "sineIn"
          }).call(function() {
            _this.progressFrame.node.active = false;
          }).start();
          _this.topUI.node.active && cc.tween(_this.topUI.node).delay(TOP_DELAY).to(POPUP_DURATION / 2, {
            y: _this.node.height / 2 + _this.topUI.node.height * _this.uiScale
          }, {
            easing: "sineIn"
          }).call(function() {
            _this.topUI.node.active = false;
          }).start();
          cc.tween(_this.popup).delay(POPUP_DELAY).to(POPUP_DURATION, {
            scale: 0,
            opacity: 255
          }, {
            easing: "sineOut"
          }).call(function() {
            _this.popup.active = false;
          }).start();
          cc.tween(_this.cat.node).delay(COMPONENT_DELAY).to(POPUP_DURATION, {
            y: -_this.node.height / 2 - _this.cat.node.height,
            opacity: 0
          }, {
            easing: "sineOut"
          }).call(function() {
            _this.cat.node.active = false;
          }).start();
          setTimeout(function() {
            _this.animating = false;
            _this.node.active = false;
            resolve();
          }, 1e3 * (COMPONENT_DELAY + POPUP_DURATION + .1));
        });
      },
      show: function show(performance, data, animate) {
        var _this$performance$unl, _this$performance$unl2, _this2 = this;
        void 0 === animate && (animate = false);
        this.app.audioManager.stopMusic();
        this.app.audioManager.playSfx(performance.isWon ? "clear_stage" : "game_over");
        this.levelData = data;
        this.performance = performance;
        this.nextUnlockItems = [].concat((null == (_this$performance$unl = this.performance.unlockedData) ? void 0 : _this$performance$unl.items) || []);
        this.nextUnlockCats = [].concat((null == (_this$performance$unl2 = this.performance.unlockedData) ? void 0 : _this$performance$unl2.cats) || []);
        this.cat.setSkin(performance.isWon ? "whietcat" : "orangecat");
        this.cat.setAnimation(0, performance.isWon ? "Cat_idle" : "Cat_cry", true);
        this.cat.getCurrent(0).timeScale = 0;
        var curLevel = _levelModel["default"].getLevel(_userState["default"].getProgression()).levelNumber;
        var tutorialLevel = this.app.catTutorial.getTutorialLevel();
        var hasTutorial = tutorialLevel.indexOf(curLevel) > -1;
        var hasUnlockItems = this.nextUnlockItems.length > 0 || this.nextUnlockCats.length > 0;
        var hasNextLevel = _levelModel["default"].hasNextLevel(data.id);
        if (hasNextLevel) if (hasUnlockItems) {
          this.homeButton.node.active = false;
          this.nextButton.node.active = true;
        } else {
          this.homeButton.node.active = true;
          this.nextButton.node.active = !hasTutorial;
        } else {
          this.homeButton.node.active = true;
          this.nextButton.node.active = false;
        }
        this.homeButton.node.x = this.homeButton.node.active && this.nextButton.node.active ? -185 : 0;
        this.nextButton.node.x = this.homeButton.node.active && this.nextButton.node.active ? 185 : 0;
        return new Promise(function(resolve) {
          _this2.isShowing = true;
          _this2.node.active = true;
          _this2.loseHeartFrame.active = !performance.isWon;
          _this2.topUI.node.active = performance.isWon;
          _this2.progressFrame.node.active = performance.isWon;
          _this2.winFrame.active = performance.isWon;
          _this2.loseFrame.active = !performance.isWon;
          _this2.congrat.active = performance.isWon;
          _this2.confetti.active = performance.isWon;
          _this2.rewardCoinLabel.string = "+" + performance.coin;
          _this2.turnLeftCoinValueLabel.string = "" + performance.turnLeftCoinValue;
          _this2.turnLeftValueLabel.string = "" + performance.turnLeft;
          _this2.baseRewardLabel.string = "" + performance.baseReward;
          if (!animate) {
            resolve();
            return;
          }
          _this2.animating = true;
          var CONGRAT_DELAY = performance.isWon ? .2 : 0;
          var POPUP_DELAY = CONGRAT_DELAY + .2;
          var POPUP_DURATION = performance.isWon ? .3 : .4;
          _this2.backer.active = true;
          _this2.backer.opacity = 0;
          cc.tween(_this2.backer).to(.3, {
            opacity: 200
          }, {
            easing: "quadOut"
          }).start();
          if (performance.isWon) {
            _this2.congrat.active = true;
            _this2.congrat.scale = 0;
            cc.tween(_this2.congrat).delay(CONGRAT_DELAY).to(.4, {
              scale: _this2.uiScale
            }, {
              easing: "backOut"
            }).start();
            _this2.topUI.node.active = true;
            _this2.topUI.node.y = _this2.node.height / 2 + _this2.topUI.node.height * _this2.uiScale;
            cc.tween(_this2.topUI.node).delay(.9 + CONGRAT_DELAY).to(.5, {
              y: _this2.node.height / 2
            }, {
              easing: "backOut"
            }).start();
            _this2.progressFrame.node.active = true;
            _this2.progressFrame.node.y = _this2.node.height / 2 + _this2.progressFrame.node.height * _this2.uiScale;
            cc.tween(_this2.progressFrame.node).delay(1.3 + CONGRAT_DELAY).to(.5, {
              y: .5 * _this2.node.height - PROGRESS_FRAME_OFFSET * _this2.uiScale
            }, {
              easing: "backOut"
            }).call(function() {
              var curLevel = _levelModel["default"].getLevel(_userState["default"].getProgression()).levelNumber - 1;
              _this2.progressFrame.updateValues(true, curLevel - 1, curLevel);
            }).start();
          } else {
            _this2.loseHeartFrame.active = true;
            _this2.loseHeartFrame.scale = 0;
            _this2.loseHeartFrame.opacity = 0;
            var hasHeart = ~~_userState["default"].getHeart().value > 0;
            _this2._isNeedCheckHeartReFill = !hasHeart;
            _this2.refreshPlayAgainLayout();
            _this2.loseFrameSubTitle.string = hasHeart ? "You lost a heart." : "Heartless!";
            _this2.loseHeartLabel.string = hasHeart ? "-1" : "0";
            cc.tween(_this2.loseHeartFrame).delay(.9 + CONGRAT_DELAY).to(.5, {
              scale: _this2.uiScale,
              opacity: 255
            }, {
              easing: "backOut"
            }).start();
          }
          _this2.popup.y = performance.isWon ? _this2.popup.y : 0;
          _this2.popup.active = true;
          _this2.popup.scale = 0;
          _this2.popup.opacity = 0;
          cc.tween(_this2.popup).delay(POPUP_DELAY).to(POPUP_DURATION, {
            scale: _this2.uiScale,
            opacity: 255
          }, {
            easing: "quadOut"
          }).start();
          _this2.cat.node.active = true;
          _this2.cat.node.y = -_this2.node.height / 2 - _this2.cat.node.height * _this2.uiScale;
          _this2.cat.node.opacity = -255;
          cc.tween(_this2.cat.node).delay(.8 + CONGRAT_DELAY).to(.6, {
            y: -_this2.node.height / 2 + 10,
            opacity: 255
          }, {
            easing: "cubicOut"
          }).call(function() {
            _this2.cat.getCurrent(0).timeScale = 1;
            if (performance.isWon) {
              _this2.isThumpUpAnimating = true;
              _this2.setCatThumpUpAnimation();
            }
          }).start();
          performance.isWon && _this2.confetti.children.forEach(function(paper) {
            var time = .8 + .4 * Math.random();
            var movementY = 400 + 100 * Math.random();
            var movementX = .5 * paper.x + .5 * paper.x * Math.random();
            var rotation = 90 * Math.random();
            paper.x -= movementX;
            paper.y -= movementY;
            paper.opacity = 0;
            cc.tween(paper).delay(.1 + CONGRAT_DELAY).by(.8 * time, {
              x: movementX
            }, {
              easing: "cubicOut"
            }).start();
            cc.tween(paper).delay(.1 + CONGRAT_DELAY).to(.1 * time, {
              opacity: 255
            }).delay(.6 * time).to(.3 * time, {
              opacity: 0
            }).start();
            cc.tween(paper).delay(.1 + CONGRAT_DELAY).by(time, {
              angle: rotation
            }, {
              easing: "linear"
            }).start();
            cc.tween(paper).delay(.1 + CONGRAT_DELAY).by(.4 * time, {
              y: movementY
            }, {
              easing: "cubicOut"
            }).delay(.05).by(.8 * time, {
              y: -movementY
            }, {
              easing: "quadIn"
            }).start();
          });
          setTimeout(function() {
            _this2.animating = false;
          }, 1e3 * (POPUP_DURATION + POPUP_DELAY));
        });
      },
      hideUnlockItem: function hideUnlockItem() {
        var _this3 = this;
        var FIRST_DELAY = .1;
        var COMPONENT_DELAY = FIRST_DELAY + .2;
        var SECOND_COMPONENT_DELAY = COMPONENT_DELAY + .1;
        var ANIM_DURATION = .3;
        this.animating = true;
        var congrat = this.unlockItemFrame.getChildByName("congratulations");
        var halowhite = this.unlockItemFrame.getChildByName("halowhite");
        var haloblue = this.unlockItemFrame.getChildByName("haloblue");
        var lightstar = this.unlockItemFrame.getChildByName("lightstar");
        var star1 = this.unlockItemFrame.getChildByName("star1").getComponent(cc.ParticleSystem);
        var star2 = this.unlockItemFrame.getChildByName("star2").getComponent(cc.ParticleSystem);
        var unlockedItemSprite = this.unlockItemFrame.getChildByName("unlockedItem").getComponent(cc.Sprite);
        var bottomContent = this.unlockItemFrame.getChildByName("bottomContent");
        var itemName = bottomContent.getChildByName("itemName").getComponent(cc.Label);
        var placeItNowButton = bottomContent.getChildByName("placeItNowButton").getComponent(cc.Button);
        var putInBagButton = bottomContent.getChildByName("putInBagButton").getComponent(cc.Button);
        var catOkButton = bottomContent.getChildByName("okButton").getComponent(cc.Button);
        star1.stopSystem();
        star2.stopSystem();
        cc.tween(congrat).delay(FIRST_DELAY).to(ANIM_DURATION, {
          scale: 0
        }, {
          easing: "quadOut"
        }).start();
        cc.tween(halowhite).delay(COMPONENT_DELAY).to(ANIM_DURATION, {
          scale: 0
        }, {
          easing: "quadOut"
        }).start();
        cc.tween(haloblue).delay(COMPONENT_DELAY).to(ANIM_DURATION, {
          scale: 0
        }, {
          easing: "quadOut"
        }).start();
        cc.tween(lightstar).delay(COMPONENT_DELAY).to(ANIM_DURATION, {
          scale: 0
        }, {
          easing: "quadOut"
        }).start();
        cc.tween(unlockedItemSprite.node).delay(COMPONENT_DELAY).to(ANIM_DURATION, {
          scale: 0
        }, {
          easing: "quadOut"
        }).start();
        cc.tween(itemName.node).delay(SECOND_COMPONENT_DELAY).to(ANIM_DURATION, {
          scale: 0
        }, {
          easing: "quadOut"
        }).start();
        cc.tween(placeItNowButton.node).delay(FIRST_DELAY).to(ANIM_DURATION, {
          opacity: 0,
          y: this.originButtonY - 200
        }, {
          easing: "quadOut"
        }).start();
        cc.tween(catOkButton.node).delay(FIRST_DELAY).to(ANIM_DURATION, {
          opacity: 0,
          y: this.originButtonY - 200
        }, {
          easing: "quadOut"
        }).start();
        cc.tween(putInBagButton.node).delay(FIRST_DELAY).to(ANIM_DURATION, {
          opacity: 0,
          y: this.originButtonY - 200
        }, {
          easing: "quadOut"
        }).start();
        return new Promise(function(resolve) {
          setTimeout(function() {
            _this3.animating = false;
            _this3.node.active = false;
            resolve();
          }, 1e3 * (SECOND_COMPONENT_DELAY + ANIM_DURATION + .1));
        });
      },
      refreshPlayAgainLayout: function refreshPlayAgainLayout() {
        var hasEnoughLife = ~~_userState["default"].getHeart().value > 0;
        this.homeButton.node.x = hasEnoughLife ? -185 : 0;
        this.playAgainBtn.active = hasEnoughLife;
      },
      nextSceneStage: function nextSceneStage() {
        var unlockedItem = null;
        var type = null;
        if (this.nextUnlockCats.length) {
          unlockedItem = this.nextUnlockCats.splice(0, 1);
          type = "cat";
        } else {
          if (!this.nextUnlockItems.length) {
            this.nextAction();
            return;
          }
          unlockedItem = this.nextUnlockItems.splice(0, 1);
          type = "item";
        }
        this.showUnlockItem(unlockedItem, type);
      },
      showUnlockItem: function showUnlockItem(id, type) {
        var _this4 = this;
        this.app.audioManager.playSfx("unlock_new_item");
        var MAX_UNLOCKED_ITEM_SIZE = 540;
        var CONGRAT_DELAY = .2;
        var COMPONENT_DELAY = CONGRAT_DELAY + .2;
        this.animating = true;
        this.node.active = true;
        this.unlockItemFrame.active = true;
        this.unlockedItem = id;
        var congrat = this.unlockItemFrame.getChildByName("congratulations");
        var halowhite = this.unlockItemFrame.getChildByName("halowhite");
        var haloblue = this.unlockItemFrame.getChildByName("haloblue");
        var lightstar = this.unlockItemFrame.getChildByName("lightstar");
        var star1 = this.unlockItemFrame.getChildByName("star1").getComponent(cc.ParticleSystem);
        var star2 = this.unlockItemFrame.getChildByName("star2").getComponent(cc.ParticleSystem);
        var unlockedItemSprite = this.unlockItemFrame.getChildByName("unlockedItem").getComponent(cc.Sprite);
        var bottomContent = this.unlockItemFrame.getChildByName("bottomContent");
        var itemName = bottomContent.getChildByName("itemName").getComponent(cc.Label);
        var placeItNowButton = bottomContent.getChildByName("placeItNowButton").getComponent(cc.Button);
        var putInBagButton = bottomContent.getChildByName("putInBagButton").getComponent(cc.Button);
        var catOkButton = bottomContent.getChildByName("okButton").getComponent(cc.Button);
        var unlockedItemRatio = Math.max(unlockedItemSprite.node.width / MAX_UNLOCKED_ITEM_SIZE, unlockedItemSprite.node.height / MAX_UNLOCKED_ITEM_SIZE);
        unlockedItemSprite.node.width /= unlockedItemRatio;
        unlockedItemSprite.node.height /= unlockedItemRatio;
        unlockedItemSprite.spriteFrame = "item" === type ? this[id] : this["cat_" + id];
        catOkButton.node.active = "cat" === type;
        placeItNowButton.node.active = "item" === type;
        putInBagButton.node.active = "item" === type;
        var unlockedItemName = "item" === type ? _yard["default"].items[id].name : _cats["default"][id].name;
        itemName.string = "item" === type ? "The " + unlockedItemName + " is now available\nin your garden" : unlockedItemName;
        congrat.scale = 0;
        var hasTutorial = 0 === this.app.catTutorial.getCurrentStep() || 5 === this.app.catTutorial.getCurrentStep();
        if (hasTutorial) {
          putInBagButton.node.x = 0;
          placeItNowButton.node.active = false;
        }
        cc.tween(congrat).delay(CONGRAT_DELAY).to(.4, {
          scale: this.uiScale
        }, {
          easing: "backOut"
        }).start();
        halowhite.scale = 0;
        haloblue.scale = 0;
        lightstar.scale = 0;
        unlockedItemSprite.node.scale = 0;
        itemName.node.scale = 0;
        placeItNowButton.node.opacity = 0;
        putInBagButton.node.opacity = 0;
        catOkButton.node.opacity = 0;
        placeItNowButton.node.y = this.originButtonY - 200;
        putInBagButton.node.y = this.originButtonY - 200;
        catOkButton.node.y = this.originButtonY - 200;
        star1.node.active = false;
        star2.node.active = false;
        cc.tween(halowhite).delay(COMPONENT_DELAY).to(.4, {
          scale: 1
        }, {
          easing: "sineOut"
        }).start();
        cc.tween(haloblue).delay(COMPONENT_DELAY).to(.4, {
          scale: 1
        }, {
          easing: "sineOut"
        }).start();
        cc.tween(lightstar).delay(COMPONENT_DELAY + .1).to(.4, {
          scale: 1
        }, {
          easing: "sineOut"
        }).start();
        cc.tween(unlockedItemSprite.node).delay(COMPONENT_DELAY + .1).to(.4, {
          scale: 2
        }, {
          easing: "backOut"
        }).start();
        cc.tween(itemName.node).delay(COMPONENT_DELAY + .3).to(.5, {
          scale: 1
        }, {
          easing: "backOut"
        }).start();
        setTimeout(function() {
          star1.node.active = true;
          star2.node.active = true;
          star1.resetSystem();
          star2.resetSystem();
        }, 1e3 * (COMPONENT_DELAY + .2));
        cc.tween(placeItNowButton.node).delay(COMPONENT_DELAY + .8).to(.4, {
          opacity: 255,
          y: this.originButtonY
        }, {
          easing: "quadOut"
        }).start();
        cc.tween(catOkButton.node).delay(COMPONENT_DELAY + .8).to(.4, {
          opacity: 255,
          y: this.originButtonY
        }, {
          easing: "quadOut"
        }).start();
        cc.tween(putInBagButton.node).delay(COMPONENT_DELAY + .8).to(.4, {
          opacity: 255,
          y: this.originButtonY
        }, {
          easing: "quadOut"
        }).start();
        setTimeout(function() {
          _this4.animating = false;
        }, 1e3 * (COMPONENT_DELAY + 1.2));
      },
      updateScreenSize: function updateScreenSize(frame) {
        var parent = this.node.parent;
        this.node.width = parent.width;
        this.node.height = parent.height;
        this.backer.height = this.node.height;
        var uiTotalHeight = this.progressFrame.node.height + PROGRESS_FRAME_OFFSET;
        uiTotalHeight += 2 * CONGRAT_SPACING + this.congrat.height;
        uiTotalHeight += this.popup.height;
        uiTotalHeight += CAT_SPACING + this.cat.node.height;
        this.uiScale = 1;
        parent.height < uiTotalHeight && (this.uiScale = parent.height / uiTotalHeight);
        this.cat.node.y = -this.node.height / 2;
        this.cat.node.scale = this.uiScale;
        this.topUI.node.y = .5 * this.node.height;
        this.topUI.updateScreenSize(frame, this.uiScale);
        this.progressFrame.node.y = .5 * this.node.height - PROGRESS_FRAME_OFFSET * this.uiScale;
        this.progressFrame.node.scale = this.uiScale;
        this.progressFrame.updateScreenSize(frame, this.uiScale);
        this.loseHeartFrame.scale = this.uiScale;
        this.loseHeartFrame.y = this.topUI.node.y - .5 * this.topUI.node.height * this.uiScale;
        var precalculatedCongratY = this.progressFrame.node.y - (this.progressFrame.node.height + CONGRAT_SPACING + .5 * this.congrat.height) * this.uiScale;
        this.popup.scale = this.uiScale;
        var popupTopAnchor = precalculatedCongratY - (.5 * this.congrat.height + CONGRAT_SPACING) * this.uiScale;
        var popupBotAnchor = this.cat.node.y + this.cat.node.height * this.uiScale;
        this.popup.y = .5 * (popupTopAnchor + popupBotAnchor);
        var recalculatedCongratY = this.popup.y + (.5 * this.popup.height + CONGRAT_SPACING + .5 * this.congrat.height) * this.uiScale;
        this.congrat.y = .5 * (precalculatedCongratY + recalculatedCongratY);
        this.congrat.scale = this.uiScale;
        this.confetti.scale = this.uiScale;
        this.confetti.y = this.congrat.y;
        this.unlockItemFrame.y = .05 * this.node.height;
        var congrat = this.unlockItemFrame.getChildByName("congratulations");
        congrat.y = .35 * this.node.height;
        congrat.scale = this.uiScale;
        var bottomContent = this.unlockItemFrame.getChildByName("bottomContent");
        var bottomContentToleranceY = 406 + bottomContent.height;
        var bottomContentMaxY = .5 * this.node.height;
        bottomContent.y = -Math.min(bottomContentMaxY, .5 * (bottomContentMaxY - bottomContentToleranceY) + bottomContentToleranceY);
      },
      setNextButtonState: function setNextButtonState(enabled) {
        this.nextButton.node.active = enabled;
        this.homeButton.node.x = enabled ? this.homeButton.node.x : 0;
      },
      setCatThumpUpAnimation: function setCatThumpUpAnimation() {
        this.cat.addAnimation(0, "Cat_thumb", false);
        this.thumpUpTimer = this.cat.getCurrent(0).animation.duration + 1 + Math.random();
      },
      onTryAgainClicked: function onTryAgainClicked() {
        var _this5 = this;
        this.app.audioManager.playSfx("click");
        this.animating || this.hide(true).then(function() {
          return _this5.onTryAgainCb();
        });
      },
      onNextClicked: function onNextClicked() {
        var _this6 = this;
        this.app.audioManager.playSfx("click");
        if (!this.animating) {
          this.nextAction = this.onNextLevelCb;
          this.hide(true).then(function() {
            return _this6.nextSceneStage();
          });
        }
      },
      onHomeClicked: function onHomeClicked() {
        var _this7 = this;
        this.app.audioManager.playSfx("click");
        if (!this.animating) {
          this.nextAction = this.onHomeCb;
          this.hide(true).then(function() {
            return _this7.nextSceneStage();
          });
        }
      },
      onPlaceItNowClicked: function onPlaceItNowClicked() {
        var _this8 = this;
        if (this.animating) return;
        this.app.audioManager.playSfx("click");
        this.nextAction = this.onNextLevelCb;
        this.hideUnlockItem().then(function() {
          return _this8.nextSceneStage();
        });
      },
      onPutInBagClicked: function onPutInBagClicked() {
        var _this9 = this;
        if (this.animating) return;
        this.app.audioManager.playSfx("click");
        this.nextAction = this.onHomeCb;
        this.hideUnlockItem().then(function() {
          return _this9.nextSceneStage();
        });
      },
      onCatOkClicked: function onCatOkClicked() {
        var _this10 = this;
        this.app.audioManager.playSfx("click");
        this.animating || this.hideUnlockItem().then(function() {
          return _this10.nextSceneStage();
        });
      }
    });
    cc._RF.pop();
  }, {
    "../models/levelModel.js": "levelModel",
    "../staticData/cats": "cats",
    "../staticData/yard": "yard",
    "../userState": "userState"
  } ],
  RewardPopup: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d42e1uMeZFGAL8ZtVF58zIZ", "RewardPopup");
    "use strict";
    var _constants = _interopRequireDefault(require("../constants"));
    var _userState = _interopRequireDefault(require("../userState"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: cc.Component,
      properties: {
        lightstar1: cc.Node,
        lightstar2: cc.Node,
        backer: cc.Node,
        content: cc.Node,
        itemCountLabel: cc.Label,
        itemIcon: cc.Sprite,
        fishIcon: cc.SpriteFrame
      },
      onLoad: function onLoad() {
        this.app = cc.find("app").getComponent("app");
      },
      update: function update(dt) {
        this.lightstar1.angle += 20 * dt;
        this.lightstar2.angle += 20 * dt;
        this.lightstar1.scale = .9 + .05 * Math.sin(this.app.now / 1e3 * 4);
        this.lightstar2.scale = .9 + .1 * Math.cos((this.app.now + 1e3) / 1e3 * 5);
      },
      show: function show(item, itemCount, claimCb) {
        this.claimCb = claimCb;
        "fish" === item && (this.fishIcon.spriteFrame = this.fishIcon);
        this.itemCountLabel.string = itemCount;
        this.node.active = true;
        this.backer.active = true;
        this.node.active = true;
        cc.tween(this.content).to(1, {
          opacity: 255,
          scale: 1
        }, {
          easing: "quadOut"
        }).start();
      },
      hide: function hide() {
        var _this = this;
        this.backer.active = false;
        cc.tween(this.content).to(.3, {
          opacity: 0,
          scale: 0
        }, {
          easing: "quadOut"
        }).call(function() {
          return _this.node.active = false;
        }).start();
      },
      onClaimClicked: function onClaimClicked() {
        this.hide();
        this.app.audioManager.playSfx("click");
        _userState["default"].updateFish(_constants["default"].FIRST_FISH_REWARD_AMOUNT);
        _userState["default"].saveStates();
        this.claimCb && this.claimCb();
      },
      updateScreenSize: function updateScreenSize(frame, uiScale) {
        this.node.scale = uiScale;
      }
    });
    cc._RF.pop();
  }, {
    "../constants": "constants",
    "../userState": "userState"
  } ],
  Rnd: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e2920RCqHhF3ZR1qFh+5ZZN", "Rnd");
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var Rnd = function() {
      function Rnd(seed) {
        this.m_z = null;
        this.m_w = null;
        this.mask = 4294967295;
        this.setSeed(seed);
      }
      var _proto = Rnd.prototype;
      _proto.setSeed = function setSeed(seed) {
        this.seed = isNaN(seed) ? Date.now() : Number(seed);
        this.m_w = 987654321 + this.seed;
        this.m_z = 123456789 - this.seed;
      };
      _proto.getSeed = function getSeed() {
        return this.seed;
      };
      _proto.random = function random() {
        this.m_z = 36969 * (65535 & this.m_z) + (this.m_z >> 16) & this.mask;
        this.m_w = 18e3 * (65535 & this.m_w) + (this.m_w >> 16) & this.mask;
        var result = (this.m_z << 16) + this.m_w & this.mask;
        result /= 4294967296;
        return result + .5;
      };
      return Rnd;
    }();
    exports["default"] = Rnd;
    module.exports = exports["default"];
    cc._RF.pop();
  }, {} ],
  Scheduler: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2ba77waTxxJnYTaiZIXxf5P", "Scheduler");
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var Scheduler = function() {
      function Scheduler(app) {
        this.app = app;
        this._nextUid = 0;
        this.active = false;
        this.registered = {};
        this.registeredCount = 0;
      }
      var _proto = Scheduler.prototype;
      _proto.setTimeout = function setTimeout(method, delay) {
        return this._set(method, delay, "timeout");
      };
      _proto.setInterval = function setInterval(method, delay) {
        return this._set(method, delay, "interval");
      };
      _proto._set = function _set(method, delay, type) {
        var timerId = ++this._nextUid;
        this.registered[timerId] = {
          timerId: timerId,
          method: method,
          updateAfter: this.app.now + delay,
          type: type,
          delay: delay
        };
        this.registeredCount++;
        this.active = true;
        return timerId;
      };
      _proto.clearTimeout = function clearTimeout(timerId) {
        return this._clear(timerId);
      };
      _proto.clearInterval = function clearInterval(timerId) {
        return this._clear(timerId);
      };
      _proto._clear = function _clear(timerId) {
        if (!this.registered[timerId]) return;
        delete this.registered[timerId];
        this.registeredCount--;
        0 === this.registeredCount && (this.active = false);
      };
      _proto.onUpdate = function onUpdate() {
        for (var timerId in this.registered) {
          var entry = this.registered[timerId];
          if (entry.updateAfter <= this.app.now) {
            if ("timeout" === entry.type) {
              delete this.registered[timerId];
              this.registeredCount--;
            } else entry.updateAfter += entry.delay;
            entry.method();
          }
        }
        0 === this.registeredCount && (this.active = false);
      };
      return Scheduler;
    }();
    exports["default"] = Scheduler;
    module.exports = exports["default"];
    cc._RF.pop();
  }, {} ],
  SettingsPopup: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "dae3dWTqFpHd66ekGC8OnEu", "SettingsPopup");
    "use strict";
    var _userState = _interopRequireDefault(require("../userState"));
    var _constants = _interopRequireDefault(require("../constants.js"));
    var _helpers = _interopRequireDefault(require("../helpers"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var ANIMATION_DURATION = .3;
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        this.app = cc.find("app").getComponent("app");
        this.home = cc.find("Canvas").getComponent("Home");
        this.popup = this.node.getChildByName("popup");
        var QAButton = this.popup.getChildByName("QAButton").getComponent("cc.Button");
        var closeButton = this.popup.getChildByName("closeButton").getComponent("cc.Button");
        var content = this.popup.getChildByName("content");
        this.musicSlider = content.getChildByName("musicSlider");
        this.musicSlider.on("slide", this.onMusicVolumeChanged, this);
        this.fishInput = content.getChildByName("fishInput").getComponent(cc.EditBox);
        this.fishInput.string = _userState["default"].getStates().feedFishAmount;
        this.fishInput.node.on("editing-did-ended", this.onFishInputChanged, this);
        QAButton.node.active = _constants["default"].FORCE_ENABLE_QA || this.app.IS_DEVELOPMENT;
        QAButton.node.on("click", this.onQAButtonClicked, this);
        closeButton.node.on("click", this.onCloseClicked, this);
      },
      show: function show(animate) {
        var _this = this;
        void 0 === animate && (animate = false);
        this.popup = this.node.getChildByName("popup");
        var settings = _userState["default"].getSettings();
        this.node.active = true;
        this.musicSlider.getComponent("cc.Slider").progress = settings.music;
        this.musicSlider.getComponent("Slider").onValueChanged();
        if (animate) {
          this.animating = true;
          cc.tween(this.node).to(ANIMATION_DURATION, {
            opacity: 255
          }, {
            easing: "quadOut"
          }).call(function() {
            _this.animating = false;
          }).start();
        } else this.node.opacity = 255;
      },
      hide: function hide(animate) {
        var _this2 = this;
        void 0 === animate && (animate = false);
        if (animate) {
          this.animating = true;
          cc.tween(this.node).to(ANIMATION_DURATION, {
            opacity: 0
          }, {
            easing: "quadOut"
          }).call(function() {
            _this2.node.active = false;
            _this2.animating = false;
          }).start();
        } else {
          this.node.active = false;
          this.node.opacity = 0;
        }
      },
      onFishInputChanged: function onFishInputChanged() {
        var inputValue = Math.min(999, Math.max(1, ~~this.fishInput.string));
        _userState["default"].updateValueByKey("feedFishAmount", inputValue);
        this.fishInput.string = inputValue;
      },
      onQAButtonClicked: function onQAButtonClicked() {
        var _this3 = this;
        if (_constants["default"].FORCE_ENABLE_QA || this.app.IS_DEVELOPMENT) {
          this.hide(true);
          setTimeout(function() {
            _this3.home.showQAPanel();
          }, ANIMATION_DURATION);
        }
      },
      onCloseClicked: function onCloseClicked(animate) {
        void 0 === animate && (animate = false);
        if (this.animating) return;
        this.hide(true);
        this.app.audioManager.playSfx("click");
        var settings = _userState["default"].getSettings();
        settings.music = this.musicSlider.getComponent("cc.Slider").progress;
        _userState["default"].saveSettings();
      },
      onMusicVolumeChanged: function onMusicVolumeChanged() {
        var value = this.musicSlider.getComponent("cc.Slider").progress;
        this.app.audioManager.setMusicVolume(value);
      },
      updateScreenSize: function updateScreenSize(frame, uiScale) {}
    });
    cc._RF.pop();
  }, {
    "../constants.js": "constants",
    "../helpers": "helpers",
    "../userState": "userState"
  } ],
  ShopCommands: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0c787lQU21J+pMIP85tVoEo", "ShopCommands");
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var _userState = _interopRequireDefault(require("../userState"));
    var _shop = _interopRequireDefault(require("../staticData/shop"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    function buy(itemId, number) {
      var coins = _userState["default"].getCoin();
      var booseterData = _userState["default"].getBoosters();
      var itemData = _shop["default"][itemId];
      var totalPrice = itemData.price * number;
      if (totalPrice > coins) return false;
      switch (itemId) {
       case "fish":
        _userState["default"].updateFish(_shop["default"].fish.quantity * number);
        break;

       case "fish5":
        _userState["default"].updateFish(_shop["default"].fish5.quantity * number);
        break;

       case "fish10":
        _userState["default"].updateFish(_shop["default"].fish10.quantity * number);
        break;

       case "hammer":
       case "airplane":
       case "rocket":
       case "paintbrush":
       case "fairystick":
       case "wheel":
        booseterData[itemId].amount += number;
        booseterData[itemId].unlocked = true;
        _userState["default"].saveBoostersState();
      }
      _userState["default"].updateCoin(-totalPrice);
      return true;
    }
    var _default = {
      buy: buy
    };
    exports["default"] = _default;
    module.exports = exports["default"];
    cc._RF.pop();
  }, {
    "../staticData/shop": "shop",
    "../userState": "userState"
  } ],
  ShopConfirmPopup: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8cc95TY3NdPCac3A0X4+Iip", "ShopConfirmPopup");
    "use strict";
    var _ShopCommands = _interopRequireDefault(require("../commands/ShopCommands"));
    var _userState = _interopRequireDefault(require("../userState"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var ANIMATION_DURATION = .3;
    var SHOP_MAX_NUMBER = 99;
    cc.Class({
      extends: cc.Component,
      properties: {
        fish: {
          default: null,
          type: cc.SpriteFrame
        },
        fish5: {
          default: null,
          type: cc.SpriteFrame
        },
        fish10: {
          default: null,
          type: cc.SpriteFrame
        },
        airplane: {
          default: null,
          type: cc.SpriteFrame
        },
        fairystick: {
          default: null,
          type: cc.SpriteFrame
        },
        hammer: {
          default: null,
          type: cc.SpriteFrame
        },
        paintbrush: {
          default: null,
          type: cc.SpriteFrame
        },
        rocket: {
          default: null,
          type: cc.SpriteFrame
        },
        wheel: {
          default: null,
          type: cc.SpriteFrame
        }
      },
      onLoad: function onLoad() {
        this.app = cc.find("app").getComponent("app");
        this.popup = this.node.getChildByName("popup");
        this.notEnoughCoinFrame = this.node.getChildByName("notEnoughCoin");
        var buyButton = this.popup.getChildByName("buyButton");
        var closeButton = this.popup.getChildByName("closeButton");
        var frame = this.popup.getChildByName("frame");
        this.nameLabel = frame.getChildByName("nameLabel").getComponent(cc.Label);
        this.icon = frame.getChildByName("icon").getComponent(cc.Sprite);
        this.numberLabel = frame.getChildByName("numberLabel").getComponent(cc.Label);
        this.descriptionLabel = frame.getChildByName("descriptionLabel").getComponent(cc.Label);
        this.buttonLabel = buyButton.getChildByName("Label").getComponent(cc.Label);
        var plusButton = frame.getChildByName("plusButton");
        var minusButton = frame.getChildByName("minusButton");
        this.selectingNumber = 1;
        plusButton.on("click", this.onPlusClicked, this);
        minusButton.on("click", this.onMinusClicked, this);
        buyButton.on("click", this.onBuyClicked, this);
        closeButton.on("click", this.onCloseClicked, this);
      },
      start: function start() {},
      loadData: function loadData(data) {
        this.data = data;
        this.selectingNumber = 1;
        this.nameLabel.string = data.name;
        this.icon.spriteFrame = this[data.id];
        this.descriptionLabel.string = data.description || "";
        this.buttonLabel.string = this.data.price * this.selectingNumber;
        this.numberLabel.string = this.selectingNumber;
      },
      show: function show(data, animate) {
        var _this = this;
        void 0 === animate && (animate = false);
        this.node.active = true;
        this.loadData(data);
        if (animate) {
          this.animating = true;
          cc.tween(this.node).to(ANIMATION_DURATION, {
            opacity: 255
          }, {
            easing: "quadOut"
          }).call(function() {
            _this.animating = false;
          }).start();
        } else this.node.opacity = 255;
      },
      hide: function hide(animate) {
        var _this2 = this;
        void 0 === animate && (animate = false);
        if (animate) {
          this.animating = true;
          cc.tween(this.node).to(ANIMATION_DURATION, {
            opacity: 0
          }, {
            easing: "quadOut"
          }).call(function() {
            _this2.node.active = false;
            _this2.animating = false;
          }).start();
        } else {
          this.node.active = false;
          this.node.opacity = 0;
        }
      },
      showNotEnoughCoin: function showNotEnoughCoin() {
        var _this3 = this;
        this.notEnoughCoinFrame.active = true;
        this.animating = true;
        var backer = this.notEnoughCoinFrame.getChildByName("backer");
        var cat = this.notEnoughCoinFrame.getChildByName("cat");
        var bubble = this.notEnoughCoinFrame.getChildByName("bubble");
        backer.opacity = 0;
        cc.tween(backer).to(.5, {
          opacity: 190
        }, {
          easing: "quadOut"
        }).start();
        cat.x = .5 * -this.node.width - cat.width;
        cc.tween(cat).delay(.1).to(.3, {
          x: .5 * -this.node.width
        }, {
          easing: "quadOut"
        }).start();
        bubble.scale = 0;
        cc.tween(bubble).delay(.3).to(.4, {
          scale: 1
        }, {
          easing: "backOut"
        }).start();
        setTimeout(function() {
          _this3.hideNotEnoughCoin();
        }, 1200);
      },
      hideNotEnoughCoin: function hideNotEnoughCoin() {
        var _this4 = this;
        var backer = this.notEnoughCoinFrame.getChildByName("backer");
        var cat = this.notEnoughCoinFrame.getChildByName("cat");
        var bubble = this.notEnoughCoinFrame.getChildByName("bubble");
        cc.tween(bubble).to(.35, {
          scale: 0
        }, {
          easing: "quadOut"
        }).start();
        cc.tween(cat).delay(.2).to(.3, {
          x: .5 * -this.node.width - cat.width
        }, {
          easing: "quadOut"
        }).start();
        cc.tween(backer).delay(.2).to(.5, {
          opacity: 0
        }, {
          easing: "quadOut"
        }).call(function() {
          _this4.animating = false;
          _this4.notEnoughCoinFrame.active = false;
        }).start();
      },
      updateScreenSize: function updateScreenSize(frame, uiScale) {},
      onPlusClicked: function onPlusClicked() {
        this.app.audioManager.playSfx("click");
        var newValue = Math.min(this.selectingNumber + 1, SHOP_MAX_NUMBER);
        var curCoin = _userState["default"].getStates().coin;
        if (newValue * this.data.price > curCoin) return this.showNotEnoughCoin();
        this.selectingNumber = newValue;
        this.numberLabel.string = this.selectingNumber;
        this.buttonLabel.string = this.data.price * this.selectingNumber;
      },
      onMinusClicked: function onMinusClicked() {
        this.app.audioManager.playSfx("click");
        this.selectingNumber = Math.max(this.selectingNumber - 1, 1);
        this.numberLabel.string = this.selectingNumber;
        this.buttonLabel.string = this.data.price * this.selectingNumber;
      },
      onBuyClicked: function onBuyClicked() {
        this.app.audioManager.playSfx("click");
        if (_ShopCommands["default"].buy(this.data.id, this.selectingNumber)) {
          this.app.boostersRefreshRequest = true;
          this.parentScene.updateCoin();
          this._isFish(this.data.id) && this.parentScene.updateFish();
          this.hide(true);
        } else this.showNotEnoughCoin();
      },
      onCloseClicked: function onCloseClicked() {
        this.app.audioManager.playSfx("click");
        this.hide(true);
      },
      _isFish: function _isFish(productId) {
        return "fish" === productId || "fish5" === productId || "fish10" === productId;
      }
    });
    cc._RF.pop();
  }, {
    "../commands/ShopCommands": "ShopCommands",
    "../userState": "userState"
  } ],
  ShopItem: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "cf04aLV959CJ7oCDIIqWbgp", "ShopItem");
    "use strict";
    var _supplyModel = _interopRequireDefault(require("../models/supplyModel"));
    var _userState = _interopRequireDefault(require("../userState"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: cc.Component,
      properties: {
        fish: {
          default: null,
          type: cc.SpriteFrame
        },
        fish5: {
          default: null,
          type: cc.SpriteFrame
        },
        fish10: {
          default: null,
          type: cc.SpriteFrame
        },
        airplane: {
          default: null,
          type: cc.SpriteFrame
        },
        fairystick: {
          default: null,
          type: cc.SpriteFrame
        },
        hammer: {
          default: null,
          type: cc.SpriteFrame
        },
        paintbrush: {
          default: null,
          type: cc.SpriteFrame
        },
        rocket: {
          default: null,
          type: cc.SpriteFrame
        },
        wheel: {
          default: null,
          type: cc.SpriteFrame
        }
      },
      onLoad: function onLoad() {
        this.icon = this.node.getChildByName("icon").getComponent(cc.Sprite);
        this.quantityLabel = this.node.getChildByName("quantity").getComponent(cc.Label);
        this.button = this.node.getChildByName("button");
        this.buttonLabel = this.button.getChildByName("Background").getChildByName("Label").getComponent(cc.Label);
        this.lockedFrame = this.node.getChildByName("lockedFrame");
        this.lbUnlockedLevel = this.lockedFrame.getChildByName("lbUnlockedLevel").getComponent(cc.Label);
        this.button.on("click", this.onClicked, this);
      },
      onEnable: function onEnable() {
        this.refreshBoosterFrame();
      },
      loadData: function loadData(data, onItemClicked) {
        this.data = data;
        this.onItemClicked = onItemClicked;
        this.icon.spriteFrame = this[data.id];
        this.quantityLabel.string = "x" + (data.quantity || 0);
        this.buttonLabel.string = data.price;
        this.refreshBoosterFrame();
      },
      refreshBoosterFrame: function refreshBoosterFrame() {
        if (!this.data) return;
        if ("booster" === this.data.type) {
          var booster = _userState["default"].getBoosters();
          this.lockedFrame.active = !booster[this.data.id].unlocked;
          var unlockedLevel = _supplyModel["default"].getBoosterUnlockedLevel(this.data.id);
          this.lbUnlockedLevel.string = "Level " + unlockedLevel + " Required";
        } else this.lockedFrame.active = false;
      },
      updateNumber: function updateNumber(number) {
        this.quantityLabel.string = "x" + (0 | number);
      },
      onClicked: function onClicked() {
        this.onItemClicked && this.onItemClicked(this.data.id);
      }
    });
    cc._RF.pop();
  }, {
    "../models/supplyModel": "supplyModel",
    "../userState": "userState"
  } ],
  ShopSubscene: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "bc475m2pV1IVIwyYY66R/3j", "ShopSubscene");
    "use strict";
    var _shop = _interopRequireDefault(require("../../staticData/shop"));
    var _userState = _interopRequireDefault(require("../../userState"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    function _extends() {
      _extends = Object.assign || function(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];
          for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
      };
      return _extends.apply(this, arguments);
    }
    var LIST_SPACING = 100;
    var ITEM_HEIGHT = 500;
    cc.Class({
      extends: cc.Component,
      properties: {
        ShopItem: {
          default: null,
          type: cc.Prefab
        }
      },
      onLoad: function onLoad() {
        this.audioManager = cc.find("AudioManager").getComponent("AudioManager");
        this.shopConfirmPopup = this.node.getChildByName("ShopConfirmPopup").getComponent("ShopConfirmPopup");
        this.shopConfirmPopup.parentScene = this;
        this.scrollView = this.node.getChildByName("scrollview").getComponent(cc.ScrollView);
        this.scrollFrame = this.scrollView.content;
        var topUI = this.node.getChildByName("topUI");
        var coinFrame = topUI.getChildByName("coinFrame");
        var fishFrame = topUI.getChildByName("fishFrame");
        this.coinLabel = coinFrame.getChildByName("coinLabel").getComponent(cc.Label);
        this.fishLabel = fishFrame.getChildByName("fishLabel").getComponent(cc.Label);
        this.shopItems = {};
        var shopCounter = 0;
        for (var key in _shop["default"]) {
          var shopItem = cc.instantiate(this.ShopItem).getComponent("ShopItem");
          shopItem.node.setParent(this.scrollFrame);
          shopItem.node.x = shopCounter % 2 ? 200 : -200;
          shopItem.node.y = -LIST_SPACING - Math.floor(.5 * shopCounter) * ITEM_HEIGHT;
          shopItem.loadData(_extends({
            id: key
          }, _shop["default"][key]), this.onItemClicked.bind(this));
          this.shopItems[key] = shopItem;
          shopCounter++;
        }
        this.scrollFrame.height = ITEM_HEIGHT * Math.ceil(.5 * shopCounter) + 2 * LIST_SPACING;
      },
      onEnable: function onEnable() {
        this.shopConfirmPopup.hide();
        this.updateCoin();
        this.updateFish();
      },
      onOpened: function onOpened(opts) {
        if (opts && opts.id && this.shopItems[opts.id]) {
          var itemY = -this.shopItems[opts.id].node.y + .5 * ITEM_HEIGHT;
          var topCap = this.scrollFrame.height - .5 * this.scrollView.node.height;
          this.scrollFrame.y = Math.min(Math.max(0, itemY), topCap);
        }
      },
      updateCoin: function updateCoin() {
        this.coinLabel.string = _userState["default"].getCoin();
      },
      updateFish: function updateFish() {
        this.fishLabel.string = _userState["default"].getFish();
      },
      onItemClicked: function onItemClicked(id) {
        this.audioManager.playSfx("click");
        this.shopConfirmPopup.show(_extends({
          id: id
        }, _shop["default"][id]), true);
      },
      updateScreenSize: function updateScreenSize(frame, uiScale) {
        var wallpaper = this.node.getChildByName("wallpaper");
        wallpaper.height = this.node.height;
        var topUI = this.node.getChildByName("topUI");
        topUI.y = .5 * this.node.height;
        topUI.scale = uiScale;
        var shelter = topUI.getChildByName("shelter");
        shelter.width = this.node.width / uiScale;
        var backer = topUI.getChildByName("backer");
        backer.width = this.node.width / uiScale;
        var coinFrame = topUI.getChildByName("coinFrame");
        coinFrame.x = .33 * -backer.width;
        this.shopConfirmPopup.updateScreenSize(frame, uiScale);
      }
    });
    cc._RF.pop();
  }, {
    "../../staticData/shop": "shop",
    "../../userState": "userState"
  } ],
  Slider: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8ac23lCB2xKhZ1lBn7KpAT4", "Slider");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        this.slider = this.node.getComponent(cc.Slider);
        this.mask = this.node.getChildByName("Mask");
        this.slider.node.on("slide", this.onValueChanged, this);
      },
      onValueChanged: function onValueChanged() {
        this.mask.width = this.node.width * this.slider.progress;
      }
    });
    cc._RF.pop();
  }, {} ],
  SpriteCollection: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ddfeeBQralOx5laFJGHa65b", "SpriteCollection");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        missileRight: {
          default: null,
          type: cc.SpriteFrame
        },
        missileLeft: {
          default: null,
          type: cc.SpriteFrame
        },
        missileTop: {
          default: null,
          type: cc.SpriteFrame
        },
        missileBottom: {
          default: null,
          type: cc.SpriteFrame
        },
        border1: {
          default: null,
          type: cc.SpriteFrame
        },
        border2: {
          default: null,
          type: cc.SpriteFrame
        },
        border3: {
          default: null,
          type: cc.SpriteFrame
        },
        material_highlight: {
          default: null,
          type: cc.Material
        },
        material_spineHighlight: {
          default: null,
          type: cc.Material
        },
        rocket: {
          default: null,
          type: cc.SpriteFrame
        },
        airplane: {
          default: null,
          type: cc.SpriteFrame
        },
        missileAnim: {
          default: null,
          type: cc.Prefab
        },
        flameAnim: {
          default: null,
          type: cc.Prefab
        },
        rayOfLight: {
          default: null,
          type: cc.Prefab
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  StartSelectionItem: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "7f6e4MZLENPTZWesyV9JJ20", "StartSelectionItem");
    "use strict";
    var MAX_ICON_SIZE = 112;
    cc.Class({
      extends: cc.Component,
      properties: {
        booster_airplane: {
          default: null,
          type: cc.SpriteFrame
        },
        booster_fairystick: {
          default: null,
          type: cc.SpriteFrame
        },
        booster_hammer: {
          default: null,
          type: cc.SpriteFrame
        },
        booster_paintbrush: {
          default: null,
          type: cc.SpriteFrame
        },
        booster_rocket: {
          default: null,
          type: cc.SpriteFrame
        },
        booster_wheel: {
          default: null,
          type: cc.SpriteFrame
        },
        cat_bella: {
          default: null,
          type: cc.SpriteFrame
        },
        cat_bob: {
          default: null,
          type: cc.SpriteFrame
        },
        cat_dora: {
          default: null,
          type: cc.SpriteFrame
        },
        cat_leo: {
          default: null,
          type: cc.SpriteFrame
        },
        cat_lily: {
          default: null,
          type: cc.SpriteFrame
        },
        cat_luna: {
          default: null,
          type: cc.SpriteFrame
        },
        cat_max: {
          default: null,
          type: cc.SpriteFrame
        },
        cat_milo: {
          default: null,
          type: cc.SpriteFrame
        },
        lockIcon: {
          default: null,
          type: cc.SpriteFrame
        }
      },
      onLoad: function onLoad() {
        this.node.on("click", this.onClicked, this);
      },
      start: function start() {},
      loadItem: function loadItem(type, data) {
        this.type = type;
        this.data = data;
        this.selectingBorder = this.node.getChildByName("selectingBorder");
        this.icon = this.node.getChildByName("icon").getComponent(cc.Sprite);
        this.checkSlot = this.node.getChildByName("checkSlot");
        this.checkMark = this.node.getChildByName("checkMark");
        this.quantity = this.node.getChildByName("quantity").getComponent(cc.Label);
        if (!data.unlocked) {
          this.setLocked();
          return;
        }
        this.setSelected(data.selected);
        this.updateIcon(this[type + "_" + data.id], "booster" === type ? 1.1 : 1);
        if ("booster" === type) {
          this.quantity.node.active = true;
          this.quantity.string = data.amount;
        } else "cat" === type && (this.quantity.node.active = false);
      },
      setLocked: function setLocked() {
        this.updateIcon(this.lockIcon);
        this.selectingBorder.active = false;
        this.checkSlot.active = false;
        this.checkMark.active = false;
        this.quantity.node.active = false;
      },
      setSelected: function setSelected(value) {
        this.selectingBorder.active = value;
        this.checkMark.active = value;
        this.data.selected = value;
      },
      updateIcon: function updateIcon(spriteFrame, multiplier) {
        void 0 === multiplier && (multiplier = 1);
        this.icon.spriteFrame = spriteFrame;
        var maxSize = Math.max(this.icon.node.width, this.icon.node.height, MAX_ICON_SIZE);
        this.icon.node.scale = MAX_ICON_SIZE / maxSize * multiplier;
      },
      onClicked: function onClicked() {
        this.onItemClicked && this.data.unlocked && this.onItemClicked(this);
      }
    });
    cc._RF.pop();
  }, {} ],
  StartSelectionPopup: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6ade0ZPCXRDEb+onzIEqhOC", "StartSelectionPopup");
    "use strict";
    var _constants = _interopRequireDefault(require("../constants"));
    var _userState = _interopRequireDefault(require("../userState"));
    var _catModels = _interopRequireDefault(require("../models/catModels"));
    var _cats = _interopRequireDefault(require("../staticData/cats"));
    var _boosters = _interopRequireDefault(require("../staticData/boosters"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    function _extends() {
      _extends = Object.assign || function(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];
          for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
      };
      return _extends.apply(this, arguments);
    }
    var MAX_BOOSTER_SELECTION = _constants["default"].MAX_BOOSTER_SELECTION;
    var OBJECTIVE_ITEM_SIZE = 94;
    var OBJECTIVE_ITEM_SPACING = 36;
    var SELECTION_ITEM_SIZE = 128;
    var SELECTION_ITEM_SPACING = 48;
    var SELECTION_COLUMN = 4;
    cc.Class({
      extends: cc.Component,
      properties: {
        ObjectiveItem: {
          default: null,
          type: cc.Prefab
        },
        StartSelectionItem: {
          default: null,
          type: cc.Prefab
        }
      },
      onLoad: function onLoad() {
        this.app = cc.find("app").getComponent("app");
        this.audioManager = this.app.audioManager;
        this.backer = this.node.getChildByName("backer");
        this.popup = this.node.getChildByName("popup");
        var frame = this.popup.getChildByName("frame");
        this.levelLabel = frame.getChildByName("label").getComponent(cc.Label);
        this.innerFrame = frame.getChildByName("innerFrame");
        var goalBacker = this.innerFrame.getChildByName("goalBacker");
        this.objectivesFrame = goalBacker.getChildByName("ObjectivesFrame");
        this.catView = this.innerFrame.getChildByName("CatView").getComponent("CatView");
        this.changeCatButton = this.innerFrame.getChildByName("changeCatButton");
        this.changeCatBtnState = this.changeCatButton.getComponent("ButtonState");
        this.changeBoosterButton = this.innerFrame.getChildByName("changeBoosterButton");
        this.changeBoosterBtnState = this.changeBoosterButton.getComponent("ButtonState");
        this.startButton = this.popup.getChildByName("startButton");
        this.catDialog = this.node.getChildByName("catDialog").getComponent("CatDialog");
        this.catSelectionPopup = this.node.getChildByName("catSelection");
        this.catSelectionFrame = this.catSelectionPopup.getChildByName("frame");
        this.catDescriptionFrame = this.catSelectionPopup.getChildByName("descriptionFrame");
        this.catNameLabel = this.catDescriptionFrame.getChildByName("catNameLabel").getComponent(cc.Label);
        var catDescriptionContent = this.catDescriptionFrame.getChildByName("contentFrame");
        this.catDescriptionLabel = catDescriptionContent.getChildByName("label").getComponent(cc.Label);
        this.catSelectionConfirmButton = this.catSelectionPopup.getChildByName("confirmButton");
        this.boosterSelectionPopup = this.node.getChildByName("boosterSelection");
        this.boosterSelectionFrame = this.boosterSelectionPopup.getChildByName("frame");
        this.boosterSelectionConfirmButton = this.boosterSelectionPopup.getChildByName("confirmButton");
        this.backer.zIndex = -1;
        this.catSelectionPopup.zIndex = 2;
        this.boosterSelectionPopup.zIndex = 2;
        this.catSelectionPopup.active = false;
        this.boosterSelectionPopup.active = false;
        this.node.active = false;
        this.changeCatButton.on("click", this.onCatChangeClicked, this);
        this.changeBoosterButton.on("click", this.onBoosterChangeClicked, this);
        this.catSelectionConfirmButton.on("click", this.onCatConfirmClicked, this);
        this.boosterSelectionConfirmButton.on("click", this.onBoosterConfirmClicked, this);
        this.startButton.on("click", this.hide, this);
        this.boosterSelectionList = {};
        this.boosterSelectionQueue = [];
      },
      init: function init(options) {
        this.onClosed = options.onClose;
        this.onHomeCb = options.onHome || EMPTY_METHOD;
      },
      show: function show(levelData) {
        var _this = this;
        this.app.catTutorial.triggerStep(5);
        this.node.active = true;
        this.animating = true;
        this.backer.active = true;
        this.backer.opacity = 0;
        cc.tween(this.backer).to(.3, {
          opacity: 200
        }, {
          easing: "quadOut"
        }).start();
        this.popup.active = true;
        this.popup.scale = 0;
        this.popup.opacity = 0;
        cc.tween(this.popup).delay(.2).to(.3, {
          scale: 1,
          opacity: 255
        }, {
          easing: "backOut"
        }).call(function() {
          _this.animating = false;
        }).start();
        this.levelLabel.string = "LEVEL " + levelData.levelNumber;
        var firstPositionX = -(levelData.objectives.length - 1) * (OBJECTIVE_ITEM_SPACING + OBJECTIVE_ITEM_SIZE) * .5;
        var i = 0;
        levelData.objectives.forEach(function(objective) {
          var go = cc.instantiate(_this.ObjectiveItem).getComponent("ObjectiveItem");
          go.node.parent = _this.objectivesFrame;
          go.node.x = firstPositionX + (OBJECTIVE_ITEM_SPACING + OBJECTIVE_ITEM_SIZE) * i;
          go.node.y = 0;
          go.node.scale = OBJECTIVE_ITEM_SIZE / go.node.width;
          go.loadObjective(objective);
          i++;
        });
        this.reloadBoosters();
        this.reloadCat();
        var startX = .5 * -((SELECTION_COLUMN - 1) * SELECTION_ITEM_SIZE + (SELECTION_COLUMN - 1) * SELECTION_ITEM_SPACING);
        var cats = _userState["default"].getCats();
        this.catSelectionList = {};
        var catRowNumber = Math.ceil(Object.keys(_cats["default"]).length / SELECTION_COLUMN);
        this.catSelectionFrame.height = catRowNumber * SELECTION_ITEM_SIZE + (catRowNumber + 1) * SELECTION_ITEM_SPACING;
        this.catDescriptionFrame.y = this.catSelectionFrame.height + this.catSelectionFrame.y + 20;
        var catStartY = this.catSelectionFrame.height - SELECTION_ITEM_SPACING - .5 * SELECTION_ITEM_SIZE;
        i = 0;
        for (var type in _cats["default"]) {
          var item = cc.instantiate(this.StartSelectionItem).getComponent("StartSelectionItem");
          item.node.parent = this.catSelectionFrame;
          item.node.x = startX + i % SELECTION_COLUMN * (SELECTION_ITEM_SPACING + SELECTION_ITEM_SIZE);
          item.node.y = catStartY - Math.floor(i / SELECTION_COLUMN) * (SELECTION_ITEM_SPACING + SELECTION_ITEM_SIZE);
          item.loadItem("cat", _extends({
            id: type
          }, _cats["default"][type], cats[type], {
            selected: _userState["default"].getSelectedCat() === type
          }));
          item.onItemClicked = this.onSelectionItemClicked.bind(this);
          this.catSelectionList[type] = item;
          i++;
        }
        var boosters = _userState["default"].getBoosters();
        this.boosterSelectionList = {};
        this.boosterSelectionQueue = [];
        var boosterRowNumber = Math.ceil(Object.keys(_boosters["default"]).length / SELECTION_COLUMN);
        this.boosterSelectionFrame.height = boosterRowNumber * SELECTION_ITEM_SIZE + (boosterRowNumber + 1) * SELECTION_ITEM_SPACING;
        var boosterStartY = this.boosterSelectionFrame.height - SELECTION_ITEM_SPACING - .5 * SELECTION_ITEM_SIZE;
        i = 0;
        for (var _type in _boosters["default"]) {
          var _item = cc.instantiate(this.StartSelectionItem).getComponent("StartSelectionItem");
          _item.node.parent = this.boosterSelectionFrame;
          _item.node.x = startX + i % SELECTION_COLUMN * (SELECTION_ITEM_SPACING + SELECTION_ITEM_SIZE);
          _item.node.y = boosterStartY - Math.floor(i / SELECTION_COLUMN) * (SELECTION_ITEM_SPACING + SELECTION_ITEM_SIZE);
          _item.loadItem("booster", _extends({
            id: _type
          }, _boosters["default"][_type], boosters[_type]));
          _item.onItemClicked = this.onSelectionItemClicked.bind(this);
          this.boosterSelectionList[_type] = _item;
          boosters[_type].selected && this.boosterSelectionQueue.push(_type);
          i++;
        }
        this.changeBoosterBtnState.setState(this.hasMoreBooster());
        this.changeCatBtnState.setState(this.hasCat());
      },
      hide: function hide() {
        var _this2 = this;
        if (this.animating) return;
        this.audioManager.playSfx("click");
        this.animating = true;
        cc.tween(this.backer).to(.4, {
          opacity: 0
        }, {
          easing: "sineOut"
        }).start();
        cc.tween(this.popup).to(.4, {
          scale: 0,
          opacity: 0
        }, {
          easing: "quadOut"
        }).call(function() {
          _this2.animating = false;
          _this2.node.active = false;
          _this2.onClosed && _this2.onClosed();
        }).start();
      },
      reloadBoosters: function reloadBoosters() {
        var boosters = _userState["default"].getBoosters();
        var availableSlot = Math.min(this.getTotalUnlockedBooster(), MAX_BOOSTER_SELECTION);
        var i = 0;
        for (var type in boosters) {
          if (i === MAX_BOOSTER_SELECTION) break;
          var booster = boosters[type];
          if (booster.selected) {
            i++;
            var boosterItemGO = this.innerFrame.getChildByName("BoosterItem_" + i).getComponent("BoosterItem");
            boosterItemGO.loadBooster({
              type: type,
              number: booster.amount
            });
            availableSlot--;
          }
        }
        while (i < MAX_BOOSTER_SELECTION) {
          i++;
          var _boosterItemGO = this.innerFrame.getChildByName("BoosterItem_" + i).getComponent("BoosterItem");
          if (availableSlot > 0) {
            _boosterItemGO.setEmpty();
            availableSlot--;
          } else _boosterItemGO.setLocked();
        }
        this.changeBoosterBtnState.setState(this.hasMoreBooster());
      },
      hasMoreBooster: function hasMoreBooster() {
        return this.getTotalUnlockedBooster() >= 1;
      },
      hasCat: function hasCat() {
        var cats = _userState["default"].getCats();
        return Object.values(cats).some(function(cat) {
          return cat.unlocked;
        });
      },
      getTotalUnlockedBooster: function getTotalUnlockedBooster() {
        var boosters = _userState["default"].getBoosters();
        var total = 0;
        for (var item in boosters) total += !!boosters[item].unlocked;
        return total;
      },
      reloadCat: function reloadCat() {
        this.catView.loadCat(_userState["default"].getSelectedCat());
      },
      onCatChangeClicked: function onCatChangeClicked() {
        var _this3 = this;
        if (this.animating) return;
        this.audioManager.playSfx("click");
        this.animating = true;
        this.catSelectionPopup.active = true;
        this.catSelectionConfirmButton.active = true;
        this.backer.zIndex = 1;
        if (_userState["default"].getSelectedCat()) {
          var cat = _catModels["default"].getCat(_userState["default"].getSelectedCat());
          this.catDescriptionLabel.string = cat.getCurrentSkillDesc();
          this.catDescriptionFrame.active = true;
          this.catNameLabel.string = cat.config.name;
          this.catDescriptionFrame.opacity = 0;
          cc.tween(this.catDescriptionFrame).to(.3, {
            opacity: 255
          }, {
            easing: "quadOut"
          }).start();
        } else this.catDescriptionFrame.active = false;
        this.catSelectionFrame.opacity = 0;
        this.catSelectionFrame.scale = 0;
        cc.tween(this.catSelectionFrame).to(.3, {
          scale: 1,
          opacity: 255
        }, {
          easing: "backOut"
        }).call(function() {
          _this3.animating = false;
        }).start();
      },
      onBoosterChangeClicked: function onBoosterChangeClicked() {
        var _this4 = this;
        if (this.animating) return;
        this.audioManager.playSfx("click");
        this.animating = true;
        this.boosterSelectionPopup.active = true;
        this.boosterSelectionConfirmButton.active = true;
        this.backer.zIndex = 1;
        this.boosterSelectionFrame.opacity = 0;
        this.boosterSelectionFrame.scale = 0;
        cc.tween(this.boosterSelectionFrame).to(.3, {
          scale: 1,
          opacity: 255
        }, {
          easing: "backOut"
        }).call(function() {
          _this4.animating = false;
        }).start();
      },
      onCatConfirmClicked: function onCatConfirmClicked() {
        var _this5 = this;
        if (this.animating) return;
        this.audioManager.playSfx("click");
        this.animating = true;
        this.backer.zIndex = -1;
        this.catDescriptionFrame.active = false;
        this.catSelectionConfirmButton.active = false;
        this.reloadCat();
        cc.tween(this.catSelectionFrame).to(.4, {
          scale: 0,
          opacity: 0
        }, {
          easing: "cubicOut"
        }).call(function() {
          _this5.catSelectionPopup.active = false;
          _this5.animating = false;
        }).start();
      },
      onBoosterConfirmClicked: function onBoosterConfirmClicked() {
        var _this6 = this;
        if (this.animating) return;
        this.audioManager.playSfx("click");
        this.animating = true;
        this.backer.zIndex = -1;
        this.boosterSelectionConfirmButton.active = false;
        this.reloadBoosters();
        cc.tween(this.boosterSelectionFrame).to(.4, {
          scale: 0,
          opacity: 0
        }, {
          easing: "cubicOut"
        }).call(function() {
          _this6.boosterSelectionPopup.active = false;
          _this6.animating = false;
        }).start();
      },
      onSelectionItemClicked: function onSelectionItemClicked(item) {
        if (this.animating) return;
        this.audioManager.playSfx("click");
        if ("cat" === item.type) {
          item.setSelected(!item.data.selected);
          if (item.data.selected) {
            var _this$catSelectionLis;
            var prevCat = _catModels["default"].getCat(_userState["default"].getSelectedCat());
            null == (_this$catSelectionLis = this.catSelectionList[null == prevCat ? void 0 : prevCat.id]) ? void 0 : _this$catSelectionLis.setSelected(false);
            var newCat = _catModels["default"].getCat(item.data.id);
            this.catDescriptionFrame.active = true;
            this.catDescriptionLabel.string = newCat.getCurrentSkillDesc();
            this.catNameLabel.string = newCat.config.name;
          } else this.catDescriptionFrame.active = false;
          _userState["default"].updateSelectedCat(item.data.selected ? item.data.id : null);
        } else if ("booster" === item.type) {
          var boosters = _userState["default"].getBoosters();
          if (item.data.selected) {
            item.setSelected(false);
            boosters[item.data.id].selected = false;
            this.boosterSelectionQueue.splice(this.boosterSelectionQueue.indexOf(item.data.id), 1);
          } else {
            if (this.boosterSelectionQueue.length >= MAX_BOOSTER_SELECTION) {
              var firstSelectedItem = this.boosterSelectionQueue[0];
              this.boosterSelectionQueue.splice(0, 1);
              this.boosterSelectionList[firstSelectedItem].setSelected(false);
              boosters[firstSelectedItem].selected = false;
            }
            item.setSelected(true);
            boosters[item.data.id].selected = true;
            this.boosterSelectionQueue.push(item.data.id);
          }
          _userState["default"].saveBoostersState();
        }
      },
      onHomeClicked: function onHomeClicked() {
        if (this.animating) return;
        this.hide(true);
        this.audioManager.playSfx("click");
        this.onHomeCb();
      }
    });
    cc._RF.pop();
  }, {
    "../constants": "constants",
    "../models/catModels": "catModels",
    "../staticData/boosters": "boosters",
    "../staticData/cats": "cats",
    "../userState": "userState"
  } ],
  SubsceneController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "aa749nrC1VOrIpHfytA/mmC", "SubsceneController");
    "use strict";
    var ANIMATION_DURATION = .3;
    cc.Class({
      extends: cc.Component,
      properties: {
        HomePrefab: {
          default: null,
          type: cc.Prefab
        },
        ShopPrefab: {
          default: null,
          type: cc.Prefab
        },
        CatPrefab: {
          default: null,
          type: cc.Prefab
        },
        BagPrefab: {
          default: null,
          type: cc.Prefab
        }
      },
      onLoad: function onLoad() {
        this.app = cc.find("app").getComponent("app");
        this.scaleContainer = this.node.getChildByName("scaleContainer");
        this.subsceneContainer = this.scaleContainer.getChildByName("Subscenes");
        this.topUI = this.scaleContainer.getChildByName("TopUI").getComponent("TopUI");
        this.bottomUI = this.scaleContainer.getChildByName("BotUI").getComponent("BottomUI");
        this.settingsPopup = this.scaleContainer.getChildByName("SettingsPopup").getComponent("SettingsPopup");
        this.subsceneMap = {
          home: {
            prefab: this.HomePrefab,
            component: "HomeSubscene",
            object: null,
            showTopUI: true
          },
          shop: {
            prefab: this.ShopPrefab,
            component: "ShopSubscene",
            object: null,
            showTopUI: false
          },
          cat: {
            prefab: this.CatPrefab,
            component: "CatSubscene",
            object: null,
            showTopUI: false
          },
          bag: {
            prefab: this.BagPrefab,
            component: "BagSubscene",
            object: null,
            showTopUI: false
          }
        };
        this.bottomUI.node.on("buttonClicked", this.onButtonUIClicked.bind(this));
        this.animating = false;
      },
      switchScene: function switchScene(sceneId, opts, animate) {
        var _this = this;
        void 0 === opts && (opts = null);
        void 0 === animate && (animate = false);
        if (this.animating) return;
        var targetSubscene = this.subsceneMap[sceneId];
        if (targetSubscene && targetSubscene.prefab && targetSubscene.component) {
          if (this.currentId) {
            var object = this.subsceneMap[this.currentId].object;
            object.node.zIndex = 0;
            if (animate) {
              this.animating = true;
              cc.tween(object.node).to(ANIMATION_DURATION, {
                opacity: 0
              }, {
                easing: "quadOut"
              }).call(function() {
                object.node.active = false;
                _this.animating = false;
              }).start();
            } else object.node.active = false;
            "shop" === this.currentId || "bag" === this.currentId ? this.topUI.show(animate) : "shop" !== sceneId && "bag" !== sceneId || this.topUI.hide(animate);
            if (this.subsceneMap[sceneId].showTopUI !== this.subsceneMap[this.currentId]) {
              this.subsceneMap[sceneId].showTopUI && this.topUI.show(animate);
              this.subsceneMap[sceneId].showTopUI || this.topUI.hide(animate);
            }
          }
          if (!targetSubscene.object) {
            var _object = cc.instantiate(targetSubscene.prefab).getComponent(targetSubscene.component);
            _object.node.setParent(this.subsceneContainer);
            targetSubscene.object = _object;
          }
          targetSubscene.object.node.active = true;
          targetSubscene.object.node.zIndex = -1;
          targetSubscene.object.node.opacity = 255;
          targetSubscene.object.onOpened && targetSubscene.object.onOpened(opts);
          this.currentId = sceneId;
          this.bottomUI.selectButton(sceneId, animate);
          this.updateScreenSize(this.app.FRAME, this.cachedUIScale);
        }
      },
      updateScreenSize: function updateScreenSize(frame, uiScale) {
        this.cachedUIScale = uiScale || 1;
        if (this.currentId && this.subsceneMap[this.currentId].object) {
          var object = this.subsceneMap[this.currentId].object;
          object.node.width = this.scaleContainer.width;
          object.node.height = this.scaleContainer.height;
          object.updateScreenSize(frame, this.cachedUIScale);
        }
      },
      onButtonUIClicked: function onButtonUIClicked(id) {
        if (this.animating) return;
        if ("settings" === id) {
          this.settingsPopup.show(true);
          return;
        }
        this.switchScene(id, null, true);
      }
    });
    cc._RF.pop();
  }, {} ],
  TopUI: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8435f+OPBNDjqSGt1PzG2MK", "TopUI");
    "use strict";
    var _constants = _interopRequireDefault(require("../constants"));
    var _helpers = _interopRequireDefault(require("../helpers"));
    var _userState = _interopRequireDefault(require("../userState"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var ANIMATION_DURATION = .3;
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        this.app = cc.find("app").getComponent("app");
        this.subsceneController = cc.find("Canvas").getComponent("SubsceneController");
        var content = this.node.getChildByName("content");
        this.locker = content.getChildByName("locker");
        this.coinLabel = content.getChildByName("coinLabel").getComponent(cc.Label);
        this.fishLabel = content.getChildByName("fishLabel").getComponent(cc.Label);
        this.heartLabel = content.getChildByName("heartLabel").getComponent(cc.Label);
        this.hearCountDownLabel = content.getChildByName("hearCountDownLabel").getComponent(cc.Label);
        this.addFishBtn = content.getChildByName("fishAddButton").getComponent(cc.Button);
        this.addFishBtn.node.on("click", this.onAddFishBtnClicked, this);
      },
      onEnable: function onEnable() {
        this.updateLabels();
        var isHomeScene = "Home" === cc.director.getScene().name;
        this.addFishBtn.node.active = isHomeScene;
      },
      update: function update(dt) {
        this.updateHeartCountdown();
      },
      updateHeartCountdown: function updateHeartCountdown() {
        if (_userState["default"].getHeart().value >= _constants["default"].USER_INIT_DATA.MAX_HEART) {
          this.heartLabel.string = _constants["default"].USER_INIT_DATA.MAX_HEART;
          this.hearCountDownLabel.string = "--:--";
          return;
        }
        this.heartLabel.string = ~~_userState["default"].getHeart().value;
        var duration = _userState["default"].getHeartRefillDuration();
        this.hearCountDownLabel.string = _helpers["default"].formatTwoLargestUnit(duration);
      },
      onAddFishBtnClicked: function onAddFishBtnClicked() {
        this.subsceneController.switchScene("shop", null, true);
      },
      show: function show(animate) {
        var _this = this;
        void 0 === animate && (animate = false);
        this.node.active = true;
        if (animate) {
          this.animating = true;
          cc.tween(this.node).to(ANIMATION_DURATION, {
            opacity: 255
          }, {
            easing: "quadOut"
          }).call(function() {
            _this.animating = false;
          }).start();
        } else this.node.opacity = 255;
      },
      hide: function hide(animate) {
        var _this2 = this;
        void 0 === animate && (animate = false);
        if (animate) {
          this.animating = true;
          cc.tween(this.node).to(ANIMATION_DURATION, {
            opacity: 0
          }, {
            easing: "quadOut"
          }).call(function() {
            _this2.node.active = false;
            _this2.animating = false;
          }).start();
        } else {
          this.node.active = false;
          this.node.opacity = 0;
        }
      },
      updateLabels: function updateLabels() {
        this.fishLabel.string = _userState["default"].getFish();
        this.coinLabel.string = _userState["default"].getCoin();
        var heart = ~~_userState["default"].getHeart().value;
        this.heartLabel.string = heart;
        heart === _constants["default"].USER_INIT_DATA.MAX_HEART && (this.hearCountDownLabel.string = "--:--");
      },
      updateScreenSize: function updateScreenSize(frame, uiScale) {
        this.node.scale = uiScale;
        var topUIbacker = this.node.getChildByName("backer");
        topUIbacker.width = this.node.width / uiScale;
        var topUIContent = this.node.getChildByName("content");
        topUIContent.scale = .6 + 1 / uiScale * .4;
      }
    });
    cc._RF.pop();
  }, {
    "../constants": "constants",
    "../helpers": "helpers",
    "../userState": "userState"
  } ],
  TutorialController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d55e8YdBvpJAJFvXizqFVvb", "TutorialController");
    "use strict";
    var _constants = _interopRequireDefault(require("../constants.js"));
    var _tutorials = _interopRequireDefault(require("../staticData/tutorials.js"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var TILE_SIZE = _constants["default"].GAMEPLAY.TILE_SIZE;
    var ANIMATION_DURATION = .3;
    var NUMBER_OF_MASKS = 4;
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        this.boardAnchor = this.node.getChildByName("BoardAnchor");
        this.paw = this.boardAnchor.getChildByName("Paw");
        this.labelFrame = this.boardAnchor.getChildByName("LabelFrame");
        this.label = this.labelFrame.getChildByName("label").getComponent(cc.Label);
        this.container = this.boardAnchor.getChildByName("Container");
        this.masks = [];
        for (var i = 0; i < NUMBER_OF_MASKS; i++) this.masks[i] = i ? this.masks[i - 1].getChildByName("Mask") : this.boardAnchor.getChildByName("Mask");
        this.cover = this.masks[NUMBER_OF_MASKS - 1].getChildByName("Cover");
        this.objectiveFrame = this.node.getChildByName("ObjectiveFrame");
        this.objectiveCover = this.objectiveFrame.getChildByName("Cover");
        this.objectiveArrow = this.objectiveFrame.getChildByName("Arrow");
        this.objectiveLabelFrame = this.objectiveFrame.getChildByName("LabelFrame");
        this.boosterFrame = this.node.getChildByName("BoosterFrame");
        this.boosterCover = this.boosterFrame.getChildByName("Cover");
        this.boosterContainer = this.boosterFrame.getChildByName("Container");
        this.boosterArrow = this.boosterFrame.getChildByName("Arrow");
        this.boosterLabelFrame = this.boosterFrame.getChildByName("LabelFrame");
        this.boosterLabel = this.boosterLabelFrame.getChildByName("label").getComponent(cc.Label);
        this.objectiveArrow.zIndex = 1;
        this.objectiveLabelFrame.zIndex = 2;
        this.boosterArrow.zIndex = 1;
        this.boosterLabelFrame.zIndex = 2;
        this.objectiveCover.on("click", this.onObjectiveCoverTapped, this);
        this.cover.on("click", this.onTapCoverTapped, this);
        this.pawOriginScale = 1;
        this.objectiveArrowTween = null;
        this.boosterArrowTween = null;
        this.pawTween = null;
      },
      init: function init(level, opts) {
        this.boardAnchor.active = false;
        this.objectiveFrame.active = false;
        this.boosterFrame.active = false;
        this.gameBoard = opts.gameBoard;
        this.topUI = opts.topUI;
        this.topObjectiveIcon = this.topUI.getChildByName("objectiveIcon");
        this.topObjectiveFrame = this.topUI.getChildByName("objectiveFrame");
        this.topObjectiveIconOriginY = this.topObjectiveIcon.y;
        this.topObjectiveFrameOriginY = this.topObjectiveFrame.y;
        this.bottomUI = opts.bottomUI;
        this.boosterController = opts.boosterController;
        if (_tutorials["default"][level]) {
          this.level = level;
          this.config = _tutorials["default"][level];
          this.hasTutorial = true;
          this.isTutorialShowing = false;
          this.step = 0;
          this.gameBoard.lockUserInteraction("tutorial");
        } else this.hasTutorial = false;
      },
      triggerTutorial: function triggerTutorial() {
        var _this = this;
        if (!this.hasTutorial) return;
        if (this.isTutorialShowing) return;
        this.isTutorialShowing = true;
        this.gameBoard.unlockUserInteraction("tutorial");
        var stepConfig = this.config[this.step];
        this.animating = true;
        setTimeout(function() {
          _this.animating = false;
        }, 600);
        if ("objective" === (null == stepConfig ? void 0 : stepConfig.type)) {
          this.objectiveFrame.active = true;
          this.topObjectiveFrame.parent = this.objectiveFrame;
          this.topObjectiveFrame.y += this.topUI.y - 50;
          this.objectiveArrow.y = this.topObjectiveFrame.y - 50;
          this.objectiveLabelFrame.y = this.objectiveArrow.y - this.objectiveArrow.height - 50;
          this.objectiveFrame.opacity = 0;
          cc.tween(this.objectiveFrame).to(ANIMATION_DURATION, {
            opacity: 255
          }, {
            easing: "quadOut"
          }).call(function() {
            var currentArrowY = _this.objectiveArrow.y;
            _this.objectiveArrowTween = cc.tween(_this.objectiveArrow).repeatForever(cc.tween().to(.4, {
              y: currentArrowY + 80,
              scaleY: .8,
              scaleX: 1.2
            }, {
              easing: "quadOut"
            }).to(.3, {
              y: currentArrowY,
              scaleY: 1,
              scaleX: 1
            }, {
              easing: "linear"
            })).start();
          }).start();
        } else if ("booster" === (null == stepConfig ? void 0 : stepConfig.type)) {
          this.boosterFrame.active = true;
          var boosterNode = this.boosterController.tutorialBoosterItems[null == stepConfig ? void 0 : stepConfig.booster].node;
          boosterNode.parent = this.boosterContainer;
          this.boosterContainer.scale = this.boosterController.node.scale;
          this.boosterContainer.x = this.bottomUI.x;
          this.boosterContainer.y = this.bottomUI.y;
          this.boosterArrow.angle = 180;
          this.boosterArrow.x = boosterNode.x * this.boosterContainer.scale;
          this.boosterArrow.y = this.boosterContainer.y + boosterNode.height * this.boosterContainer.scale + 50;
          this.boosterLabelFrame.active = false;
          if (stepConfig.label) {
            this.boosterLabelFrame.active = true;
            this.boosterLabel.string = stepConfig.label.text || "";
            this.boosterLabelFrame.x = 0;
            this.boosterLabelFrame.y = this.boosterArrow.y + .5 * this.boosterArrow.height + .5 * this.boosterLabelFrame.height + 100;
            this.boosterLabelFrame.width = 780;
          }
          var currentArrowY = this.boosterArrow.y;
          this.boosterArrowTween = cc.tween(this.boosterArrow).repeatForever(cc.tween().to(.4, {
            y: currentArrowY + 80,
            scaleY: .8,
            scaleX: 1.2
          }, {
            easing: "quadOut"
          }).to(.3, {
            y: currentArrowY,
            scaleY: 1,
            scaleX: 1
          }, {
            easing: "linear"
          })).start();
        } else if ("paintbrush" === (null == stepConfig ? void 0 : stepConfig.type)) {
          this.boosterFrame.active = true;
          this.boosterController.contentFrame.parent = this.boosterContainer;
          this.boosterContainer.scale = this.boosterController.node.scale;
          this.boosterContainer.x = this.bottomUI.x;
          this.boosterContainer.y = this.bottomUI.y;
          this.boosterArrow.angle = 0;
          var _boosterNode = this.boosterController.paintbrushFrame.getChildByName(stepConfig.color);
          this.boosterArrow.x = this.boosterController.contentFrame.x * this.boosterContainer.scale + this.boosterContainer.x + _boosterNode.x * this.boosterContainer.scale;
          this.boosterArrow.y = this.boosterController.contentFrame.y * this.boosterContainer.scale + this.boosterContainer.y + _boosterNode.y - .5 * _boosterNode.height - 100;
          this.boosterLabelFrame.active = false;
          if (stepConfig.label) {
            this.boosterLabelFrame.active = true;
            this.boosterLabel.string = stepConfig.label.text || "";
            this.boosterLabelFrame.x = 0;
            this.boosterLabelFrame.y = this.boosterArrow.y - .5 * this.boosterArrow.height - .5 * this.boosterLabelFrame.height - 50;
            this.boosterLabelFrame.width = 780;
          }
          var _currentArrowY = this.boosterArrow.y;
          this.boosterArrowTween = cc.tween(this.boosterArrow).repeatForever(cc.tween().to(.4, {
            y: _currentArrowY + 80,
            scaleY: .8,
            scaleX: 1.2
          }, {
            easing: "quadOut"
          }).to(.3, {
            y: _currentArrowY,
            scaleY: 1,
            scaleX: 1
          }, {
            easing: "linear"
          })).start();
        } else {
          this.boardAnchor.active = true;
          for (var i = 0; i < NUMBER_OF_MASKS; i++) {
            this.masks[i].width = 0;
            this.masks[i].height = 0;
          }
          if (null != stepConfig && stepConfig.masks) for (var _i = 0; _i < NUMBER_OF_MASKS; _i++) {
            if (stepConfig.masks[_i]) {
              this.masks[_i].width = TILE_SIZE * (stepConfig.masks[_i].width || 1);
              this.masks[_i].height = TILE_SIZE * (stepConfig.masks[_i].height || 1);
              this.masks[_i].x = this.gameBoard.boardXToViewX(stepConfig.masks[_i].x || 0) - .5 * TILE_SIZE + .5 * this.masks[_i].width;
              this.masks[_i].y = this.gameBoard.boardYToViewY(stepConfig.masks[_i].y || 0) + .5 * TILE_SIZE - .5 * this.masks[_i].height;
            }
            if (_i) {
              var j = _i - 1;
              while (j >= 0) {
                this.masks[_i].x -= this.masks[j].x;
                this.masks[_i].y -= this.masks[j].y;
                j--;
              }
            }
          }
          this.labelFrame.active = false;
          if (stepConfig.label) {
            this.labelFrame.active = true;
            this.label.string = stepConfig.label.text || "";
            this.labelFrame.x = stepConfig.label.x || 0;
            this.labelFrame.y = stepConfig.label.y || 0;
            this.labelFrame.width = stepConfig.label.width || 780;
          }
          if ("tapBooster" === (null == stepConfig ? void 0 : stepConfig.type)) {
            this.boosterController.contentFrame.parent = this.container;
            this.container.scale = 1 / this.boardAnchor.scale * this.boosterController.node.scale;
            this.container.x = 1 * (this.bottomUI.x - this.boardAnchor.x) / this.boardAnchor.scale;
            this.container.y = 1 * (this.bottomUI.y - this.boardAnchor.y) / this.boardAnchor.scale;
          }
          this.boardAnchor.opacity = "tapBooster" === stepConfig.type ? 255 : 0;
          this.paw.active = false;
          cc.tween(this.boardAnchor).to(ANIMATION_DURATION, {
            opacity: 255
          }, {
            easing: "quadOut"
          }).call(function() {
            if (stepConfig.move) if ("swap" === stepConfig.type) {
              _this.paw.active = true;
              var fromPos = [ _this.gameBoard.boardXToViewX(stepConfig.move.from.x), _this.gameBoard.boardYToViewY(stepConfig.move.from.y) ];
              var toPos = [ _this.gameBoard.boardXToViewX(stepConfig.move.to.x), _this.gameBoard.boardYToViewY(stepConfig.move.to.y) ];
              _this.paw.x = fromPos[0] + 300;
              _this.paw.y = fromPos[1] - 500;
              _this.paw.opacity = 0;
              _this.pawTween = cc.tween(_this.paw).to(.5, {
                x: fromPos[0],
                y: fromPos[1],
                opacity: 255
              }, {
                easing: "sineOut"
              }).delay(.1).repeatForever(cc.tween().to(.3, {
                x: toPos[0],
                y: toPos[1]
              }, {
                easing: "quadOut"
              }).delay(.2).to(.4, {
                x: fromPos[0],
                y: fromPos[1]
              }, {
                easing: "linear"
              }).delay(.2)).start();
            } else if ("tap" === stepConfig.type || "tapBooster" === stepConfig.type) {
              _this.paw.active = true;
              var pos = [ _this.gameBoard.boardXToViewX(stepConfig.move.from.x), _this.gameBoard.boardYToViewY(stepConfig.move.from.y) ];
              _this.paw.x = pos[0] + 300;
              _this.paw.y = pos[1] - 500;
              _this.paw.opacity = 0;
              _this.pawTween = cc.tween(_this.paw).to(.5, {
                x: pos[0],
                y: pos[1],
                opacity: 255
              }, {
                easing: "sineOut"
              }).delay(.1).repeatForever(cc.tween().to(.2, {
                x: pos[0] - 30,
                y: pos[1] + 30,
                scale: 1.1 * _this.pawOriginScale
              }, {
                easing: "quadOut"
              }).delay(.1).to(.3, {
                x: pos[0],
                y: pos[1],
                scale: _this.pawOriginScale
              }, {
                easing: "linear"
              }).delay(.1)).start();
            }
          }).start();
        }
        this.updateScreenSize();
      },
      validateMove: function validateMove(type, item, target) {
        if (!this.hasTutorial) return true;
        if (!this.isTutorialShowing) return true;
        if (this.animating) return false;
        if (!item) return false;
        var stepConfig = this.config[this.step];
        if (stepConfig.type !== type) return false;
        if ("tap" === type) {
          if (item.boardX === stepConfig.move.from.x && item.boardY === stepConfig.move.from.y) return true;
        } else if ("swap" === type) {
          if (!target) return false;
          if (item.boardX === stepConfig.move.from.x && item.boardY === stepConfig.move.from.y && target.boardX === stepConfig.move.to.x && target.boardY === stepConfig.move.to.y) return true;
          if (item.boardX === stepConfig.move.to.x && item.boardY === stepConfig.move.to.y && target.boardX === stepConfig.move.from.x && target.boardY === stepConfig.move.from.y) return true;
        }
        return false;
      },
      validateBooster: function validateBooster(type) {
        if (!this.hasTutorial) return true;
        if (!this.isTutorialShowing) return true;
        if (this.animating) return false;
        if (this.boosterController.isActive) return false;
        var stepConfig = this.config[this.step];
        if ("booster" !== stepConfig.type) return false;
        if (stepConfig.booster !== type) return false;
        return true;
      },
      validatePaintbrush: function validatePaintbrush(type) {
        if (!this.hasTutorial) return true;
        if (!this.isTutorialShowing) return true;
        if (this.animating) return false;
        var stepConfig = this.config[this.step];
        if ("paintbrush" !== stepConfig.type) return false;
        if (stepConfig.color !== type) return false;
        return true;
      },
      stepUp: function stepUp(type) {
        var _this$objectiveArrowT, _this$boosterArrowTwe, _this$pawTween, _this2 = this;
        if (!this.hasTutorial) return true;
        if (!this.isTutorialShowing) return true;
        if (this.animating) return false;
        var stepConfig = this.config[this.step];
        if (stepConfig.type !== type) return false;
        if ("objective" === stepConfig.type) {
          this.topObjectiveIcon.parent = this.topUI;
          this.topObjectiveFrame.parent = this.topUI;
          this.topObjectiveIcon.y = this.topObjectiveIconOriginY;
          this.topObjectiveFrame.y = this.topObjectiveFrameOriginY;
        }
        if ("booster" === stepConfig.type) {
          var boosterNode = this.boosterController.tutorialBoosterItems[null == stepConfig ? void 0 : stepConfig.booster].node;
          boosterNode.parent = this.boosterController.container;
        }
        "tapBooster" === stepConfig.type && (this.boosterController.contentFrame.parent = this.boosterController.overlay);
        "paintbrush" === stepConfig.type && (this.boosterController.contentFrame.parent = this.boosterController.overlay);
        null == (_this$objectiveArrowT = this.objectiveArrowTween) ? void 0 : _this$objectiveArrowT.stop();
        null == (_this$boosterArrowTwe = this.boosterArrowTween) ? void 0 : _this$boosterArrowTwe.stop();
        null == (_this$pawTween = this.pawTween) ? void 0 : _this$pawTween.stop();
        var fadingFrame = this.boardAnchor;
        switch (stepConfig.type) {
         case "objective":
          fadingFrame = this.objectiveFrame;
          break;

         case "booster":
         case "paintbrush":
          fadingFrame = this.boosterFrame;
        }
        this.animating = true;
        cc.tween(fadingFrame).to(ANIMATION_DURATION, {
          opacity: 0
        }, {
          easing: "quadOut"
        }).call(function() {
          fadingFrame.active = false;
          fadingFrame.opacity = 255;
          _this2.animating = false;
        }).start();
        this.step++;
        this.isTutorialShowing = false;
        this.gameBoard.lockUserInteraction("tutorial");
        if (this.step >= this.config.length) {
          this.hasTutorial = false;
          this.gameBoard.unlockUserInteraction("tutorial");
        }
        return true;
      },
      onObjectiveCoverTapped: function onObjectiveCoverTapped() {
        this.stepUp("objective");
      },
      onTapCoverTapped: function onTapCoverTapped() {
        this.stepUp("tapAny");
      },
      updateScreenSize: function updateScreenSize() {
        this.boardAnchor.scale = this.gameBoard.view.scale;
        this.boardAnchor.width = this.gameBoard.view.width;
        this.boardAnchor.height = this.gameBoard.view.height;
        this.boardAnchor.y = this.gameBoard.view.y;
        this.labelFrame.scale = 1 / this.boardAnchor.scale;
        this.paw.scale = 1 / this.boardAnchor.scale;
        this.pawOriginScale = this.paw.scale;
        this.cover.width = this.node.width;
        this.cover.height = this.node.height;
        this.cover.x = 0;
        this.cover.y = -this.boardAnchor.y / this.boardAnchor.scale;
        this.cover.scale = 1 / this.boardAnchor.scale;
        this.boosterCover.width = this.node.width;
        this.boosterCover.height = this.node.height;
        this.boosterCover.x = 0;
        this.boosterCover.y = -this.boardAnchor.y / this.boardAnchor.scale;
        this.boosterCover.scale = 1 / this.boardAnchor.scale;
        this.objectiveCover.width = this.node.width;
        this.objectiveCover.height = this.node.height;
        for (var i = 0; i < NUMBER_OF_MASKS; i++) {
          this.cover.x -= this.masks[i].x;
          this.cover.y -= this.masks[i].y;
        }
      }
    });
    cc._RF.pop();
  }, {
    "../constants.js": "constants",
    "../staticData/tutorials.js": "tutorials"
  } ],
  YardGlow: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0eb78QXX3hOEI8byyLLimCa", "YardGlow");
    "use strict";
    var _yard = _interopRequireDefault(require("../staticData/yard"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var HIGHLIGHT_SPEED = .7;
    cc.Class({
      extends: cc.Component,
      properties: {
        bed: {
          default: null,
          type: cc.SpriteFrame
        },
        cushion: {
          default: null,
          type: cc.SpriteFrame
        },
        featherToy: {
          default: null,
          type: cc.SpriteFrame
        },
        hamburgerCushion: {
          default: null,
          type: cc.SpriteFrame
        },
        paperBag1: {
          default: null,
          type: cc.SpriteFrame
        },
        paperBag2: {
          default: null,
          type: cc.SpriteFrame
        },
        plushDoll: {
          default: null,
          type: cc.SpriteFrame
        },
        pot: {
          default: null,
          type: cc.SpriteFrame
        },
        rubberBallRainbow: {
          default: null,
          type: cc.SpriteFrame
        },
        rubberBallRed: {
          default: null,
          type: cc.SpriteFrame
        },
        stretchingBoard: {
          default: null,
          type: cc.SpriteFrame
        },
        swimRing: {
          default: null,
          type: cc.SpriteFrame
        },
        swing: {
          default: null,
          type: cc.SpriteFrame
        },
        tent: {
          default: null,
          type: cc.SpriteFrame
        },
        tower: {
          default: null,
          type: cc.SpriteFrame
        },
        tunnel: {
          default: null,
          type: cc.SpriteFrame
        }
      },
      setGlowShape: function setGlowShape(id) {
        this.image = this.node.getChildByName("image").getComponent(cc.Sprite);
        this.image.spriteFrame = this[id];
        this.image.node.scale = _yard["default"].items[id].spriteScale;
      }
    });
    cc._RF.pop();
  }, {
    "../staticData/yard": "yard"
  } ],
  YardItemView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "006c6dDDvZMsp4jBcjEmlxD", "YardItemView");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        bed: {
          default: null,
          type: cc.SpriteFrame
        },
        cushion: {
          default: null,
          type: cc.SpriteFrame
        },
        featherToy: {
          default: null,
          type: cc.SpriteFrame
        },
        hamburgerCushion: {
          default: null,
          type: cc.SpriteFrame
        },
        paperBag1: {
          default: null,
          type: cc.SpriteFrame
        },
        paperBag2: {
          default: null,
          type: cc.SpriteFrame
        },
        plushDoll: {
          default: null,
          type: cc.SpriteFrame
        },
        pot: {
          default: null,
          type: cc.SpriteFrame
        },
        rubberBallRainbow: {
          default: null,
          type: cc.SpriteFrame
        },
        rubberBallRed: {
          default: null,
          type: cc.SpriteFrame
        },
        stretchingBoard: {
          default: null,
          type: cc.SpriteFrame
        },
        swimRing: {
          default: null,
          type: cc.SpriteFrame
        },
        swing: {
          default: null,
          type: cc.SpriteFrame
        },
        tent: {
          default: null,
          type: cc.SpriteFrame
        },
        tower: {
          default: null,
          type: cc.SpriteFrame
        },
        tunnel: {
          default: null,
          type: cc.SpriteFrame
        }
      },
      loadItem: function loadItem(itemId) {
        this.node.getComponent(cc.Sprite).spriteFrame = this[itemId];
      }
    });
    cc._RF.pop();
  }, {} ],
  YardItem: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4d5b0vf9HpKDoge/BCGmito", "YardItem");
    "use strict";
    var _CatCommands = _interopRequireDefault(require("../commands/CatCommands"));
    var _catModels = _interopRequireDefault(require("../models/catModels"));
    var _cats = _interopRequireDefault(require("../staticData/cats"));
    var _constants = _interopRequireDefault(require("../constants"));
    var _helpers = _interopRequireDefault(require("../helpers"));
    var _userState = _interopRequireDefault(require("../userState"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    function _extends() {
      _extends = Object.assign || function(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];
          for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
      };
      return _extends.apply(this, arguments);
    }
    var DEBUG = _constants["default"].DEBUG, TIME_SPAN = _constants["default"].TIME_SPAN;
    var UPDATE_INTERVAL = .4;
    var ONE_SECOND = DEBUG.FEEDING_ENVIRONMENT ? 20 : TIME_SPAN.ONE_SECOND;
    cc.Class({
      extends: cc.Component,
      properties: {
        bed: {
          default: null,
          type: cc.SpriteFrame
        },
        cushion: {
          default: null,
          type: cc.SpriteFrame
        },
        featherToy: {
          default: null,
          type: cc.SpriteFrame
        },
        hamburgerCushion: {
          default: null,
          type: cc.SpriteFrame
        },
        paperBag1: {
          default: null,
          type: cc.SpriteFrame
        },
        paperBag2: {
          default: null,
          type: cc.SpriteFrame
        },
        plushDoll: {
          default: null,
          type: cc.SpriteFrame
        },
        pot: {
          default: null,
          type: cc.SpriteFrame
        },
        rubberBallRainbow: {
          default: null,
          type: cc.SpriteFrame
        },
        rubberBallRed: {
          default: null,
          type: cc.SpriteFrame
        },
        stretchingBoard: {
          default: null,
          type: cc.SpriteFrame
        },
        swimRing: {
          default: null,
          type: cc.SpriteFrame
        },
        swing: {
          default: null,
          type: cc.SpriteFrame
        },
        tent: {
          default: null,
          type: cc.SpriteFrame
        },
        tower: {
          default: null,
          type: cc.SpriteFrame
        },
        tunnel: {
          default: null,
          type: cc.SpriteFrame
        },
        anim_bed: {
          default: null,
          type: sp.SkeletonData
        },
        anim_cushion: {
          default: null,
          type: sp.SkeletonData
        },
        anim_featherToy: {
          default: null,
          type: sp.SkeletonData
        },
        anim_hamburgerCushion: {
          default: null,
          type: sp.SkeletonData
        },
        anim_paperBag1: {
          default: null,
          type: sp.SkeletonData
        },
        anim_paperBag2: {
          default: null,
          type: sp.SkeletonData
        },
        anim_plushDoll: {
          default: null,
          type: sp.SkeletonData
        },
        anim_pot: {
          default: null,
          type: sp.SkeletonData
        },
        anim_rubberBallRainbow: {
          default: null,
          type: sp.SkeletonData
        },
        anim_rubberBallRed: {
          default: null,
          type: sp.SkeletonData
        },
        anim_stretchingBoard: {
          default: null,
          type: sp.SkeletonData
        },
        anim_swimRing: {
          default: null,
          type: sp.SkeletonData
        },
        anim_swing: {
          default: null,
          type: sp.SkeletonData
        },
        anim_tent: {
          default: null,
          type: sp.SkeletonData
        },
        anim_tower_max: {
          default: null,
          type: sp.SkeletonData
        },
        anim_tower_lily: {
          default: null,
          type: sp.SkeletonData
        },
        anim_tower_luna: {
          default: null,
          type: sp.SkeletonData
        },
        anim_tunnel_bob: {
          default: null,
          type: sp.SkeletonData
        },
        anim_tunnel_max: {
          default: null,
          type: sp.SkeletonData
        },
        anim_tunnel_luna: {
          default: null,
          type: sp.SkeletonData
        },
        anim_tunnel_lvl_1: {
          default: null,
          type: sp.SkeletonData
        },
        heart_effect: {
          default: null,
          type: cc.SpriteFrame
        },
        paw: {
          default: null,
          type: cc.Node
        }
      },
      onLoad: function onLoad() {
        this.app = cc.find("app").getComponent("app");
        this.home = cc.find("Canvas").getComponent("Home");
        this.image = this.node.getChildByName("image").getComponent(cc.Sprite);
        this.anim = this.node.getChildByName("anim").getComponent(sp.Skeleton);
        this.catFrame = this.node.getChildByName("catFrame");
        this.bubble = this.node.getChildByName("bubble");
        this.bubbleLabel = this.bubble.getChildByName("label").getComponent(cc.Label);
        this.heartContainer = this.node.getChildByName("heartContainer");
        this.timelabel = this.node.getChildByName("timeLabel").getComponent(cc.Label);
        this.deletebutton = this.node.getChildByName("closeButton").getComponent(cc.Button);
        this.image.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.deletebutton.node.on("click", this.onDeleteClicked, this);
        this.catFrame.on(cc.Node.EventType.TOUCH_END, this.onCatTouchEnd, this);
        this.x = -1;
        this.y = -1;
        this.willShowTimer = DEBUG.FEEDING_ENVIRONMENT;
      },
      update: function update(dt) {
        this.elapsedTime -= dt;
        if (this.elapsedTime < 0) {
          this.updateDataState();
          this.elapsedTime = UPDATE_INTERVAL;
        }
        this.heartElapsedTime -= dt;
        if (this.heartElapsedTime < 0 && this.state.playingCat) {
          if (this.state.playingCat && !this.editMode) {
            var cat = _catModels["default"].getCat(this.state.playingCat);
            cat.isFull() && this.playSingleHeartEffect(2);
          }
          this.heartElapsedTime = .6 * Math.random();
        }
      },
      refreshFeedingInfo: function refreshFeedingInfo() {
        if (this.editMode) {
          this.bubble.active = false;
          return;
        }
        if (!this.state.playingCat) {
          this.bubble.active = false;
          return;
        }
        var cat = _catModels["default"].getCat(this.state.playingCat);
        var fedAmount = cat.data.dailyFed || 0;
        if (cat.isMaxed()) this.bubble.active = false; else if (cat.isFull()) this.bubble.active = false; else {
          this.bubble.active = true;
          this.bubbleLabel.string = fedAmount + "/" + cat.config.feedablePerDay;
        }
      },
      updateDataState: function updateDataState() {
        this.state.playingCat = this.state.playingCat || null;
        this.state.nextUpdate = this.state.nextUpdate || Date.now() + this.config.interval * ONE_SECOND;
        this.image.node.active = !(this.state.playingCat && !this.editMode) || !!this.config.keepImageWhileAnim;
        this.anim.node.active = this.state.playingCat && !this.editMode;
        this.catFrame.active = this.state.playingCat && !this.editMode;
        if (this.state.nextUpdate - Date.now() < 0) if (this.state.playingCat) this.state.nextUpdate - Date.now() < -this.config.interval * ONE_SECOND ? this.state.nextUpdate = Date.now() + _cats["default"][this.state.playingCat].playTime * ONE_SECOND : this.setYardIdle(); else {
          if (this.app.catTutorial.getCurrentStep() <= 1) return;
          var attractedCats = _extends({}, this.config.attract);
          for (var key in _userState["default"].getYard()) attractedCats[_userState["default"].getYard()[key].playingCat] && delete attractedCats[_userState["default"].getYard()[key].playingCat];
          if (0 === Object.keys(attractedCats).length) {
            console.warn("no Free cat");
            this.setYardIdle();
          } else {
            var playingCat = null;
            var randomWeight = 0;
            for (var _key in attractedCats) randomWeight += attractedCats[_key];
            var random = Math.random() * randomWeight;
            for (var _key2 in attractedCats) {
              if (random < attractedCats[_key2]) {
                playingCat = _key2;
                break;
              }
              random -= attractedCats[_key2];
            }
            playingCat ? this.setCat(playingCat) : this.setYardIdle();
            this.refreshFeedingInfo();
          }
        }
        this.timelabel.string = _helpers["default"].formatTimeString(Math.max(this.state.nextUpdate - Date.now(), 0));
      },
      loadAnim: function loadAnim(playingCat) {
        if (!this.config.anim || !this.config.anim[playingCat]) return;
        var animationData = this.config.anim[playingCat];
        if (this[animationData.skeleton]) {
          this.anim.skeletonData = this[animationData.skeleton];
          animationData.skin && this.anim.setSkin(animationData.skin);
          animationData.animation && this.anim.setAnimation(0, animationData.animation, true);
          if (animationData.animOffset) {
            this.anim.node.x = animationData.animOffset.x;
            this.anim.node.y = animationData.animOffset.y;
          }
          if (animationData.catOffset) {
            this.catFrame.x = animationData.catOffset.x;
            this.catFrame.y = animationData.catOffset.y;
            this.bubble.x = animationData.catOffset.x + 75;
            this.bubble.y = animationData.catOffset.y + 140;
            this.heartContainer.x = animationData.catOffset.x;
            this.heartContainer.y = animationData.catOffset.y;
          }
        }
      },
      setYardIdle: function setYardIdle() {
        this.state.playingCat = null;
        this.state.nextUpdate = Date.now() + this.config.interval * ONE_SECOND;
        this.image.node.active = true;
        this.anim.node.active = false;
        this.catFrame.active = false;
        this.bubble.active = false;
      },
      setCat: function setCat(playingCat) {
        this.state.playingCat = playingCat;
        this.state.nextUpdate = Date.now() + _cats["default"][playingCat].playTime * ONE_SECOND;
        this.image.node.active = !!this.editMode || !!this.config.keepImageWhileAnim;
        this.anim.node.active = !this.editMode;
        this.catFrame.active = !this.editMode;
        this.refreshFeedingInfo();
        this.loadAnim(playingCat);
        _userState["default"].getCats()[playingCat].dailyFed = 0;
        _userState["default"].saveCats();
      },
      playSingleHeartEffect: function playSingleHeartEffect(duration) {
        void 0 === duration && (duration = 1);
        var heartNode = new cc.Node();
        heartNode.addComponent(cc.Sprite).spriteFrame = this.heart_effect;
        heartNode.x = 128 * Math.random() - 64;
        heartNode.y = 90 * Math.random() - 30;
        heartNode.scale = .3 * Math.random() + .7;
        this.heartContainer.addChild(heartNode);
        cc.tween(heartNode).to(Math.random() * duration * .3 + .7 * duration, {
          opacity: 30,
          y: heartNode.y + 30 * Math.random() + 60,
          x: heartNode.x - 5 + 5 * Math.random()
        }, {
          easing: "sineOut"
        }).call(function() {
          heartNode.destroy();
        }).start();
      },
      setConfig: function setConfig(config) {
        this.id = config.id;
        this.config = config;
        this.config.size = this.config.size || {
          x: 1,
          y: 1
        };
        this.config.spriteScale = this.config.spriteScale || 1;
        this.config.offset = this.config.offset || {
          x: 0,
          y: 0
        };
        this.config.buttonOffset = this.config.buttonOffset || {
          x: 0,
          y: 0
        };
        this.config.catOffset = this.config.catOffset || {
          x: 0,
          y: 0
        };
        this.config.animOffset = this.config.animOffset || {
          x: 0,
          y: 0
        };
        this.config.labelOffset = this.config.labelOffset || {
          x: 0,
          y: 0
        };
        this.state = _userState["default"].getYard()[this.id];
        this.app = cc.find("app").getComponent("app");
        this.home = cc.find("Canvas").getComponent("Home");
        this.image = this.node.getChildByName("image").getComponent(cc.Sprite);
        this.deletebutton = this.node.getChildByName("closeButton").getComponent(cc.Button);
        this.anim = this.node.getChildByName("anim").getComponent(sp.Skeleton);
        this.catFrame = this.node.getChildByName("catFrame");
        this.bubble = this.node.getChildByName("bubble");
        this.bubbleLabel = this.bubble.getChildByName("label").getComponent(cc.Label);
        this.heartContainer = this.node.getChildByName("heartContainer");
        this.timelabel = this.node.getChildByName("timeLabel").getComponent(cc.Label);
        this.image.spriteFrame = this[config.id];
        this.image.node.scale = this.config.spriteScale;
        this.deletebutton.node.x = .5 * this.image.node.width * this.config.spriteScale + this.config.buttonOffset.x;
        this.deletebutton.node.y = .5 * this.image.node.height * this.config.spriteScale + this.config.buttonOffset.y;
        this.anim.node.x = this.config.animOffset.x;
        this.anim.node.y = this.config.animOffset.y;
        this.catFrame.x = this.config.catOffset.x;
        this.catFrame.y = this.config.catOffset.y;
        this.timelabel.node.x = this.config.labelOffset.x;
        this.timelabel.node.y = this.config.labelOffset.y;
        this.bubble.x = this.config.catOffset.x + 75;
        this.bubble.y = this.config.catOffset.y + 140;
        this.heartContainer.x = this.config.catOffset.x;
        this.heartContainer.y = this.config.catOffset.y;
        this.loadAnim(this.state.playingCat);
        this.timelabel.node.active = this.willShowTimer;
        this.deletebutton.node.active = false;
        this.elapsedTime = 0;
        this.heartElapsedTime = 0;
        this.editMode = false;
        this.refreshFeedingInfo();
      },
      exitEditMode: function exitEditMode() {
        this.editMode = false;
        this.deletebutton.node.active = false;
        this.image.node.active = !this.state.playingCat || !!this.config.keepImageWhileAnim;
        this.anim.node.active = this.state.playingCat;
        this.catFrame.active = this.state.playingCat;
        this.timelabel.node.active = this.willShowTimer;
        this.refreshFeedingInfo();
      },
      enterEditMode: function enterEditMode() {
        this.editMode = true;
        this.deletebutton.node.active = true;
        this.image.node.active = true;
        this.anim.node.active = false;
        this.catFrame.active = false;
        this.bubble.active = false;
        this.timelabel.node.active = false;
      },
      onTouchStart: function onTouchStart(e) {
        var location = e.getLocation();
        var offset = this.image.node.convertToNodeSpaceAR(location);
        offset.x += .5 * this.image.node.width;
        offset.y += .5 * this.image.node.height;
        this.onItemTouched && this.onItemTouched(e, this, offset);
        e.stopPropagation();
      },
      onDeleteClicked: function onDeleteClicked(e) {
        this.onItemDeleted && this.onItemDeleted(this);
      },
      onCatTouchEnd: function onCatTouchEnd(e) {
        if (!this.editMode && this.state.playingCat) {
          var result = _CatCommands["default"].feed(this.state.playingCat, DEBUG.FEEDING_ENVIRONMENT ? 10 : _userState["default"].getStates().feedFishAmount);
          this.app.catTutorial.onFeedCat();
          if (result.dailyFeedChanged) {
            this.playSingleHeartEffect();
            this.refreshFeedingInfo();
            this.home.topUI.updateLabels();
            this.app.audioManager.playSfx("feeding");
          }
          if (result.intimacyChanged) {
            this.home.giftPopup.show(result.cat);
            this.app.catRefreshRequest = true;
            return;
          }
          var cat = _catModels["default"].getCat(this.state.playingCat);
          if (cat.isMaxed()) this.home.catFullAlert.show(cat.config.name + " reached max friendship level! Try other cat!"); else if (cat.isFull()) {
            var msg = result.dailyFeedChanged ? cat.config.name + " is now full!" : cat.config.name + " is full!\nTry again on " + cat.config.name + "'s next visit";
            this.home.catFullAlert.show(msg);
          }
        }
      }
    });
    cc._RF.pop();
  }, {
    "../commands/CatCommands": "CatCommands",
    "../constants": "constants",
    "../helpers": "helpers",
    "../models/catModels": "catModels",
    "../staticData/cats": "cats",
    "../userState": "userState"
  } ],
  YardView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "51fc0tBq/FAQZ6SB7dAaYfD", "YardView");
    "use strict";
    var _helpers = _interopRequireDefault(require("../helpers"));
    var _yard = _interopRequireDefault(require("../staticData/yard"));
    var _userState = _interopRequireDefault(require("../userState"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    function _extends() {
      _extends = Object.assign || function(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];
          for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
      };
      return _extends.apply(this, arguments);
    }
    var PRESS_DURATION = .5;
    var PRESS_MOVE_SQR_TOLERANCE = 10;
    var SCROLL_SPEED = 8;
    var SCROLL_DISTANCE_MODIFIER = 2.2;
    var SCROLL_THRESHOLD_WITH_ITEM = 160;
    var SCROLL_SPPED_WITH_ITEM = .3;
    var INITIAL_X = -690;
    var ANIMATION_DURATION = .4;
    var GLOWING_SPEED = .7;
    var WIREFRAME_CELL_SIZE = 200;
    var WIREFRAME_Y_OFFSET = 800;
    var UPDATE_INTERVAL = 3;
    cc.Class({
      extends: cc.Component,
      properties: {
        WireframeCell: {
          default: null,
          type: cc.SpriteFrame
        },
        YardItem: {
          default: null,
          type: cc.Prefab
        },
        material_glow: {
          default: null,
          type: cc.Material
        }
      },
      onLoad: function onLoad() {
        this.app = cc.find("app").getComponent("app");
        this.home = this.node.parent.getComponent("HomeSubscene");
        this.scrollView = this.node.getChildByName("scrollView");
        this.dim = this.scrollView.getChildByName("dim");
        this.pawTutorial = this.scrollView.getChildByName("pawTutorial");
        this.scrollView.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.scrollView.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.scrollView.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.scrollView.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        this._destX = this.node.x;
        this._prevTouchX = 0;
        this._screenX = 0;
        this._viewPos = {};
        this.glowTimer = 0;
        this.pressingTime = 0;
        this.isPressing = false;
        this.editMode = false;
        this.selectingItem = null;
        this.isDragging = false;
        this.draggingOffset = null;
        this.yardItemGlow = this.scrollView.getChildByName("YardGlow").getComponent("YardGlow");
        this.wireframe = this.scrollView.getChildByName("wireframe");
        this.wireframe.x = .5 * -this.scrollView.width;
        this.wireframe.y = .5 * this.scrollView.height - WIREFRAME_Y_OFFSET;
        this.loadWireframe();
        this.wireframe.active = false;
        this.scrollView.x = INITIAL_X;
        this._destX = INITIAL_X;
        this.yardItemGlow.node.zIndex = _yard["default"].patternSize.x * _yard["default"].patternSize.y;
        this.yardItemGlow.node.active = false;
        this.hasLockDraging = false;
      },
      onEnable: function onEnable() {
        if (this.app.yardViewRefreshRequest) {
          this.loadItems();
          this.app.yardViewRefreshRequest = false;
        }
        this.elapsedTime = UPDATE_INTERVAL;
      },
      update: function update(dt) {
        this.updateScrollView(dt);
        this.isPressing && (this.pressingTime += dt);
        if (this.isPressing && this.pressingTime > PRESS_DURATION && !this.editMode) {
          this.isPressing = false;
          if (this.app.catTutorial.needLockYard()) {
            if (this.selectingItem && this.selectingItem.id === this.app.catTutorial.config.pressedTarget && 1 === this.app.catTutorial.actionIndex) {
              this.home.enterEditMode(true);
              this.app.catTutorial.moveNextAction();
            }
          } else this.home.enterEditMode(true);
        }
        if (this.editMode && this.isDragging && this.selectingItem) {
          var touchCoord = this.convertToWireframeCoord(this._viewPos, this.draggingOffset);
          if (this.isCoordValidToMove(touchCoord, this.selectingItem.config, this.selectingItem)) if (0 === this.app.catTutorial.getCurrentStep()) {
            if (4 === touchCoord.x && 1 === touchCoord.y && 2 === this.app.catTutorial.actionIndex) {
              this.placeItem(this.selectingItem, touchCoord, false);
              this.app.catTutorial.moveNextAction();
              this.isDragging = false;
            }
          } else this.placeItem(this.selectingItem, touchCoord);
        }
        if (this.editMode && this.yardItemGlow.node.active && this.selectingItem) {
          this.yardItemGlow.node.x = this.selectingItem.node.x;
          this.yardItemGlow.node.y = this.selectingItem.node.y;
        }
        if (this.yardItemGlow.node.active) {
          this.glowTimer += dt * GLOWING_SPEED;
          this.material_glow.setProperty("hl_timer", this.glowTimer);
        }
        this.elapsedTime -= dt;
        if (this.elapsedTime < 0) {
          this.updateDataState();
          this.elapsedTime = UPDATE_INTERVAL;
        }
      },
      updateDataState: function updateDataState() {
        _userState["default"].saveYard();
      },
      updateScrollView: function updateScrollView(dt) {
        if (this.hasLockDraging) return;
        if (this.isDragging) {
          var screenWidth = this.app.FRAME.width;
          var screenX = this._screenX - .5 * (1024 - screenWidth);
          var scrollThreshold = SCROLL_THRESHOLD_WITH_ITEM / 1024 * screenWidth;
          screenX < scrollThreshold ? this._destX += (scrollThreshold - screenX) * SCROLL_SPPED_WITH_ITEM : screenX > screenWidth - scrollThreshold && (this._destX -= (scrollThreshold - (screenWidth - screenX)) * SCROLL_SPPED_WITH_ITEM);
        }
        this.scrollView.x = _helpers["default"].lerp(this.scrollView.x, this._destX, dt * SCROLL_SPEED);
        var widthLimit = .5 * (this.scrollView.width - this.node.width / this.node.scale);
        var clampX = Math.max(Math.min(this.scrollView.x, widthLimit), -widthLimit);
        this._destX = clampX !== this.scrollView.x ? this.scrollView.x : this._destX;
        this.scrollView.x = clampX;
      },
      loadWireframe: function loadWireframe() {
        this.wireFrameCells = [];
        var pattern = _yard["default"].pattern;
        for (var y = 0; y < pattern.length; y++) {
          this.wireFrameCells[y] = [];
          for (var x = 0; x < pattern[y].length; x++) {
            var newCell = new cc.Node();
            newCell.addComponent(cc.Sprite);
            newCell.getComponent(cc.Sprite).spriteFrame = this.WireframeCell;
            newCell.x = x * WIREFRAME_CELL_SIZE + .5 * WIREFRAME_CELL_SIZE;
            newCell.y = -y * WIREFRAME_CELL_SIZE - .5 * WIREFRAME_CELL_SIZE;
            newCell.width = WIREFRAME_CELL_SIZE;
            newCell.height = WIREFRAME_CELL_SIZE;
            newCell.color = _yard["default"].colors[pattern[y][x]].color;
            newCell.opacity = _yard["default"].colors[pattern[y][x]].opacity;
            this.wireframe.addChild(newCell);
            this.wireFrameCells[y][x] = {
              tile: newCell,
              type: pattern[y][x],
              occupiedBy: null
            };
          }
        }
      },
      refreshWireFrame: function refreshWireFrame(item) {
        var patternSize = _yard["default"].patternSize;
        for (var x = 0; x < patternSize.x; x++) for (var y = 0; y < patternSize.y; y++) {
          var cell = this.wireFrameCells[y][x];
          if (!item) {
            cell.tile.active = false;
            continue;
          }
          var hasOccupiedBySelf = cell.occupiedBy && cell.occupiedBy.id === item.id;
          if (hasOccupiedBySelf) {
            cell.tile.active = true;
            continue;
          }
          var hasOccupiedByOthers = cell.occupiedBy && cell.occupiedBy.config.id !== item.id;
          if (hasOccupiedByOthers) {
            cell.tile.active = false;
            continue;
          }
          var itemSize = item.config.size;
          var itemWidth = itemSize.x;
          if (itemWidth > 1) {
            var coord = {
              x: x,
              y: y
            };
            var needEmptyCellAmount = itemWidth - 1;
            var totalRightEmptyCell = this.getTotalNeighborEmptyCell(coord, item.config, 1);
            if (totalRightEmptyCell < needEmptyCellAmount) {
              var needLeftEmptyCellAmount = needEmptyCellAmount - totalRightEmptyCell;
              var totalLeftEmptyCell = this.getTotalNeighborEmptyCell(coord, item.config, -1);
              if (totalLeftEmptyCell < needLeftEmptyCellAmount) {
                cell.tile.active = false;
                continue;
              }
            }
          }
          var hasSameType = item.config.type === cell.type;
          cell.tile.active = hasSameType;
        }
      },
      loadItems: function loadItems() {
        this.data = _userState["default"].getYard();
        var pattern = _yard["default"].pattern;
        for (var y = 0; y < pattern.length; y++) for (var x = 0; x < pattern[y].length; x++) this.wireFrameCells[y][x].occupiedBy = null;
        if (this.yardItems) for (var key in this.yardItems) {
          var yardItem = this.yardItems[key];
          yardItem.node.destroy();
        }
        this.yardItems = {};
        for (var _key in this.data) {
          var item = this.data[_key];
          var itemConfig = _yard["default"].items[_key];
          if (!itemConfig || !this.isCoordValid(item, itemConfig)) continue;
          var newYardItem = cc.instantiate(this.YardItem).getComponent("YardItem");
          newYardItem.setConfig(_extends({
            id: _key
          }, itemConfig));
          newYardItem.onItemTouched = this.onItemTouched.bind(this);
          newYardItem.onItemDeleted = this.onItemDeleted.bind(this);
          this.scrollView.addChild(newYardItem.node);
          this.yardItems[_key] = newYardItem;
          this.placeItem(newYardItem, item);
        }
        var willSave = false;
        for (var _key2 in this.data) {
          var _item = this.data[_key2];
          if (-1 === _item.x && -1 === _item.y) {
            willSave = true;
            var coord = this.findValidRandomCoord(_key2);
            if (!coord) {
              delete this.data[_key2];
              this.app.suppliesRefreshRequest = true;
              continue;
            }
            this.data[_key2].x = coord.x;
            this.data[_key2].y = coord.y;
            var _itemConfig = _yard["default"].items[_key2];
            var _newYardItem = cc.instantiate(this.YardItem).getComponent("YardItem");
            _newYardItem.setConfig(_extends({
              id: _key2
            }, _itemConfig));
            _newYardItem.onItemTouched = this.onItemTouched.bind(this);
            _newYardItem.onItemDeleted = this.onItemDeleted.bind(this);
            this.scrollView.addChild(_newYardItem.node);
            this.yardItems[_key2] = _newYardItem;
            this.placeItem(_newYardItem, coord);
          }
        }
        willSave && _userState["default"].saveYard();
      },
      saveYardState: function saveYardState() {
        if (this.data[this._yardItemTemp.id]) {
          this.data[this._yardItemTemp.id].x = this._yardItemTemp.x;
          this.data[this._yardItemTemp.id].y = this._yardItemTemp.y;
        }
        _userState["default"].saveYard();
        this.app.suppliesRefreshRequest = true;
      },
      enterEditMode: function enterEditMode(animate) {
        void 0 === animate && (animate = false);
        this.editMode = true;
        this.wireframe.active = true;
        this.refreshWireFrame(null);
        if (animate) {
          this.wireframe.opacity = 0;
          cc.tween(this.wireframe).to(ANIMATION_DURATION, {
            opacity: 255
          }, {
            easing: "quadOut"
          }).start();
        } else this.wireframe.opacity = 255;
        for (var key in this.yardItems) {
          var yardItem = this.yardItems[key];
          yardItem.enterEditMode();
        }
        if (this.selectingItem) {
          this.yardItemGlow.node.active = true;
          this.glowTimer = 0;
          this.refreshWireFrame(this.selectingItem);
        }
      },
      exitEditMode: function exitEditMode(animate) {
        var _this = this;
        void 0 === animate && (animate = false);
        this.editMode = false;
        this.selectingItem = null;
        this.yardItemGlow.node.active = false;
        animate ? cc.tween(this.wireframe).to(ANIMATION_DURATION, {
          opacity: 0
        }, {
          easing: "quadOut"
        }).call(function() {
          _this.wireframe.active = false;
        }).start() : this.wireframe.active = false;
        for (var key in this.yardItems) {
          var yardItem = this.yardItems[key];
          yardItem.exitEditMode();
        }
      },
      isCoordValid: function isCoordValid(coord, config, target) {
        void 0 === target && (target = null);
        if (coord.x < 0 || coord.y < 0) return false;
        var cell = this.wireFrameCells[coord.y][coord.x];
        if ("none" === cell.type) return false;
        if (cell.type !== config.type) return false;
        if (cell.occupiedBy && cell.occupiedBy.config.id !== config.id) return false;
        var itemWidth = config.size.x;
        if (itemWidth > 1) {
          var needEmptyCellAmount = itemWidth - 1;
          var totalRightEmptyCell = this.getTotalNeighborEmptyCell(coord, config, 1);
          if (totalRightEmptyCell < needEmptyCellAmount) return false;
        }
        return true;
      },
      isCoordValidToMove: function isCoordValidToMove(coord, config) {
        if (coord.x < 0 || coord.y < 0) return false;
        var cell = this.wireFrameCells[coord.y][coord.x];
        if ("none" === cell.type) return false;
        if (cell.type !== config.type) return false;
        if (cell.occupiedBy && cell.occupiedBy.config.id !== config.id) return false;
        var itemWidth = config.size.x;
        if (itemWidth > 1) {
          var needEmptyCellAmount = itemWidth - 1;
          var totalRightEmptyCell = this.getTotalNeighborEmptyCell(coord, config, 1);
          if (totalRightEmptyCell < needEmptyCellAmount) {
            var needLeftEmptyCellAmount = needEmptyCellAmount - totalRightEmptyCell;
            var totalLeftEmptyCell = this.getTotalNeighborEmptyCell(coord, config, -1);
            if (totalLeftEmptyCell < needLeftEmptyCellAmount) return false;
          }
        }
        return true;
      },
      checkEmptyCell: function checkEmptyCell(cell, itemConfig) {
        if (cell.type !== itemConfig.type) return false;
        if (cell.occupiedBy && cell.occupiedBy.config.id !== itemConfig.id) return false;
        return true;
      },
      hasNeighborEmptyCell: function hasNeighborEmptyCell(coord, itemConfig, dir) {
        var newX = coord.x + dir;
        if (newX < 0 || newX >= _yard["default"].patternSize.x) return false;
        var cell = this.wireFrameCells[coord.y][newX];
        return this.checkEmptyCell(cell, itemConfig);
      },
      getTotalNeighborEmptyCell: function getTotalNeighborEmptyCell(coord, itemConfig, dir) {
        var jumpIndex = 1;
        while (this.hasNeighborEmptyCell({
          x: coord.x,
          y: coord.y
        }, itemConfig, dir * jumpIndex)) jumpIndex++;
        return jumpIndex - 1;
      },
      findValidRandomCoord: function findValidRandomCoord(key) {
        var itemConfig = _yard["default"].items[key];
        var validCoords = [];
        for (var y = 0; y < _yard["default"].patternSize.y; y++) for (var x = 0; x < _yard["default"].patternSize.x; x++) {
          var coord = {
            x: x,
            y: y
          };
          this.isCoordValid(coord, itemConfig) && validCoords.push(coord);
        }
        return 0 === validCoords.length ? null : validCoords[Math.floor(Math.random() * validCoords.length)];
      },
      freeUpSpace: function freeUpSpace(yardItem) {
        if (yardItem.x >= 0 != null && yardItem.y >= 0) for (var y = 0; y < yardItem.config.size.y && yardItem.y - y >= 0; y++) for (var x = 0; x < yardItem.config.size.x && yardItem.x + x < _yard["default"].patternSize.x; x++) this.wireFrameCells[yardItem.y - y][yardItem.x + x].occupiedBy = null;
      },
      placeItem: function placeItem(yardItem, coord, needSave) {
        void 0 === needSave && (needSave = true);
        var itemWidth = yardItem.config.size.x;
        if (itemWidth > 1) {
          var needEmptyCellAmount = itemWidth - 1;
          var totalRightEmptyCell = this.getTotalNeighborEmptyCell(coord, yardItem.config, 1);
          var totalLeftEmptyCell = this.getTotalNeighborEmptyCell(coord, yardItem.config, -1);
          if (0 == totalRightEmptyCell && totalLeftEmptyCell >= needEmptyCellAmount) coord.x -= needEmptyCellAmount; else if (totalRightEmptyCell < needEmptyCellAmount) {
            var needLeftEmptyCellAmount = needEmptyCellAmount - totalRightEmptyCell;
            totalLeftEmptyCell >= needLeftEmptyCellAmount && (coord.x -= needLeftEmptyCellAmount);
          }
        }
        this.freeUpSpace(yardItem);
        coord.y -= yardItem.config.size.y - 1;
        var itemPosition = this.coordToPosition(coord);
        yardItem.node.x = itemPosition.x + yardItem.config.size.x * WIREFRAME_CELL_SIZE * .5 + yardItem.config.offset.x;
        yardItem.node.y = itemPosition.y - yardItem.config.size.y * WIREFRAME_CELL_SIZE * .5 + yardItem.config.offset.y;
        yardItem.node.zIndex = coord.y * _yard["default"].patternSize.x + (_yard["default"].patternSize.x - coord.x);
        yardItem.x = coord.x;
        yardItem.y = coord.y;
        for (var y = 0; y < yardItem.config.size.y && yardItem.y - y >= 0; y++) for (var x = 0; x < yardItem.config.size.x && yardItem.x + x < _yard["default"].patternSize.x; x++) this.wireFrameCells[yardItem.y - y][yardItem.x + x].occupiedBy = yardItem;
        this._yardItemTemp = {
          id: yardItem.config.id,
          x: coord.x,
          y: coord.y
        };
        if (!needSave) return;
        this.data[yardItem.config.id].x = coord.x;
        this.data[yardItem.config.id].y = coord.y;
      },
      convertToWireframeCoord: function convertToWireframeCoord(viewPos, offset) {
        offset = offset || new cc.Vec2();
        var coord = {
          x: Math.floor((viewPos.x - this.scrollView.x + .5 * this.scrollView.width) / WIREFRAME_CELL_SIZE),
          y: Math.floor(-(viewPos.y - this.wireframe.y) / WIREFRAME_CELL_SIZE)
        };
        var offsetCoord = {
          x: Math.floor(offset.x / WIREFRAME_CELL_SIZE),
          y: Math.floor(offset.y / WIREFRAME_CELL_SIZE)
        };
        return {
          x: Math.max(0, Math.min(coord.x - offsetCoord.x, _yard["default"].patternSize.x - 1)),
          y: Math.max(0, Math.min(coord.y + offsetCoord.y, _yard["default"].patternSize.y - 1))
        };
      },
      coordToPosition: function coordToPosition(coord) {
        return {
          x: this.wireframe.x + WIREFRAME_CELL_SIZE * coord.x,
          y: this.wireframe.y - WIREFRAME_CELL_SIZE * coord.y
        };
      },
      selectItem: function selectItem(item, offset) {
        this.selectingItem = item;
        this.yardItemGlow.setGlowShape(this.selectingItem.config.id);
        this.home.editModeDragNotification(true);
        if (this.editMode) {
          this.yardItemGlow.node.active = true;
          this.glowTimer = 0;
        }
        this.draggingOffset = offset;
      },
      onItemTouched: function onItemTouched(e, item, offset) {
        this.onTouchStart(e, item, offset);
      },
      onTouchStart: function onTouchStart(e, item, offset) {
        var location = e.getLocation();
        this._viewPos = this.node.convertToNodeSpaceAR(location);
        this._prevTouchX = this._viewPos.x;
        this._screenX = e.getLocationInView().x;
        this.isPressing = true;
        this.pressingTime = 0;
        if (item) {
          this.app.audioManager.playSfx("click");
          this.isDragging = true;
          this.selectItem(item, offset);
          this.refreshWireFrame(item);
        }
      },
      onTouchMove: function onTouchMove(e) {
        var location = e.getLocation();
        this._viewPos = this.node.convertToNodeSpaceAR(location);
        this.isDragging && this.editMode || (this._destX += (this._viewPos.x - this._prevTouchX) * SCROLL_DISTANCE_MODIFIER);
        this._prevTouchX = this._viewPos.x;
        this._screenX = e.getLocationInView().x;
        e.getDelta().magSqr() > PRESS_MOVE_SQR_TOLERANCE && (this.isPressing = false);
      },
      onTouchEnd: function onTouchEnd(e) {
        this.selectingItem && this.app.audioManager.playSfx("click");
        this.isPressing = false;
        this.isDragging = false;
        this.draggingOffset = null;
        this.home.editModeDragNotification(false);
        this.selectingItem = null;
        this.yardItemGlow.node.active = false;
        this.editMode && this.refreshWireFrame(null);
      },
      onTouchCancel: function onTouchCancel(e) {
        this.isPressing = false;
        this.isDragging = false;
        this.draggingOffset = null;
        this.home.editModeDragNotification(false);
        this.selectingItem = null;
        this.yardItemGlow.node.active = false;
        this.editMode && this.refreshWireFrame(null);
      },
      onItemDeleted: function onItemDeleted(item) {
        if (this.selectingItem === item) {
          this.yardItemGlow.node.active = false;
          this.home.editModeDragNotification(false);
          this.selectingItem = null;
        }
        for (var x = 0; x < _yard["default"].patternSize.x; x++) for (var y = 0; y < _yard["default"].patternSize.y; y++) {
          var cell = this.wireFrameCells[y][x];
          if (cell.occupiedBy && cell.occupiedBy.id === item.config.id) {
            cell.occupiedBy = null;
            break;
          }
        }
        delete this.data[item.config.id];
        delete this.yardItems[item.config.id];
        item.node.destroy();
      },
      startTutorialAnim: function startTutorialAnim(offset, cb) {
        var uiScale = cc.find("Canvas").getChildByName("scaleContainer").scale;
        var startPos = .5 * -this.scrollView.width + this.node.width * uiScale;
        var endPos = -1 * startPos + offset;
        cc.tween(this.scrollView).to(2.5, {
          x: endPos
        }, {
          easing: "quartInOut"
        }).call(function() {
          cb && cb();
        }).start();
      },
      moveToItem: function moveToItem(itemIndex, cb) {
        var uiScale = cc.find("Canvas").getChildByName("scaleContainer").scale;
        var gameViewWidth = this.app.FRAME.ratio < 1 ? this.app.FRAME.width : 1024 * uiScale;
        var maxPos = -this.scrollView.width / 2 + gameViewWidth;
        var offset = 350;
        var yardWidth = 2 * Math.abs(maxPos);
        var totalcolumn = _yard["default"].patternSize.x;
        var widthPerCell = yardWidth / totalcolumn;
        var targetXPos = widthPerCell * (totalcolumn - itemIndex + 2) - Math.abs(maxPos) - offset;
        var validatedXPos = Math.min(Math.max(targetXPos, maxPos), -maxPos);
        cc.tween(this.scrollView).to(2.5, {
          x: validatedXPos
        }, {
          easing: "quartInOut"
        }).call(function() {
          cb && cb();
        }).start();
      },
      updateScreenSize: function updateScreenSize(frame, uiScale) {
        this.node.width = this.node.parent.width;
        this.uiScale = uiScale;
      }
    });
    cc._RF.pop();
  }, {
    "../helpers": "helpers",
    "../staticData/yard": "yard",
    "../userState": "userState"
  } ],
  app: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "967d1HZ3u1MqZOZ0TlE2/L0", "app");
    "use strict";
    var _simplexNoise = _interopRequireDefault(require("simplex-noise"));
    var _Scheduler = _interopRequireDefault(require("./Scheduler.js"));
    var _userState = _interopRequireDefault(require("./userState"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        var _this = this;
        this.IS_DEVELOPMENT = cc.debug.isDisplayStats();
        if (this.initDone) return console.error("app.js - already initiated");
        this.info("app.js - onLoad");
        if (this.IS_DEVELOPMENT) {
          console.log("DEBUG MODE");
          globalThis.app = this;
        }
        cc.game.addPersistRootNode(this.node);
        this.initDone = true;
        this.screenLocker = null;
        this.visibleScenes = [];
        this.CANVAS = {
          width: null,
          height: null
        };
        this.FRAME = {
          width: null,
          height: null,
          ratio: null
        };
        this.screenLocker = cc.find("screenLocker");
        this.spinner = this.screenLocker.getChildByName("spinnerFrame");
        cc.game.addPersistRootNode(this.screenLocker);
        this.screenLocker.active = false;
        this.screenLocker.zIndex = 999;
        console.log("VERSION 1.0.0");
        cc.view.setResizeCallback(function() {
          _this.updateScreenSize();
          var frameSize = cc.view.getFrameSize();
          var orientation = frameSize.width > frameSize.height ? "landscape" : "portrait";
          console.log("Orientation changed:", orientation);
        });
        var CANVAS = cc.find("Canvas");
        this.CANVAS.width = CANVAS.width;
        this.CANVAS.height = CANVAS.height;
        this.now = 0;
        this.noise = new _simplexNoise["default"]();
        this.scheduler = new _Scheduler["default"](this);
        this.yardViewRefreshRequest = false;
        this.boostersRefreshRequest = false;
        this.suppliesRefreshRequest = false;
        this.catRefreshRequest = false;
        this.catTutorial = this.node.getComponent("CatTutorial");
        this.adManager = cc.find("AdManager").getComponent("AdManager");
        var settings = _userState["default"].getSettings();
        this.audioManager = cc.find("AudioManager").getComponent("AudioManager");
        this.audioManager.init(settings.music, settings.sfx);
        cc.director.on(cc.Director.EVENT_BEFORE_SCENE_LOADING, function(sceneName) {
          _this.onBeforeLoadScene(sceneName);
        });
        this.lockScreenReasons = {};
        globalThis.GAMESNACKS && GAMESNACKS.gameReady();
        globalThis.isProdBuild || cc.director.loadScene("Home");
      },
      onBeforeLoadScene: function onBeforeLoadScene(sceneName) {
        "Game" === sceneName ? this.audioManager.loadGameplayContent() : "Home" === sceneName && this.audioManager.loadHomeContent();
      },
      onEnable: function onEnable() {
        this.info("app.js - onEnable");
      },
      start: function start() {
        this.info("app.js - start");
      },
      update: function update(dt) {
        this.now += 1e3 * dt;
        this.scheduler.active && this.scheduler.onUpdate();
      },
      onDisable: function onDisable() {
        this.info("app.js - onDisable");
      },
      onDestroy: function onDestroy() {
        this.info("app.js - onDestroy");
      },
      info: function info() {
        if (!this.IS_DEVELOPMENT) return;
        console.info.apply(this, arguments);
      },
      lockScreen: function lockScreen(reason, showSpinner) {
        void 0 === showSpinner && (showSpinner = false);
        this.lockScreenReasons[reason] = true;
        this.screenLocker.active = true;
        this.spinner.active = this.spinner.active || showSpinner;
      },
      unlockScreen: function unlockScreen(reason) {
        delete this.lockScreenReasons[reason];
        if (Object.keys(this.lockScreenReasons).length) return;
        this.screenLocker.active = false;
        this.spinner.active = false;
      },
      updateScreenSize: function updateScreenSize() {
        this.info("---- updateScreenSize");
        var frameSize = cc.view.getFrameSize();
        this.FRAME.ratio = frameSize.width / frameSize.height;
        if (this.FRAME.ratio > 1) {
          this.FRAME.width = this.CANVAS.width;
          this.FRAME.height = Math.ceil(this.CANVAS.height / this.FRAME.ratio);
        } else {
          this.FRAME.width = Math.ceil(this.CANVAS.height * this.FRAME.ratio);
          this.FRAME.height = this.CANVAS.height;
        }
        console.log("--- FRAME", this.FRAME);
        for (var i = 0; i < this.visibleScenes.length; i++) {
          var scene = this.visibleScenes[i];
          scene.updateScreenSize && scene.updateScreenSize(this.FRAME);
        }
      },
      setSceneVisible: function setSceneVisible(scene) {
        if (-1 !== this.visibleScenes.indexOf(scene)) return console.error("scene is already registered as visible");
        this.visibleScenes.push(scene);
        this.updateScreenSize();
      },
      setSceneHidden: function setSceneHidden(scene) {
        var index = this.visibleScenes.indexOf(scene);
        if (-1 === index) return console.error("scene is not registered as visible");
        this.visibleScenes.splice(index, 1);
      },
      changeScene: function changeScene(from, to) {
        var _this2 = this;
        cc.game.addPersistRootNode(from.node);
        this.lockScreen("changeScene", true);
        cc.director.loadScene(to, function() {
          cc.tween(from.node).to(.5, {
            opacity: 0
          }, {
            easing: "quadInOut"
          }).call(function() {
            cc.game.removePersistRootNode(from.node);
            from.node.destroy();
            _this2.unlockScreen("changeScene");
          }).start();
        });
      },
      reloadScene: function reloadScene(cb) {
        var _this3 = this;
        var from = cc.director.getScene().getChildByName("Canvas");
        var fromName = cc.director.getScene().name;
        cc.game.addPersistRootNode(from);
        this.lockScreen("reloadScene", true);
        cc.director.loadScene("Empty", function() {
          cc.game.removePersistRootNode(from);
          from.destroy();
          from = cc.director.getScene().getChildByName("Canvas");
          cc.game.addPersistRootNode(from);
          cc.director.loadScene(fromName, function() {
            cc.game.removePersistRootNode(from);
            from.destroy();
            _this3.unlockScreen("reloadScene");
            cb && cb();
          });
        });
      }
    });
    cc._RF.pop();
  }, {
    "./Scheduler.js": "Scheduler",
    "./userState": "userState",
    "simplex-noise": 1
  } ],
  boosters: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8b54bSTPD9NaIaWU/c9bH/9", "boosters");
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var _default = {
      hammer: {
        name: "Hammer",
        description: "Clears one item or obstacle"
      },
      airplane: {
        name: "Airplane",
        description: "Clears a row"
      },
      rocket: {
        name: "Rocket",
        description: "Clears a column"
      },
      wheel: {
        name: "Wheel",
        description: "Shuffles all of the items on the board"
      },
      fairystick: {
        name: "Fairystick",
        description: "Clears all Cubes with the same color as the selected Cube."
      },
      paintbrush: {
        name: "Paintbrush",
        description: "Changes the color of the selected Cube to the selected color"
      }
    };
    exports["default"] = _default;
    module.exports = exports["default"];
    cc._RF.pop();
  }, {} ],
  bumper: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "7f4bfdkpMhCc4mclTjIwv/I", "bumper");
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var _constants = _interopRequireDefault(require("../../constants.js"));
    var _helpers = _interopRequireDefault(require("../../helpers.js"));
    var _tweenFunctions = _interopRequireDefault(require("tween-functions"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var _constants$GAMEPLAY = _constants["default"].GAMEPLAY, Z_INDEX = _constants$GAMEPLAY.Z_INDEX, TILE_SIZE = _constants$GAMEPLAY.TILE_SIZE, ITEM_SCALE = _constants$GAMEPLAY.ITEM_SCALE;
    var DOOR_OPENING_DURATION = 200;
    var DOOR_CLOSING_DURATION = 300;
    var DOOR_REMAINS_OPEN_DURATION = 500;
    var MOUSE_APPEAR_DURATION = 100;
    var MOUSE_DISAPPEAR_AFTER = 800;
    var MOUSE_DISAPPEAR_DURATION = 250;
    var MOUSE_BACK_MOVEMENT_DURATION = 325;
    var MOUSE_SPEED = 7e3;
    var MOUSE_ANIMATION_STEP = {
      OPEN: "open",
      MOUSE: "mouse",
      CLOSE: "close"
    };
    var bumper = {
      properties: {
        doorClosed: {
          default: null,
          type: cc.SpriteFrame
        },
        doorOpened: {
          default: null,
          type: cc.SpriteFrame
        },
        mouse: {
          default: null,
          type: cc.SpriteFrame
        },
        mouseFX: {
          default: null,
          type: cc.Prefab
        }
      },
      is: function is(type) {
        return "mouseDoor" === type;
      },
      init: function init(that, options) {
        that.isBlockingCascade = true;
        that.isSensitive = true;
        that.node.zIndex = Z_INDEX.BLOCKER_ITEM;
        var type = options.type;
        switch (type) {
         case "mouseDoor":
          that._addLayers({
            doorOpened: that.doorOpened
          });
          that._addLayers({
            doorClosed: that.doorClosed
          });
        }
        that.layers.doorOpened.active = false;
        that.currentLayerId = "doorClosed";
      },
      gotHit: function gotHit(that, reason, resolve) {
        bumper["gotHit_" + that.type](that, reason, resolve);
      },
      gotHit_mouseDoor: function gotHit_mouseDoor(that, reason, resolve) {
        that.onUpdate || (that.onUpdate = {});
        that.onDestroyCb && that.onDestroyCb(that.type);
        var newResolve = function newResolve() {
          resolve();
        };
        if (that.onUpdate.hitInProgress) {
          var _data = that.onUpdate.hitInProgress.data;
          _data.mousesRemaining++;
          if (_data.animationStep === MOUSE_ANIMATION_STEP.CLOSE) {
            _data.animationStep = MOUSE_ANIMATION_STEP.OPEN;
            _data.nextAnimationStep = that.app.now + DOOR_OPENING_DURATION / 100 * (100 - _data.doorOpeningPercentage);
          } else _data.animationStep === MOUSE_ANIMATION_STEP.MOUSE && (_data.nextAnimationStep = Math.min(that.app.now + 200, _data.nextAnimationStep));
          _data.resolveList.push(newResolve);
          return;
        }
        that.layers.doorOpened.active = true;
        var data = {
          doorOpeningPercentage: 0,
          animationStep: MOUSE_ANIMATION_STEP.OPEN,
          mousesRemaining: 1,
          animationStart: that.app.now,
          nextAnimationStep: that.app.now + DOOR_OPENING_DURATION,
          resolveList: [ newResolve ]
        };
        var update = function update(dt, data) {
          if (that.app.now >= data.nextAnimationStep) {
            if (data.animationStep === MOUSE_ANIMATION_STEP.OPEN) {
              that.layers.doorClosed.opacity = 0;
              data.animationStep = MOUSE_ANIMATION_STEP.MOUSE;
            } else if (data.animationStep === MOUSE_ANIMATION_STEP.CLOSE) {
              that.layers.doorClosed.opacity = 255;
              that.layers.doorOpened.active = false;
              delete that.onUpdate.hitInProgress;
              that._onUpdateCleanup();
              return;
            }
            if (data.animationStep === MOUSE_ANIMATION_STEP.MOUSE) if (data.mousesRemaining < 1) {
              data.animationStep = MOUSE_ANIMATION_STEP.CLOSE;
              data.nextAnimationStep = that.app.now + DOOR_CLOSING_DURATION;
              data.animationStart = that.app.now;
            } else {
              bumper.createMouse(that, data.resolveList.shift(1));
              data.mousesRemaining--;
              data.mousesRemaining > 0 ? data.nextAnimationStep = that.app.now + 200 : data.nextAnimationStep = that.app.now + DOOR_REMAINS_OPEN_DURATION;
            }
          }
          if (data.animationStep === MOUSE_ANIMATION_STEP.OPEN || data.animationStep === MOUSE_ANIMATION_STEP.CLOSE) {
            data.doorOpeningPercentage = Math.min(1, (that.app.now - data.animationStart) / (data.nextAnimationStep - data.animationStart));
            var opacity = data.animationStep === MOUSE_ANIMATION_STEP.OPEN ? 1 - data.doorOpeningPercentage : data.doorOpeningPercentage;
            that.layers.doorClosed.opacity = 255 * opacity;
          }
        };
        that.onUpdate.hitInProgress = {
          data: data,
          update: update
        };
      },
      createMouse: function createMouse(that, resolve) {
        var gameBoard = that.gameBoard;
        var startX = gameBoard.boardXToViewX(that.boardX);
        var direction = that.boardX < that.gameBoard.width / 2 ? 1 : -1;
        var spine = cc.instantiate(that.mouseFX);
        that.gameBoard.view.addChild(spine);
        spine.zIndex = Z_INDEX.CRATE_EXPLOSION;
        spine.x = that.node.x;
        spine.y = that.node.y;
        spine.scale = 1.22 * ITEM_SCALE;
        spine.scaleX *= direction;
        var anim = spine.getComponent(sp.Skeleton);
        anim.timeScale = 1;
        anim.setAnimation(0, "mouse_jump", false);
        anim.setCompleteListener(function() {
          anim.setCompleteListener(null);
          anim.setAnimation(0, "mouse_running", true);
        });
        var mouseSpeed = MOUSE_SPEED * (.8 + .4 * Math.random());
        gameBoard.movingSprites.push({
          onTick: function onTick(data, dt) {
            var progress = gameBoard.app.now - data.startTime;
            var maxDeltaX = dt * mouseSpeed;
            var tweenDeltax = data.startX + _tweenFunctions["default"].easeInBack(progress, 0, 3 * TILE_SIZE, MOUSE_BACK_MOVEMENT_DURATION) * direction - spine.x;
            spine.x += Math.min(maxDeltaX, tweenDeltax);
            if (progress > MOUSE_DISAPPEAR_AFTER) {
              spine.opacity = Math.max(0, MOUSE_DISAPPEAR_AFTER + MOUSE_DISAPPEAR_DURATION - progress) / MOUSE_DISAPPEAR_DURATION * 255;
              if (0 === spine.opacity) {
                spine.parent.removeChild(spine);
                spine.destroy();
                _helpers["default"].removeFromArray(data, gameBoard.movingSprites);
                data.resolve();
              }
            }
          },
          startTime: gameBoard.app.now,
          startX: startX,
          resolve: resolve
        });
      }
    };
    var _default = bumper;
    exports["default"] = _default;
    module.exports = exports["default"];
    cc._RF.pop();
  }, {
    "../../constants.js": "constants",
    "../../helpers.js": "helpers",
    "tween-functions": 3
  } ],
  cabinet: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "bf7eaiu7/VPmrBW1i8BCg9G", "cabinet");
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var _constants = _interopRequireDefault(require("../../constants.js"));
    var _helpers = _interopRequireDefault(require("../../helpers.js"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    function _createForOfIteratorHelperLoose(o, allowArrayLike) {
      var it;
      if ("undefined" === typeof Symbol || null == o[Symbol.iterator]) {
        if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && "number" === typeof o.length) {
          it && (o = it);
          var i = 0;
          return function() {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          };
        }
        throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }
      it = o[Symbol.iterator]();
      return it.next.bind(it);
    }
    function _unsupportedIterableToArray(o, minLen) {
      if (!o) return;
      if ("string" === typeof o) return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      "Object" === n && o.constructor && (n = o.constructor.name);
      if ("Map" === n || "Set" === n) return Array.from(o);
      if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }
    function _arrayLikeToArray(arr, len) {
      (null == len || len > arr.length) && (len = arr.length);
      for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
      return arr2;
    }
    function _extends() {
      _extends = Object.assign || function(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];
          for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
      };
      return _extends.apply(this, arguments);
    }
    var _constants$GAMEPLAY = _constants["default"].GAMEPLAY, Z_INDEX = _constants$GAMEPLAY.Z_INDEX, TILE_SIZE = _constants$GAMEPLAY.TILE_SIZE, ITEM_SIZE = _constants$GAMEPLAY.ITEM_SIZE, ITEM_SCALE = _constants$GAMEPLAY.ITEM_SCALE;
    var SHAKE_DURATION = 300;
    var MASTER_TYPE = {
      milkCabinet: "milkCabinet:bottomLeft",
      milkShelf: "milkShelf:1",
      jamCabinet: "jamCabinet:topLeft"
    };
    var MASTER_RELATIVE_COORDINATES = {
      "milkCabinet:topLeft": {
        x: 0,
        y: 1
      },
      "milkCabinet:topRight": {
        x: -1,
        y: 1
      },
      "milkCabinet:bottomLeft": {
        x: 0,
        y: 0
      },
      "milkCabinet:bottomRight": {
        x: -1,
        y: 0
      },
      "milkShelf:1": {
        x: 0,
        y: 0
      },
      "milkShelf:2": {
        x: -1,
        y: 0
      },
      "milkShelf:3": {
        x: -2,
        y: 0
      },
      "milkShelf:4": {
        x: -3,
        y: 0
      },
      "milkShelf:5": {
        x: -4,
        y: 0
      },
      "milkShelf:6": {
        x: -5,
        y: 0
      },
      "milkShelf:7": {
        x: -6,
        y: 0
      },
      "milkShelf:8": {
        x: -7,
        y: 0
      },
      "milkShelf:9": {
        x: -8,
        y: 0
      },
      "milkShelf:2right": {
        x: -1,
        y: 0
      },
      "milkShelf:3right": {
        x: -2,
        y: 0
      },
      "milkShelf:4right": {
        x: -3,
        y: 0
      },
      "milkShelf:5right": {
        x: -4,
        y: 0
      },
      "milkShelf:6right": {
        x: -5,
        y: 0
      },
      "milkShelf:7right": {
        x: -6,
        y: 0
      },
      "milkShelf:8right": {
        x: -7,
        y: 0
      },
      "milkShelf:9right": {
        x: -8,
        y: 0
      },
      "jamCabinet:topLeft": {
        x: 0,
        y: 0
      },
      "jamCabinet:topRight": {
        x: -1,
        y: 0
      },
      "jamCabinet:bottomLeft": {
        x: 0,
        y: -1
      },
      "jamCabinet:bottomRight": {
        x: -1,
        y: -1
      }
    };
    var cabinet = {
      properties: {
        woodenCabinet: {
          default: null,
          type: cc.SpriteFrame
        },
        milkBottle: {
          default: null,
          type: cc.SpriteFrame
        },
        milkShelfLeft: {
          default: null,
          type: cc.SpriteFrame
        },
        milkShelfCenter: {
          default: null,
          type: cc.SpriteFrame
        },
        milkShelfRight: {
          default: null,
          type: cc.SpriteFrame
        },
        jam1: {
          default: null,
          type: cc.SpriteFrame
        },
        jam2: {
          default: null,
          type: cc.SpriteFrame
        },
        jam3: {
          default: null,
          type: cc.SpriteFrame
        },
        jam4: {
          default: null,
          type: cc.SpriteFrame
        },
        jam5: {
          default: null,
          type: cc.SpriteFrame
        },
        bigboxFX: {
          default: null,
          type: cc.Prefab
        }
      },
      preParsePattern: function preParsePattern(gameBoard, pattern) {
        for (var boardY = 0; boardY < gameBoard.height; boardY++) {
          if (0 === boardY) continue;
          for (var boardX = 0; boardX < gameBoard.width; boardX++) {
            var blueprint = pattern[boardY - 1][boardX];
            if (!blueprint) continue;
            if ("milkCabinet" === blueprint) {
              var validRight = "milkCabinet" === pattern[boardY - 1][boardX + 1];
              var validBottom = "milkCabinet" === pattern[boardY - 1 + 1][boardX];
              var validDiagonal = "milkCabinet" === pattern[boardY - 1 + 1][boardX + 1];
              if (!validRight || !validBottom || !validDiagonal) throw new Error("Invalid milkCabinet pattern: must be a 2x2 square");
              pattern[boardY - 1][boardX] = "milkCabinet:topLeft";
              pattern[boardY - 1][boardX + 1] = "milkCabinet:topRight";
              pattern[boardY - 1 + 1][boardX] = "milkCabinet:bottomLeft";
              pattern[boardY - 1 + 1][boardX + 1] = "milkCabinet:bottomRight";
            } else if ("milkShelfLeft" === blueprint) for (var i = 1; i <= 9; i++) {
              var original = pattern[boardY - 1][boardX + i - 1];
              pattern[boardY - 1][boardX + i - 1] = "milkShelf:" + i;
              if ("milkShelfRight" === original) {
                pattern[boardY - 1][boardX + i - 1] += "right";
                break;
              }
            } else if ("string" === typeof blueprint && "jamCabinet" === blueprint.substr(0, 10) && "jamCabinet:" !== blueprint.substr(0, 11)) {
              var _validRight = "jamCabinet" === pattern[boardY - 1][boardX + 1].substr(0, 10);
              var _validBottom = "jamCabinet" === pattern[boardY - 1 + 1][boardX].substr(0, 10);
              var _validDiagonal = "jamCabinet" === pattern[boardY - 1 + 1][boardX + 1].substr(0, 10);
              if (!_validRight || !_validBottom || !_validDiagonal) throw new Error("Invalid jamCabinet pattern: must be a 2x2 square");
              pattern[boardY - 1][boardX] = "jamCabinet:topLeft:" + pattern[boardY - 1][boardX].substr(-1);
              pattern[boardY - 1][boardX + 1] = "jamCabinet:topRight:" + pattern[boardY - 1][boardX + 1].substr(-1);
              pattern[boardY - 1 + 1][boardX] = "jamCabinet:bottomLeft:" + pattern[boardY - 1 + 1][boardX].substr(-1);
              pattern[boardY - 1 + 1][boardX + 1] = "jamCabinet:bottomRight:" + pattern[boardY - 1 + 1][boardX + 1].substr(-1);
            }
          }
        }
      },
      is: function is(type) {
        return !!MASTER_TYPE[type] || !!MASTER_RELATIVE_COORDINATES[type] || "jamCabinet:" === type.substr(0, 11);
      },
      init: function init(that, options) {
        that.isBlockingCascade = true;
        that.isSensitive = true;
        that.node.zIndex = Z_INDEX.BLOCKER_ITEM;
        var type = options.type;
        that.cabinetData = {
          master: null,
          isMaster: null,
          bottles: null,
          gotHitBy: null,
          mainType: null,
          subType: null,
          color: null,
          prevHitResolve: null
        };
        var types = type.split(":");
        that.cabinetData.mainType = types[0];
        that.cabinetData.subType = types[1];
        if ("jamCabinet" === that.cabinetData.mainType) {
          that.cabinetData.color = types[2];
          that.type = type = options.type = types[0] + ":" + types[1];
        }
        that.cabinetData.isMaster = type === MASTER_TYPE[that.cabinetData.mainType];
        if (that.cabinetData.isMaster) {
          that.cabinetData.master = that;
          that.cabinetData.gotHitBy = {};
          that.linkedGamesItems = [ that ];
          if ("milkCabinet" === that.cabinetData.mainType) {
            that._addLayers({
              woodenCabinet: that.woodenCabinet
            });
            that.layers["woodenCabinet"].width = 2 * TILE_SIZE;
            that.layers["woodenCabinet"].height = 2 * TILE_SIZE;
            that.layers["woodenCabinet"].x = ITEM_SIZE / 2 * ITEM_SCALE;
            that.layers["woodenCabinet"].y = ITEM_SIZE / 2 * ITEM_SCALE;
            that.currentLayerId = "woodenCabinet";
            saveInitialPosition(that.layers[that.currentLayerId]);
            var s = that.milkBottle.getOriginalSize();
            var h = ITEM_SIZE;
            var w = h / s.height * s.width;
            var defaultOptions = {
              spriteFrame: that.milkBottle,
              width: w,
              height: h,
              view: that.gameBoard.view,
              zIndex: Z_INDEX.BOTTLES_AND_JARS
            };
            var vx = that.gameBoard.boardXToViewX(that.boardX) + TILE_SIZE / 2;
            var vy = that.gameBoard.boardYToViewY(that.boardY) + TILE_SIZE / 2;
            var dx = .5 * TILE_SIZE;
            var dy = .48 * TILE_SIZE;
            var tx = .02 * TILE_SIZE;
            var ty = .02 * TILE_SIZE;
            that.cabinetData.bottles = [];
            that.cabinetData.bottles.push(_helpers["default"].createSprite(_extends({}, defaultOptions, {
              x: vx - dx + tx,
              y: vy + dy + ty
            })));
            that.cabinetData.bottles.push(_helpers["default"].createSprite(_extends({}, defaultOptions, {
              x: vx + tx,
              y: vy + dy + ty
            })));
            that.cabinetData.bottles.push(_helpers["default"].createSprite(_extends({}, defaultOptions, {
              x: vx + dx + tx,
              y: vy + dy + ty
            })));
            that.cabinetData.bottles.push(_helpers["default"].createSprite(_extends({}, defaultOptions, {
              x: vx - dx + tx,
              y: vy - dy + ty
            })));
            that.cabinetData.bottles.push(_helpers["default"].createSprite(_extends({}, defaultOptions, {
              x: vx + tx,
              y: vy - dy + ty
            })));
            that.cabinetData.bottles.push(_helpers["default"].createSprite(_extends({}, defaultOptions, {
              x: vx + dx + tx,
              y: vy - dy + ty
            })));
            for (var _iterator = _createForOfIteratorHelperLoose(that.cabinetData.bottles), _step; !(_step = _iterator()).done; ) {
              var bottle = _step.value;
              saveInitialPosition(bottle);
            }
          } else if ("jamCabinet" === that.cabinetData.mainType) {
            that._addLayers({
              woodenCabinet: that.woodenCabinet
            });
            that.layers["woodenCabinet"].width = 2 * TILE_SIZE;
            that.layers["woodenCabinet"].height = 2 * TILE_SIZE;
            that.layers["woodenCabinet"].x = ITEM_SIZE / 2 * ITEM_SCALE;
            that.layers["woodenCabinet"].y = -ITEM_SIZE / 2 * ITEM_SCALE;
            that.currentLayerId = "woodenCabinet";
            saveInitialPosition(that.layers[that.currentLayerId]);
          }
          for (var childCoordinateIndex in MASTER_RELATIVE_COORDINATES) {
            if (0 !== childCoordinateIndex.indexOf(that.cabinetData.mainType + ":")) continue;
            var x = -MASTER_RELATIVE_COORDINATES[childCoordinateIndex].x;
            var y = -MASTER_RELATIVE_COORDINATES[childCoordinateIndex].y;
            if (0 === x && 0 === y) continue;
            x += that.boardX;
            y += that.boardY;
            var gameItem = that.gameBoard.board[y] && that.gameBoard.board[y][x];
            if (!gameItem) continue;
            if (!gameItem.cabinetData) continue;
            if (gameItem.type !== childCoordinateIndex) continue;
            cabinet.addChildToMaster(that, gameItem);
          }
        } else {
          var _x = that.boardX + MASTER_RELATIVE_COORDINATES[that.type].x;
          var _y = that.boardY + MASTER_RELATIVE_COORDINATES[that.type].y;
          var master = that.gameBoard.board[_y] && that.gameBoard.board[_y][_x];
          if (!master) return;
          if (master.type !== MASTER_TYPE[that.cabinetData.mainType]) throw new Error("A cabinet master does not have the right type);");
          cabinet.addChildToMaster(master, that);
        }
        if ("milkShelf" === that.cabinetData.mainType) {
          if ("milkShelf:1" === type) {
            var _that$_addLayers;
            that._addLayers((_that$_addLayers = {}, _that$_addLayers[type] = that.milkShelfLeft, 
            _that$_addLayers));
          } else if ("right" === type.substr(-5)) {
            var _that$_addLayers2;
            that._addLayers((_that$_addLayers2 = {}, _that$_addLayers2[type] = that.milkShelfRight, 
            _that$_addLayers2));
          } else {
            var _that$_addLayers3;
            that._addLayers((_that$_addLayers3 = {}, _that$_addLayers3[type] = that.milkShelfCenter, 
            _that$_addLayers3));
          }
          that.currentLayerId = type;
          that.layers[type].width = TILE_SIZE;
          that.layers[type].height = TILE_SIZE;
          saveInitialPosition(that.layers[that.currentLayerId]);
          var _master = that.cabinetData.master;
          _master.cabinetData.bottles || (_master.cabinetData.bottles = []);
          var _s = that.milkBottle.getOriginalSize();
          var _h = 1.05 * ITEM_SIZE;
          var _w = _h / _s.height * _s.width;
          var _bottle = _helpers["default"].createSprite({
            spriteFrame: that.milkBottle,
            width: _w,
            height: _h,
            view: that.gameBoard.view,
            zIndex: Z_INDEX.FLYING_MISSILE,
            x: that.gameBoard.boardXToViewX(that.boardX),
            y: that.gameBoard.boardYToViewY(that.boardY)
          });
          _master.cabinetData.bottles.push(_bottle);
          saveInitialPosition(_bottle);
        }
        if ("jamCabinet" === that.cabinetData.mainType) {
          var _that$objectiveTypes;
          var _master2 = that.cabinetData.master;
          _master2.cabinetData.bottles || (_master2.cabinetData.bottles = []);
          var textureName = "jam" + that.cabinetData.color;
          var _s2 = that[textureName].getOriginalSize();
          var _h2 = 1.05 * ITEM_SIZE;
          var _w2 = _h2 / _s2.height * _s2.width;
          var _vx = that.gameBoard.boardXToViewX(that.boardX) + TILE_SIZE / 2;
          var _vy = that.gameBoard.boardYToViewY(that.boardY) + TILE_SIZE / 2;
          var _dx = .57 * TILE_SIZE;
          var _dy = .48 * TILE_SIZE;
          var _tx = .02 * TILE_SIZE;
          var _ty = .02 * TILE_SIZE;
          var _bottle2 = _helpers["default"].createSprite({
            spriteFrame: that[textureName],
            width: _w2,
            height: _h2,
            view: that.gameBoard.view,
            zIndex: Z_INDEX.FLYING_MISSILE,
            x: that.gameBoard.boardXToViewX(that.boardX),
            y: that.gameBoard.boardYToViewY(that.boardY)
          });
          saveInitialPosition(_bottle2);
          _bottle2.jamColor = that.cabinetData.color;
          _bottle2.associatedGameObject = that;
          _master2.cabinetData.bottles.push(_bottle2);
          that.objectiveTypes = (_that$objectiveTypes = {}, _that$objectiveTypes["jam" + that.cabinetData.color] = true, 
          _that$objectiveTypes);
        }
        "milkShelf" !== that.cabinetData.mainType && "milkCabinet" !== that.cabinetData.mainType || (that.objectiveTypes = {
          milkBottle: true
        });
      },
      gotHit: function gotHit(that, reason, resolve) {
        if (!that.cabinetData.isMaster) {
          if (!that.cabinetData.master) {
            console.error("unable to forward a cabinet gotHit to its master");
            return resolve();
          }
          return cabinet.gotHit(that.cabinetData.master, reason, resolve);
        }
        if (that.cabinetData.gotHitBy[reason.uid]) return resolve();
        that.cabinetData.gotHitBy[reason.uid] = true;
        if (that.isDying) return resolve();
        that.onUpdate && that.onUpdate.shaking && that.onUpdate.shaking.data.resolve(that.onUpdate.shaking.data);
        var bottleType = "milkBottle";
        var bottleIndex = null;
        if ("jamCabinet" === that.cabinetData.mainType) {
          var color = reason.type.substr(-1);
          var master = that.cabinetData.master;
          if (0 === reason.type.indexOf("sensitive:")) {
            for (var i = 0; i < master.cabinetData.bottles.length; i++) {
              var _bottle3 = master.cabinetData.bottles[i];
              if (_bottle3.jamColor === color) {
                bottleIndex = i;
                break;
              }
            }
            if (null === bottleIndex) return resolve();
          } else bottleIndex = Math.floor(Math.random() * master.cabinetData.bottles.length);
          bottleType = "jam";
        }
        null === bottleIndex && (bottleIndex = 0);
        if (that.cabinetData.prevHitResolve) {
          var previousResolve = that.cabinetData.prevHitResolve.resolve;
          that.cabinetData.prevHitResolve = null;
          previousResolve();
        }
        var comboId = Math.random() + "_" + Date.now();
        var resolveCount = 0;
        var subResolve = function subResolve() {
          if (!that.cabinetData.prevHitResolve || that.cabinetData.prevHitResolve.comboId !== comboId) return;
          resolveCount--;
          if (0 === resolveCount) {
            that.cabinetData.prevHitResolve = null;
            resolve();
          }
        };
        that.cabinetData.prevHitResolve = {
          subResolve: subResolve,
          resolve: resolve,
          comboId: comboId
        };
        var bottle = that.cabinetData.bottles.splice(bottleIndex, 1)[0];
        that.lifePoints = that.cabinetData.bottles.length;
        bottle.associatedGameObject && bottle.associatedGameObject.objectiveTypes && (bottle.associatedGameObject.objectiveTypes = {});
        if (that.lifePoints) {
          resolveCount++;
          cabinet.animateMilkBottleDestroy(that.gameBoard, bottle, subResolve);
        } else {
          that.isDying = true;
          var _loop = function _loop() {
            var child = _step2.value;
            var spine = cc.instantiate(that.bigboxFX);
            that.gameBoard.view.addChild(spine);
            spine.zIndex = Z_INDEX.CRATE_EXPLOSION;
            spine.x = child.node.x;
            spine.y = child.node.y;
            spine.scale = .7 * ITEM_SCALE;
            spine.angle = 8 * Math.random() - 4;
            var anim = spine.getComponent(sp.Skeleton);
            anim.timeScale *= .3 * Math.random() + .9;
            anim.setAnimation(0, "bigbox_hit", false);
            anim.setCompleteListener(function() {
              spine.destroy();
            });
            if (child === that) return "continue";
            if (child.isDying) return "continue";
            child.lifePoints = 0;
            child.isDying = true;
            resolveCount++;
            child._defaultExplode(reason, subResolve, false);
          };
          for (var _iterator2 = _createForOfIteratorHelperLoose(that.linkedGamesItems), _step2; !(_step2 = _iterator2()).done; ) {
            var _ret = _loop();
            if ("continue" === _ret) continue;
          }
          cabinet.animateMilkBottleDestroy(that.gameBoard, bottle);
          resolveCount++;
          that._defaultExplode(reason, subResolve, false);
        }
        that.onUpdate || (that.onUpdate = {});
        that.onUpdate.shaking = {
          data: {
            shakeUntil: that.app.now + SHAKE_DURATION,
            resolve: function resolve(data) {
              if ("jamCabinet" === that.cabinetData.mainType || "milkCabinet" === that.cabinetData.mainType) {
                that.layers[that.currentLayerId].x = that.layers[that.currentLayerId].initialX;
                that.layers[that.currentLayerId].y = that.layers[that.currentLayerId].initialY;
              } else if ("milkShelf" === that.cabinetData.mainType && that.linkedGamesItems) for (var _iterator3 = _createForOfIteratorHelperLoose(that.linkedGamesItems), _step3; !(_step3 = _iterator3()).done; ) {
                var child = _step3.value;
                child.layers[child.currentLayerId].x = child.layers[child.currentLayerId].initialX;
                child.layers[child.currentLayerId].y = child.layers[child.currentLayerId].initialY;
              }
              for (var _iterator4 = _createForOfIteratorHelperLoose(that.cabinetData.bottles), _step4; !(_step4 = _iterator4()).done; ) {
                var _bottle4 = _step4.value;
                _bottle4.x = _bottle4.initialX;
                _bottle4.y = _bottle4.initialY;
              }
              delete that.onUpdate.shaking;
              that._onUpdateCleanup();
            }
          },
          update: function update(dt, data) {
            if (that.app.now >= data.shakeUntil) return data.resolve(data);
            var dx = 10 * that.app.noise.noise2D(that.app.now / 100, 20 * that.uid);
            var dy = 10 * that.app.noise.noise2D(that.app.now / 100, 30 * that.uid);
            if (that.layers[that.currentLayerId]) {
              if ("jamCabinet" === that.cabinetData.mainType || "milkCabinet" === that.cabinetData.mainType) {
                that.layers[that.currentLayerId].x = that.layers[that.currentLayerId].initialX + dx;
                that.layers[that.currentLayerId].y = that.layers[that.currentLayerId].initialY + dy;
              } else if ("milkShelf" === that.cabinetData.mainType && that.linkedGamesItems) for (var _iterator5 = _createForOfIteratorHelperLoose(that.linkedGamesItems), _step5; !(_step5 = _iterator5()).done; ) {
                var child = _step5.value;
                child.layers[child.currentLayerId].x = child.layers[child.currentLayerId].initialX + dx;
                child.layers[child.currentLayerId].y = child.layers[child.currentLayerId].initialY + dy;
              }
              for (var _iterator6 = _createForOfIteratorHelperLoose(that.cabinetData.bottles), _step6; !(_step6 = _iterator6()).done; ) {
                var _bottle5 = _step6.value;
                _bottle5.x = _bottle5.initialX + dx;
                _bottle5.y = _bottle5.initialY + dy;
              }
            }
          }
        };
        that.onDestroyCb && that.onDestroyCb(bottleType);
      },
      addChildToMaster: function addChildToMaster(master, child) {
        child.cabinetData.master = master;
        master.linkedGamesItems.push(child);
        for (var _iterator7 = _createForOfIteratorHelperLoose(master.linkedGamesItems), _step7; !(_step7 = _iterator7()).done; ) {
          var gi = _step7.value;
          if (gi === master) continue;
          gi.linkedGamesItems = master.linkedGamesItems;
        }
      },
      animateMilkBottleDestroy: function animateMilkBottleDestroy(gameBoard, bottle, resolve) {
        bottle.zIndex = Z_INDEX.FLYING_MISSILE;
        gameBoard.movingSprites.push({
          onTick: function onTick(data, dt) {
            data.velocityY -= 17e3 * dt;
            bottle.x += dt * data.velocityX;
            bottle.y += dt * data.velocityY;
            bottle.angle += data.r * dt;
            if (bottle.y < -1024 || bottle.x > 1024 || bottle.x < -1024) {
              bottle.opacity = Math.max(0, bottle.opacity -= 512 * dt);
              if (!bottle.opacity) {
                bottle.parent.removeChild(bottle);
                bottle.destroy();
                _helpers["default"].removeFromArray(data, gameBoard.movingSprites);
                data.resolve && data.resolve();
              }
            }
          },
          velocityX: (700 * Math.random() + 700) * (Math.random() > .5 ? -1 : 1),
          velocityY: 3e3 * Math.random() + 3e3,
          r: (800 * Math.random() + 800) * (Math.random() > .5 ? -1 : 1),
          resolve: resolve
        });
      }
    };
    function saveInitialPosition(item) {
      item.initialX = item.x;
      item.initialY = item.y;
    }
    var _default = cabinet;
    exports["default"] = _default;
    module.exports = exports["default"];
    cc._RF.pop();
  }, {
    "../../constants.js": "constants",
    "../../helpers.js": "helpers"
  } ],
  catModels: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "434d1JeWHtFTIsvLaqHTwsK", "catModels");
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var _userState = _interopRequireDefault(require("../userState"));
    var _cats = _interopRequireDefault(require("../staticData/cats"));
    var _yard = _interopRequireDefault(require("../staticData/yard"));
    var _supplyModel = _interopRequireDefault(require("./supplyModel"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var catPool = {};
    function getCat(catID) {
      if (!_cats["default"][catID]) return null;
      catPool[catID] || (catPool[catID] = new Cat(catID));
      return catPool[catID];
    }
    function getAllCats() {
      var cats = [];
      for (var key in _cats["default"]) {
        var cat = getCat(key);
        cat && cats.push(cat);
      }
      return cats;
    }
    function updateLockedFavorite() {
      for (var key in catPool) {
        var cat = catPool[key];
        cat.updateLockedFavorite();
      }
    }
    function flush() {
      catPool = {};
    }
    var Cat = function() {
      function Cat(id) {
        this.id = id;
        this.number = Object.keys(_cats["default"]).indexOf(id) + 1;
        this.data = _userState["default"].getCats()[id];
        this.config = _cats["default"][id];
        this.intimacyCap = this.config.feedLevels[3];
        this.favorites = [];
        for (var key in _yard["default"].items) _yard["default"].items[key].attract[id] && this.favorites.push(key);
        this.updateLockedFavorite();
      }
      var _proto = Cat.prototype;
      _proto.updateLockedFavorite = function updateLockedFavorite() {
        this.lockedFavorites = [];
        var supplies = _supplyModel["default"].getSupplyData().items;
        for (var key in _yard["default"].items) _yard["default"].items[key].attract[this.id] && (supplies.includes(key) || this.lockedFavorites.push(key));
      };
      _proto.getIntimacyLevel = function getIntimacyLevel() {
        var fishes = this.data.fishFed;
        var level = 0;
        for (var i = 1; i <= 3; i++) {
          if (fishes < this.config.feedLevels[i]) return level;
          level = i;
        }
        return 3;
      };
      _proto.isFull = function isFull() {
        return this.data.dailyFed >= this.config.feedablePerDay;
      };
      _proto.isMaxed = function isMaxed() {
        return 3 === this.getIntimacyLevel();
      };
      _proto.getCurrentSkillDesc = function getCurrentSkillDesc() {
        return this.config.skillDescs[this.getIntimacyLevel()] || "Feed your cat to unlock its skills.";
      };
      return Cat;
    }();
    var _default = {
      getCat: getCat,
      getAllCats: getAllCats,
      flush: flush,
      updateLockedFavorite: updateLockedFavorite
    };
    exports["default"] = _default;
    module.exports = exports["default"];
    cc._RF.pop();
  }, {
    "../staticData/cats": "cats",
    "../staticData/yard": "yard",
    "../userState": "userState",
    "./supplyModel": "supplyModel"
  } ],
  catTutorial: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "be0b1zWNd1P0ICgnsAjsmRn", "catTutorial");
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var _default = {
      0: {},
      1: {
        needLockYard: true,
        pressedTarget: "rubberBallRed",
        catDialog: [ "Wow, this is one of my favorite toys!\nCould you long press the toy to move it?", "Great! Let's move it to the porch!", "Good job! I can't wait to play with it!\nBefore you leave, be sure to\npress confirm.", "Fantastic!\nNow you can start a new level" ]
      },
      2: {},
      3: {},
      4: {
        needLockYard: true,
        catDialog: [ "Fish is my favorite!\nYou can feed me by tapping on me.", "Yum! Our friendship will deepen as you feed me more fish.\nJust remember, I won't always be hungry!", "You can check our friendship level by\ntapping on the Cats Tab", "The Shop is unlocked.\nNow you can buy fish!" ]
      },
      5: {
        catDialog: [ "Select a cat to help you on your adventure!\nEach cat has different skills that are unlocked through increased friendship!" ]
      },
      6: {
        needLockYard: true,
        unlockedLevel: 6,
        catDialog: [ "We have a new friend - Milo! Milo really loves\nthat Flower Pot. New cats won't visit until\nyou place their favorite items in the yard.\nView the Cats tab to learn what we love.", "After playing for a while, cat's will wander off,\nno matter if we are full or not. We may visit again\nwhen we want more fish. I had a great time in your yard!\nThanks! Hope to see you soon again!" ]
      }
    };
    exports["default"] = _default;
    module.exports = exports["default"];
    cc._RF.pop();
  }, {} ],
  cats: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "cbcddRbkZRO5bc8eg13jjFA", "cats");
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var _default = {
      bella: {
        name: "Bella",
        playTime: 600,
        feedablePerDay: 100,
        feedLevels: {
          1: 100,
          2: 500,
          3: 900
        },
        skillDescs: {
          1: "You will start the game with 1 extra move.",
          2: "You will start the game with 2 extra moves.",
          3: "You will start the game with 3 extra moves."
        }
      },
      milo: {
        name: "Milo",
        playTime: 720,
        feedablePerDay: 100,
        feedLevels: {
          1: 200,
          2: 500,
          3: 900
        },
        skillDescs: {
          1: "Replaces 1 basic item with 1 disc when game starts.",
          2: "Replaces 2 basic items with 2 discs when game starts.",
          3: "Replaces 3 basic items with 3 discs when game starts."
        }
      },
      dora: {
        name: "Dora",
        playTime: 660,
        feedablePerDay: 100,
        feedLevels: {
          1: 200,
          2: 500,
          3: 900
        },
        skillDescs: {
          1: "Replaces 1 basic item with 1 rocket when game starts.",
          2: "Replaces 2 basic items with 2 rockets when game starts.",
          3: "Replaces 3 basic items with 3 rockets when game starts."
        }
      },
      lily: {
        name: "Lily",
        playTime: 780,
        feedablePerDay: 150,
        feedLevels: {
          1: 400,
          2: 1e3,
          3: 1800
        },
        skillDescs: {
          1: "Replaces 1 basic item with 1 bomb when game starts.",
          2: "Replaces 2 basic items with 2 bombs when game starts.",
          3: "Replaces 3 basic items with 3 bombs when game starts."
        }
      },
      luna: {
        name: "Luna",
        playTime: 360,
        feedablePerDay: 200,
        feedLevels: {
          1: 600,
          2: 1500,
          3: 2700
        },
        skillDescs: {
          1: "Gives you 2 extra moves when you lose game.",
          2: "Gives you 4 extra moves when you lose game.",
          3: "Gives you 6 extra moves when you lose game."
        }
      },
      leo: {
        name: "Leo",
        playTime: 660,
        feedablePerDay: 150,
        feedLevels: {
          1: 400,
          2: 1e3,
          3: 1800
        },
        skillDescs: {
          1: "Gives you 1 hammer at the beginning of the game.",
          2: "Gives you 2 hammers at the beginning of the game.",
          3: "Gives you 3 hammers at the beginning of the game."
        }
      },
      max: {
        name: "Max",
        feedablePerDay: 150,
        playTime: 540,
        feedLevels: {
          1: 400,
          2: 1e3,
          3: 1800
        },
        skillDescs: {
          1: "Gives you 1 wheel at the beginning of the game.",
          2: "Gives you 2 wheels at the beginning of the game.",
          3: "Gives you 3 wheels at the beginning of the game."
        }
      },
      bob: {
        name: "Bob",
        playTime: 840,
        feedablePerDay: 200,
        feedLevels: {
          1: 600,
          2: 1500,
          3: 2700
        },
        skillDescs: {
          1: "Replaces 1 basic item with 1 wind wheel when game starts.",
          2: "Replaces 2 basic items with 2 wind wheels when game starts.",
          3: "Replaces 3 basic items with 3 wind wheels when game starts."
        }
      }
    };
    exports["default"] = _default;
    module.exports = exports["default"];
    cc._RF.pop();
  }, {} ],
  confettiFx: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b1206FIvQRPRr9UZWbfdkYL", "confettiFx");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        paper: [ cc.Node ]
      },
      onLoad: function onLoad() {
        this.papersInfo = [];
        for (var index = 0; index < this.paper.length; index++) {
          var paper = this.paper[index];
          this.papersInfo.push({
            x: paper.x,
            y: paper.y,
            opacity: paper.opacity,
            angle: paper.angle
          });
        }
      },
      play: function play() {
        var _this = this;
        if (this.isPlaying) return;
        this.isPlaying = true;
        for (var index = 0; index < this.paper.length; index++) {
          var paper = this.paper[index];
          var time = .8 + .4 * Math.random();
          var movementY = 400 + 100 * Math.random();
          var movementX = .5 * paper.x + .5 * paper.x * Math.random();
          var rotation = 90 * Math.random();
          paper.x -= movementX;
          paper.y -= movementY;
          paper.opacity = 0;
          paper.active = true;
          cc.tween(paper).by(.8 * time, {
            x: movementX
          }, {
            easing: "cubicOut"
          }).start();
          cc.tween(paper).by(time, {
            angle: rotation
          }, {
            easing: "linear"
          }).start();
          cc.tween(paper).by(.4 * time, {
            y: movementY
          }, {
            easing: "cubicOut"
          }).delay(.05).by(.8 * time, {
            y: -movementY
          }, {
            easing: "quadIn"
          }).start();
          cc.tween(paper).to(.1 * time, {
            opacity: 255
          }).delay(.6 * time).to(.3 * time, {
            opacity: 0
          }).start();
        }
        setTimeout(function() {
          _this.reset();
          _this.isPlaying = false;
        }, 2e3);
      },
      reset: function reset() {
        for (var index = 0; index < this.paper.length; index++) {
          var paper = this.paper[index];
          var defaultProp = this.papersInfo[index];
          paper.x = defaultProp.x;
          paper.y = defaultProp.y;
          paper.angle = defaultProp.angle;
          paper.opacity = defaultProp.opacity;
          paper.active = false;
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  constants: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d9ff9AXm9hFEpdxsArFgTnl", "constants");
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var TILE_SIZE = 256;
    var BOOSTER_SIZE = 256;
    var ITEM_SIZE = 200;
    var ITEM_SHADOW_SIZE = 220;
    var SLOW_MOTION = 0;
    var ONE_SECOND = 1e3;
    var ONE_MINUTE = 60 * ONE_SECOND;
    var ONE_HOUR = 60 * ONE_MINUTE;
    var ONE_DAY = 24 * ONE_HOUR;
    var TEST_LEVEL = null;
    var SKIP_SELECTION_POPUP = false;
    var FEEDING_ENVIRONMENT = false;
    var QUICK_PROGRESS = false;
    var DELAYED_AD = 0;
    var DYNAMIC_USER_INTERACTION = true;
    var DEBUG = {
      TEST_LEVEL: TEST_LEVEL,
      SKIP_SELECTION_POPUP: SKIP_SELECTION_POPUP,
      FEEDING_ENVIRONMENT: FEEDING_ENVIRONMENT,
      QUICK_PROGRESS: QUICK_PROGRESS,
      DELAYED_AD: DELAYED_AD
    };
    var FORCE_ENABLE_QA = true;
    var _default = {
      DEBUG: DEBUG,
      FORCE_ENABLE_QA: FORCE_ENABLE_QA,
      IPAD_RATIO: .75,
      MAX_BOOSTER_SELECTION: 3,
      AD_HEART_REWARD: 5,
      USER_INIT_DATA: {
        MAX_HEART: 5
      },
      TIME_SPAN: {
        ONE_SECOND: ONE_SECOND,
        ONE_MINUTE: ONE_MINUTE,
        ONE_HOUR: ONE_HOUR,
        ONE_DAY: ONE_DAY
      },
      HEART_REFILL_DURATION: 5 * ONE_MINUTE,
      FIRST_FISH_REWARD_AMOUNT: 50,
      UNLOCK_YARD_AFTER_LEVEL: 2,
      GAMEPLAY: {
        TILE_SIZE: TILE_SIZE,
        ITEM_SIZE: ITEM_SIZE,
        ITEM_SHADOW_SIZE: ITEM_SHADOW_SIZE,
        DYNAMIC_USER_INTERACTION: DYNAMIC_USER_INTERACTION,
        ITEM_SCALE: TILE_SIZE / ITEM_SIZE * .9,
        BOOSTER_SCALE: 2,
        NO_MOVE_DETECTION_DELAY: 2e3,
        HINT_DELAY: 6e3,
        NO_MOVE_FIX_DURATION: 1.5,
        GRAVITY: 9.80665 / 20 * 2 / (50 * SLOW_MOTION + 1),
        LOGIC_UPDATE_INTERVAL: 25,
        ITEM_SWITCH_DURATION: .1 * (10 * SLOW_MOTION + 1),
        ITEM_EXPLODE_DURATION: .03 * (10 * SLOW_MOTION + 1),
        ITEM_TRANSFORM_DURATION: .4 * (10 * SLOW_MOTION + 1),
        ITEMS_GATHERING_DURATION: .2 * (10 * SLOW_MOTION + 1),
        POWERUP_SPAWN_DURATION: .3 * (10 * SLOW_MOTION + 1),
        BOMB_EXPLOSION_DURATION: .4 * (10 * SLOW_MOTION + 1),
        BOMB_RADIUS: 2,
        MISSILE_VELOCITY: 6e3 / (50 * SLOW_MOTION + 1),
        BOOSTER_PROJECTILE_VELOCITY: 3e3 / (50 * SLOW_MOTION + 1),
        DISCOBALL_DELAY_BETWEEN_ITEMS: 75 * (5 * SLOW_MOTION + 1),
        SNIPER_SPEED: 2e3 / (10 * SLOW_MOTION + 1),
        SNIPER_ROTATION_SPEED: 100,
        SNIPER_EXPLOSION_DURATION: 200 * (10 * SLOW_MOTION + 1),
        SNIPER_TAKE_OFF_DURATION: 150 * (10 * SLOW_MOTION + 1),
        DISCO_PULSE_SPEED: 200,
        DISCO_PULSE_SCALE: 5,
        DISCO_GLOW_APPEARANCE_DURATION: 200,
        RAY_OF_LIGHT_SCALE: 1 / 6,
        GROUP_TYPE_PRIORITY: {
          three: 1,
          four_v: 2,
          four_h: 2,
          square: 3,
          cross: 4,
          five: 5
        },
        GROUP_TYPE_POWERUP: {
          four_v: "missiles1",
          four_h: "missiles2",
          square: "sniper",
          cross: "bomb",
          five: "discoball"
        },
        GAME_ITEM_TYPE: {
          basic1: "basic1",
          basic2: "basic2",
          basic3: "basic3",
          basic4: "basic4",
          basic5: "basic5",
          missiles1: "missiles1",
          missiles2: "missiles2",
          discoball: "discoball",
          sniper: "sniper",
          bomb: "bomb"
        },
        ITEM_SHATTER_COLOR: {
          basic1: "red",
          basic2: "yellow",
          basic3: "green",
          basic4: "blue",
          basic5: "purple",
          blocker1a: "purple",
          blocker1b: "purple",
          missiles1: "purple",
          missiles2: "purple",
          discoball: "purple",
          sniper: "purple",
          bomb: "blue"
        },
        Z_INDEX: {
          BACKGROUND: 0,
          UNDERLAY_ITEM1: 1,
          UNDERLAY_ITEM2: 2,
          UNDERLAY_ITEM3: 3,
          UNDERLAY_ITEM4: 4,
          UNDERLAY_ITEM5: 5,
          BLOCKER_ITEM: 6,
          ITEM: 7,
          BORDER: 8,
          BOTTLES_AND_JARS: 9,
          FLYING_MISSILE: 10,
          DISCOBALL_ROTATING: 11,
          DISOBALL_RAY_OF_LIGHT: 12,
          FLYING_SNIPER: 13,
          ITEM_SHATTER: 14,
          CRATE_EXPLOSION: 15,
          EXPLODING_BOMB: 16,
          BOOSTER_PROJECTILE: 17
        },
        SPINE_NAMES: {
          rocketSkinRight: "Rocket_Right",
          rocketSkinLeft: "Rocket_Left",
          rocketSkinUp: "Rocket_Up",
          rocketSkinDown: "Rocket_Down"
        }
      }
    };
    exports["default"] = _default;
    module.exports = exports["default"];
    cc._RF.pop();
  }, {} ],
  development: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0a38deU6XNDLInbRruXSMO0", "development");
    "use strict";
    exports.__esModule = true;
    exports.levelsOrder = exports["default"] = void 0;
    var _types = _interopRequireDefault(require("./types.js"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var O = _types["default"].O, r = _types["default"].r, y = _types["default"].y, g = _types["default"].g, b = _types["default"].b, p = _types["default"].p, R = _types["default"].R, A = _types["default"].A, B = _types["default"].B, D = _types["default"].D, M = _types["default"].M, m = _types["default"].m, s = _types["default"].s, x = _types["default"].x, X = _types["default"].X, z = _types["default"].z, a = _types["default"].a, c = _types["default"].c, d = _types["default"].d, e = _types["default"].e, f = _types["default"].f, h = _types["default"].h, i = _types["default"].i, j = _types["default"].j, k = _types["default"].k, l = _types["default"].l, n = _types["default"].n, o = _types["default"].o, q = _types["default"].q, u = _types["default"].u, v = _types["default"].v, w = _types["default"].w, C = _types["default"].C, E = _types["default"].E, F = _types["default"].F, G = _types["default"].G, H = _types["default"].H, t = _types["default"].t, I = _types["default"].I, J = _types["default"].J, K = _types["default"].K, L = _types["default"].L, N = _types["default"].N, P = _types["default"].P, Q = _types["default"].Q, S = _types["default"].S, V = _types["default"].V, T = _types["default"].T, U = _types["default"].U;
    var levelsOrder = [ "d14", "d15", "d16", "d17", "d18", "d19", "d20" ];
    exports.levelsOrder = levelsOrder;
    var levels = {
      d1: {
        objectives: [ {
          type: x,
          amount: 15
        }, {
          type: t,
          amount: 9
        } ],
        rewards: {
          supply: "bed"
        },
        turns: 30,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ O, z, R, R, R, R, R, z, O ], [ z, z, R, R, R, R, R, z, z ], [ R, R, R, R, R, R, R, R, R ], [ O, R, R, R, z, R, R, R, O ], [ O, R, R, R, R, R, R, R, O ], [ R, R, R, R, R, R, R, R, R ], [ R, R, z, z, R, z, z, R, R ], [ t, t, t, t, t, t, t, t, t ], [ O, R, z, z, R, z, z, R, O ] ]
      },
      d2: {
        objectives: [ {
          type: x,
          amount: 42
        } ],
        rewards: {
          supply: "swing"
        },
        turns: 30,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ R, R, R, R, R, R, R, R, R ], [ R, R, R, R, R, R, R, R, R ], [ R, R, R, R, R, R, R, R, R ], [ R, R, R, R, R, R, R, R, R ], [ z, z, z, z, z, z, z, z, z ], [ z, z, z, z, z, z, z, z, z ], [ z, z, z, O, O, O, z, z, z ], [ z, z, z, z, z, z, z, z, z ], [ z, z, z, z, z, z, z, z, z ] ]
      },
      d3: {
        objectives: [ {
          type: B,
          amount: 10
        }, {
          type: s,
          amount: 10
        }, {
          type: D,
          amount: 5
        } ],
        rewards: {
          supply: "tent"
        },
        turns: 30,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ R, R, R, R, R, R, R, R, R ], [ R, R, R, R, R, R, R, R, R ], [ R, R, R, R, R, R, R, R, R ], [ R, R, R, R, R, R, R, R, R ], [ R, R, R, R, R, R, R, R, R ], [ R, R, R, R, R, R, R, R, R ], [ R, R, R, R, R, R, R, R, R ], [ R, R, R, R, R, R, R, R, R ], [ R, R, R, R, R, R, R, R, R ] ]
      },
      d4: {
        objectives: [ {
          type: b,
          amount: 40
        }, {
          type: y,
          amount: 40
        } ],
        rewards: {
          supply: "pot"
        },
        turns: 15,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ r, y, g, b, y, b, g, y, r ], [ y, g, b, y, g, y, b, r, g ], [ g, g, y, b, r, g, y, g, y ], [ r, b, y, r, y, g, r, b, r ], [ b, y, b, g, g, r, g, y, g ], [ r, r, y, g, y, b, y, r, r ], [ g, y, g, b, r, y, b, r, b ], [ b, b, g, y, b, g, y, g, y ], [ r, y, r, b, r, r, y, g, b ] ]
      },
      d5: {
        objectives: [ {
          type: p,
          amount: 8
        }, {
          type: r,
          amount: 20
        } ],
        rewards: {
          supply: "cushionBlue"
        },
        turns: 22,
        spawnPattern: [ p, p, R, R, R, R, R, p, p ],
        pattern: [ [ p, p, O, O, O, O, O, p, p ], [ p, O, O, O, O, O, O, O, p ], [ O, O, g, b, r, r, b, O, O ], [ O, O, b, y, y, g, y, O, O ], [ O, O, b, b, s, r, b, O, O ], [ O, O, r, y, r, y, g, O, O ], [ O, O, r, r, g, b, b, O, O ], [ p, O, O, O, O, O, O, O, p ], [ p, p, O, O, O, O, O, p, p ] ]
      },
      d14: {
        isDebug: true,
        objectives: [ {
          type: a,
          amount: 9
        }, {
          type: i,
          amount: 9
        }, {
          type: l,
          amount: 9
        } ],
        turns: 999,
        spawnPattern: [ A, A, A, A, A, A, A, A, A ],
        pattern: [ [ a, e, q, b, r, y, l, i, x ], [ a, e, q, y, g, b, l, i, x ], [ a, e, q, b, r, D, l, i, x ], [ a, e, q, y, g, b, l, i, x ], [ a, e, q, D, r, y, l, i, x ], [ c, f, u, y, g, b, n, j, X ], [ c, f, u, b, r, y, n, j, X ], [ d, h, v, y, g, b, o, k, z ], [ d, h, v, b, r, y, o, k, z ] ]
      },
      d15: {
        isDebug: true,
        objectives: [ {
          type: w,
          amount: 15
        } ],
        turns: 999,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ O, O, g, b, y, b, g, O, O ], [ O, g, b, y, g, y, b, r, O ], [ C, g, y, b, r, g, y, g, C ], [ C, b, y, r, y, g, r, b, C ], [ C, y, b, g, g, r, g, y, C ], [ C, C, C, C, C, C, C, C, C ], [ g, y, g, b, r, y, b, r, b ], [ b, b, g, y, b, g, y, g, y ] ]
      },
      d16: {
        isDebug: true,
        objectives: [ {
          type: w,
          amount: 9
        }, {
          type: E,
          amount: 63
        } ],
        turns: 35,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ b, y, g, b, y, y, g, y, b ], [ g, g, b, g, y, b, y, y, g ], [ C, C, C, C, C, C, C, C, C ], [ y, g, y, b, r, g, y, g, y ], [ r, b, y, r, y, m, r, b, b ], [ b, y, b, g, M, r, g, y, g ], [ b, y, g, b, y, b, g, y, b ], [ g, g, b, y, B, y, B, r, g ], [ M, g, y, b, r, g, y, g, y ] ],
        underlayPattern: [ [ O, O, O, O, O, O, O, O, O ], [ O, O, O, O, O, O, O, O, O ], [ F, F, F, F, F, F, F, F, F ], [ F, F, F, F, F, F, F, F, F ], [ F, F, F, F, F, F, F, F, F ], [ F, F, F, F, F, F, F, F, F ], [ F, F, F, F, F, F, F, F, F ], [ F, F, F, F, F, F, F, F, F ], [ F, F, F, F, F, F, F, F, F ] ]
      },
      d17: {
        isDebug: true,
        objectives: [ {
          type: G,
          amount: 100
        } ],
        turns: 35,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ G, y, g, b, y, s, g, y, G ], [ G, g, b, y, g, y, b, y, G ], [ G, g, y, b, r, g, y, g, G ], [ r, b, y, m, y, g, r, b, r ], [ g, y, b, m, g, s, g, y, g ], [ r, b, y, m, y, g, r, b, r ], [ g, y, g, m, r, y, b, r, b ], [ b, b, g, y, b, g, y, g, y ], [ G, G, G, G, G, G, G, G, G ] ]
      },
      d18: {
        isDebug: true,
        objectives: [ {
          type: y,
          amount: 20
        }, {
          type: I,
          amount: 24
        }, {
          type: x,
          amount: 1
        } ],
        turns: 999,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ y, y, g, b, y, y, g, y, g ], [ b, g, b, y, g, y, b, y, b ], [ g, g, y, b, x, g, y, g, y ], [ r, b, y, r, y, g, r, b, r ], [ g, H, H, g, b, y, b, y, g ], [ r, H, H, b, y, y, b, y, y ], [ g, H, H, b, H, H, H, H, b ], [ b, H, H, g, H, H, H, H, y ], [ g, g, y, b, r, g, y, g, y ] ]
      },
      d19: {
        isDebug: true,
        objectives: [ {
          type: V,
          amount: 24
        } ],
        turns: 999,
        spawnPattern: [ A, A, A, A, A, A, A, A, A ],
        pattern: [ [ y, y, g, b, y, y, g, y, g ], [ b, g, b, y, g, y, b, g, b ], [ y, y, g, b, y, b, g, y, g ], [ r, N, N, r, b, g, Q, Q, r ], [ y, N, N, b, y, y, Q, Q, g ], [ b, L, P, y, g, y, L, L, b ], [ b, L, P, y, g, b, P, P, b ], [ g, N, Q, b, x, g, S, S, y ], [ g, P, L, b, r, g, S, S, y ] ]
      },
      d20: {
        isDebug: true,
        objectives: [ {
          type: I,
          amount: 21
        }, {
          type: E,
          amount: 13
        } ],
        turns: 999,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ y, y, g, b, y, y, g, y, g ], [ b, g, b, y, g, y, b, y, b ], [ g, J, K, J, J, J, K, g, y ], [ r, b, y, r, y, g, r, b, r ], [ g, J, J, J, J, J, J, K, g ], [ y, J, K, b, y, H, H, y, g ], [ b, g, b, y, g, H, H, y, b ], [ g, b, g, b, b, g, y, g, y ], [ g, b, g, b, r, g, y, g, y ] ],
        underlayPattern: [ [ O, O, O, O, O, O, O, O, O ], [ O, O, O, O, O, O, O, O, O ], [ O, O, O, O, O, O, O, O, O ], [ O, O, O, O, O, O, O, O, O ], [ O, F, F, F, F, F, F, F, O ], [ O, F, F, O, O, F, F, O, O ], [ O, O, O, O, O, F, F, O, O ], [ O, O, O, O, O, O, O, O, O ], [ O, O, O, O, O, O, O, O, O ] ]
      },
      d999991: {
        isDebug: true,
        objectives: [ {
          type: a,
          amount: 9
        }, {
          type: i,
          amount: 9
        }, {
          type: l,
          amount: 9
        } ],
        turns: 999,
        spawnPattern: [ A, A, A, A, A, A, A, A, A ],
        pattern: [ [ a, e, q, b, r, y, l, i, x ], [ a, e, q, y, g, b, l, i, x ], [ a, e, q, b, r, D, l, i, x ], [ a, e, q, y, g, b, l, i, x ], [ a, e, q, D, r, y, l, i, x ], [ c, f, u, y, g, b, n, j, X ], [ c, f, u, b, r, y, n, j, X ], [ d, h, v, y, g, b, o, k, z ], [ d, h, v, b, r, y, o, k, z ] ]
      },
      d999992: {
        isDebug: true,
        objectives: [ {
          type: r,
          amount: 9999
        }, {
          type: y,
          amount: 9999
        }, {
          type: g,
          amount: 9999
        } ],
        turns: 999,
        spawnPattern: [ A, A, A, A, A, A ],
        pattern: [ [ A, A, A, A, A, A ], [ A, z, z, z, z, A ], [ A, z, z, z, z, A ], [ A, z, z, z, z, A ], [ A, z, z, z, z, A ], [ A, A, A, A, A, A ] ]
      },
      d999993: {
        isDebug: true,
        objectives: [ {
          type: r,
          amount: 9999
        }, {
          type: y,
          amount: 9999
        }, {
          type: g,
          amount: 9999
        } ],
        turns: 999,
        spawnPattern: [ A, A, A, A, A, A ],
        pattern: [ [ A, A, A, A, A, A ], [ z, z, z, z, z, z ], [ z, z, z, z, z, z ], [ z, z, z, z, z, z ], [ z, z, z, z, z, z ], [ z, z, z, z, z, z ] ]
      },
      d999994: {
        isDebug: true,
        objectives: [ {
          type: w,
          amount: 9
        }, {
          type: E,
          amount: 63
        } ],
        turns: 35,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ b, y, g, b, y, y, g, y, b ], [ g, g, b, g, y, b, y, y, g ], [ C, C, C, C, C, C, C, C, C ], [ y, g, y, b, r, g, y, g, y ], [ r, b, y, r, y, m, r, b, b ], [ b, y, b, g, M, r, g, y, g ], [ b, y, g, b, y, b, g, y, b ], [ g, g, b, y, B, y, B, r, g ], [ M, g, y, b, r, g, y, g, y ] ],
        underlayPattern: [ [ O, O, O, O, O, O, O, O, O ], [ O, O, O, O, O, O, O, O, O ], [ F, F, F, F, F, F, F, F, F ], [ F, F, F, F, F, F, F, F, F ], [ F, F, F, F, F, F, F, F, F ], [ F, F, F, F, F, F, F, F, F ], [ F, F, F, F, F, F, F, F, F ], [ F, F, F, F, F, F, F, F, F ], [ F, F, F, F, F, F, F, F, F ] ]
      },
      d999995: {
        isDebug: true,
        objectives: [ {
          type: g,
          amount: 500
        } ],
        turns: 999,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ y, y, g, b, y, r, g, y, g ], [ b, g, r, y, g, y, b, r, b ], [ r, r, g, b, r, b, g, y, g ], [ g, y, g, b, y, r, g, y, g ], [ g, C, C, C, C, C, C, C, b ], [ r, r, r, b, r, b, g, g, g ], [ y, y, g, b, y, r, M, y, g ], [ b, g, r, y, g, y, b, r, b ], [ r, r, g, b, r, b, g, y, g ] ]
      },
      d999990: {
        isDebug: true,
        objectives: [ {
          type: V,
          amount: 100
        } ],
        turns: 999,
        spawnPattern: [ A, A, A, A, A, A, A, A, A ],
        pattern: [ [ y, y, g, b, y, r, N, L, x ], [ b, g, r, y, g, y, N, L, x ], [ r, r, g, b, r, b, g, y, x ], [ y, y, g, b, y, r, y, y, x ], [ b, g, D, y, g, y, b, r, x ], [ r, r, g, b, r, b, g, y, x ], [ y, y, g, b, y, r, y, y, x ], [ b, g, r, y, g, y, b, r, x ], [ r, r, g, b, r, b, g, y, x ] ]
      }
    };
    var _default = levels;
    exports["default"] = _default;
    cc._RF.pop();
  }, {
    "./types.js": "types"
  } ],
  helpers: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b60edYhHv5Jr7wV/brGUH7+", "helpers");
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var _constants = _interopRequireDefault(require("./constants"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var TIME_SPAN = _constants["default"].TIME_SPAN;
    var _default = {
      removeFromArray: function removeFromArray(element, array) {
        var index = array.indexOf(element);
        -1 === index && console.error("removeFromArray: element is not part of array", element, array);
        array.splice(index, 1);
      },
      getAngleFromVector: function getAngleFromVector(x, y) {
        var angle = Math.atan2(-y, x);
        var degrees = 180 * angle / Math.PI;
        return (450 + Math.round(degrees)) % 360;
      },
      getVectorFromAngleAndLength: function getVectorFromAngleAndLength(angle, length) {
        angle = angle * Math.PI / 180;
        return {
          x: length * Math.sin(angle),
          y: length * Math.cos(angle)
        };
      },
      createSprite: function createSprite(options) {
        var spriteFrame = options.spriteFrame, view = options.view, width = options.width, height = options.height, scale = options.scale, x = options.x, y = options.y, zIndex = options.zIndex, angle = options.angle;
        var node = new cc.Node();
        var spriteComponent = node.addComponent(cc.Sprite);
        spriteComponent.spriteFrame = spriteFrame;
        void 0 !== view && view.addChild(node);
        void 0 !== zIndex && (node.zIndex = zIndex);
        void 0 !== width && (node.width = width);
        void 0 !== height && (node.height = height);
        void 0 !== scale && (node.scale = scale);
        void 0 !== x && (node.x = x);
        void 0 !== y && (node.y = y);
        void 0 !== angle && (node.angle = angle);
        return node;
      },
      shuffleArray: function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var _ref = [ array[j], array[i] ];
          array[i] = _ref[0];
          array[j] = _ref[1];
        }
      },
      generatePatternWithoutMatch: function generatePatternWithoutMatch(width, height) {
        var board = [];
        for (var y = 0; y < height; y++) {
          board[y] = [];
          for (var x = 0; x < height; x++) {
            var candidates = {
              r: true,
              y: true,
              g: true,
              b: true
            };
            x > 1 && board[y][x - 2] === board[y][x - 1] && delete candidates[board[y][x - 2]];
            y > 1 && board[y - 2][x] === board[y - 2][x] && delete candidates[board[y - 2][x]];
            var pool = Object.keys(candidates);
            var color = pool[Math.floor(Math.random() * pool.length)];
            board[y][x] = color;
          }
        }
        return board;
      },
      lerp: function lerp(start, end, amt) {
        return (1 - amt) * start + amt * end;
      },
      clamp: function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
      },
      deepCopy: function deepCopy(object) {
        try {
          return JSON.parse(JSON.stringify(object));
        } catch (error) {
          console.error("Unable to deep copy item", object, error);
          return null;
        }
      },
      formatTimeString: function formatTimeString(timestamp) {
        var hour = Math.floor(timestamp / TIME_SPAN.ONE_HOUR);
        var timeRemaining = timestamp - hour * TIME_SPAN.ONE_HOUR;
        var minute = Math.floor(timeRemaining / TIME_SPAN.ONE_MINUTE);
        timeRemaining = timestamp - minute * TIME_SPAN.ONE_MINUTE;
        var second = Math.floor(timeRemaining / TIME_SPAN.ONE_SECOND);
        var zeroPad = function zeroPad(num) {
          return String(num).padStart(2, "0");
        };
        return zeroPad(hour) + ":" + zeroPad(minute) + ":" + zeroPad(second);
      },
      formatTwoLargestUnit: function formatTwoLargestUnit(duration) {
        var zeroPad = function zeroPad(num) {
          return String(num).padStart(2, "0");
        };
        var days = ~~(duration / TIME_SPAN.ONE_DAY);
        var hours = ~~((duration - TIME_SPAN.ONE_DAY * days) / TIME_SPAN.ONE_HOUR);
        if (days > 0) return zeroPad(days) + ":" + zeroPad(hours);
        var minutes = ~~((duration - TIME_SPAN.ONE_DAY * days - TIME_SPAN.ONE_HOUR * hours) / TIME_SPAN.ONE_MINUTE);
        if (hours > 0) return zeroPad(hours) + ":" + zeroPad(minutes);
        var seconds = ~~(duration % TIME_SPAN.ONE_MINUTE / TIME_SPAN.ONE_SECOND);
        return zeroPad(minutes) + ":" + zeroPad(seconds);
      }
    };
    exports["default"] = _default;
    module.exports = exports["default"];
    cc._RF.pop();
  }, {
    "./constants": "constants"
  } ],
  levelModel: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "14851boWtxHeookXTtppg2M", "levelModel");
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var _levels = _interopRequireWildcard(require("../staticData/levels/levels"));
    var _constants = _interopRequireDefault(require("../constants.js"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    function _getRequireWildcardCache() {
      if ("function" !== typeof WeakMap) return null;
      var cache = new WeakMap();
      _getRequireWildcardCache = function _getRequireWildcardCache() {
        return cache;
      };
      return cache;
    }
    function _interopRequireWildcard(obj) {
      if (obj && obj.__esModule) return obj;
      if (null === obj || "object" !== typeof obj && "function" !== typeof obj) return {
        default: obj
      };
      var cache = _getRequireWildcardCache();
      if (cache && cache.has(obj)) return cache.get(obj);
      var newObj = {};
      var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var key in obj) if (Object.prototype.hasOwnProperty.call(obj, key)) {
        var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
        desc && (desc.get || desc.set) ? Object.defineProperty(newObj, key, desc) : newObj[key] = obj[key];
      }
      newObj["default"] = obj;
      cache && cache.set(obj, newObj);
      return newObj;
    }
    function _extends() {
      _extends = Object.assign || function(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];
          for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
      };
      return _extends.apply(this, arguments);
    }
    var DEBUG = _constants["default"].DEBUG;
    var _data;
    function getLevel(levelID) {
      _data = _data || {};
      _data[levelID] = _data[levelID] || parseLevel(levelID, _levels["default"][levelID]);
      if (DEBUG.QUICK_PROGRESS) {
        var objectives = _data[levelID].objectives;
        for (var i = 0; i < objectives.length; i++) objectives[i].amount = 1;
      }
      return _data[levelID];
    }
    function getLevelMap() {
      return _levels.levelsOrder;
    }
    function hasNextLevel(levelId) {
      var map = getLevelMap();
      var mappedId = map.indexOf(levelId);
      return mappedId >= 0 && mappedId < map.length - 1;
    }
    function parseLevel(levelID, rawLevelData) {
      if (!rawLevelData) return null;
      var data = _extends({}, rawLevelData, {
        id: levelID
      });
      patchPattern(data);
      data.levelNumber = _levels.levelsOrder.indexOf(levelID) + 1;
      return data;
    }
    function patchPattern(levelData) {
      var maxPatternLength = Math.max.apply(Math, levelData.pattern.map(function(pl) {
        return pl.length;
      }));
      while (levelData.spawnPattern.length < maxPatternLength) levelData.spawnPattern.push([ "basic1", "basic2", "basic3", "basic4" ]);
    }
    var _default = {
      getLevel: getLevel,
      getLevelMap: getLevelMap,
      hasNextLevel: hasNextLevel
    };
    exports["default"] = _default;
    module.exports = exports["default"];
    cc._RF.pop();
  }, {
    "../constants.js": "constants",
    "../staticData/levels/levels": "levels"
  } ],
  levels: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e14e8nGZn5OSbJDuo5kV6Sr", "levels");
    "use strict";
    exports.__esModule = true;
    exports.levelsOrder = exports["default"] = void 0;
    var _main = _interopRequireWildcard(require("./main.js"));
    var _development = _interopRequireWildcard(require("./development.js"));
    var _types = _interopRequireDefault(require("./types.js"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    function _getRequireWildcardCache() {
      if ("function" !== typeof WeakMap) return null;
      var cache = new WeakMap();
      _getRequireWildcardCache = function _getRequireWildcardCache() {
        return cache;
      };
      return cache;
    }
    function _interopRequireWildcard(obj) {
      if (obj && obj.__esModule) return obj;
      if (null === obj || "object" !== typeof obj && "function" !== typeof obj) return {
        default: obj
      };
      var cache = _getRequireWildcardCache();
      if (cache && cache.has(obj)) return cache.get(obj);
      var newObj = {};
      var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var key in obj) if (Object.prototype.hasOwnProperty.call(obj, key)) {
        var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
        desc && (desc.get || desc.set) ? Object.defineProperty(newObj, key, desc) : newObj[key] = obj[key];
      }
      newObj["default"] = obj;
      cache && cache.set(obj, newObj);
      return newObj;
    }
    function _extends() {
      _extends = Object.assign || function(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];
          for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
      };
      return _extends.apply(this, arguments);
    }
    var levelsOrder = [].concat(_main.levelsOrder);
    exports.levelsOrder = levelsOrder;
    var _default = _extends({}, _main["default"]);
    exports["default"] = _default;
    cc._RF.pop();
  }, {
    "./development.js": "development",
    "./main.js": "main",
    "./types.js": "types"
  } ],
  main: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8e97aiUaPNNZLM6thB+34SV", "main");
    "use strict";
    exports.__esModule = true;
    exports.endGameRandomLevels = exports.levelsOrder = exports["default"] = void 0;
    var _types = _interopRequireDefault(require("./types.js"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var O = _types["default"].O, r = _types["default"].r, y = _types["default"].y, g = _types["default"].g, b = _types["default"].b, p = _types["default"].p, R = _types["default"].R, A = _types["default"].A, B = _types["default"].B, D = _types["default"].D, M = _types["default"].M, m = _types["default"].m, s = _types["default"].s, x = _types["default"].x, X = _types["default"].X, z = _types["default"].z, a = _types["default"].a, c = _types["default"].c, d = _types["default"].d, e = _types["default"].e, f = _types["default"].f, h = _types["default"].h, i = _types["default"].i, j = _types["default"].j, k = _types["default"].k, l = _types["default"].l, n = _types["default"].n, o = _types["default"].o, q = _types["default"].q, u = _types["default"].u, v = _types["default"].v, w = _types["default"].w, C = _types["default"].C, E = _types["default"].E, F = _types["default"].F, G = _types["default"].G, H = _types["default"].H, t = _types["default"].t, I = _types["default"].I, J = _types["default"].J, K = _types["default"].K, L = _types["default"].L, N = _types["default"].N, P = _types["default"].P, Q = _types["default"].Q, S = _types["default"].S, V = _types["default"].V, T = _types["default"].T, U = _types["default"].U;
    var levelsOrder = [ "t1", "t2", "t3", "t4", "t5", "t101", "1", "t108", "3", "t105", "2", "4", "5", "t109", "6", "t102", "9", "8", "t110", "10", "134", "t103", "12", "14", "119", "t111", "121", "122", "118", "t104", "13", "16", "t112", "137", "23", "t113", "27", "t106", "17", "18", "22", "115", "26", "t107", "28", "11", "15", "19", "20", "21", "24", "25", "117", "120", "123", "124", "125", "126", "127", "128", "130", "131", "132", "133", "135", "136", "116", "138", "139", "140", "141", "142", "143", "144", "145" ];
    exports.levelsOrder = levelsOrder;
    var endGameRandomLevels = [ "1", "3", "2", "4", "5", "6", "9", "8", "10", "134", "12", "14", "119", "121", "122", "118", "13", "16", "137", "23", "27", "17", "18", "22", "115", "26", "28", "11", "15", "19", "20", "21", "24", "25", "117", "120", "123", "124", "125", "126", "127", "128", "130", "131", "132", "133", "135", "136", "116", "138", "139", "140", "141", "142", "143", "144", "145" ];
    exports.endGameRandomLevels = endGameRandomLevels;
    var levels = {
      t1: {
        objectives: [ {
          type: y,
          amount: 15
        } ],
        rewards: {
          star: 1,
          coin: 100
        },
        turns: 15,
        spawnPattern: [ R, R, R, R, R, R, R ],
        pattern: [ [ y, r, y, r, b, g, r ], [ r, y, g, b, y, g, b ], [ r, b, r, y, g, r, y ], [ g, r, b, y, g, y, r ], [ y, g, r, g, r, b, g ], [ b, y, b, r, b, g, y ], [ y, b, g, y, y, r, r ] ]
      },
      t2: {
        objectives: [ {
          type: b,
          amount: 18
        }, {
          type: r,
          amount: 18
        } ],
        rewards: {
          star: 1,
          coin: 100
        },
        turns: 20,
        spawnPattern: [ R, R, {
          sequence: [ b, g, r, y, r, b, g, y, b, R ]
        }, R, {
          sequence: [ r, R ]
        }, {
          sequence: [ y, R ]
        }, {
          sequence: [ y, b, g, R ]
        }, R ],
        pattern: [ [ y, r, y, y, b, r, r, y ], [ r, g, g, r, r, g, b, g ], [ g, y, b, y, g, b, g, r ], [ y, r, y, g, y, y, r, g ], [ g, b, r, b, r, g, g, b ], [ g, y, b, g, y, b, g, y ], [ b, g, r, b, g, y, y, b ], [ b, r, b, y, b, r, g, y ] ]
      },
      t3: {
        objectives: [ {
          type: y,
          amount: 30
        }, {
          type: b,
          amount: 20
        } ],
        rewards: {
          star: 1,
          coin: 100
        },
        turns: 20,
        spawnPattern: [ R, R, {
          sequence: [ y, g, g, y, b, R ]
        }, {
          sequence: [ b, r, b, r, g, y, R ]
        }, {
          sequence: [ r, y, r, y, b, r, g, y, R ]
        }, {
          sequence: [ g, y, y, g, y, y, g, r, r, g, R ]
        }, {
          sequence: [ b, r, y, b, g, r, b, R ]
        }, {
          sequence: [ g, r, R ]
        }, R ],
        pattern: [ [ y, g, g, r, b, g, y, y, g ], [ r, b, g, r, y, r, b, r, b ], [ b, y, r, g, b, g, y, b, g ], [ y, b, b, y, r, g, y, b, y ], [ g, r, b, r, g, y, g, g, b ], [ y, y, g, r, r, y, r, y, y ], [ b, r, g, g, y, g, b, g, b ], [ g, b, b, g, b, y, g, y, r ], [ y, r, y, b, g, g, r, b, b ] ]
      },
      t4: {
        objectives: [ {
          type: p,
          amount: 7
        } ],
        rewards: {
          star: 1,
          coin: 100
        },
        turns: 25,
        spawnPattern: [ p, p, R, {
          sequence: [ r, g, r, R ]
        }, {
          sequence: [ y, g, y, R ]
        }, {
          sequence: [ r, g, R ]
        }, R, p, p ],
        pattern: [ [ p, p, O, O, O, O, O, p, p ], [ p, O, O, O, O, O, O, O, p ], [ O, O, y, b, r, r, b, O, O ], [ O, O, b, y, g, y, r, O, O ], [ O, O, b, y, y, g, b, O, O ], [ O, O, r, b, g, y, r, O, O ], [ O, O, r, r, g, g, b, O, O ], [ p, O, O, O, O, O, O, O, p ], [ p, p, O, O, O, O, O, p, p ] ]
      },
      t5: {
        objectives: [ {
          type: r,
          amount: 60
        }, {
          type: b,
          amount: 30
        } ],
        rewards: {
          star: 1,
          coin: 100
        },
        turns: 25,
        spawnPattern: [ R, R, {
          sequence: [ y, R ]
        }, {
          sequence: [ r, R ]
        }, R, {
          sequence: [ r, R ]
        }, {
          sequence: [ b, R ]
        }, R, R ],
        pattern: [ [ O, O, r, b, b, y, g, O, O ], [ O, r, g, y, y, g, r, b, O ], [ r, b, r, b, r, g, y, g, y ], [ b, y, g, r, y, b, g, r, b ], [ y, r, y, y, g, y, y, r, y ], [ r, g, r, r, g, r, g, y, b ], [ b, g, b, y, r, y, r, b, g ], [ O, y, y, g, b, y, r, y, O ], [ O, O, b, y, g, r, b, O, O ] ]
      },
      1: {
        objectives: [ {
          type: x,
          amount: 35
        } ],
        rewards: {
          star: 1,
          coin: 100
        },
        turns: 16,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ g, b, g, b, r, r, O, O, O ], [ g, r, r, g, b, b, O, O, O ], [ r, g, b, r, r, g, O, O, O ], [ x, x, x, x, x, x, x, x, x ], [ x, x, x, x, x, x, x, x, x ], [ x, x, x, x, x, x, x, x, x ], [ O, O, O, y, b, g, b, r, x ], [ O, O, O, y, g, r, g, r, x ], [ O, O, O, x, x, x, x, x, x ] ]
      },
      2: {
        objectives: [ {
          type: t,
          amount: 44
        }, {
          type: x,
          amount: 36
        } ],
        rewards: {
          star: 1,
          coin: 120
        },
        turns: 24,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ X, X, t, t, t, t, t, X, X ], [ X, X, t, t, t, t, t, X, X ], [ X, X, t, t, t, t, t, X, X ], [ X, X, t, t, t, t, t, X, X ], [ X, X, t, t, B, t, t, X, X ], [ X, X, t, t, t, t, t, X, X ], [ X, X, t, t, t, t, t, X, X ], [ X, X, t, t, t, t, t, X, X ], [ X, X, t, t, t, t, t, X, X ] ]
      },
      3: {
        objectives: [ {
          type: x,
          amount: 18
        } ],
        rewards: {
          star: 1,
          coin: 100
        },
        turns: 24,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ z, r, b, y, g, r, y, r, z ], [ z, y, y, r, O, y, b, y, z ], [ z, g, y, b, O, y, b, y, z ], [ z, r, b, b, O, g, r, g, z ], [ z, r, r, g, O, r, b, b, z ], [ z, g, y, g, O, y, g, y, z ], [ z, b, r, r, O, b, g, r, z ], [ z, r, b, b, O, b, r, r, z ], [ z, r, g, b, O, y, r, y, z ] ]
      },
      4: {
        objectives: [ {
          type: t,
          amount: 27
        }, {
          type: x,
          amount: 18
        } ],
        rewards: {
          star: 1,
          coin: 120
        },
        turns: 25,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ r, b, r, X, X, X, y, g, y ], [ b, r, r, X, X, X, g, y, b ], [ y, s, b, X, X, X, g, s, y ], [ r, y, r, X, X, X, r, b, r ], [ O, O, O, X, X, X, O, O, O ], [ O, O, O, X, X, X, O, O, O ], [ t, t, t, t, t, t, t, t, t ], [ t, t, t, t, t, t, t, t, t ], [ t, t, t, t, t, t, t, t, t ] ]
      },
      5: {
        objectives: [ {
          type: t,
          amount: 8
        }, {
          type: x,
          amount: 9
        } ],
        rewards: {
          star: 1,
          coin: 120
        },
        turns: 12,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ O, O, O, O, t, O, O, O, O ], [ O, O, O, y, t, y, O, O, O ], [ O, O, g, g, t, b, b, O, O ], [ O, y, r, g, t, b, r, r, O ], [ z, b, g, r, t, y, b, r, z ], [ O, z, g, g, t, r, b, z, O ], [ O, O, z, g, t, b, z, O, O ], [ O, O, O, z, t, z, O, O, O ], [ O, O, O, O, z, O, O, O, O ] ]
      },
      6: {
        objectives: [ {
          type: t,
          amount: 10
        }, {
          type: x,
          amount: 18
        } ],
        rewards: {
          star: 2,
          coin: 120
        },
        turns: 22,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ r, y, g, b, O, b, g, y, r ], [ y, g, b, y, O, y, b, r, g ], [ t, y, g, g, O, b, b, y, t ], [ t, y, r, g, O, b, r, r, t ], [ t, b, g, r, t, y, b, r, t ], [ t, b, g, g, t, r, b, y, t ], [ O, O, O, O, O, O, O, O, O ], [ x, x, x, x, x, x, x, x, x ], [ x, x, x, x, x, x, x, x, x ] ]
      },
      7: {
        objectives: [ {
          type: x,
          amount: 32
        } ],
        rewards: {
          star: 2,
          coin: 120
        },
        turns: 20,
        spawnPattern: [ R, R, R, R, R, R, R, R ],
        pattern: [ [ y, r, g, b, X, X, X, X ], [ b, y, y, b, X, X, X, X ], [ g, r, b, r, X, X, X, X ], [ y, b, r, y, X, X, X, X ], [ z, z, z, z, r, r, b, r ], [ z, z, z, z, y, b, y, b ], [ z, z, z, z, g, y, g, y ], [ z, z, z, z, b, g, y, y ] ]
      },
      8: {
        objectives: [ {
          type: t,
          amount: 6
        }, {
          type: x,
          amount: 12
        } ],
        rewards: {
          star: 2,
          coin: 120
        },
        turns: 22,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ O, O, X, O, t, O, X, O, O ], [ O, O, X, O, t, O, X, O, O ], [ O, r, X, g, t, b, X, g, O ], [ O, y, X, g, t, b, X, r, O ], [ O, b, X, r, t, y, X, r, O ], [ O, g, X, g, t, r, X, b, O ], [ O, O, O, O, O, O, O, O, O ], [ y, r, y, r, r, y, b, r, b ], [ O, b, r, g, g, b, r, b, O ] ]
      },
      9: {
        objectives: [ {
          type: t,
          amount: 28
        }, {
          type: E,
          amount: 28
        } ],
        rewards: {
          star: 2,
          coin: 120
        },
        turns: 22,
        spawnPattern: [ T, T, T, T, T, T, T, T, T ],
        pattern: [ [ O, O, t, t, O, t, t, O, O ], [ t, t, t, t, O, t, t, t, t ], [ t, t, t, t, O, t, t, t, t ], [ t, t, t, t, O, t, t, t, t ], [ O, O, O, O, O, O, O, O, O ], [ y, b, g, g, y, p, p, b, p ], [ y, y, p, g, g, p, b, p, b ], [ g, p, y, p, p, y, b, y, g ], [ p, b, p, g, g, b, p, p, g ] ],
        underlayPattern: [ [ O, O, E, E, O, E, E, O, O ], [ E, E, E, E, O, E, E, E, E ], [ E, E, E, E, O, E, E, E, E ], [ E, E, E, E, O, E, E, E, E ], [ O, O, O, O, O, O, O, O, O ], [ O, O, O, O, O, O, O, O, O ], [ O, O, O, O, O, O, O, O, O ], [ O, O, O, O, O, O, O, O, O ], [ O, O, O, O, O, O, O, O, O ] ]
      },
      10: {
        objectives: [ {
          type: t,
          amount: 26
        }, {
          type: E,
          amount: 26
        }, {
          type: x,
          amount: 28
        } ],
        rewards: {
          star: 2,
          coin: 120
        },
        turns: 23,
        spawnPattern: [ T, T, T, T, T, T, T, T, T ],
        pattern: [ [ t, t, t, O, O, O, t, t, t ], [ t, x, x, p, p, y, x, x, t ], [ t, x, x, g, p, p, x, x, t ], [ t, x, x, b, y, p, x, x, t ], [ t, x, x, y, p, b, x, x, t ], [ t, x, x, g, g, p, x, x, t ], [ t, x, x, b, y, g, x, x, t ], [ t, x, x, b, y, y, x, x, t ], [ t, t, t, O, O, O, t, t, t ] ],
        underlayPattern: [ [ E, E, E, O, O, O, E, E, E ], [ E, O, O, O, O, O, O, O, E ], [ E, O, O, O, O, O, O, O, E ], [ E, O, O, O, O, O, O, O, E ], [ E, O, O, O, O, O, O, O, E ], [ E, O, O, O, O, O, O, O, E ], [ E, O, O, O, O, O, O, O, E ], [ E, O, O, O, O, O, O, O, E ], [ E, E, E, O, O, O, E, E, E ] ]
      },
      11: {
        objectives: [ {
          type: x,
          amount: 14
        }, {
          type: w,
          amount: 23
        }, {
          type: G,
          amount: 20
        } ],
        rewards: {
          star: 2,
          coin: 150
        },
        turns: 23,
        spawnPattern: [ R, R, R, R, R, R, R ],
        pattern: [ [ g, g, b, g, b, b, y ], [ x, x, x, x, x, x, x ], [ x, x, x, x, x, x, x ], [ w, w, w, w, w, w, w ], [ w, w, w, w, w, w, w ], [ G, w, w, w, w, w, G ], [ O, G, w, w, w, G, O ], [ O, O, G, w, G, O, O ], [ O, O, O, G, O, O, O ] ]
      },
      12: {
        objectives: [ {
          type: t,
          amount: 36
        }, {
          type: I,
          amount: 21
        } ],
        rewards: {
          star: 2,
          coin: 150
        },
        turns: 20,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ O, O, y, b, g, b, b, O, O ], [ y, y, g, g, b, r, r, y, r ], [ t, t, t, t, t, t, t, t, t ], [ O, J, J, J, J, J, J, K, O ], [ t, t, t, t, t, t, t, t, t ], [ O, J, J, J, J, J, J, K, O ], [ t, t, t, t, t, t, t, t, t ], [ O, J, J, J, J, J, J, K, O ], [ t, t, t, t, t, t, t, t, t ] ]
      },
      13: {
        objectives: [ {
          type: x,
          amount: 48
        }, {
          type: G,
          amount: 50
        } ],
        rewards: {
          star: 2,
          coin: 180
        },
        turns: 24,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ O, X, x, x, r, x, x, X, O ], [ O, X, x, x, r, x, x, X, O ], [ O, X, x, x, b, x, x, X, O ], [ O, X, x, x, r, x, x, X, O ], [ G, X, x, x, y, x, x, X, G ], [ G, X, x, x, g, x, x, X, G ], [ G, X, x, x, y, x, x, X, G ], [ G, X, x, x, y, x, x, X, G ], [ G, G, G, O, O, O, G, G, G ] ]
      },
      14: {
        objectives: [ {
          type: x,
          amount: 36
        }, {
          type: I,
          amount: 36
        } ],
        rewards: {
          star: 2,
          coin: 150
        },
        turns: 20,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ O, O, X, X, g, X, X, O, O ], [ O, O, x, x, g, x, x, O, O ], [ H, H, x, x, r, x, x, H, H ], [ H, H, x, x, g, x, x, H, H ], [ H, H, x, x, y, x, x, H, H ], [ H, H, x, x, b, x, x, H, H ], [ H, H, x, x, y, x, x, H, H ], [ H, H, x, x, b, x, x, H, H ], [ O, O, X, X, b, X, X, O, O ] ]
      },
      15: {
        objectives: [ {
          type: t,
          amount: 24
        }, {
          type: I,
          amount: 18
        }, {
          type: w,
          amount: 20
        } ],
        rewards: {
          star: 2,
          coin: 220
        },
        turns: 25,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ O, O, r, y, y, b, b, g, b ], [ O, O, H, H, t, t, t, t, r ], [ O, O, H, H, t, t, t, t, r ], [ C, w, t, t, H, H, t, t, y ], [ C, w, t, t, H, H, t, t, r ], [ C, w, t, t, t, t, H, H, y ], [ C, w, t, t, t, t, H, H, y ], [ C, w, w, w, w, w, O, O, O ], [ C, w, w, w, w, w, O, O, O ] ]
      },
      16: {
        objectives: [ {
          type: x,
          amount: 35
        }, {
          type: E,
          amount: 24
        }, {
          type: I,
          amount: 24
        }, {
          type: G,
          amount: 30
        } ],
        rewards: {
          star: 2,
          coin: 180
        },
        turns: 36,
        spawnPattern: [ T, T, T, T, T, T, T, T, T ],
        pattern: [ [ g, g, y, g, p, b, b, y, b ], [ p, b, p, p, g, y, p, g, y ], [ x, x, x, x, x, x, x, x, x ], [ H, H, H, H, x, H, H, H, H ], [ H, H, H, H, x, H, H, H, H ], [ O, O, O, O, O, O, O, O, O ], [ x, x, x, x, G, x, x, x, x ], [ x, x, x, x, G, x, x, x, x ], [ x, x, x, x, G, x, x, x, x ] ],
        underlayPattern: [ [ O, O, O, O, O, O, O, O, O ], [ O, O, O, O, O, O, O, O, O ], [ O, O, O, O, O, O, O, O, O ], [ O, O, O, O, O, O, O, O, O ], [ O, O, O, O, O, O, O, O, O ], [ O, O, O, O, O, O, O, O, O ], [ E, E, E, E, O, E, E, E, E ], [ E, E, E, E, O, E, E, E, E ], [ E, E, E, E, O, E, E, E, E ] ]
      },
      17: {
        objectives: [ {
          type: V,
          amount: 16
        }, {
          type: x,
          amount: 53
        } ],
        rewards: {
          star: 2,
          coin: 180
        },
        turns: 18,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ L, N, x, r, y, r, x, L, N ], [ P, Q, x, r, r, g, x, P, Q ], [ X, x, x, b, y, g, x, x, X ], [ X, x, x, r, y, b, x, x, X ], [ X, x, x, x, x, x, x, x, X ], [ X, x, x, x, x, x, x, x, X ], [ X, x, x, x, x, x, x, x, X ], [ L, N, x, x, x, x, x, L, N ], [ P, Q, X, X, X, X, X, P, Q ] ]
      },
      18: {
        objectives: [ {
          type: V,
          amount: 8
        }, {
          type: I,
          amount: 44
        } ],
        rewards: {
          star: 2,
          coin: 180
        },
        turns: 18,
        spawnPattern: [ R, R, R, R, R, R, R, R ],
        pattern: [ [ H, H, r, g, r, r, H, H ], [ H, H, g, r, y, r, H, H ], [ H, H, g, g, r, y, H, H ], [ H, H, r, g, g, r, H, H ], [ H, H, b, b, y, y, H, H ], [ H, H, r, y, b, r, H, H ], [ J, J, J, J, J, J, J, K ], [ O, O, L, N, L, N, O, O ], [ O, O, P, Q, P, Q, O, O ] ]
      },
      19: {
        objectives: [ {
          type: x,
          amount: 32
        }, {
          type: E,
          amount: 32
        }, {
          type: w,
          amount: 9
        }, {
          type: G,
          amount: 40
        } ],
        rewards: {
          star: 2,
          coin: 220
        },
        turns: 26,
        spawnPattern: [ T, T, T, T, T, T, T, T, T ],
        pattern: [ [ G, x, x, x, x, b, g, g, w ], [ G, x, x, x, x, y, b, g, w ], [ G, x, x, x, x, p, b, y, w ], [ G, x, x, x, x, b, p, g, w ], [ O, O, O, O, O, p, y, p, w ], [ G, x, x, x, x, p, g, y, w ], [ G, x, x, x, x, y, b, y, w ], [ G, x, x, x, x, y, b, b, w ], [ G, x, x, x, x, g, y, b, w ] ],
        underlayPattern: [ [ O, F, F, F, F, O, O, O, O ], [ O, E, E, E, E, O, O, O, O ], [ O, E, E, E, E, O, O, O, O ], [ O, E, E, E, E, O, O, O, O ], [ O, O, O, O, O, O, O, O, O ], [ O, E, E, E, E, O, O, O, O ], [ O, E, E, E, E, O, O, O, O ], [ O, E, E, E, E, O, O, O, O ], [ O, F, F, F, F, O, O, O, O ] ]
      },
      20: {
        objectives: [ {
          type: t,
          amount: 6
        }, {
          type: w,
          amount: 36
        }, {
          type: I,
          amount: 24
        } ],
        rewards: {
          star: 2,
          coin: 220
        },
        turns: 28,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ t, b, y, b, y, b, y, b, t ], [ t, y, b, y, b, y, b, y, t ], [ t, b, y, b, y, b, y, b, t ], [ w, w, w, w, w, w, w, w, w ], [ w, w, w, w, w, w, w, w, w ], [ w, w, w, w, w, w, w, w, w ], [ w, w, w, w, w, w, w, w, w ], [ H, H, H, H, O, H, H, H, H ], [ H, H, H, H, O, H, H, H, H ] ]
      },
      21: {
        objectives: [ {
          type: t,
          amount: 27
        }, {
          type: w,
          amount: 36
        } ],
        rewards: {
          star: 2,
          coin: 220
        },
        turns: 25,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ y, b, b, y, b, y, y, b, b ], [ t, t, t, t, t, t, t, t, t ], [ t, t, t, t, t, t, t, t, t ], [ t, t, t, t, t, t, t, t, t ], [ r, r, g, r, g, g, r, g, g ], [ w, w, w, w, w, w, w, w, w ], [ w, w, w, w, w, w, w, w, w ], [ w, w, w, w, w, w, w, w, w ], [ C, C, C, C, C, C, C, C, C ] ]
      },
      22: {
        objectives: [ {
          type: V,
          amount: 32
        }, {
          type: x,
          amount: 16
        } ],
        rewards: {
          star: 2,
          coin: 220
        },
        turns: 22,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ L, N, X, b, b, r, X, L, N ], [ P, Q, X, r, b, r, X, P, Q ], [ L, N, X, y, g, g, X, L, N ], [ P, Q, X, y, r, r, X, P, Q ], [ L, N, X, r, b, g, X, L, N ], [ P, Q, X, y, b, g, X, P, Q ], [ L, N, X, g, y, r, X, L, N ], [ P, Q, X, y, b, y, X, P, Q ] ]
      },
      23: {
        objectives: [ {
          type: x,
          amount: 59
        }, {
          type: G,
          amount: 40
        } ],
        rewards: {
          star: 2,
          coin: 220
        },
        turns: 28,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ O, b, b, r, b, r, r, b, O ], [ O, X, x, x, x, x, x, X, O ], [ z, X, x, x, x, x, x, X, z ], [ z, X, x, x, x, x, x, X, z ], [ z, X, x, x, x, x, x, X, z ], [ z, X, x, x, x, x, x, X, z ], [ z, X, x, x, x, x, x, X, z ], [ O, X, x, x, x, x, x, X, O ], [ O, G, G, G, G, G, G, G, O ] ]
      },
      24: {
        objectives: [ {
          type: V,
          amount: 24
        }, {
          type: t,
          amount: 16
        }, {
          type: w,
          amount: 12
        } ],
        rewards: {
          star: 2,
          coin: 220
        },
        turns: 26,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ w, L, N, t, r, t, L, N, w ], [ w, N, L, t, y, t, N, L, w ], [ O, O, O, t, r, t, O, O, O ], [ w, L, N, t, r, t, L, N, w ], [ w, N, L, t, y, t, N, L, w ], [ O, O, O, t, y, t, O, O, O ], [ w, L, N, t, r, t, L, N, w ], [ w, N, L, t, r, t, N, L, w ] ]
      },
      25: {
        objectives: [ {
          type: t,
          amount: 34
        }, {
          type: w,
          amount: 20
        }, {
          type: G,
          amount: 35
        }, {
          type: E,
          amount: 34
        } ],
        rewards: {
          star: 2,
          coin: 300
        },
        turns: 24,
        spawnPattern: [ T, T, T, T, T, T, T, T, T ],
        pattern: [ [ y, g, p, p, y, t, y, p, y ], [ y, p, g, g, b, b, g, b, p ], [ t, t, t, t, t, t, t, t, t ], [ t, t, t, t, t, t, t, t, t ], [ w, t, t, t, t, t, t, t, w ], [ w, w, t, t, t, t, t, w, w ], [ w, w, w, t, t, t, w, w, w ], [ w, w, w, w, t, w, w, w, w ], [ G, G, G, G, G, G, G, G, G ] ],
        underlayPattern: [ [ O, O, O, O, O, O, O, O, O ], [ O, O, O, O, O, O, O, O, O ], [ E, E, E, E, E, E, E, E, E ], [ E, E, E, E, E, E, E, E, E ], [ O, E, E, E, E, E, E, E, O ], [ O, O, E, E, E, E, E, O, O ], [ O, O, O, E, E, E, O, O, O ], [ O, O, O, O, E, O, O, O, O ], [ O, O, O, O, O, O, O, O, O ] ]
      },
      26: {
        objectives: [ {
          type: V,
          amount: 36
        }, {
          type: t,
          amount: 36
        } ],
        rewards: {
          star: 3,
          coin: 220
        },
        turns: 22,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ t, t, t, t, t, t, g, y, g ], [ t, t, t, t, t, t, y, g, y ], [ t, t, t, t, t, t, g, y, g ], [ L, N, L, N, L, N, t, t, t ], [ P, Q, P, Q, P, Q, t, t, t ], [ L, N, L, N, L, N, t, t, t ], [ P, Q, P, Q, P, Q, t, t, t ], [ L, N, L, N, L, N, t, t, t ], [ P, Q, P, Q, P, Q, t, t, t ] ]
      },
      27: {
        objectives: [ {
          type: I,
          amount: 24
        }, {
          type: t,
          amount: 24
        }, {
          type: G,
          amount: 45
        } ],
        rewards: {
          star: 3,
          coin: 180
        },
        turns: 22,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ H, H, y, t, t, t, g, y, G ], [ H, H, g, t, t, t, y, b, G ], [ H, H, r, t, t, t, b, y, G ], [ H, H, g, t, t, t, y, r, G ], [ H, H, y, t, t, t, g, y, G ], [ H, H, y, t, t, t, y, b, G ], [ H, H, g, t, t, t, g, b, G ], [ H, H, y, t, t, t, r, g, G ] ]
      },
      28: {
        objectives: [ {
          type: I,
          amount: 24
        }, {
          type: t,
          amount: 21
        }, {
          type: w,
          amount: 18
        }, {
          type: E,
          amount: 49
        } ],
        rewards: {
          star: 3,
          coin: 220
        },
        turns: 20,
        spawnPattern: [ T, T, T, T, T, T, T, T, T ],
        pattern: [ [ w, y, g, g, p, g, y, p, w ], [ w, H, H, t, t, t, H, H, w ], [ w, H, H, t, t, t, H, H, w ], [ w, y, p, t, t, t, g, p, w ], [ w, b, b, t, t, t, p, g, w ], [ w, p, b, t, t, t, g, g, w ], [ w, H, H, t, t, t, H, H, w ], [ w, H, H, t, t, t, H, H, w ], [ w, y, g, y, b, y, y, p, w ] ],
        underlayPattern: [ [ O, O, O, O, O, O, O, O, O ], [ O, E, E, E, E, E, E, E, O ], [ O, E, E, E, E, E, E, E, O ], [ O, E, E, E, E, E, E, E, O ], [ O, E, E, E, E, E, E, E, O ], [ O, E, E, E, E, E, E, E, O ], [ O, E, E, E, E, E, E, E, O ], [ O, E, E, E, E, E, E, E, O ], [ O, O, O, O, O, O, O, O, O ] ]
      },
      t101: {
        objectives: [ {
          type: x,
          amount: 54
        } ],
        rewards: {
          star: 1,
          coin: 100
        },
        turns: 28,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ y, g, b, b, r, y, y, b, r ], [ b, y, g, g, b, r, r, y, b ], [ r, g, g, b, g, y, y, b, r ], [ x, x, x, x, x, x, x, x, x ], [ x, x, x, x, x, x, x, x, x ], [ x, x, x, x, x, x, x, x, x ], [ x, x, x, x, x, x, x, x, x ], [ x, x, x, x, x, x, x, x, x ], [ x, x, x, x, x, x, x, x, x ] ]
      },
      t102: {
        objectives: [ {
          type: E,
          amount: 45
        } ],
        rewards: {
          star: 2,
          coin: 120
        },
        turns: 24,
        spawnPattern: [ T, T, T, T, T, T, T, T, T ],
        pattern: [ [ b, p, b, b, y, g, g, b, y ], [ y, g, p, p, b, y, y, g, b ], [ p, p, g, b, p, g, g, b, y ], [ g, y, y, g, y, y, g, y, g ], [ g, y, b, g, b, b, y, p, g ], [ b, g, g, b, g, y, g, y, p ], [ p, y, y, p, g, y, y, b, p ], [ p, b, b, g, p, p, g, p, y ] ],
        underlayPattern: [ [ O, O, O, O, O, O, O, O, O ], [ O, O, O, O, O, O, O, O, O ], [ E, E, E, E, E, E, E, E, E ], [ E, E, E, E, E, E, E, E, E ], [ E, E, E, E, E, E, E, E, E ], [ E, E, E, E, E, E, E, E, E ], [ E, E, E, E, E, E, E, E, E ], [ O, O, O, O, O, O, O, O, O ], [ O, O, O, O, O, O, O, O, O ] ]
      },
      t103: {
        objectives: [ {
          type: I,
          amount: 24
        } ],
        rewards: {
          star: 2,
          coin: 150
        },
        turns: 20,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ y, g, b, b, r, y, y, b, r ], [ r, y, g, g, b, r, r, y, b ], [ b, g, H, H, g, H, H, b, r ], [ y, y, H, H, r, H, H, r, y ], [ b, g, r, y, g, g, r, b, b ], [ b, g, H, H, r, H, H, b, y ], [ y, b, H, H, r, H, H, r, y ], [ y, g, b, g, b, g, b, g, g ], [ b, y, b, y, g, y, g, r, y ] ]
      },
      t104: {
        objectives: [ {
          type: G,
          amount: 70
        } ],
        rewards: {
          star: 3,
          coin: 150
        },
        turns: 26,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ G, y, y, r, y, r, y, b, G ], [ G, y, b, g, b, r, r, y, G ], [ G, r, y, r, g, y, y, r, G ], [ G, y, g, y, r, b, r, r, G ], [ G, r, b, r, y, y, r, b, G ], [ G, r, r, g, y, g, g, r, G ], [ G, b, g, b, b, y, r, y, G ], [ G, b, b, r, b, y, b, g, G ], [ G, G, G, G, G, G, G, G, G ] ]
      },
      t105: {
        objectives: [ {
          type: t,
          amount: 54
        } ],
        rewards: {
          star: 3,
          coin: 100
        },
        turns: 22,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ t, t, t, O, O, O, t, t, t ], [ t, t, t, O, O, O, t, t, t ], [ t, t, t, g, b, y, t, t, t ], [ t, t, t, r, y, b, t, t, t ], [ t, t, t, g, y, b, t, t, t ], [ t, t, t, g, r, g, t, t, t ], [ t, t, t, b, y, b, t, t, t ], [ t, t, t, O, O, O, t, t, t ], [ t, t, t, O, O, O, t, t, t ] ]
      },
      t106: {
        objectives: [ {
          type: V,
          amount: 16
        } ],
        rewards: {
          star: 3,
          coin: 180
        },
        turns: 22,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ O, O, r, y, r, r, g, O, O ], [ O, O, t, y, b, g, b, O, O ], [ r, t, L, N, y, L, N, b, r ], [ y, y, P, Q, r, P, Q, r, b ], [ g, r, g, g, y, b, b, y, r ], [ y, r, L, N, y, L, N, g, y ], [ g, g, P, Q, g, P, Q, r, g ], [ O, O, g, y, r, y, t, O, O ], [ O, O, r, b, b, y, t, O, O ] ]
      },
      t107: {
        objectives: [ {
          type: w,
          amount: 76
        } ],
        rewards: {
          star: 3,
          coin: 220
        },
        turns: 30,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ m, w, w, w, w, w, w, w, m ], [ w, w, w, w, w, w, w, w, w ], [ w, w, w, w, B, w, w, w, w ], [ w, w, w, w, w, w, w, w, w ], [ w, w, w, w, w, w, w, w, w ], [ w, w, w, w, w, w, w, w, w ], [ w, w, w, w, w, w, w, w, w ], [ w, w, w, w, w, w, w, w, w ], [ w, w, m, w, w, w, m, w, w ] ]
      },
      t108: {
        objectives: [ {
          type: x,
          amount: 24
        } ],
        rewards: {
          star: 1,
          coin: 100
        },
        unlockedBoosters: {
          hammer: true
        },
        tutorialBoosters: {
          hammer: 3
        },
        turns: 24,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ O, y, g, y, r, g, r, b, O ], [ b, r, y, b, r, y, g, g, y ], [ x, x, x, x, x, x, x, x, x ], [ O, b, y, b, r, g, y, g, O ], [ O, O, O, x, x, x, O, O, O ], [ O, O, O, x, x, x, O, O, O ], [ O, O, O, x, x, x, O, O, O ], [ O, O, O, X, X, X, O, O, O ], [ O, O, O, X, X, X, O, O, O ] ]
      },
      t109: {
        objectives: [ {
          type: x,
          amount: 32
        }, {
          type: t,
          amount: 24
        } ],
        rewards: {
          star: 1,
          coin: 120
        },
        unlockedBoosters: {
          airplane: true
        },
        tutorialBoosters: {
          airplane: 3
        },
        turns: 24,
        spawnPattern: [ R, R, R, R, R, R, R, R ],
        pattern: [ [ y, b, g, y, b, g, r, b ], [ b, y, y, b, r, b, g, g ], [ x, x, x, x, x, x, x, x ], [ x, x, x, x, x, x, x, x ], [ t, t, t, t, t, t, t, t ], [ x, x, x, x, x, x, x, x ], [ x, x, x, x, x, x, x, x ], [ t, t, t, t, t, t, t, t ], [ t, t, t, t, t, t, t, t ] ]
      },
      t110: {
        objectives: [ {
          type: x,
          amount: 41
        }, {
          type: t,
          amount: 16
        } ],
        rewards: {
          star: 1,
          coin: 120
        },
        unlockedBoosters: {
          rocket: true
        },
        tutorialBoosters: {
          rocket: 3
        },
        turns: 24,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ x, x, x, x, x, x, x, x, x ], [ x, t, t, x, x, x, t, t, x ], [ x, t, t, x, x, x, t, t, x ], [ O, O, y, g, x, g, y, O, O ], [ O, O, y, b, x, y, g, O, O ], [ O, O, r, y, x, g, r, O, O ], [ x, t, t, x, x, x, t, t, x ], [ x, t, t, x, x, x, t, t, x ], [ x, x, x, x, x, x, x, x, x ] ]
      },
      t111: {
        objectives: [ {
          type: x,
          amount: 39
        }, {
          type: I,
          amount: 33
        } ],
        rewards: {
          star: 2,
          coin: 120
        },
        unlockedBoosters: {
          wheel: true
        },
        tutorialBoosters: {
          wheel: 3
        },
        turns: 28,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ O, H, H, x, g, x, H, H, O ], [ x, H, H, g, b, g, H, H, x ], [ x, x, g, g, b, g, g, x, x ], [ x, x, x, b, g, b, x, x, x ], [ x, x, x, x, g, x, x, x, x ], [ J, J, J, J, J, J, J, J, K ], [ x, x, x, x, x, x, x, x, x ], [ x, H, H, x, x, x, H, H, x ], [ O, H, H, x, x, x, H, H, O ] ]
      },
      t112: {
        objectives: [ {
          type: I,
          amount: 24
        }, {
          type: G,
          amount: 40
        }, {
          type: g,
          amount: 60
        } ],
        rewards: {
          star: 2,
          coin: 180
        },
        unlockedBoosters: {
          fairystick: true
        },
        tutorialBoosters: {
          fairystick: 3
        },
        turns: 25,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ O, O, g, b, g, b, g, O, O ], [ O, O, y, g, r, g, g, O, O ], [ G, H, H, r, b, r, H, H, G ], [ G, H, H, b, g, b, H, H, G ], [ G, r, b, g, g, r, g, r, G ], [ G, H, H, g, b, r, H, H, G ], [ G, H, H, r, g, b, H, H, G ], [ O, O, g, y, y, g, g, O, O ], [ O, O, G, G, G, G, G, O, O ] ]
      },
      t113: {
        objectives: [ {
          type: x,
          amount: 35
        }, {
          type: I,
          amount: 24
        } ],
        rewards: {
          star: 3,
          coin: 180
        },
        unlockedBoosters: {
          paintbrush: true
        },
        tutorialBoosters: {
          paintbrush: 3
        },
        turns: 26,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ O, O, x, b, x, x, x, O, O ], [ O, O, x, b, x, x, x, O, O ], [ H, H, x, r, b, b, x, H, H ], [ H, H, X, X, X, X, X, H, H ], [ H, H, X, X, X, X, X, H, H ], [ H, H, X, X, X, X, X, H, H ], [ O, O, z, z, z, z, z, O, O ], [ O, O, z, z, z, z, z, O, O ] ]
      },
      115: {
        objectives: [ {
          type: x,
          amount: 33
        }, {
          type: I,
          amount: 12
        }, {
          type: G,
          amount: 30
        } ],
        rewards: {
          star: 3,
          coin: 150
        },
        turns: 28,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ g, x, x, r, X, g, x, x, y ], [ g, x, x, b, X, g, x, x, g ], [ b, x, x, b, X, r, x, x, y ], [ g, x, x, r, X, g, x, x, r ], [ r, x, x, b, X, g, x, x, y ], [ b, x, O, O, O, O, O, x, y ], [ G, H, H, x, x, x, H, H, G ], [ G, H, H, x, x, x, H, H, G ], [ G, G, G, G, G, G, G, G, G ] ]
      },
      116: {
        objectives: [ {
          type: t,
          amount: 20
        }, {
          type: w,
          amount: 14
        }, {
          type: G,
          amount: 50
        } ],
        rewards: {
          star: 3,
          coin: 180
        },
        turns: 30,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ G, O, y, r, b, g, r, O, G ], [ G, O, y, b, r, b, b, O, G ], [ G, O, r, b, r, r, b, O, G ], [ G, O, t, t, t, t, t, O, G ], [ G, O, t, t, t, t, t, O, G ], [ G, O, t, t, t, t, t, O, G ], [ G, O, t, t, t, t, t, O, G ], [ G, w, w, w, w, w, w, w, G ], [ G, w, w, w, w, w, w, w, G ] ]
      },
      117: {
        objectives: [ {
          type: w,
          amount: 24
        }, {
          type: E,
          amount: 18
        }, {
          type: G,
          amount: 120
        }, {
          type: t,
          amount: 9
        } ],
        rewards: {
          star: 3,
          coin: 300
        },
        turns: 32,
        spawnPattern: [ T, T, T, T, T, T, T, T, T ],
        pattern: [ [ t, t, t, t, t, t, t, t, t ], [ y, b, g, b, b, y, b, y, y ], [ g, g, y, g, y, y, b, g, y ], [ G, w, G, w, G, w, G, w, G ], [ G, w, G, w, G, w, G, w, G ], [ G, w, G, w, G, w, G, w, G ], [ G, w, G, w, G, w, G, w, G ], [ G, w, G, w, G, w, G, w, G ], [ G, w, G, w, G, w, G, w, G ] ],
        underlayPattern: [ [ O, O, O, O, O, O, O, O, O ], [ E, E, E, E, E, E, E, E, E ], [ E, E, E, E, E, E, E, E, E ], [ O, O, O, O, O, O, O, O, O ], [ O, O, O, O, O, O, O, O, O ], [ O, O, O, O, O, O, O, O, O ], [ O, O, O, O, O, O, O, O, O ], [ O, O, O, O, O, O, O, O, O ], [ O, O, O, O, O, O, O, O, O ] ]
      },
      118: {
        objectives: [ {
          type: E,
          amount: 61
        }, {
          type: q,
          amount: 9
        }, {
          type: i,
          amount: 22
        } ],
        rewards: {
          star: 3,
          coin: 300
        },
        turns: 28,
        spawnPattern: [ T, T, T, T, T, T, T, T, T ],
        pattern: [ [ O, O, O, O, q, O, O, O, O ], [ O, O, O, y, q, b, O, O, O ], [ O, O, y, g, q, y, b, O, O ], [ O, i, g, y, q, g, y, i, O ], [ i, i, b, y, q, y, g, i, i ], [ i, i, p, b, q, p, p, i, i ], [ i, i, g, p, q, y, g, i, i ], [ i, i, y, g, q, y, p, i, i ], [ i, i, g, p, q, g, b, i, i ] ],
        underlayPattern: [ [ O, O, O, O, E, O, O, O, O ], [ O, O, O, E, E, E, O, O, O ], [ O, O, E, E, E, E, E, O, O ], [ O, E, E, E, E, E, E, E, O ], [ E, E, E, E, E, E, E, E, E ], [ E, E, E, E, E, E, E, E, E ], [ E, E, E, E, E, E, E, E, E ], [ E, E, E, E, E, E, E, E, E ], [ E, E, E, E, E, E, E, E, E ] ]
      },
      119: {
        objectives: [ {
          type: E,
          amount: 25
        }, {
          type: x,
          amount: 9
        }, {
          type: t,
          amount: 9
        } ],
        rewards: {
          star: 3,
          coin: 150
        },
        turns: 26,
        spawnPattern: [ T, T, T, T, T, T, T, T, T ],
        pattern: [ [ O, O, O, O, O, t, t, t, t ], [ O, O, O, O, O, t, y, b, t ], [ X, X, X, X, X, t, b, y, t ], [ X, X, X, X, X, t, y, b, t ], [ X, X, X, X, X, t, y, p, t ], [ X, X, X, X, X, t, p, g, t ], [ X, X, X, X, X, t, g, p, t ], [ O, O, O, O, O, t, g, g, t ], [ O, O, O, O, O, t, t, t, t ] ],
        underlayPattern: [ [ O, O, O, O, O, O, O, O, O ], [ O, O, O, O, O, O, O, O, O ], [ F, F, F, F, F, O, O, O, O ], [ F, F, F, F, F, O, O, O, O ], [ F, F, F, F, F, O, O, O, O ], [ F, F, F, F, F, O, O, O, O ], [ F, F, F, F, F, O, O, O, O ], [ O, O, O, O, O, O, O, O, O ], [ O, O, O, O, O, O, O, O, O ] ]
      },
      120: {
        objectives: [ {
          type: V,
          amount: 36
        }, {
          type: x,
          amount: 16
        } ],
        rewards: {
          star: 3,
          coin: 300
        },
        turns: 30,
        spawnPattern: [ R, R, R, R, R, R, R, R ],
        pattern: [ [ O, y, y, r, y, r, r, O ], [ x, x, x, x, x, x, x, x ], [ x, x, x, x, x, x, x, x ], [ O, L, N, L, N, L, N, O ], [ O, P, Q, P, Q, P, Q, O ], [ O, L, N, L, N, L, N, O ], [ O, P, Q, P, Q, P, Q, O ], [ O, L, N, L, N, L, N, O ], [ O, P, Q, P, Q, P, Q, O ] ]
      },
      121: {
        objectives: [ {
          type: E,
          amount: 45
        }, {
          type: I,
          amount: 48
        } ],
        rewards: {
          star: 3,
          coin: 150
        },
        turns: 34,
        spawnPattern: [ T, T, T, T, T, T, T, T, T ],
        pattern: [ [ O, y, O, g, O, b, O, b, O ], [ O, g, O, y, O, p, O, b, O ], [ O, g, O, y, O, g, O, p, O ], [ g, b, O, p, O, g, O, b, p ], [ b, g, b, y, b, b, p, p, y ], [ H, H, H, H, p, H, H, H, H ], [ H, H, H, H, y, H, H, H, H ], [ H, H, H, H, y, H, H, H, H ], [ H, H, H, H, g, H, H, H, H ] ],
        underlayPattern: [ [ O, O, O, O, O, O, O, O, O ], [ O, O, O, O, O, O, O, O, O ], [ O, O, O, O, O, O, O, O, O ], [ O, O, O, O, O, O, O, O, O ], [ E, E, E, E, E, E, E, E, E ], [ E, E, E, E, E, E, E, E, E ], [ E, E, E, E, E, E, E, E, E ], [ E, E, E, E, E, E, E, E, E ], [ E, E, E, E, E, E, E, E, E ] ]
      },
      122: {
        objectives: [ {
          type: E,
          amount: 30
        }, {
          type: I,
          amount: 24
        }, {
          type: x,
          amount: 27
        } ],
        rewards: {
          star: 3,
          coin: 150
        },
        turns: 34,
        spawnPattern: [ T, T, T, T, T, T, T, T, T ],
        pattern: [ [ O, O, X, y, y, g, X, O, O ], [ H, H, X, g, g, b, X, H, H ], [ H, H, X, y, y, b, X, H, H ], [ O, O, X, p, g, p, X, O, O ], [ O, O, X, b, p, g, X, O, O ], [ O, O, X, b, g, y, X, O, O ], [ H, H, X, X, X, X, X, H, H ], [ H, H, X, X, X, X, X, H, H ], [ O, O, X, X, X, X, X, O, O ] ],
        underlayPattern: [ [ O, O, E, E, E, E, E, O, O ], [ O, O, E, E, E, E, E, O, O ], [ O, O, E, E, E, E, E, O, O ], [ O, O, O, O, O, O, O, O, O ], [ O, O, O, O, O, O, O, O, O ], [ O, O, O, O, O, O, O, O, O ], [ O, O, E, E, E, E, E, O, O ], [ O, O, E, E, E, E, E, O, O ], [ O, O, E, E, E, E, E, O, O ] ]
      },
      123: {
        objectives: [ {
          type: E,
          amount: 30
        }, {
          type: I,
          amount: 36
        }, {
          type: w,
          amount: 17
        } ],
        rewards: {
          star: 3,
          coin: 300
        },
        turns: 36,
        spawnPattern: [ T, T, T, T, T, T, T, T, T ],
        pattern: [ [ O, O, g, y, y, g, y, O, O ], [ O, O, b, b, g, b, g, O, O ], [ O, O, g, g, b, g, p, O, O ], [ O, O, p, g, b, p, p, O, O ], [ H, H, w, w, w, w, w, H, H ], [ H, H, w, w, w, w, w, H, H ], [ H, H, w, w, w, w, w, H, H ], [ H, H, H, H, w, H, H, H, H ], [ O, O, H, H, w, H, H, O, O ] ],
        underlayPattern: [ [ O, O, F, F, F, F, F, O, O ], [ O, O, F, F, F, F, F, O, O ], [ O, O, F, F, F, F, F, O, O ], [ O, O, F, F, F, F, F, O, O ], [ O, O, F, F, F, F, F, O, O ], [ O, O, F, F, F, F, F, O, O ], [ O, O, F, F, F, F, F, O, O ], [ O, O, O, O, F, O, O, O, O ], [ O, O, O, O, F, O, O, O, O ] ]
      },
      124: {
        objectives: [ {
          type: E,
          amount: 32
        }, {
          type: t,
          amount: 32
        }, {
          type: x,
          amount: 16
        }, {
          type: I,
          amount: 9
        }, {
          type: G,
          amount: 50
        } ],
        rewards: {
          star: 3,
          coin: 300
        },
        turns: 35,
        spawnPattern: [ T, T, T, T, T, T, T, T, T ],
        pattern: [ [ y, g, y, y, G, t, t, t, t ], [ b, y, g, y, G, t, t, t, t ], [ g, y, p, g, G, t, t, t, t ], [ b, b, y, g, G, t, t, t, t ], [ J, J, J, J, J, J, J, J, K ], [ t, t, t, t, G, X, X, X, X ], [ t, t, t, t, G, X, X, X, X ], [ t, t, t, t, G, X, X, X, X ], [ t, t, t, t, G, X, X, X, X ] ],
        underlayPattern: [ [ O, O, O, O, O, E, E, E, E ], [ O, O, O, O, O, E, E, E, E ], [ O, O, O, O, O, E, E, E, E ], [ O, O, O, O, O, E, E, E, E ], [ O, O, O, O, O, O, O, O, O ], [ E, E, E, E, O, O, O, O, O ], [ E, E, E, E, O, O, O, O, O ], [ E, E, E, E, O, O, O, O, O ], [ E, E, E, E, O, O, O, O, O ] ]
      },
      125: {
        objectives: [ {
          type: V,
          amount: 32
        }, {
          type: x,
          amount: 35
        }, {
          type: E,
          amount: 32
        } ],
        rewards: {
          star: 3,
          coin: 300
        },
        turns: 35,
        spawnPattern: [ T, T, T, T, T, T, T, T, T ],
        pattern: [ [ P, N, x, p, y, p, x, P, N ], [ S, Q, x, y, p, y, x, S, Q ], [ P, N, x, p, y, p, x, P, N ], [ S, Q, x, y, p, y, x, S, Q ], [ O, x, x, x, x, x, x, x, O ], [ P, N, x, x, x, x, x, P, N ], [ S, Q, X, X, X, X, X, S, Q ], [ P, N, X, X, X, X, X, P, N ], [ S, Q, X, X, X, X, X, S, Q ] ],
        underlayPattern: [ [ E, E, O, O, O, O, O, E, E ], [ E, E, O, O, O, O, O, E, E ], [ E, E, O, O, O, O, O, E, E ], [ E, E, O, O, O, O, O, E, E ], [ O, O, O, O, O, O, O, O, O ], [ E, E, O, O, O, O, O, E, E ], [ E, E, O, O, O, O, O, E, E ], [ E, E, O, O, O, O, O, E, E ], [ E, E, O, O, O, O, O, E, E ] ]
      },
      126: {
        objectives: [ {
          type: i,
          amount: 15
        }, {
          type: e,
          amount: 15
        }, {
          type: I,
          amount: 36
        }, {
          type: E,
          amount: 24
        } ],
        rewards: {
          star: 3,
          coin: 300
        },
        turns: 35,
        spawnPattern: [ T, T, T, T, T, T, T, T, T ],
        pattern: [ [ O, O, O, g, y, g, O, O, O ], [ O, O, g, y, g, y, g, O, O ], [ O, g, y, g, y, y, g, g, O ], [ H, H, j, j, j, j, j, H, H ], [ H, H, j, j, j, j, j, H, H ], [ H, H, j, j, j, j, j, H, H ], [ H, H, f, f, f, f, f, H, H ], [ H, H, f, f, f, f, f, H, H ], [ H, H, f, f, f, f, f, H, H ] ],
        underlayPattern: [ [ O, O, O, O, O, O, O, O, O ], [ O, O, O, O, O, O, O, O, O ], [ O, O, O, O, O, O, O, O, O ], [ E, E, O, O, O, O, O, E, E ], [ E, E, O, O, O, O, O, E, E ], [ E, E, O, O, O, O, O, E, E ], [ E, E, O, O, O, O, O, E, E ], [ E, E, O, O, O, O, O, E, E ], [ E, E, O, O, O, O, O, E, E ] ]
      },
      127: {
        objectives: [ {
          type: t,
          amount: 12
        }, {
          type: x,
          amount: 27
        }, {
          type: G,
          amount: 30
        }, {
          type: I,
          amount: 9
        } ],
        rewards: {
          star: 3,
          coin: 300
        },
        turns: 34,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ t, t, g, r, b, g, b, t, t ], [ t, t, y, b, r, b, y, t, t ], [ t, t, y, b, y, y, b, t, t ], [ J, J, J, J, J, J, J, J, K ], [ X, X, X, X, X, X, X, X, X ], [ X, X, X, X, X, X, X, X, X ], [ X, X, X, X, X, X, X, X, X ], [ O, O, O, O, O, O, O, O, O ], [ G, G, G, G, G, G, G, G, G ] ]
      },
      128: {
        objectives: [ {
          type: V,
          amount: 16
        }, {
          type: t,
          amount: 20
        }, {
          type: I,
          amount: 24
        }, {
          type: E,
          amount: 39
        } ],
        rewards: {
          star: 3,
          coin: 300
        },
        turns: 30,
        spawnPattern: [ T, T, T, T, T, T, T, T, T ],
        pattern: [ [ N, Q, O, O, O, O, O, N, Q ], [ Q, N, t, t, t, t, t, Q, N ], [ H, H, t, t, t, t, t, H, H ], [ H, H, y, b, y, y, b, H, H ], [ t, t, b, g, b, p, p, t, t ], [ H, H, g, y, g, g, b, H, H ], [ H, H, t, t, t, t, t, H, H ], [ N, Q, t, t, t, t, t, N, Q ], [ Q, N, O, O, O, O, O, Q, N ] ],
        underlayPattern: [ [ O, O, O, O, O, O, O, O, O ], [ O, O, E, E, E, E, E, O, O ], [ O, O, E, E, E, E, E, O, O ], [ O, O, E, E, E, E, E, O, O ], [ E, E, E, E, E, E, E, E, E ], [ O, O, E, E, E, E, E, O, O ], [ O, O, E, E, E, E, E, O, O ], [ O, O, E, E, E, E, E, O, O ], [ O, O, O, O, O, O, O, O, O ] ]
      },
      129: {
        objectives: [ {
          type: V,
          amount: 16
        }, {
          type: t,
          amount: 20
        }, {
          type: I,
          amount: 24
        }, {
          type: E,
          amount: 39
        } ],
        rewards: {
          star: 3,
          coin: 150
        },
        turns: 25,
        spawnPattern: [ T, T, T, T, T, T, T, T, T ],
        pattern: [ [ N, Q, O, O, O, O, O, N, Q ], [ Q, N, t, t, t, t, t, Q, N ], [ H, H, t, t, t, t, t, H, H ], [ H, H, y, b, y, y, b, H, H ], [ t, t, b, g, b, p, p, t, t ], [ H, H, g, y, g, g, b, H, H ], [ H, H, t, t, t, t, t, H, H ], [ N, Q, t, t, t, t, t, N, Q ], [ Q, N, O, O, O, O, O, Q, N ] ],
        underlayPattern: [ [ O, O, O, O, O, O, O, O, O ], [ O, O, E, E, E, E, E, O, O ], [ O, O, E, E, E, E, E, O, O ], [ O, O, E, E, E, E, E, O, O ], [ E, E, E, E, E, E, E, E, E ], [ O, O, E, E, E, E, E, O, O ], [ O, O, E, E, E, E, E, O, O ], [ O, O, E, E, E, E, E, O, O ], [ O, O, O, O, O, O, O, O, O ] ]
      },
      130: {
        objectives: [ {
          type: t,
          amount: 61
        }, {
          type: E,
          amount: 61
        }, {
          type: I,
          amount: 12
        } ],
        rewards: {
          star: 3,
          coin: 400
        },
        turns: 28,
        spawnPattern: [ T, T, T, T, T, T, T, T, T ],
        pattern: [ [ t, t, t, t, t, t, t, t, t ], [ t, t, t, t, t, t, t, t, t ], [ t, t, t, t, t, t, t, t, t ], [ t, t, t, t, t, t, t, t, t ], [ t, t, t, t, t, t, t, t, t ], [ t, t, t, t, O, t, t, t, t ], [ t, t, t, t, O, t, t, t, t ], [ H, H, H, H, O, y, g, y, y ], [ H, H, H, H, O, b, y, g, g ] ],
        underlayPattern: [ [ F, F, F, F, F, F, F, F, F ], [ F, F, F, F, F, F, F, F, F ], [ F, F, F, F, F, F, F, F, F ], [ F, F, F, F, F, F, F, F, F ], [ F, F, F, F, F, F, F, F, F ], [ F, F, F, F, O, F, F, F, F ], [ F, F, F, F, O, F, F, F, F ], [ O, O, O, O, O, O, O, O, O ], [ O, O, O, O, O, O, O, O, O ] ]
      },
      131: {
        objectives: [ {
          type: t,
          amount: 20
        }, {
          type: x,
          amount: 9
        }, {
          type: w,
          amount: 20
        }, {
          type: V,
          amount: 16
        } ],
        rewards: {
          star: 3,
          coin: 400
        },
        turns: 25,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ r, y, r, r, t, t, t, t, t ], [ y, r, y, y, t, t, t, t, t ], [ r, y, r, r, t, t, t, t, t ], [ r, y, y, r, t, t, t, t, t ], [ w, w, w, w, z, z, z, z, z ], [ w, w, w, w, z, L, N, L, N ], [ w, w, w, w, z, N, L, N, L ], [ w, w, w, w, z, L, N, L, N ], [ w, w, w, w, z, N, L, N, L ] ]
      },
      132: {
        objectives: [ {
          type: I,
          amount: 53
        }, {
          type: x,
          amount: 20
        }, {
          type: E,
          amount: 36
        } ],
        rewards: {
          star: 3,
          coin: 400
        },
        turns: 30,
        spawnPattern: [ T, T, T, T, T, T, T, T, T ],
        pattern: [ [ H, H, y, g, y, b, p, H, H ], [ H, H, g, y, b, p, p, H, H ], [ H, H, p, g, g, b, g, H, H ], [ H, H, g, g, y, g, y, H, H ], [ O, O, J, J, J, J, K, O, O ], [ H, H, z, z, z, z, z, H, H ], [ H, H, x, x, x, x, x, H, H ], [ H, H, x, x, x, x, x, H, H ], [ H, H, x, x, x, x, x, H, H ] ],
        underlayPattern: [ [ E, E, E, E, E, E, E, E, E ], [ E, E, E, E, E, E, E, E, E ], [ E, E, E, E, E, E, E, E, E ], [ E, E, E, E, E, E, E, E, E ], [ O, O, O, O, O, O, O, O, O ], [ O, O, O, O, O, O, O, O, O ], [ O, O, O, O, O, O, O, O, O ], [ O, O, O, O, O, O, O, O, O ], [ O, O, O, O, O, O, O, O, O ] ]
      },
      133: {
        objectives: [ {
          type: x,
          amount: 38
        }, {
          type: E,
          amount: 25
        }, {
          type: I,
          amount: 9
        } ],
        rewards: {
          star: 3,
          coin: 400
        },
        turns: 26,
        spawnPattern: [ T, T, T, T, T, T, T, T, T ],
        pattern: [ [ y, g, y, y, p, g, p, b, y ], [ g, y, g, g, b, p, b, p, b ], [ x, x, x, x, x, x, x, x, x ], [ x, x, z, z, z, z, z, x, x ], [ x, x, z, J, J, K, z, x, x ], [ x, x, z, J, J, K, z, x, x ], [ x, x, z, J, J, K, z, x, x ], [ x, x, z, z, z, z, z, x, x ], [ x, x, x, x, x, x, x, x, x ] ],
        underlayPattern: [ [ O, O, O, O, O, O, O, O, O ], [ O, O, O, O, O, O, O, O, O ], [ O, O, O, O, O, O, O, O, O ], [ O, O, E, E, E, E, E, O, O ], [ O, O, E, E, E, E, E, O, O ], [ O, O, E, E, E, E, E, O, O ], [ O, O, E, E, E, E, E, O, O ], [ O, O, E, E, E, E, E, O, O ], [ O, O, O, O, O, O, O, O, O ] ]
      },
      134: {
        objectives: [ {
          type: x,
          amount: 39
        }, {
          type: E,
          amount: 30
        } ],
        rewards: {
          star: 3,
          coin: 150
        },
        turns: 28,
        spawnPattern: [ T, T, T, T, T, T, T, T, T ],
        pattern: [ [ O, O, g, g, b, g, g, O, O ], [ O, O, O, O, g, O, O, O, O ], [ O, O, O, O, g, O, O, O, O ], [ z, z, x, b, x, b, x, z, z ], [ z, z, b, x, b, x, b, z, z ], [ z, z, x, b, x, b, x, z, z ], [ z, z, b, x, b, x, b, z, z ], [ z, z, x, b, x, b, x, z, z ], [ z, z, b, x, b, x, b, z, z ] ],
        underlayPattern: [ [ O, O, O, O, O, O, O, O, O ], [ O, O, O, O, O, O, O, O, O ], [ O, O, O, O, O, O, O, O, O ], [ O, O, E, E, E, E, E, O, O ], [ O, O, E, E, E, E, E, O, O ], [ O, O, E, E, E, E, E, O, O ], [ O, O, E, E, E, E, E, O, O ], [ O, O, E, E, E, E, E, O, O ], [ O, O, E, E, E, E, E, O, O ] ]
      },
      135: {
        objectives: [ {
          type: t,
          amount: 18
        }, {
          type: x,
          amount: 16
        }, {
          type: I,
          amount: 30
        }, {
          type: E,
          amount: 27
        } ],
        rewards: {
          star: 3,
          coin: 400
        },
        turns: 26,
        spawnPattern: [ T, T, T, T, T, T, T, T, T ],
        pattern: [ [ y, t, t, O, O, O, O, O, O ], [ y, t, t, X, X, O, O, O, O ], [ b, t, t, X, X, O, O, O, O ], [ y, t, t, X, X, H, H, O, O ], [ y, t, t, X, X, H, H, O, O ], [ g, t, t, X, X, H, H, H, H ], [ y, t, t, X, X, H, H, H, H ], [ g, t, t, X, X, H, H, H, H ], [ g, t, t, X, X, H, H, H, H ] ],
        underlayPattern: [ [ E, E, E, O, O, O, O, O, O ], [ E, E, E, O, O, O, O, O, O ], [ E, E, E, O, O, O, O, O, O ], [ E, E, E, O, O, O, O, O, O ], [ E, E, E, O, O, O, O, O, O ], [ E, E, E, O, O, O, O, O, O ], [ E, E, E, O, O, O, O, O, O ], [ E, E, E, O, O, O, O, O, O ], [ E, E, E, O, O, O, O, O, O ] ]
      },
      136: {
        objectives: [ {
          type: x,
          amount: 36
        }, {
          type: G,
          amount: 60
        } ],
        rewards: {
          star: 3,
          coin: 400
        },
        turns: 26,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ O, O, O, O, G, g, b, g, g ], [ O, O, O, G, x, r, g, b, y ], [ O, O, G, x, x, y, b, y, y ], [ O, G, x, x, x, r, b, r, r ], [ G, x, x, x, x, x, x, x, x ], [ O, G, x, x, x, x, x, x, x ], [ O, O, G, x, x, x, x, x, x ], [ O, O, O, G, x, x, x, x, x ], [ O, O, O, O, G, x, x, x, x ] ]
      },
      137: {
        objectives: [ {
          type: t,
          amount: 32
        }, {
          type: I,
          amount: 24
        }, {
          type: G,
          amount: 40
        } ],
        rewards: {
          star: 3,
          coin: 400
        },
        turns: 26,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ G, b, y, r, g, g, b, g, r ], [ G, y, g, y, y, r, g, b, g ], [ G, J, J, J, J, J, J, J, K ], [ G, t, t, t, t, t, t, t, t ], [ G, t, t, t, t, t, t, t, t ], [ G, J, J, J, J, J, J, J, K ], [ G, t, t, t, t, t, t, t, t ], [ G, t, t, t, t, t, t, t, t ], [ G, J, J, J, J, J, J, J, K ] ]
      },
      138: {
        objectives: [ {
          type: t,
          amount: 16
        }, {
          type: x,
          amount: 16
        }, {
          type: I,
          amount: 9
        }, {
          type: E,
          amount: 32
        }, {
          type: G,
          amount: 40
        } ],
        rewards: {
          star: 3,
          coin: 400
        },
        turns: 32,
        spawnPattern: [ T, T, T, T, T, T, T, T, T ],
        pattern: [ [ y, g, y, y, O, t, t, t, t ], [ b, b, g, b, O, t, t, t, t ], [ p, g, y, b, O, t, t, t, t ], [ y, y, p, y, O, t, t, t, t ], [ J, J, J, J, J, J, J, J, K ], [ x, x, x, x, O, G, G, G, G ], [ x, x, x, x, O, G, G, G, G ], [ x, x, x, x, O, G, G, G, G ], [ x, x, x, x, O, G, G, G, G ] ],
        underlayPattern: [ [ O, O, O, O, O, E, E, E, E ], [ O, O, O, O, O, E, E, E, E ], [ O, O, O, O, O, E, E, E, E ], [ O, O, O, O, O, E, E, E, E ], [ O, O, O, O, O, O, O, O, O ], [ E, E, E, E, O, O, O, O, O ], [ E, E, E, E, O, O, O, O, O ], [ E, E, E, E, O, O, O, O, O ], [ E, E, E, E, O, O, O, O, O ] ]
      },
      139: {
        objectives: [ {
          type: t,
          amount: 24
        }, {
          type: x,
          amount: 36
        }, {
          type: E,
          amount: 36
        }, {
          type: G,
          amount: 30
        } ],
        rewards: {
          star: 3,
          coin: 400
        },
        turns: 30,
        spawnPattern: [ T, T, T, T, T, T, T, T, T ],
        pattern: [ [ x, x, x, x, G, p, g, b, y ], [ x, x, x, x, G, g, y, g, b ], [ x, x, x, x, G, y, g, b, y ], [ x, x, x, x, G, t, t, t, t ], [ x, x, x, x, G, t, t, t, t ], [ x, x, x, x, G, t, t, t, t ], [ x, x, x, x, G, t, t, t, t ], [ x, x, x, x, G, t, t, t, t ], [ x, x, x, x, G, t, t, t, t ] ],
        underlayPattern: [ [ E, E, E, E, O, O, O, O, O ], [ E, E, E, E, O, O, O, O, O ], [ E, E, E, E, O, O, O, O, O ], [ E, E, E, E, O, O, O, O, O ], [ E, E, E, E, O, O, O, O, O ], [ E, E, E, E, O, O, O, O, O ], [ E, E, E, E, O, O, O, O, O ], [ E, E, E, E, O, O, O, O, O ], [ E, E, E, E, O, O, O, O, O ] ]
      },
      140: {
        objectives: [ {
          type: x,
          amount: 49
        }, {
          type: E,
          amount: 65
        } ],
        rewards: {
          star: 3,
          coin: 400
        },
        turns: 24,
        spawnPattern: [ T, T, T, T, T, T, T, T, T ],
        pattern: [ [ O, O, y, y, g, y, g, O, O ], [ O, O, g, b, p, b, p, O, O ], [ z, X, x, b, b, p, x, X, z ], [ z, X, x, y, b, y, x, X, z ], [ z, X, x, x, x, x, x, X, z ], [ z, X, x, x, x, x, x, X, z ], [ z, X, x, x, x, x, x, X, z ], [ O, O, X, X, X, X, X, O, O ], [ O, O, z, z, z, z, z, O, O ] ],
        underlayPattern: [ [ O, O, E, E, E, E, E, O, O ], [ O, O, E, E, E, E, E, O, O ], [ E, E, E, E, E, E, E, E, E ], [ E, E, E, E, E, E, E, E, E ], [ E, E, E, E, E, E, E, E, E ], [ E, E, E, E, E, E, E, E, E ], [ E, E, E, E, E, E, E, E, E ], [ O, O, E, E, E, E, E, O, O ], [ O, O, E, E, E, E, E, O, O ] ]
      },
      141: {
        objectives: [ {
          type: x,
          amount: 12
        }, {
          type: I,
          amount: 60
        }, {
          type: V,
          amount: 4
        } ],
        rewards: {
          star: 3,
          coin: 500
        },
        turns: 26,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ O, O, x, g, y, g, x, O, O ], [ O, x, x, y, g, y, x, x, O ], [ x, x, x, g, y, g, x, x, x ], [ O, H, H, H, H, H, H, H, H ], [ O, H, H, H, H, H, H, H, H ], [ O, O, H, H, L, L, H, H, O ], [ O, O, H, H, N, N, H, H, O ], [ O, H, H, H, H, H, H, H, H ], [ O, H, H, H, H, H, H, H, H ] ]
      },
      142: {
        objectives: [ {
          type: E,
          amount: 56
        } ],
        rewards: {
          star: 3,
          coin: 500
        },
        turns: 28,
        spawnPattern: [ T, T, T, T, T, T, T, T, T ],
        pattern: [ [ q, q, q, y, b, y, q, q, q ], [ q, l, i, b, y, b, i, l, q ], [ q, l, i, y, g, y, i, l, q ], [ q, l, i, g, b, g, i, l, q ], [ q, l, i, e, e, e, i, l, q ], [ q, l, i, e, e, e, i, l, q ], [ q, l, i, i, i, i, i, l, q ], [ q, l, l, l, l, l, l, l, q ], [ q, q, q, q, q, q, q, q, q ] ],
        underlayPattern: [ [ F, F, F, F, F, F, F, F, F ], [ F, E, E, E, E, E, E, E, F ], [ F, E, O, O, O, O, O, E, F ], [ F, E, O, O, O, O, O, E, F ], [ F, E, O, O, O, O, O, E, F ], [ F, E, O, O, O, O, O, E, F ], [ F, E, O, O, O, O, O, E, F ], [ F, E, E, E, E, E, E, E, F ], [ F, F, F, F, F, F, F, F, F ] ]
      },
      143: {
        objectives: [ {
          type: t,
          amount: 10
        }, {
          type: w,
          amount: 27
        }, {
          type: G,
          amount: 30
        } ],
        rewards: {
          star: 3,
          coin: 500
        },
        turns: 28,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ G, O, p, r, p, p, r, O, G ], [ G, O, y, p, y, y, b, O, G ], [ G, O, t, t, t, t, t, O, G ], [ G, O, t, t, t, t, t, O, G ], [ G, O, w, w, w, w, w, O, G ], [ G, O, w, w, w, w, w, O, G ], [ G, O, w, w, w, w, w, O, G ], [ G, O, w, w, w, w, w, O, G ], [ G, C, C, C, C, C, C, C, G ] ]
      },
      144: {
        objectives: [ {
          type: x,
          amount: 30
        }, {
          type: I,
          amount: 48
        }, {
          type: E,
          amount: 32
        } ],
        rewards: {
          star: 3,
          coin: 500
        },
        turns: 34,
        spawnPattern: [ T, T, T, T, T, T, T, T, T ],
        pattern: [ [ H, H, g, p, g, b, b, H, H ], [ H, H, p, g, b, g, g, H, H ], [ H, H, x, x, x, x, x, H, H ], [ H, H, x, x, x, x, x, H, H ], [ H, H, x, x, x, x, x, H, H ], [ H, H, X, X, X, X, X, H, H ], [ H, H, X, X, X, X, X, H, H ], [ H, H, z, z, z, z, z, H, H ] ],
        underlayPattern: [ [ F, E, O, O, O, O, O, E, F ], [ F, E, O, O, O, O, O, E, F ], [ F, E, O, O, O, O, O, E, F ], [ F, E, O, O, O, O, O, E, F ], [ F, E, O, O, O, O, O, E, F ], [ F, E, O, O, O, O, O, E, F ], [ F, E, O, O, O, O, O, E, F ], [ F, E, O, O, O, O, O, E, F ] ]
      },
      145: {
        objectives: [ {
          type: w,
          amount: 36
        }, {
          type: I,
          amount: 24
        }, {
          type: E,
          amount: 52
        } ],
        rewards: {
          star: 3,
          coin: 500
        },
        turns: 33,
        spawnPattern: [ T, T, T, T, T, T, T, T, T ],
        pattern: [ [ w, w, g, p, g, p, p, w, w ], [ w, w, p, g, b, y, g, w, w ], [ w, w, b, g, b, b, y, w, w ], [ w, w, g, b, g, g, y, w, w ], [ C, C, C, C, C, C, C, C, C ], [ C, C, C, C, C, C, C, C, C ], [ H, H, H, H, C, H, H, H, H ], [ H, H, H, H, C, H, H, H, H ] ],
        underlayPattern: [ [ E, E, O, O, O, O, O, E, E ], [ E, E, O, O, O, O, O, E, E ], [ E, E, O, O, O, O, O, E, E ], [ E, E, O, O, O, O, O, E, E ], [ E, E, E, E, E, E, E, E, E ], [ E, E, E, E, E, E, E, E, E ], [ E, E, E, E, E, E, E, E, E ], [ E, E, E, E, E, E, E, E, E ] ]
      }
    };
    var _default = levels;
    exports["default"] = _default;
    cc._RF.pop();
  }, {
    "./types.js": "types"
  } ],
  powerUpItem: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d9bf1Fg+ztE2aoSEfW3M95C", "powerUpItem");
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var _default = {
      bomb: {
        unlockedLevel: 3
      },
      discoball: {
        unlockedLevel: 5
      },
      missiles1: {
        unlockedLevel: 2
      },
      missiles2: {
        unlockedLevel: 2
      },
      sniper: {
        unlockedLevel: 4
      }
    };
    exports["default"] = _default;
    module.exports = exports["default"];
    cc._RF.pop();
  }, {} ],
  shop: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a5d3etgZOlFU7ShfHXc6QKS", "shop");
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var _boosters = _interopRequireDefault(require("./boosters"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var _default = {
      fish: {
        id: "fish",
        type: "catFood",
        name: "Fish x5",
        quantity: 5,
        price: 5,
        description: "A few fish"
      },
      fish5: {
        id: "fish5",
        type: "catFood",
        name: "Fish x10",
        quantity: 10,
        price: 10,
        description: "A pack of fish"
      },
      fish10: {
        id: "fish10",
        type: "catFood",
        name: "Fish x100",
        quantity: 100,
        price: 100,
        description: "A bunch of fish"
      },
      hammer: {
        id: "hammer",
        type: "booster",
        name: _boosters["default"].hammer.name,
        quantity: 1,
        price: 400,
        description: _boosters["default"].hammer.description
      },
      airplane: {
        id: "airplane",
        type: "booster",
        name: _boosters["default"].airplane.name,
        quantity: 1,
        price: 800,
        description: _boosters["default"].airplane.description
      },
      rocket: {
        id: "rocket",
        type: "booster",
        name: _boosters["default"].rocket.name,
        quantity: 1,
        price: 800,
        description: _boosters["default"].rocket.description
      },
      wheel: {
        id: "wheel",
        type: "booster",
        name: _boosters["default"].wheel.name,
        quantity: 1,
        price: 200,
        description: _boosters["default"].wheel.description
      },
      fairystick: {
        id: "fairystick",
        type: "booster",
        name: _boosters["default"].fairystick.name,
        quantity: 1,
        price: 800,
        description: _boosters["default"].fairystick.description
      },
      paintbrush: {
        id: "paintbrush",
        type: "booster",
        name: _boosters["default"].paintbrush.name,
        quantity: 1,
        price: 400,
        description: _boosters["default"].paintbrush.description
      }
    };
    exports["default"] = _default;
    module.exports = exports["default"];
    cc._RF.pop();
  }, {
    "./boosters": "boosters"
  } ],
  simpleCrate: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fa738Oak3FPYJNDVjkJX82x", "simpleCrate");
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var _constants = _interopRequireDefault(require("../../constants.js"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var _constants$GAMEPLAY = _constants["default"].GAMEPLAY, Z_INDEX = _constants$GAMEPLAY.Z_INDEX, ITEM_SCALE = _constants$GAMEPLAY.ITEM_SCALE;
    var SHAKE_DURATION = 300;
    var COLOR_SENSITIVITY = {
      Red: ":basic1",
      Yellow: ":basic2",
      Green: ":basic3",
      Blue: ":basic4",
      Purple: ":basic5",
      Brick: null
    };
    var EXPLOSION_SKIN = {
      crateRed1: "redbox",
      crateRed2: "redbox",
      crateRed3: "redbox",
      crateGreen1: "greenbox",
      crateGreen2: "greenbox",
      crateGreen3: "greenbox",
      crateBlue1: "bluebox",
      crateBlue2: "bluebox",
      crateBlue3: "bluebox",
      crateYellow1: "yellowbox",
      crateYellow2: "yellowbox",
      crateYellow3: "yellowbox",
      cratePurple1: "purplebox",
      cratePurple2: "purplebox",
      cratePurple3: "purplebox",
      crateBrown1: "woodbox",
      crateBrown2: "woodbox",
      crateBrown3: "woodbox"
    };
    var simpleCrate = {
      properties: {
        crateShadow: {
          default: null,
          type: cc.SpriteFrame
        },
        crateBrown1: {
          default: null,
          type: cc.SpriteFrame
        },
        crateBrown2: {
          default: null,
          type: cc.SpriteFrame
        },
        crateBrown3: {
          default: null,
          type: cc.SpriteFrame
        },
        crateRed1: {
          default: null,
          type: cc.SpriteFrame
        },
        crateRed2: {
          default: null,
          type: cc.SpriteFrame
        },
        crateRed3: {
          default: null,
          type: cc.SpriteFrame
        },
        crateYellow1: {
          default: null,
          type: cc.SpriteFrame
        },
        crateYellow2: {
          default: null,
          type: cc.SpriteFrame
        },
        crateYellow3: {
          default: null,
          type: cc.SpriteFrame
        },
        crateGreen1: {
          default: null,
          type: cc.SpriteFrame
        },
        crateGreen2: {
          default: null,
          type: cc.SpriteFrame
        },
        crateGreen3: {
          default: null,
          type: cc.SpriteFrame
        },
        crateBlue1: {
          default: null,
          type: cc.SpriteFrame
        },
        crateBlue2: {
          default: null,
          type: cc.SpriteFrame
        },
        crateBlue3: {
          default: null,
          type: cc.SpriteFrame
        },
        cratePurple1: {
          default: null,
          type: cc.SpriteFrame
        },
        cratePurple2: {
          default: null,
          type: cc.SpriteFrame
        },
        cratePurple3: {
          default: null,
          type: cc.SpriteFrame
        },
        crateBrick1: {
          default: null,
          type: cc.SpriteFrame
        },
        crateBrick2: {
          default: null,
          type: cc.SpriteFrame
        },
        crateExplosionFX: {
          default: null,
          type: cc.Prefab
        }
      },
      is: function is(type) {
        return "crateBrown1" === type || "crateBrown2" === type || "crateBrown3" === type || "crateRed1" === type || "crateRed2" === type || "crateRed3" === type || "crateYellow1" === type || "crateYellow2" === type || "crateYellow3" === type || "crateGreen1" === type || "crateGreen2" === type || "crateGreen3" === type || "crateBlue1" === type || "crateBlue2" === type || "crateBlue3" === type || "cratePurple1" === type || "cratePurple2" === type || "cratePurple3" === type || "crateBrick1" === type || "crateBrick2" === type;
      },
      init: function init(that, options) {
        var _that$objectiveTypes;
        that.isBlockingCascade = true;
        that.isSensitive = true;
        that.node.zIndex = Z_INDEX.BLOCKER_ITEM;
        var type = options.type;
        var color = type.substring(5, type.length - 1);
        that.simpleCrateData = {
          color: color
        };
        that._addLayers({
          shadow: that.crateShadow
        });
        switch (type) {
         case "crate" + color + "1":
          that._addLayers({
            1: that["crate" + color + "1"]
          });
          that.currentLayerId = "1";
          break;

         case "crate" + color + "2":
          that.lifePoints = 2;
          that._addLayers({
            1: that["crate" + color + "1"],
            2: that["crate" + color + "2"]
          });
          that.layers["1"].active = false;
          that.currentLayerId = "2";
          break;

         case "crate" + color + "3":
          that.lifePoints = 3;
          that._addLayers({
            1: that["crate" + color + "1"],
            2: that["crate" + color + "2"],
            3: that["crate" + color + "3"]
          });
          that.layers["1"].active = false;
          that.layers["2"].active = false;
          that.currentLayerId = "3";
        }
        that.objectiveTypes = (_that$objectiveTypes = {}, _that$objectiveTypes["crate" + color + "1"] = true, 
        _that$objectiveTypes);
      },
      gotHit: function gotHit(that, reason, resolve) {
        var color = that.simpleCrateData.color;
        if (void 0 !== COLOR_SENSITIVITY[color] && "sensitive:" === reason.type.slice(0, 10) && reason.type.slice(-7) !== COLOR_SENSITIVITY[color]) return resolve();
        that.onUpdate && that.onUpdate.shaking && that.onUpdate.shaking.data.resolve();
        if ("crateBrick1" !== that.type && "crateBrick2" !== that.type) {
          var spine = cc.instantiate(that.crateExplosionFX);
          that.gameBoard.view.addChild(spine);
          spine.zIndex = Z_INDEX.CRATE_EXPLOSION;
          spine.x = that.node.x;
          spine.y = that.node.y;
          spine.scale = 1.22 * ITEM_SCALE;
          spine.angle = 20 * Math.random() - 10;
          var anim = spine.getComponent(sp.Skeleton);
          anim.timeScale *= .4 * Math.random() + .9;
          anim.setSkin(EXPLOSION_SKIN[that.type] || "woodbox");
          anim.setAnimation(0, "woodbox" + that.lifePoints + "_hit", false);
          anim.setCompleteListener(function() {
            spine.destroy();
          });
        }
        that.lifePoints--;
        that._checkLifePoints();
        if (0 === that.lifePoints) return that._defaultExplode(reason, resolve);
        that.type = "crate" + color + that.lifePoints;
        that.currentLayerId = that.lifePoints;
        that.layers[that.currentLayerId].active = true;
        that.onUpdate || (that.onUpdate = {});
        that.layers[that.lifePoints + 1].destroy();
        delete that.layers[that.lifePoints + 1];
        that.onUpdate.shaking = {
          data: {
            shakeUntil: that.app.now + SHAKE_DURATION,
            resolve: function resolve() {
              that.node.angle = 0;
              var hp = that.lifePoints;
              that.layers[hp].x = 0;
              that.layers[hp].y = 0;
              delete that.onUpdate.shaking;
              that._onUpdateCleanup();
            }
          },
          update: function update(dt, data) {
            if (that.app.now >= data.shakeUntil) return data.resolve();
            var hp = that.lifePoints;
            that.node.angle = 7 * that.app.noise.noise2D(that.app.now / 100, 10 * that.uid);
            that.layers[hp].x = 7 * that.app.noise.noise2D(that.app.now / 100, 20 * that.uid);
            that.layers[hp].y = 7 * that.app.noise.noise2D(that.app.now / 100, 30 * that.uid);
          }
        };
        resolve();
      }
    };
    var _default = simpleCrate;
    exports["default"] = _default;
    module.exports = exports["default"];
    cc._RF.pop();
  }, {
    "../../constants.js": "constants"
  } ],
  spinner: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "85526iF82RACoOXl7Iqvj1Z", "spinner");
    "use strict";
    var SPEED = 50;
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        this.spinnerSprite = this.node.getChildByName("icon");
      },
      start: function start() {},
      update: function update(dt) {
        this.spinnerSprite.angle -= dt * SPEED;
      }
    });
    cc._RF.pop();
  }, {} ],
  supplyModel: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "075cezDWiNKQ4WaqOv7yR66", "supplyModel");
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var _yard = _interopRequireDefault(require("../staticData/yard"));
    var _userState = _interopRequireDefault(require("../userState"));
    var _levelModel = _interopRequireDefault(require("./levelModel"));
    var _levels = _interopRequireDefault(require("../staticData/levels/levels"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var _suppplyData;
    var _itemsCache;
    var _boostersCache;
    function getSupplyData() {
      if (_suppplyData) return _suppplyData;
      updateSupplyData();
      return _suppplyData;
    }
    function getItemGroups() {
      if (_itemsCache) return _itemsCache;
      _itemsCache = {};
      for (var key in _yard["default"].items) {
        var item = _yard["default"].items[key];
        _itemsCache[item.unlockedLevel] || (_itemsCache[item.unlockedLevel] = []);
        _itemsCache[item.unlockedLevel].push(item);
      }
      return _itemsCache;
    }
    function updateSupplyData() {
      _suppplyData = {
        items: []
      };
      var curLevel = _levelModel["default"].getLevel(_userState["default"].getProgression()).levelNumber - 1;
      for (var key in _yard["default"].items) {
        var item = _yard["default"].items[key];
        curLevel >= item.unlockedLevel && (_suppplyData.items.includes(key) || _suppplyData.items.push(key));
      }
    }
    function getNewSupplyByLevel(level) {
      getItemGroups();
      updateSupplyData();
      var unlockedItems = [];
      if (_itemsCache[level]) {
        var newItems = _itemsCache[level];
        for (var index in newItems) unlockedItems.push(newItems[index].id);
      }
      var catData = _userState["default"].getCats();
      var unlockedCats = [];
      unlockedItems.forEach(function(item) {
        var _yardConfig$items$ite;
        var itemUnlockedCats = (null == (_yardConfig$items$ite = _yard["default"].items[item]) ? void 0 : _yardConfig$items$ite.unlock) || [];
        itemUnlockedCats.forEach(function(cat) {
          unlockedCats.push(cat);
          catData[cat].unlocked = true;
        });
      });
      unlockedCats.length && _userState["default"].saveCats();
      return {
        items: unlockedItems,
        cats: unlockedCats
      };
    }
    function getLevelToUnlockAll() {
      var items = getItemGroups();
      var levels = Object.keys(items);
      return levels[levels.length - 1];
    }
    function getBoosterUnlockedLevel(boosterId) {
      _boostersCache || initBoosterData();
      return _boostersCache[boosterId];
    }
    function initBoosterData() {
      _boostersCache = {};
      for (var level in _levels["default"]) {
        var boosters = _levels["default"][level].unlockedBoosters;
        if (boosters) for (var booster in boosters) {
          var boosterId = booster;
          var unlockedLevel = _levelModel["default"].getLevel(level).levelNumber;
          _boostersCache[boosterId] = unlockedLevel;
        }
      }
    }
    function hasUnlockAllToys() {
      var curLevel = _levelModel["default"].getLevel(_userState["default"].getProgression()).levelNumber - 1;
      return curLevel >= getLevelToUnlockAll();
    }
    var _default = {
      getSupplyData: getSupplyData,
      updateSupplyData: updateSupplyData,
      getNewSupplyByLevel: getNewSupplyByLevel,
      getItemGroups: getItemGroups,
      getLevelToUnlockAll: getLevelToUnlockAll,
      getBoosterUnlockedLevel: getBoosterUnlockedLevel,
      hasUnlockAllToys: hasUnlockAllToys
    };
    exports["default"] = _default;
    module.exports = exports["default"];
    cc._RF.pop();
  }, {
    "../staticData/levels/levels": "levels",
    "../staticData/yard": "yard",
    "../userState": "userState",
    "./levelModel": "levelModel"
  } ],
  tutorials: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "199a1JrxjdM/JavlPlJf1px", "tutorials");
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var _default = {
      t1: [ {
        type: "swap",
        masks: {
          0: {
            x: 3,
            y: 2,
            height: 3
          },
          1: {
            x: 3,
            y: 2,
            width: 2
          }
        },
        move: {
          from: {
            x: 3,
            y: 2
          },
          to: {
            x: 4,
            y: 2
          }
        },
        label: {
          text: "Match 3 of the same item to collect them",
          y: 1e3
        }
      }, {
        type: "objective"
      } ],
      t2: [ {
        type: "swap",
        masks: {
          0: {
            x: 3,
            y: 3,
            height: 2
          },
          1: {
            x: 2,
            y: 4,
            width: 4
          }
        },
        move: {
          from: {
            x: 3,
            y: 3
          },
          to: {
            x: 3,
            y: 4
          }
        },
        label: {
          text: "Match 4 of the same item to create a rocket",
          y: 800
        }
      }, {
        type: "swap",
        masks: {
          0: {
            x: 2,
            y: 4,
            width: 2
          }
        },
        move: {
          from: {
            x: 3,
            y: 4
          },
          to: {
            x: 2,
            y: 4
          }
        },
        label: {
          text: "Fantastic! Swipe the Rocket to see what it does",
          y: 600,
          x: -300,
          width: 700
        }
      }, {
        type: "swap",
        masks: {
          0: {
            x: 6,
            y: 3,
            height: 4
          },
          1: {
            x: 6,
            y: 4,
            width: 2
          }
        },
        move: {
          from: {
            x: 6,
            y: 4
          },
          to: {
            x: 7,
            y: 4
          }
        },
        label: {
          text: "Great! Let's create another ROCKET!",
          y: 0,
          x: -300,
          width: 620
        }
      }, {
        type: "tap",
        masks: {
          0: {
            x: 6,
            y: 6
          }
        },
        move: {
          from: {
            x: 6,
            y: 6
          }
        },
        label: {
          text: "Now tap on the ROCKET to use it!",
          y: -400,
          x: -300,
          width: 600
        }
      } ],
      t3: [ {
        type: "swap",
        masks: {
          0: {
            x: 5,
            y: 3,
            height: 3
          },
          1: {
            x: 4,
            y: 5,
            width: 4
          }
        },
        move: {
          from: {
            x: 4,
            y: 5
          },
          to: {
            x: 5,
            y: 5
          }
        },
        label: {
          text: "Make an 'L' shape match to create a BOMB!",
          y: 960
        }
      }, {
        type: "swap",
        masks: {
          0: {
            x: 4,
            y: 5,
            width: 2
          }
        },
        move: {
          from: {
            x: 5,
            y: 5
          },
          to: {
            x: 4,
            y: 5
          }
        },
        label: {
          text: "Nice! Swap the BOMB to see what it does!",
          y: 420
        }
      }, {
        type: "swap",
        masks: {
          0: {
            x: 5,
            y: 3,
            height: 4
          },
          1: {
            x: 4,
            y: 4,
            width: 3
          }
        },
        move: {
          from: {
            x: 5,
            y: 3
          },
          to: {
            x: 5,
            y: 4
          }
        },
        label: {
          text: "Awesome! Let's create another bomb by matching items in a 'T' shape",
          y: -800
        }
      }, {
        type: "tap",
        masks: {
          0: {
            x: 5,
            y: 6
          }
        },
        move: {
          from: {
            x: 5,
            y: 6
          }
        },
        label: {
          text: "Now tap on the BOMB to use it!",
          y: 160
        }
      } ],
      t4: [ {
        type: "swap",
        masks: {
          0: {
            x: 3,
            y: 4,
            width: 2,
            height: 2
          },
          1: {
            x: 3,
            y: 4,
            width: 3
          }
        },
        move: {
          from: {
            x: 5,
            y: 4
          },
          to: {
            x: 4,
            y: 4
          }
        },
        label: {
          text: "Match 4 of the same item in a square to create a DISC!",
          y: 700
        }
      }, {
        type: "swap",
        masks: {
          0: {
            x: 3,
            y: 5,
            width: 2
          }
        },
        move: {
          from: {
            x: 3,
            y: 5
          },
          to: {
            x: 4,
            y: 5
          }
        },
        label: {
          text: "Perfect! Swipe the DISC to see what it does!",
          y: 420
        }
      }, {
        type: "swap",
        masks: {
          0: {
            x: 5,
            y: 5,
            height: 3
          },
          1: {
            x: 4,
            y: 6,
            width: 2,
            height: 2
          }
        },
        move: {
          from: {
            x: 5,
            y: 5
          },
          to: {
            x: 5,
            y: 6
          }
        },
        label: {
          text: "Amazing! Let's create another DISC!",
          y: 480
        }
      }, {
        type: "tap",
        masks: {
          0: {
            x: 5,
            y: 7
          }
        },
        move: {
          from: {
            x: 5,
            y: 7
          }
        },
        label: {
          text: "Now tap on the DISC to use it!",
          y: 260
        }
      } ],
      t5: [ {
        type: "swap",
        masks: {
          0: {
            x: 4,
            y: 4,
            height: 2
          },
          1: {
            x: 2,
            y: 5,
            width: 5
          }
        },
        move: {
          from: {
            x: 4,
            y: 4
          },
          to: {
            x: 4,
            y: 5
          }
        },
        label: {
          text: "Match 5 items in a line to create a WIND WHEEL!",
          y: 700
        }
      }, {
        type: "swap",
        masks: {
          0: {
            x: 4,
            y: 5,
            width: 2
          }
        },
        move: {
          from: {
            x: 4,
            y: 5
          },
          to: {
            x: 5,
            y: 5
          }
        },
        label: {
          text: "Nice! Swap the wind wheel with an item to clear the items of that color!",
          y: 480
        }
      } ],
      t101: [ {
        type: "tapAny",
        masks: {
          0: {
            x: 0,
            y: 4,
            width: 9,
            height: 6
          }
        },
        label: {
          text: "Make a match next to the box to break it",
          y: 720
        }
      } ],
      t102: [ {
        type: "tapAny",
        masks: {
          0: {
            x: 0,
            y: 3,
            width: 9,
            height: 5
          }
        },
        label: {
          text: "Make a match on the leaves to remove them!",
          y: 820
        }
      } ],
      t103: [ {
        type: "tapAny",
        masks: {
          0: {
            x: 2,
            y: 3,
            width: 2,
            height: 2
          },
          1: {
            x: 5,
            y: 3,
            width: 2,
            height: 2
          },
          2: {
            x: 2,
            y: 6,
            width: 2,
            height: 2
          },
          3: {
            x: 5,
            y: 6,
            width: 2,
            height: 2
          }
        },
        label: {
          text: "Make a match next to the MILK CABINET to break it",
          y: 960
        }
      } ],
      t104: [ {
        type: "tapAny",
        masks: {
          0: {
            x: 0,
            y: 1,
            height: 8
          },
          1: {
            x: 8,
            y: 1,
            height: 8
          },
          3: {
            x: 0,
            y: 9,
            width: 9
          }
        },
        label: {
          text: "Make matches next to a MOUSEDOOR to catch MICE!",
          y: 0
        }
      } ],
      t105: [ {
        type: "tapAny",
        masks: {
          0: {
            x: 0,
            y: 1,
            width: 3,
            height: 9
          },
          1: {
            x: 6,
            y: 1,
            width: 3,
            height: 9
          }
        },
        label: {
          text: "Break the TEACUP by making a match next to it!",
          y: 720
        }
      } ],
      t106: [ {
        type: "tapAny",
        masks: {
          0: {
            x: 2,
            y: 3,
            width: 2,
            height: 2
          },
          1: {
            x: 5,
            y: 3,
            width: 2,
            height: 2
          },
          2: {
            x: 2,
            y: 6,
            width: 2,
            height: 2
          },
          3: {
            x: 5,
            y: 6,
            width: 2,
            height: 2
          }
        },
        label: {
          text: "Break a JAM JAR by making a colored match next to it!",
          y: 960
        }
      } ],
      t107: [ {
        type: "tapAny",
        masks: {
          0: {
            x: 0,
            y: 1,
            width: 9,
            height: 9
          }
        },
        label: {
          text: "Hit BRICK WALL with power-ups to break it!",
          y: 0
        }
      } ],
      t108: [ {
        type: "booster",
        booster: "hammer",
        label: {
          text: "Tap on the Hammer to select it!"
        }
      }, {
        type: "tapBooster",
        masks: {
          0: {
            x: 5,
            y: 3
          }
        },
        move: {
          from: {
            x: 5,
            y: 3
          }
        },
        label: {
          text: "Tap on the item to clear it from the board!",
          y: -300
        }
      } ],
      t109: [ {
        type: "booster",
        booster: "airplane",
        label: {
          text: "The Airplane clears an entire row!"
        }
      }, {
        type: "tapBooster",
        masks: {
          0: {
            x: 0,
            y: 3,
            width: 8
          }
        },
        move: {
          from: {
            x: 0,
            y: 3
          }
        },
        label: {
          text: "Tap any object to clear its row!",
          y: -200
        }
      } ],
      t110: [ {
        type: "booster",
        booster: "rocket",
        label: {
          text: "The Rocket clears an entire column!"
        }
      }, {
        type: "tapBooster",
        masks: {
          0: {
            x: 4,
            y: 1,
            height: 9
          }
        },
        move: {
          from: {
            x: 4,
            y: 9
          }
        },
        label: {
          text: "Tap any object to clear its column!",
          y: -200
        }
      } ],
      t111: [ {
        type: "booster",
        booster: "wheel",
        label: {
          text: "The Wheel shuffles all the items on the board!"
        }
      }, {
        type: "tapBooster",
        masks: {
          0: {
            x: 0,
            y: 1,
            width: 9,
            height: 9
          }
        },
        label: {
          text: "Tap any object to shuffle!",
          y: -300
        }
      } ],
      t112: [ {
        type: "booster",
        booster: "fairystick",
        label: {
          text: "Tap on FAIRY STICK to select it!"
        }
      }, {
        type: "tapBooster",
        masks: {
          0: {
            x: 2,
            y: 1
          },
          1: {
            x: 4,
            y: 1
          },
          2: {
            x: 6,
            y: 1
          },
          3: {
            x: 5,
            y: 2,
            width: 2
          }
        },
        label: {
          text: "Select a GREEN cube to clear"
        }
      } ],
      t113: [ {
        type: "booster",
        booster: "paintbrush",
        label: {
          text: "Tap on PAINT BRUSH to select it!"
        }
      }, {
        type: "paintbrush",
        color: "basic4",
        label: {
          text: "Choose color of blue"
        }
      }, {
        type: "tapBooster",
        masks: {
          0: {
            x: 3,
            y: 3
          }
        },
        move: {
          from: {
            x: 3,
            y: 3
          }
        },
        label: {
          text: "Select the cube whose color you want to change",
          y: -300
        }
      } ]
    };
    exports["default"] = _default;
    module.exports = exports["default"];
    cc._RF.pop();
  }, {} ],
  types: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "71e73R4nDpOO4DemLj8xY54", "types");
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var O = null;
    var r = "basic1";
    var y = "basic2";
    var g = "basic3";
    var b = "basic4";
    var p = "basic5";
    var R = [ r, y, g, b ];
    var A = [ r, y, g, b, p ];
    var T = [ y, g, b, p ];
    var U = [ r, y, b, p ];
    var B = "bomb";
    var D = "discoball";
    var M = "missiles1";
    var m = "missiles2";
    var s = "sniper";
    var x = "crateBrown1";
    var X = "crateBrown2";
    var z = "crateBrown3";
    var a = "crateRed1";
    var c = "crateRed2";
    var d = "crateRed3";
    var e = "crateYellow1";
    var f = "crateYellow2";
    var h = "crateYellow3";
    var i = "crateGreen1";
    var j = "crateGreen2";
    var k = "crateGreen3";
    var l = "crateBlue1";
    var n = "crateBlue2";
    var o = "crateBlue3";
    var q = "cratePurple1";
    var u = "cratePurple2";
    var v = "cratePurple3";
    var w = "crateBrick1";
    var C = "crateBrick2";
    var t = "movableDestructible1";
    var E = "shrub1";
    var F = "shrub2";
    var G = "mouseDoor";
    var H = "milkCabinet";
    var J = "milkShelfLeft";
    var K = "milkShelfRight";
    var L = "jamCabinet1";
    var N = "jamCabinet2";
    var P = "jamCabinet3";
    var Q = "jamCabinet4";
    var S = "jamCabinet5";
    var I = "milkBottle";
    var V = "jam";
    var _default = {
      O: O,
      r: r,
      y: y,
      g: g,
      b: b,
      p: p,
      R: R,
      A: A,
      B: B,
      D: D,
      M: M,
      m: m,
      s: s,
      x: x,
      X: X,
      z: z,
      a: a,
      c: c,
      d: d,
      e: e,
      f: f,
      h: h,
      i: i,
      j: j,
      k: k,
      l: l,
      n: n,
      o: o,
      q: q,
      u: u,
      v: v,
      w: w,
      C: C,
      E: E,
      F: F,
      G: G,
      H: H,
      t: t,
      I: I,
      J: J,
      K: K,
      L: L,
      N: N,
      P: P,
      Q: Q,
      S: S,
      V: V,
      T: T,
      U: U
    };
    exports["default"] = _default;
    module.exports = exports["default"];
    cc._RF.pop();
  }, {} ],
  underlay: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c3d9dNyxtdLaqpqhO+C2BgA", "underlay");
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var _constants = _interopRequireDefault(require("../../constants.js"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var Z_INDEX = _constants["default"].GAMEPLAY.Z_INDEX;
    var UNDERLAY_TILE_SIZE = 270;
    var SHAKE_DURATION = 300;
    var underlay = {
      properties: {
        shrub1: {
          default: null,
          type: cc.SpriteFrame
        },
        shrub2: {
          default: null,
          type: cc.SpriteFrame
        },
        leafFX: {
          default: null,
          type: cc.Prefab
        }
      },
      is: function is(type) {
        return "shrub1" === type || "shrub2" === type;
      },
      init: function init(that, options) {
        var _that$objectiveTypes;
        that.node.zIndex = Z_INDEX["UNDERLAY_ITEM" + (Math.floor(5 * Math.random()) + 1)];
        that.objectiveTypes = (_that$objectiveTypes = {}, _that$objectiveTypes["shrub1"] = true, 
        _that$objectiveTypes);
        var type = options.type;
        var subType = type.substring(0, type.length - 1);
        that.underlayData = {
          subType: subType
        };
        switch (type) {
         case subType + "1":
          that._addLayers({
            1: that[subType + "1"]
          });
          that.currentLayerId = "1";
          break;

         case subType + "2":
          that.lifePoints = 2;
          that._addLayers({
            1: that[subType + "1"],
            2: that[subType + "2"]
          });
          that.layers["1"].active = false;
          that.currentLayerId = "2";
        }
        for (var i = 1; i <= 2; i++) {
          if (!that.layers[i]) continue;
          that.layers[i].width = UNDERLAY_TILE_SIZE;
          that.layers[i].height = UNDERLAY_TILE_SIZE;
          that.layers[i].angle = 90 * Math.floor(4 * Math.random());
        }
      },
      gotHit: function gotHit(that, reason, resolve) {
        that.onUpdate && that.onUpdate.shaking && that.onUpdate.shaking.data.resolve();
        var spine = cc.instantiate(that.leafFX);
        that.gameBoard.view.addChild(spine);
        spine.zIndex = Z_INDEX.CRATE_EXPLOSION;
        spine.x = that.node.x;
        spine.y = that.node.y;
        spine.angle = 8 * Math.random() - 4;
        var anim = spine.getComponent(sp.Skeleton);
        anim.timeScale *= .3 * Math.random() + .9;
        anim.setSkin("leaf" + that.lifePoints);
        anim.setAnimation(0, "leaf" + that.lifePoints + "_hit", false);
        anim.setCompleteListener(function() {
          spine.destroy();
        });
        that.lifePoints--;
        that._checkLifePoints();
        if (0 === that.lifePoints) return that._defaultExplode(reason, resolve, false);
        that.type = "" + that.underlayData.subType + that.lifePoints;
        that.currentLayerId = that.lifePoints;
        that.layers[that.currentLayerId].active = true;
        that.onUpdate || (that.onUpdate = {});
        that.onUpdate.shaking = {
          data: {
            shakeUntil: that.app.now + SHAKE_DURATION,
            resolve: function resolve() {
              that.node.angle = 0;
              var hp = that.lifePoints;
              that.layers[hp].x = that.layers[hp + 1].x = 0;
              that.layers[hp].y = that.layers[hp + 1].y = 0;
              that.layers[hp + 1].destroy();
              delete that.layers[hp + 1];
              delete that.onUpdate.shaking;
              that._onUpdateCleanup();
            }
          },
          update: function update(dt, data) {
            if (that.app.now >= data.shakeUntil) return data.resolve();
            var hp = that.lifePoints;
            that.node.angle = 7 * that.app.noise.noise2D(that.app.now / 100, 10 * that.uid);
            that.layers[hp + 1].x = that.layers[hp].x = 7 * that.app.noise.noise2D(that.app.now / 100, 20 * that.uid);
            that.layers[hp + 1].y = that.layers[hp].y = 7 * that.app.noise.noise2D(that.app.now / 100, 30 * that.uid);
            that.layers[hp + 1].opacity = (data.shakeUntil - that.app.now) / SHAKE_DURATION * 256;
          }
        };
        resolve();
      }
    };
    var _default = underlay;
    exports["default"] = _default;
    module.exports = exports["default"];
    cc._RF.pop();
  }, {
    "../../constants.js": "constants"
  } ],
  userState: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "cdc8d8RhNRBCLNThbisByEb", "userState");
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var _boosters = _interopRequireDefault(require("./staticData/boosters"));
    var _constants = _interopRequireDefault(require("./constants"));
    var _levelModel = _interopRequireDefault(require("./models/levelModel"));
    var _helpers = _interopRequireDefault(require("./helpers"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var TIME_SPAN = _constants["default"].TIME_SPAN;
    var states = null;
    var boosters = null;
    var cats = null;
    var settings = null;
    var yard = null;
    var lastSavedYardState = null;
    var defaultStates = {
      coin: 0,
      fish: 0,
      heart: _getDefaultHeartInfo(),
      selectedCat: null,
      level: null,
      dailyUpdate: 0,
      isFirstPlay: true,
      feedFishAmount: 10,
      tutorial: _getDefaultTutorialInfo(),
      reachedEnd: 0
    };
    function _getDefaultHeartInfo() {
      return {
        value: _constants["default"].USER_INIT_DATA.MAX_HEART,
        timestamp: null
      };
    }
    function _getDefaultTutorialInfo() {
      return {
        cat: {
          step: -1
        }
      };
    }
    function getStates() {
      if (!states) {
        var rawData = localStorage.getItem("userStates");
        if (rawData) states = JSON.parse(rawData); else {
          states = JSON.parse(JSON.stringify(defaultStates));
          saveStates();
        }
      }
      _validateHeartInfo(states);
      _validateTutorialInfo(states);
      return states;
    }
    function saveStates() {
      localStorage.setItem("userStates", JSON.stringify(states));
    }
    function getCoin() {
      return getStates().coin;
    }
    function updateCoin(value) {
      getStates().coin = Math.max(getStates().coin + value, 0);
      saveStates();
    }
    function getFish() {
      return getStates().fish;
    }
    function updateFish(value) {
      getStates().fish = Math.max(getStates().fish + value, 0);
      saveStates();
    }
    function getSelectedCat() {
      return getStates().selectedCat;
    }
    function updateSelectedCat(value) {
      getStates().selectedCat = value;
      saveStates();
    }
    function _validateHeartInfo(states) {
      if (void 0 !== states.heart) return;
      states.heart = _getDefaultHeartInfo();
    }
    function _validateTutorialInfo(states) {
      if (void 0 !== states.tutorial) return;
      states.tutorial = _getDefaultTutorialInfo();
    }
    function getHeart() {
      updateHeart();
      return getStates().heart;
    }
    function addHeart(value) {
      if (0 === value) return;
      var heart = getHeart();
      var oldValue = heart.value;
      var newValue = _helpers["default"].clamp(heart.value + value, 0, _constants["default"].USER_INIT_DATA.MAX_HEART);
      heart.value = newValue;
      if (newValue === _constants["default"].USER_INIT_DATA.MAX_HEART) {
        heart.timestamp = 0;
        saveStates();
        return;
      }
      oldValue === _constants["default"].USER_INIT_DATA.MAX_HEART && (heart.timestamp = Date.now());
      saveStates();
    }
    function getHeartRefillDuration() {
      var heart = getHeart();
      if (heart >= _constants["default"].USER_INIT_DATA.MAX_HEART) return 0;
      return Math.max(_constants["default"].HEART_REFILL_DURATION * (1 - heart.value + ~~heart.value), 0);
    }
    function updateHeart() {
      var heart = getStates().heart;
      if (heart.value >= _constants["default"].USER_INIT_DATA.MAX_HEART) return;
      var now = Date.now();
      var elapsedTime = now - heart.timestamp;
      var oldValue = heart.value;
      heart.value = Math.min(Math.floor(heart.value) + elapsedTime / _constants["default"].HEART_REFILL_DURATION, _constants["default"].USER_INIT_DATA.MAX_HEART);
      if (Math.floor(oldValue) !== Math.floor(heart.value)) {
        heart.timestamp = now;
        saveStates();
      }
    }
    function updateDailyState() {
      var dailyUpdate = getStates().dailyUpdate || 0;
      if (Date.now() - dailyUpdate > TIME_SPAN.ONE_DAY) {
        console.warn("refresh daily state");
        getStates().dailyUpdate = Math.round(Date.now() / TIME_SPAN.ONE_DAY) * TIME_SPAN.ONE_DAY;
        saveStates();
        return true;
      }
      return false;
    }
    function updateFirstPlayValue(value) {
      getStates().isFirstPlay = value;
      saveStates();
    }
    function updateValueByKey(key, value) {
      var state = getStates();
      state[key] = value;
      saveStates();
    }
    function getProgression() {
      var map = _levelModel["default"].getLevelMap();
      var level = getStates().level;
      if (null === level || -1 === map.indexOf(level)) {
        getStates().level = map[0];
        saveStates();
      }
      return getStates().level;
    }
    function stepProgression(step) {
      var map = _levelModel["default"].getLevelMap();
      var currentProgress = getProgression();
      var progressId = map.indexOf(currentProgress);
      if (progressId < 0) return;
      var _states = getStates();
      progressId = Math.max(progressId + step, 0);
      if (progressId > map.length - 1) {
        _states.reachedEnd = progressId;
        progressId = map.length - 1;
      } else _states.reachedEnd = 0;
      _states.level = map[progressId];
      saveStates();
    }
    function hasReachedEnd() {
      var map = _levelModel["default"].getLevelMap();
      return states.reachedEnd > map.length - 1;
    }
    var defaultBoosters = {
      hammer: {
        amount: 0,
        selected: false,
        unlocked: false
      },
      airplane: {
        amount: 0,
        selected: false,
        unlocked: false
      },
      rocket: {
        amount: 0,
        selected: false,
        unlocked: false
      },
      fairystick: {
        amount: 0,
        selected: false,
        unlocked: false
      },
      paintbrush: {
        amount: 0,
        selected: false,
        unlocked: false
      },
      wheel: {
        amount: 0,
        selected: false,
        unlocked: false
      }
    };
    function getBoosters() {
      if (!boosters) {
        var rawData = localStorage.getItem("boosters");
        if (rawData) boosters = JSON.parse(rawData); else {
          boosters = JSON.parse(JSON.stringify(defaultBoosters));
          saveBoostersState();
        }
      }
      return boosters;
    }
    function saveBoostersState() {
      localStorage.setItem("boosters", JSON.stringify(boosters));
    }
    var defaultCats = {
      bella: {
        unlocked: false,
        fishFed: 0,
        dailyFed: 0
      },
      bob: {
        unlocked: false,
        fishFed: 0,
        dailyFed: 0
      },
      dora: {
        unlocked: false,
        fishFed: 0,
        dailyFed: 0
      },
      leo: {
        unlocked: false,
        fishFed: 0,
        dailyFed: 0
      },
      lily: {
        unlocked: false,
        fishFed: 0,
        dailyFed: 0
      },
      luna: {
        unlocked: false,
        fishFed: 0,
        dailyFed: 0
      },
      max: {
        unlocked: false,
        fishFed: 0,
        dailyFed: 0
      },
      milo: {
        unlocked: false,
        fishFed: 0,
        dailyFed: 0
      }
    };
    function getCats() {
      if (!cats) {
        var rawData = localStorage.getItem("cats");
        if (rawData) cats = JSON.parse(rawData); else {
          cats = JSON.parse(JSON.stringify(defaultCats));
          saveCats();
        }
      }
      return cats;
    }
    function saveCats() {
      localStorage.setItem("cats", JSON.stringify(cats));
    }
    var defaultSettings = {
      music: .5
    };
    function getSettings() {
      if (!settings) {
        var rawData = localStorage.getItem("settings");
        if (rawData) settings = JSON.parse(rawData); else {
          settings = JSON.parse(JSON.stringify(defaultSettings));
          saveSettings();
        }
      }
      return settings;
    }
    function saveSettings() {
      localStorage.setItem("settings", JSON.stringify(settings));
    }
    var defaultYardPlacements = {};
    function getYard() {
      if (!yard) {
        var rawData = localStorage.getItem("yardPlacements");
        if (rawData) yard = JSON.parse(rawData); else {
          yard = {};
          saveYard();
        }
      }
      return yard;
    }
    function saveYard() {
      var yardState = JSON.stringify(yard);
      if (yardState !== lastSavedYardState) {
        localStorage.setItem("yardPlacements", yardState);
        lastSavedYardState = yardState;
      }
    }
    function clear() {
      states = null;
      boosters = null;
      cats = null;
      settings = null;
      yard = null;
      localStorage.clear();
    }
    var _default = {
      getStates: getStates,
      saveStates: saveStates,
      updateDailyState: updateDailyState,
      getSettings: getSettings,
      saveSettings: saveSettings,
      getCoin: getCoin,
      updateCoin: updateCoin,
      getFish: getFish,
      updateFish: updateFish,
      getHeart: getHeart,
      addHeart: addHeart,
      updateHeart: updateHeart,
      getHeartRefillDuration: getHeartRefillDuration,
      getSelectedCat: getSelectedCat,
      updateSelectedCat: updateSelectedCat,
      getProgression: getProgression,
      stepProgression: stepProgression,
      getBoosters: getBoosters,
      saveBoostersState: saveBoostersState,
      getCats: getCats,
      saveCats: saveCats,
      getYard: getYard,
      saveYard: saveYard,
      clear: clear,
      updateFirstPlayValue: updateFirstPlayValue,
      updateValueByKey: updateValueByKey,
      hasReachedEnd: hasReachedEnd
    };
    exports["default"] = _default;
    module.exports = exports["default"];
    cc._RF.pop();
  }, {
    "./constants": "constants",
    "./helpers": "helpers",
    "./models/levelModel": "levelModel",
    "./staticData/boosters": "boosters"
  } ],
  yardModel: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a10e4uDHl5GI53INdE66dty", "yardModel");
    "use strict";
    cc._RF.pop();
  }, {} ],
  yard: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d18035ArTRGVoA19C73IMkX", "yard");
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var O = "none";
    var n = "normal";
    var w = "water";
    var t = "tree";
    var color_none = new cc.Color(0, 0, 0);
    var color_normal = new cc.Color(0, 0, 0);
    var color_water = new cc.Color(0, 0, 220);
    var color_tree = new cc.Color(255, 0, 0);
    var colors = {
      none: {
        color: color_none,
        opacity: 128
      },
      normal: {
        color: color_normal,
        opacity: 28
      },
      water: {
        color: color_normal,
        opacity: 28
      },
      tree: {
        color: color_normal,
        opacity: 28
      }
    };
    var pattern = [ [ O, O, O, O, O, O, O, O, n, n, n, t, O, O, O, n, n, n, n, n ], [ O, O, n, n, n, O, O, n, n, n, n, n, n, O, O, O, n, n, n, n ], [ O, O, O, n, O, O, n, n, n, n, n, n, w, w, w, w, O, n, n, O ], [ O, O, O, O, O, O, n, n, n, n, n, n, w, w, w, w, n, n, n, n ] ];
    var patternSize = {
      x: pattern[0].length,
      y: pattern.length
    };
    var items = {
      rubberBallRed: {
        id: "rubberBallRed",
        name: "Red Ball",
        type: n,
        size: {
          x: 1,
          y: 1
        },
        spriteScale: 2,
        offset: {
          x: 0,
          y: -40
        },
        catOffset: {
          x: 26,
          y: 13
        },
        animOffset: {
          x: 29.5,
          y: -58.5
        },
        labelOffset: {
          x: 0,
          y: -72
        },
        unlockedLevel: 1,
        interval: 900,
        unlock: [ "bella" ],
        attract: {
          bella: 100
        },
        anim: {
          bella: {
            skeleton: "anim_rubberBallRed",
            animation: "animation"
          }
        }
      },
      pot: {
        id: "pot",
        name: "Flower Pot",
        type: n,
        size: {
          x: 1,
          y: 1
        },
        offset: {
          x: 0,
          y: 25
        },
        spriteScale: 2,
        buttonOffset: {
          x: -30,
          y: -50
        },
        catOffset: {
          x: 8.5,
          y: 3
        },
        animOffset: {
          x: 5.8,
          y: -112.5
        },
        labelOffset: {
          x: 0,
          y: -109
        },
        unlockedLevel: 5,
        interval: 900,
        unlock: [ "milo" ],
        attract: {
          bella: 80,
          milo: 20
        },
        anim: {
          bella: {
            skeleton: "anim_pot",
            animation: "flowerpot",
            skin: "Cat-Bella"
          },
          milo: {
            skeleton: "anim_pot",
            animation: "flowerpot",
            skin: "Cat-Milo"
          }
        }
      },
      stretchingBoard: {
        id: "stretchingBoard",
        name: "Stretching Board",
        type: n,
        size: {
          x: 2,
          y: 1
        },
        spriteScale: 2,
        offset: {
          x: 0,
          y: -20
        },
        buttonOffset: {
          x: -25,
          y: -25
        },
        catOffset: {
          x: 32,
          y: 94
        },
        animOffset: {
          x: 12,
          y: -53
        },
        keepImageWhileAnim: true,
        labelOffset: {
          x: 0,
          y: -73
        },
        unlockedLevel: 9,
        interval: 780,
        attract: {
          bella: 50,
          milo: 50
        },
        anim: {
          bella: {
            skeleton: "anim_stretchingBoard",
            animation: "animation",
            skin: "Cat-Bella"
          },
          milo: {
            skeleton: "anim_stretchingBoard",
            animation: "animation",
            skin: "Cat-Milo"
          }
        }
      },
      bed: {
        id: "bed",
        name: "Bed",
        type: n,
        size: {
          x: 1,
          y: 1
        },
        spriteScale: 2,
        buttonOffset: {
          x: -20,
          y: -10
        },
        catOffset: {
          x: 4,
          y: 39
        },
        animOffset: {
          x: -41.5,
          y: -21
        },
        labelOffset: {
          x: 0,
          y: -73
        },
        unlockedLevel: 12,
        interval: 780,
        unlock: [ "dora" ],
        attract: {
          dora: 100
        },
        anim: {
          dora: {
            skeleton: "anim_bed",
            animation: "animation",
            skin: "cat-dora"
          },
          luna: {
            skeleton: "anim_bed",
            animation: "animation",
            skin: "cat-luna"
          }
        }
      },
      swing: {
        id: "swing",
        name: "Swing",
        type: t,
        size: {
          x: 1,
          y: 1
        },
        spriteScale: 2,
        offset: {
          x: 0,
          y: 247
        },
        buttonOffset: {
          x: -20,
          y: -235
        },
        catOffset: {
          x: 11.5,
          y: -77.5
        },
        animOffset: {
          x: 29,
          y: -191.5
        },
        labelOffset: {
          x: 0,
          y: -220
        },
        unlockedLevel: 15,
        interval: 780,
        attract: {
          dora: 50,
          milo: 50
        },
        anim: {
          dora: {
            skeleton: "anim_swing",
            animation: "animation",
            skin: "Dora"
          },
          milo: {
            skeleton: "anim_swing",
            animation: "animation",
            skin: "milo"
          }
        }
      },
      paperBag1: {
        id: "paperBag1",
        name: "Paper Bag Hat",
        type: n,
        size: {
          x: 1,
          y: 1
        },
        spriteScale: 2,
        buttonOffset: {
          x: -25,
          y: -25
        },
        catOffset: {
          x: -7,
          y: 19
        },
        animOffset: {
          x: -4,
          y: -70
        },
        labelOffset: {
          x: 0,
          y: -95
        },
        unlockedLevel: 21,
        interval: 600,
        unlock: [ "luna" ],
        attract: {
          lily: 60,
          luna: 40
        },
        anim: {
          lily: {
            skeleton: "anim_paperBag1",
            animation: "paper_baghood",
            skin: "Lily"
          },
          luna: {
            skeleton: "anim_paperBag1",
            animation: "paper_baghood",
            skin: "Luna"
          }
        }
      },
      paperBag2: {
        id: "paperBag2",
        name: "Paper Bag",
        type: n,
        size: {
          x: 1,
          y: 1
        },
        spriteScale: 2,
        buttonOffset: {
          x: -25,
          y: -25
        },
        catOffset: {
          x: -10,
          y: -30
        },
        animOffset: {
          x: 4.5,
          y: -107.5
        },
        labelOffset: {
          x: 0,
          y: -106.5
        },
        unlockedLevel: 18,
        interval: 600,
        unlock: [ "lily" ],
        attract: {
          lily: 100
        },
        anim: {
          lily: {
            skeleton: "anim_paperBag2",
            animation: "animation",
            skin: "Cat_Lily"
          },
          luna: {
            skeleton: "anim_paperBag2",
            animation: "animation",
            skin: "Cat_Luna"
          }
        }
      },
      cushion: {
        id: "cushion",
        name: "Cushion",
        type: n,
        size: {
          x: 1,
          y: 1
        },
        spriteScale: 2,
        offset: {
          x: 0,
          y: -40
        },
        buttonOffset: {
          x: -20,
          y: -10
        },
        catOffset: {
          x: 5,
          y: 35
        },
        animOffset: {
          x: -6.5,
          y: -52
        },
        labelOffset: {
          x: 0,
          y: -106.5
        },
        unlockedLevel: 24,
        interval: 600,
        unlock: [ "leo" ],
        attract: {
          leo: 100
        },
        anim: {
          leo: {
            skeleton: "anim_cushion",
            animation: "animation"
          }
        }
      },
      rubberBallRainbow: {
        id: "rubberBallRainbow",
        name: "Rainbow Ball",
        type: n,
        size: {
          x: 1,
          y: 1
        },
        spriteScale: 2,
        buttonOffset: {
          x: -20,
          y: -20
        },
        catOffset: {
          x: 9,
          y: 67
        },
        animOffset: {
          x: 1,
          y: -39
        },
        labelOffset: {
          x: 0,
          y: -95.5
        },
        unlockedLevel: 27,
        interval: 480,
        attract: {
          leo: 80,
          luna: 20
        },
        anim: {
          leo: {
            skeleton: "anim_rubberBallRainbow",
            animation: "Rubber_Ball",
            skin: "Cat_Leo"
          },
          luna: {
            skeleton: "anim_rubberBallRainbow",
            animation: "Rubber_Ball",
            skin: "Cat_Luna"
          }
        }
      },
      swimRing: {
        id: "swimRing",
        name: "Swim Ring",
        type: w,
        size: {
          x: 1,
          y: 1
        },
        spriteScale: 2,
        buttonOffset: {
          x: -35,
          y: -35
        },
        catOffset: {
          x: 32.5,
          y: 28.5
        },
        animOffset: {
          x: 18.5,
          y: -94.5
        },
        labelOffset: {
          x: 0,
          y: -125
        },
        unlockedLevel: 30,
        interval: 480,
        attract: {
          leo: 50,
          milo: 50
        },
        anim: {
          leo: {
            skeleton: "anim_swimRing",
            animation: "Swim",
            skin: "Cat_Leo"
          },
          milo: {
            skeleton: "anim_swimRing",
            animation: "Swim",
            skin: "Cat_Milo"
          }
        }
      },
      hamburgerCushion: {
        id: "hamburgerCushion",
        name: "Hamburger Cushion",
        type: n,
        size: {
          x: 1,
          y: 1
        },
        spriteScale: 2,
        buttonOffset: {
          x: -25,
          y: -25
        },
        catOffset: {
          x: -3.5,
          y: 8.5
        },
        animOffset: {
          x: 3.5,
          y: -85.5
        },
        labelOffset: {
          x: 0,
          y: -115
        },
        unlockedLevel: 33,
        interval: 480,
        unlock: [ "max" ],
        attract: {
          max: 100
        },
        anim: {
          max: {
            skeleton: "anim_hamburgerCushion",
            animation: "Hamburger",
            skin: "Cat_Max"
          }
        }
      },
      tower: {
        id: "tower",
        name: "Tower",
        type: n,
        size: {
          x: 2,
          y: 1
        },
        spriteScale: 2,
        offset: {
          x: 0,
          y: 112
        },
        buttonOffset: {
          x: -45,
          y: -45
        },
        catOffset: {
          x: 0,
          y: 0
        },
        animOffset: {
          x: 0,
          y: 0
        },
        keepImageWhileAnim: true,
        labelOffset: {
          x: 0,
          y: -215
        },
        unlockedLevel: 36,
        interval: 360,
        attract: {
          max: 40,
          lily: 40,
          luna: 20
        },
        anim: {
          max: {
            skeleton: "anim_tower_max",
            animation: "Tower_A",
            skin: "Leo",
            catOffset: {
              x: 36,
              y: -52
            },
            animOffset: {
              x: 36.5,
              y: -132.5
            }
          },
          lily: {
            skeleton: "anim_tower_lily",
            animation: "Swim",
            skin: "Leo",
            catOffset: {
              x: -108,
              y: 92
            },
            animOffset: {
              x: -97,
              y: 22
            }
          },
          luna: {
            skeleton: "anim_tower_luna",
            animation: "Tower_B",
            skin: "Leo",
            catOffset: {
              x: -27.5,
              y: -18.5
            },
            animOffset: {
              x: -6,
              y: -109.5
            }
          }
        }
      },
      plushDoll: {
        id: "plushDoll",
        name: "Plush Doll",
        type: n,
        size: {
          x: 1,
          y: 1
        },
        spriteScale: 2,
        offset: {
          x: 0,
          y: -40
        },
        catOffset: {
          x: 30,
          y: 78
        },
        animOffset: {
          x: 27.5,
          y: -38.5
        },
        labelOffset: {
          x: 0,
          y: -70
        },
        unlockedLevel: 39,
        interval: 360,
        attract: {
          bella: 67,
          luna: 33
        },
        anim: {
          bella: {
            skeleton: "anim_plushDoll",
            animation: "Plush_Doll",
            skin: "Cat_Bella"
          },
          luna: {
            skeleton: "anim_plushDoll",
            animation: "Plush_Doll",
            skin: "Cat_Luna"
          }
        }
      },
      tent: {
        id: "tent",
        name: "Tent",
        type: n,
        size: {
          x: 2,
          y: 1
        },
        spriteScale: 1.8,
        offset: {
          x: 0,
          y: 120
        },
        buttonOffset: {
          x: -100,
          y: -160
        },
        catOffset: {
          x: 72,
          y: -66
        },
        animOffset: {
          x: -15,
          y: -212.5
        },
        labelOffset: {
          x: 0,
          y: -246
        },
        unlockedLevel: 42,
        interval: 360,
        unlock: [ "bob" ],
        attract: {
          bob: 100
        },
        anim: {
          bob: {
            skeleton: "anim_tent",
            animation: "Tent"
          }
        }
      },
      featherToy: {
        id: "featherToy",
        name: "Feather Toy",
        type: n,
        size: {
          x: 1,
          y: 1
        },
        spriteScale: 2,
        offset: {
          x: -20,
          y: 100
        },
        buttonOffset: {
          x: -20,
          y: -10
        },
        catOffset: {
          x: -135,
          y: 1
        },
        animOffset: {
          x: 45,
          y: -154
        },
        labelOffset: {
          x: 0,
          y: -190
        },
        unlockedLevel: 45,
        interval: 360,
        attract: {
          bob: 67,
          luna: 33
        },
        anim: {
          bob: {
            skeleton: "anim_featherToy",
            animation: "Feather_toy",
            skin: "Cat_Bob"
          },
          luna: {
            skeleton: "anim_featherToy",
            animation: "Feather_toy",
            skin: "Cat_Luna"
          }
        }
      },
      tunnel: {
        id: "tunnel",
        name: "Tunnel",
        type: n,
        size: {
          x: 3,
          y: 1
        },
        spriteScale: 2,
        buttonOffset: {
          x: -300,
          y: -100
        },
        catOffset: {
          x: 0,
          y: 0
        },
        animOffset: {
          x: 5,
          y: -74.5
        },
        labelOffset: {
          x: 0,
          y: -113
        },
        unlockedLevel: 48,
        interval: 360,
        attract: {
          bob: 40,
          max: 40,
          luna: 20
        },
        anim: {
          bob: {
            skeleton: "anim_tunnel_lvl_1",
            skin: "Tunnel_2",
            animation: "Tunnel_2-bob",
            catOffset: {
              x: -13,
              y: -80
            }
          },
          max: {
            skeleton: "anim_tunnel_lvl_1",
            skin: "Tunnel_2",
            animation: "Tunnel_2-max",
            catOffset: {
              x: -13,
              y: -80
            }
          },
          luna: {
            skeleton: "anim_tunnel_lvl_1",
            skin: "Tunnel_2",
            animation: "Tunnel_2-luna",
            catOffset: {
              x: -13,
              y: -80
            }
          }
        }
      }
    };
    var _default = {
      pattern: pattern,
      patternSize: patternSize,
      colors: colors,
      items: items
    };
    exports["default"] = _default;
    module.exports = exports["default"];
    cc._RF.pop();
  }, {} ]
}, {}, [ "AdManager", "AudioManager", "Scheduler", "app", "CatCommands", "ShopCommands", "confettiFx", "constants", "BagBoosterItem", "BagSupplyItem", "BoosterController", "BoosterItem", "BoosterUnlockPopup", "BottomUI", "BottomUIButton", "ButtonState", "CatAlert", "CatDialog", "CatItem", "CatTutorial", "CatView", "CircleProgress", "ConfirmationController", "EndGamePopup", "GiftPopup", "HeartFrameView", "MarkProgressIconView", "NoHeartPopup", "ObjectiveController", "ObjectiveItem", "PausePopup", "ProgressFrame", "QAPanel", "QuickBagPopup", "QuitConfirmationPopup", "ResultController", "RewardPopup", "SettingsPopup", "ShopConfirmPopup", "ShopItem", "Slider", "StartSelectionItem", "StartSelectionPopup", "SubsceneController", "TopUI", "TutorialController", "YardGlow", "YardItem", "YardItemView", "YardView", "spinner", "BagSubscene", "CatSubscene", "HomeSubscene", "ShopSubscene", "Debugger", "GameBoard", "GameItem", "bumper", "cabinet", "simpleCrate", "underlay", "GameTile", "Rnd", "SpriteCollection", "helpers", "catModels", "levelModel", "supplyModel", "yardModel", "Game", "Home", "boosters", "catTutorial", "cats", "development", "levels", "main", "types", "powerUpItem", "shop", "tutorials", "yard", "userState" ]);