const axios = require("axios")
class NearBy {
    constructor(locations, location, type, rating) {
        this.locations = locations
        this.location = location
        this.type = type
        this.rating = rating
    }

    //add user role validation here for proceed heavy request
    async findPlacesByLocations(isSuperAdmin) {
        if (!this.locations || !this.type || !this.rating) {
            throw new Error("PARAMS NOT FOUND")
        }
        console.log("findPlacesByLocations")
        const promises = []
        const type = this.type
        for (let location of this.locations) {
            const URL = `${process.env.GoogleEndPoint}/place/nearbysearch/json?location=${location.lat},${location.lng}&type=${type}&radius=${location.radius}&key=${process.env.APIKey}&opennow&rankby=prominence`;
            promises.push(axios.get(URL))
        }

        const results = await Promise.all(promises)
        return results
    }

    cleanUpResponseResults(results) {
        if (!results) {
            throw new Error("Shops Not Given")
        }
        let shops = []
        let nextPageTokens = []
        for (let shop of results) {
            shops.push(shop.data.results)
            nextPageTokens.push(shop.data.next_page_token)
        }

        return [shops, nextPageTokens]
    }

    filterShopsBy2DArray(shopsArr) {
        if (!shopsArr) {
            throw new Error("Shops Not Given")
        }
        const result = []
        shopsArr.forEach(shops => {
            shops.forEach(shop => {
                const x = result.find(item => item.place_id === shop.place_id);
                if (!x && shop.rating >= this.rating) {
                    const placeObj = {}
                    placeObj.place_id = shop.place_id
                    placeObj.geometry = shop.geometry
                    placeObj.rating = shop.rating
                    placeObj.name = shop.name
                    placeObj.vicinity = shop.vicinity
                    result.push(placeObj)
                }
            })
        })

        return result
    }

    filterShopsByRating(shopsArr) {
        return shopsArr.filter(shop => {
            return shop.rating >= this.rating
        })
    }

}

module.exports = NearBy