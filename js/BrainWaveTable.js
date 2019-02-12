let output = document.getElementById("output");

let distanceUnit;
let timeButtons = document.getElementById("timeButtons");
let beachContainer = document.getElementById("beachContainer");
let beachDetails = document.getElementById("beachDetails");
let searchString = document.getElementById("beachName");


function searchBeaches() {
    let beachDBAPI = "http://localhost:8080/api/beach/";
    let searchString = document.getElementById("beachName").value;
    beachContainer.className = "col col-lg-4";

    if (searchString != "") {
        beachDBAPI += "name/" + searchString;
    }

    output.innerHTML = "";

    fetch(beachDBAPI)
        .then(response => response.json())
        .then(data => processBeachData(data))
}

function processBeachData(beachData) {

    let currentLatitude = document.getElementById("latitude").value;
    let currentLongtitude = document.getElementById("longtitude").value;
    let maxDistance = document.getElementById("searchDistance").value;
    for (let i = 0; i < beachData.length; i++) {
        let beachId = beachData[i].id;
        let beachName = beachData[i].name;
        let beachLatitude = beachData[i].latitude;
        let beachLongtitude = beachData[i].longtitude;
        let beachDistance = distance(currentLatitude, currentLongtitude,
            beachLatitude, beachLongtitude, distanceUnit);
        if (beachDistance < maxDistance || maxDistance == 0) {
            let row = output.insertRow();
            row.setAttribute("class", "clickable");
            row.setAttribute("onclick", "getReviews(" + beachId + "); getSurfData('" + beachName + "');");
            let idCell = row.insertCell();
            let nameCell = row.insertCell();
            let distanceCell = row.insertCell();
            idCell.innerHTML = beachId;
            nameCell.innerHTML = beachName;
            if (currentLatitude == 0 || currentLongtitude == 0) {
                distanceCell.innerHTML = "";
            } else {
                distanceCell.innerHTML = beachDistance;
            }
        }
    }

}


function getSurfData(beachName) {
    document.getElementById("surfReport").className = "col col-lg-8";
    document.getElementById("theBeachName").innerHTML = beachName + " Beach";

    let URL = "https://magicseaweed.com/api/196a716c7205dbe82df0d3c6377936e4/forecast/?spot_id=" +
        8 +
        "&fields=swell.minBreakingHeight,swell.maxBreakingHeight,solidRating,fadedRating";
    PROXY = "https://cors-anywhere.herokuapp.com/";

    fetch(PROXY + URL)
        .then(response => response.json())
        .then(data => processSurfData(data))
}


function processSurfData(surfData) {

    let surfBody = document.getElementById("surfOutput");
    surfBody.innerHTML = "";

    for (let i = 0; i < 9; i++) {
        let surfRating = [];
        let surfRow = surfBody.insertRow();
        let surfTime = i * 3 + ":00";
        let minBreak = surfData[i].swell.minBreakingHeight;
        let maxBreak = surfData[i].swell.maxBreakingHeight;

        for (let r = 0; r < surfData[i].solidRating; r++) {
            surfRating.push('<img src="http://cdnimages.magicseaweed.com/star_filled.png"/>');
        }

        for (let r = 0; r < surfData[i].fadedRating; r++) {
            surfRating.push('<img src="http://cdnimages.magicseaweed.com/star_empty.png"/>');
        }

        let timeCell = surfRow.insertCell();
        let minBreakCell = surfRow.insertCell();
        let maxBreakCell = surfRow.insertCell();
        let surfRatingCell = surfRow.insertCell();

        timeCell.innerHTML = surfTime;
        minBreakCell.innerHTML = minBreak;
        maxBreakCell.innerHTML = maxBreak;
        surfRatingCell.innerHTML = surfRating.join(" ");

    }

}

function getReviews(beachId) {
    beachDetails.className = "container-fluid";
    let beachDescription = document.getElementById("beachDescription");
    beachDescription.innerHTML = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi ut libero vitae elit ultricies aliquam. Morbi hendrerit dolor leo, a imperdiet elit efficitur sed. Mauris congue aliquet metus, vitae vehicula nisl ullamcorper eget. Sed eu dui sed est interdum rhoncus in ut turpis. Nam aliquet posuere tortor in pretium. Duis elit justo, fringilla ac metus volutpat, blandit scelerisque nunc. Nulla placerat id risus in accumsan. Aenean in mollis odio, sed aliquam est. Fusce a felis mi. Integer mi elit, eleifend eget risus ac, convallis rutrum elit. Sed sed neque at urna feugiat ullamcorper. Praesent sit amet orci ut lacus fringilla ornare eu vel metus. Donec rhoncus cursus purus, sed porta enim aliquet sed."
    document.getElementById("beachPic").innerHTML = "<img class='img-fluid max-width: 100%' src='https://www.visitcornwall.com/sites/default/files/product_image/Perranporth2_Matt%20Jessop.jpg'/>";
    let URL = "http://localhost:8080/api/beach/" +
        beachId +
        "/reviews";
    fetch(URL)
        .then(response => response.json())
        .then(data => processReviews(data))
}

function processReviews(data) {
    
    let dataSize = data.length;
    let output = document.getElementById("reviewOutput");
    let facilitiesRatingCell = document.getElementById("facilitiesRating");
    let surfRatingCell = document.getElementById("surfingRating");
    let rockpoolRatingCell = document.getElementById("rockpoolsRating");
    let totalFacilities = 0;
    let totalSurf = 0;
    let totalRockpool = 0;

    document.getElementById("reviewTable").className = "container-fluid";

    for (let i = 0; i < dataSize; i++) {
        let reviewRow = output.insertRow();
        if (data.comment != null) {
            let commentRow = output.insertRow();
            let comment = commentRow.insertCell();
            comment.setAttribute("colspan","3");
            comment.innerHTML = data.comment;
        }

        let facilitiesRating = data[i].facilitiesRating;
        let surfRating = data[i].surfRating;
        let rockpoolRating = data[i].rockpoolRating;

        let facilities = reviewRow.insertCell();
        let surf = reviewRow.insertCell();
        let rockpools = reviewRow.insertCell();
        facilities.innerHTML = facilitiesRating;
        surf.innerHTML = surfRating;
        rockpools.innerHTML = rockpoolRating;
        console.log(rockpoolRating);

        totalFacilities += facilitiesRating;
        totalSurf += surfRating;
        totalRockpool += rockpoolRating;

    }

    facilitiesRatingCell.innerHTML = getStarRating(totalFacilities, dataSize);
    surfRatingCell.innerHTML = getStarRating(totalSurf, dataSize);
    rockpoolRatingCell.innerHTML = getStarRating(totalRockpool, dataSize);
}

function getStarRating(total, datasize) {
    let starsArray = [];
    let solidStars = total / datasize;

    for (let r = 0; r < 5; r++) {
        if (r < solidStars) {
            starsArray.push('<img src="http://cdnimages.magicseaweed.com/star_filled.png"/>');
        } else {
            starsArray.push('<img src="http://cdnimages.magicseaweed.com/star_empty.png"/>');
        }
    }
    return starsArray.join(" ");
}

function postReview(id) {


}

function changeDistanceUnit(unit) {
    distanceUnit = unit;
    console.log(distanceUnit);
}


function distance(lat1, lon1, lat2, lon2, unit) {
    console.log(unit);
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    }
    else {
        var radlat1 = Math.PI * lat1 / 180;
        var radlat2 = Math.PI * lat2 / 180;
        var theta = lon1 - lon2;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit == "K") { dist = dist * 1.609344 }
        if (unit == "N") { dist = dist * 0.8684 }
        return dist;
    }
}
