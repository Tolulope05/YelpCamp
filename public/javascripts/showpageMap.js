mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: parsedCamp.geometry.coordinates, // starting position [lng, lat]
    zoom: 10 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl())

// Set marker options.
const marker = new mapboxgl.Marker({
    color: "#FF0000",
    draggable: false,
}).setLngLat(parsedCamp.geometry.coordinates)
    .addTo(map)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${parsedCamp.title}</h3> <p>${parsedCamp.description}</p>`
            )
    )
    // .marker()