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
        tr.innerHTML = "<td>" + listToDisplay[i].name + "</td>";
        table.appendChild(tr);
    }
}
