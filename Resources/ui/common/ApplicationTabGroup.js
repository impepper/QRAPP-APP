function ApplicationTabGroup(isTablet) {
	var init_stratup_tabs=0;
	//var Admob = require('ti.admob');	
	Ti.API.info('Create Tabgroup')
	var Window = require('ui/handheld/ApplicationWindow');

	//uncomment if need to check is Tablet or not
	// if (isTablet) {
		// Window = require('ui/tablet/ApplicationWindow');
	// }
	// else {
		// Window = require('ui/handheld/ApplicationWindow');
	// }
		
	var WebViewWindow = require('ui/winmodule/WebViewWindow');
	var WebVideoWindow = require('ui/winmodule/WebVideoWindow');
	var ImageViewWindow = require('ui/winmodule/ImageViewWindow');
	var ContactWindow = require('ui/winmodule/ContactWindow');
	var TableViewWindow = require('ui/winmodule/TableViewWindow');
	var AccountWindow = require('ui/winmodule/AccountWindow');
	var QRAccountWindow = require('ui/winmodule/QRAccountWindow');
	var RSSWindow = require('ui/winmodule/RSSWindow');
	var RSSWindow2 = require('ui/winmodule/RSSWindow2');
	var CustomPageWindow = require('ui/winmodule/CustomPageWindow');
	var ChatWindow = require('ui/winmodule/ChatWindow');
	var SocialLinkWindow = require('ui/winmodule/SocialLinkWindow');
	var QRHistoryWindow = require('ui/winmodule/QRHistoryWindow');
	var QRGeneratorWindow = require('ui/winmodule/QRGeneratorWindow');
	
	//create module instance
	var self_win = Ti.UI.createTabGroup();
	//self_win.tabs=null;
	var resultTabs=[];
	var builttabs=[];
	
	var _login=Ti.App.Properties.getString('cloud_useremail','viewer.defaultui@fuihan.com')
	var _passwd=Ti.App.Properties.getString('cloud_userpassword','viewerInPub')
	
	var loadingTabs = function(tabgroupWin,startup){
		_login=Ti.App.Properties.getString('cloud_useremail','viewer.defaultui@fuihan.com')
		_passwd=Ti.App.Properties.getString('cloud_userpassword','viewerInPub')

		// alert(_login+'---'+_passwd)
		if (typeof startup==undefined){startup=false}
		
		Ti.API.info('loadingTabs Tabgroup')
		//tabgroupWin.tabs=null;
		var Cloud = require('ti.cloud'); 
		Cloud.Users.login({
		    // login: 'viewer.impepper@gmail.com',
		    // password: 'viewerInPub'
		    // login : 'impepper@gmail.com',
		    // password : 'hala0204'	
		    // login: Ti.App.Properties.getString('cloud_useremail','defaultui@fuihan.com'),
		    // password: Ti.App.Properties.getString('cloud_userpassword','fuihan168')		    	    
		    login: _login,
		    password: _passwd    
		}, function (e) {
			if (e.success) {
				var user = e.users[0]
				
				Ti.API.info(
					'Step 1 - Login Success, Start Querying'
				)
				if (Ti.App.Properties.getString('cloud_useremail','') !=''){
					Ti.App.Properties.setBool('cloud_Logged',true)
				}
				
				if (user.email == 'viewer.defaultui@fuihan.com'){
					Ti.App.Properties.setString('chat_root_user',user.id);
				}

				Cloud.Objects.query({
				    classname: 'windows',
				    page: 1,
				    per_page: 30,
				    order:'win_id',
				    where: {
				    	// user_id:'4f9d71150020440def003c2a', //user - impepper@gmail.com
				    	// user_id:'4fa392850020442a3400176c', //user - defaultui@fuihan.com
				    	user_id:user.custom_fields['content_user_id'],
				    	// user_id:e.users[0].id,
				        win_id: {"$gt":0},
				        win_root_id:0
				    }
				}, function (e) {
				    if (e.success) {
						Ti.API.info(
							'Step 2 - Qureying Results Received : '+e.windows.length+' Windows '
						);
						resultTabs=[];
						//self_win.tabs=[];
						//tabgroupWin.tabs=[];
						//resultTabs=e.windows;
				        var WindowRouter = require('ui/winmodule/WindowRouter');	
				        var tabIndex=0;
			            for (var i=0;i<e.windows.length;i++){
				            var windows = e.windows[i]
				            Ti.API.info('Step 2+ - Qureying Results Received : Window '+ i +' Type - '+windows.win_type);
							//check if the window is ready for public
							Ti.API.info('ACL:'+windows.win_published)
							if ((typeof windows.win_published == 'undefined') || (windows.win_published) ){
							// if (true){
								 Ti.API.info('Step 2+ - processing Results Received : Window '+ i +' Type - '+windows.win_type);
								if ((Ti.Platform.osname!='mobileweb') || 
										( (Ti.Platform.osname=='mobileweb') && (windows.win_type!='TYPE_QRACCOUNT')) ){
									// alert('checkpoint:'+windows.win_type)
									
									switch (windows.win_type) {
										case 'TYPE_TABLE':
											var win_parameters=[];
											win_parameters.push(windows.win_parameters[0])
											win_parameters.push(windows.win_parameters[1])
											win_parameters.push(windows.win_parameters[2])
											win_parameters.push(windows.win_id);
											win_parameters.push(0);
											var tabbed_win = new WindowRouter(windows.win_type,win_parameters,windows.id);							
											break;
										default:
											var tabbed_win = new WindowRouter(windows.win_type,windows.win_parameters,windows.id);	
											break;
									}

									var winicon = (windows.win_icon)?windows.win_icon:'about'					
									var tabbed_tab = Ti.UI.createTab({
										title: windows.win_title,
										icon: '/icons/'+winicon+'.png',
										window_type:windows.win_type,
										window: tabbed_win
									});
									
									if ((Ti.Platform.osname == 'android') && (windows.win_type=='TYPE_QRACCOUNT')){
										tabbed_tab.title='mCMS'
										// tabbed_tab.touchEnabled=true;
										// tabbed_tab.addEventListener('click',function(){
											// tabbed_win.fireEvent('scan')
										// })
									}
									
									tabbed_tab.icon = (Ti.Platform.osname=='mobileweb')?'http://mcms.fuihan.com/mobileWeb/icons/'+winicon+'.png':'/icons/'+winicon+'.png'
									tabbed_win.containingTab = tabbed_tab;
									tabbed_win._tabcount = e.windows.length;
									tabbed_win.addEventListener('ReloadTabs',function(){
										Ti.API.info(
											'Step 3 - ReloadTabs Start'
										)
										Ti.API.info('Clear  - self_win.tabs.length:'+self_win.tabs.length);
																		
										self_win.animate({opacity:0,duration:200}, function()								
										{
										    
										    // self_win.fireEvent('ClearTabs');
										    // alert('Clear tabs done')	
											// if (!startup && (Ti.Platform.osname=='android')){
											if (Ti.Platform.osname=='android'){
												var reboot = require('com.nametec.reboot');
												reboot.reboot()
											} else {
											    for (var j=self_win.tabs.length-1;j>0;j--){
											    	// alert('Clear  - var j:'+j)
											    	Ti.API.info('Clear  - var j:'+j);
											    	self_win.removeTab(self_win.tabs[j]);
											    }	
												
												loadingTabs(self_win);	
											}										    						

											
										});
									})
									tabbed_win.addEventListener('switch2Tabs',function(){
										Ti.API.info(
											'Step 3+ - Switch to selected Tab'
										)
										self_win.fireEvent('1switch2Tabs');					
									})
																		
					            	resultTabs[tabIndex]=tabbed_tab;
					            	tabIndex ++;
					            	// Ti.API.info('tabInde:'+tabIndex)									
								}

							}
		       	
			            }
			            
					    for (var j=0;j<resultTabs.length;j++){
					    	Ti.API.info('Add  - resultTabs:'+j);
					    	self_win.addTab(resultTabs[j]);
					    }
					    
					    builttabs=resultTabs;

					    if (resultTabs.length<(self_win.tabs.length+2)){
					    	self_win.removeTab(self_win.tabs[0])
					    }
					    			    
					    self_win.activeTab=0;

				    } else {
				        // alert('Error:\\n' +
				            // ((e.error && e.message) || JSON.stringify(e)));
				        alert('Sorry, Failed in getting Contents withi your account, Please check your content managements.')      
				    }
					//After loading tabs, cgeck auto-save to clear/store userdata
		    
					self_win.animate({opacity:1,duration:300},function(){
					})				    
				});			
		    } else {
		        // alert('Error:\\n' +
		            // ((e.error && e.message) || JSON.stringify(e)));
		            
		        alert('Sorry, Failed in Loggin in. Please try again later.')    
			}
			Ti.API.info(
				'Step 5 - Query Done'
			)				
		});	
		Ti.API.info(
			'Step 6 - Login Done'
		)	
	}
	
	//--------before user login - very first launch
	//--------Checkk if using content app usermail account,
	//--------if not, goto locally established QR Acocunt window
	if ((Ti.App.Properties.getString('cloud_useremail','') !='') || (Ti.Platform.osname=='mobileweb')){
		
		if (Ti.Platform.osname=='mobileweb'){
			// alert('checkpoint1:'+Ti.App.Properties.getString('viewerid',''))
			var tempappid=Ti.Utils.base64decode(Ti.App.Properties.getString('viewerid','')).toString();
			_login='viewer.'+tempappid.toString().substr(9,200)
			_passwd='viewerInPub'
			// alert(_login+','+_passwd)
			// }		
		}
		// alert('checkPoint')
		loadingTabs(self_win,true);	
	} else {
		resultTabs=[];
		//self_win.tabs=[];
		//tabgroupWin.tabs=[];
		//resultTabs=e.windows;
	    var WindowRouter = require('ui/winmodule/WindowRouter');
    	if (Ti.Platform.osname=='mobileweb'){
    		// alert('Check Point')
    		var tabbed_win = new WindowRouter('TYPE_WIN',[true,true,'Welcome to mCMS',''],'');
			var tabbed_tab = Ti.UI.createTab({
				title: 'Welcome to mCMS',
				icon: '/icons/info.png',
				window_type:'TYPE_WIN',
				window: tabbed_win
			});

    	} else {
    		// var startup_tabs=['TYPE_QRGENERATOR','TYPE_QRACCOUNT','TYPE_QRHISTORY']
    		// module testing purpose
    		// var tabbed_win = new WindowRouter('TYPE_SOCIALLINK',[true,true,'Social Llink Module Testing'],'')
    		// var tabbed_win = new WindowRouter('TYPE_QRHISTORY',[true,true,'Scanned History'],'')
    		 // var tabbed_win = new WindowRouter('TYPE_QRGENERATOR',[true,true,'QR Generator'],'')
			//Deploy 
			var tabbed_win = new WindowRouter('TYPE_QRACCOUNT',['Scan Your QR Codes'],'');
			
			var tabbed_tab = Ti.UI.createTab({
				title: 'Scan Your QR Codes',
				icon: '/icons/connect.png',
				window_type:'TYPE_QRACCOUNT',
				window: tabbed_win
			});
			if (Ti.Platform.osname == 'android'){
				tabbed_tab.title='mCMS'
				// tabbed_tab.touchEnabled=true;
				// tabbed_tab.addEventListener('click',function(){
					// tabbed_win.fireEvent('scan')
				// })
			}

    	}
				
		tabbed_win.containingTab = tabbed_tab;
		tabbed_win._tabcount = 0;
		tabbed_win.addEventListener('ReloadTabs',function(){
												
			self_win.animate({opacity:0,duration:200}, function(){
				if (Ti.Platform.osname=='android'){
					var reboot = require('com.nametec.reboot');
					reboot.reboot()
				} else {
				    //Testing ********************
				    // var ready2deletetabs=self_win.tabs.length-resultTabs.length+init_stratup_tabs
				    for (var j=1;j<init_stratup_tabs;j++){
				    	// Ti.API.info('Add  - resultTabs:'+j);
				    	 self_win.removeTab(self_win.tabs[0])
				    }
				    // init_stratup_tabs=1;					
					loadingTabs(self_win);	
				}
						
			});
		})
			
		tabbed_win.addEventListener('switch2Tabs',function(){
			self_win.fireEvent('1switch2Tabs');					
		})
	    
    		
	    // especially for ios platform
		if (Ti.Platform.osname=='iphone' || Ti.Platform.osname == 'ipad'){
    		 var tabbed_win2 = new WindowRouter('TYPE_QRGENERATOR',[true,true,'QR Generator'],'')
			//Deploy 
			// var tabbed_win = new WindowRouter('TYPE_QRACCOUNT',['Scan Your QR Codes'],'');
			
			var tabbed_tab2 = Ti.UI.createTab({
				title: 'QR Generator',
				icon: '/icons/qrcode.png',
				window_type:'TYPE_QRGENERATOR',
				window: tabbed_win2
			});	
    		 var tabbed_win3 = new WindowRouter('TYPE_QRHISTORY',[true,true,'Scanned History'],'')
			//Deploy 
			// var tabbed_win = new WindowRouter('TYPE_QRACCOUNT',['Scan Your QR Codes'],'');
			
			var tabbed_tab3 = Ti.UI.createTab({
				title: 'History',
				icon: '/icons/counter.png',
				window_type:'TYPE_QRHISTORY',
				window: tabbed_win3
			});
			self_win.addTab(tabbed_tab2);
			self_win.addTab(tabbed_tab);
	    	self_win.addTab(tabbed_tab3);	    			    
	  	 	self_win.activeTab=1;
	  	 	init_stratup_tabs=3;	
		} else {
			self_win.addTab(tabbed_tab);	    			    
		    self_win.activeTab=0;
		    init_stratup_tabs=1;			
		}	    	
	}	
	
	self_win.fireEvent('ClearTabs',function(){
		Ti.API.info(
			'Step 3++ - ClearTabs'
		)			
	    for (var j=0;j<builttabs.length;j++){
	    	Ti.API.info('Clear  - builttabs:'+j);
	    	self_win.removeTab(builttabs[j]);
	    }
	})
	
	self_win.addEventListener('1switch2Tabs',function(){
		Ti.API.info(
			'Step 3++ - 1switch2Tabs'
		)						
		// tabbed_win.close();
	    if (((self_win.tabs.length>=2) && (self_win.tabs[0].window_type!='TYPE_QRACCOUNT')) || ((self_win.tabs.length<2) && (self_win.tabs[0].window_type=='TYPE_QRACCOUNT'))){
	    	self_win.activeTab=0;
	    } else {
	    	self_win.activeTab=1;
	    }
	})
	
	return self_win;
};

module.exports = ApplicationTabGroup;
