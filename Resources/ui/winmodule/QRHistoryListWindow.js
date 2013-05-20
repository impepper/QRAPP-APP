function QRHistoryListWindow(_root_win,title) {

//*****************************************
	Ti.include('/jslib/fnc_db.js');
	Ti.include('/stylelib/style_01.js');
	var win = Ti.UI.createWindow({
		titleid:'_SACNHIS',
		barColor:stytle_winBarColor,
		orientationModes:[Ti.UI.PORTRAIT],
		// navBarHidden:true,
		backgroundColor:stytle_winBGColor	
	});
	// alert('Start')
	function deleteQR(){
		for (var i=0;i<imgListItem.length;i++){
			// Ti.API.info('FileList item:'+imgDataDir+imgListItem[i].custom_text)
			if (imgListItem[i] != undefined){
				if (imgListItem[i].ready4delete) {
			        var imgDataDir = Ti.Filesystem.getApplicationDataDirectory()+ Ti.Filesystem.separator + 'QRImages'+ Ti.Filesystem.separator;
			        var file = Titanium.Filesystem.getFile(imgDataDir+imgListItem[i].custom_text);
			        if (file.exists()){
			        	file.deleteFile()
			        }					
				}
			}
		}		
	}

	var table_items=[];
	var viewListItem=[]
	var imgListItem=[]
	var posCol=20
	var posRow=0
	var selectedSY=null
	var prevSelectedIndex=null
		
    var imgDataDir = Ti.Filesystem.getApplicationDataDirectory()+ Ti.Filesystem.separator + 'QRImages'+ Ti.Filesystem.separator;
    var dir = Titanium.Filesystem.getFile(imgDataDir);
    var dir_files = dir.getDirectoryListing();
	var tableview = Ti.UI.createTableView({
			backgroundColor:stytle_tableBGColor,		
		});
	if ((stytle_rowBGImage != 'Null') && (stytle_rowBGImage != '')){
		tableview.setBackgroundImage(stytle_rowBGImage);
	}
	
	// create table view event listener
	tableview.addEventListener('click', function(e) {
		
		win.fireEvent('showHistoryLink',{
			targetType:e.rowData.targetType,
			targetTitle:e.rowData.targetTitle,
			targetLink:e.rowData.targetLink,
			targetCloudId:e.rowData.targetCloudId,
			targetCloudMail:e.rowData.targetCloudMail});
	});

	function getQRList(QRListView){
		//get last 20 items
		
		var db_QR = Titanium.Database.open(db_QR_name);	
		// Ti.API.info('QRFILENAME:',QR_filename)
		var rows = db_QR.execute('SELECT * FROM QRHISTORY ORDER BY QRFILENAME DESC LIMIT 20;');
		// Titanium.API.info('Price Data COUNT = ' + rows.getRowCount());
		var qr_dbitem=0
	
		while (rows.isValidRow()){
			var row_thumbnails ='',
				row_targetType='',
				row_targetTitle='',
				row_targetCloudId='',
				row_targetCloudMail='';
							
			switch (rows.fieldByName('TYPE')){
				//Delaing with web Links
				case 'mCMS':
					row_thumbnails ='qr_web.png'
					row_targetType='TYPE_APPLIST'
					row_targetTitle=rows.fieldByName('DESC')
					row_targetCloudId=rows.fieldByName('CLOUDID')
					row_targetCloudMail=rows.fieldByName('CLOUDMAIL')
					break;
				case 'WEB':
					row_thumbnails ='qr_web.png'
					row_targetType='TYPE_QR_WEBPAGE'
					row_targetTitle='Web Page'
					break;
				//dealing with VCARD format				
				case 'vCard':
					row_thumbnails ='qr_contact.png'
					row_targetType='TYPE_QR_VCARD'
					row_targetTitle='vCard Contact'
					break;
				case 'Phone':
					row_thumbnails ='qr_phone.png'
					row_targetType='TYPE_QR_PHONE'
					row_targetTitle='Phone Number'
					break;
				case 'Text':
					row_thumbnails ='qr_text.png'
					row_targetType='TYPE_QR_TEXT'
					row_targetTitle='Text'
					break;					
				default:
					row_thumbnails ='qr_web.png'
					row_targetType='TYPE_QR_WEBPAGE'
					row_targetTitle='Web Page'			
			}
			
			
			var row = Ti.UI.createTableViewRow({
				height:55,
				targetLink:rows.fieldByName('URL'),
				targetType:row_targetType,
				targetTitle:row_targetTitle,
				targetCloudId:row_targetCloudId,
				targetCloudMail:row_targetCloudMail,
				// backgroundColor :'transparent'
				backgroundColor : stytle_rowBGColor			
			});

			var img = Ti.UI.createImageView({		
				image:'/images/'+row_thumbnails,
				left:5,
				height:45,
				width:45
			});
			
			row.add(img);					
			
			var content_left_margin=52
				
			var title = rows.fieldByName('URL');
			// if (rows.fieldByName('TYPE')=='vCard'){title = 'Contact Info'}
			if (rows.fieldByName('TYPE')=='vCard'){title = 'Contact : '+rows.fieldByName('DESC')}
			if (rows.fieldByName('TYPE')=='mCMS'){title = rows.fieldByName('DESC')}
	
			var label_title = Ti.UI.createLabel({
				text:title,
				left:content_left_margin+5,
				top:5,
				height:45,
				wordWrap:true,
				right:5,
				font:{fontFamily:'Helvetica Neue',fontWeight:'bold',fontSize:16},
				external_link:title,
				color:style_fontcolor			
			});
			// label_title.color = style_fontcolor
			row.add(label_title);					
			table_items[qr_dbitem++] = row;			
			rows.next();		
		}
		
		db_QR.close();
		QRListView.data=table_items
	}
	
	win.add(tableview);
	
	win.addEventListener('open',function(){
		getQRList(tableview)	
	})
	
	win.addEventListener('focus',function(){
		getQRList(tableview)
	})
	
	
	
	return win;
};

module.exports = QRHistoryListWindow;
