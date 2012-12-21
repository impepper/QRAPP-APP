function CustomPageWindow(tabbed_window,show_navbar,title,url,pagecontent) {
	// Ti.API.info("module is => " + vponmod);
	var vponmod = require('herxun.vpon');
	Ti.API.info("module is => " + vponmod);
	var win = Ti.UI.createWindow({
	    backgroundColor: 'white'
	});
	
	var label = Ti.UI.createLabel();
	win.add(label);
	

	
	Ti.API.info("module is => " + vponmod);
	
	var vponview = vponmod.createView({
	    //licenseKey:"VPON_FOR_TITANIUM_LICENSE", // required, the license key applied from http://tw.pub.vpon.com/register.action?company=herxun
	    licenseKey:"YXYwAmBHzRH5qNZFmJ7U5Dk+hsLr+qab57FhAbH3yE5sWbeD/fKhRe94JuH806dK",
	    frame:"0,0,320,48", // (x, y, w, x), optional (default: android - 0,0; ios - 0,0,320,48)
	    areaCode:"TW" // tw or cn, case-insensitive, optional (default: tw)
	    // location:"25.058952,121.54440", // latitude,longitude, optional, default: 25.058952,121.54440; ios only
	    // deviceType:"iPhone", //case-insensitive, iphone or ipad, optional (default: iphone); ios only 
	    // autoRefreshAd: "y" // y (for yes) or n (for no); android only
	});
	
	win.add(vponview);
// 	
	// var view2 = vponmod.createView({
	    // licenseKey:"YXYwAmBHzRH5qNZFmJ7U5Dk+hsLr+qab57FhAbH3yE5sWbeD/fKhRe94JuH806dK ", // required, the license key applied from http://tw.pub.vpon.com/register.action?company=herxun
	    // frame:"0,60,320,48", // (x, y, w, x), optional (default: android - 0,0; ios - 0,0,320,48)
	    // areaCode:"TW", // tw or cn, case-insensitive, optional (default: tw)
// 	    
	    // location:"25.058952,121.54440", // latitude,longitude, optional, default: 25.058952,121.54440; ios only
	    // deviceType:"iPhone", //case-insensitive, iphone or ipad, optional (default: iphone); ios only
// 	    
	    // autoRefreshAd: "y" // y (for yes) or n (for no); android only
	// });
// 	
	// win.add(view2);
	
	Ti.API.info("finish view loading!!");
	
	return win
};

module.exports = CustomPageWindow;
