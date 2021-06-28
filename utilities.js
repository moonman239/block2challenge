function navigationPromise()
{
    return new Promise((resolve,reject) =>
    {
        navigator.geolocation.getCurrentPosition(resolve,reject);
    })
}

export async function getLocation() 
{
    document.getElementById("go").disabled = true;
    const position = await navigationPromise();
    console.log("Latitude: " + position.coords.latitude + " Longitude: " + position.coords.longitude);
     document.getElementById("address").value = "Current Location";
     document.getElementById("go").disabled = false;
     window.userPosition = position;
            }

            export async function geocodeAddress(address)
            {
                let response = await fetch("https://forward-reverse-geocoding.p.rapidapi.com/v1/search?q=" + address + "%20USA&format=json&accept-language=en&polygon_threshold=0.0", {
                    "method": "GET",
                    "headers": {
                        "x-rapidapi-key": "1167886aeemsh061eed0f807e535p17f6aajsnc70cd0d6bdaa",
                        "x-rapidapi-host": "forward-reverse-geocoding.p.rapidapi.com"
                    }
                })
                let json = await response.json();
                const userPosition = {coords : {latitude: json[0].lat, longitude: json[0].lon}};
                if (userPosition.coords.latitude === undefined || userPosition.coords.longitude === undefined)
                    throw new Error("Undefined latitude and longitude.");
                window.userPosition = userPosition;
            }