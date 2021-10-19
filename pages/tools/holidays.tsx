import {NextPage} from "next"
import Head from "next/head"
import Nav from "../../layouts/nav"
import Footer from "../../layouts/footer"
import React, {useEffect, useState} from "react"
import axios from "axios"
import Message from "../../components/message"

const Page: NextPage = () => {
  const [holidays, setHolidays] = useState([])

  useEffect(() => {
    axios.get('/api/holidays').then((response) => {
      setHolidays(response.data)
    })
  }, [])

  const holidayElements = holidays.map((value: any, index: number) => {
    return (
      <li key={index}>
        <span className="px-3 py-1 bg-green-700 rounded-full text-white mr-2">{value['date']}</span>{value['name']}
      </li>
    )
  })

  return (
    <div className="container">
      <Head><title>Holidays</title></Head>
      <Nav/>
      <main>
        <h1>Holidays</h1>

        <ul className="list-group mt-5">
          {
            holidayElements.length > 0 ?
              holidayElements : <Message message="Loading..." className="alert-success"></Message>
          }
        </ul>

      </main>

      <Footer/>
    </div>
  )
}

export default Page
