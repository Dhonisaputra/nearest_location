var nearby = function(options)
{
	this._options = options;
	this.center = options.position;
	this.records = options.records;
	this.unit = options.unit;
	this.distance = options.distance;
	this._result_nearest = []
	this.accepted_unit = ['K',"M",'N'];

	var _parents = this;
	this.Utility =
	{
		check_accepted_unit: function()
		{
			if(_parents.accepted_unit.indexOf(_parents.unit) < 0)
			{
				var error_text = 'unrecognized unit measure!';
				alert(error_text);
				console.error(error_text)
				return false;
			}
		}
	}

	if(this.center)
	{
		this.search_nearest();
	}

	function __set_area(area)
	{
		this.area = area;
	}
	
	var _fn = function(parents){
		this._parents = parents;
	}
	_fn.prototype = 
	{
		set_unit: function(unit, autoupdate)
		{
			if(!unit){ alert('Unit cannot be empty!'); return false; }
			this._parents.unit = unit;
			if(autoupdate)
			{
				return this._parents.search_nearest();
			}
			return this;
		},
		set_distance: function(distance, autoupdate)
		{
			if(!distance){ alert('distance cannot be empty!'); return false; }
			this._parents.distance = parseFloat(distance);
			if(autoupdate)
			{
				return this._parents.search_nearest();
			}
			return this;
		},
		set_position: function(lat, long, autoupdate)
		{
			if(!lat || !long){ alert('distance cannot be empty!'); return false; }
			this._parents.center = {lat: lat, lng: long};
			if(autoupdate)
			{
				return this._parents.search_nearest();
			}
			return this;
		},
		update: function(callback)
		{
			var near = this._parents.search_nearest();
			if(callback)
			{

			}
			return 
		}

	}

	return new _fn(this);

}

nearby.prototype = 
{
	search_nearest: function(callback)
	{
		this.Utility.check_accepted_unit();
		var deff = $.Deferred();

		var records = this.records;
		var center = this.center;
		var nearest = this.distance? this.distance : 1; //Limit within 1 KM.
		var unit = this.unit? this.unit : 'K'; //Limit within 1 KM.
		var data = []
		var calculate_distance = this.calculate_distance;
		this.calculate_area(unit, nearest);

		$.each(records, function(index, job)
		{ 
			if(!job.lat || !job.lng)
			{
				console.error('records'+index+' dont have latitude or longitude. cannot process any further!');
				return false;
			}else
			{
			    var lat = job.lat; 
			    var lng = job.lng; 
			    var nam = center.lat; 
			    var cou = center.lng; 
			    //In below line we will get the distance between current and given coordinates.
			    var d = calculate_distance(nam, cou, lat, lng, unit, nearest);
			    //Check the d is within 1 KM, If so then add it to map.
			    if(nearest>d.data)
			    {
			    	job.distance = d.data;
			    	data.push(job)

			    }
			}
		}) 

		data.sort(function(a, b) {
		    return parseFloat(a.distance) - parseFloat(b.distance);
		});
		this._result_nearest = data;
		if(typeof this._options.done == 'function')
		{
			this._options.done(data, this)
		}
		if(typeof callback == 'function')
		{
			callback(data, this)
		}
		// deff.resolve(data);

		// return $.when(deff.promise());
		return data;

		
	},
	calculate_area: function(unit, length)
	{
		var area = 0;
		switch(unit)
	    {
	    	case "K":
	    		area = length * 1000;
	    		break;
	    	case "N":
	    		area = length * 1852;
	    		break;
	    	case "M":

	    		area = length;
	    		break;
	    }
	    this.area = area;
	},
	calculate_distance: function(yourLat, yourLong, targetLat, targetLong, unit, distance) {
	    var radlat1 = Math.PI * yourLat/180
	    var radlat2 = Math.PI * targetLat/180
	    var radlon1 = Math.PI * yourLong/180
	    var radlon2 = Math.PI * targetLong/180
	    var theta = yourLong-targetLong
	    var radtheta = Math.PI * theta/180
	    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	    var area = 0;
	    dist = Math.acos(dist)
	    dist = dist * 180/Math.PI
	    dist = dist * 60 * 1.1515
	    switch(unit)
	    {
	    	case "K":
	    		dist = dist * 1.609344;
	    		area = distance * 1000;
	    		break;
	    	case "N":
	    		dist = dist * 0.8684;
	    		area = distance * 1852;
	    		break;
	    	case "M":

	    		dist = dist * 1.609344;
	    		dist = dist * 1000;
	    		area = distance;
	    		break;
	    }
	    return {data: dist, area: area}
	}
}
