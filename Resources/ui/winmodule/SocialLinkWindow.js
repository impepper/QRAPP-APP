function SocialLinkWindow(tabbed_window,show_navbar,title,avatarid) {
	
	
	var applink='http://mcms.fuihan.com/content/'+Ti.Utils.base64encode('&content='+Ti.App.Properties.getString('cloud_useremail','8.service@fuihan.com').substr(9,200))
	var twitter_message = '這是個很酷的 QRCode，你可以試試看 It is an amazing QRCode, Give it a try. '
	var fb_message = "我建立了一個 mCMS QR Code，跟別的QR Code不一樣，他包含了很多很酷的資訊喔"
		
	var win = Ti.UI.createWindow({
		title:title,
		backgroundColor:'#fff',
		navBarHidden:true
	});

	var btn_fb = Ti.UI.createButton({
		title:'Share on Facebook',
		left:'10%',
		right:'10%',
		top:20
	})	

	btn_fb.addEventListener('click',function(e){
		var fb_post= require('ui/winmodule/fnc_fb_publish');
		var win_fb_post = new fb_post('GRAPH',fb_message)
		var b = Titanium.UI.createButton({
			title:'Close',
			style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
		});
		win_fb_post.setLeftNavButton(b);
		b.addEventListener('click',function()
		{
			win_fb_post.close();
		});		
		win_fb_post.open({modal:true})
	})
	win.add(btn_fb)

	var btn_fb_dialog = Ti.UI.createButton({
		title:'Comment on Facebook',
		left:'10%',
		right:'10%',
		top:80
	})	

	btn_fb_dialog.addEventListener('click',function(e){
		var fb_post= require('ui/winmodule/fnc_fb_publish');
		var win_fb_post = new fb_post('DIALOG',fb_message)
		var b = Titanium.UI.createButton({
			title:'Close',
			style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
		});
		win_fb_post.setLeftNavButton(b);
		b.addEventListener('click',function()
		{
			win_fb_post.close();
		});		
		win_fb_post.open({modal:true})
	})
	win.add(btn_fb_dialog)
	
	var btn_twitter_dialog = Ti.UI.createButton({
		title:'Twitter it',
		left:'10%',
		right:'10%',
		top:140
	})	

	btn_twitter_dialog.addEventListener('click',function(e){
				
	    var accessTokenKey = Ti.App.Properties.getString('twitterAccessTokenKey'),
	        accessTokenSecret = Ti.App.Properties.getString('twitterAccessTokenSecret');
	    var twitter_consumerKey= "oMxb6JZ0Ikh9eRJA13qNAw",
	      	twitter_consumerSecret= "0XnpsqHqjU9WpRx1wTixFCV4VDrh9Rcd3Ix1ddFsHOc";	        

	    var accessTokenKey = Ti.App.Properties.getString('twitterAccessTokenKey'),
	        accessTokenSecret = Ti.App.Properties.getString('twitterAccessTokenSecret');
	
	    var Twitter = require('ui/winmodule/lib_twitter/twitter').Twitter;
	    
	    var client = Twitter({
	      consumerKey: twitter_consumerKey,
	      consumerSecret: twitter_consumerSecret,
	      accessTokenKey: accessTokenKey,
	      accessTokenSecret: accessTokenSecret
	    });
	    	    
	    client.addEventListener('login', function(e) {
	      if (e.success) {
	        Ti.App.Properties.setString('twitterAccessTokenKey', e.accessTokenKey);
	        Ti.App.Properties.setString('twitterAccessTokenSecret', e.accessTokenSecret);
	        
	        client.request("1.1/statuses/update.json", {status : twitter_message+applink}, 'POST', function(e) {
	          if (e.success) {
	          	alert('Successfully Tweetted')
	          	Ti.API.info('Tweet msg:'+twitter_message+applink)
	          } else {
	            alert(e.error);
	          }
	        });
	      } else {
	        alert(e.error);
	      }
	    });
	    
	    client.authorize();

	})
	win.add(btn_twitter_dialog)
	
	var btn_weibo = Ti.UI.createButton({
		title:'Share on weibo',
		left:'10%',
		right:'10%',
		top:200
	})	

	btn_weibo.addEventListener('click',function(e){

	})
	win.add(btn_weibo)

	var btn_mail = Ti.UI.createButton({
		title:'Share via eMail',
		left:'10%',
		right:'10%',
		top:260
	})	

	btn_mail.addEventListener('click',function(e){
		var emailDialog = Titanium.UI.createEmailDialog({
			html:true,
			subject : 'QRCode Sharing',
			// toRecipients = ['chihong.lin@gmail.com'],
			messageBody:'<html>這是個很酷的 QRCode，你可以試試看 It is an amazing QRCode, Give it a try.<br><h2><a href="'+applink+'"> mCMS QR</a></h2><br></html>'
			//emailDialog.messageBody = '這是個很酷的 QRCode，你可以試試看 It is an amazing QRCode, Give it a try.<br><h2><a href="'+applink+'"> mCMS QR</a></h2><br>';
		})
		emailDialog.open();
	})
	win.add(btn_mail)
	
	// //
	// // Login Status
	// //
	// var label = Ti.UI.createLabel({
		// text:'Logged In = ' + Titanium.Facebook.loggedIn,
		// font:{fontSize:14},
		// height:'auto',
		// top:10,
		// textAlign:'center'
	// });
	// win.add(label);
// 	
	// var forceButton = Ti.UI.createButton({
		// title:'Force dialog: '+Titanium.Facebook.forceDialogAuth,
		// top:50,
		// width:160,
		// height:40
	// });
	// forceButton.addEventListener('click', function() {
		// Titanium.Facebook.forceDialogAuth = !Titanium.Facebook.forceDialogAuth;
		// forceButton.title = "Force dialog: "+Titanium.Facebook.forceDialogAuth;
	// });
	// win.add(forceButton);
// 	
	// function updateLoginStatus() {
		// label.text = 'Logged In = ' + Titanium.Facebook.loggedIn;
	// }
// 	
	// // capture
	// Titanium.Facebook.addEventListener('login', updateLoginStatus);
	// Titanium.Facebook.addEventListener('logout', updateLoginStatus);
// 	
	// //
	// // Login Button
	// //
	// if(Titanium.Platform.name == 'iPhone OS'){
		// win.add(Titanium.Facebook.createLoginButton({
			// style:Ti.Facebook.BUTTON_STYLE_WIDE,
			// bottom:30
		// }));
	// }
	// else{
		// win.add(Titanium.Facebook.createLoginButton({
			// style:'wide',
			// bottom:30
		// }));
	// }	
											
	win.addEventListener('open',function(){

		// var Cloud = require('ti.cloud');
		// Cloud.Users.login({
		    // login: Ti.App.Properties.getString('cloud_useremail','defaultui@fuihan.com'),
		    // password: Ti.App.Properties.getString('cloud_userpassword','fuihan168'),
		// }, function (e) {
			// if (e.success) {
				// Cloud.Photos.show({
				    // photo_id: avatarid
				// }, function (e) {
				    // if (e.success) {
				        // var photo = e.photos[0];
				        // contact_name_content.text = photo.custom_fields['name'];
				        // contact_email_content.text = photo.custom_fields['mail'];
				        // contact_mobile_content.text = photo.custom_fields['phone'];
				        // contact_address_content.text = photo.custom_fields['address'];
				        // contact_avatar_content.image = photo.urls['medium_500']
// 											
						// contact_mobile_content.addEventListener('click',function(e){
							// Ti.Platform.openURL('tel:'+photo.custom_fields['phone']);
						// })
// 					
						// contact_email_content.addEventListener('click',function(){
							// var emailDialog = Ti.UI.createEmailDialog({
								// zIndex:999
							// })
							// emailDialog.setSubject(' Hello '+photo.custom_fields['name']);
							// emailDialog.setToRecipients([photo.custom_fields['mail']]);			
							// emailDialog.open();
						// })
// 						
						// contact_address_content.addEventListener('click',function(e){
							// var mapwin=Ti.UI.createWindow({
								// title:'MAP',
								// modal:true
							// })
// 							
							// var btn_close=Ti.UI.createButton({
								// titleid:'CLOSE_WIN'
							// })
// 							
							// btn_close.addEventListener('click',function(e){
								// mapwin.close();
							// })
// 							
							// mapwin.leftNavButton=btn_close;
							// var mapview=Ti.UI.createWebView({
								// url:'http://maps.google.com/maps?z=15&q='+photo.custom_fields['address']
							// })		
							// mapwin.add(mapview)
// 							
							// mapwin.open();
							// // Ti.Platform.openURL('Maps://maps.google.com/maps?z=15&q='+address)			
						// })
// 		        
				    // } else {
				        // alert('Error:\\n' +
				            // ((e.error && e.message) || JSON.stringify(e)));
				    // }
				// });				
// 
		    // } else {
		        // alert('Error:\\n' +
		            // ((e.error && e.message) || JSON.stringify(e)));
		    // }
		// });	//end Cloud Login				
	}); //end evetListener Open

	
	if (tabbed_window && show_navbar) {
		win.navBarHidden = false;
	} else {
		win.navBarHidden = true;
	}
	win.addEventListener('open',function(){logging('SOCIALLINK', title)})
	return win
};

module.exports = SocialLinkWindow;
