function QRAccountWindow(title) {
	var qr_text='';
	var qrreader = undefined;
	var qrCodeWindow = undefined;
	var qrCodeView = undefined;
	// var base_logohtml=(Ti.Platform.osname == 'android')?'http://mcms.fuihan.com/mobileWeb/default.html':Ti.Filesystem.resourcesDirectory+'default.html'
	var base_logohtml=''
	// var base_logohtml=Ti.Filesystem.resourcesDirectory+'default.html'
	var scanned=false;
	Ti.include('fnc_string.js');

	var win = Ti.UI.createWindow({
		title:'QRCode Generator',
		barColor:'#222',
		// navBarHidden:true,
		//title:'QR Code Login',
		backgroundColor:'fff'
	});
	
	win.navBarHidden=(Ti.Platform.osname === 'android')?true:false;
	
	var view_url=Ti.UI.createWebView({
		top:200,
		bottom:0,
		backgroundColor:'#fff',
		url:base_logohtml,
		// scalesPageToFit:true
		// backgroundImage:Ti.Filesystem.resourcesDirectory+'default_app_logo.png'
	});
	
	if (Ti.Platform.osname == 'android'){
		view_url.addEventListener('click',function(){
			win.fireEvent('scan')
		})
	}
	
	win.add(view_url);

	var qr_text = Ti.UI.createTextArea({
	
	// var qr_text= Ti.UI.Ti.UI.createTextField({
		// borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,	
		top:25,
		height:70,
		backgroundColor:'#fff',
		hintTex:'Please Enter your Text Here...',
		left:30,
		right:30,
		borderColor:'#111',
		borderRadius:10,
		autoLink:false,
		font:{fontSize:22}
	});
	// qr_textarea.addEventListener('change',function(e){
		// qr_text=e.source.value;
	// })
	
	win.add(qr_text);
	
	var btn_qr_generate = Ti.UI.createButton({
		title:'Generate QR',
		top:120,
		height:50,
		left:30,
		right:30,
		color:'#369'
	})
	btn_qr_generate.addEventListener('click',function(){
		qr_text.blur();
		var jsLibfiles=['jquery.min.lib','jquery.qrcode.lib','qrcode.lib'];
		
		for (var j=0;j<jsLibfiles.length; j++){
			var fromFile = Ti.Filesystem.getFile(Ti.Filesystem.getResourcesDirectory()+ jsLibfiles[j] );
			var toFile = Ti.Filesystem.getFile(Ti.Filesystem.getApplicationDataDirectory()+'QR/' + jsLibfiles[j] );
			if ( fromFile.exists() && (!toFile.exists()) ) {
			    toFile.write( fromFile.read() );
			    // Ti.API.info('copy files:'+jsLibfiles[j])
			}
		}
		Ti.API.info('Text :' + qr_text.value)
		var html_text= '<html><head><title>QR Generator</title></head><body>'+
							'<script src="jquery.min.lib"></script>'+
							'<script type="text/javascript" src="jquery.qrcode.lib"></script>'+
							'<script type="text/javascript" src="qrcode.lib"></script>'+
							'<center><div id="qr"></div></center><script>'+
							'jQuery("#qr").qrcode({width:150,height:150,text:"'+
							qr_text.value+
							'"});</script></body></html>';
		Ti.API.info('Path: ' +Ti.Filesystem.getApplicationDataDirectory()+'QR/tempQR.html')					
		var f = Ti.Filesystem.getFile(Ti.Filesystem.getApplicationDataDirectory()+'QR/tempQR.html');
		f.write(html_text);
		view_url.url = Ti.Filesystem.getApplicationDataDirectory()+'QR/tempQR.html'				
		view_url.reload();
	})
	win.add(btn_qr_generate);

	
	return win;
};

module.exports = QRAccountWindow;
