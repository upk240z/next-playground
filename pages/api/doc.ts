import type { NextApiRequest, NextApiResponse } from 'next'
import DocReader, { Doc } from "../../lib/doc-reader"
import Auth from "../../lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Doc|false|string>
) {
  const auth = new Auth(req, res)
  if (!auth.loggedIn()) {
    res.status(403).send('forbidden')
    return
  }

  const reader = new DocReader()

  const result: any = {
    result: true,
    message: ''
  }

  if (req.method == 'POST') {
    try {
      await reader.addDoc(
        req.body['folder_id'],
        req.body['title'],
        req.body['body'],
      )
    } catch (e: any) {
      result['result'] = false
      result['message'] = e.toString()
    }
    res.status(200).json(result)
    return
  } else if (req.method == 'PUT') {
    try {
      await reader.updateDoc(
        req.body['id'],
        req.body['title'],
        req.body['body'],
      )
    } catch (e: any) {
      result['result'] = false
      result['message'] = e.toString()
    }
    res.status(200).json(result)
    return
  } else if (req.method == 'DELETE') {
    try {
      await reader.deleteDoc(req.query['id'].toString())
    } catch (e: any) {
      result['result'] = false
      result['message'] = e.toString()
    }
    res.status(200).json(result)
    return
  }

  res.status(200).json(await reader.getDoc(req.query['id'].toString()))
}
