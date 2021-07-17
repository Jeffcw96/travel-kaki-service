const express = require('express')
const router = express.Router()
const auth = require("../middleware/auth")
const axios = require('axios')
const NearBy = require("../controller/nearby")
const User = require("../controller/user")
const GoogleAPI = require("../controller/googleApi")
const SKIP = undefined
router.post("/nearby", auth, async (req, res) => {
    try {
        let isSuperAdmin = false
        const { locationsGeometry, type, rating } = req.body
        const userId = req.user ? req.user.id : null
        if (userId) {
            const user = new User(userId, "")
            if (await user.verifyUserFromDB()) {
                isSuperAdmin = true
            }
        }
        const nearBySearvice = new NearBy(locationsGeometry, "", type, rating)
        const queryResults = await nearBySearvice.findPlacesByLocations(isSuperAdmin)
        const [shops, nextPageTokens] = nearBySearvice.cleanUpResponseResults(queryResults)
        const result = nearBySearvice.filterShopsBy2DArray(shops)
        res.json({ shops: result, moreShops: nextPageTokens })
    } catch (error) {
        console.error(error.message)
        res.status(500).send("SERVER ERROR")
    }
})

router.post("/placesNearMe", async (req, res) => {
    try {
        const { address, type, radius, rating } = req.body
        const googleAPIService = new GoogleAPI()
        const nearBySearvice = new NearBy("", "", type, rating)
        let [shops, nextPageTokens, URL] = await googleAPIService.nearBySearch({ lat: address.lat, lng: address.lng, type, radius })

        if (nextPageTokens && URL) {
            setTimeout(async () => {
                const moreShops = await googleAPIService.handleNextPageQueryOnce(nextPageTokens, URL)
                shops.push(moreShops)
                shops = shops.flat(Infinity)
                const result = nearBySearvice.filterShopsByRating(shops)

                res.json({ shops: result })
            }, 2000)

        } else {
            res.json({ shops })
        }


    } catch (error) {
        console.error(error.message)
        res.status(500).send('SERVER ERROR')
    }
})



router.get("/placedetail", async (req, res) => {
    try {
        const { placeId } = req.query
        const googleAPIService = new GoogleAPI()
        const result = await googleAPIService.placeDetails(placeId)
        // const URL = `${process.env.GoogleEndPoint}/place/details/json?key=${process.env.APIKey}&place_id=${placeId}`;
        // const result = await axios.get(URL);
        res.json(result)


    } catch (error) {
        console.error(error.message)
        res.status(500).send('SERVER ERROR')
    }
})

router.get('/finddistance', async (req, res) => {
    try {
        const googleAPIService = new GoogleAPI()
        const { originPlaceId, destinationPlaceId } = req.query
        // const URL = `${process.env.GoogleEndPoint}/distancematrix/json?origins=place_id:${originPlaceId}&destinations=place_id:${destinationPlaceId}&key=${process.env.APIKey}`
        // const result = await axios.get(URL);
        const result = await googleAPIService.distanceMatric(originPlaceId, destinationPlaceId)
        res.json({ result })

    } catch (error) {
        console.error(error.message)
        res.status(500).send('SERVER ERROR')
    }
})

router.post('/placeImage', async (req, res) => {
    try {
        console.log("place image api")
        const { imageUrl } = req.body
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        let base64Image = Buffer.from(response.data, 'binary').toString('base64')
        res.json({ url: `data:${response.headers['content-type'].toLowerCase()};base64,${base64Image}` })

    } catch (error) {
        console.error(error.message)

        res.status(500).send('SERVER ERROR')
    }
})


module.exports = router
