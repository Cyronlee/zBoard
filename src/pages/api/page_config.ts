import path from 'path';
import fs from 'fs';
import { NextApiHandler } from 'next';

const filePath = path.join('/tmp/layouts.json');

const getLatestVersion = () => {
  if (!fs.existsSync(filePath)) return 0
  
  const pageConfigJSON = fs.readFileSync(filePath, 'utf-8')
  const pageConfig = JSON.parse(pageConfigJSON)
  return pageConfig.version || 0
}

const postPageConfigController: NextApiHandler = (req, res) => {
  const data = JSON.parse(req.body)

  fs.writeFileSync(filePath, JSON.stringify({
    ...data,
    version: getLatestVersion() + 1,
  }), 'utf8');
  return res.status(200).json({ success: true })
}

export const getPageConfig = () => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({ version: null }), 'utf-8')
    
    return {
      version: null
    }
  }

  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

const handler: NextApiHandler = async (req, res) => {
  if (req.method === 'POST') return postPageConfigController(req, res)

  if (req.method === 'GET') {
    const config = await getPageConfig()
    return res.status(200).json(config.version ? config : null)
  }

  return res.status(405).json({
    error: 'Method Not Allowed'
  })
}

export default handler