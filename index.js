
import {RestaurantList} from './RestaurantList.js';
import {geocodeAddress,getLocation} from './utilities.js';
import distance from './distance.js';
window.getLocation = getLocation;
window.geocodeAddress = geocodeAddress;
window.restaurantsDiv = document.getElementById("restaurants");
window.favoritesList = RestaurantList.initWithStorage("favorites");
window.viewingFavorites = false;
window.resultsPerPage = 20;
window.init = function()
{
    const prevButton = document.getElementById("prevButton");
    window.prevButton = prevButton;
    const nextButton = document.getElementById("nextButton");
    window.nextButton = nextButton;
    prevButton.hidden = true;
    prevButton.disabled = true;
    nextButton.disabled = true;
    nextButton.hidden = true;
    if (localStorage.getItem("latitude") !== undefined)
    {
        if (localStorage.getItem("longitude") === undefined)
            throw new Error("Undefined longitude.");
        const latitude = JSON.parse(localStorage.getItem("latitude"));
        const longitude = JSON.parse(localStorage.getItem("longitude"));
        window.userPosition = {coords: {latitude: latitude, longitude: longitude}};
        go();
    }
}
function currentList()
{
    return viewingFavorites ? window.favoritesList : window.restaurantList;
}
window.getNextPage = async () =>
{
    await currentList().getNextPage();
    document.getElementById("prevButton").disabled = false;
    if (!currentList().hasNextPage())
        document.getElementById("nextButton").disabled = true;
    renderRestaurantList(restaurantList,restaurantsDiv);
}
window.getPreviousPage = function()
{
    currentList().getPreviousPage();
    renderRestaurantList(restaurantList,restaurantsDiv);
    document.getElementById("nextButton").disabled = false;
}
function renderRestaurantList(restaurantList,parentElement)
{
    renderPageSelector();
    const table = document.createElement("table");
    parentElement.innerHTML = "";
    parentElement.appendChild(table);
    const listToDisplay = restaurantList.getRestaurants(resultsPerPage,0);
    for (const i in listToDisplay)
    {
        if (listToDisplay[i].name === undefined)
            continue;
        const tr = document.createElement("tr");
        const td1 = document.createElement("td");
        const h3 = document.createElement("h3");
        h3.innerText = listToDisplay[i].name;
        td1.appendChild(h3);
        const td2 = document.createElement("td");
        td2.innerText = listToDisplay[i].rating;
        const td3 = document.createElement("td");
        td3.innerText = listToDisplay[i].distance;
        const td4 = document.createElement("td");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        try
        {
        checkbox.checked = window.favoritesList.includes(listToDisplay[i]); // TODO: check the box if favorited.
        }
        catch (e)
        {
            console.error(e);
        }
        checkbox.id = listToDisplay[i].place_id;
        checkbox.onchange = window.toggleFavorite;
        td4.appendChild(checkbox);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
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
    window.prevButton.hidden = false;
    window.nextButton.hidden = false;
    window.prevButton.disabled = true;
    window.nextButton.disabled = false;
    window.currentPage = 0;
    console.log(restaurantsDiv);
    window.viewingFavorites = false;
    if ((document.getElementById("address").value !== "Current Location") && document.getElementById("address").value !== "")
        await geocodeAddress(document.getElementById("address").value);
    window.restaurantList = new RestaurantList();
    await restaurantList.fetchNextPage();
    window.numPages = Math.ceil(currentList().numRestaurants() / resultsPerPage);
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
    console.log("Displaying " + numPages + "pages.");
    // For each page, display a button to go to that page.
    for (let i=0; i<numPages; i++)
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
    console.log("Going to page " + pageNum);
    renderRestaurantList(currentList(),restaurantsDiv);
    if (currentPage === window.numPages - 1)
        nextButton.disabled = true;
    else if (currentPage === 0)
        prevButton.disabled = true;
    if (currentPage > 0)
        prevButton.disabled = false;
    if (currentPage < window.numPages - 1)
        nextButton.disabled = false;
}