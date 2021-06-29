
import {RestaurantList} from './RestaurantList.js';
import {geocodeAddress,getLocation} from './utilities.js';
window.getLocation = getLocation;
window.geocodeAddress = geocodeAddress;
window.restaurantsDiv = document.getElementById("restaurants");
window.favoritesList = RestaurantList.initWithStorage("favorites");
function renderRestaurantList(restaurantList,parentElement)
{
    const table = document.createElement("table");
    parentElement.innerHTML = "";
    parentElement.appendChild(table);
    const listToDisplay = restaurantList.getRestaurants(30);
    for (const i in listToDisplay)
    {
        const tr = document.createElement("tr");
        tr.innerHTML += "<td><h3>" + listToDisplay[i].name
        + "</h3>" + listToDisplay[i].description + "</td>";
        tr.innerHTML += "<td>" + listToDisplay[i].rating + "</td>";
        tr.innerHTML += "<td>" + listToDisplay[i].distance + " km</td>";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = false; // TODO: check the box if favorited.
        checkbox.id = listToDisplay[i].location_id;
        checkbox.onchange = window.toggleFavorite;
        tr.appendChild(checkbox);
        table.appendChild(tr);
    }
}

window.toggleFavorite = function(event)
{
    const location_id = event.target.id;
    // Get the restaurant corresponding to the passed id.
    const restaurant = window.restaurantList.restaurantAt(location_id);
    if (restaurant === undefined)
        throw new Error("Undefined restaurant.");
    console.log("Toggling restaurant " + restaurant.location_id + " name: " + restaurant.name);
    // If restaurant is favorited, remove it from favorites. Otherwise, add it.
    if (!window.favoritesList.includes(restaurant))
        window.favoritesList.addRestaurant(restaurant);
    else
        window.favoritesList.removeRestaurant(restaurant);
    console.log("hey");
    window.favoritesList.saveToStorage("favorites");
}
window.go = async () => {
    console.log(restaurantsDiv);
    if (document.getElementById("address").value !== "Current Location")
        await geocodeAddress(document.getElementById("address").value);
    window.restaurantList = await RestaurantList.fetchFromLatitudeLongitude(userPosition.coords.latitude,userPosition.coords.longitude);
    if (restaurantList === undefined)
        throw new Error("No restaurant list was returned.");
    // Default to sorting by the selected sort.
    restaurantList.sort(document.getElementById("sort").value);
    renderRestaurantList(restaurantList,restaurantsDiv);
}
window.changeSort = function(select)
{
    window.restaurantList.sort(select.value);
    renderRestaurantList(restaurantList,restaurantsDiv);
}