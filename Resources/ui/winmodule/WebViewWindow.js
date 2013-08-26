function WebViewWindow(tabbed_window,show_navbar,title,url) {
	// alert('checkpoint 1')
	Ti.include('/jslib/fnc_logging.js');


	if (Ti.Platform.osname !='mobileweb'){

		// var GA_App = require('analytics.google'); 
		// var tracker_App = GA_App.getTracker('UA-41799104-1');
	}
	
	
	
	var win = Ti.UI.createWindow({
		title:title,
		backgroundColor:'black',
		navBarHidden:true
	});
	// alert('checkpoint 2a')
	var osname = Ti.Platform.osname,
		version = Ti.Platform.version,
		height = Ti.Platform.displayCaps.platformHeight,
		width = Ti.Platform.displayCaps.platformWidth;
	// alert('checkpoint 2b')
	var isTablet = false
	if ((osname === 'ipad') || (osname === 'android' && (width > 899 || height > 899))){
		isTablet = true
	};
	// alert('checkpoint 2c')
	var adgap=(isTablet?90:50);
	var adwidth=(isTablet?728:320);
	// alert('checkpoint 2d')
	var ad_role = Ti.App.Properties.getInt('cloud_userrole',0)
	var view_header_gap=0
	// alert('checkpoint 2e')
	if (Ti.Platform.osname=='mobileweb'){
		var scrollView = Ti.UI.createScrollView({
		  contentWidth: 'auto',
		  contentHeight: 'auto',
		  height: 'auto',
		  width: 'auto',
		  layout:'vertical'
		});		
	}
	
	if ((ad_role < 5) && (Ti.Platform.osname!='mobileweb')){
		view_header_gap=adgap;
		//Admob Setting
		var Admob = require('ti.admob');
	
		var ad;
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
        win.add(Admob.createView({
            bottom: 0, //left: 0,
            width: adwidth, height: adgap,
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
		            // bottom: 0, //left: 0,
		            // width: adwidth, height: adgap,
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
	var webview = Ti.UI.createWebView({
		top:view_header_gap,
		bottom:view_header_gap,
		url:url
	})
	//alert('mobile name:'+Ti.Platform.osname)
	if (Ti.Platform.osname=='mobileweb'){
		//alert('mobile')
		// alert('checkpoint 3')
		webview.addEventListener('load', function(e) {
			//alert('mobile height:'+ webview.evalJS("document.height"))
		    Ti.API.info("height:" + webview.evalJS("document.height"));
		    webview.height = webview.evalJS("document.height");
		});
		webview.addEventListener('touchmove',function(e) {
		    return false;
		}); 	
		scrollView.add(webview)	
		win.add(scrollView)
	} else {
		
		win.add(webview);	
	}		
	
	// alert('checkpoint 4')
	if (tabbed_window && show_navbar) {
		win.navBarHidden = false;
	} else {
		win.navBarHidden = true;
	}
	
	// win.addEventListener('open',function(){
		// logging('WEBPAGE', title)
// 
// 
		// if (Ti.Platform.osname !='mobileweb'){
			// // tracker_App.trackEvent({ category: "QR App", action: "Title", label: 'TestWebView', value: 1 });
			// // tracker.trackEvent({ category: Ti.App.Properties.getString('QRAppContentTitle','mCMS Content'), action: "WEBPAGE", label: title, value: 1 });
		// }
// 
	// })
	
	return win
};

module.exports = WebViewWindow;
