var db_QR_name='qr_his';

function dbInitialize(){
	var db_QR = Titanium.Database.open(db_QR_name);	
	db_QR.execute('CREATE TABLE IF NOT EXISTS QRHISTORY (QRFILENAME TEXT, TYPE TEXT , URL TEXT , DESC TEXT,CLOUDID TEXT,CLOUDMAIL TEXT);');
	db_QR.execute('CREATE UNIQUE INDEX IF NOT EXISTS URL ON QRHISTORY(URL);');
	db_QR.execute('CREATE UNIQUE INDEX IF NOT EXISTS QRFILENAME ON QRHISTORY(QRFILENAME ASC);');
	
	db_QR.close();	
};

// get QR Hist Descriptions
function getQRDesc(QR_filename){

	var db_QR = Titanium.Database.open(db_QR_name);	
	var rows = db_QR.execute('SELECT * FROM QRHISTORY WHERE (QRFILENAME = ?) QRDERED BY QRFILENAME DESC;',QR_filename);
	Titanium.API.info('Price Data COUNT = ' + rows.getRowCount());
	var QR_Desc='';
	if (rows.isValidRow()){
		Titanium.API.info('QR_filename: ' + rows.fieldByName('QRFILENAME') + ' URL: ' + rows.fieldByName('URL') + ' DESC: '+ rows.fieldByName('DESC') ) ;		
		QR_Desc=rows.fieldByName('DESC');
	} else {
		//alert(L('_NoPrice'));
		QR_Desc='';
	};
	
	db_QR.close();
	
	return QR_Desc
}

// get QR Hist Links
function getQRLink(QR_filename){

	var db_QR = Titanium.Database.open(db_QR_name);	
	Ti.API.info('QRFILENAME:',QR_filename)
	var rows = db_QR.execute('SELECT * FROM QRHISTORY WHERE (QRFILENAME = ?);',QR_filename);
	// Titanium.API.info('Price Data COUNT = ' + rows.getRowCount());
	var QR_Link=''
	if (rows.isValidRow()){
		Titanium.API.info('QR_filename: ' + rows.fieldByName('QRFILENAME') + ' URL: ' + rows.fieldByName('URL') + ' DESC: '+ rows.fieldByName('DESC') ) ;		
		QR_Link=[rows.fieldByName('TYPE'),rows.fieldByName('URL')]
	} else {
		//alert(L('_NoPrice'));
		QR_Link=['',''];
	};
	
	db_QR.close();
	
	return QR_Link;	
}

// get QR Hist Descriptions
function buildQRDesc(QR_filename,QR_type,QR_link,QR_desc){
	var db_QR = Titanium.Database.open(db_QR_name);	
	if (QR_desc == undefined) {
		QR_desc = ''; 
	}
	rows = db_QR.execute('INSERT OR IGNORE INTO QRHISTORY (QRFILENAME,TYPE,URL,DESC) VALUES(?,?,?,?);',QR_filename,QR_type,QR_link,QR_desc);	
	db_QR.close();	
}

	function showIndicator(indMsg){
		if (Ti.Platform.osname != 'android'){
			// window container
			indWin = Titanium.UI.createWindow({
				height:150,
				width:200,
				left:60
			});
	
			// black view
			var indView = Titanium.UI.createView({
				height:150,
				width:200,
				backgroundColor:'#000',
				borderRadius:10,
				opacity:0.6
			});
			indWin.add(indView);
		}
	
		// loading indicator
		actInd = Titanium.UI.createActivityIndicator({
			style:Titanium.UI.iPhone.ActivityIndicatorStyle.BIG,
			height:50,
			width:50
		});
	
		if (Ti.Platform.osname != 'android'){
			indWin.add(actInd);
			// message
			var message = Titanium.UI.createLabel({
				text:indMsg,
				color:'#fff',
				width:'auto',
				height:'auto',
				font:{fontSize:20,fontWeight:'bold'},
				bottom:20
			});
			indWin.add(message);
			indWin.open();
		} else {
			actInd.message = indMsg;
		}
		actInd.show();
	
	}
	
	function hideIndicator(){
		actInd.hide()
		if (Ti.Platform.osname != 'android') {
			indWin.close({opacity:0,duration:500});
		}
	}
	
function show_links(url_Link){
						
	//prepare fo rnew link window
	var win_link=Ti.UI.createWindow({
		title: 'QR Contents',
		barColor:'#222',
		backgroundColor:'#333',
		navBarHidden:false
	})
	
	win_link.navBarHidden=(Ti.Platform.osname === 'android')?true:false;
	
	var btn_closeWinLink= Ti.UI.createButton({
		title:'close'
	});
	btn_closeWinLink.addEventListener('click',function(){
		// win.open({transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT});
		win_link.close()
	})
	win_link.leftNavButton = btn_closeWinLink
	
	var webview_link= Ti.UI.createWebView({
		url:url_Link
	}) 
	webview_link.addEventListener('load',function(){
		hideIndicator()
	})
	win_link.add(webview_link)

	var flexSpace = Titanium.UI.createButton({
		systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	});
	
	var bb_back = Titanium.UI.createButton({
		image:'images/toolbar_leftarrow.png'
	});
	bb_back.addEventListener('click',function(){
		webview_link.goBack();
	})
	
	var bb_forward = Titanium.UI.createButton({
		image:'images/toolbar_rightarrow.png'
	});
	
	bb_forward.addEventListener('click',function(){
		webview_link.goForward();
	})
	var bb_reload = Titanium.UI.createButton({
		image:'images/toolbar_refresh.png'
	});
	
	bb_reload.addEventListener('click',function(){
		webview_link.reload();
	})
	win_link.setToolbar([flexSpace,bb_back,flexSpace,bb_reload,flexSpace,bb_forward,flexSpace]);
	
	// webview.addEventListener('load',function(e)
	// {
		// Ti.API.debug("url = "+webview.url);
		// Ti.API.debug("event url = "+e.url);
	// });

	showIndicator('Loading...')
	
	//OS specific 						
	if (Ti.Platform.osname=='android'){
		win_link.open({transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT});
	} else {
		// win_link.open({transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT});
		win_link.open({modal:true});
	}		
}

function listLinks(){
	var db_QR = Titanium.Database.open(db_QR_name);	
	Ti.API.info('QRFILENAME:',QR_filename)
	var rows = db_QR.execute('SELECT * FROM QRHISTORY WHERE (QRFILENAME = ?);',QR_filename);
	// Titanium.API.info('Price Data COUNT = ' + rows.getRowCount());
	var QR_Link=''
	if (rows.isValidRow()){
		Titanium.API.info('QR_filename: ' + rows.fieldByName('QRFILENAME') + ' URL: ' + rows.fieldByName('URL') + ' DESC: '+ rows.fieldByName('DESC') ) ;		
		QR_Link=[rows.fieldByName('TYPE'),rows.fieldByName('URL')]
	} else {
		//alert(L('_NoPrice'));
		QR_Link=['',''];
	};
	
	db_QR.close();
	
	return QR_Link;		
}

function QRDescUpdate(url,desc,cloudUserId,cloudeUserMail){
	var db_QR = Titanium.Database.open(db_QR_name);	
	if (desc == undefined) {
		desc = ''; 
	}
	var rows = db_QR.execute('UPDATE QRHISTORY SET DESC="'+desc+'", CLOUDID="'+cloudUserId+'", CLOUDMAIL="'+cloudeUserMail+'" WHERE URL LIKE "%'+url+'%" ;');
	db_QR.close();		
}
