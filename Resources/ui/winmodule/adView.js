	
	var osname = Ti.Platform.osname,
		version = Ti.Platform.version,
		height = Ti.Platform.displayCaps.platformHeight,
		width = Ti.Platform.displayCaps.platformWidth;	
	var isTablet = osname === 'ipad' || (osname === 'android' && (width > 899 || height > 899));
	Ti.API.info('Called')
	var adgap=(isTablet?90:50);
	var adwidth=(isTablet?728:320);
	var ad_role = Ti.App.Properties.getInt('cloud_userrole',0)
	var view_header_gap=0
	if (ad_role < 5 ){
		view_header_gap=adgap;
		//Admob Setting
		var Admob = require('ti.admob');
	
		var ad;
		var win=Ti.UI.currentWindow;
		win.add(ad = Admob.createView({
		    top: 0, //left: 0,
		    width: adwidth, height: adgap,
		    publisherId: 'a14fc70a8d46176', // You can get your own at http: //www.admob.com/
		    adBackgroundColor: 'black',
		    // testing: true,
		    // dateOfBirth: new Date(1985, 10, 1, 12, 1, 1),
		    gender: 'male',
		    keywords: 'movie'
		}));
		
		/*
		 And we'll try to get the user's location for this second ad!
		 */
		Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
		Ti.Geolocation.distanceFilter = 0;
		Ti.Geolocation.purpose = 'To show you local ads, of course!';
		Ti.Geolocation.getCurrentPosition(function reportPosition(e) {
		    if (!e.success || e.error) {
		        // aw, shucks...
		    }
		    else {
		        win.add(Admob.createView({
		            bottom: 0, //left: 0,
		            width: adwidth, height: adgap,
		            publisherId: 'a14fc70a8d46176', // You can get your own at http: //www.admob.com/
		            adBackgroundColor: 'black',
		            // testing: true,
		            // dateOfBirth: new Date(1985, 10, 1, 12, 1, 1),
		            gender: 'female',
		            keywords: 'shopping',
		            location: e.coords
		        }));
		    }
		});	
		//End of Admob		
	}