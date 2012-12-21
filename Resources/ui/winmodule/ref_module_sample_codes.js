	//create module windows
	var Window = require('ui/handheld/ApplicationWindow');
	var win1 = new Window(L('home'),'TYPE_WEB',[true,true,'WebView form TableView','http://tw.yahoo.com']);
	
	//Account Window
	var AccountWindow = require('ui/winmodule/AccountWindow');
	var win2 = new AccountWindow('Account');
	
	//Web Video Window
	var WebVideoWindow = require('ui/winmodule/WebVideoWindow');
	var win3 = new WebVideoWindow(true,true,'WebVideo','Youtube','511XK1L-Btg');
	
	//TableView Winodw
	var tableview_rowdata = [];	
		tableview_rowdata[0] = Ti.UI.createTableViewRow({hasDetail:true,title:'Web View Sample',targetWindow:'TYPE_WEB',targetWindowParameters:[true,true,'Web Page','http://tw.yahoo.com']});
		tableview_rowdata[1] = Ti.UI.createTableViewRow({hasDetail:true,title:'Image View Sample',targetWindow:'TYPE_IMAGE',targetWindowParameters:[true,true,'Image','http://graffletopia.com/images/previews/872/thumb.png?1334680174']});
		tableview_rowdata[2] = Ti.UI.createTableViewRow({hasDetail:true,title:'CoverFlow View Sample',targetWindow:'TYPE_COVERFLOW',targetWindowParameters:[true,true,'CoverFlow','http://graffletopia.com/images/previews/872/thumb.png?1334680174']});
		tableview_rowdata[3] = Ti.UI.createTableViewRow({hasDetail:true,title:'Contact View Sample',targetWindow:'TYPE_CONTACT',targetWindowParameters:[true,true,'Contact','Pepper','impepper@gmail.com','+886-933095673','新北市板橋區民生路一段一號15樓']});
		tableview_rowdata[4] = Ti.UI.createTableViewRow({hasDetail:true,title:'Web Video Sample',targetWindow:'TYPE_WEBVIDEO',targetWindowParameters:[true,true,'WebVidew','Youtube','511XK1L-Btg']});	
		var second_tableview_rowdata = [];
			second_tableview_rowdata[0] = Ti.UI.createTableViewRow({hasDetail:true,title:'Web View Sample',targetWindow:'TYPE_WEB',targetWindowParameters:[true,true,'Web Page','http://tw.yahoo.com']});
			second_tableview_rowdata[1] = Ti.UI.createTableViewRow({hasDetail:true,title:'Image View Sample',targetWindow:'TYPE_IMAGE',targetWindowParameters:[true,true,'Image','http://graffletopia.com/images/previews/872/thumb.png?1334680174']});
			second_tableview_rowdata[2] = Ti.UI.createTableViewRow({hasDetail:true,title:'CoverFlow View Sample',targetWindow:'TYPE_COVERFLOW',targetWindowParameters:[true,true,'CoverFlow','http://graffletopia.com/images/previews/872/thumb.png?1334680174']});
			second_tableview_rowdata[3] = Ti.UI.createTableViewRow({hasDetail:true,title:'Contact View Sample',targetWindow:'TYPE_CONTACT',targetWindowParameters:[true,true,'Contact','Pepper','impepper@gmail.com','+886-933095673','新北市板橋區民生路一段一號15樓']});
			second_tableview_rowdata[4] = Ti.UI.createTableViewRow({hasDetail:true,title:'Web Video Sample',targetWindow:'TYPE_WEBVIDEO',targetWindowParameters:[true,true,'WebVidew','Youtube','511XK1L-Btg']});	
		tableview_rowdata[5] = Ti.UI.createTableViewRow({hasChild:true,title:'another TableView ...',targetWindow:'TYPE_TABLE',targetWindowParameters:[true,true,'2nd TableView',second_tableview_rowdata]});
		tableview_rowdata[6] = Ti.UI.createTableViewRow({hasDetail:true,title:'RSS Window',targetWindow:'TYPE_RSS',targetWindowParameters:[true,true,'RSS Title','http://feeds.feedburner.com/5i01?format=xml']});
		tableview_rowdata[7] = Ti.UI.createTableViewRow({hasDetail:true,title:'RSS Window 2',targetWindow:'TYPE_RSS2',targetWindowParameters:[true,true,'RSS2 Title','http://v2.0.news.tmg.s3.amazonaws.com/feeds/news.xml']});
	
	var TableViewWindow = require('ui/winmodule/TableViewWindow');
	var win4 = new TableViewWindow(true,true,'Table View',tableview_rowdata);
	
	//Contact Window
	var ContactWindow = require('ui/winmodule/ContactWindow');
	var win5 = new ContactWindow(true,true,'Contact','Pepper','impepper@gmail.com','+886-933095673','新北市板橋區民生路一段一號15樓');
	
	//Image View Window
	var ImageViewWindow = require('ui/winmodule/ImageViewWindow');
	var win6 = new ImageViewWindow(true,false,'Test','http://graffletopia.com/images/previews/872/thumb.png?1334680174',false);

	//CoverFlow View Window (iOS Only)
	var ImageViewWindow = require('ui/winmodule/ImageViewWindow');
	var win6 = new ImageViewWindow(true,false,'Test','http://graffletopia.com/images/previews/872/thumb.png?1334680174',true);

	
	//Web Page Window
	var WebViewWindow = require('ui/winmodule/WebViewWindow');
	var win7 = new webViewWindow(true,true,'Web Page','http://tw.yahoo.com');
	
	//RSS Window Type I
	var RSSWindow = require('ui/winmodule/RSSWindow');
	var win8 = new RSSWindow(true,true,'RSS Title','http://feeds.feedburner.com/5i01?format=xml');

	//RSS Window Type II
	var RSSWindow2 = require('ui/winmodule/RSSWindow2');
	var win9 = new RSSWindow2(true,true,'RSS2 Title','http://v2.0.news.tmg.s3.amazonaws.com/feeds/news.xml');
