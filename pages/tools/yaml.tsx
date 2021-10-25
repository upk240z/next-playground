import React, {useState} from "react";
import {NextPage} from "next"
import Head from "next/head";

import YAML from 'yaml'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

import Nav from "../../layouts/nav";
import Message from "../../components/message";
import Footer from "../../layouts/footer";
import ResultCanvas from "../../components/result-canvas";

const Page: NextPage = () => {
  const [message, setMessage] = useState<string | null>(null)
  const [msgClass, setMsgClass]  = useState<string>('alert-success')
  const [jsonText, setJson] = useState<string>('')
  const [phpText, setPhp] = useState<string>('')

  const handleSubmit = (event: any) => {
    event.preventDefault()

    setMessage(null)
    setJson('');
    setPhp('');

    try {
      const parsed = YAML.parse(event.target.yaml.value)
      const json = JSON.stringify(parsed, null, 2)
      setJson(json)
      setPhp(
        json
          .replace(': ', ' => ')
          .replace(':', ' => ')
          .replace('{', '[')
          .replace('}', ']')
      )

      setMsgClass('alert-success')
      setMessage('success')
    } catch (e: any) {
      setMsgClass('alert-danger')
      setMessage(e.toString())
    }
  }

  return (
    <div className="container">
      <Head><title>YAML</title></Head>
      <Nav/>
      <main>
        <h1>YAML Parser</h1>

        <Message message={message} className={msgClass}/>

        <form onSubmit={handleSubmit}>
          <Card className="mt-5">
            <CardContent>
              <TextField
                name="yaml"
                label="YAML"
                multiline
                rows={4}
                className="w-full"
              />
              <div className="mt-3">
                <Button type="submit" variant="contained" className="w-full">Parse</Button>
              </div>
            </CardContent>
          </Card>
        </form>

        <ResultCanvas title="JSON" text={jsonText}/>
        <ResultCanvas title="PHP" text={phpText}/>

      </main>

      <Footer/>
    </div>
  )
}

export default Page
