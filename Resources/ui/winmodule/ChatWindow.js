function ChatWindow(tabbed_window,show_navbar,title,chatadmin_id){
	if (Ti.Platform.osname!='android'){

		var Cloud = require('ti.cloud');
		var user;
		var last_updated;
		var chatInterval=30000;
	
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
	
			var ids = [];
			var chat_root_user = Ti.App.Properties.getString('chat_root_user','')
			ids.push(chatadmin_id);
			if (chat_root_user != ''){
				ids.push(chat_root_user);
			}
			if ((user.id!=chat_root_user) && (user.id!=chatadmin_id)){
				ids.push(user.id);
			}
			// alert(ids.length);		
			Cloud.Chats.create({
			    to_ids: ids.join(','),
			    message: 'Say: '+e.value
			}, function (e) {
			    if (e.success) {
			        for (var i = 0; i < e.chats.length; i++) {
			            var chat = e.chats[i];
			            var chatids = chat.chat_group.participate_users;
			            textArea.sendMessage(chat.message+'/Group:'+chat.chat_group.id+'/Users:'+chatids.length+"/ID:"+chatids[0].id+' /'+chatids[1].id);
			            last_updated=chat.created_at;
			        }
			    } else {
			        alert('Error:\\n' +
			            ((e.error && e.message) || JSON.stringify(e)));
			    }
			});
	
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
							//Once Select from Gallery, Create Photos On ACS
							Cloud.Photos.create({
							    photo: event.media,
							    photo_sync_sizes:'small_240'
							}, function (e) {
							    if (e.success) {
							    	// alert('Successfully Create Photos')
							    	//After Photo created, Send Chat(Image) message
							        var photo = e.photos[0];
							        
									var ids = [];
									var chat_root_user = Ti.App.Properties.getString('chat_root_user','')
									ids.push(chatadmin_id);
									if (chat_root_user != ''){
										ids.push(chat_root_user);
									}
									if ((user.id!=chat_root_user) && (user.id!=chatadmin_id)){
										ids.push(user.id);
									}
									
									alert(ids.length+':'+ids.join(','));															            
									Cloud.Chats.create({
									    to_ids: ids.join(','),
									    message: 'sendImage:'+photo.id
									}, function (e) {
									    if (e.success) {
									    	var chat = e.chats[i];
									    	// alert('Successfully Create Photo Messages:'+photo.id)
											var image = Ti.UI.createImageView({image:photo.urls['small_240']});
											textArea.sendMessage(image.toBlob());
											last_updated=chat.created_at;
									    } else {
									        alert('Error:\\n' +
									            ((e.error && e.message) || JSON.stringify(e)));
									    }
									});						            
							    } else {
							        alert('Error:\\n' +
							            ((e.error && e.message) || JSON.stringify(e)));
							    }
							});						
						},
						mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO]
					});
				// ---------------------------------------------------------------------------
				}
			});	
		});
		
		// textArea.addEventListener('change', function(e){
			// Ti.API.info(e.value);
		// });
		
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
	
			
		win.addEventListener('open',function(){
			 
			Cloud.Users.login({
			    login: Ti.App.Properties.getString('cloud_useremail','defaultui@fuihan.com'),
			    password: Ti.App.Properties.getString('cloud_userpassword','fuihan168')
			}, function (e) {
				if (e.success) {
					user = e.users[0];
					//alert(user.id)
					var ids = [];
					var chat_root_user = Ti.App.Properties.getString('chat_root_user','')
					ids.push(chatadmin_id);
					if (chat_root_user != ''){
						ids.push(chat_root_user);
					}
					if ((user.id!=chat_root_user) && (user.id!=chatadmin_id)){
						ids.push(user.id);
					}	
		
					
					// alert(ids.length);
					// alert(ids.length+':'+ids[1]+' / '+ids[2]+' / '+ids[3]);
					alert(ids.length+':'+ids.join(','));
					Cloud.Chats.query({
					    participate_ids: ids.join(','),
					    limit:100,
						where: {created_at:{"$gte":"2012-01-01T22:53:48+0000"}}				    
					}, function (e) {
					    if (e.success) {
					    	// alert('Query Successfully:'+e.chats.length)
					        for (var i = 0; i < e.chats.length; i++) {
					        	var chat = e.chats[i];
					           	if (chat.from.id == user.id){
					           		//Messages sent by Self
					           		if (chat.message.substring(0,10) == 'sendImage:'){
										Cloud.Photos.show({
										    photo_id: chat.message.substring(10)
										}, function (e) {
										    if (e.success) {
										        var photo = e.photos[0];
												var image = Ti.UI.createImageView({image:photo.urls['small_240']})
													textArea.sendMessage(image.toBlob());
										    } else {
										        alert('Error:\\n' +
										            ((e.error && e.message) || JSON.stringify(e)));
										    }
										});				           	 	
						           	 } else {	
										 // textArea.addLabel(chat.from.id);
										 textArea.sendMessage(chat.message);
									}				           	
					            } else {
					            	//Messages sent by Others
					           		if (chat.message.substring(0,10) == 'sendImage:'){
										Cloud.Photos.show({
										    photo_id: chat.message.substring(10)
										}, function (e) {
										    if (e.success) {
										        var photo = e.photos[0];
												var image = Ti.UI.createImageView({image:photo.urls['small_240']})
													textArea.recieveMessage(image.toBlob());
										    } else {
										        alert('Error:\\n' +
										            ((e.error && e.message) || JSON.stringify(e)));
										    }
										});				           	 	
						           	} else {	
										 // textArea.addLabel(chat.from.id);
										 textArea.recieveMessage(chat.message);
									}					           	
					           }
					           last_updated=chat.created_at;
					        }
					    } else {
					        alert('Error:\\n' +
					            ((e.error && e.message) || JSON.stringify(e)));
					    }
					    
					});
					
					setInterval(function(){
						var ids = [];
						var chat_root_user = Ti.App.Properties.getString('chat_root_user','')
						ids.push(chatadmin_id);
						if (chat_root_user != ''){
							ids.push(chat_root_user);
						}
						if ((user.id!=chat_root_user) && (user.id!=chatadmin_id)){
							ids.push(user.id);
						}	
						// alert(ids.length);	
						Cloud.Chats.query({
						    participate_ids: ids.join(','),
						    // limit:100,
						    // where: {created_at:{"$gte":"2012-01-01T22:53:48+0000"}}	
							where: {created_at:{"$gt":last_updated}}				    
						}, function (e) {
						    if (e.success) {
						    	// alert('Query Successfully:'+e.chats.length)
						        for (var i = 0; i < e.chats.length; i++) {
						        	var chat = e.chats[i];
						           	if (chat.from.id == user.id){
						           		//Messages sent by Self
						           		if (chat.message.substring(0,10) == 'sendImage:'){
											Cloud.Photos.show({
											    photo_id: chat.message.substring(10)
											}, function (e) {
											    if (e.success) {
											        var photo = e.photos[0];
											        // alert(photo.id)
													var image = Ti.UI.createImageView({image:photo.urls['small_240']})
														textArea.sendMessage(image.toBlob());
											    } else {
											        alert('Error:\\n' +
											            ((e.error && e.message) || JSON.stringify(e)));
											    }
											});				           	 	
							           	 } else {	
											 // textArea.addLabel(chat.from.id);
											 textArea.sendMessage(chat.message);
										}				           	
						            } else {
						            	//Messages sent by Others
						           		if (chat.message.substring(0,10) == 'sendImage:'){
											Cloud.Photos.show({
											    photo_id: chat.message.substring(10)
											}, function (e) {
											    if (e.success) {
											        var photo = e.photos[0];
													var image = Ti.UI.createImageView({image:photo.urls['small_240']})
														textArea.recieveMessage(image.toBlob());
											    } else {
											        alert('Error:\\n' +
											            ((e.error && e.message) || JSON.stringify(e)));
											    }
											});				           	 	
							           	} else {	
											 // textArea.addLabel(chat.from.id);
											 textArea.recieveMessage(chat.message);
										}					           	
						           }
						           last_updated=chat.created_at;
						        }
						    } else {
						        alert('Error:\\n' +
						            ((e.error && e.message) || JSON.stringify(e)));
						    }
						})
					},chatInterval)				
	
			    } else {
			        alert('Error:\\n' +
			            ((e.error && e.message) || JSON.stringify(e)));
			    }
			});	//end Cloud Login				
		}); //end evetListener Open

	} else {
	
		var win = Ti.UI.createWindow({
			// titleControl:buttonBar,
			orientationModes:[1,2,3,4]
			// tabBarHidden:true
		});		
		
		var android_not_ready = Ti.UI.createLabel({
			text:'Sorry, Chatting on Android is still in development, sorry for the inconvience.',
			font:{fontSize:18}
		})
		
	}

	// if (tabbed_window && show_navbar) {
		// win.navBarHidden = false;
	// } else {
		// win.navBarHidden = true;
	// }
	win.navBarHidden = true;

	return win
};

module.exports = ChatWindow;
