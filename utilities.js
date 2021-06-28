function getLocation() 
{
document.getElementById("go").disabled = true;
                navigator.geolocation.getCurrentPosition(position => {
                    userPosition = position.coords;
                    document.getElementById("go").disabled = false;
                });
                document.getElementById("address").value = "Current Location";
            }
            
            async function geocodeAddress(address)
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