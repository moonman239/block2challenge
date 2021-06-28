
import renderRestaurantList from './renderRestaurantList.js';
import {RestaurantList} from './RestaurantList.js';
import {geocodeAddress,getLocation} from './utilities.js';
window.getLocation = getLocation;
window.geocodeAddress = geocodeAddress;
window.restaurantsDiv = document.getElementById("restaurants");
window.go = async () => {
    console.log(restaurantsDiv);
    if (document.getElementById("address").value !== "Current Location")
        await geocodeAddress(document.getElementById("address").value);
    window.restaurantList = await RestaurantList.fetchFromLatitudeLongitude(userPosition.coords.latitude,userPosition.coords.longitude);
    if (restaurantList === undefined)
        throw new Error("No restaurant list was returned.");
    renderRestaurantList(restaurantList,restaurantsDiv);
}
window.changeSort = function(select)
{
    window.restaurantList.sort(select.value);
    renderRestaurantList(restaurantList,restaurantsDiv);
}