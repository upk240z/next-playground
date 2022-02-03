import {BrowserQRCodeReader} from "@zxing/browser"

export const detectQrcode = (image: HTMLImageElement): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    if (!image) { reject('no image') }

    try {
      const reader = new BrowserQRCodeReader()
      const result = await reader.decodeFromImageElement(image)
      resolve(result)
    } catch (err) {
      console.log(err)
      reject('decode error')
    }
  })
}
