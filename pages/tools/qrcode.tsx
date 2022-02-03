import React, {useRef, useState} from "react";
import {NextPage} from "next"
import Head from "next/head";

import {Paper, Typography, TextField} from '@mui/material'
import {green} from "@mui/material/colors"

import Nav from "../../layouts/nav";
import Message from "../../components/message";
import {detectQrcode} from "../../lib/functions";

const Page: NextPage = () => {
  const [message, setMessage] = useState<string>('')
  const [msgClass, setMsgClass]  = useState<string>('alert-success')
  const [resultJson, setResultJson] = useState<string>('')
  const [imgUrl, setImgUrl] = useState<string>('')
  const refInput = useRef(null)
  const refFile = useRef(null)
  const refImage = useRef(null)

  const handleClick = (evt: any) => {
    if (!refFile.current) { return }
    const file = refFile.current as HTMLInputElement
    file.click()
  }

  const handleChangeImage = (evt: any) => {
    const fileElement = evt.target as HTMLInputElement
    if (
      !fileElement.files || fileElement.files.length == 0 || !refImage.current
    ) { return }

    const imgElement = refImage.current as HTMLImageElement
    const file = fileElement.files[0]
    const _url = window.URL.createObjectURL(file);
    imgElement.src = _url
    setImgUrl(_url)

    if (refInput.current) {
      const inputElement = refInput.current as HTMLInputElement
      inputElement.value = file.name
    }

    detectQrcode(imgElement).then(result => {
      setMessage('')
      setResultJson(JSON.stringify(result, null, 2))
    }).catch(e => {
      setMsgClass('alert-danger')
      setMessage(e)
      setResultJson('')
    })
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
          <Typography component="h2" variant="h6" sx={{color: green[800]}}>
            Select QRCode image
          </Typography>
          <div className="mt-2">
            <TextField
              inputRef={refInput}
              label="QRCode image"
              variant="outlined"
              InputProps={{readOnly: true}}
              onClick={handleClick}
              className="w-full"
            />
            <input ref={refFile} type="file" onChange={handleChangeImage} className="hidden"/>
          </div>
          <div className={imgUrl ? 'p-3' : 'hidden'} style={{maxWidth: '500px'}}>
            <img ref={refImage} alt="Selected image"/>
          </div>
        </Paper>

        <Paper
          sx={{mt: 3, p: 2}}
          className={resultJson ? '' : 'hidden'}
        >
          <Typography component="h2" variant="h6" sx={{color: green[800]}}>
            Detected result
          </Typography>
          <pre className="p-2 bg-blue-50 text-gray-600 text-sm">{resultJson}</pre>
        </Paper>
      </main>
    </div>
  )
}

export default Page
