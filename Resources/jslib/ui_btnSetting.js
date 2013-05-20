function ui_btnSetting(_root_win) {
	function act_close_menuWin(){
		var t = Titanium.UI.create2DMatrix();
		t= t.rotate(90);
		if (visible){
			menuWin.animate({transform:t,opacity:0,duration:800}, function()
			{
				menuWin.close();
			});
			visible=false;				
		}
	
	}
	
	// function showRequestResult(e) {
		// var s = '';
		// if (e.success) {
			// s = "Post Successfully processed";
		// } else if (e.cancelled) {
			// s = "Post Cancelled";
		// } else {
			// s = "Posting Failed";
			// if (e.error) {
				// s += "; " + e.error;
			// }
		// }
		// alert(s);
// 		
		// act_close_menuWin()
	// }
	
	// function fnc_switch_mCMS_transform(method){
		// if (method){
// 
		// } else {
// 						
		// }
// 
	// }	

	var t = Titanium.UI.create2DMatrix();
	t= t.rotate(90);
	var menuWin = Titanium.UI.createWindow({
		backgroundImage:'images/menubox_2.png',
		height:100,
		width:204,
		top:32,
		left:40,
		anchorPoint:{x:0,y:0},
		transform:t,
		opacity:0
	});
	
	var sw_value=(Ti.App.Properties.getString('loading_method','TAB')=='TAB')?true:false
	var sw=Ti.UI.createSwitch({top:52,right:15,value:sw_value});
	sw.addEventListener('change',function(e){
		if (e.value) {
			Ti.App.Properties.setString('loading_method','TAB')

	        if (Ti.App.Properties.getBool('cloud_Logged',true)){
	        	Ti.App.Properties.setBool('auto_login',true)
	        }
	        
		} else {
			// alert('switch to False')
			Ti.App.Properties.setString('loading_method','LIST')
			if (Ti.App.Properties.getBool('cloud_Logged',true)){
			// if (true){
	        	// cloud_resetUser()
	        	// alert('checkpoint 0')
	        	btn_Set2Default.fireEvent('click')	
	        	// _root_win.fireEvent('ResetRootTabs')       		        	
	       } else {
	       		// alert('checkpoint -1')	
	       }
	        
		}
		
		act_close_menuWin()
	})
	
	menuWin.add(sw)
	
	var lbl_setting_fullwindow = Ti.UI.createLabel({
		textid:'_SHOWFULLSCREEN',
		wordWrap:true,
		top:30,
		left:30,
		width:130,
		font:{fontSize:14},
		color:'#fff'
	})

	menuWin.add(lbl_setting_fullwindow)
	
	var btn_Set2Default = Ti.UI.createButton({
		titleid:'_RESETTODEFAULT',
		height:30,
		left:15,
		right:15,
		bottom:25,
		visible:false
	})
	btn_Set2Default.addEventListener('click',function(){
		// alert('reset')
		act_close_menuWin()
		// Ti.App.Properties.setBool('cloud_Logged',false)
		// Ti.App.Properties.setBool('auto_login',false)
		_root_win.fireEvent('ResetRootTabs') 
		
	})
	menuWin.add(btn_Set2Default)
	
	var t2 = Titanium.UI.create2DMatrix();	
	
	var ui_setting_btn = Titanium.UI.createButton({
		image:'/images/gear2blue.png',
		height:15,
		width:15
	});
	
	var visible = false;
	
	ui_setting_btn.addEventListener('click', function(){
		if (!visible)
		{
			// realtime modification for tabbing environment

			if (Ti.App.Properties.getBool('cloud_Logged',false)
				&& (Ti.App.Properties.getString('loading_method','TAB')=='TAB')){
			 	
			 	menuWin.backgroundImage='/images/menubox_2_2.png'
				menuWin.height=150;
				btn_Set2Default.show()	 
			} else {
			 	// if (menuWin.backgroundImage=='/images/menubox_2_2.png'){
			 		menuWin.backgroundImage='/images/menubox_2.png'
			 		menuWin.height=100;
			 		btn_Set2Default.hide()
			 	// }	
			}
						
			menuWin.open();
			menuWin.animate({transform:t2,opacity:1,duration:800});
			visible=true;
			// _root_win.addEventListener('close', function() {
				// menuWin.close();
			// });
		}
		else
		{
			var t = Titanium.UI.create2DMatrix();
			t= t.rotate(90);
			menuWin.animate({transform:t,opacity:0,duration:800}, function()
			{
				menuWin.close();
			});
			visible=false;
		}
	});	
		
	return ui_setting_btn;

};

module.exports = ui_btnSetting;	