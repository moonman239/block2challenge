import { RestaurantList } from "./RestaurantList.js";
export default function renderRestaurantList(restaurantList,parentElement)
{
    const table = document.createElement("table");
    parentElement.innerHTML = "";
    parentElement.appendChild(table);
}
