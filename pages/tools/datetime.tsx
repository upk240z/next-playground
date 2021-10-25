import React, {useEffect, useRef, useState} from "react"
import {NextPage} from "next"
import Head from "next/head"

const strtotime = require('strtotime');
import TextField from '@mui/material/TextField'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

import Util from "../../lib/util"
import Nav from "../../layouts/nav"
import Message from "../../components/message"
import Footer from "../../layouts/footer"

const Page: NextPage = () => {
  const [message, setMessage] = useState<string | null>(null)
  const [msgClass, setMsgClass]  = useState<string>('alert-success')
  const timestampRef = useRef(null)
  const dateRef = useRef(null)

  useEffect(() => {
    console.log(timestampRef.current)
    if (timestampRef.current) {
      const element = timestampRef.current as HTMLInputElement
      console.log('@@@@@@@@@@@@ set')
      element.value = Util.now().toString()
    }
    if (dateRef.current) {
      const element = dateRef.current as HTMLInputElement
      element.value = Util.dateFormat('%Y-%m-%d %H:%M:%S')
    }
  }, [])

  const handleTimestamp = (event: any) => {
    if (event.target.value.length == 0 ) { return }
    const time = parseInt(event.target.value)
    const date = Util.dateFormat('%Y-%m-%d %H:%M:%S', time)
    if (dateRef.current) {
      const element = dateRef.current as HTMLInputElement
      element.value = date
    }
  }

  const handleDate = (event: any) => {
    if (event.target.value.length == 0) { return }
    const timeStr = event.target.value.indexOf(':') < 0 ?
      event.target.value + ' 00:00:00' : event.target.value
    const time = strtotime(timeStr)
    if (!time) {
      setMsgClass('alert-danger')
      setMessage('wrong date text')
      return
    } else {
      setMessage(null)
    }

    if (timestampRef.current) {
      const element = timestampRef.current as HTMLInputElement
      element.value = time.toString()
    }
  }

  return (
    <div className="container">
      <Head><title>Datetime</title></Head>
      <Nav/>

      <main>
        <h1>Datetime</h1>

        <Message message={message} className={msgClass}/>

        <Card className="mt-5">
          <CardContent>
            <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-5">
              <TextField
                name="timestamp"
                label="Timestamp"
                type="number"
                required={true}
                inputRef={timestampRef}
                onChange={handleTimestamp}
                defaultValue=""
                className="w-full"
              />
              <TextField
                name="date"
                label="Date"
                type="text"
                required={true}
                inputRef={dateRef}
                onChange={handleDate}
                defaultValue=""
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer/>
    </div>
  )
}

export default Page
