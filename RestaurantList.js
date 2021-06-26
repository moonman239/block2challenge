const baseURL = "https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng?latitude=";
 const apiKey = "1167886aeemsh061eed0f807e535p17f6aajsnc70cd0d6bdaa";
import fetch from "node-fetch";

export class RestaurantList
{
    constructor(restaurantArray)
    {
        this.array = restaurantArray;
        this.i = 0;
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
    * generator()
    {
        yield this.array[this.i]; 
    }
}
