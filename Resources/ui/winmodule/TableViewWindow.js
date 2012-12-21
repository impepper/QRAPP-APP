function TableViewWindow(tabbed_window,show_navbar,title,acs_win_id,acs_table_root_id) {
	var win = Ti.UI.createWindow({
		title:title,
		backgroundColor:'white',
		navBarHidden:false
	});

	var osname = Ti.Platform.osname,
		version = Ti.Platform.version,
		height = Ti.Platform.displayCaps.platformHeight,
		width = Ti.Platform.displayCaps.platformWidth;	
	var isTablet = osname === 'ipad' || (osname === 'android' && (width > 899 || height > 899));
	var adgap=(isTablet?90:50);
	var adwidth=(isTablet?728:320);
	var ad_role = Ti.App.Properties.getInt('cloud_userrole',0)
	var view_header_gap=0
	if ((ad_role < 5) && (Ti.Platform.osname!='mobileweb')){
		view_header_gap=adgap;
		//Admob Setting
		var Admob = require('ti.admob');
	
		var ad;
		win.add(ad = Admob.createView({
		    top: 0, //left: 0,
		    width: adwidth, height: adgap,
		    publisherId: 'a14fc70a8d46176', // You can get your own at http: //www.admob.com/
		    adBackgroundColor: 'black',
		    // testing: true,
		    // dateOfBirth: new Date(1985, 10, 1, 12, 1, 1),
		    gender: 'male',
		    keywords: 'movie'
		}));
		
		/*
		 And we'll try to get the user's location for this second ad!
		 */
		Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
		Ti.Geolocation.distanceFilter = 0;
		Ti.Geolocation.purpose = 'To show you local ads, of course!';
		Ti.Geolocation.getCurrentPosition(function reportPosition(e) {
		    if (!e.success || e.error) {
		        // aw, shucks...
		    }
		    else {
		        win.add(Admob.createView({
		            bottom: 0, //left: 0,
		            width: adwidth, height: adgap,
		            publisherId: 'a14fc70a8d46176', // You can get your own at http: //www.admob.com/
		            adBackgroundColor: 'black',
		            // testing: true,
		            // dateOfBirth: new Date(1985, 10, 1, 12, 1, 1),
		            gender: 'female',
		            keywords: 'shopping',
		            location: e.coords
		        }));
		    }
		});	
		//End of Admob		
	}
	// create table view data object
	// var data_local = [];
	// data_local[0] = Ti.UI.createTableViewRow({hasChild:true,title:'Row 1'});
	// data_local[1] = Ti.UI.createTableViewRow({hasDetail:true,title:'Row 2'});
	// data_local[2] = Ti.UI.createTableViewRow({hasCheck:true,title:'Row 3'});
	// data_local[3] = Ti.UI.createTableViewRow({title:'Row 4'});

	// create table view
	var table_items=[];

	var tableview = Ti.UI.createTableView({
		top:view_header_gap,
		bottom:view_header_gap,
		// data:data
		data:table_items
		// data:data_local
	});
	
	function showClickEventInfo(e) {
		var index = e.index;
		var section = e.section;
		var row = e.row;
		var rowdata = e.rowData;
		var msg = 'row ' + row + ' index ' + index + ' section ' + section  + ' row data ' + rowdata;
		Titanium.UI.createAlertDialog({title:'Table View',message:msg}).show();
	}
	
	// create table view event listener
	tableview.addEventListener('click', function(e) {
		// showClickEventInfo(e);
		
		var WindowRouter = require('ui/winmodule/WindowRouter');
		// var routedWindow = new WindowRouter('TYPE_WEBVIEW',[true,true,'WebView form TableView','http://tw.yahoo.com']);
		
		// if (e.rowData.targetWindow=='TYPE_COVERFLOW'){
			// alert("win_id sent:"+e.rowData.targetWindowId)
		// }
		
				
		// switch (e.rowData.targetWindow) {
			// case 'TYPE_TABLE':
				// var win_parameters=[];
				// win_parameters.push(e.rowData.targetWindowParameters[0])
				// win_parameters.push(e.rowData.targetWindowParameters[1])
				// win_parameters.push(e.rowData.targetWindowParameters[2])
				// win_parameters.push(e.rowData.targetWindowId);
				// win_parameters.push(0);
				// var routedWindow = new WindowRouter(e.rowData.targetWindow,win_parameters,e.rowData.targetWindowId);							
				// break;
			// default:
				// var routedWindow = new WindowRouter(e.rowData.targetWindow,e.rowData.targetWindowParameters,e.rowData.targetWindowId);	
				// break;
		// }

		// alert(e.rowData.targetWindow+'/'+e.rowData.targetWindowParameters+'/'+e.rowData.targetWindowId)		
		var routedWindow = new WindowRouter(e.rowData.targetWindow,e.rowData.targetWindowParameters,e.rowData.targetWindowId);
		
		routedWindow.containingTab=win.containingTab;
		// if (Ti.Platform.osname=='android'){
			// // alert('new checkpoint')
			// // var ExampleWindow = require('ui/winmodule/table_view_basic');
			// // routedWindow= new ExampleWindow();
		// }
		win.containingTab.open(routedWindow);
	});

	win.add(tableview);
	

	
	win.addEventListener('open',function(){

		// create table view
		var table_items=[];
		// alert('checkpoint 1')
		var _login=Ti.App.Properties.getString('cloud_useremail','viewer.defaultui@fuihan.com')
		var _passwd=Ti.App.Properties.getString('cloud_userpassword','viewerInPub')		
		
		if (Ti.Platform.osname=='mobileweb'){
			var tempappid=Ti.Utils.base64decode(Ti.App.Properties.getString('viewerid','')).toString();
			_login='viewer.'+tempappid.toString().substr(9,200)
			_passwd='viewerInPub'
		}
		
		var Cloud = require('ti.cloud'); 
		Cloud.Users.login({
		    login: _login,
		    password: _passwd,
		}, function (e) {
			if (e.success) {
				// alert('checkpoint 2')
				Ti.API.info('win_root_id:'+acs_win_id)
				Cloud.Objects.query({
				    classname: 'windows',
				    page: 1,
				    per_page: 30,
				    order:'table_id',
				    where: {
				        win_root_id:acs_win_id,
				        user_id:e.users[0].custom_fields['content_user_id']
				        // win_root_id:acs_table_root_id
				    }
				}, function (e) {
					if (e.success) {
						// alert('checkpoint 3')
						Ti.API.info('length:'+e.windows.length)
						var tableitem;
						for (var j=0;j<e.windows.length;j++){
							// alert('checkpoint 5:'+e.windows[j].win_title+'/'+e.windows[j].win_type)
							tableitem=e.windows[j];
							var win_parameters=[]
							if (tableitem.win_type=='TYPE_TABLE'){
								// alert('checkpoint 4')
								
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
								// alert(win_parameters)	
														
							} else {
								win_parameters=tableitem.win_parameters
							}
							
							table_items[j] = Ti.UI.createTableViewRow({
								hasDetail:true,
								title:tableitem.win_title,
								targetWindow:tableitem.win_type,
								targetWindowParameters:win_parameters,
								targetWindowId:tableitem.id
							});
							
							if (tableitem.win_type=='TYPE_TABLE'){
								// alert('checkpoint 4')
								table_items[j].hasDetail=false;
								table_items[j].hasChild=true;						
							}							
						}
						tableview.data=table_items		
					} else {
				        alert('Error:\\n' +
				            ((e.error && e.message) || JSON.stringify(e)));
					}
				})			
		    } else {
		        alert('Error:\\n' +
		            ((e.error && e.message) || JSON.stringify(e)));
			}
		});	
			
	})
	
	if (tabbed_window && show_navbar) {
		win.navBarHidden = false;
	} else {
		win.navBarHidden = true;
	}
	
	return win
};

module.exports = TableViewWindow;
