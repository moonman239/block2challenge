const baseURL = "https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng?latitude=";
 const apiKey = "1167886aeemsh061eed0f807e535p17f6aajsnc70cd0d6bdaa";
import { LocalStorage } from "node-localstorage";
var localStorage = new LocalStorage("./favorites");
import fetch from "node-fetch";

export class RestaurantList
{
    #array; // Note: Refer to this using this.#array.
    static ratingFunction(x,y)
            {
                return (parseFloat(x.rating) > parseFloat(y.rating) || y.rating === undefined) ? -1 : 1;
            }
    static distanceFunction(x,y)
        {
            return (parseFloat(x.distance) < parseFloat(y.distance) || y.distance === undefined) ? -1 : 1;
        }
    constructor(restaurantArray)
    {
        this.#array = restaurantArray;
        this.i = 0;
    }
    static fromStorage(key)
    {
    }
    saveToStorage(key)
    {

    }
    addRestaurant(restaurant)
    {
        this.#array.push(restaurant);
        console.log("Adding restaurant with location id " + restaurant.location_id);
    }
    static async fetchFromLatitudeLongitude(latitude,longitude)
    {
        const url = baseURL + latitude + "&longitude=" + longitude + "&currency=USD&open_now=false&lunit=mi&lang=en_US";
        console.log("Requesting url " + url);
        try {
         const response = await fetch(url, {
                    "method": "GET",
                    "headers": {
                        "x-rapidapi-key": apiKey,
                        "x-rapidapi-host": "travel-advisor.p.rapidapi.com"
                    }
                });
        if (!response.ok)
                throw new Error(response.statusText);
        const json = await response.json();
        const data = json["data"];
        return new RestaurantList(data);
            }
            catch (error)
            {
                console.error(error);
            }
    }
    includes(restaurant)
    {
        console.log("Checking for restaurant with id " + restaurant.location_id);
        if (restaurant.location_id === undefined)
            throw new Error("Undefined location id.");
        const index = this.#array.findIndex(x => x.location_id === restaurant.location_id);
        return index > -1;
    }
    sort(by)
    {
        if (by === "rating")
            this.#array = this.#array.sort(RestaurantList.ratingFunction);
        else if (by === "distance")
            this.#array = this.#array.sort(RestaurantList.distanceFunction);
    }
    // gets 'count' restaurants starting at 'start'
    getRestaurants(count,start=0)
    {
        // TODO: code for the case when there are more restaurants than the API is returning.
        return this.#array.slice(start,start+count);
    }
}
