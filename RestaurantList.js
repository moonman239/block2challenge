import distance from "./distance.js";
import { apiKey,placeSearchURL } from "./gmapsapi.js";
// TODO: Once a restaurant list has been loaded, save it with an expiration date.
export class RestaurantList
{
    #key; // Key for localStorage.
    #nextPageToken; // token for the next page.
    #pages; // array for pages.
    #currentPageNumber; // current page number.
    #expirationDate; // date when current data expires.
    constructor(array)
    {
        if (array.length > 0)
            this.#pages = [array];
        else
            this.#pages = [];
        this.#currentPageNumber = -1;
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
    numPages()
    {
        return this.#pages.length;
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
        if (json.status === "INVALID_REQUEST")
                throw new Error("Invalid Request, are you clicking too quickly?");
        const results = json["results"];
        // Calculate distances from user to restaurants.
        for (const i in results)
        {
            const restaurantCoords = {latitude: results[i].geometry.location.lat, longitude: results[i].geometry.location.lng};
            results[i].distance = distance(userPosition.coords,restaurantCoords);
        }
        if (!results)
            throw new Error("Empty array!");
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
    // assert that the next/previous page and the current page are not the same.
    #assertPage(page)
    {
        for (const i in page)
        {
            if (page[i].place_id === this.#pages[this.#currentPageNumber].place_id)
                throw new Error("Previous/next page is actually same page!");
        }
    }
    // Get the previous page.
    getPreviousPage()
    {
        if (!this.hasPreviousPage())
            throw new Error("undefined page");
        this.#assertPage(this.#previousPage);
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
        // check if next page is in memory.
        if (nextPageNumber >= this.#pages.length)
        {
            console.log("Fetching next page.");
            await this.fetchNextPage();
            this.saveToStorage();
        }
        else
        {
            console.log("Retrieving next page (page " + nextPageNumber + ") from memory.");
            const nextPage = this.#pages[nextPageNumber];
            if (nextPage.length === 0)
                throw new Error("empty page.");
            if (nextPage === undefined)
                throw new Error("undefined page");
            else
            {
                this.#assertPage(nextPage);
            }
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
        if (this.#pages.length === 0)
            throw new Error("no pages to save.");
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
        if (!this.#pages[this.#currentPageNumber])
            this.#pages[this.#currentPageNumber] = [];
        this.#pages[this.#currentPageNumber].push(restaurant);
        console.log("Adding restaurant with location id " + restaurant.place_id);
    }
    removeRestaurant(restaurant)
    {
        const index = this.#findRestaurantWithId(restaurant.place_id);
        if (index === -1)
            throw new Error("Restaurant does not exist in restaurantList.");
        this.#pages[0].splice(index, 1);
    }
    #findRestaurantWithId(restaurantId)
    {
        if (this.#pages[this.#currentPageNumber]=== undefined)
            return -1;
        return this.#pages[this.#currentPageNumber].findIndex(x => x.place_id === restaurantId);
    }
    restaurantAt(restaurant_id)
    {
        const index = this.#findRestaurantWithId(restaurant_id);
        if (index < 0)
            throw new Error("Could not find restaurant id " + restaurant_id);
        return this.#pages[this.#currentPageNumber][index];
    }
    includes(restaurant)
    {
        console.log("Checking for restaurant with id " + restaurant.place_id);
        if (restaurant.place_id === undefined)
            throw new Error("Undefined location id.");
        const index = this.#findRestaurantWithId(restaurant.place_id);
        return index > -1;
    }
    // gets 'count' restaurants starting at 'start'
    getRestaurants(count,start=0)
    {
        // TODO: code for the case when there are more restaurants than the API is returning.
        return this.#pages[this.#currentPageNumber].slice(start,start+count);
    }
    // Get the number of restaurants in the list.
    numRestaurants()
    {
        return this.#pages[this.#currentPageNumber].length;
    }
}
