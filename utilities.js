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
     return position;
            }

            export async function geocodeAddress(address)
            {
                let response = await fetch("https://forward-reverse-geocoding.p.rapidapi.com/v1/search?q=" + address + "%20USA&format=json&accept-language=en&polygon_threshold=0.0", {
                    "method": "GET",
                    "headers": {
                        "x-rapidapi-key": apiKey,
                        "x-rapidapi-host": "forward-reverse-geocoding.p.rapidapi.com"
                    }
                })
                let json = await response.json();
                userPosition = {latitude: json[0].lat, longitude: json[0].lon};
                console.log("Geocoded position: " + userPosition.latitude + " " + userPosition.longitude);
            }