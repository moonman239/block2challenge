import {apiKey} from './gmapsapi.js';
function navigationPromise()
{
    return new Promise((resolve,reject) =>
    {
        navigator.geolocation.getCurrentPosition(resolve,reject);
    })
}

window.getLocation = async function()
{
    document.getElementById("go").disabled = true;
    const position = await navigationPromise();
    console.log("Latitude: " + position.coords.latitude + " Longitude: " + position.coords.longitude);
     document.getElementById("address").value = "Current Location";
     document.getElementById("go").disabled = false;
     window.userPosition = position;
            }

window.geocodeAddress = async function(address)
    {
        let response = await fetch("https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=" + apiKey);
            let json = await response.json();
            const result = json.results[0];
            if (result === undefined)
            {
                console.log(json);
                alert("could not find location");
                return 0;
            }
            const location = result.geometry.location;
            console.log(location);
            const userPosition = {coords : {latitude: location.lat, longitude: location.lng}};
            if (userPosition.coords.latitude === undefined || userPosition.coords.longitude === undefined)
                throw new Error("Undefined latitude and longitude.");
            window.userPosition = userPosition;
        }