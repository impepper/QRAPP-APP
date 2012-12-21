function QRAccountWindow(title) {
	var qrreader = undefined;
	var qrCodeWindow = undefined;
	var qrCodeView = undefined;
	var base_logohtml=(Ti.Platform.osname == 'android')?'http://mcms.fuihan.com/mobileWeb/default.html':Ti.Filesystem.resourcesDirectory+'default.html'
	// var base_logohtml=Ti.Filesystem.resourcesDirectory+'default.html'
	var scanned=false;
	Ti.include('fnc_string.js');
	// Depending on the platform, load the appropriate qr module
	if (Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad') {
		qrreader = require('com.acktie.mobile.ios.qr');
	} else if (Ti.Platform.osname === 'android') {
		qrreader = require('com.acktie.mobile.android.qr');
	}

	var win = Ti.UI.createWindow({
		title:'QRCode Scanner',
		barColor:'#222',
		// navBarHidden:true,
		//title:'QR Code Login',
		backgroundColor:'black'
	});
	
	win.navBarHidden=(Ti.Platform.osname === 'android')?true:false;
	
	 if (Ti.Platform.osname == 'android'){
	 	win.navBarHidden=true;
	 } else {
		var btn_scan=Ti.UI.createButton({
			title:'Scan'
		})
		btn_scan.addEventListener('click',function(){
			win.fireEvent('scan')
		})
	 	
	 	win.rightNavButton=btn_scan
	 }
	
	
	var view_url=Ti.UI.createWebView({
		backgroundColor:'#333',
		url:base_logohtml,
		scalesPageToFit:true
		// backgroundImage:Ti.Filesystem.resourcesDirectory+'default_app_logo.png'
	});
	
	if (Ti.Platform.osname == 'android'){
		view_url.addEventListener('click',function(){
			win.fireEvent('scan')
		})
	}
	
	win.add(view_url);
	
	function switchWebURL(obj_webview,targetURL){
		
		obj_webview.animate({opacity:0,duration:200},function(){
			obj_webview.url=targetURL
			//alert(targetURL)			
			obj_webview.animate({opacity:1,duration:200},function(){
				hideIndicator()
			})
		})
	}

	function saveScreenShots(qr_link){
		var imgDataDir = Ti.Filesystem.getApplicationDataDirectory()+ Ti.Filesystem.separator + 'QRImages'+ Ti.Filesystem.separator;
		var qr_scandate=new Date().getTime()
		var filename = qr_scandate + "_qr.jpg";
		Ti.Media.takeScreenshot(function(e){
			var screenshotImage= e.image;			
			var ImageFactory = require('ti.imagefactory');
			var blob = e.media;
            var newBlob = ImageFactory.imageTransform(ImageFactory.imageAsCropped(blob, { width:400, height:400, x:0, y:30 }),
                { type:ImageFactory.TRANSFORM_CROP, width:400, height:400 },
                { type:ImageFactory.TRANSFORM_ROUNDEDCORNER, borderSize:6, cornerRadius:20 }
            );			
			var bgImage = Titanium.Filesystem.getFile(imgDataDir, filename);
			bgImage.write(newBlob);
			buildQRDesc(filename,qr_link)			
		})
		// return filename
	}
	
	function success(data) {
		//Analyse data to make sure the right format
		win.title='QRCode Scanner'
		
		
		if (data != undefined && data.data != undefined) {
			Titanium.Media.vibrate();
			// var qrData='http://mcms.fuihan.com/test.php';
			var qrData=data.data;
						
			//New for taking scrreenshots in ios
			if (Ti.Platform.osname=='iphone' || Ti.Platform.osname=='ipad'){
				saveScreenShots(qrData);
			}


			var strHeader=qrData.toString().substr(0,7);
			var mcmsHeader=qrData.toString().substr(7,15);
			var mcmsApp=strTrim(qrData.toString().substr(23,200));			

			//check if the qrcode data a non-mcms url code
			
			if (strHeader.toUpperCase()=='HTTP://'){
				
				if (Ti.Platform.osname!='android'){
					switchWebURL(view_url,'')
				}
				
				
				if ((mcmsHeader.toUpperCase()=='MCMS.FUIHAN.COM') && mcmsApp.toString().length>8){
					// alert('Got mCMS Link!')
					
					// win.fireEvent('switch2Tabs');
					
					var tempappid=Ti.Utils.base64decode(mcmsApp).toString();
					//alert(tempappid.toString());
					if (('viewer.'+strTrim(tempappid.toString().substr(9,200))) == Ti.App.Properties.getString('cloud_useremail',''))
					{
						
						//----Scan same Content Qrcode will force to logout
						//----and back to default UI Content
						var Cloud = require('ti.cloud');
						Cloud.Users.logout( function (e) {
						    if (e.success) {
								//alert('Successfully Logout')
								Ti.App.Properties.removeProperty('cloud_userid') 
						        Ti.App.Properties.removeProperty('cloud_useremail')    
						        Ti.App.Properties.removeProperty('cloud_userpassword')
						        Ti.App.Properties.removeProperty('cloud_userrole')
								
						        Ti.App.Properties.setBool('auto_login',false)
						        Ti.App.Properties.setBool('cloud_Logged',false)
						        
						        //set default off on showing ad banners
						        Ti.App.Properties.setInt('cloud_userrole',5)
						        
						        win.fireEvent('ReloadTabs');
						        if (Ti.Platform.osname=='android'){
									qrCodeView.stop();
									qrCodeWindow.close();
								} else {
						        	qrCodeView.close();	
						        }
						        	
						        // button_creat.show();
				    			// button_login.title = L('Login Account');
				    			
							} else {
						        // alert('Error:\\n' +
						            // ((e.error && e.message) || JSON.stringify(e)));
						        alert('Sorry, we have account logging problem now. please quit this app and launch again')
						    }
						})
						
					} else{
						
						//----scan other than previous content qrcode 
						//----will switch to new content
						
						Ti.App.Properties.removeProperty('cloud_userid') 
				        Ti.App.Properties.removeProperty('cloud_useremail')    
				        Ti.App.Properties.removeProperty('cloud_userpassword')
				        Ti.App.Properties.removeProperty('cloud_userrole')
		
				        Ti.App.Properties.setBool('auto_login',false)
				        Ti.App.Properties.setBool('cloud_Logged',false)	
				        							
						if (tempappid.toString().substr(0,9)=='&content='){
							ACSLogin(strTrim(tempappid.toString().substr(9,200)))
						} else {
							ACSLogin(mcmsApp)
						}	
											
					}
					
				} else {
					// alert('Got Http Urls!')
					
					if (Ti.Platform.osname=='android'){
						scanned=true;
						showIndicator('Loading Web Pages')
						var win_url=Ti.UI.createWindow({
							backgroundColor:'#000',
							height:'100%',
							width:'100%'
						})
						var android_url_view=Ti.UI.createWebView({
							url:qrData,
							backgroundColor:'#000',
							height:'100%',
							width:'100%'							
						})			
						android_url_view.addEventListener('load',function(){
							hideIndicator()
						})	
								
						win_url.add(android_url_view)
						win_url.open()
					
					} else{
						win.title='QR - WebPages'
						showIndicator('Loading Web Pages')
						createURL(qrData)
						// show_links(qrData)
					}		
					// alert(qrData)		
				
				}
			} else {
				
								
				
				if (Ti.Platform.osname=='android'){

					scanned=true;
					showIndicator('Getting Text')
					var win_url=Ti.UI.createWindow({
						backgroundColor:'#000',
						height:'100%',
						width:'100%'
					})
					var android_url_view=Ti.UI.createWebView({
						backgroundColor:'#000',
						height:'100%',
						width:'100%'							
					})	
					android_url_view.setHtml('<html><body><h2 style="color:#ccc;">'+qrData+'</h2></body></html>')								
					win_url.add(android_url_view)
					win_url.open()
					hideIndicator()
				
				} else {
					win.title='QR - Text'
					view_url.setHtml('<html><body><h2 style="color:#ccc;">'+qrData+'</h2></body></html>')
					view_url.show()
					// show_links(qrData)
				}					
				
				// alert('done')
				//win.fireEvent('switch2Tabs');
			}
			
		}


	};
	
	function cancel() {
		view_url.url=base_logohtml
		//win.fireEvent('switch2Tabs');
		// win.close();
	};
	
	function error() {
		alert("error");
		view_url.url=base_logohtml
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
	
	function createURL(urlLink){
		switchWebURL(view_url,urlLink)	
	}
	
	function ACSLogin(mcmscode){
		//containingTab attribute must be set by parent tab group on
		//the window for this work
		var Cloud = require('ti.cloud');
		// if (mcmscode.toString().substr(0,9)=='&content='){
			// mcmscode = strTrim(mcmscode.toString().substr(9,200));
		// } 
		// alert('mCMS App ID - '+mcmscode)	
		Ti.API.info('mCMS App ID - '+mcmscode)
		if (!Ti.App.Properties.getBool('cloud_Logged',false)){ 
	
			Cloud.Users.login({
			    // login: 'viewer.impepper@gmail.com',
			    login: 'viewer.'+mcmscode,
			    password: 'viewerInPub'
			    // login: 'impepper@gmail.com',
			    // password: 'hala0204'
			    // login: email_content.value,
			    // password: password_content.value
			}, function (e) {
			    if (e.success) {
			        var user = e.users[0];
			        // alert('User Loggin:'+user.email);
					Ti.App.Properties.setBool('cloud_Logged',true)
					// Ti.App.Properties.setBool('auto_login',switch_remember.value)
					Ti.App.Properties.setBool('auto_login',true)
					Ti.App.Properties.setString('cloud_userid',user.id) 
			        Ti.App.Properties.setString('cloud_useremail',user.email)    
			        // Ti.App.Properties.setString('cloud_userpassword',password_content.value)
			        Ti.App.Properties.setString('cloud_userpassword','viewerInPub')			        					
			        if (Ti.Platform.osname=='android'){
			        	Ti.App.Properties.setInt('cloud_userrole',0)
			        	if ((typeof user.role!= 'undefined') && (user.role!='')) {
			        		var userrole=parseInt(user.role.toString())
			        		if (userrole){
			        			Ti.App.Properties.setInt('cloud_userrole',userrole)
			        		}
			        	}
			        } else {
			        	Ti.App.Properties.setInt('cloud_userrole',user.role)	
			        }
			        
			        
	    
			        win.fireEvent('ReloadTabs');
			        if (Ti.Platform.osname=='android'){
						qrCodeView.stop();
						qrCodeWindow.close();
					} else {
			        	qrCodeView.close();	
			        }
				
			        
			    } else {
			        //alert('Error:\\n' + ((e.error && e.message) || JSON.stringify(e)));
			        alert('Sorry, Your mCMS Code is not recognizable, please check again.')    
			    }
			});
			
		}		
	}
	
	win.addEventListener('scan',function(){
		
		// switchWebURL(view_url,base_logohtml)	
		
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

	if (Ti.Platform.osname=='android'){
		var menu=null;
		win.addEventListener('open', function() {
			var activity = win.activity;
			activity.onCreateOptionsMenu = function(e) {
				menu = e.menu; // save off menu.
				m1 = menu.add({
					title:'Sacn QRcode',
					itemId : 1,
					groupId : 0,
					order : 0
				});
				m1.setIcon("/icons/qrcode.png");
				m1.addEventListener('click',function(e){
					if (scanned) {
						qrCodeWindow.close();
					} 
					win.fireEvent('scan')
				})
			};
			
			// activity.onPrepareOptionsMenu = function(e) {
// 				
				// var m1a = menu.findItem(1);
				// if (m1a != null) {
					// var enabled = m1a.isEnabled();
					// if (enabled) {
						// m1a.title = "Item 1 - Disabled";
					// } else {
						// m1a.title = "Item 1 - Enabled";
					// }
					// m1a.setEnabled(!enabled);
				// }
			// };
		});
		
	}
	
	// return qrCodeWindow;
	
	
	// function showIndicator(indMsg){
		// if (Ti.Platform.osname != 'android'){
			// // window container
			// indWin = Titanium.UI.createWindow({
				// height:150,
				// width:200,
				// left:60
			// });
// 	
			// // black view
			// var indView = Titanium.UI.createView({
				// height:150,
				// width:200,
				// backgroundColor:'#000',
				// borderRadius:10,
				// opacity:0.6
			// });
			// indWin.add(indView);
		// }
// 	
		// // loading indicator
		// actInd = Titanium.UI.createActivityIndicator({
			// style:Titanium.UI.iPhone.ActivityIndicatorStyle.BIG,
			// height:50,
			// width:50
		// });
// 	
		// if (Ti.Platform.osname != 'android'){
			// indWin.add(actInd);
			// // message
			// var message = Titanium.UI.createLabel({
				// text:indMsg,
				// color:'#fff',
				// width:'auto',
				// height:'auto',
				// font:{fontSize:20,fontWeight:'bold'},
				// bottom:20
			// });
			// indWin.add(message);
			// indWin.open();
		// } else {
			// actInd.message = indMsg;
		// }
		// actInd.show();
// 	
	// }
// 	
	// function hideIndicator(){
		// actInd.hide()
		// if (Ti.Platform.osname != 'android') {
			// indWin.close({opacity:0,duration:500});
		// }
	// }
	
	
	
	
	return win;
};

module.exports = QRAccountWindow;
