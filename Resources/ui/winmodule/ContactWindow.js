function ContactWindow(tabbed_window,show_navbar,title,avatarid) {

	Ti.include('/jslib/fnc_logging.js');

	var win = Ti.UI.createWindow({
		title:title,
		backgroundColor:'#fff',
		navBarHidden:true
	});
	
	var contact_avatar_content = Ti.UI.createImageView({
		top:20,
		height:150,
		width:'auto'
	})

	var contact_name = Ti.UI.createLabel({
		top:190,
		left : 0,
		width: 100,
		textAlign: 'right',
		font:{fontSize:18},
		height: 'auto',
		textid:'USER_NAME'
	})

	var contact_name_content = Ti.UI.createLabel({
		top:190,
		left :110,			
		right:20,			
		textAlign: 'left',
		font:{fontSize:18},
		height: 'auto',
		color: '#369'
	})

	var contact_email = Ti.UI.createLabel({
		top:230,
		left : 0,
		width: 100,
		textAlign: 'right',
		font:{fontSize:18},
		height: 'auto',
		textid:'USER_EMAIL'
	})

	var contact_email_content = Ti.UI.createLabel({
		top:230,
		left :110,			
		right:20,			
		textAlign: 'left',
		font:{fontSize:18},
		height: 'auto',
		color: '#369'
	})

	var contact_mobile = Ti.UI.createLabel({
		top:270,
		left : 0,
		width: 100,
		textAlign: 'right',
		font:{fontSize:18},
		height: 'auto',
		textid:'USER_MOBILE'
	})

	var contact_mobile_content = Ti.UI.createLabel({
		top:270,
		left :110,			
		right:20,			
		textAlign: 'left',
		font:{fontSize:18},
		height: 'auto',
		color: '#369'
	})


	var contact_address = Ti.UI.createLabel({
		top:310,
		left : 0,
		width: 100,
		textAlign: 'right',
		font:{fontSize:18},
		height: 'auto',
		textid:'USER_ADDRESS'
	})

	var contact_address_content = Ti.UI.createLabel({
		top:310,
		left :110,			
		right:20,			
		textAlign: 'left',
		font:{fontSize:18},
		height: 'auto',
		color: '#369'
	})				

	win.add(contact_avatar_content)
	// win.add(contact_name,contact_name_content,contact_email,contact_email_content,
		// contact_mobile,contact_mobile_content,contact_address,contact_address_content);	 	
	win.add(contact_name);
	win.add(contact_name_content);
	win.add(contact_email);
	win.add(contact_email_content);						
	win.add(contact_mobile);
	win.add(contact_mobile_content);
	win.add(contact_address);	
	win.add(contact_address_content);													

	win.addEventListener('open',function(){

		var Cloud = require('ti.cloud');
		Cloud.Users.login({
		    login: Ti.App.Properties.getString('cloud_useremail','defaultui@fuihan.com'),
		    password: Ti.App.Properties.getString('cloud_userpassword','fuihan168'),
		}, function (e) {
			if (e.success) {
				Cloud.Photos.show({
				    photo_id: avatarid
				}, function (e) {
				    if (e.success) {
				        var photo = e.photos[0];
				        contact_name_content.text = photo.custom_fields['name'];
				        contact_email_content.text = photo.custom_fields['mail'];
				        contact_mobile_content.text = photo.custom_fields['phone'];
				        contact_address_content.text = photo.custom_fields['address'];
				        contact_avatar_content.image = photo.urls['medium_500']
				        
						//Download Avatar to local	
											
						// c = Titanium.Network.createHTTPClient();
						// c.setTimeout(10000);
						// c.onload = function()
						// {
							// Ti.API.info('IN ONLOAD ');
							// var filename = 'avatar.jpg'
							// var f = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,filename);
							// if (Titanium.Platform.name == 'android') {
								// f.write(this.responseData);
							// }
						// };
						// // open the client
						// if (Titanium.Platform.name == 'android') {
							// //android's WebView doesn't support embedded PDF content
							// c.open('GET', contact_avatar_content.image);
						// } else {
							// c.open('GET',contact_avatar_content.image);
							// c.file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,'avatar.jpg');
						// }
						// // send the data
						// c.send();
						
												
						contact_mobile_content.addEventListener('click',function(e){
							Ti.Platform.openURL('tel:'+photo.custom_fields['phone']);
						})
					
						contact_email_content.addEventListener('click',function(){
							var emailDialog = Ti.UI.createEmailDialog({
								zIndex:999
							})
							emailDialog.setSubject(' Hello '+photo.custom_fields['name']);
							emailDialog.setToRecipients([photo.custom_fields['mail']]);			
							emailDialog.open();
						})
						
						contact_address_content.addEventListener('click',function(e){
							var mapwin=Ti.UI.createWindow({
								title:'MAP',
								modal:true
							})
							
							var btn_close=Ti.UI.createButton({
								titleid:'CLOSE_WIN'
							})
							
							btn_close.addEventListener('click',function(e){
								mapwin.close();
							})
							
							mapwin.leftNavButton=btn_close;
							var mapview=Ti.UI.createWebView({
								url:'http://maps.google.com/maps?z=15&q='+photo.custom_fields['address']
							})		
							mapwin.add(mapview)
							
							mapwin.open();
							// Ti.Platform.openURL('Maps://maps.google.com/maps?z=15&q='+address)			
						})
		        
				    } else {
				        alert('Error:\\n' +
				            ((e.error && e.message) || JSON.stringify(e)));
				    }
				});				

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
	win.addEventListener('open',function(){logging('CONTACT', title)});
	return win
};

module.exports = ContactWindow;
