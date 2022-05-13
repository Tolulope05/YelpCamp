mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: parsedCamp.geometry.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});

// Set marker options.
const marker = new mapboxgl.Marker({
    color: "#FF0000",
    draggable: true
}).setLngLat(parsedCamp.geometry.coordinates)
    .addTo(map)
    .marker();