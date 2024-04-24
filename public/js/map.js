
	mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: coordinates, // starting position [lng, lat]
        // center: listing.geometry.coordinates,
        style: 'mapbox://styles/mapbox/streets-v9',
        zoom: 9 // starting zoom
    });

console.log(coordinates);
  // Create a default Marker and add it to the map.
  const marker1 = new mapboxgl.Marker()
  .setLngLat(coordinates)
  .addTo(map);
