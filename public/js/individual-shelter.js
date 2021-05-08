console.log("HI");

function initMap() {
  console.log("HI inside");

  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 8,
    center: { lat: -34.397, lng: 150.644 },
  });
  const geocoder = new google.maps.Geocoder();
  document.getElementById("submit").addEventListener("click", () => {
    geocodeAddress(geocoder, map);
  });
}

function geocodeAddress(geocoder, resultsMap) {
  console.log("HI inside geo address");

  const address = document.getElementById("address").value;
  geocoder.geocode({ address: address }, (results, status) => {
    console.log("address" + address);
    if (status === "OK") {
      resultsMap.setCenter(results[0].geometry.location);
      console.log("HI inside geo address", results[0].geometry.location);
      new google.maps.Marker({
        map: resultsMap,
        position: results[0].geometry.location,
      });
    } else {
      console.log("HI inside geo address else part");
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
}
