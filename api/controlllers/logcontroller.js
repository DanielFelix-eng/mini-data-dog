import MonitorLog from "../models/MonitorLog.js";
  
  export const fetchDownTime = async (req, res) => {
    try {
      const { projectId, monitorId, startDate, endDate, limit = 100 } = req.query;
      
      const query = { status: 'DOWN' };
      
      if (projectId) {
        query.project = projectId;
      }
      
      if (monitorId) {
        query.monitor = monitorId;
      }
      
      if (startDate || endDate) {
        query.checkedAt = {};
        if (startDate) query.checkedAt.$gte = new Date(startDate);
        if (endDate) query.checkedAt.$lte = new Date(endDate);
      }
  
      const downLogs = await MonitorLog.find(query)
        .populate('monitor', 'name type')
        .populate('project', 'name')
        .sort({ checkedAt: -1 })
        .limit(parseInt(limit));
  
      const downtimePeriods = [];
      const monitorIds = [...new Set(downLogs.map(log => log.monitor._id.toString()))];
      
      for (const monitorId of monitorIds) {
        const monitorDownLogs = downLogs.filter(log => log.monitor._id.toString() === monitorId);
        const monitorUpLogs = await MonitorLog.find({
          monitor: monitorId,
          status: 'UP',
          checkedAt: { $gte: monitorDownLogs[0].checkedAt }
        }).sort({ checkedAt: 1 }).limit(monitorDownLogs.length);
  
        let currentDownStart = null;
        
        for (const downLog of monitorDownLogs) {
          if (!currentDownStart) {
            currentDownStart = downLog.checkedAt;
          }
          
          const matchingUpLog = monitorUpLogs.find(upLog => upLog.checkedAt > downLog.checkedAt);
          
          if (matchingUpLog) {
            const duration = matchingUpLog.checkedAt - currentDownStart;
            downtimePeriods.push({
              monitor: downLog.monitor,
              project: downLog.project,
              startTime: currentDownStart,
              endTime: matchingUpLog.checkedAt,
              durationMs: duration,
              durationMinutes: Math.round(duration / 60000 * 100) / 100,
              error: downLog.error,
              recoveredAt: matchingUpLog.checkedAt,
            });
            currentDownStart = null;
          }
        }
  
        if (currentDownStart) {
          const duration = Date.now() - currentDownStart;
          downtimePeriods.push({
            monitor: monitorDownLogs[0].monitor,
            project: monitorDownLogs[0].project,
            startTime: currentDownStart,
            endTime: null,
            durationMs: duration,
            durationMinutes: Math.round(duration / 60000 * 100) / 100,
            error: monitorDownLogs[monitorDownLogs.length - 1].error,
            recoveredAt: null,
            ongoing: true,
          });
        }
      }
  
      const totalDowntimeMs = downtimePeriods.reduce((sum, period) => sum + period.durationMs, 0);
      const totalDowntimeMinutes = Math.round(totalDowntimeMs / 60000 * 100) / 100;
      const ongoingDowntimes = downtimePeriods.filter(p => p.ongoing).length;
  
      res.json({
        success: true,
        data: {
          totalDowntimeMs,
          totalDowntimeMinutes,
          ongoingDowntimes,
          totalIncidents: downtimePeriods.length,
          downtimePeriods: downtimePeriods.sort((a, b) => b.startTime - a.startTime),
          filters: { projectId, monitorId, startDate, endDate },
        },
      });
    } catch (error) {
      console.error('Error fetching downtime:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch downtime data',
        error: error.message,
      });
    }
  };
 
  //get all the   monitors
   export  const getAllLogs =  async (req,res) =>{
     try {
        const {monitorId} = req.query || req.params;
const  Logs  =  await MonitorLog.find({monitor:monitorId}).sort({checkedAt:-1});

 
 res.status(200).json({
 success: true,
  count: logs.length,
  data: logs
   } )
 } catch (error) {
        console.log(error);
         res.status(500).json({
          success: false,
          error: "Server Error"
        })
     }
  }
    //get a single incident
     export  const getLog=  async(req,res) =>{
         try{
             const  log=  await  MonitorLog.findById(req.params.id).populate("monitorId");
             res.json(log);
         }catch(error){
             res.status(500).json({
                 success: false,
                 error: "Server Error"
             });
         }
     }
     //create a new monitor log
     export const createLog= async (req,res) => {
         try{
             const {monitorId,logType,description} = req.body;
             const newLog = new MonitorLog({monitorId,logType,description});
             await newLog.save();
             res.json(newLog);  
         }catch(error) {
             
         }
     }