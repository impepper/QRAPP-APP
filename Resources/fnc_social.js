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
}

function fnc_fb_post(method,fb_message,fb_link){
	if (Ti.Facebook.loggedIn){
		// var applink='http://mcms.fuihan.com/content/'+Ti.Utils.base64encode('&content='+Ti.App.Properties.getString('cloud_useremail','8.service@fuihan.com').substr(9,200))
		var fb_mcms_logo = 'http://www.qrapp.com.tw/styles/images/header_applogo.png'
		var fb_description = '將你的網站內容發佈在行動裝置中 Turn your content into Mobile App.'
		var fb_caption = '我的迷你行動內容 my mini mobile CMS'
		var fb_name = 'mCMS'
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
			title:'Close',
			style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
		});
		win_fb_post.setLeftNavButton(b);
		b.addEventListener('click',function()
		{
			win_fb_post.close();
		});		
		win_fb_post.open({modal:true})
					
	}

}