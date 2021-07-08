import distance from "./distance.js";
import { apiKey,placeSearchURL } from "./gmapsapi.js";

export class RestaurantList
{
    #array; // Note: Refer to this using this.#array.
    #key; // Key for localStorage.
    #nextPageToken; // token for the next page.
    static ratingFunction(x,y)
            {
                return (parseFloat(x.rating) > parseFloat(y.rating) || y.rating === undefined) ? -1 : 1;
            }
    static distanceFunction(x,y)
        {
            return (parseFloat(x.distance) < parseFloat(y.distance) || y.distance === undefined) ? -1 : 1;
        }
    // Fetch the next page from Google.
    async fetchNextPage()
    {
        console.log("Fetching next page.");
        // Assume userPosition has been set.
        let url = placeSearchURL + "?key=" + apiKey;
        const keyword = "";
        url += "&keyword=" + keyword;
        url += "&opennow=" + "true";
        url += "&location=" + userPosition.coords.latitude + "," + userPosition.coords.longitude;
        url += "&radius=" + 50000;
        url += "&type=restaurant";
        if (this.#nextPageToken)
            url += "&nextPageToken=" + this.#nextPageToken;
        try {
         const response = await fetch(url, {
                    "method": "GET",
                });
        if (!response.ok)
                throw new Error(response.statusText);
        const json = await response.json();
        console.log(json);
        const results = json["results"];
        // Calculate distances from user to restaurants.
        for (const i in results)
        {
            const restaurantCoords = {latitude: results[i].geometry.location.lat, longitude: results[i].geometry.location.lng};
            results[i].distance = distance(userPosition.coords,restaurantCoords);
        }
        // Sanity check: Should different pages have the same restaurant?
        for (const i in results)
        {
            if (this.#array === undefined)
                break;
            if (results[i].place_id === this.#array[i].place_id)
                console.log("Place id already in array.");
        }
        this.#array = results;
        this.#nextPageToken = json["next_page_token"];
            }
            catch (error)
            {
                console.error(error);
            }
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
