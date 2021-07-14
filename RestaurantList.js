import distance from "./distance.js";
import { apiKey,placeSearchURL } from "./gmapsapi.js";
// TODO: Once a restaurant list has been loaded, save it with an expiration date.
export class RestaurantList
{
    #array; // Note: Refer to this using this.#array.
    #key; // Key for localStorage.
    #nextPageToken; // token for the next page.
    #pages; // array for pages.
    #currentPageNumber; // current page number.
    #expirationDate; // date when current data expires.
    constructor(array=[])
    {
        this.#array = array;
        if (array.length > 0)
            this.#pages = [array];
        else
            this.#pages = [];
        this.#currentPageNumber = 0;
    }
    static ratingFunction(x,y)
            {
                return (parseFloat(x.rating) > parseFloat(y.rating) || y.rating === undefined) ? -1 : 1;
            }
    static distanceFunction(x,y)
        {
            return (parseFloat(x.distance) < parseFloat(y.distance) || y.distance === undefined) ? -1 : 1;
        }
    // Check if list has next page.
    hasNextPage() {
        return this.#nextPageToken !== undefined || this.#currentPageNumber < this.#pages.length - 1 || this.#pages.length === 0;
    }
    // Fetch the next page from Google.
    async fetchNextPage()
    {
        // Assume userPosition has been set.
        let url = placeSearchURL + "?key=" + apiKey;
        const keyword = "";
        url += "&keyword=" + keyword;
        url += "&opennow=" + "true";
        url += "&location=" + userPosition.coords.latitude + "," + userPosition.coords.longitude;
        url += "&radius=" + 50000;
        url += "&type=restaurant";
        url += "&rankby=prominence";
        if (this.#nextPageToken)
            url += "&pagetoken=" + this.#nextPageToken;
        else
            console.log("No next page indicated.");
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
        if (!results)
            throw new Error("Empty array!");
        this.#array = results;
        this.#pages.push(results);
        console.log("New array length: " + this.#pages.length);
        console.log(this.#pages);
        this.#nextPageToken = json["next_page_token"];
        if (!this.#nextPageToken)
            console.log("This page has no next page.");
            }
            catch (error)
            {
                console.error(error);
            }
    }
    #previousPage()
    {
        const page = this.#pages[this.#currentPageNumber - 1];
        return page;
    }
    hasPreviousPage()
    {
        return this.#previousPage() !== undefined;
    }
    // Get the previous page.
    getPreviousPage()
    {
        if (!this.hasPreviousPage())
            throw new Error("undefined page");
        this.#array = this.#previousPage();
        this.#currentPageNumber -= 1;
    }
    // Get the next page.
    async getNextPage()
    {
        // Check if this is the last page in the array.
        const lastPageIndex = this.#pages.length - 1;
        console.log("Next page?" + this.hasNextPage());
        if (!this.hasNextPage())
            return 0;
        const nextPageNumber = this.#currentPageNumber + 1;
        if (this.#currentPageNumber >= lastPageIndex)
        {
            console.log("Fetching next page.");
            await this.fetchNextPage();
            this.saveToStorage();
        }
        else
        {
            console.log("Retrieving next page (page " + nextPageNumber + ") from memory.");
            const nextPage = this.#pages[nextPageNumber];
            if (nextPage === undefined)
                throw new Error("undefined page");
            else
                this.#array = nextPage;
        }
        this.#currentPageNumber = nextPageNumber;
    }
    setKey(key)
    {
        this.#key = key;
    }
    setExpirationDate(expirationDate)
    {
        this.#expirationDate = expirationDate;
    }
    static initWithStorage(key,expirationDate=undefined)
    {
        console.log("Storing with key " + key);
        const existingStorage = localStorage.getItem(key);
        let returnValue = new RestaurantList([]);
        if (existingStorage)
        {
            const object = JSON.parse(localStorage.getItem(key));
            if (object.expirationDate > new Date() || object.expirationDate === null)
                returnValue = new RestaurantList(object.pages[0]);
        }
        returnValue.setKey(key);
        returnValue.setExpirationDate(expirationDate);
        return returnValue;
    }
    saveToStorage()
    {
        console.log("Hello");
        const object = {pages: this.#pages,expirationDate: this.#expirationDate};
        const json = JSON.stringify(object);
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
        if (this.#array === undefined)
            throw new Error("Undefined array.");
        return this.#array.findIndex(x => x.place_id === restaurantId);
    }
    restaurantAt(restaurant_id)
    {
        const index = this.#findRestaurantWithId(restaurant_id);
        if (index < 0)
            throw new Error("Could not find restaurant id " + restaurant_id);
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
