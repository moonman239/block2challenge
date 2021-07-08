Number.prototype.toRad = function() {
   return this * Math.PI / 180;
}

export default function distance(coords1,coords2,miles=true)
{
    let lat1 = coords1.latitude;
    let lat2 = coords2.latitude;
    let lon1 = coords1.longitude;
    let lon2 = coords2.longitude;
    if (lat1 === undefined)
        throw new Error("lat1 undefined");
    else if (lat2 === undefined)
        throw new Error("lat2 undefined");
    else if (lon1 === undefined)
        throw new Error("lon1 undefined");
    else if (lon2 === undefined)
        throw new Error("lon2 undefined");
    let R = miles ? 3959 : 6371;
//has a problem with the .toRad() method below.
let x1 = lat2-lat1;
let dLat = x1.toRad();  
let x2 = lon2-lon1;
let dLon = x2.toRad();  
let a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
                Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
                Math.sin(dLon/2) * Math.sin(dLon/2);  
let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
let d = R * c;
return d;
}