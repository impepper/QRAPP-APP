function ui_btnHistory(_root_win) {
	Ti.include('/jslib/fnc_cloud.js');
	var ui_history_btn = Titanium.UI.createButton({
		titleid:'_HISTORY'
	});
	var visible=false;
	
	ui_history_btn.addEventListener('click', function(){
			var WindowRouter = require('ui/winmodule/WindowRouter');
    		var win_history = new WindowRouter('TYPE_QRHISTORYLIST',[true,true,L('_SCANHIS','Scanned History')],'',_root_win)			
			// var tabbed_tab3 = Ti.UI.createTab({
				// title: 'History',
				// icon: '/icons/counter.png',
				// window_type:'TYPE_QRHISTORYLIST',
				// window: tabbed_win3
			// });
			win_history.containingTab = _root_win.containingTab
			win_history.addEventListener('showHistoryLink',function(data){
				// alert('Data:'+data.targetType)
				if (data.targetType == 'TYPE_APPLIST'){
					// alert('Trigged')
					if (Ti.App.Properties.getString('loading_method','TAB')=='TAB'){
						cloud_setUser(false,true,data.targetCloudId,'viewer.'+data.targetCloudMail)
						_root_win.fireEvent('ReloadTabs')
						
					} else {
						// cloud_setUser(true,false,data.targetCloudId,'viewers.'+data.targetCloudMail)
						// cloud_setUser(false,false,data.targetCloudId,'viewers.'+data.targetCloudMail)

				        cloud_setUser(false,false,data.targetCloudId,'viewer.'+data.targetCloudMail)
				        // alert('ID:'+data.targetCloudId+'/Email:'+data.targetCloudMail)						
						var ApplicationListGroup = require('ui/common/ApplicationListGroup');
						
						app_list_win = new ApplicationListGroup(win_history,true,true,data.targetTitle,'');
						// alert('List Win Created')
						win_history.containingTab.open(app_list_win)
											
					}

				} else {
					_root_win.fireEvent('ShowQRWin',{
						qrwin_type:data.targetType,
						qrwin_title:data.targetTitle,
						qrwin_content:data.targetLink
					});	
				// if (Ti.App.Properties.getString('loading_method','TAB')=='TAB'){
// 						
					// // var WindowRouter = require('ui/winmodule/WindowRouter');
					// // // alert('Item Clicked:'+e.rowData.targetWindow+'  /  '+e.rowData.targetWindowId)
					// // var routedWindow = new WindowRouter(data.targetType,[data.targetTitle,data.targetLink],'','');		
					// // var b = Titanium.UI.createButton({
						// // title:'Close',
						// // style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
					// // });
					// // routedWindow.setLeftNavButton(b);
					// // b.addEventListener('click',function(){
						// // routedWindow.close();
					// // });		
					// // routedWindow.open({modal:true});	
// 						
				// } else {
					// var WindowRouter = require('ui/winmodule/WindowRouter');
					// // alert('Item Clicked:'+e.rowData.targetWindow+'  /  '+e.rowData.targetWindowId)
					// var routedWindow = new WindowRouter(data.targetType,[data.targetTitle,data.targetLink],'','');		
					// routedWindow.containingTab=win_history.containingTab;		
					// win_history.containingTab.open(routedWindow);							
				// }
				}
			
			})
		_root_win.containingTab.open(win_history)
					
		// if (!visible)
		// {
			// menuWin.open();
			// menuWin.animate({transform:t2,opacity:1,duration:800});
			// visible=true;
			// _root_win.addEventListener('close', function() {
				// menuWin.close();
			// });
		// }
		// else
		// {
			// var t = Titanium.UI.create2DMatrix();
			// t= t.rotate(90);
			// menuWin.animate({transform:t,opacity:0,duration:800}, function()
			// {
				// menuWin.close();
			// });
			// visible=false;
		// }
	});	
		
	return ui_history_btn;

};

module.exports = ui_btnHistory;	