const testLatitude = 39.14659888817281;
const testLongitude = -108.64285062918833;
import {RestaurantList} from './RestaurantList.js';

// Test to ensure successful fetch.
async function test1()
{
    const restaurantList = await RestaurantList.fetchFromLatitudeLongitude(testLatitude,testLongitude);
    const next = restaurantList.generator().next();
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
    for (let restaurant of restaurantList.generator())
    {
        const rating = parseFloat(restaurant.rating);
        if (previousRating > rating)
            throw new Error("Test 2 failed.")
    }
    console.log("Test 2 passed.");
}

test1();
test2();