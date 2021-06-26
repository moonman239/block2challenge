const testLatitude = 39.14659888817281;
const testLongitude = -108.64285062918833;
import {RestaurantList} from './RestaurantList.js';
import {FavoritesList} from './favoritesList.js';
// Test to ensure successful fetch.
async function test1()
{
    const restaurantList = await RestaurantList.fetchFromLatitudeLongitude(testLatitude,testLongitude);
    const next = restaurantList.getRestaurants(1);
    if (!next)
        throw new Error("Test 1 failed. Undefined location_id.");
    console.log("Test 1 passed.");
    }

// Test sorting by descending rating.
async function test2()
{
    const restaurantList = await RestaurantList.fetchFromLatitudeLongitude(testLatitude,testLongitude);
    restaurantList.sort("rating");
    let previousRating = 5;
    const restaurants = restaurantList.getRestaurants(30);
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
    const restaurantList = await RestaurantList.fetchFromLatitudeLongitude(testLatitude,testLongitude);
    restaurantList.sort("distance");
    let previousDistance = -123456;
    const restaurants = restaurantList.getRestaurants(30);
    for (const i in restaurants)
    {
        const restaurant = restaurants;
        const distance = parseFloat(restaurant.distance);
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
    const restaurantList = await RestaurantList.fetchFromLatitudeLongitude(testLatitude,testLongitude);
    const favoritesList = new FavoritesList();
    // Get the first 4 restaurants.
    for (let i=0; i<4; i++)
        favoritesList.addRestaurant(restaurantList.generator().next());
    
}
test1();
test2();
test3();