function QRAccountWindow(_root_win,title) {

	Ti.include('/jslib/fnc_logging.js');
	Ti.include('/jslib/fnc_db.js');
	Ti.include('/jslib/fnc_cloud.js');
	Ti.include('/jslib/fnc_string.js');
	
	var qrreader = undefined;
	var qrCodeWindow = undefined;
	var qrCodeView = undefined;
	var base_logohtml=(Ti.Platform.osname == 'android')?'http://code.qrapp.com.tw/mobileWeb/default.html':Ti.Filesystem.resourcesDirectory+'default.html'
	var scanned=false;
	var i18n_text;

	// Ti.include('jslib/fnc-string.js');
	// Depending on the platform, load the appropriate qr module
	if (Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad') {
		qrreader = require('com.acktie.mobile.ios.qr');
	} else if (Ti.Platform.osname === 'android') {
		qrreader = require('com.acktie.mobile.android.qr');
	}
	
	if (title=='1'){
		title='QRCode Scanner'
	}
	var win = Ti.UI.createWindow({
		// title:'QRCode Scanner',
		title:title,
		barColor:'#222',
		orientationModes:Ti.UI.PORTRAIT,
		backgroundColor:'black'
	});

	win.navBarHidden=(Ti.Platform.osname === 'android')?true:false;

	var view_scan = Ti.UI.createView({
		top:0,
		bottom:0,
		right:0,
		left:0
	})

	i18n_text = L('_CLICK2SCAN','Click Screen to Scan')
	var lbl_scan = Ti.UI.createLabel({
		text:i18n_text,
		top:'75%',
		color:'#fff',
		font:{fontSize:20}
		// backgroundColor:'black',
		// image:'/default-app-logo.png',
		// width:'50%'
	}) 		

	var btn_scan = Ti.UI.createImageView({
		backgroundColor:'black',
		image:'/default-app-logo.png',
		bottom:'30%',
		width:'50%'
	}) 	
	
	view_scan.addEventListener('click',function(){
		win.fireEvent('scan')
	})
	
	view_scan.add(btn_scan)
	view_scan.add(lbl_scan)
	win.add(view_scan)
	//Backup for scan button on navbar
	// if (Ti.Platform.osname == 'android'){
	 	// win.navBarHidden=true;
	// } else {
		// var btn_scan=Ti.UI.createButton({
			// title:'Scan'
	// })
		// btn_scan.addEventListener('click',function(){
		// win.fireEvent('scan')
		// })
// 	 	
	 	// win.rightNavButton=btn_scan
	// }
	
	
	// var view_url=Ti.UI.createWebView({
		// backgroundColor:'#333',
		// url:base_logohtml,
		// scalesPageToFit:true
	// });
// 	
	// if (Ti.Platform.osname == 'android'){
		// view_url.addEventListener('click',function(){
			// win.fireEvent('scan')
		// })
	// }
	
	// win.add(view_url);
	
	//show url on specific webview
	function switchWebURL(obj_webview,targetURL){		
		obj_webview.animate({opacity:0,duration:200},function(){
			obj_webview.url=targetURL		
			obj_webview.animate({opacity:1,duration:200},function(){
				hideIndicator()
			})
		})
	}
	
	//making screenshots
	function saveScreenShots(qr_type,qr_link){		
		var imgDataDir = Ti.Filesystem.getApplicationDataDirectory()+ Ti.Filesystem.separator + 'QRImages'+ Ti.Filesystem.separator;
		var qr_scandate=new Date().getTime()
		var filename = qr_scandate + "_qr.jpg";
		
		//Taking Screrenshots
		// Ti.Media.takeScreenshot(function(e){
			// var ImageFactory = require('ti.imagefactory');
			// var blob = e.media;
            // var newBlob = ImageFactory.imageTransform(ImageFactory.imageAsCropped(blob, { width:400, height:400, x:0, y:30 }),
                // { type:ImageFactory.TRANSFORM_CROP, width:400, height:400 },
                // { type:ImageFactory.TRANSFORM_ROUNDEDCORNER, borderSize:6, cornerRadius:20 }
            // );			
			// var bgImage = Titanium.Filesystem.getFile(imgDataDir, filename);
			// bgImage.write(newBlob);
			
			// buildQRDesc(filename,qr_type,qr_link)			
		// })
		
		//build local database QR scanned history entry
		buildQRDesc(filename,qr_type,qr_link)
		return filename
	}
	
	function success(data) {
		//Analyse data to make sure the right format
		win.title='QRCode Scanner'
		
		if (data != undefined && data.data != undefined) {
			Titanium.Media.vibrate();
			var qrData=data.data;
			
			//adding http head for www address only
			if (qrData.toString().substr(0,4).toString().toUpperCase()=='WWW.'){
				qrData = 'http://'+qrData
			}
			// if ((qrData.toString().substr(0,4).toString().toUpperCase()=='TEL:') 
				// &&  (qrData.toString().substr(0,6).toString().toUpperCase()!='TEL://')){
				// qrData = 'TEL:'+qrData.toString().substr(4,200)
			// }			
			// alert(qrData)
			var strHeader=qrData.toString().substr(0,7);
			var mcmsHeader=qrData.toString().substr(7,8);
			var mcmsApp=strTrim(qrData.toString().substr(23,200));	
			// alert(mcmsApp)	
			var qrType=''
			//check if the qrcode data a non-mcms url code
			switch (strHeader.toUpperCase()) {
				//Delaing with web Links
				case 'HTTP://':	
				case 'HTTPS:/':		
					if (((mcmsHeader.toUpperCase()=='CODE.QRA') || (mcmsHeader.toUpperCase()=='CODE.QR-') || (mcmsHeader.toUpperCase()=='MCMS.FUI')) && mcmsApp.toString().length>8){
						qrType = 'mCMS';
						//code.qrapp.com.tw
						if (mcmsHeader.toUpperCase()=='CODE.QRA'){
							mcmsHeader=qrData.toString().substr(7,17);
							mcmsApp=strTrim(qrData.toString().substr(25,200));
						}
						//code.qr-apps.com
						if (mcmsHeader.toUpperCase()=='CODE.QR-'){
							mcmsHeader=qrData.toString().substr(7,16);
							mcmsApp=strTrim(qrData.toString().substr(24,200));
						}

						//mcms.fuihan.com
						if (mcmsHeader.toUpperCase()=='MCMS.FU'){
							mcmsHeader=qrData.toString().substr(7,15);
							mcmsApp=strTrim(qrData.toString().substr(23,200));
						} 
						 
					} else {
						qrType = 'WEB'
					} 		
					break;
				// case 'HTTPS:/':
					// alert('HTTPS://')
					// qrType = 'WEB'
					// break;
				//dealing with VCARD format				
				case 'BEGIN:V':
					qrType = 'vCard'
					break;
				//Default QR format: Text
				
				default:
					//Exception: TEL
					if (strHeader.substr(0,4)=='TEL:') {
						qrType = 'Phone'
					} else {
						qrType = 'Text'
						// alert(strHeader)
					}
			}	
						
			//New for taking scrreenshots and Build local history entry in ios
			if (Ti.Platform.osname=='iphone' || Ti.Platform.osname=='ipad'){
				saveScreenShots(qrType,qrData)
			} else {
				saveScreenShots(qrType,qrData)
			}
			// alert(qrType)
			//redirect Qr Code Content to suitable display module
			switch (qrType) {
				case 'mCMS':
					createMCMSQR(mcmsApp)
					break;
				case 'WEB':
					createURL(qrData)
					break;		
				case 'vCard':
					createVCARD(qrData)
					break;
				case 'Phone':
					createPHONE(qrData)
					break;
				default:
					createTEXT(qrData)
			}		
		}


	};
	
	function cancel() {
		// view_url.url=base_logohtml
		//win.fireEvent('switch2Tabs');
		// win.close();
	};
	
	function error() {
		alert("error");
		// view_url.url=base_logohtml
		//win.fireEvent('switch2Tabs');
		// win.close();		
	};
	
	/*
	 * Function that mimics the iPhone QR Code reader behavior in Android Apps
	 */
	function scanQRFromCamera(options) {
		qrCodeWindow = Titanium.UI.createWindow({
			backgroundColor : 'black',
			width : '100%',
			height : '100%',
		});
		qrCodeView = qrreader.createQRCodeView(options);
	
		var closeButton = Titanium.UI.createButton({
			title : "close",
			bottom : 0,
			left : 0
		});
		var lightToggle = Ti.UI.createSwitch({
			value : false,
			bottom : 0,
			right : 0
		});
	
		closeButton.addEventListener('click', function() {
			qrCodeView.stop();
			qrCodeWindow.close();
		});
	
		lightToggle.addEventListener('change', function() {
			qrCodeView.toggleLight();
		})
	
		qrCodeWindow.add(qrCodeView);
		qrCodeWindow.add(closeButton);
	
		if (options.userControlLight != undefined && options.userControlLight) {
			qrCodeWindow.add(lightToggle);
		}
	
		// NOTE: Do not make the window Modal.  It screws stuff up.  Not sure why
		qrCodeWindow.open();
	}
	
	function slideOpenWindow(targetType,targetTitle,targetContent){
		hideIndicator()
		if (Ti.Platform.name=='android'){
			qrCodeWindow.close()
		}
		win.fireEvent('ShowQRWin',{
			qrwin_type:targetType,
			qrwin_title:targetTitle,
			qrwin_content:targetContent});
	}
	
	
	//Launching window module to display Text	
	function createTEXT(qrdata_text){
		if (Ti.Platform.osname=='android'){scanned=true;}
		showIndicator('Processing Texts')
		slideOpenWindow('TYPE_QR_TEXT','TEXT',qrdata_text)		
		// QRDescUpdate('World','Testing Text')
	}
	
	//Launching window module to display WEB Link
	function createURL(qrdata_url){
		if (Ti.Platform.osname=='android'){scanned=true;}
		showIndicator('Loading Web Pages')
		slideOpenWindow('TYPE_QR_WEBPAGE','WEB Pages',qrdata_url)
	}

	
	//Launching window module to display vCard format
	function createVCARD(qrdata_vcard){
		if (Ti.Platform.osname=='android'){scanned=true;}
		showIndicator('Procesing VCard Info')
		slideOpenWindow('TYPE_QR_VCARD','VCard Info',qrdata_vcard)
	}
	
	//Launching window module to display Phone Numbers
	function createPHONE(qrdata_phone){
		if (Ti.Platform.osname=='android'){scanned=true;}
		showIndicator('Procesing Phone Number')
		slideOpenWindow('TYPE_QR_PHONE','Phone Info',qrdata_phone)
	}
		
	//Launching window module to display mCMS QR
	function createMCMSQR(mcmsQRlink){
		// alert('createMCMSQR')
		var tempappid=Ti.Utils.base64decode(mcmsQRlink).toString();
		var gettingintoACS=true;
		
		if (('viewer.'+strTrim(tempappid.toString().substr(9,200))) == Ti.App.Properties.getString('cloud_useremail',''))
		{
			//----Scan same Content Qrcode
			if (Ti.App.Properties.getString('loading_method','TAB') == 'TAB'){
				alert(L('_ERR_DUPQR','You hace already switchd to this content'))
				gettingintoACS=false;
			}			
		} else{			
			//----scan other than previous content qrcode 
			// Ti.App.Properties.setBool('cloud_Logged',false)					
		}
		
		if (gettingintoACS){
			cloud_resetUser()
			// Ti.App.Properties.removeProperty('cloud_userid') 
	        // Ti.App.Properties.removeProperty('cloud_useremail')    
	        // Ti.App.Properties.removeProperty('cloud_userpassword')
	        // Ti.App.Properties.removeProperty('cloud_userrole')
	        // Ti.App.Properties.setBool('auto_login',false)
	        // Ti.App.Properties.setBool('cloud_Logged',false)	
	        	        							
			if (tempappid.toString().substr(0,9)=='&content='){
				//Sendlin Cloud user (email) directly (without base64 encodeing) to ACS Loging
				ACSLogin(strTrim(tempappid.toString().substr(9,200)))
			} else {
				alert(L('_ERR_NONVERIFIED','Sorry, your mCMS QR is not verified, please scan again.'))
			}			
		}

	}

	function ACSLogin(mcmscode){
		// alert('ACSLogin:'+mcmscode)
		//containingTab attribute must be set by parent tab group on
		//the window for this work
		// Ti.API.info('mCMS App ID - '+mcmscode)
		// var getKey=getCloudKey(mcmscode)
		// Ti.include('/jslib/fnccloud');
		// getCloudKey(mcmscode)
		setTimeout(function(){
			//check if get right cloudkey
			if (true){
			// alert('mCMS App ID - '+mcmscode)
			var _loginuser='viewer.'+mcmscode
			// alert('Logged:'+_loginuser)
			if (!Ti.App.Properties.getBool('cloud_Logged',false)){ 
				var Cloud = require('ti.cloud');
				Cloud.Users.login({
				    // login: 'viewer.impepper@gmail.com',
				    login: _loginuser,
				    password: 'viewerInPub'
				    // login: 'impepper@gmail.com',
				    // password: 'hala0204'
				    // login: email_content.value,
				    // password: password_content.value
				}, function (e) {
				    if (e.success) {
						//get Location Permission
						// alert('Logged')
				        //close QR Scanning window
				        Titanium.Platform.name
				        if (Titanium.Platform.name=='android'){
							qrCodeView.stop();
							qrCodeWindow.close();
						// } else {
				        	// // qrCodeView.close();
				        	// qrCodeWindow.close();	
				        }				        
						// alert('Logged2')
						Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
						Ti.Geolocation.distanceFilter = 0;
						Ti.Geolocation.purpose = 'To provide more local Information!';
						if (Titanium.Geolocation.getLocationServicesEnabled && Ti.Geolocation.getLocationServicesAuthorization!==Ti.Geolocation.AUTHORIZATION_DENIED){
							Ti.App.Properties.setBool('get_location_service',true)
						}						
										    	
				        var user = e.users[0];
						var cloudContentTitle = e.users[0].custom_fields['content_title']
						if (cloudContentTitle == undefined){cloudContentTitle = L('_MCMSCONTENTTITLE','mCMS Content')}	
									        
				        Ti.API.info('User Loggin:'+user.email);
			        	
				        // Check if loading method is List , do not save properties
				        if (Ti.App.Properties.getString('loading_method','TAB')=='TAB'){
				        	cloud_setUser(true,true,user.id,user.email)
							// Ti.App.Properties.setBool('cloud_Logged',true)
							// Ti.App.Properties.setBool('auto_login',true)
							// Ti.App.Properties.setString('cloud_userid',user.id) 
					        // Ti.App.Properties.setString('cloud_useremail',user.email)    
					        // Ti.App.Properties.setString('cloud_userpassword','viewerInPub')			   
				        } else {
				        	cloud_setUser(true,false,user.id,user.email)
							// Ti.App.Properties.setBool('cloud_Logged',true)
							// Ti.App.Properties.setBool('auto_login',false)
							// Ti.App.Properties.setString('cloud_userid',user.id) 
					        // Ti.App.Properties.setString('cloud_useremail',user.email)    
					        // Ti.App.Properties.setString('cloud_userpassword','viewerInPub')					        	
				        }
				         // alert('check 1')
				        logging(Ti.App.Properties.getString('loading_method','TAB'),'QR Launching',true)
				       // alert('check 2')
				        var tempappid=Ti.Utils.base64encode('&content='+mcmscode)
				        // alert(mcmscode)
				        // alert('update:'+tempappid+'/'+cloudContentTitle+'/'+user.id+'/'+mcmscode)
				        QRDescUpdate(tempappid,cloudContentTitle,user.id,mcmscode)
				        
				        //setting User Role for previleges 
				        var userrole=0; 
				        if ((typeof user.role!= 'undefined') && (user.role!='')){
				        	// Ti.App.Properties.setInt('cloud_userrole',0)
				        	userrole=0
				        } else {
				        	userrole=parseInt(user.role.toString())
				        } 
				        // alert('check 3:' + userrole)					
				        // if (Ti.Platform.osname=='android'){
				        	// // Ti.App.Properties.setInt('cloud_userrole',0)
				        	// // if ((typeof user.role!= 'undefined') && (user.role!='')) {
// 				        		
				        		// if (userrole){
				        			// Ti.App.Properties.setInt('cloud_userrole',userrole)
				        		// }
				        	// // }
				        // } else {
				        	// Ti.App.Properties.setInt('cloud_userrole',user.role)	
				        // }
				        Ti.App.Properties.setInt('cloud_userrole',userrole)
				        // alert('checkpoint: before reload  contents:'+Ti.App.Properties.getString('loading_method','TAB'))
				        //Import new loaded data to refresh the app outlooks		        
				        if (Ti.App.Properties.getString('loading_method','TAB')=='TAB'){
				        	// alert('ready to Reload Tabs')
					        win.fireEvent('ReloadTabs');
				        } else {
				        	win.fireEvent('ReloadLists',{
								qrwin_title:cloudContentTitle});
				        }
	    
				    } else {
				        // alert('Error:\\n' + ((e.error && e.message) || JSON.stringify(e)));
				        // alert('mCMS App ID - '+_loginuser+'/'+Ti.App.Properties.getString('acs-api-key-production','none' ))
				        alert(L('_ERR_MAINTAIN','Sorry, mCMS QRCode Service in under maintaining, please come back later.'))
				        win.fireEvent('ResetRootTabs')
				        
				    }
				});
				
			}
				} else {
				// Ti.API.info('error getting cloudkey using default instead')
				alert(L('_ERR_GETTINGCONTENT','Sorry, We cannot get your QR APP Contents, please come back later.'))
				win.fireEvent('ResetRootTabs')
			}
		},1500)

		
	
	}
	
	win.addEventListener('scan',function(){		
		var options = {
			// ** Android QR Reader properties (ignored by iOS)
			backgroundColor : 'blue',
			width : '100%',
			height : '100%',
			top : 0,
			left : 0,
			// **	
			// ** Used by both iOS and Android
			overlay : {
				color : "blue",
				layout : "center",
				alpha : .75
			},
			success : success,
			cancel : cancel,
			error : error,
			continuous : false,
		};
	
		if (Ti.Platform.name == "android") {
			scanQRFromCamera(options);
		} else {
			qrreader.scanQRFromCamera(options);
		}		
	})

	
	//---------- Currently unused function for Kicking ACS Users out -------------
	function ACS_logout(){
		// ------------MAking logged user logout---------
		var Cloud = require('ti.cloud');
		Cloud.Users.logout( function (e) {
		    if (e.success) {
				//alert('Successfully Logout')
				cloud_resetUser()
												        
		        //set default off on showing ad banners
		        Ti.App.Properties.setInt('cloud_userrole',5)
			} else {
		        // alert('Error:\\n' +
		            // ((e.error && e.message) || JSON.stringify(e)));
		        // alert('Sorry, we have account logging problem now. please quit this app and launch again')
		        alert(L('_ERR_LOGOUT','Sorry, we have account logging problem now. please quit this app and launch again.'))
		    }
		})		
	}	
	
	//adding Setting Button for Tab/List transformation
	if ((Ti.Platform.osname =='iphone') || (Ti.Platform.osname =='ipad')){
		//Build Setting Button for IOS
		var ui_btnSetting = require('jslib/ui_btnSetting');
		navbtn_setting = new ui_btnSetting(win);
		win.setLeftNavButton(navbtn_setting);
		//build History Button for IOS
		var ui_btnHistory = require('jslib/ui_btnHistory');
		navbtn_history = new ui_btnHistory(win);
		win.setRightNavButton(navbtn_history);
		
		// win.addEventListener('ResetRootTabs',function(){
			// cloud_resetUser()
			// if (Ti.Platform.osname=='android'){
				// var reboot = require('com.nametec.reboot');
				// reboot.reboot()
			// } else {
				// // alert('checkpoint 1')
				// win.fireEvent('ResetTabs')		
			// }		
//  
		// })		
	} else {
		// var menu=null;
		win.addEventListener('open', function() {
			
			var activity = win.activity;
			// alert('creat Menu')
			activity.onCreateOptionsMenu = function(e) {
				var menu = e.menu; // save off menu.
				if ((Ti.App.Properties.getBool('cloud_Logged',false)*Ti.App.Properties.getBool('auto_login',false))){
					i18n_text = L('_RESETSCREEN','Reset Screens')
					var m0 = menu.add({
						title:i18n_text,
						itemId : 0,
						groupId : 0,
						order : 0
					});
					m0.setIcon("/icons_menu/QRScanner.png");
					m0.addEventListener('click',function(e){
						Ti.App.Properties.setString('loading_method','LIST')
						cloud_resetUser()
						var reboot = require('com.nametec.reboot');
						reboot.reboot();								
					})
					// alert('menu 0')						
				}

				i18n_text = L('_SCANNER','Scan QR Codes')
				var m1 = menu.add({
					title:i18n_text,
					itemId : 1,
					groupId : 0,
					order : 0
				});
				m1.setIcon("/icons_menu/QRScanner.png");
				m1.addEventListener('click',function(e){
					if (scanned || (scanned==undefined)) {
						qrCodeWindow.close();
					} 
					win.fireEvent('scan')
				})
				// alert('menu 1')
				
				i18n_text = L('_QRHIS','Scanned History')
				var m2 = menu.add({
					title:i18n_text,
					itemId : 2,
					groupId : 0,
					order : 0
				});
				m2.setIcon("/icons_menu/QRHistory.png");
				m2.addEventListener('click',function(e){
					if (scanned || (scanned==undefined)) {
						qrCodeWindow.close();
					}
					var WindowRouter = require('ui/winmodule/WindowRouter'); 
		    		var win_history = new WindowRouter('TYPE_QRHISTORYLIST',[true,true,L('_SACNHIS','Scanned History')],'',win)			
					win_history.containingTab = win.containingTab
					win_history.addEventListener('showHistoryLink',function(data){
						if (data.targetType == 'TYPE_APPLIST'){
							if (Ti.App.Properties.getString('loading_method','TAB') =='TAB'){
								cloud_setUser(false,true,data.targetCloudId,'viewer.'+data.targetCloudMail)
								// win_history.close()
								var reboot = require('com.nametec.reboot');
								reboot.reboot();								
							} else {
								cloud_setUser(false,false,data.targetCloudId,'viewer.'+data.targetCloudMail)									
								var ApplicationListGroup = require('ui/common/ApplicationListGroup');
								app_list_win = new ApplicationListGroup(win_history,true,true,data.targetTitle,'');							
								win_history.containingTab.open(app_list_win)	
							}
				
						} else {
							var WindowRouter = require('ui/winmodule/WindowRouter');
							var routedWindow = new WindowRouter(data.targetType,[data.targetTitle,data.targetLink],'','');		
							routedWindow.containingTab=win_history.containingTab;
									
							win_history.containingTab.open(routedWindow);	
						}				
					})
					win.containingTab.open(win_history);
				})
				// alert('menu 2')
				
				i18n_text = L('_SETTING','Setting')
				var m3 = menu.add({
					title:i18n_text,
					itemId : 3,
					groupId : 0,
					order : 0
				});				
				m3.setIcon("/icons_menu/QRSetting.png");
				m3.addEventListener('click',function(e){
					if (scanned || (scanned==undefined)) {
						qrCodeWindow.close();
					}
					Titanium.UI.Android.openPreferences()
				})
				// alert('menu 3')
					
				// var m4 = menu.add({
					// title:'Sacn QRcode',
					// itemId : 1,
					// groupId : 0,
					// order : 0
				// });
				// m4.setIcon("/icons_menu/QRScanner.png");
				// m4.addEventListener('click',function(e){
					// if (scanned || (scanned==undefined)) {
						// qrCodeWindow.close();
					// } 
					// alert(Ti.App.Properties.getString('loading_method','None'))
				// })												
			};
		});
	}
	
	win.addEventListener('ResetRootTabs',function(){
		cloud_resetUser()
		if (Ti.Platform.osname=='android'){
			var reboot = require('com.nametec.reboot');
			reboot.reboot()
		} else {
			// alert('checkpoint 1')
			win.fireEvent('ResetTabs')		
			}		
 
		})		
	
	return win;
};

module.exports = QRAccountWindow;
