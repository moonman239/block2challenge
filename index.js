const testLatitude = 39.14659888817281;
const testLongitude = -108.64285062918833;
import {RestaurantList} from './RestaurantList.js';
// Test to ensure successful fetch.
const restaurantList = await RestaurantList.fetchFromLatitudeLongitude(testLatitude,testLongitude);
async function test1()
{
    const next = restaurantList.getRestaurants(1);
    if (!next)
        throw new Error("Test 1 failed. Undefined location_id.");
    console.log("Test 1 passed.");
    }

// Test sorting by descending rating.
async function test2()
{
    const restaurantListCopy = new RestaurantList(restaurantList.getRestaurants(30));
    restaurantListCopy.sort("rating");
    let previousRating = 5;
    const restaurants = restaurantListCopy.getRestaurants(30);
    for (const i in restaurants)
    {
        const restaurant = restaurants[i];
        const rating = parseFloat(restaurant.rating);
        // We want the previous rating to be greater than or equal to the last rating.
        if (previousRating < rating)
            throw new Error("Test 2 failed.")
        previousRating = rating;
    }
    console.log("Test 2 passed.");
}

// Test sorting by ascending distance.
async function test3()
{
    const restaurantListCopy = new RestaurantList(restaurantList.getRestaurants(30));
    restaurantList.sort("distance");
    let previousDistance = -123456;
    const restaurants = restaurantListCopy.getRestaurants(30);
    for (const i in restaurants)
    {
        const distance = parseFloat(restaurants[i].distance);
        if (previousDistance === -123456)
            previousDistance = distance;
        if (distance < previousDistance)
            throw new Error("Test 3 failed.");
        previousDistance = distance;
    }
    console.log("Test 3 passed.");
}
// Test saving and loading favorites from local storage.
async function test4()
{
    const restaurantListCopy = new RestaurantList(restaurantList.getRestaurants(30));
    let favorites = new RestaurantList([]);
    const restaurants = restaurantList.getRestaurants(30);
    restaurants.map(restaurant => favorites.addRestaurant(restaurant));
    restaurants.map(restaurant => console.assert(favorites.includes(restaurant)));
    favorites.saveToStorage("favorites");
    const fetchedFavorites = RestaurantList.fromStorage("favorites");
    if (favorites.getRestaurants(Infinity).length !== fetchedFavorites.getRestaurants(Infinity).length)
        throw new Error("Mismatched length: " + favorites.getRestaurants(Infinity).length + "," + fetchedFavorites.getRestaurants(Infinity).length);
    for (const i in favorites)
    {
        if (favorites[i].location_id !== fetchedFavorites[i].location_id)
            throw new Error("Mismatched restaurants.");
    }
    console.log("Test 4 passed.");
}
test1();
test2();
test3();
test4();