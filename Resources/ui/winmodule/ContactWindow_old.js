function ContactWindow(tabbed_window,show_navbar,title,name,email,mobile,address) {
		var win = Ti.UI.createWindow({
			title:title,
			backgroundColor:'white',
			navBarHidden:true
		});
		
		var contact_name = Ti.UI.createLabel({
			top:20,
			left : 0,
			width: 100,
			textAlign: 'right',
			font:{fontSize:14},
			height: 'auto',
			textid:'USER_NAME'
		})

		var contact_name_content = Ti.UI.createLabel({
			top:20,
			left :110,			
			right:20,			
			textAlign: 'left',
			font:{fontSize:14},
			height: 'auto',
			color: '#369',
			text:name
		})

		var contact_email = Ti.UI.createLabel({
			top:60,
			left : 0,
			width: 100,
			textAlign: 'right',
			font:{fontSize:14},
			height: 'auto',
			textid:'USER_EMAIL'
		})

		var contact_email_content = Ti.UI.createLabel({
			top:60,
			left :110,			
			right:20,			
			textAlign: 'left',
			font:{fontSize:14},
			height: 'auto',
			color: '#369',
			text:email
		})

		contact_email_content.addEventListener('click',function(){
			var emailDialog = Ti.UI.createEmailDialog({
				zIndex:999
			})
			emailDialog.setSubject(' Hello '+name);
			emailDialog.setToRecipients([email]);			
			emailDialog.open();
		})

		var contact_mobile = Ti.UI.createLabel({
			top:100,
			left : 0,
			width: 100,
			textAlign: 'right',
			font:{fontSize:14},
			height: 'auto',
			textid:'USER_MOBILE'
		})

		var contact_mobile_content = Ti.UI.createLabel({
			top:100,
			left :110,			
			right:20,			
			textAlign: 'left',
			font:{fontSize:14},
			height: 'auto',
			color: '#369',
			text:mobile
		})

		contact_mobile_content.addEventListener('click',function(e){
			Ti.Platform.openURL('tel:'+mobile);
		})

		var contact_address = Ti.UI.createLabel({
			top:140,
			left : 0,
			width: 100,
			textAlign: 'right',
			font:{fontSize:14},
			height: 'auto',
			textid:'USER_ADDRESS'
		})

		var contact_address_content = Ti.UI.createLabel({
			top:140,
			left :110,			
			right:20,			
			textAlign: 'left',
			font:{fontSize:14},
			height: 'auto',
			color: '#369',
			text:address
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
				url:'http://maps.google.com/maps?z=15&q='+address
			})		
			mapwin.add(mapview)
			
			mapwin.open();
			// Ti.Platform.openURL('Maps://maps.google.com/maps?z=15&q='+address)			
		})
		
		win.add(contact_name,contact_name_content,contact_email,contact_email_content,
			contact_mobile,contact_mobile_content,contact_address,contact_address_content);
		
		if (tabbed_window && show_navbar) {
			win.navBarHidden = false;
		} else {
			win.navBarHidden = true;
		}
		
		return win
};

module.exports = ContactWindow;
