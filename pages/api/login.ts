import type { NextApiRequest, NextApiResponse } from 'next'
import Util from "../../lib/util"
import Session from "../../lib/session"
import Auth from "../../lib/auth";

type LoginResult = {
  authenticated: boolean,
  token?: string,
  message?: string,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResult>
) {
  if (req.method == 'DELETE') {
    const session = new Session(req, res)
    session.remove('token')
    res.status(200).json({
      authenticated: false,
    })
    return
  }

  if (req.method == 'GET') {
    const auth = new Auth(req, res)
    res.status(200).json({
      authenticated: auth.loggedIn(),
    })
    return
  }

  if (req.method != 'POST') {
    res.status(404).json({
      authenticated: false,
    })
    return
  }

  if (!('id' in req.body) || !('password' in req.body)) {
    res.status(500).json({
      authenticated: false,
      message: 'wrong parameters'
    })
    return
  }

  if (
    process.env.loginId == Util.sha256(req.body['id']) &&
    process.env.loginPassword == Util.sha256(req.body['password'])
  ) {
    const token = Util.token()
    const session = new Session(req, res)
    session.set('token', token)
    res.status(200).json({
      authenticated: true,
      token: token
    });
  } else {
    res.status(200).json({
      authenticated: false,
      message: 'Wrong ID or Password.'
    });
  }
}
