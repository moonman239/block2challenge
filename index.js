
import renderRestaurantList from './renderRestaurantList.js';
import {RestaurantList} from './RestaurantList.js';
import {geocodeAddress,getLocation} from './utilities.js';
window.getLocation = getLocation;
window.geocodeAddress = geocodeAddress;
window.go = async () => {
    const restaurantsDiv = document.getElementById("restaurants");
    console.log(restaurantsDiv);
                renderRestaurantList(new RestaurantList(),restaurantsDiv);
                
                if (document.getElementById("address").value !== "Current Location")
                   await geocodeAddress(document.getElementById("address").value);
                /*fetchAndDisplayRestaurants();*/
            }