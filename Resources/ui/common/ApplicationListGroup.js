function ApplicationListGroup(_root_win,tabbed_window,show_navbar,title,acs_win_id,acs_table_root_id) {
	Ti.include('/jslib/fnc_logging.js');
	Ti.include('/stylelib/style_01.js');
	var win = Ti.UI.createWindow({
		title:title,
		// backgroundColor:'white',
		navBarHidden:false,
		tabBarHidden : true,
		// backgroundColor:'white'
		backgroundColor:stytle_winBGColor
	});
	// alert('checkpoint 1')
	// var version = Ti.Platform.version
	// var height = Ti.Platform.displayCaps.platformHeight
	// var width = Ti.Platform.displayCaps.platformWidth
	// var isTablet = osname === 'ipad' || (osname === 'android' && (width > 899 || height > 899));
	// var adgap=(isTablet?90:50);
	// var adwidth=(isTablet?728:320);
	// var ad_role = Ti.App.Properties.getInt('cloud_userrole',0)
	var view_header_gap=0
	// alert('checkpoint 21')
	// if ((ad_role < 5) && (Ti.Platform.osname!='mobileweb')){
		// view_header_gap=adgap;
		// //Admob Setting
		// var Admob = require('ti.admob');
// 	
		// var ad;
		// win.add(ad = Admob.createView({
		    // top: 0, //left: 0,
		    // width: adwidth, height: adgap,
		    // publisherId: 'a14fc70a8d46176', // You can get your own at http: //www.admob.com/
		    // adBackgroundColor: 'black',
		    // // testing: true,
		    // // dateOfBirth: new Date(1985, 10, 1, 12, 1, 1),
		    // gender: 'male',
		    // keywords: 'movie'
		// }));
// 		
		// /*
		 // And we'll try to get the user's location for this second ad!
		 // */
	    // win.add(Admob.createView({
	        // bottom: 0, //left: 0,
	        // width: adwidth, height: adgap,
	        // publisherId: 'a14fc70a8d46176', // You can get your own at http: //www.admob.com/
	        // adBackgroundColor: 'black',
	        // // testing: true,
	        // // dateOfBirth: new Date(1985, 10, 1, 12, 1, 1),
	        // gender: 'female',
	        // keywords: 'shopping',
	        // location: e.coords
	    // }));	
// 	    	
		// //End of Admob		
	// }
	// alert('checkpoint 22')
	// create table view
	var table_items=[];

	var tableview = Ti.UI.createTableView({
		top:view_header_gap,
		bottom:view_header_gap,
		data:table_items,
		backgroundColor:stytle_tableBGColor
	});

	// create table view event listener
	tableview.addEventListener('click', function(e) {
		
		var WindowRouter = require('ui/winmodule/WindowRouter');
		// alert('Item Clicked:'+e.rowData.targetWindow+'  /  '+e.rowData.targetWindowId)
		var routedWindow = new WindowRouter(e.rowData.targetWindow,e.rowData.targetWindowParameters,e.rowData.targetWindowId);		
		routedWindow.containingTab=_root_win.containingTab;		
		_root_win.containingTab.open(routedWindow);
	});

	win.add(tableview);
	
	win.addEventListener('open',function(){
		// alert('checkpoint 3')
		// create table view
		var table_items=[];
		var _login=Ti.App.Properties.getString('cloud_useremail','viewer.defaultui@fuihan.com')
		var _passwd=Ti.App.Properties.getString('cloud_userpassword','viewerInPub')	
			
		logging('List', _login,true)
		
		if (Ti.Platform.osname=='mobileweb'){
			var tempappid=Ti.Utils.base64decode(Ti.App.Properties.getString('viewerid','')).toString();
			_login='viewer.'+tempappid.toString().substr(9,200)
			_passwd='viewerInPub'
		}
		var Cloud = require('ti.cloud'); 
		// alert('checkpoint 4')
		Cloud.Users.login({
		    login: _login,
		    password: _passwd,
		}, function (e) {
			if (e.success) {
				// alert('Logged')
				var user = e.users[0]
				
		        var userrole=0; 
		        if ((typeof user.role!= 'undefined') && (user.role!='')){
		        	// Ti.App.Properties.setInt('cloud_userrole',0)
		        	userrole=6
		        } else {
		        	userrole=parseInt(user.role.toString())
		        } 
				Ti.App.Properties.setInt('cloud_userrole',userrole)				
				
				//Call Google Analytics
				var cloudContentTitle = e.users[0].custom_fields['content_title']
				if (cloudContentTitle == undefined){cloudContentTitle = L('_MCMSCONTENTTITLE','mCMS Content')}
				Ti.App.Properties.setString('QRAppContentTitle',cloudContentTitle)
				
				Ti.App.Properties.setString('GoogleAnalyticsAppID',(e.users[0].custom_fields['content_ga'] == undefined)?'UA-41799104-1':e.users[0].custom_fields['content_ga'])
				
				var GA = require('analytics.google'); 
				var tracker_master = GA.getTracker(Ti.App.Properties.getString('GoogleAnalyticsAdminID','UA-41799104-1'));
				tracker_master.trackEvent({ category: "QR App", action: "Title", label: cloudContentTitle, value: 1 });
				
				Cloud.Objects.query({
				    classname: 'windows',
				    page: 1,
				    per_page: 30,
				    order:'win_id',
				    where: {
				        win_root_id:0,
				        win_id: {"$gt":0,"$lt":999},
				        // win_published:true,
				        user_id:user.custom_fields['content_user_id']
				    }
				}, function (e) {
					if (e.success) {
						var tableitem;
						// alert('Wins:'+e.windows.length)
						for (var j=0;j<e.windows.length;j++){
							
							tableitem=e.windows[j];
							var win_parameters=[]
							if ((tableitem.win_type!='TYPE_TABBEDGROUP') && (typeof(tableitem.win_published)=='undefined') || (tableitem.win_published)){
							// if ((tableitem.win_type!='TYPE_TABBEDGROUP') 
								// && ((typeof windows.win_published == 'undefined') || (windows.win_published))){	
								if (tableitem.win_type=='TYPE_TABLE'){								
									if (Ti.Platform.osname=='android'){
										win_parameters[0]=tableitem.win_parameters[0];
										win_parameters[1]=tableitem.win_parameters[1];
										win_parameters[2]=tableitem.win_parameters[2];
										win_parameters[3]=tableitem.win_id;
										win_parameters[4]=acs_win_id;									
									} else  {
										win_parameters.push(tableitem.win_parameters[0]);
										win_parameters.push(tableitem.win_parameters[1]);
										win_parameters.push(tableitem.win_parameters[2]);
										win_parameters.push(tableitem.win_id);
										win_parameters.push(acs_win_id);									
									}												
								} else {
									win_parameters=tableitem.win_parameters
								}
								
								table_items[j] = Ti.UI.createTableViewRow({
									// hasDetail:true,
									//title:tableitem.win_title,
									height:55,									
									targetWindow:tableitem.win_type,
									targetWindowParameters:win_parameters,
									targetWindowId:tableitem.id
								});
								
								if (tableitem.win_type=='TYPE_TABLE'){
									table_items[j].hasDetail=false;
									table_items[j].hasChild=true;						
								}
								
								var winicon = (tableitem.win_icon)?tableitem.win_icon:'about'
								// alert(winicon)
								var img = Ti.UI.createImageView({		
									image:'/icons/'+winicon+'.png',
									left:5,
									height:45,
									width:45
								});
								
								table_items[j].add(img);					
								
								var content_left_margin=52
									
								var title = tableitem.win_title
						
								var label_title = Ti.UI.createLabel({
									text:title,
									left:content_left_margin+5,
									top:5,
									height:45,
									wordWrap:true,
									right:5,
									font:{fontFamily:'Helvetica Neue',fontWeight:'bold',fontSize:20},
									color:style_fontcolor			
								});
								table_items[j].add(label_title);														
							}							
						}
						tableview.data=table_items
						// alert('prepare for Btn')
						//dealing with Soical sharing nav Buttons
						// Ti.include('jslib/ui_social.js')
						if ((Ti.Platform.osname =='iphone') || (Ti.Platform.osname =='ipad')){
							var ui_btnSocial = require('jslib/ui_btnSocial');
							navbtn_social = new ui_btnSocial(win,'mcms');
							win.setRightNavButton(navbtn_social);
						} else {
							//adding menu items for Android environment
							// var menu=null;
							// win.addEventListener('open', function() {
								var activity = win.activity;
								activity.onCreateOptionsMenu = function(e) {
									var menu = e.menu; // save off menu.
									var m1 = menu.add({
										titleid:'_SHARING',
										itemId : 1,
										groupId : 0,
										order : 0
									});
									m1.setIcon("/icons_menu/QRSharing.png");
									m1.addEventListener('click',function(e){										
										var optionsDialogOpts = {
											// options:['Mail', 'Facebook'],
											options:[L('_BYMAIL','Mail')],
											destructive:1,
											titleid:'_SHARINGQR',
											selectedIndex:0
										};
										
										var dialog = Titanium.UI.createOptionDialog(optionsDialogOpts);
										dialog.buttonNames = [L('_CANCEL','Cancel')];
										dialog.addEventListener('click',function(e)
										{
											if (!e.button){
												// alert('Selected:'+optionsDialogOpts.options[e.index])
												var applink='http://code.qrapp.com.tw/content/'+Ti.Utils.base64encode('&content='+Ti.App.Properties.getString('cloud_useremail','viewer.8.service@fuihan.com').substr(7,200))
												// alert(applink)
												switch (e.index){
													case 1:
														//facebook
														Ti.include('/jslib/fnc_social.js');
														var fb_message = "我建立了一個 mCMS QR Code，跟別的QR Code不一樣，他包含了很多很酷的資訊喔";
														fnc_fb_post('DIALOG',fb_message,applink)
														break;
													case 0:
														//mail
														var emailDialog = Titanium.UI.createEmailDialog({
															html:true,
															subject : L('_SHARINGQR','QRCode Sharing'),
															// toRecipients = ['chihong.lin@gmail.com'],
															messageBody:'<html>這是個很酷的 QRCode，你可以試試看<br> It is an amazing QRCode, Give it a try.<br><h2><a href="'+applink+'"> mCMS QR</a></h2><br></html>'
															//emailDialog.messageBody = '這是個很酷的 QRCode，你可以試試看 It is an amazing QRCode, Give it a try.<br><h2><a href="'+applink+'"> mCMS QR</a></h2><br>';
														})
														emailDialog.open();
														break;													  
												}
												// alert('done')
											}
										});	
										dialog.androidView = null;
										dialog.show();
									})				
								};
							// });							
						}						
							
					} else {
				        // alert('Error:\\n' +
				            // ((e.error && e.message) || JSON.stringify(e)));
				            // alert('wrong')
				        alert(L('_ERR_GETTINGCONTENT','Sorry, Failed in getting Contents withi your account, Please check your content managements.'))
				        win.close();    
					}
				})			
		    } else {
		        // alert('Error:\\n' +
		            // ((e.error && e.message) || JSON.stringify(e)));
		        alert(L('_ERR_LOGIN','Sorry, Failed in Loggin in. Please try again later.'))
		        win.close();     
			}
		});			
	})
	return win
};

module.exports = ApplicationListGroup;
