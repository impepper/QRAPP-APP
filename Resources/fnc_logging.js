// mcms.fuihan.com/app_logs.php?app_id=123abc&os=ios&device=ipad&module=TABBEDBAR&title=test&coord_lat=123.456&coord_long=789.123
function logging(tab_module, tab_title,qr_launch){
	
	var osname = Ti.Platform.osname,
		height = Ti.Platform.displayCaps.platformHeight,
		width = Ti.Platform.displayCaps.platformWidth;
	if ((qr_launch == undefined) || (qr_launch == '')) {qr_launch= false} 
	var browsingdevice='Browser';
	var devicebrand = 'Android';
	 
	if (osname === 'ipad' || (osname === 'android' && (width > 899 || height > 899))){
		browsingdevice = 'Tablet';
	};
		
	if (browsingdevice  != 'Tablet' && (osname === 'iphone' || osname === 'android')){
		browsingdevice = 'Phone'
	}

	if ((osname === 'ipad') || (osname === 'iphone' )){
		devicebrand = 'Apple'
	}
	
	var longitude = 0;
	var latitude = 0;
	var appidcode='&content='+Ti.App.Properties.getString('cloud_useremail','8.service@fuihan.com')

	// if (Titanium.Geolocation.getLocationServicesEnabled && Ti.Geolocation.getLocationServicesAuthorization!==Ti.Geolocation.AUTHORIZATION_DENIED){
	// if ( Ti.App.Properties.getBool('get_location_service',false)){
	if (Ti.Geolocation.getLocationServicesEnabled && (Titanium.Geolocation.getLocationServicesAuthorization == Titanium.Geolocation.AUTHORIZATION_AUTHORIZED)) {
		
		Titanium.Geolocation.getCurrentPosition(function(e)
		{
			if (!e.success || e.error)
			{
				currentLocation.text = 'error: ' + JSON.stringify(e.error);
				Ti.API.info("Code translation: "+translateErrorCode(e.code));
				alert('error ' + JSON.stringify(e.error));
				return;
			}

			longitude = e.coords.longitude;
			latitude = e.coords.latitude;

			Titanium.API.info('geo - current location:  long -' + longitude + '- lat -' + latitude );
			
			var url = "http://users.qrapp.com.tw/app_logs.php";
			
			var xhr = Ti.Network.createHTTPClient({
			    timeout:2000  /* in milliseconds */
			});
			xhr.open("POST", url);
			Ti.API.info(tab_module+','+tab_title)
			xhr.send({
				app_id:appidcode,
				os:osname,
				devicebrand:devicebrand,
				device:browsingdevice,
				module:tab_module,
				title:tab_title,
				coord_lat:latitude,
				coord_long:longitude,
				qr_launch:qr_launch
			});
		});		
	} else {

		var url = "http://users.qrapp.com.tw/app_logs.php";
		
		var xhr = Ti.Network.createHTTPClient({
		    timeout:2000  /* in milliseconds */
		});
		xhr.open("POST", url);
		Ti.API.info(tab_module+','+tab_title)
		xhr.send({
			app_id:appidcode,
			os:osname,
			devicebrand:devicebrand,
			device:browsingdevice,
			module:tab_module,
			title:tab_title,
			coord_lat:latitude,
			coord_long:longitude,
			qr_launch:qr_launch
		});	
	}

}
