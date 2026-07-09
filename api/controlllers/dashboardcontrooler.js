import Monitor from '../models/monitor.js'
export const getDashBoardStats = async (req, res) => {
    try {
        const monitors = await Monitor.find()
        const total = monitors.length
        const online = monitors.filter(
            (m) => m.lastStatus === 'UP'
        ).length

        const offline = monitors.filter(
            (m) => m.lastStatus === 'DOWN'
        ).length
        const averageResponseTime = total > 0
            ? Math.round(
                monitors.reduce(
                    (sum, m) => sum + (m.responseTime || 0),
                    0
                ) / total
            ) : 0
        res.json({
            total,
            online,
            offline,
            averageResponseTime,
        })
    } catch (error) {
        res.status(500).json('error')
    }
}
export const getResponseTime =
    async (req, res) => {
        try {
            const responseTimes = await Monitor.find(

            )
                .sort({
                    lastChecked: -1
                })
                .limit(20)
                .select('lastChecked lastResponseTime')
                .lean()
            res.status(200).json(responseTimes.reverse())
console.log(responseTimes)
        } catch (error) {
            res.status(500).json('error')
        }
    }