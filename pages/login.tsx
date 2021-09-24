import {NextPage} from "next"
import Head from "next/head"
import Footer from "../layouts/footer"
import Nav from "../layouts/nav"
import React, {useState, useEffect} from "react"
import Message from "../components/message"
import {useRouter} from "next/router";

const Page: NextPage = () => {
  const router = useRouter()
  const [message, setMessage] = useState<string | null>(null)

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
      setMessage('認証OK')
      router.replace('/docs/00000').catch(e => console.log(e))
    } else {
      setMessage(result.message)
    }
  }

  return (
    <div className="container mx-auto">
      <Head><title>Login</title></Head>
      <Nav/>
      <main>
        <h1>Login</h1>
        <Message message={message} className="alert-danger"/>
        <div className="card mt-5">
          <form onSubmit={handleSubmit}>
            <div className="flex">
              <div className="w-6/12 p-3">
                <label>
                  <span className="text-gray-700">ID</span>
                  <input type="text" className="mt-1" placeholder="" name="id" required={true}/>
                </label>
              </div>
              <div className="w-6/12 p-3">
                <label>
                  <span className="text-gray-700">Password</span>
                  <input type="password" className="mt-1" placeholder="" name="password" required={true}/>
                </label>
              </div>
            </div>
            <div className="p-3">
              <button className="btn-primary">Login</button>
            </div>
          </form>
        </div>
      </main>

      <Footer/>
    </div>
  )
}

export default Page
