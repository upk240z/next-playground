import React, {useEffect, useState} from "react"
import {NextPage} from "next"
import Head from "next/head"

import axios from "axios"
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import Snackbar from '@mui/material/Snackbar';

import Nav from "../../layouts/nav"
import Footer from "../../layouts/footer"
import Message from "../../components/message"
import Util from "../../lib/util";

const Page: NextPage = () => {
  const [holidays, setHolidays] = useState([])
  const [sbOpen, setSnackBar] = useState<boolean>(false)
  const [sbMsg, setSbMsg] = useState<string>('')

  useEffect(() => {
    axios.get('/api/holidays').then((response) => {
      setHolidays(response.data)
    })
  }, [])

  const handleClick = (event: any) => {
    const element = event.target as HTMLElement
    Util.copyClip(element.innerText)
    setSbMsg('Copied!!')
    setSnackBar(true)
  }

  const handleSbClose = () => setSnackBar(false)

  const holidayElements = holidays.map((value: any, index: number) => {
    return (
      <ListItem key={index}>
        <Chip label={value['date']} color="warning" className="mr-3" onClick={handleClick}/>
        <ListItemText primary={value['name']}/>
      </ListItem>
    )
  })

  return (
    <div className="container">
      <Head><title>Holidays</title></Head>
      <Nav/>
      <main>
        <h1>Holidays</h1>

        {
          holidayElements.length > 0 ?
            <List>
              { holidayElements }
            </List> :
            <Message message="Loading..." className="alert-success"></Message>
        }

      </main>

      <Footer/>

      <Snackbar
        open={sbOpen}
        autoHideDuration={3000}
        message={sbMsg}
        onClose={handleSbClose}
      />
    </div>
  )
}

export default Page
