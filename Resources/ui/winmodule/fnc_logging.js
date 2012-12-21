// mcms.fuihan.com/app_logs.php?app_id=123abc&os=ios&device=ipad&module=TABBEDBAR&title=test&coord_lat=123.456&coord_long=789.123
function logging(tab_module, tab_title){
	
	var osname = Ti.Platform.osname,
		height = Ti.Platform.displayCaps.platformHeight,
		width = Ti.Platform.displayCaps.platformWidth;
	
	var browsingdevice='Browser';
	 
	if (osname === 'ipad' || (osname === 'android' && (width > 899 || height > 899))){
		browsingdevice = 'Tablet';
	};
		
	if (browsingdevice  != 'Tablet' && (osname === 'iphone' || osname === 'android')){
		browsingdevice = 'Phone'
	}
	
	var longitude = 0;
	var latitude = 0;
	var appidcode='&content='+Ti.App.Properties.getString('cloud_useremail','8.service@fuihan.com')
	
	Ti.Geolocation.purpose='Location analyse'
	Ti.Geolocation.preferredProvider = "gps";
	Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;	
	
	if (Titanium.Geolocation.getLocationServicesEnabled && Ti.Geolocation.getLocationServicesAuthorization!==Ti.Geolocation.AUTHORIZATION_DENIED){
		// Ti.Geolocation.purpose='Location analyse'
		// Ti.Geolocation.preferredProvider = "gps";
		// Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
		Titanium.Geolocation.getCurrentPosition(function(e)
		{
			if (!e.success || e.error)
			{
				currentLocation.text = 'error: ' + JSON.stringify(e.error);
				Ti.API.info("Code translation: "+translateErrorCode(e.code));
				alert('error ' + JSON.stringify(e.error));
				return;
			}
	
			// longitude = 123.2;
			// latitude = -52.1471254;
			longitude = e.coords.longitude;
			latitude = e.coords.latitude;
			// var altitude = e.coords.altitude;
			// var heading = e.coords.heading;
			// var accuracy = e.coords.accuracy;
			// var speed = e.coords.speed;
			// var timestamp = e.coords.timestamp;
			// var altitudeAccuracy = e.coords.altitudeAccuracy;
			// Ti.API.info('speed ' + speed);
			// currentLocation.text = 'long:' + longitude + ' lat: ' + latitude;
	
			Titanium.API.info('geo - current location:  long -' + longitude + '- lat -' + latitude );
			
			var url = "http://mcms.fuihan.com/app_logs.php";
			
			var xhr = Ti.Network.createHTTPClient({
			    timeout:2000  /* in milliseconds */
			});
			xhr.open("POST", url);
			Ti.API.info(tab_module+','+tab_title)
			xhr.send({
				app_id:appidcode,
				os:osname,
				device:browsingdevice,
				module:tab_module,
				title:tab_title,
				coord_lat:latitude,
				coord_long:longitude
			});
		});		
	} else {

		var url = "http://mcms.fuihan.com/app_logs.php";
		
		var xhr = Ti.Network.createHTTPClient({
		    timeout:2000  /* in milliseconds */
		});
		xhr.open("POST", url);
		Ti.API.info(tab_module+','+tab_title)
		xhr.send({
			app_id:appidcode,
			os:osname,
			device:browsingdevice,
			module:tab_module,
			title:tab_title,
			coord_lat:latitude,
			coord_long:longitude
		});	
	}



	

}