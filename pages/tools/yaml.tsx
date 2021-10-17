import {NextPage} from "next"
import Head from "next/head";
import Nav from "../../layouts/nav";
import React, {useState} from "react";
import Message from "../../components/message";
import YAML from 'yaml'
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
      const parsed = YAML.parse(event.target.json.value)
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
      console.log(e)
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

        <div className="card mt-5">
          <form onSubmit={handleSubmit}>
            <div className="card-title">
              <h4>YAML</h4>
            </div>
            <div className="card-body">
              <textarea name="json" className="text-sm"></textarea>
              <div className="mt-1">
                <button className="btn-primary">Parse</button>
              </div>
            </div>

          </form>
        </div>

        <ResultCanvas title="JSON" text={jsonText}/>
        <ResultCanvas title="PHP" text={phpText}/>

      </main>

      <Footer/>
    </div>
  )
}

export default Page
