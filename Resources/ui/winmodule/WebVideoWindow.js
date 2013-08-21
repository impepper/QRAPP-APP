function WebVideoWindow(tabbed_window,show_navbar,title,videosource,url) {

	Ti.include('/jslib/fnc_logging.js');
<<<<<<< HEAD
	if (Ti.Platform.osname !='mobileweb'){
=======
	if (Ti.Platform.osname !='mobile'){
>>>>>>> BitBucket/master
		var GA = require('analytics.google'); 
		var tracker = GA.getTracker("UA-41799104-1");
	}
	
	var win = Ti.UI.createWindow({
		title:title,
		backgroundColor:'white',
		navBarHidden:true,
		orientationModes: [Ti.UI.PORTRAIT,Ti.UI.LANDSCAPE_LEFT,Ti.UI.LANDSCAPE_RIGHT]
	});
	
	var ad_role = Ti.App.Properties.getInt('cloud_userrole',0)
	var view_header_gap=0
	if ((ad_role < 5) && (Ti.Platform.osname!='mobileweb')){
		view_header_gap=50;
		//Admob Setting
		var Admob = require('ti.admob');
	
		var ad;
		win.add(ad = Admob.createView({
		    top: 0, left: 0,
		    width: 320, height: 50,
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
        win.add(Admob.createView({
            bottom: 0, left: 0,
            width: 320, height: 50,
            publisherId: 'a14fc70a8d46176', // You can get your own at http: //www.admob.com/
            adBackgroundColor: 'black',
            // testing: true,
            // dateOfBirth: new Date(1985, 10, 1, 12, 1, 1),
            gender: 'female',
            keywords: 'shopping'
        }));		
		// Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
		// Ti.Geolocation.distanceFilter = 0;
		// Ti.Geolocation.purpose = 'To show you local ads, of course!';
		// Ti.Geolocation.getCurrentPosition(function reportPosition(e) {
		    // if (!e.success || e.error) {
		        // // aw, shucks...
		    // }
		    // else {
		        // win.add(Admob.createView({
		            // bottom: 0, left: 0,
		            // width: 320, height: 50,
		            // publisherId: 'a14fc70a8d46176', // You can get your own at http: //www.admob.com/
		            // adBackgroundColor: 'black',
		            // // testing: true,
		            // // dateOfBirth: new Date(1985, 10, 1, 12, 1, 1),
		            // gender: 'female',
		            // keywords: 'shopping',
		            // location: e.coords
		        // }));
		    // }
		// });	
		//End of Admob		
	}
	
	var embeddedhtml='<html><body style="background:#000;margin-top:0px;margin-left:0px"><center><table width="100%" height="100%"><tr><td valign="middle">'+
					'<iframe width= "100%" height = "75%" src="';

	switch (videosource.toUpperCase()) {
		case 'YOUTUBE':
			embeddedhtml += 'http://www.youtube.com/embed/'+url+'?rel=0';
			break;
		case 'VIMEO':
			embeddedhtml += 'http://player.vimeo.com/video/'+url+'?portrait=0';
			break;
	}
	
	embeddedhtml += '" frameborder="0" allowfullscreen></iframe></td></tr></table></center></body></html>';		 
	
	var webvideo = Ti.UI.createWebView({
		top:view_header_gap,
		bottom:view_header_gap,
		html : embeddedhtml,
		// url:'http://www.youtube.com/embed/'+'511XK1L-Btg'+'?rel=0',
		scalesPageToFit:true,
	})
			
	win.add(webvideo);
	
	if (tabbed_window && show_navbar) {
		win.navBarHidden = false;
	} else {
		win.navBarHidden = true;
	}
	win.addEventListener('open',function(){
		logging('WEBVIDEO', title)
<<<<<<< HEAD
		if (Ti.Platform.osname !='mobileweb'){
=======
		if (Ti.Platform.osname !='mobile'){
>>>>>>> BitBucket/master
			tracker.trackEvent({ category: "WEBVIDEO", action: "Open", label: title, value: 1 });
		}
	})
	return win
};

module.exports = WebVideoWindow;
