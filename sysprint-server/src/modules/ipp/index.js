import ipp from 'ipp'
import { updatePrinterList } from '../../lib/updatePrinterList.js'

export async function startIPP(app) {
  console.log('MODULO: IPP')
  app.printers = await updatePrinterList()
  setInterval(async () => {
    app.printers = await updatePrinterList()
  }, 60000)
}

// Endereço e porta do serviço CUPS
const CUPS_HOST = 'http://localhost:631'

// Crie uma nova conexão com o serviço CUPS
new ipp.Printer(`${CUPS_HOST}/printers/ADM`)

// ...existing code...
