function QRGeneratorWindow(title) {
	Ti.include('/jslib/fnc_string.js');
	Ti.include('/jslib/fnc_file.js');
	Ti.include('/stylelib/style_01.js');
	
	var qr_text='';
	// var qrreader = undefined;
	// var qrCodeWindow = undefined;
	// var qrCodeView = undefined;

	// var base_logohtml=(Ti.Platform.osname == 'android')?'http://mcms.fuihan.com/mobileWeb/default.html':Ti.Filesystem.resourcesDirectory+'default.html'
	var base_logohtml='<html><head><title>QR Generator</title></head><body backgroundColor="#222"></body></html>'
	var scanned=false;
	
	var win = Ti.UI.createWindow({
		titleid:'_QRGENERATOR',
		backgroundColor:stytle_winBGColor,
		barColor:stytle_winBarColor,	
		// navBarHidden:true,
		//title:'QR Code Login',
		orientationModes:[Ti.UI.PORTRAIT]
	});
	
	// win.navBarHidden=(Ti.Platform.osname === 'android')?true:false;
	
	var view_url=Ti.UI.createWebView({
		height:200,
		width:160,
		bottom:0,
		backgroundColor:'#ccc',
		touchEnabled:false,
		visible:false

	});
	
	if (Ti.Platform.name == 'android'){
		base_logohtml='<html><head><title>QR Generator</title></head><body backgroundColor="#222"></body></html>'
		view_url.html = base_logohtml
	} else {
		view_url.url = ''
	}
	
	win.add(view_url);

	var qr_text = Ti.UI.createTextArea({
	
	// var qr_text= Ti.UI.Ti.UI.createTextField({
		// borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,	
		top:15,
		bottom:275,
		backgroundColor:'#aaa',
		left:15,
		right:15
	});
	
	if (Ti.Platform.name=='iPhone OS'){
		qr_text.hintText='Please Enter your Text Here...'
		qr_text.borderColor='#111'
		qr_text.borderRadius=5
		qr_text.autoLink=false
		qr_text.font={fontSize:20}
	}
	// qr_textarea.addEventListener('change',function(e){
		// qr_text=e.source.value;
	// })
	
	win.add(qr_text);
	
	var btn_qr_generate = Ti.UI.createButton({
		backgroundImage:'/images/generate_qr.png',
		// title:'Generate QR',
		bottom:210,
		width:131,
		height:50,
		// left:30,
		// right:30,
		color:'#369',
	})

	btn_qr_generate.addEventListener('click',function(){
		qr_text.blur();
		var jsLibfiles=['jquery.min.lib','jquery.qrcode.lib','qrcode.lib'];
		for (var j=0;j<jsLibfiles.length; j++){
			var oriLibPath = Ti.Filesystem.getResourcesDirectory()
			var fromFile = Ti.Filesystem.getFile(oriLibPath+ jsLibfiles[j] );
			var savedfilename=saveFile({
									file:fromFile.read(),
									filename:jsLibfiles[j]
								})
		}

		var html_text= '<html><head><title>QR Generator</title></head><body backgroundColor="#222">'+
							'<script src="jquery.min.lib"></script>'+
							'<script type="text/javascript" src="jquery.qrcode.lib"></script>'+
							'<script type="text/javascript" src="qrcode.lib"></script>'+
							'<div id="qr"></div><script>'+
							'jQuery("#qr").qrcode({width:150,height:150,text:"'+
							qr_text.value+
							'"});</script></body></html>';
							
		var localQRFile=saveFile({
			file:html_text,
			filename:'tempQR.html'
		})
		view_url.visible = false
		setTimeout(function(){
			view_url.url = localQRFile			
			view_url.reload();
			view_url.visible = true		
		},500)
		
		view_url.touchEnabled = true;
		
				
		if (Ti.Platform.name == 'iPhone OS'){
			//getting Social sharong buttons
			var ui_btnSocial = require('jslib/ui_btnSocial');
			navbtn_social = new ui_btnSocial(win,'common',qr_text.value);
			win.setRightNavButton(navbtn_social);	
			view_url.addEventListener('click',function(){
				navbtn_social.fireEvent('click')
			})						
		} else {
			//create menu
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
					dialog.buttonNames = [ L('_CANCEL','Cancel')];
					dialog.addEventListener('click',function(e)
					{
						if (!e.button){
							// alert('Selected:'+optionsDialogOpts.options[e.index])
							var applink='http://code.qrapp.com.tw/content_link/'+Ti.Utils.base64encode(qr_text.value)
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

		}
	})
	win.add(btn_qr_generate);

	return win;
};

module.exports = QRGeneratorWindow;
