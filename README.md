# nearest_location
google maps search nearest location
## Dokumentasi
- Initialize
````javascript
var nearest = new nearest_location({
	records: [{location_1}, {location_2}, ..., {location_n}],
	center: {lat: 37.4419, lng: -122.1419}, // your lat and lng position
	unit: 'M', // ['M','K', 'N']
  distance: 12,
    done: function (res){ // callback when search nearest location is done
  }
})

````
- update unit
````javascript
nearest.set_unit(value)
````

- update distance
````javascript
nearest.set_distance(value)
````

- update nearest result
````javascript
nearest.update()
````

