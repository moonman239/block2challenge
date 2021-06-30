
import {RestaurantList} from './RestaurantList.js';
import {geocodeAddress,getLocation} from './utilities.js';
window.getLocation = getLocation;
window.geocodeAddress = geocodeAddress;
window.restaurantsDiv = document.getElementById("restaurants");
window.favoritesList = RestaurantList.initWithStorage("favorites");
window.viewingFavorites = false;
window.resultsPerPage = 10;
window.currentPage = 0;
function currentList()
{
    return viewingFavorites ? window.favoritesList : window.restaurantList;
}
function renderRestaurantList(restaurantList,parentElement)
{
    renderPageSelector();
    const table = document.createElement("table");
    parentElement.innerHTML = "";
    parentElement.appendChild(table);
    const start = resultsPerPage * currentPage;
    console.log("Starting at " + start);
    const listToDisplay = restaurantList.getRestaurants(resultsPerPage,start);
    for (const i in listToDisplay)
    {
        if (listToDisplay[i].name === undefined)
            continue;
        const tr = document.createElement("tr");
        tr.innerHTML += "<td><h3>" + listToDisplay[i].name
        + "</h3>" + listToDisplay[i].description + "</td>";
        tr.innerHTML += "<td>" + listToDisplay[i].rating + "</td>";
        tr.innerHTML += "<td>" + listToDisplay[i].distance + " km</td>";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = window.favoritesList.includes(listToDisplay[i]); // TODO: check the box if favorited.
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
    const restaurant = currentList().restaurantAt(location_id);
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
    if (window.viewingFavorites)
        renderRestaurantList(window.favoritesList,restaurantsDiv);
}
window.go = async () => {
    window.currentPage = 0;
    console.log(restaurantsDiv);
    window.viewingFavorites = false;
    if (document.getElementById("address").value !== "Current Location")
        await geocodeAddress(document.getElementById("address").value);
    window.restaurantList = await RestaurantList.fetchFromLatitudeLongitude(userPosition.coords.latitude,userPosition.coords.longitude);
    if (restaurantList === undefined)
        throw new Error("No restaurant list was returned.");
    // Default to sorting by the selected sort.
    restaurantList.sort(document.getElementById("sort").value);
    renderRestaurantList(restaurantList,restaurantsDiv);
}
window.setResultsPerPage = function(select)
{
    resultsPerPage = parseInt(select.value);
    if (typeof restaurantList !== "undefined")
        renderRestaurantList(restaurantList,restaurantsDiv);
    // TODO: Implement pagination.
}
window.changeSort = function(select)
{
    window.restaurantList.sort(select.value);
    renderRestaurantList(restaurantList,restaurantsDiv);
}
window.viewFavorites = function(button)
{
    window.viewingFavorites = !window.viewingFavorites;
    if (!button)
        throw new Error("Button not passed to function.");
    if (window.viewingFavorites)
    {
        button.innerHTML = "View Results";
        renderRestaurantList(window.favoritesList,restaurantsDiv);
    }
    else
    {
        button.innerHTML = "View Favorites";
        
        if (currentList())
            renderRestaurantList(currentList(),restaurantsDiv);
        else
            restaurantsDiv.innerHTML = "No results displayed.";
    }
}
function renderPageSelector()
{
    const pageSelector = document.getElementById("pages");
    pageSelector.innerHTML = "";
    const numPagesToDisplay = Math.ceil(currentList().numRestaurants() / resultsPerPage);
    console.log("Displaying " + numPagesToDisplay + "pages.");
    // For each page, display a button to go to that page.
    for (let i=0; i<numPagesToDisplay; i++)
    {
        const button = document.createElement("input");
        button.type = "button";
        button.value = i + 1;
        button.onclick = () => getPage(i);
        pageSelector.appendChild(button);
    }
}
// Generate a page with the given page number.
window.getPage = function(pageNum)
{
    currentPage = pageNum;
    renderRestaurantList(currentList(),restaurantsDiv);
}