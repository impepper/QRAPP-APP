function WindowRouter(win_type,parameters,win_id,_rootWin) {
	if (_rootWin== undefined){_rootWin=''}
	var self = Ti.UI.createWindow({
		backgroundColor:'red'
	});
	
	switch (win_type) {
		// case 'TYPE_LISTGROUP':
			// var ApplicationListGroup = require('ui/common/ApplicationListGroup');
			// self = new ApplicationListGroup(parameters[0],parameters[1],parameters[2],parameters[3]);
			// break;	
		case 'TYPE_IMAGE':
			var ImageViewWindow = require('ui/winmodule/ImageViewWindow');
			// self = new ImageViewWindow(true,true,'Test','http://graffletopia.com/images/previews/872/thumb.png?1334680174',false);
			self = new ImageViewWindow(parameters[0],parameters[1],parameters[2],win_id,false);
			break;
		case 'TYPE_COVERFLOW':
			var ImageViewWindow = require('ui/winmodule/ImageViewWindow');
			// self = new ImageViewWindow(true,true,'Test','http://graffletopia.com/images/previews/872/thumb.png?1334680174',true);
			self = new ImageViewWindow(parameters[0],parameters[1],parameters[2],win_id,true);
			break;
		case 'TYPE_WEB':
			var WebViewWindow = require('ui/winmodule/WebViewWindow');
			// self = new WebViewWindow(true,true,'Test','http://tw.yahoo.com');
			self = new WebViewWindow(parameters[0],parameters[1],parameters[2],parameters[3]);
			break;
		case 'TYPE_CUSTOMPAGE':
			var WebViewWindow = require('ui/winmodule/CustomPageWindow');
			// self = new WebViewWindow(true,true,'Page Title','Page Content');
			self = new WebViewWindow(parameters[0],parameters[1],parameters[2],parameters[3]);
			break;			
		case 'TYPE_WEBVIDEO':
			var WebVideoWindow = require('ui/winmodule/WebVideoWindow');
			// self = new WebVideoWindow(true,true,'Sample Video','YOUTUBE','511XK1L-Btg');
			self = new WebVideoWindow(parameters[0],parameters[1],parameters[2],parameters[3],parameters[4]);
			break;				
		// case 'TYPE_CONTACT':
			// var ContactWindow = require('ui/winmodule/ContactWindow');
			// //self = new ContactWindow(true,true,'Contact','Pepper','impepper@gmail.com','+886-933095673','新北市板橋區民生路一段一號15樓');
			// self = new ContactWindow(parameters[0],parameters[1],parameters[2],parameters[3],parameters[4],parameters[5],parameters[6]);
			// break;				
		case 'TYPE_CONTACT':
			var ContactWindow = require('ui/winmodule/ContactWindow');
			//self = new ContactWindow(true,true,'Contact','photo_id');
			self = new ContactWindow(parameters[0],parameters[1],parameters[2],parameters[3]);
			break;				
		case 'TYPE_TABLE':
			var TableViewWindow = require('ui/winmodule/TableViewWindow');
			// self = new TableViewWindow(true,false,'Table View',tableview_rowdata);
			self = new TableViewWindow(parameters[0],parameters[1],parameters[2],parameters[3],parameters[4]);
			break;				
		case 'TYPE_RSS':
			var RSSWindow = require('ui/winmodule/RSSWindow');
			// self = new TableViewWindow(true,false,'RSS Title',rssurl);
			self = new RSSWindow(parameters[0],parameters[1],parameters[2],parameters[3]);
			break;	
		case 'TYPE_RSS2':
			var RSSWindow2 = require('ui/winmodule/RSSWindow2');
			// self = new TableViewWindow(true,false,'RSS Title',rssurl);
			self = new RSSWindow2(parameters[0],parameters[1],parameters[2],parameters[3]);
			break;			
		case 'TYPE_ACCOUNT':
			var AccountWindow = require('ui/winmodule/AccountWindow');
			// self = new AccountWindow('Account');
			self = new AccountWindow(parameters[0]);		
			break;			
		case 'TYPE_QRACCOUNT':
			var QRAccountWindow = require('ui/winmodule/QRAccountWindow');
			// self = new QRAccountWindow('QRAccount');
			if (_rootWin !=undefined){
				self = new QRAccountWindow(_rootWin,parameters[0]);
			} else {
				self = new QRAccountWindow('',parameters[0]);
			}
					
			break;
		case 'TYPE_QRHISTORY':
			var QRHistoryWindow = require('ui/winmodule/QRHistoryWindow');
			// self = new QRAccountWindow('QRAccount');
			self = new QRHistoryWindow(_rootWin,parameters[0]);		
			break;	
		case 'TYPE_QRHISTORYLIST':
			var QRHistoryListWindow = require('ui/winmodule/QRHistoryListWindow');
			// self = new QRAccountWindow('QRAccount');
			self = new QRHistoryListWindow(parameters[0]);		
			break;						
		case 'TYPE_QRGENERATOR':
			var QRGeneratorWindow = require('ui/winmodule/QRGeneratorWindow');
			// self = new QRAccountWindow('QRAccount');
			self = new QRGeneratorWindow(parameters[0]);		
			break;	
		case 'TYPE_CHAT':
			var ChatWindow = require('ui/winmodule/ChatWindow');
			// self = new ChatWindow(true,true,"Chat Window","Chatting"");
			self = new ChatWindow(parameters[0],parameters[1],parameters[2],parameters[3]);		
			break;	
		case 'TYPE_SOCIALLINK':
			var SocialLinkWindow = require('ui/winmodule/SocialLinkWindow');
			// self = new ChatWindow(true,true,"Chat Window","Chatting"");
			self = new SocialLinkWindow(parameters[0],parameters[1],parameters[2],parameters[3]);		
			break;						
		case 'TYPE_WIN':
			self = Ti.UI.createWindow({
				title: L('newWindow'),
				backgroundColor: '#369'
			})
			break;
		case 'TYPE_QR_WEBPAGE':
			var QR_WebPageWindow = require('ui/winmodule/QR_WebPageWindow');
			// self = new WebViewWindow(title,Link);
			self = new QR_WebPageWindow(parameters[0],parameters[1]);
			break;			
		case 'TYPE_QR_TEXT':
			var QR_TextWindow = require('ui/winmodule/QR_TextWindow');
			// self = new WebViewWindow(title,Link);
			self = new QR_TextWindow(parameters[0],parameters[1]);
			break;
		case 'TYPE_QR_VCARD':
			var QR_VCARDWindow = require('ui/winmodule/QR_VCARDWindow');
			// self = new WebViewWindow(title,Link);
			self = new QR_VCARDWindow(parameters[0],parameters[1]);
			break;
		case 'TYPE_QR_PHONE':
			var QR_PhoneWindow = require('ui/winmodule/QR_PhoneWindow');
			// self = new WebViewWindow(title,Link);
			self = new QR_PhoneWindow(parameters[0],parameters[1]);
			break;
		case 'TYPE_PDF':
			var PDFWindow = require('ui/winmodule/PDFWindow');
			// self = new WebViewWindow(title,Link);
			self = new PDFWindow(parameters[0],parameters[1]);
			break;			
		default :
			var WebViewWindow = require('ui/winmodule/WebViewWindow');
			// self = new WebViewWindow(true,true,'Test','http://tw.yahoo.com');
			self = new WebViewWindow(true,true,'Welcome','default.html');
			break;		
	}
	
	return self;
};

module.exports = WindowRouter;