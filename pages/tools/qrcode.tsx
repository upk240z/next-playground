import React, {useRef, useState} from "react"
import {NextPage} from "next"
import Head from "next/head"

import {
  Paper, Typography, TextField, Box, Grid, Button, Switch,
  FormGroup, FormControlLabel
} from '@mui/material'
import {
  Camera as CameraIcon
} from '@mui/icons-material'

import Nav from "../../layouts/nav"
import Message from "../../components/message"
import {decodeQrcode, initCamera} from "../../lib/functions"

const Page: NextPage = () => {
  const [message, setMessage] = useState<string>('')
  const [msgClass, setMsgClass]  = useState<string>('alert-success')
  const [resultJson, setResultJson] = useState<string>('')
  const [selectedImg, setSelectedImg] = useState<boolean>(false)
  const [activeCamera, setActiveCamera] = useState<boolean>(false)
  const refInput = useRef(null)
  const refFile = useRef(null)
  const refImage = useRef(null)
  const refMovie = useRef(null)
  const refPicture = useRef(null)

  const handleClick = (evt: any) => {
    if (!refFile.current) { return }
    const file = refFile.current as HTMLInputElement
    file.click()
  }

  const selectQrImage = (url: string) => {
    if (!refImage.current) { return }
    const imgElement = refImage.current as HTMLImageElement
    imgElement.src = url
    setSelectedImg(true)

    decodeQrcode(imgElement).then(result => {
      setMessage('')
      setResultJson(JSON.stringify(result, null, 2))
      setMsgClass('alert-success')
      setMessage('Success')
    }).catch(e => {
      setMsgClass('alert-danger')
      setMessage(e)
      setResultJson('')
    })
  }

  const handleChangeImage = (evt: any) => {
    const fileElement = evt.target as HTMLInputElement
    if (
      !fileElement.files || fileElement.files.length == 0
    ) { return }

    const file = fileElement.files[0]
    if (refInput.current) {
      const inputElement = refInput.current as HTMLInputElement
      inputElement.value = file.name
    }
    selectQrImage(window.URL.createObjectURL(file))
  }

  const handleChangeCamera = (evt: any) => {
    const checkBox = evt.target as HTMLInputElement
    setActiveCamera(checkBox.checked)
    if (checkBox.checked) {
      initCamera(refMovie.current! as HTMLVideoElement)
    } else {
      setActiveCamera(false)
    }
    setResultJson('')
    setSelectedImg(false)
  }

  const handleShotCamera = () => {
    if (!refMovie.current || !refPicture.current) { return }
    const movie = refMovie.current as HTMLVideoElement
    const picture = refPicture.current as HTMLCanvasElement
    picture.width = movie.clientWidth;
    picture.height = movie.clientHeight;
    const context = picture.getContext('2d')
    if (!context) {
      console.error('2d context error')
      return
    }
    context.drawImage(movie, 0, 0, picture.width, picture.height)
    selectQrImage(picture.toDataURL('image/jpeg'))
  }

  return (
    <div className="container">
      <Head><title>QRCode Reader</title></Head>
      <Nav/>
      <main>
        <h1>QRCode Reader</h1>
        <Message message={message} className={msgClass}/>

        <Paper
          sx={{mt: 3, p: 2}}
        >
          <Typography component="h2" variant="h6" color="secondary">
            Select image
          </Typography>
          <Box sx={{ mb: 2 }}>
            <FormGroup>
              <FormControlLabel
                control={<Switch onChange={handleChangeCamera}/>}
                label="Use camera"
              />
            </FormGroup>
          </Box>
          <Box className={activeCamera ? 'hidden' : ''}>
            <TextField
              inputRef={refInput}
              label="QRCode image file"
              variant="outlined"
              InputProps={{readOnly: true}}
              onClick={handleClick}
              fullWidth
            />
          </Box>
          <Box className={activeCamera ? '' : 'hidden'} sx={{ display: 'flex', justifyContent: 'center'}}>
            <Box sx={{ maxWidth: 'md' }}>
              <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }} color="secondary">
                <Button
                  variant="contained"
                  sx={{ mr: 2 }}
                  onClick={handleShotCamera}
                  color="success"
                >
                  <CameraIcon/>
                </Button>
                Camera
              </Typography>
              <video ref={refMovie} autoPlay playsInline style={{ width: '100%' }}></video>
            </Box>
          </Box>
        </Paper>

        <Paper
          sx={{mt: 3, p: 2}}
          className={selectedImg ? '' : 'hidden'}
        >
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <Typography variant="h6" color="secondary">
                Selected image
              </Typography>
              <img ref={refImage} alt="Selected image"/>
            </Grid>
            <Grid item md={6} xs={12} className={resultJson ? '' : 'hidden'}>
              <Typography variant="h6" color="secondary">
                Decoded
              </Typography>
              <pre className="p-2 bg-blue-50 text-gray-600 text-sm">{resultJson}</pre>
            </Grid>
          </Grid>
        </Paper>
      </main>

      <Box className="hidden">
        <input ref={refFile} type="file" onChange={handleChangeImage}/>
        <canvas ref={refPicture}></canvas>
      </Box>
    </div>
  )
}

export default Page
