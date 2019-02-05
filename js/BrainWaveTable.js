let beachDBAPI = "http://192.168.1.104:8080/api/beach/";
let request = new XMLHttpRequest();
let output = document.getElementById("output");


function searchBeaches() {

    let searchString = document.getElementById("beachName").value;
    let currentLatitude = document.getElementById("latitude").value;
    let currentLongtitude = document.getElementById("longtitude").value;
    let maxDistance = document.getElementById("searchDistance").value;
    let distanceUnit;

    if (document.getElementById("km").checked) {
        distanceUnit = "K";
    } else {
        distanceUnit = "N";
    }

    output.innerHTML = "";

    request.open("GET", beachDBAPI);
    request.responseType = "json";
    request.send();
    request.onload = function () {
        let requestData = request.response;

        for (let i = 0; i < requestData.length; i++) {

            let beachId = requestData[i].beachId;
            let beachName = requestData[i].beachName;
            let beachLatitude = requestData[i].latitude;
            let beachLongtitude = requestData[i].longtitude;

            switch (beachId) {
                case 8:
                    request.open("GET", "http://magicseaweed.com/api/196a716c7205dbe82df0d3c6377936e4/forecast/?spot_id=" + beachId);
                    request.responseType = "json";
                    request.send();
                    request.onload = function () {
                        let surfData = request.response;
                        console.log(surfData[1])
                    }


            }
        }



        function distance(lat1, lon1, lat2, lon2, unit) {
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


