function ImageViewWindow(tabbed_window,show_navbar,title,win_id,coverflow_view) {

	Ti.include('/jslib/fnc_logging.js');
		
	var win = Ti.UI.createWindow({
		title:title,
		backgroundColor:'black',
		navBarHidden:true
	});
		
	var osname = Ti.Platform.osname,
		version = Ti.Platform.version,
		height = Ti.Platform.displayCaps.platformHeight,
		width = Ti.Platform.displayCaps.platformWidth;	
	var isTablet = osname === 'ipad' || (osname === 'android' && (width > 899 || height > 899));
	var adgap=(isTablet?90:50);
	var adwidth=(isTablet?728:320);
	var ad_role = Ti.App.Properties.getInt('cloud_userrole',0)
	var view_header_gap=0
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


	var desc_array=[];
	var coverflow_imagefile_array=[];
	var scroll_image_array=[];
	
	if (((Ti.Platform.osname=='iphone') || (Ti.Platform.osname=='ipod') || (Ti.Platform.osname=='ipad')) && coverflow_view) {
		
		var coverflow_image_view = Ti.UI.iOS.createCoverFlowView({
			top:view_header_gap,
			bottom:view_header_gap,
			images:coverflow_imagefile_array
		})
		
		coverflow_image_view.addEventListener('change',function(e){
			desc_text.text = desc_array[e.index];
			if (desc_text.text==''){
				desc_text_view.hide()
			} else {
				desc_text_view.show()
			}
		})
				
		win.add(coverflow_image_view);			
	} else {
		
		var scroll_image_view = Ti.UI.createScrollableView({
			top:view_header_gap,
			bottom:view_header_gap,			
			views:scroll_image_array,
			showPagingControl:true
		})

		scroll_image_view.addEventListener('change',function(e){
			desc_text.text = desc_array[e.index];
			if (desc_text.text==''){
				desc_text_view.hide()
			} else {
				desc_text_view.show()
			}			
		})
				
		win.add(scroll_image_view);			
	}

	var desc_text_view= Ti.UI.createView({
		left:5,right:5,bottom:25+view_header_gap,height:50,
		zIndex:998,
		visible:false
	})
	var desc_text_background= Ti.UI.createView({
		backgroundColor:'#fff',
		opacity:0.3,
		width:'auto',
		height:'auto',
		borderRadius:8
	})
	var  desc_text=Ti.UI.createLabel({
		text:'this is a description for photo',
		color:'#fff',
		opacity:1
	})
	
	desc_text_view.add(desc_text_background,desc_text);
	win.add(desc_text_view);
	
	win.addEventListener('open',function(){

		var Cloud = require('ti.cloud'); 
		Cloud.Users.login({
		    login: Ti.App.Properties.getString('cloud_useremail','defaultui@fuihan.com'),
		    password: Ti.App.Properties.getString('cloud_userpassword','fuihan168'),
		}, function (e) {
			if (e.success) {
				// alert("win_id:"+win_id)
				Cloud.Photos.query({
				    page: 1,
				    per_page: 20,				    	
				    where: {
				        win_id:win_id
				    }
				}, function (e) {
					if (e.success) {				
						// alert("Photos:"+e.photos.length)
						var coverflow_imagefile_array=[];
						var scroll_image_array=[];						
				        // alert('Success:\\n' +
				            // 'Count: ' + e.photos.length);
				        desc_array=[];
				        
				        for (var i = 0; i < e.photos.length; i++) {
				            var photo = e.photos[i];
				            
				            desc_array.push(photo.custom_fields['description'])
				            coverflow_imagefile_array.push(photo.urls['medium_500']); 
				            var view=Ti.UI.createImageView({
									// image:photo.urls['thumb_100']
									// image:photo.urls['small_240']
									image:photo.urls['medium_500']
									// image:photo.urls['medium_640']
							})
							scroll_image_array.push(view);
				        }
        				
						if (((Ti.Platform.osname=='iphone') || (Ti.Platform.osname=='ipod') || (Ti.Platform.osname=='ipad')) && coverflow_view) {

							coverflow_image_view.images=coverflow_imagefile_array
							desc_text.opacity=1;
						} else {
								
							scroll_image_view.views=scroll_image_array;
							desc_text.opacity=0;		
						};
				
						desc_text.text=desc_array[0]
						if (desc_text.text==''){
							desc_text_view.hide()
						} else {
							desc_text_view.show()
						}						
				    } else {
				        alert('Error:\\n' +
				            ((e.error && e.message) || JSON.stringify(e)));
				    }
				});//end Cloud Query
		    } else {
		        alert('Error:\\n' +
		            ((e.error && e.message) || JSON.stringify(e)));
		    }
		});	//end Cloud Login				
	}); //end evetListener Open

	if (tabbed_window && show_navbar) {
		win.navBarHidden = false;
	} else {
		win.navBarHidden = true;
	}
	win.addEventListener('open',function(){logging('IMAGEVIEW', title)})
	return win
};

module.exports = ImageViewWindow;
