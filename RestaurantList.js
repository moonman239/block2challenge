import { apiKey,placeSearchURL } from "./gmapsapi.js";

export class RestaurantList
{
    #array; // Note: Refer to this using this.#array.
    #key; // Key for localStorage.
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
        if (restaurantArray === undefined)
            throw new Error("Undefined array.");
        this.#array = restaurantArray;
        this.#key = "";
    }

    setKey(key)
    {
        this.#key = key;
    }
    static initWithStorage(key)
    {
        const existingStorage = localStorage.getItem(key);
        let returnValue = new RestaurantList([]);
        if (existingStorage)
        {
            const array = JSON.parse(localStorage.getItem(key));
            returnValue = new RestaurantList(array);
        }
        returnValue.setKey(key);
        return returnValue;
    }
    saveToStorage()
    {
        console.log("Hello");
        const json = JSON.stringify(this.#array);
        console.log("Saving " + json);
        localStorage.setItem(this.#key,json);
    }
    addRestaurant(restaurant)
    {
        if (this.#findRestaurantWithId(restaurant.place_id) > -1)
        // already exists.
            throw new Error("Restaurant already exists in restaurantList.");
        this.#array.push(restaurant);
        console.log("Adding restaurant with location id " + restaurant.place_id);
    }
    removeRestaurant(restaurant)
    {
        const index = this.#findRestaurantWithId(restaurant.place_id);
        if (index === -1)
            throw new Error("Restaurant does not exist in restaurantList.");
        this.#array.splice(index, 1);
    }
    static async fetchFromLatitudeLongitude(latitude,longitude)
    {
        // Create a GET query string to pass parameters.
        const formData = new FormData();
        let url = placeSearchURL + "?key=" + apiKey;
        const keyword = "";
        url += "&keyword=" + keyword;
        url += "&opennow=" + "true";
        url += "&location=" + latitude + "," + longitude;
        url += "&radius=" + 50000;
        url += "&type=restaurant";
        try {
         const response = await fetch(url, {
                    "method": "GET",
                });
        if (!response.ok)
                throw new Error(response.statusText);
        const json = await response.json();
        console.log(json);
        const results = json["results"];
        return new RestaurantList(results);
            }
            catch (error)
            {
                console.error(error);
            }
    }
    #findRestaurantWithId(restaurantId)
    {
        return this.#array.findIndex(x => x.location_id === restaurantId);
    }
    restaurantAt(restaurant_id)
    {
        const index = this.#findRestaurantWithId(restaurant_id);
        console.log("Restaurant index: " + index);
        return this.#array[index];
    }
    includes(restaurant)
    {
        console.log("Checking for restaurant with id " + restaurant.place_id);
        if (restaurant.place_id === undefined)
            throw new Error("Undefined location id.");
        const index = this.#findRestaurantWithId(restaurant.place_id);
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
    // Get the number of restaurants in the list.
    numRestaurants()
    {
        return this.#array.length;
    }
}
