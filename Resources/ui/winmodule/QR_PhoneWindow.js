function QR_PhoneWindow(title,url) {

	Ti.include('/jslib/fnc_logging.js');
	Ti.include('/stylelib/style_01.js');
	
	var win = Ti.UI.createWindow({
		title:title,
		backgroundColor:stytle_winBGColor,
		barColor:stytle_winBarColor,	
		navBarHidden:false
	});
	
	var osname = Ti.Platform.osname,
		version = Ti.Platform.version,
		height = Ti.Platform.displayCaps.platformHeight,
		width = Ti.Platform.displayCaps.platformWidth;	
	var isTablet = osname === 'ipad' || (osname === 'android' && (width > 899 || height > 899));
	var adgap=(isTablet?90:50);
	var adwidth=(isTablet?728:320);
	var ad_role = Ti.App.Properties.getInt('cloud_userrole',0)
	var view_header_gap=0,view_footer_gap=0
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
		
		//Admob Setting
		var Admob = require('ti.admob');

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
		view_footer_gap = adgap
		//End of Admob		
	}
	
	var icon_img=Ti.UI.createImageView({
		image:'/images/qr_phone.png',
		top:20+view_header_gap,
		width:100,
		height:100,
	})
	
	icon_img.addEventListener('click',function(e){
		Ti.Platform.openURL(url.toString().toLowerCase());
	})
		
	win.add(icon_img)		

	var lbl_tel = Ti.UI.createLabel({
		text:url.substr(4,200),
		top:150+view_header_gap,
		font: {fontSize:24, fontWeight:'bold'},
		color:style_fontcolor
	})
	
	lbl_tel.addEventListener('click',function(e){
		Ti.Platform.openURL(url.toString().toLowerCase());
	})	
	win.add(lbl_tel)

	// win.addEventListener('open',function(){logging('QR_PHONE', title)})
	
	return win
};

module.exports = QR_PhoneWindow;
