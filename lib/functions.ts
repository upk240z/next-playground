import {BrowserQRCodeReader} from "@zxing/browser"

export const decodeQrcode = (image: HTMLImageElement): Promise<any> => {
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

export const initCamera = (movie: HTMLVideoElement) => {
  if (!movie || movie.srcObject) { return }

  const facing: 'environment' | 'user' = 'environment'

  navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: {
        exact: facing
      }
    }
  }).then(stream => {
    movie.srcObject = stream
  })
}
