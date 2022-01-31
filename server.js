const axios = require('axios');
const express = require('express')
const app = express()
const PORT = 6969;
const API_URL = 'https://statsapi.web.nhl.com/api/v1'
const CURRENT_SEASON = '20212022'

const seasons = [
    "19791980",
    "19801981",
    "19811982",
    "19821983",
    "19831984",
    "19841985",
    "19851986",
    "19861987",
    "19871988",
    "19881989",
    "19891990",
    "19901991",
    "19911992",
    "19921993",
    "19931994",
    "19941995",
    "19951996",
    "19961997",
    "19961997",
    "19971998",
    "19981999",
  ]

const gretzkyId = '8447400'

const gretzkyStats = []

// get all teams
app.get('/teams', async (req, res) => {
    try {
        const { data } = await axios.get(`${API_URL}/teams`);
        res.send(data.teams)
    } catch (error) {
        console.log(error.message)
    }
})

// get a single team
app.get('/team/:id', async (req, res) => {
    try {
        const { data } = await axios.get(`${API_URL}/teams/${req.params.id}`);
        res.send(data.teams)
    } catch (error) {
        console.log(error.message)
    }
})

// get team stats
app.get('/team/:id/stats', async (req, res) => {
    try {
        const { data } = await axios.get(`${API_URL}/teams/${req.params.id}?expand=team.stats`);
        res.send(data.teams[0].teamStats[0].splits)
    } catch (error) {
        console.log(error.message)
    }
})

// get a team roster
app.get('/team/:id/roster', async (req, res) => {
    try {
        const { data } = await axios.get(`${API_URL}/teams/${req.params.id}?expand=team.roster`);
        res.send(data.teams[0].roster.roster)
    } catch (error) {
        console.log(error.message)
    }
})

// get next game
app.get('/team/:id/next-game', async (req, res) => {
    try {
        const { data } = await axios.get(`${API_URL}/teams/${req.params.id}?expand=team.schedule.next`);
        res.send(data)
    } catch (error) {
        console.log(error.message)
    }
})

// get previous game
app.get('/team/:id/previous-game', async (req, res) => {
    try {
        const { data } = await axios.get(`${API_URL}/teams/${req.params.id}?expand=team.schedule.previous`);
        res.send(data.teams[0].previousGameSchedule.dates[0].games)
    } catch (error) {
        console.log(error.message)
    }
})

// get player
app.get('/player/:id', async (req, res) => {
    try {
        const { data } = await axios.get(`${API_URL}/people/${req.params.id}`)
        res.send(data.people[0])
    } catch (error) {
        console.log(error.message)
    }
})

// get player stats
app.get('/player/:id/stats', async (req, res) => {
    try {
        const { data } = await axios.get(`${API_URL}/people/${req.params.id}/stats?stats=statsSingleSeason&season=${CURRENT_SEASON}`)
        res.send(data.stats[0].splits[0])
    } catch (error) {
        console.log(error.message)
    }
})

// get gamelog stats for player
app.get('/player/:id/stats/game-log', async (req, res) => {
    try {
        const { data } = await axios.get(`${API_URL}/people/${req.params.id}/stats?stats=gameLog&season=${CURRENT_SEASON}`)
        res.send(data.stats[0].splits)
    } catch (error) {
        console.log(error.message)
    }
})

// gretzky career gamelog
app.get('/gretzky-gamelogs', async (req, res) => {
    let carreer_goals = 0
    let carreer_assists = 0
    let carreer_points = 0
    try {
        // for each season return the game log and save it to gretzkyStats
        seasons.forEach(async season => {
            let { data } = await axios.get(`https://statsapi.web.nhl.com/api/v1/people/8447400/stats?stats=gameLog&season=${season}`)
            gretzkyStats.push(...data.stats[0].splits)
        })
        
        let sorted = gretzkyStats.sort((a, b) => b.season - a.season)
        let gameStats = sorted.reverse().map((game, i) => {
            carreer_goals = carreer_goals + game.stat.goals
            carreer_assists = carreer_assists + game.stat.assists
            carreer_points = carreer_points + game.stat.goals + game.stat.assists
            let stats = {
                date: game.date,
                goals: game.stat.goals,
                assists: game.stat.assists,
                opponent: game.opponent.name,
                carreer_goals: carreer_goals,
                carreer_assists: carreer_assists,
                carreer_point: carreer_points,
                games_played: i
            }
            return stats
            })
        res.send(gameStats)
    } catch (error) {
        console.error(error.message)
    }
})

// get team rankings
app.get('/standings', async (req, res) => {
    try {
        const { data } = await axios.get(`${API_URL}/standings`)
        res.send(data.records)
    } catch (error) {
        console.error(error.message)
    }
})

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})

