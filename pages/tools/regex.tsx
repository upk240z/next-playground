import {NextPage} from "next";
import Head from "next/head";
import Nav from "../../layouts/nav";
import Message from "../../components/message";
import Footer from "../../layouts/footer";
import React, {useState} from "react";

const Page: NextPage = () => {
  const [message, setMessage] = useState<string | null>(null)
  const [msgClass, setMsgClass]  = useState<string>('alert-success')
  const [matchStrings, setMatch] = useState<string[]>([])

  const handleSubmit = (event: any) => {
    event.preventDefault()
    setMessage(null)
    setMatch([])

    try {
      const regex = eval(event.target.regex.value)
      const result = regex.exec(event.target.target.value)
      if (result === null) {
        setMsgClass('alert-danger')
        setMessage('Unmatched')
        return
      }

      setMatch([...result].map((value, index) => {
        return value
      }))
    } catch (e: any) {
      setMsgClass('alert-danger')
      setMessage(e.toString())
    }
  }

  const handleClick = () => {
    setMatch([])
  }

  const matchElements = matchStrings.map((value, index) => {
    return <li key={index}><span className="mr-2 px-3 py-1 bg-blue-500 rounded-full text-white">{index}</span>{value}</li>
  })

  return (
    <div className="container">
      <Head><title>RegEx</title></Head>
      <Nav/>
      <main>
        <h1>RegEx checker</h1>

        <Message message={message} className={msgClass}/>

        <div className="card mt-5">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="regex" className="block mb-2">RegEx</label>
                <input type="text" name="regex"/>
              </div>
              <div className="mt-2">
                <label htmlFor="target" className="block mb-2">Target</label>
                <textarea name="target"></textarea>
              </div>
              <div className="mt-2">
                <button className="btn-primary w-full">Check</button>
              </div>
            </form>
          </div>
        </div>

        {
          matchStrings.length > 0 ?
            <div className="h-screen w-full fixed left-0 top-0 flex justify-center items-center bg-black bg-opacity-50">
              <div className="bg-white rounded shadow-lg w-2/3">
                <div className="border-b px-4 py-2 flex justify-between items-center">
                  <h3 className="font-semibold text-lg">Match results</h3>
                  <button onClick={handleClick} className="text-black close-modal">x</button>
                </div>
                <div className="p-3">
                  <div className="sm:flex sm:items-center px-2 py-4">
                    <div className="flex-grow">
                      <ul className="list-reset flex flex-col shadow-lg list-group">
                        {matchElements}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end items-center w-100 border-t p-3">
                  <button onClick={handleClick}
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white mr-1 close-modal">
                    Close
                  </button>
                </div>
              </div>
            </div>
            : null
        }

      </main>

      <Footer/>
    </div>
  )
}

export default Page
