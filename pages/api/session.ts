import type {NextApiRequest, NextApiResponse} from 'next'
import Session from "../../lib/session"

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = new Session(req, res)

  if (req.method == 'POST') {
    Object.keys(req.body).forEach(key => {
      session.set(key, req.body[key])
    })
    res.status(200).json({result: true})
    return
  }

  res.status(200).json(session.get())
}
