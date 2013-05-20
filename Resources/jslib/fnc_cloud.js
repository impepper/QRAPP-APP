function getCloudKey(clouduser){
	//getting CloudKey
	if (!Ti.App.Properties.getBool('auto_login',false) || (osname=='mobileweb')){
		Ti.API.info("clouduser:"+clouduser)		
		var xhr = Titanium.Network.createHTTPClient();		
		xhr.onload = function(){
			Ti.API.info('in utf-8 onload for GET');
			// Ti.API.info(this.responseText);
			// alert(this.responseText);
			// Ti.App.Properties.setString('acs-api-key-development', this.responseText);
			Ti.App.Properties.setString('acs-api-key-production', this.responseText);
			// Ti.App.Properties.setString('acs-api-key-production', '1n7MsybAWCWZApQv1MKLVKTwAK6X65aPs');
		     // Ti.App.Properties.setString('acs-api-key', this.responseText);
		     // Ti.App.Properties.setString('acs-api-key', '885n7MsybAWCWZApQv1MKLVKTwAK6X65aPs');
		     // Ti.App.developmentType = 'production' // or 'production'			
			return true
		};		
		xhr.onerror = function(){
			alert('Sorry, We are having have a connectting problem here, please come back later.')
			Ti.App.Properties.setString('acs-api-key-production', 'n7MsybAWCWZApQv1MKLVKTwAK6X65aPs');
		    // Ti.App.Properties.setString('acs-api-key', '885n7MsybAWCWZApQv1MKLVKTwAK6X65aPs');
		    // Ti.App.developmentType = 'production' // or 'production'					
			return false	
		};		
		xhr.open("POST","http://mcms.fuihan.com/getcloudkey.php");
		xhr.send({"clouduser":clouduser});	
	} else {
		Ti.App.Properties.setString('acs-api-key-production', 'n7MsybAWCWZApQv1MKLVKTwAK6X65aPs');
		return true
	}	
}

function cloud_setUser(LoggedStatus,AutoLogin,CloudId,CloudMail,CloudPass,CloudRole){
	// alert('ID:'+CloudId+'/PASS:'+)
	if ((LoggedStatus != undefined) && (LoggedStatus != null)){Ti.App.Properties.setBool('cloud_Logged',LoggedStatus)}	
	if ((AutoLogin != undefined) && (AutoLogin != null)){Ti.App.Properties.setBool('auto_login',AutoLogin)}
	if ((CloudId != undefined) && (CloudId != null)){Ti.App.Properties.setString('cloud_userid',CloudId) }
	if ((CloudMail != undefined) && (CloudMail != null)){Ti.App.Properties.setString('cloud_useremail',CloudMail)} 
	if ((CloudPass != undefined) && (CloudPass != null)){Ti.App.Properties.setString('cloud_userpassword',CloudPass)} 
		else {Ti.App.Properties.setString('cloud_userpassword','viewerInPub')}
	if ((CloudRole != undefined) && (CloudRole != null)){Ti.App.Properties.setString('cloud_userrole',CloudRole)}
}	

function cloud_resetUser(){
	Ti.App.Properties.removeProperty('cloud_userid') 
    Ti.App.Properties.removeProperty('cloud_useremail')    
    Ti.App.Properties.removeProperty('cloud_userpassword')
    Ti.App.Properties.removeProperty('cloud_userrole')
    Ti.App.Properties.setBool('auto_login',false)
    Ti.App.Properties.setBool('cloud_Logged',false)	
}
