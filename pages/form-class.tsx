import React from "react"
import Head from "next/head"

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

import Footer from "../layouts/footer"
import Nav from "../layouts/nav"
import Message from "../components/message"
import SampleForm from "../components/sample-form"

export default class Page extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      message: null,
      savedSession: {}
    }
  }

  componentDidMount() {
    this.readSession().then()
  }

  async readSession() {
    const res = await fetch('/api/session')
    const sessions = await res.json()
    this.setState({
      savedSession: sessions
    })
  }

  async handleSubmit(event: any) {
    event.preventDefault()

    this.setState({
      message: null
    })

    const params: any = {}
    params[event.target.key.value] = event.target.value.value

    const res = await fetch('/api/session', {
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    })

    const result = await res.json()

    if (result.result) {
      this.setState({
        message: 'Success'
      })
    } else {
      this.setState({
        message: 'failed'
      })
    }

    this.readSession().then()
  }

  render() {
    const lis = Object.keys(this.state.savedSession).map((key) => {
      return <li key={key} className="list-group">{key}: {this.state.savedSession[key]}</li>
    })

    return (
      <div className="container">
        <Head><title>Form(Class base)</title></Head>
        <Nav/>
        <main>
          <h1>Form(Class base)</h1>
          <Message message={this.state.message} className="alert-success"/>

          <Card className="mt-5">
            <CardContent>
              <SampleForm handle={this.handleSubmit.bind(this)}/>
              <div className="mt-5">
                <ul className="list-group">
                  {lis}
                </ul>
              </div>
            </CardContent>
          </Card>
        </main>

        <Footer/>
      </div>
    )
  }
}
