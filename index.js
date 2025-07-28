const express = require("express")
const cors = require("cors")
const dbConnection = require("./config/db.config")
const combineRouter = require("./routers/index")
const axios = require("axios")
require("dotenv").config()





const app = express()
const port = process.env.PORT || 3002
app.use(express.json())
app.use(cors({ origin: "*" }))
app.use("/api/v1", combineRouter)
dbConnection();

const GOOGLE_API_KEY = 'AIzaSyDo4GPTF9dChnFkV-uX5zoiA7JHZongxPI'

app.get('/api/autocomplete', async (req, res) => {
  try {
    const { input } = req.query

    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/autocomplete/json',
      {
        params: {
          input,
          key: GOOGLE_API_KEY,
          language: 'en'
        }
      }
    )

    console.log(response,'response of api autocomplete')

    return res.json(response.data)
  } catch (err) {
    console.error(err)
    res.status(500).send('Error fetching autocomplete')
  }
})


app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})
