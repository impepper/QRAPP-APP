function QR_TextWindow(title,url) {

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
	
		// var ad;
		// win.add(ad = Admob.createView({
		    // top: 0, //left: 0,
		    // width: adwidth, height: adgap,
		    // publisherId: 'a14fc70a8d46176', // You can get your own at http: //www.admob.com/
		    // adBackgroundColor: 'black',
		    // // testing: true,
		    // // dateOfBirth: new Date(1985, 10, 1, 12, 1, 1),
		    // gender: 'male',
		    // keywords: 'movie'
		// }));
		// view_header_gap = adgap	
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
		    gender: 'male',
		    keywords: 'movie'
		}));
		view_footer_gap = adgap	        
		
		//End of Admob		
	}
	var icon_img=Ti.UI.createImageView({
		image:'/images/qr_text.png',
		top:20+view_header_gap,
		width:100,
		height:100,
	})
	
	win.add(icon_img)
	
	var textarea = Ti.UI.createTextArea({
		top:140+view_header_gap,
		bottom:view_footer_gap,	
		left:30,
		right:30,
		// borderWidth:1,
		// borderColor:'#666',	
		// borderRadius: 5,
		backgroundColor:'transparent',
		value:url,
		font: {fontSize:20, fontWeight:'bold'},
		editable: false,
		color:style_fontcolor
	})
		
	win.add(textarea);	
		
	// win.addEventListener('open',function(){logging('QR_TEXT', title)})

	return win
};

module.exports = QR_TextWindow;
