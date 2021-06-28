import { RestaurantList } from "./RestaurantList.js";
export default function renderRestaurantList(restaurantList,parentElement)
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
        table.appendChild(tr);
    }
}
