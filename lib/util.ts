import Blowfish from "egoroof-blowfish";
import crypto from "crypto";
import strftime from 'strftime';
const strtotime = require('strtotime');

export default class Util {
  public static transform(element: HTMLElement|null, keyframes: string[], duration: number = 300): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (element == null) {
        reject()
        return
      }
      const animation = element.animate(
        {transform: keyframes},
        {duration: duration, fill: 'forwards'}
      )
      animation.onfinish = () => {
        resolve()
      }
    })
  }

  private static blowfish(): Blowfish {
    const key = Buffer.from(process.env.secretKey!, 'hex');
    const iv = Buffer.from(process.env.secretIv!, 'hex');

    const bf = new Blowfish(
      key,
      Blowfish.MODE.CBC,
      Blowfish.PADDING.PKCS5
    );
    bf.setIv(iv);

    return bf;
  }

  public static encrypt(data: string): string {
    const bf = this.blowfish();
    return Buffer.from(bf.encode(data)).toString('hex');
  }

  public static decrypt(hex: string): string {
    const bf = this.blowfish();
    const decoded = bf.decode(Buffer.from(hex, 'hex'), Blowfish.TYPE.UINT8_ARRAY);
    return Buffer.from(decoded).toString('utf8');
  }

  public static sha256(text: string): string {
    return crypto.createHash('sha256').update(text, 'utf8').digest('hex');
  }

  public static token(): string {
    return this.encrypt((Date.now() + (1800000)).toString())
  }

  static now(): number {
    return Math.floor(Date.now() / 1000);
  }

  static dateFormat(format: string, dateValue: string|number|null = null): string {
    let time: number;
    if (dateValue === null) {
      time = this.now();
    } else if (typeof dateValue === 'string') {
      if (dateValue.indexOf(':') < 0) {
        time = strtotime(dateValue + ' 00:00:00');
      } else {
        time = strtotime(dateValue);
      }
    } else {
      time = dateValue;
    }
    return strftime(format, new Date(time * 1000));
  }

  public static copyClip(text: string): void {
    const element = document.getElementById('copy-board') as HTMLTextAreaElement;
    element.value = text;
    element.style.display = 'block';
    element.select();
    document.execCommand('copy');
    element.style.display = 'none';
  }
}
