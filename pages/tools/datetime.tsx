import {NextPage} from "next";
import React, {useEffect, useRef, useState} from "react";
import Util from "../../lib/util";
import Head from "next/head";
import Nav from "../../layouts/nav";
import Message from "../../components/message";
import Footer from "../../layouts/footer";
const strtotime = require('strtotime');

const Page: NextPage = () => {
  const [message, setMessage] = useState<string | null>(null)
  const [msgClass, setMsgClass]  = useState<string>('alert-success')
  const timestampRef = useRef(null)
  const dateRef = useRef(null)

  useEffect(() => {
    if (timestampRef.current) {
      const element = timestampRef.current as HTMLInputElement
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

      <h1>Datetime</h1>

      <Message message={message} className={msgClass}/>

      <main>

        <div className="card mt-5">
          <div className="card-body">
            <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="">
                <label>
                  <span className="text-gray-700">Timestamp</span>
                  <input type="number" className="mt-1" onChange={handleTimestamp}
                         name="timestamp" required={true} ref={timestampRef}/>
                </label>
              </div>

              <div className="">
                <label>
                  <span className="text-gray-700">Date</span>
                  <input type="text" className="mt-1" onChange={handleDate}
                         name="date" required={true} ref={dateRef}/>
                </label>
              </div>
            </div>
          </div>
        </div>

      </main>

      <Footer/>
    </div>
  )
}

export default Page
