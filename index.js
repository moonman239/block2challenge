const testLatitude = 39.14659888817281;
const testLongitude = -108.64285062918833;
import {RestaurantList} from './RestaurantList.js';

// Test to ensure successful fetch.
async function test1()
{
    const restaurantList = await RestaurantList.fetchFromLatitudeLongitude(testLatitude,testLongitude);
    const next = restaurantList.generator().next();
    if (!next)
        throw new Error("Undefined location_id.");
    console.log("Test 1 passed.");
    }

test1();
