import {ColorNamed} from './ColorNamed';

const round = Math.round

function isString(obj) {
    return typeof obj === 'string'
}

function lc(str) {
    return str.toLowerCase()
}

/**
 * 把c控制在l和h之内
 * @param c 
 * @param low 
 * @param high 
 */
function confine(c:number, low:number, high:number) {
    c = Number(c)
    if (isFinite(c)) {
        if (c < low) {
            return low
        }
        return c > high ? high : c
    }
    return high
}

function hue2rgb(m1, m2, h) {
    if (h < 0) {
        ++h
    }
    if (h > 1) {
        --h
    }
    const h6 = 6 * h
    if (h6 < 1) {
        return m1 + (m2 - m1) * h6
    }
    if (2 * h < 1) {
        return m2
    }
    if (3 * h < 2) {
        return m1 + (m2 - m1) * (2 / 3 - h) * 6
    }
    return m1
}

/**
 * rgba到hsl 
 * @param r 
 * @param g 
 * @param b 
 * @param a 
 */
function rgb2hsl(r:number, g:number, b:number, a:number) {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    var h:number = 0;
    var s:number = 0;
    const l = (max + min) / 2

    if (max === min) {
        h = s = 0
    } else {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0)
                break
            case g:
                h = (b - r) / d + 2
                break
            case b:
                h = (r - g) / d + 4
                break
            default:
                break
        }
        h /= 6
    }
    return [h, s, l, a]
}

export class Color {
    r: number;
    g: number;
    b: number;
    a: number;

    build(/* Array|String|Object */ color):Color {
        var colorObj: Color = new Color();
        if (color) {
            if (isString(color)) {
                colorObj = Color.fromString(color)
            } else if (Array.isArray(color)) {
                colorObj = Color.fromArray(color)
            } else {
                this.set(color.r, color.g, color.b, color.a)
                if (!(color instanceof Color)) {
                    this.sanitize()
                }
            }
        } else {
            colorObj.set(255, 255, 255, 1)
        }
        return colorObj;
    }

    /**
     * 设置颜色
     * @param r 
     * @param g 
     * @param b 
     * @param a 
     */
    set(r:number, g:number, b:number, a:number) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    /**
     * 确保颜色数字正确
     */
    sanitize() {
        this.r = round(confine(this.r, 0, 255));
        this.g = round(confine(this.g, 0, 255));
        this.b = round(confine(this.b, 0, 255));
        this.a = confine(this.a, 0, 1);
        return this;
    }

    /**
     * 返回rgba(255, 255, 255, 1)
     */
    toRgba() {
        return [this.r, this.g, this.b, this.a];
    }

    /**
     * 转化到hsl
     */
    toHsla() {
        return rgb2hsl(this.r, this.g, this.b, this.a);
    }

    /**
     * 转化到16进制
     */
    toHex() {
        const arr = ['r', 'g', 'b'].map(x => {
            const str = this[x].toString(16);
            return str.length < 2 ? `0${str}` : str;
        })
        return `#${arr.join('')}`;
    }

    /**
     * 转化到rgba()/rgb()
     * @param includeAlpha 
     */
    toCss(includeAlpha:boolean) {
        const rgb = `${this.r},${this.g},${this.b}`;
        return includeAlpha ? `rgba(${rgb},${this.a})` : `rgb(${rgb})`;
    }

    toString() {
        return this.toCss(true);
    }

    /**
     * 转化到灰度
     */
    toGrey() {
        const g = round((this.r + this.g + this.b) / 3)
        return Color.makeGrey(g, this.a)
    }


    blendColors(/* Color */ start, /* Color */ end, /* Number */ weight, /* Color? */ obj) {
        const t = obj || new Color();
        ['r', 'g', 'b', 'a'].forEach(x => {
            t[x] = start[x] + (end[x] - start[x]) * weight
            if (x !== 'a') {
                t[x] = Math.round(t[x])
            }
        })
        return t.sanitize()
    }

    /**
     * 制作灰度颜色
     * @param g 
     * @param a 
     */
    static makeGrey(g:number,  a:number) :Color{
        return Color.fromArray([g, g, g, a])
    }

    static fromHex(/* String */ color) {
        const result = new Color()
        const bits = (color.length === 4) ? 4 : 8
        const mask = (1 << bits) - 1

        color = Number(`0x${color.substr(1)}`)

        if (isNaN(color)) {
            return null
        }
        ['b', 'g', 'r'].forEach(x => {
            const c = color & mask
            color >>= bits
            result[x] = bits === 4 ? 17 * c : c
        })
        return result
    }
    static fromRgb(/* String */ color) {
        const matches = lc(color).match(/^rgba?\(([\s.,0-9]+)\)/)
        return matches && Color.fromArray(matches[1].split(/\s*,\s*/))
    }
    static fromHsl(/* String */ color) {
        const matches = lc(color).match(/^hsla?\(([\s.,0-9]+)\)/)
        if (matches) {
            const c = matches[2].split(/\s*,\s*/)
            const l = c.length
            const H = ((parseFloat(c[0]) % 360) + 360) % 360 / 360
            const S = parseFloat(c[1]) / 100
            const L = parseFloat(c[2]) / 100
            const m2 = L <= 0.5 ? L * (S + 1) : L + S - L * S
            const m1 = 2 * L - m2
            const a = [
                hue2rgb(m1, m2, H + 1 / 3) * 256,
                hue2rgb(m1, m2, H) * 256,
                hue2rgb(m1, m2, H - 1 / 3) * 256,
                1
            ]
            if (l === 4) {
                a[3] = c[3]
            }
            return Color.fromArray(a)
        }
        return null
    }
    static fromArray(/* Array */ arr) {
        const result = new Color()
        result.set(Number(arr[0]), Number(arr[1]), Number(arr[2]), Number(arr[3]))
        if (isNaN(result.a)) {
            result.a = 1
        }
        return result.sanitize()
    }
    static fromString(/* String */ str) {
        const s = ColorNamed[str]
        return s && Color.fromHex(s) ||
            Color.fromRgb(str) ||
            Color.fromHex(str) ||
            Color.fromHsl(str)
    }

    static COLORNAME_KEYS:string[] = [];

    static randomColor(){
        if(Color.COLORNAME_KEYS.length == 0){
            for(let k in ColorNamed){
                Color.COLORNAME_KEYS.push(k);
            }
        }
        let key = Color.COLORNAME_KEYS[Math.floor(Math.random() * Color.COLORNAME_KEYS.length )];
        return ColorNamed[key];
    }
}
