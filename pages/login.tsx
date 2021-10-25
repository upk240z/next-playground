import {NextPage} from "next"
import Head from "next/head"
import React, {useState, useEffect} from "react"
import {useRouter} from "next/router";

import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

import Footer from "../layouts/footer"
import Nav from "../layouts/nav"
import Message from "../components/message"

const Page: NextPage = () => {
  const router = useRouter()
  const [message, setMessage] = useState<string | null>(null)
  const [msgClass, setClass] = useState<string | null>('danger')

  const handleSubmit = async (event: any) => {
    event.preventDefault()

    setMessage(null)

    const res = await fetch('/api/login', {
      body: JSON.stringify({
        id: event.target.id.value,
        password: event.target.password.value
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    })

    const result = await res.json()

    if (result.authenticated) {
      setClass('success')
      setMessage('認証OK')
      router.replace('/docs/00000').catch(e => console.log(e))
    } else {
      setClass('danger')
      setMessage(result.message)
    }
  }

  return (
    <div className="container">
      <Head><title>Login</title></Head>
      <Nav/>
      <main>
        <h1>Login</h1>
        <Message message={message} className={`alert-${msgClass}`} />

        <form onSubmit={handleSubmit}>
          <Card className="mt-5">
            <CardContent className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <TextField
                name="id"
                label="ID"
                type="text"
                required={true}
                defaultValue=""
                className="w-full"
              />
              <TextField
                name="password"
                label="Password"
                type="password"
                required={true}
                defaultValue=""
                className="w-full"
              />
              <Button type="submit" variant="contained" className="w-full">Login</Button>
            </CardContent>
          </Card>
        </form>

      </main>

      <Footer/>
    </div>
  )
}

export default Page
