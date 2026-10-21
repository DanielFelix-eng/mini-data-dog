import { schedule } from '@netlify/functions'
import { connectedDB } from '../../api/db/db.js'
import { monitorService } from '../../api/services/monitorService.js'

export default schedule('* * * * *', async () => {
  await connectedDB()
  await monitorService()
})
