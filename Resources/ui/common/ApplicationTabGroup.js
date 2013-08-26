function ApplicationTabGroup(isTablet) {
	// alert('create TABs')
	Ti.include('jslib/fnc_cloud.js');
	
	var init_stratup_tabs=0;
	
	Ti.API.info('Create Tabgroup')
	
	var self_win = Ti.UI.createTabGroup();
	
	// var Window = require('ui/handheld/ApplicationWindow');	
	var ApplicationListGroup = require('ui/common/ApplicationListGroup');

	var resultTabs=[];
	var builttabs=[];
	
    var _login = 'viewer.defaultui@fuihan.com'
    var _password = 'viewerInPub'	
	var osname = Ti.Platform.osname
	
	var func_ReloadTabs = function(self_win,tabgroupWin,func_loadingTabs){										
		self_win.animate({opacity:0,duration:200}, function(){
			if (Ti.Platform.osname=='android'){
				if ((Ti.App.Properties.getString('loading_method','TAB') =='TAB')){
					var reboot = require('com.nametec.reboot');
					reboot.reboot()
				}
			} else {
			    for (var j=1;j<init_stratup_tabs;j++){
			    	 tabgroupWin.removeTab(tabgroupWin.tabs[0])
			    }			
				func_loadingTabs(tabgroupWin);	
			}		
		});		
	}
	
	var func_ReloadLists = function(data,tabbed_win){		
		var ApplicationListGroup = require('ui/common/ApplicationListGroup');
		app_list_win = new ApplicationListGroup(tabbed_win,true,true,data.qrwin_title,'');
		tabbed_win.containingTab.open(app_list_win)
		Ti.App.Properties.setBool('auto_login',false)
	}
	
	var func_ShowQRWin = function(data,tabbed_win){
		var QRWindowRouter = require('ui/winmodule/WindowRouter');
		// var routedQRWindow = new QRWindowRouter(data.qrwin_type,[data.qrwin_title,data.qrwin_content],'');
		var routedQRWindow = new QRWindowRouter(data.qrwin_type,[L(data.qrwin_type,data.qrwin_title),data.qrwin_content],'');
		// if ((Ti.App.Properties.getString('loading_method','TAB')=='LIST') || (Ti.Platform.name == 'android')){
		
		//if App set in LIST mode, push a new tab to show qr code content
		//If in TAB mode, open a modal window to show QR Contents
		if ((Ti.App.Properties.getString('loading_method','TAB')=='LIST')){				
			if (Ti.Platform.osname == 'android') {
				var b = Titanium.UI.createButton({
					titleid:'_CLOSE',
					right:5,
					top:5
				});	
				b.addEventListener('click',function(){
					routedQRWindow.close()
				})
				routedQRWindow.add(b)
				routedQRWindow.open()			
			} else {
				tabbed_win.containingTab.open(routedQRWindow)
			}					
		} else {
			setTimeout(function(){
				var b = Titanium.UI.createButton({
					titleid:'_CLOSE',
					style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
				});
				routedQRWindow.setLeftNavButton(b);
				b.addEventListener('click',function(){
					routedQRWindow.close();
				});
				routedQRWindow.open({modal:true})
			},2000)
		}	
	}
	
	if (Ti.App.Properties.getBool('auto_login',false)){
	    var _login= Ti.App.Properties.getString('cloud_useremail','viewer.defaultui@fuihan.com')
	    var _password = Ti.App.Properties.getString('cloud_userpassword','viewerInPub')	    
	} else {
		cloud_resetUser()   		
	}

	//necessary for mobileweb interface : getting UserID form webbrowser (Setting by POST in web)
	if (osname=='mobileweb'){
		var tempappid=Ti.Utils.base64decode(Ti.App.Properties.getString('viewerid','')).toString();
		_login='viewer.'+tempappid.toString().substr(9,200)
		alert('user:'+_login)
	}	
	
	// future feature : Get Keys for Right ACS applications
	// if (_login.substr(7,200) == 'defaultui@fuihan.com'){
		// getCloudKey('0.'+_login.substr(7,200))
	// } else {
		// getCloudKey(_login.substr(7,200))
	// }
	
	Ti.API.info('User:'+_login)
	Ti.API.info('Pass:'+_password)
	
		
	
	var loadingDefaultTabs = function(tabgroupWin,startup){
		resultTabs=[];
		
		//create first TAb : QR Code Scanner
	    var WindowRouter = require('ui/winmodule/WindowRouter');
    	if (Ti.Platform.osname=='mobileweb'){
    		var tabbed_win = new WindowRouter('TYPE_WIN',[true,true,L('_WELCOMEMCMS','Welcome to mCMS'),''],'');
			var tabbed_tab = Ti.UI.createTab({
				titleid: '_WELCOMEMCMS',
				icon: '/icons/info.png',
				window_type:'TYPE_WIN',
				window: tabbed_win
			});
    	} else {

			var tabbed_win = new WindowRouter('TYPE_QRACCOUNT',[L('_SCANURQR','Scan Your QR Codes')],'',tabgroupWin);
			
			var tabbed_tab = Ti.UI.createTab({
				titleid: '_SCANURQR',
				icon: '/icons/connect.png',
				window_type:'TYPE_QRACCOUNT',
				window: tabbed_win
			});
			if (Ti.Platform.osname == 'android'){
				tabbed_tab.titleid='_MCMS'
			}
    	}

				
		tabbed_win.containingTab = tabbed_tab;
		tabbed_win._tabcount = 0;
					
		tabbed_win.addEventListener('ReloadTabs', function(){
			func_ReloadTabs(self_win,tabgroupWin,loadingTabs)
		})

		tabbed_win.addEventListener('ReloadLists',function(data){
			func_ReloadLists(data,tabbed_win)
		})
		
		tabbed_win.addEventListener('ShowQRWin',function(data){
			func_ShowQRWin(data,tabbed_win)
		})
					
		tabbed_win.addEventListener('switch2Tabs',function(){
			self_win.fireEvent('mainWin_switch2Tabs');					
		})
	       		
	    // especially for mobile platform -- creat extra two tabs
		if (Ti.Platform.name != 'mobileweb' ){
			//create QR Generator Tab
    		var tabbed_win2 = new WindowRouter('TYPE_QRGENERATOR',[true,true,L('_QRGENERATOR','QR Generator')],'')	
			var tabbed_tab2 = Ti.UI.createTab({
				titleid: '_QRGENERATOR',
				icon: '/icons/qrcode.png',
				window_type:'TYPE_QRGENERATOR',
				window: tabbed_win2
			});
					
			self_win.addTab(tabbed_tab2);
			self_win.addTab(tabbed_tab);	    			    
	  	 	// self_win.activeTab=1;
	  	 	init_stratup_tabs=2;	
		} else {		    
		    /// New modificaton
		    // var tabbed_win2 = new WindowRouter('TYPE_QRGENERATOR',[true,true,L('_QRGENERATOR','QR Generator')],'')	
			// var tabbed_tab2 = Ti.UI.createTab({
				// titleid: '_QRGENERATOR',
				// icon: '/icons/qrcode.png',
				// window_type:'TYPE_QRGENERATOR',
				// window: tabbed_win2
			// });					
			// self_win.addTab(tabbed_tab2);
			// self_win.addTab(tabbed_tab);
	  	 	// init_stratup_tabs=2;	
		}
		// alert('self_win:'+self_win.tabs.length+'/init_stratup_tabs:'+init_stratup_tabs)
		while (self_win.tabs.length>init_stratup_tabs){
	    	self_win.removeTab(self_win.tabs[0])
	    }

	    self_win.activeTab=init_stratup_tabs-1;			
	}
	
	//Major Function - Loading Window Modules in Tabs
	var loadingTabs = function(tabgroupWin,startup){

		_login=Ti.App.Properties.getString('cloud_useremail','viewer.defaultui@fuihan.com')
		_passwd=Ti.App.Properties.getString('cloud_userpassword','viewerInPub')
		
		Ti.API.info('User2:'+_login)
		Ti.API.info('Pass2:'+_password)
	
		if (typeof (startup)=='undefined'){startup=false}

		var Cloud = require('ti.cloud'); 
		Cloud.Users.login({
		    // login: 'viewer.impepper@gmail.com',
		    // password: 'viewerInPub'
		    // login : 'impepper@gmail.com',
		    // password : 'hala0204'	    	    
		    login: _login,
		    password: _passwd    
		}, function (e) {
			if (e.success) {
				var user = e.users[0]				
				//Step 1 - Login Success, Start  Querying modules
				Ti.App.Properties.setBool('cloud_Logged',true)		
		        var userrole=0; 
		        if ((typeof (user.role)!= undefined) && (user.role!='')){
		        	userrole=6
		        } else {
		        	userrole=parseInt(user.role.toString())
		        } 
				Ti.App.Properties.setInt('cloud_userrole',userrole)
				//Un-Used : setting property for chatting 				
				// if (user.email == 'viewer.defaultui@fuihan.com'){
					// Ti.App.Properties.setString('chat_root_user',user.id);
				// }
				
				
				//Call Google Analytics
				var cloudContentTitle = e.users[0].custom_fields['content_title']
				if (cloudContentTitle == undefined){cloudContentTitle = L('_MCMSCONTENTTITLE','mCMS Content')}
				Ti.App.Properties.setString('QRAppContentTitle',cloudContentTitle)
				
				Ti.App.Properties.setString('GoogleAnalyticsAppID',(e.users[0].custom_fields['content_ga'] == undefined)?'UA-41799104-1':e.users[0].custom_fields['content_ga']
				
				
				var GA = require('analytics.google'); 
				var tracker_master = GA.getTracker(Ti.App.Properties.getString('GoogleAnalyticsAdminID','UA-41799104-1'));
				tracker_master.trackEvent({ category: "QR App", action: "Title", label: cloudContentTitle, value: 1 });
				
				
				//Local defined user setting
				var win_id_range = {"$gt":0}
				if (Ti.App.Properties.getBool('local_user',false)){
					win_id_range = {"$gt":0,"$lt":998}				
				}
				
				Cloud.Objects.query({
				    classname: 'windows',
				    page: 1,
				    per_page: 30,
				    order:'win_id',
				    where: {
				    	user_id:user.custom_fields['content_user_id'],
				        win_id: win_id_range,
				        //win_published:true,
				        win_root_id:0
				    }
				}, function (e) {
					
					//Check for Loading methods to transform Windows to TAB/List interface
				    if (e.success && (Ti.App.Properties.getString('loading_method','TAB')=='TAB')) {
						//Step 2 - Creating Queried Winodws 						
						resultTabs=[];
				        var WindowRouter = require('ui/winmodule/WindowRouter');	
				        var tabIndex=0;
			            for (var i=0;i<e.windows.length;i++){
				            var windows = e.windows[i]
				            Ti.API.info('Step 2+ - Qureying Results Received : Window '+ i +' Type - '+windows.win_type);
							//check if the window is ready for public
							Ti.API.info('ACL [win_published]:'+windows.win_published)
							if (((typeof (windows.win_published) == 'undefined') || (windows.win_published)) 
								&& ((Ti.Platform.osname!='mobileweb') || ((Ti.Platform.osname=='mobileweb') && (windows.win_type!='TYPE_QRACCOUNT')))){

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
									case 'TYPE_QRACCOUNT':
										var tabbed_win = new WindowRouter(windows.win_type,windows.win_parameters,windows.id,tabgroupWin);
										//Create Function Specificlt for QR SCANNER Window
										tabbed_win.addEventListener('ResetTabs',function(){
											// alert('checkpoint 2')	
											// triggered only when first using this app to scan mCMS QRs											
											tabgroupWin.animate({opacity:0,duration:200}, function(){
												
												if (Ti.Platform.osname=='android'){
													var reboot = require('com.nametec.reboot');
													reboot.reboot()
												} else {
												    loadingDefaultTabs(tabgroupWin)
												}
												tabgroupWin.animate({opacity:1,duration:300},function(){		
													if (Ti.App.Properties.getString('loading_method','TAB')=='TAB'){
														Ti.App.Properties.setBool('auto_login',true)
													} else {
														Ti.App.Properties.setBool('auto_login',false)
													}
												})	
									
											});
											
										})
																				
										break;
									default:
										var tabbed_win = new WindowRouter(windows.win_type,windows.win_parameters,windows.id);
													
										break;
								}

								var winicon = (windows.win_icon)?windows.win_icon:'about'					
								var tabbed_tab = Ti.UI.createTab({
									title: windows.win_title,
									window_type:windows.win_type,
									window: tabbed_win
								});
								
								if ((Ti.Platform.osname == 'android') && (windows.win_type=='TYPE_QRACCOUNT')){
									tabbed_tab.titleid='_MCMS'
								}

								tabbed_tab.icon = (Ti.Platform.osname=='mobileweb')?'http://code.qrapp.com.tw/mobileWeb/icons/'+winicon+'.png':'/icons/'+winicon+'.png'
								
								//making every windows capable to reload tabs from new QR App
								tabbed_win.containingTab = tabbed_tab;
								tabbed_win._tabcount = e.windows.length;
								
								// Making Functions to reload tabs
								tabbed_win.addEventListener('ReloadTabs',function(){
									func_ReloadTabs(self_win,tabgroupWin,loadingTabs)
								})
								
								//making every windows capable to reload data in Lists from new QR App
								tabbed_win.addEventListener('ReloadLists',function(data){									
									func_ReloadLists(data,tabbed_win)
								})
								
								tabbed_win.addEventListener('ShowQRWin',function(data){
									func_ShowQRWin(data,tabbed_win)
								})
								
								tabbed_win.addEventListener('switch2Tabs',function(){
									//Switch to first Tab
									tabgroupWin.fireEvent('mainWin_switch2Tabs');					
								})

								if (Ti.Platform.osname=='android'){
									tabbed_win.addEventListener('CloseQRWin',function(data){
										tabbed_win.containingTab.close(data.qrWin)
									})			
								}															
																	
				            	resultTabs[tabIndex]=tabbed_tab;
				            	tabIndex ++;

							}
			            }
			            
			            //add new Tabs into current window (tabbed group)
					    for (var j=0;j<resultTabs.length;j++){
					    	tabgroupWin.addTab(resultTabs[j]);
					    }
					    
					    builttabs=resultTabs;
						// alert('resultTabs:'+resultTabs.length + '/ self_win_Tabs: '+self_win.tabs.length +'/ init_stratup_tabs: '+init_stratup_tabs)
						
						//remove previous tab windows
						while (resultTabs.length<(tabgroupWin.tabs.length)){
					    	tabgroupWin.removeTab(tabgroupWin.tabs[0])
					    }
					    
						if (Ti.Platform.osname == 'android'){
							var lengthTabs=tabgroupWin.tabs.length
							tabgroupWin.tabs[lengthTabs-1].getWindow().fireEvent('open')
							tabgroupWin.setActiveTab(lengthTabs-1);	
						} else {
							 //Switch to first Tab
							tabgroupWin.activeTab=0;
						}

						//After loading tabs, fade in windows with new tabs
						tabgroupWin.animate({opacity:1,duration:300},function(){
							Ti.App.Properties.setBool('auto_login',true)
							tabgroupWin.setActiveTab(0)
						})	

				    } else {				    	
				    	//Failed in Querying Windows
				    	if (e.error){
				    		alert(L('_ERR_GETTINGCONTENT','Sorry, Failed in getting Contents withi your account, Please check your content managements.')) 
				    		loadingDefaultTabs(self_win,true)  
				    	} else {
							var ApplicationListGroup = require('ui/common/ApplicationListGroup');
							app_list_win = new ApplicationListGroup(tabgroupWin,true,true,L('_QRCONTENT','QR Content'),'');
							Ti.App.Properties.setBool('auto_login',false)
							tabgroupWin.containingTab.open(app_list_win)				    		
				    	}
				    }						    
				});			
		    } else { 
		    	//Failed in Logging In   
		        alert(L('_ERR_LOGIN','Sorry, Failed in Loggin in. Please try again later.'))
		        // alert('Loging Error: '+e.message) 
		        loadingDefaultTabs(self_win,true)   
			}; //-------Query Windows			
		});	//------ USer Login

	}//function loadingTabs  
	
	//Major Function - Loading Window Modules in Tabs from Local Conf File
	var loadingLocalTabs = function(tabgroupWin,localWin,startup){

		if (typeof (startup)=='undefined'){startup=false}
		resultTabs=[];
		var WindowRouter = require('ui/winmodule/WindowRouter');	
		var tabIndex=0;
        for (var i=0;i<localWin.length;i++){
            var windows = localWin[i]
            Ti.API.info('Step 2+ - Qureying Results Received : Window '+ i +' Type - '+windows.win_type);
			//check if the window is ready for public
			Ti.API.info('ACL [win_published]:'+windows.win_published)
			if (((typeof (windows.win_published) == 'undefined') || (windows.win_published)) 
				&& ((Ti.Platform.osname!='mobileweb') || ((Ti.Platform.osname=='mobileweb') && (windows.win_type!='TYPE_QRACCOUNT')))
				&& (windows.win_root_id==0)){

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
					window_type:windows.win_type,
					window: tabbed_win
				});
				
				if ((Ti.Platform.osname == 'android') && (windows.win_type=='TYPE_QRACCOUNT')){
					tabbed_tab.titleid='_MCMS'
				}

				tabbed_tab.icon = (Ti.Platform.osname=='mobileweb')?'http://code.qrapp.com.tw/mobileWeb/icons/'+winicon+'.png':'/icons/'+winicon+'.png'
				
				//making every windows capable to reload tabs from new QR App
				tabbed_win.containingTab = tabbed_tab;
				tabbed_win._tabcount = localWin.length;														
													
            	resultTabs[tabIndex]=tabbed_tab;
            	tabIndex ++;

			}
        }
        
        //add new Tabs into current window (tabbed group)
	    for (var j=0;j<resultTabs.length;j++){
	    	tabgroupWin.addTab(resultTabs[j]);
	    }
	    
		if (Ti.Platform.osname == 'android'){
			var lengthTabs=tabgroupWin.tabs.length
			tabgroupWin.tabs[lengthTabs-1].getWindow().fireEvent('open')
			tabgroupWin.setActiveTab(lengthTabs-1);	
		} else {
			 //Switch to first Tab
			tabgroupWin.activeTab=0;
		}
	}//function loadingLocalTabs 

	
	//--------before user login - very first launch
	//--------Check if using local Conf
	var localTabs = false
	var tmp_conffile = Ti.Filesystem.getFile('conf/default.json')
	if(tmp_conffile.exists()){
		Ti.API.info('Got Conf File')
		Ti.include('conf/default.json')
	}

	// --- Check if Network is available
	// --- If not, Loading Default QR Tabs
	var defaultTabs = false
	if (Ti.Network.networkTypeName == 'NONE'){
		Ti.API.info('currently out of networking sertvice - load default local data')
		defaultTabs = true
	}
	
	//Set Property on Loading Local Conf Tabs  ---   Boolean 
	var localTabs = Ti.App.Properties.getBool('local_tabs',false)
	
	if (defaultTabs){	
		// No network, loading default QR tabs		
		loadingDefaultTabs(self_win,true)
	} else {
		if (localTabs){
			//Loading Local Defined Tabs
			Ti.API.info('Loading Local Tabs')
			// var defaultJSON = getJSON()
			Ti.API.info('Loading Local Wins:'+defaultJSON.length)
			Ti.App.Properties.setInt('cloud_userrole',local_userrole)
			Ti.API.info('Loading local_userrole:'+local_userrole)
			loadingLocalTabs(self_win,defaultJSON,true);
			
		} else {
			//--------Check if using content app usermail account,
			//--------if not, goto locally established QR Acocunt window
			// //if (((Ti.App.Properties.getString('loading_method','TAB')=='TAB') && (Ti.App.Properties.getString('cloud_useremail','') !='')) 
			if (((Ti.App.Properties.getString('loading_method','TAB')=='TAB') && (Ti.App.Properties.getBool('auto_login',false)))
					|| (Ti.Platform.osname=='mobileweb')){
				if (Ti.Platform.osname=='mobileweb'){
					var tempappid=Ti.Utils.base64decode(Ti.App.Properties.getString('viewerid','')).toString();
					_login='viewer.'+tempappid.toString().substr(9,200)
					_passwd='viewerInPub'	
				}
				loadingTabs(self_win,true);					
			} else {
				// alert('start loadingDefaultTabs')		
				loadingDefaultTabs(self_win,true)	    	
			}	
		}
	}

	self_win.addEventListener('ClearTabs',function(){
		Ti.API.info('Step 3++ - ClearTabs')	
	    for (var j=0;j<builttabs.length;j++){
	    	Ti.API.info('Clear  - builttabs:'+j);
	    	self_win.removeTab(builttabs[j]);
	    }
	})
	
	self_win.addEventListener('mainWin_switch2Tabs',function(){
	    if (((self_win.tabs.length>=2) && (self_win.tabs[0].window_type!='TYPE_QRACCOUNT'))
			|| ((self_win.tabs.length<2) && (self_win.tabs[0].window_type=='TYPE_QRACCOUNT'))){
	    	self_win.activeTab=0;
	    } else {
	    	self_win.activeTab=1;
	    }
	})

	return self_win;
};

module.exports = ApplicationTabGroup;
