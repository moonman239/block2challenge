
import renderRestaurantList from './renderRestaurantList.js';
import {RestaurantList} from './RestaurantList.js';
window.go = () => {
    const restaurantsDiv = document.getElementById("restaurants");
    console.log(restaurantsDiv);
                renderRestaurantList(new RestaurantList(),restaurantsDiv);
                /*
                if (document.getElementById("address").value !== "Current Location")
                   await geocodeAddress(document.getElementById("address").value);
                fetchAndDisplayRestaurants();*/
            }