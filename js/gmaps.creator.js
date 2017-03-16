var Gmaps = function(options)
{
	if(!options.APIkey)
	{
		var error_text = 'No API Key found. error occured!';
		alert(error_text)
		console.log(error_text)
		return false;
	}
	this.graph = 'https://maps.googleapis.com/maps/api/js'
	var _def_options = 
	{
		position: {lat: 37.4419, lng: -122.1419}
	}
	this._options = $.extend(_def_options, options);
	this.__contruct();
	return this
}
Gmaps.prototype = 
{
	__contruct: function()
	{
		var graphURL = this.graph+'?key='+this._options.APIkey;
		var __parents = this;
		$.getScript(graphURL)
		.done(function(){
			__parents.create_map();
		})
	},
	__navi_geolocation: function(options, callback)
	{
		var __parents = this;
		options = $.extend({
			content: 'Your position',
			icon: 'http://www.robotwoods.com/dev/misc/bluecircle.png'
		}, options)
		if(!options.map || !options.info_map)
		{
			var error_text = 'No map found. error occured!';
			console.error(error_text);
			return false;
		}

		if (navigator.geolocation) {
          	navigator.geolocation.getCurrentPosition(function(position) {
            	var pos = {
              		lat: position.coords.latitude,
              		lng: position.coords.longitude
            	};
            	__parents['__data_position'] = pos;
            	if(callback)
            	{
            		callback({
            			position: pos
            		})	
            	}

	            options.info_map.setPosition(pos);
	            options.info_map.setContent(options.content);
	            options.map.setCenter(pos);
            	new google.maps.Marker({
                	position: pos,
                	map: options.map,
                	icon: options.icon
            	});
          	}, function() {
            	handleLocationError(true, options.info_map, options.map.getCenter());
          	});
        }

	},
	create_map: function()
	{
		var target = $(this._options.target)[0]
		var position = this._options.position
		var __parents = this
		this._options.map_options = this._options.map_options? this._options.map_options : {}

		var map_options = $.extend({
          	center: position,
          	zoom: 29
        }, this._options.map_options)

		this.__map = new google.maps.Map(target, map_options);
        this.__info_map = new google.maps.InfoWindow({map: this._map});
        if(this._options.geolocation == true)
        {
        	this.__navi_geolocation({
        		map: this.__map,
        		info_map: this.__info_map,
        	}, function(res){
	        	// fire function on render
		        if(typeof __parents._options.onRender == 'function')
		        {
		        	__parents._options.onRender(this);	
		        }
        	})
        }else
        {
        	// fire function on render
	        if(typeof this._options.onRender == 'function')
	        {
	        	this._options.onRender(this);	
	        }
        }
	}, 
	set_marker: function(options)
	{
		if(!options.position.lat || !options.position.lng)
		{
			var error_log = 'latitude atau longitude untuk set marker tidak ditentukan. error occured!';
			console.log(error_log);
			return false;
		}

		options = $.extend({
			map: this.__map,
		}, options)

        marker = new google.maps.Marker(options);
        return marker;
	}
}