const axios = require('axios');
const express = require('express')
const app = express()
const PORT = 6969;
const API_URL = 'https://statsapi.web.nhl.com/api/v1'
const CURRENT_SEASON = '20212022'

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
        res.send(data.teams)
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
        res.send(data)
    } catch (error) {
        console.log(error.message)
    }
})

// get player
app.get('/player/:id', async (req, res) => {
    try {
        const { data } = await axios.get(`${API_URL}/people/${req.params.id}`)
        res.send(data.people)
    } catch (error) {
        console.log(error.message)
    }
})

// get player stats
app.get('/player/:id/stats', async (req, res) => {
    try {
        const { data } = await axios.get(`${API_URL}/people/${req.params.id}/stats?stats=statsSingleSeason&season=${CURRENT_SEASON}`)
        res.send(data.stats)
    } catch (error) {
        console.log(error.message)
    }
})

// get gamelog stats for player
app.get('/player/:id/stats/game-log', async (req, res) => {
    try {
        const { data } = await axios.get(`${API_URL}/people/${req.params.id}/stats?stats=gameLog&season=${CURRENT_SEASON}`)
        res.send(data.stats)
    } catch (error) {
        console.log(error.message)
    }
})

app.listen(PORT, () => {
    console.log(`listeing on port ${PORT}`)
})

