function ChatWindow(tabbed_window,show_navbar,title,name){
	var cdk = require('com.infinery.cdk');
	var dynapp;
	var cloudebug;
	var cloudefire;
	var cloudecache;
	
	if (Ti.Platform.osname == 'android')
	{
	 dynapp = cdk.dynapp;
	 cloudebug = cdk.cloudebug;
	 cloudefire = cdk.cloudefire;
	 cloudecache = cdk.cloudecache;
	}
	else
	{
	 dynapp = cdk;
	 cloudebug = cdk;
	 cloudefire = cdk;
	 cloudecache = cdk;
	}		
	
	var pos_msgbox=10;
	var clt = cdk.create('b9251ccb-b522-4457-9519-5e699d9d27e8');
	// var clt = cdk.createCloufire('b9251ccb-b522-4457-9519-5e699d9d27e8'); 
	clt.register({
	 
	 	connected: function(e) {
			clt.write('info', 'connected from Taipei');
	
			clt.addEventListener('update','apple', { secure: false }, function(e) {
				// var jsondata = JSON.parse(e, function (key, value) { 
						// // var a; 
						// // if (typeof value === 'string') { 
							// // a = /^(\\d{4})-(\\d{2})-(\\d{2})T(\\d{2}):(\\d{2}):(\\d{2}(?:\\.\\d*)?)Z$/.exec(value);
							// // if (a) { 
								// // return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]));
							// // }
						// // } 
						// return value; })
				// var jsondata = eval('('+e+')')
				var jsondata = JSON.stringify(e)
				// var jsondata = e 
			
				alert('updates are available: ' + jsondata);
				// alert('updates are available: ' + e);
				// var msgbox = Ti.UI.createTextArea({
					// backgroundColor:'#357',
					// text:JSON.stringify(e),
					// top:pos_msgbox+10,
					// source:Ti.Platform.macaddress
				// })
				// msgbox.addEventListener('click',function(e){
					// //alert('Clicked Item:'+e.src)
				// })
// 				
				// // msgbox.height=((e.length)/10).round()*15
				// // pos_msgbox += msgbox.height
				// chat_listview.add(msgbox);
				textArea.recieveMessage(jsondata);
	 		});
		}
	});
		
	var SMSView = require('ti.smsview');
	
	var buttonBar = Ti.UI.createButtonBar({
		labels:['Recieve','Empty','Get All','Disable','Enable'],
		height:30,
		style:Ti.UI.iPhone.SystemButtonStyle.BAR
	});
	
	var headerView = Ti.UI.createView();
	
	headerView.add(buttonBar);
	
	var win = Ti.UI.createWindow({
		// titleControl:buttonBar,
		orientationModes:[1,2,3,4]
		// tabBarHidden:true
	});
	
	var textArea = SMSView.createView({
		//maxLines:6,				// <--- Defaults to 4
		//minLines:2,				// <--- Defaults to 1
		backgroundColor: '#dae1eb',	// <--- Defaults to #dae1eb
		//assets: 'assets',			// <--- Defauls to nothing, smsview.bundle can be placed in the Resources dir
		// sendColor: 'Green',		// <--- Defaults to "Green"
		// recieveColor: 'White',	// <--- Defaults to "White"
		// selectedColor: 'Blue',	// <--- Defaults to "Blue"
		// editable: true,			// <--- Defautls to true, do no change it
		// animated: false,			// <--- Defaults to true
		// buttonTitle: 'Something',	// <--- Defaults to "Send"
		// font: { fontSize: 12 ... },	// <--- Defaults to... can't remember
		// autocorrect: false,		// <--- Defaults to true
		// textAlignment: 'left',	// <--- Defaulst to left
		// textColor: 'blue',		// <--- Defaults to "black"
		returnType: SMSView.RETURNKEY_DONE, // <---- Defaults to Ti.SMSView.RETURNKEY_DEFAULT
		camButton: true,				// <--- Defaults to false
		hasTab:true				// <--- Defaults to false
				
	});
	
	win.add(textArea);
	
	buttonBar.addEventListener('click', function(e){
		switch(e.index){
			case 0:	textArea.recieveMessage('Hello World!'); break;
			case 1: textArea.empty(); break;
			case 2: Ti.API.info(textArea.getAllMessages()); break;
			/*
			the camera button dissable property:
				case 3: textArea.camButtonDisabled = true; break;
				case 4: textArea.camButtonDisabled = false; break;
			*/
			case 3: textArea.sendButtonDisabled = true; break;
			case 4: textArea.sendButtonDisabled = false; break;
		}
	});
	
	textArea.addEventListener('click', function(e){
		if(e.scrollView){
			textArea.blur();
		}
		// fires when clicked on the scroll view
		Ti.API.info('Clicked on the scrollview');
	});
	textArea.addEventListener('buttonClicked', function(e){
		// fires when clicked on the send button
	    textArea.addLabel(new Date()+"");
	    textArea.sendMessage(e.value);
		clt.fire('update','apple', { secure: false,maxSubscribers:10 }, {msgtext:'Hello World'})	    
	});
	textArea.addEventListener('camButtonClicked', function(){
		// fires when clicked on the camera button
		
		var options = Ti.UI.createOptionDialog({
			options: ['Photo Gallery', 'Cancel'],
			cancel: 1,
			title: 'Send a photo'
		});
		options.show();
		options.addEventListener('click', function(e) {
			if(e.index == 0){
			// --------------- open the photo gallery and send an image ------------------
				Titanium.Media.openPhotoGallery({
					success: function(event) {
						// uncomment to set a specific width, in this case 100
						var image = Ti.UI.createImageView({image:event.media});
						image.width = 100;
						image.height = (100/event.media.width)*event.media.height
						textArea.sendMessage(image.toBlob());
						// textArea.sendMessage(event.media);
					},
					mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO]
				});
			// ---------------------------------------------------------------------------
			}
		});	
	});
	
	textArea.addEventListener('change', function(e){
		Ti.API.info(e.value);
	});
	
	textArea.addEventListener('messageClicked', function(e){
		// fires when clicked on a message
		if(e.text){
			Ti.API.info('Text: '+e.text);
		}
		if(e.image){
			Ti.API.info('Image: '+e.image);
		}
		Ti.API.info('Index: ' + e.index);
	});

		
	// if (tabbed_window && show_navbar) {
		// win.navBarHidden = false;
	// } else {
		// win.navBarHidden = true;
	// }
	win.navBarHidden = true;
	return win
};

module.exports = ChatWindow;
