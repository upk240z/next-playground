import type { NextApiRequest, NextApiResponse } from 'next'
import DocReader, { Doc } from "../../lib/doc-reader"
import Auth from "../../lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Doc[]|string>
) {
  const auth = new Auth(req, res)
  if (!auth.loggedIn()) {
    res.status(403).send('forbidden')
    return
  }

  const reader = new DocReader()
  res.status(200).json(await reader.getDocs(req.query['id'].toString()))
}
