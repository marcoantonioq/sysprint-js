import express from 'express'
import path from 'path'
import { promises as fs } from 'fs'
import { updatePrinterList } from '../../lib/updatePrinterList.js'
import { lp } from '../../lib/lp.js'
import multer from 'multer'

const uploadDir = path.join('/data/uploads')

async function ensureUploadDirExists() {
  try {
    await fs.access(uploadDir)
  } catch {
    await fs.mkdir(uploadDir, { recursive: true })
  }
}

ensureUploadDirExists()

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}${path.extname(file.originalname)}`),
})

const upload = multer({ storage })

export function setupRoutes(ap, _app) {
  ap.use((_req, _res, next) => next())

  ap.post('/api/print', upload.single('file'), async (req, res) => {
    const results = []
    try {
      const job = JSON.parse(req.body.data)
      console.log('Arquivo de impressão: ', job.path)

      job.buffer = req.file?.buffer
      job.path = req.file?.path.replace(/.*\//gi, '')

      const result = await lp(job)
      job.id = result.id
      job.status = 'printing'
      if (job.path) await fs.unlink(`/data/uploads/${job.path}`)
      console.log('Enviando impressão: ', job)
    } catch (error) {
      console.log('Falha ao relizar a impressão: ', req.body, error)
    }
    res.json(results)
  })

  ap.get('/api/printers', async (req, res) => {
    try {
      const printers = await updatePrinterList()
      res.json({ printers })
    } catch (error) {
      console.log(`Falha ao realizar buscar impressoras: ${error}`)
    }
  })
}
