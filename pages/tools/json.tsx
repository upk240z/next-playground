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
  const [prettyText, setPretty] = useState<string>('')
  const [yamlText, setYaml] = useState<string>('')
  const [phpText, setPhp] = useState<string>('')

  const handleSubmit = (event: any) => {
    event.preventDefault()

    setMessage(null)
    setPretty('')
    setYaml('');
    setPhp('');

    const json = event.target.json.value

    try {
      const parsed = JSON.parse(json)
      const pretty = JSON.stringify(parsed, null, 2)
      setPretty(pretty)
      setYaml(YAML.stringify(parsed))
      setPhp(
        pretty
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
      <Head><title>JSON</title></Head>
      <Nav/>
      <main>
        <h1>JSON Parser</h1>

        <Message message={message} className={msgClass}/>

        <div className="card mt-5">
          <form onSubmit={handleSubmit}>
            <div className="card-title">
              <h4>JSON</h4>
            </div>
            <div className="card-body">
              <textarea name="json" className="text-sm"></textarea>
              <div className="mt-1">
                <button className="btn-primary">Parse</button>
              </div>
            </div>

          </form>
        </div>

        <ResultCanvas title="YAML" text={yamlText}/>
        <ResultCanvas title="PHP" text={phpText}/>
        <ResultCanvas title="Pretty print" text={prettyText}/>

      </main>

      <Footer/>
    </div>
  )
}

export default Page
