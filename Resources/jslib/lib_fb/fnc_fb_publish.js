function fb_pub_stream(method,fb_message,fb_link) {
	/*globals Titanium, Ti, alert, require, setTimeout, setInterval, JSON*/
	var win = Ti.UI.createWindow({backgroundColor:'#fff'});
	Titanium.Facebook.appid = "538456682835078";
	Titanium.Facebook.permissions = ['publish_stream', 'read_stream'];
	
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
		win.close();
	}
	
	var login = Titanium.Facebook.createLoginButton({
		top: '48%'
	});
	
	if(Titanium.Platform.name == 'iPhone OS')
	{
		login.style = Ti.Facebook.BUTTON_STYLE_NORMAL;
	}
	else
	{
		login.style ='normal';
	}
	win.add(login);
	
	var actionsView = Ti.UI.createView({
		top: 55, left: 0, right: 0, visible: Titanium.Facebook.loggedIn, height: 'auto'
	});
	
	Titanium.Facebook.addEventListener('login', function(e) {
		if (e.success) {
			//actionsView.show();
			win.fireEvent('open')
		}
		if (e.error) {
			alert(e.error);
		}
	});
	
	win.addEventListener('open',function(e){
		if (Ti.Facebook.loggedIn){
			// var applink='http://mcms.fuihan.com/content/'+Ti.Utils.base64encode('&content='+Ti.App.Properties.getString('cloud_useremail','8.service@fuihan.com').substr(9,200))
			var fb_mcms_logo = 'http://www.qrapp.com.tw/styles/images/header_applogo.png'
			var fb_description = '將你的網站內容發佈在行動裝置中 Turn your content into Mobile App.'
			var fb_caption = '我的迷你行動內容 my mini mobile CMS'
			var fb_name = 'mCMS'
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
		}
	})

	return win;
};

module.exports = fb_pub_stream;
