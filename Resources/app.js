/*
 * A tabbed application, consisting of multiple stacks of windows associated with tabs in a tab group.  
 * A starting point for tab-based application with multiple top-level windows. 
 * Requires Titanium Mobile SDK 1.8.0+.
 * 
 * In app.js, we generally take care of a few things:
 * - Bootstrap the application with any data we need
 * - Check for dependencies like device type, platform version or network connection
 * - Require and open our top-level UI component
 *  
 */

//bootstrap and check dependencies
if (Ti.version < 1.8 ) {
	alert('Sorry - this application template requires Titanium Mobile SDK 1.8 or later');
}


Ti.include('ui/winmodule/fnc_logging.js');
//logging();
Ti.include('ui/winmodule/fnc_db.js');
dbInitialize();
// This is a single context application with mutliple windows in a stack
(function() {
	//determine platform and form factor and render approproate components

	var osname = Ti.Platform.osname,
		version = Ti.Platform.version,
		height = Ti.Platform.displayCaps.platformHeight,
		width = Ti.Platform.displayCaps.platformWidth;
	
	Ti.API.info('User:'+Ti.App.Properties.getString('cloud_useremail','000viewer.defaultui@fuihan.com'))
	Ti.API.info('Pass:'+Ti.App.Properties.getString('cloud_password','000viewer.defaultui@fuihan.com'))

	//considering tablet to have one dimension over 900px - this is imperfect, so you should feel free to decide
	//yourself what you consider a tablet form factor for android
	var isTablet = osname === 'ipad' || (osname === 'android' && (width > 899 || height > 899));
	// Ti.App.Properties.setString('cloud_userpassword','viewerInPub')
	var Cloud = require('ti.cloud');
	if (Ti.App.Properties.getBool('auto_login',false)){
	    // var _login= Ti.App.Properties.getString('cloud_useremail','defaultui@fuihan.com')
	    // var _password = Ti.App.Properties.getString('cloud_userpassword','fuihan168')
	    var _login= Ti.App.Properties.getString('cloud_useremail','viewer.defaultui@fuihan.com')
	    var _password = Ti.App.Properties.getString('cloud_userpassword','viewerInPub')	    
	    // var _login = 'impepper@gmail.com'
	    // var _password = 'hala0204'	    
	    
	} else {
	    // var _login = 'impepper@gmail.com'
	    // var _password = 'hala0204'
	    // var _login = 'defaultui@fuihan.com'
	    // var _password = 'fuihan168'
	    var _login = 'viewer.defaultui@fuihan.com'
	    var _password = 'viewerInPub'	    
		Ti.App.Properties.removeProperty('cloud_userid') 
        Ti.App.Properties.removeProperty('cloud_useremail')    
        Ti.App.Properties.removeProperty('cloud_userpassword')
        Ti.App.Properties.removeProperty('cloud_Logged')			
	}
	if (osname=='mobileweb'){
		// alert('checkpoint1:'+Ti.App.Properties.getString('viewerid',''))
		var tempappid=Ti.Utils.base64decode(Ti.App.Properties.getString('viewerid','')).toString();
		//alert(tempappid.toString());
		// if ('viewer.'+strTrim(tempappid.toString().substr(9,200))){		
				// alert('checkpoint2:'+tempappid.toString().substr(9,200))
				_login='viewer.'+tempappid.toString().substr(9,200)
				// Ti.App.Properties.setString('cloud_useremail',_login)
				// Ti.App.Properties.setString('cloud_userpassword',_password)
		// }		
	}
	// alert(_login+','+_password);
	Ti.API.info('User:'+_login)
	Ti.API.info('Pass:'+_password)	
	Cloud.Users.login({
	    login: _login,
	    password: _password
	}, function (e) {
	    if (e.success) {
	    	
	        var user = e.users[0];
	        Ti.API.info('user_id:'+user.custom_fields['content_user_id'])
	        // alert('USer ID:'+user.custom_fields['content_user_id'])
			Cloud.Objects.query({
			    classname: 'windows',
			    page: 1,
			    per_page: 10,
			    where: {
			    	// user_id:user.id, 
			    	user_id:user.custom_fields['content_user_id'],
			    	// user_id:'4f9d71150020440def003c2a',
			        win_id: 0,
			        win_root_id:0
			    }
			}, function (e) {
			    if (e.success) {
			    	if (Ti.Platform.osname=='mobileweb'){
			    		// alert('Check Point')
			    		// alert('checkpoint:'+Ti.App.Properties.getString('testprop','None'))
			    	}
			    	
			    	Ti.API.info('WinDows TYPE_TABBEDGROUP Count:'+e.windows.length)
			    	Ti.API.info('WinDows TYPE_TABBEDGROUP id:'+e.windows[0].id)
		            var windows = e.windows[0]

			        if (windows.win_type=='TYPE_TABBEDGROUP') {
			        	Ti.API.info('Create Tabgroup')
        				var ApplicationTabGroup = require('ui/common/ApplicationTabGroup');
        				Ti.API.info('Create Tabgroup')
						new ApplicationTabGroup(isTablet).open();
			        } else {
			        	Ti.API.info('Tyep:'+windows.win_type)
			        }
			    } else {
			        alert('Error:\\n' +
			            ((e.error && e.message) || JSON.stringify(e)));
			    }
			});
	    } else {
	        alert('Error:\\n' +
	            ((e.error && e.message) || JSON.stringify(e)));
	    }
	    
	});

})();