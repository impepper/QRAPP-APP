function QRHistoryWindow(title) {

//*****************************************
	var win = Ti.UI.createWindow({
		title:'QRCode Scanner',
		barColor:'#222',
		// navBarHidden:true,
		//title:'QR Code Login',
		backgroundColor:'black'
	});
	
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
	var svLib=Ti.UI.createScrollView({
		    contentWidth:'auto',
		    contentHeight:'auto',
		    top:0,
		    showVerticalScrollIndicator:true,
			bottom:0
		})
	win.add(svLib);
	
	var viewListItem=[]
	var imgListItem=[]
	var posCol=20
	var posRow=0
	var selectedSY=null
	var prevSelectedIndex=null
			
    var imgDataDir = Ti.Filesystem.getApplicationDataDirectory()+ Ti.Filesystem.separator + 'QRImages'+ Ti.Filesystem.separator;
    var dir = Titanium.Filesystem.getFile(imgDataDir);
    var dir_files = dir.getDirectoryListing();
           		
	// winExistSY.svFileList=Ti.Filesystem.getFile(Ti.Filesystem.getApplicationDirectory()).getDirectoryListing();

	if (dir_files != null){
		for (var i=0;i<dir_files.length;i++){
			Ti.API.info('FileList item:'+imgDataDir+dir_files[i].toString()+ 'Last: '+dir_files[i].toString().substr(-4))
			if (dir_files[i].toString().substr(-4)=='.jpg'){

				viewListItem[i]=Ti.UI.createImageView({
					image:'images/frame_single.png',
					width:135,
					height:165,
					top:posRow,
					left:posCol,
					custom_text:dir_files[i].toString(),
					custom_index:i
				})
				
				// viewListItem[i].addEventListener('dblclick',function(e){
					// btnConfirm.fireEvent('click')
				// })
				
				imgListItem[i]=Ti.UI.createImageView({
					top:49,
					left:26,
					height:75,
					width:75,
					image:imgDataDir+dir_files[i].toString(),
					backgroundColor:'#000',
					borderColor:'red',
					borderWidth:0,
					custom_text:dir_files[i].toString(),
					custom_index:i,
					ready4delete:false					
				})
				
				imgListItem[i].addEventListener('click',function(e){
					Ti.API.info('custom_index:'+e.source.custom_index)
					if (imgListItem[e.source.custom_index].ready4delete != true){
						selectedSY=e.source.custom_text
						Ti.API.info('custom_text:'+e.source.custom_text)
						if (imgListItem[e.source.custom_index].borderWidth>0) {
							imgListItem[e.source.custom_index].borderWidth=0
							prevSelectedIndex = null
						} else {
							imgListItem[e.source.custom_index].borderWidth=3
							if (prevSelectedIndex != null){
								imgListItem[prevSelectedIndex].borderWidth=0
							}
							prevSelectedIndex = e.source.custom_index
						}
						
						if (prevSelectedIndex != null){
							//start to open win showing Qr Links
							Ti.API.info('Selected QR Filename:'+e.source.custom_text)
							var qr_link=getQRLink(e.source.custom_text);
							deleteQR();
							show_links(qr_link)
	
						}							
					}
				})
					
				imgListItem[i].addEventListener('longpress',function(e){
					Ti.API.info('custom_index:'+e.source.custom_index)
					imgListItem[e.source.custom_index].borderWidth=0
					var dlgDelete=Ti.UI.createOptionDialog({
					    title: L('_Delete'),
					    options: [L('Yes'),L('No')]
					})
					dlgDelete.addEventListener('click',function(dlg){
						Ti.API.info('Selected Option index:'+dlg.index)
						if (dlg.index==0) {
							Ti.API.info('custom_index:'+e.source.custom_index)
							imgListItem[e.source.custom_index].opacity=0.5
							imgListItem[e.source.custom_index].ready4delete=true
						} else {
							imgListItem[e.source.custom_index].opacity=1
							imgListItem[e.source.custom_index].ready4delete=false
						}
					})
					dlgDelete.show()
				})
				
				viewListItem[i].add(imgListItem[i]);
				svLib.add(viewListItem[i]);
				posCol += 155
				if (posCol>200){
					posRow +=152
					posCol = 20
				}
			}
		}			
	};
//*****************************************

	win.addEventListener('blur',function(){
		deleteQR();
		// if (Ti.Platform.osname=='android'){
			// win.open();
		// } else {
			// Titanium.UI.iPhone.hideStatusBar();
			// win.open({transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT});
		// }			
	})


	
	
	return win;
};

module.exports = QRHistoryWindow;
