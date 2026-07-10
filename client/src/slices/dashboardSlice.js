import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  ownerId: null,
  stats: null,
  chartData: [],
  uptime: 0,
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    resetDashboard: () => initialState,

    setDashboardOwner: (state, action) => {
      state.ownerId = action.payload || null
    },

    // These reducers defensively clear data if the ownerId does not match.
    // This prevents stale cross-user data from being shown after login/logout.
    setDashboardStatsForOwner: (state, action) => {
      const { ownerId, stats } = action.payload || {}
      if (!ownerId || state.ownerId !== ownerId) {
        state.stats = null
        return
      }
      state.stats = stats
    },

    setDashboardChartDataForOwner: (state, action) => {
      const { ownerId, chartData } = action.payload || {}
      if (!ownerId || state.ownerId !== ownerId) {
        state.chartData = []
        return
      }
      state.chartData = Array.isArray(chartData) ? chartData : []
    },

    setDashboardUptimeForOwner: (state, action) => {
      const { ownerId, uptime } = action.payload || {}
      if (!ownerId || state.ownerId !== ownerId) {
        state.uptime = 0
        return
      }
      state.uptime = Number(uptime) || 0
    },
  },
})

export const {
  resetDashboard,
  setDashboardOwner,
  setDashboardStatsForOwner,
  setDashboardChartDataForOwner,
  setDashboardUptimeForOwner,
} = dashboardSlice.actions

export default dashboardSlice.reducer

