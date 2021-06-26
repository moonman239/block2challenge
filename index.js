const testLatitude = 39.14659888817281;
const testLongitude = -108.64285062918833;
import {RestaurantList} from './RestaurantList.js';
async function test1()
{
    const restaurantList = await RestaurantList.fetchFromLatitudeLongitude(testLatitude,testLongitude);
    console.log(restaurantList.generator().next());
}

test1();