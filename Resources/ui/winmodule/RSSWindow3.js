function RSSWindow2(tabbed_window,show_navbar,title,rssurl) {
	
	Ti.include('/jslib/fnc_logging.js');

	var win = Ti.UI.createWindow({
		title:title,
		backgroundColor:'white',
		navBarHidden:false
	});
	var url = rssurl;
	// var url = 'http://v2.0.news.tmg.s3.amazonaws.com/feeds/news.xml';
	
	var data = [];
	
	var xhr = Ti.Network.createHTTPClient();
	xhr.open("GET",url);
	xhr.onload = function()
	{
		try
		{
			var doc = this.responseXML.documentElement;
			var items = doc.getElementsByTagName("item");
			var x = 0;
			var doctitle = doc.evaluate("//channel/title/text()").item(0).nodeValue;
			for (var c=0;c<items.length;c++)
			{
				var item = items.item(c);
				var thumbnails = item.getElementsByTagName("media:thumbnail");
				if (thumbnails && thumbnails.length > 0)
				{
					var media = thumbnails.item(0).getAttribute("url");
					var title = item.getElementsByTagName("title").item(0).text;
					var row = Ti.UI.createTableViewRow({height:80});
					var label = Ti.UI.createLabel({
						text:title,
						left:72,
						top:5,
						bottom:5,
						right:5				
					});
					row.add(label);
					var img;
					if (Titanium.Platform.name == 'android') 
					{
						// iphone moved to a single image property - android needs to do the same
						img = Ti.UI.createImageView({
							image:media,
							left:5,
							height:60,
							width:60
						});
	
					}
					else
					{
						img = Ti.UI.createImageView({
							image:media,
							left:5,
							height:60,
							width:60
						});
						
					}
					row.add(img);
					data[x++] = row;
					row.url = item.getElementsByTagName("link").item(0).text;
				}
			}
			var tableview = Titanium.UI.createTableView({data:data});
			win.add(tableview);
			tableview.addEventListener('click',function(e)
			{
				var w = Ti.UI.createWindow({title:doctitle});
				var wb = Ti.UI.createWebView({url:e.row.url});
				w.add(wb);
				var b = Titanium.UI.createButton({
					title:'Close',
					style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
				});
				w.setLeftNavButton(b);
				b.addEventListener('click',function()
				{
					w.close();
				});
				w.open({modal:true});
			});
		}
		catch(E)
		{
			alert(E);
		}
	};
	xhr.send();
	// win.addEventListener('open',function(){logging('RSS3', title)})
	return win
};

module.exports = RSSWindow2;
