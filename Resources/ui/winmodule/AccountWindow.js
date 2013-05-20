function AccountWindow(title) {
	Ti.include('/jslib/fnc_cloud.js');
	
	var win = Ti.UI.createWindow({
		title:title,
		backgroundColor:'white'
	});
	
	var username_label = Ti.UI.createLabel({
		top:20,
		left:20,
		text:L('Username')
	})

	var username_content = Ti.UI.createTextField({
		top:20,
		left:120,
		width:160,
		borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		keyboardType:Ti.UI.KEYBOARD_DEFAULT,
		// hintText:'Please input your username...',
	})

	var email_label = Ti.UI.createLabel({
		top:60,
		left:20,
		text:L('E_Mail')
	})

	var email_content = Ti.UI.createTextField({
		top:60,
		left:120,
		width:160,
		borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		keyboardType:Ti.UI.KEYBOARD_EMAIL
		// hintText:'Please input your eMail...',
	})

	var password_label = Ti.UI.createLabel({
		top:100,
		left:20,
		text:L('Password')
	})

	var password_content = Ti.UI.createTextField({
		top:100,
		left:120,
		width:160,
		passwordMask:true,
		borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		keyboardType:Ti.UI.KEYBOARD_DEFAULT
		// hintText:'Please input your password...',
	})
	// win.add(password_content);
	
	var password_confirm_label = Ti.UI.createLabel({
		top:140,
		left:20,
		text:L('ReType')
	})
	
	var password_confirm_content = Ti.UI.createTextField({
		top:140,
		left:120,
		width:160,
		passwordMask:true,
		borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		keyboardType:Ti.UI.KEYBOARD_DEFAULT
		// hintText:'Please input your password...',
	})		
	var button_creat = Ti.UI.createButton({
		height:44,
		width:200,
		title:L('CreatAccount'),
		top:200
	});

	var button_login = Ti.UI.createButton({
		height:44,
		width:200,
		title:L('LoginAccount'),
		top:260
	});
	
	var switch_remember_label = Ti.UI.createLabel({
		text:L('Automatically Login'),
		top:320,
		left:40
	})
	
	var switch_remember = Ti.UI.createSwitch({
		top:320,
		left:220,
		title:'Auto Login',
		value:false
	})	
	
	switch_remember.addEventListener('change',function(e){
		 Ti.App.Properties.setBool('auto_login',e.value)
	})	
	
	// win.add(username_label,username_content,password_confirm_label,password_confirm_content)	
	// win.add(email_label,email_content,password_label,password_content);
	win.add(email_label);
	win.add(email_content);
	win.add(password_label);
	win.add(password_content);
		
	// win.add(button_creat);
	win.add(button_login);
	
	win.add(switch_remember_label)
	win.add(switch_remember)
	
	button_creat.addEventListener('click', function() {
		//containingTab attribute must be set by parent tab group on
		//the window for this work
		var Cloud = require('ti.cloud');
		Cloud.Users.logout(function(e){
			if (e.success) {
				//Creat New user
				//alert(email_content.value+','+password_content.value+','+password_confirm_content.value)
				Cloud.Users.create({
				    email: email_content.value,
				    username: email_content.value,
				    password: password_content.value,
				    password_confirmation: password_confirm_content.value
				}, function (e) {
				    if (e.success) {
				        var user = e.users[0];
				        // alert('Success Creat:\\n' +
				            // 'id: ' + user.id + '\\n' +
				            // 'username: ' + user.username + '\\n' +
				            // 'email: ' + user.email);
				        if (switch_remember.value){
							Ti.App.Properties.setString('cloud_userid',user.id) 
					        Ti.App.Properties.setString('cloud_useremail',user.email)    
					        Ti.App.Properties.setString('cloud_userpassword',password_content.value)		        	
				        } else {
							Ti.App.Properties.setString('cloud_userid','') 
					        Ti.App.Properties.setString('cloud_useremail','')    
					        Ti.App.Properties.setString('cloud_userpassword','')		        	
				        }
		
				        Ti.App.Properties.setBool('auto_login',switch_remember.value)
				        
				        // After UserCreated, Creat Default Tabs
						Cloud.Objects.create({
						    classname: 'windows',
						    fields: {
								win_id:0,
								win_root_id:0,
								win_type:'TYPE_TABBEDGROUP'
								// win_title:'Welcome',
								// win_icon:'info',
								// win_parameters:[true, true, "Welcome Page", "http://tw.yahoo.com"]
						    }
						},function(e){
							if (e.success){
								//alert('Successfully Created Object 1')
							} else {
						        alert('Error:\\n' +
						            ((e.error && e.message) || JSON.stringify(e)));									
							}
						})
						Cloud.Objects.create({
						    classname: 'windows',
						    fields: {
								win_id:1,
								win_root_id:0,
								win_type:'TYPE_WEB',
								win_title:'Welcome',
								win_icon:'web',
								win_parameters:[true, true, "Welcome Page", "http://apple.fuihan.com/mobile"]
						    }
						},function(e){
							if (e.success){
								//alert('Successfully Created Object 2')
							} else {
						        alert('Error:\\n' +
						            ((e.error && e.message) || JSON.stringify(e)));									
							}
						})
						Cloud.Objects.create({
						    classname: 'windows',
						    fields: {
								win_id:2,
								win_root_id:0,
								win_type:'TYPE_ACCOUNT',
								win_title:'Account',
								win_icon:'user',
								win_parameters:	["User Account"]
						    }
						},function(e){
							if (e.success){
								//alert('Successfully Created Object 3')
							} else {
						        alert('Error:\\n' +
						            ((e.error && e.message) || JSON.stringify(e)));									
							}
						})
						button_login.fireEvent('click')	
					} else {
				        alert('Error:\\n' +
				            ((e.error && e.message) || JSON.stringify(e)));
				    }
				    //After User Created
				});					
			} else {
		        alert('Error:\\n' +
		            ((e.error && e.message) || JSON.stringify(e)));				
			};
			//After User Logout
		}) 		
	});
	
	button_login.addEventListener('click', function() {
		//containingTab attribute must be set by parent tab group on
		//the window for this work
		var Cloud = require('ti.cloud');
		if (!Ti.App.Properties.getBool('cloud_Logged',false)){ 
			Cloud.Users.login({
			    // login: 'impepper@gmail.com',
			    // password: 'hala0204'
			    login: email_content.value,
			    password: password_content.value
			}, function (e) {
			    if (e.success) {
			        var user = e.users[0];
			        cloud_setUser(true,switch_remember.value,user.id,user.email,password_content.value,user.role)
			        
					// Ti.App.Properties.setBool('cloud_Logged',true)
					// Ti.App.Properties.setBool('auto_login',switch_remember.value)
					// Ti.App.Properties.setString('cloud_userid',user.id) 
			        // Ti.App.Properties.setString('cloud_useremail',user.email)    
			        // Ti.App.Properties.setString('cloud_userpassword',password_content.value)		        					
			        // Ti.App.Properties.setInt('cloud_userrole',user.role)
			        
			        win.fireEvent('ReloadTabs');
			        
			    } else {
			        alert('Error:\\n' +
			            ((e.error && e.message) || JSON.stringify(e)));
			    }
			});
		} else {
			//Logged user --> run log out procedure
			Cloud.Users.logout( function (e) {
			    if (e.success) {
					//alert('Successfully Logout')
					Ti.App.Properties.removeProperty('cloud_userid') 
			        Ti.App.Properties.removeProperty('cloud_useremail')    
			        Ti.App.Properties.removeProperty('cloud_userpassword')
			        Ti.App.Properties.removeProperty('cloud_userrole')
	
			        Ti.App.Properties.setBool('auto_login',false)
			        Ti.App.Properties.setBool('cloud_Logged',false)
			        
			        win.fireEvent('ReloadTabs');
			        
			        button_creat.show();
	    			button_login.title = L('Login Account');
	    			
				} else {
			        alert('Error:\\n' +
			            ((e.error && e.message) || JSON.stringify(e)));
			    }
			})
		}	
	});	
	
	win.addEventListener('open',function(e){
		username_label.hide();
		username_content.hide();
	    if (Ti.App.Properties.getBool('cloud_Logged',false)){
	    	button_creat.hide();
	    	switch_remember_label.hide();
	    	switch_remember.hide();
	    	button_login.title = L('Log Out');	    	
	    } else {
	    	button_creat.show();
	    	switch_remember_label.show()
	    	switch_remember.show
	    	button_login.title = L('Login Account');	    }				
	})
	win.addEventListener('open',function(){logging('ACCOUNT', title)})
	return win;
};

module.exports = AccountWindow;
