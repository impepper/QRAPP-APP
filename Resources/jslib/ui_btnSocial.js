function ui_btnSocial(_root_win,sharingType,sharingLink) {

	function act_close_menuWin(){
		var t = Titanium.UI.create2DMatrix();
		t= t.rotate(-90);
		menuWin.animate({transform:t,opacity:0,duration:800}, function()
		{
			menuWin.close();
		});
		visible=false;		
	}
	function showRequestResult(e) {
		var s = '';
		if (e.success) {
			s = "Post Successfully processed";
		} else if (e.cancelled) {
			s = "Post Cancelled";
		} else {
			s = "Posting Failed";
			if (e.error) {
				s += "; " + e.error;
			}
		}
		alert(s);
		
		act_close_menuWin()
	}
	
	function fnc_fb_post(method,fb_message,fb_link){
		if (Ti.Facebook.loggedIn){
			// var applink='http://mcms.fuihan.com/content/'+Ti.Utils.base64encode('&content='+Ti.App.Properties.getString('cloud_useremail','8.service@fuihan.com').substr(9,200))
			var fb_mcms_logo = 'http://www.qrapp.com.tw/styles/images/header_applogo.png'
			var fb_description = '將你的網站內容發佈在行動裝置中 Turn your content into Mobile App.'
			var fb_caption = '我的迷你行動內容 my mini mobile CMS'
			var fb_name = L('_MCMS','mCMS')
			// if (fb_link!=undefined){
				// applink='http://mcms.fuihan.com/content/'+Ti.Utils.base64encode(fb_link)
			// }
			if (method=='DIALOG'){
				//Post on Wall using Dialog	
				var data = {
					link: fb_link,
					message: fb_message,
					picture: fb_mcms_logo,
					name: fb_name,
					caption: fb_caption,
					description: fb_description
				};
				Titanium.Facebook.dialog("feed", data, showRequestResult);								
			} else {
				//Post on Wall using Graph API
				var data = {
					link: fb_link,
					//link format: http://mcms.fuihan.com/content/JmNvbnRlbnQ9Ni5kZW1vQGZ1aWhhbi5jb20=
					//  realdata: http://mcms.fuihan.com/content/&content=6.demo@fuihan.com
					
					message: fb_message,
					picture: fb_mcms_logo,
					name: fb_name,
					caption: fb_caption,
					description: fb_description					
				};
				Titanium.Facebook.requestWithGraphPath('me/feed', data, 'POST', showRequestResult);				
			}
		} else {
			var fb_post= require('jslib/lib_fb/fnc_fb_publish');
			var win_fb_post = new fb_post(method,fb_message,fb_link)
			var b = Titanium.UI.createButton({
				titleid:'_CLOSE',
				style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
			});
			win_fb_post.setLeftNavButton(b);
			b.addEventListener('click',function(){
				win_fb_post.close();
			});		
			win_fb_post.open({modal:true})						
		}

	}	

		
	// if ((Ti.Platform.osname =='iphone') || (Ti.Platform.osname =='ipad')){
		var t = Titanium.UI.create2DMatrix();
		t= t.rotate(-90);
		var menuWin = Titanium.UI.createWindow({
			backgroundImage:'images/menubox_1.png',
			height:140,
			width:204,
			top:32,
			right:40,
			anchorPoint:{x:1,y:0},
			transform:t,
			opacity:0
		});
		if (sharingType == undefined) { sharingType ='mcms'}
		if (sharingLink == undefined) { sharingLink ='http://www.qrapp.com.tw'}
		
		var applink='http://code.qrapp.com.tw/content/'+Ti.Utils.base64encode('&content='+Ti.App.Properties.getString('cloud_useremail','viewer.8.service@fuihan.com').substr(7,200))
		var twitter_message = '這是個很酷的 QRCode，你可以試試看 It is an amazing QRCode, Give it a try. '
		var fb_message = "我建立了一個 mCMS QR Code，跟別的QR Code不一樣，他包含了很多很酷的資訊喔"

		if (sharingType == 'common'){
			applink='http://code.qrapp.com.tw/content_link/'+Ti.Utils.base64encode(sharingLink)
		}

	
		var ui_social_btn_fb = Ti.UI.createButton({
			// title:'Share on Facebook',
			backgroundImage:'images/facebook_icon.png',
			// width:45,
			// height:45,
			// top:60,
			// left:19
			width:65,
			height:65,
			top:48,
			left:24			
		})	
	
		ui_social_btn_fb.addEventListener('click',function(e){
			// alert(sharingType+'/'+fb_message+'/'+applink)
			if (sharingType != 'common'){
				fnc_fb_post('GRAPH',fb_message,applink)
			} else {
				fnc_fb_post('DIALOG',fb_message,applink)
			}
		})	
	
		menuWin.add(ui_social_btn_fb)
		

		
		// var ui_social_btn_twitter_dialog = Ti.UI.createButton({
			// // title:'Twitter it',
			// backgroundImage:'images/twitter_icon.png',
			// width:45,
			// height:45,
			// top:60,
			// left:79
		// })	
// 	
		// ui_social_btn_twitter_dialog.addEventListener('click',function(e){
// 					
		    // var accessTokenKey = Ti.App.Properties.getString('twitterAccessTokenKey'),
		        // accessTokenSecret = Ti.App.Properties.getString('twitterAccessTokenSecret');
		    // var twitter_consumerKey= "oMxb6JZ0Ikh9eRJA13qNAw",
		      	// twitter_consumerSecret= "0XnpsqHqjU9WpRx1wTixFCV4VDrh9Rcd3Ix1ddFsHOc";	        
// 	
		    // var accessTokenKey = Ti.App.Properties.getString('twitterAccessTokenKey'),
		        // accessTokenSecret = Ti.App.Properties.getString('twitterAccessTokenSecret');
// 		
		    // var Twitter = require('jslib/lib_twitter/twitter').Twitter;
// 		    
		    // var client = Twitter({
		      // consumerKey: twitter_consumerKey,
		      // consumerSecret: twitter_consumerSecret,
		      // accessTokenKey: accessTokenKey,
		      // accessTokenSecret: accessTokenSecret
		    // });
// 		    	    
		    // client.addEventListener('login', function(e) {
		      // if (e.success) {
		        // Ti.App.Properties.setString('twitterAccessTokenKey', e.accessTokenKey);
		        // Ti.App.Properties.setString('twitterAccessTokenSecret', e.accessTokenSecret);
// 		        
		        // client.request("1.1/statuses/update.json", {status : twitter_message+applink}, 'POST', function(e) {
		          // if (e.success) {
		          	// alert('Successfully Tweetted')
		          	// Ti.API.info('Tweet msg:'+twitter_message+applink)
		          // } else {
		            // alert(e.error);
		          // }
		        // });
		      // } else {
		        // alert(e.error);
		      // }
		    // });
// 		    
		    // client.authorize();
// 	
		// })
		// menuWin.add(ui_social_btn_twitter_dialog)
	
		var ui_social_btn_mail = Ti.UI.createButton({
			// title:'Share via eMail',
			backgroundImage:'images/mail_icon.png',
			// width:45,
			// height:45,
			// top:60,
			// left:139
			width:65,
			height:65,
			top:48,
			left:114			
		})	
	
		ui_social_btn_mail.addEventListener('click',function(e){
			act_close_menuWin();
			var emailDialog = Titanium.UI.createEmailDialog({
				html:true,
				subject : L('_SHARINGQR','QRCode Sharing'),
				// toRecipients = ['chihong.lin@gmail.com'],
				messageBody:'<html>這是個很酷的 QRCode，你可以試試看<br> It is an amazing QRCode, Give it a try.<br><h2><a href="'+applink+'"> mCMS QR</a></h2><br></html>'
				//emailDialog.messageBody = '這是個很酷的 QRCode，你可以試試看 It is an amazing QRCode, Give it a try.<br><h2><a href="'+applink+'"> mCMS QR</a></h2><br>';
			})
			if (sharingType == 'common'){
				emailDialog.messageBody='<html>我做了這個 QRCode 給你，快看看！<br>I just made a QR Code for our, Check this out!<br><h2><a href="'+applink+'"> mCMS QR</a></h2><br></html>'
			}			
			emailDialog.open();
		})
		menuWin.add(ui_social_btn_mail)	
	
		
		var t2 = Titanium.UI.create2DMatrix();
		
		var ui_social_btn = Titanium.UI.createButton({
			// title:'Share'
			systemButton:Titanium.UI.iPhone.SystemButton.ACTION
		});
		var visible = false;
		ui_social_btn.addEventListener('click', function()
		{
			if (!visible)
			{
				menuWin.open();
				menuWin.animate({transform:t2,opacity:1,duration:800});
				visible=true;
				_root_win.addEventListener('close', function() {
					menuWin.close();
				});
			}
			else
			{
				var t = Titanium.UI.create2DMatrix();
				t= t.rotate(-90);
				menuWin.animate({transform:t,opacity:0,duration:800}, function()
				{
					menuWin.close();
				});
				visible=false;
			}
		});	
				
		return ui_social_btn;
	// }
};

module.exports = ui_btnSocial;	