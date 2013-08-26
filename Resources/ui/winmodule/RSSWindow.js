function RSSWindow(tabbed_window,show_navbar,title,rssurl) {

	Ti.include('/jslib/fnc_logging.js');
	Ti.include('/jslib/fnc_string.js');


	var win = Ti.UI.createWindow({
		title:title,
		backgroundColor:'white',
		navBarHidden:false
	});
	
	var url = rssurl;
	// var url = 'http://rss.cnn.com/services/podcasting/newscast/rss.xml';
	// var url= 'http://v2.0.news.tmg.s3.amazonaws.com/feeds/news.xml';
	// url= 'http://feeds.feedburner.com/5i01?format=xml';
	
	// loadRRSFeed(url) // is at the bottom of the js - after all the functions
	
	// useful for getting rid of html links in text elements in a feed
	Titanium.include('jslib/strip_tags.js');  
	// see: http://pastie.org/837981

	
	var data;
	var i = 0;
	var feedTableView;
	var feedTitle = '';
	
	var stream = Ti.Media.createAudioPlayer();
	
	var item_window = Ti.UI.createView({
		backgroundColor:'#69b',
		borderRadius:8,
		right:5,
		left:5,
		height:100,
		bottom:5
	});
	
	item_window.addEventListener('click', function(e){
		Ti.API.info(item_window.link)
		var w = Ti.UI.createWindow({title:item_title_label.text});
		var wb = Ti.UI.createWebView({url:item_window.link});
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
	})
	
	win.add(item_window);
	
	var item_title_label = Ti.UI.createLabel({
		text: '',
		color: '#fff',
		textAlign:'center',
		left:10,
		right:10,
		top:2,
		height:38,
		font:{fontFamily:'Helvetica Neue',fontWeight:'bold',fontSize:16}
		});
	item_window.add(item_title_label);
	var item_pubdate_label = Ti.UI.createLabel({
		text: '',
		color: '#000',
		textAlign:'right',
		left:10,
		right:10,
		top:42,
		height:10,
		textAlign:'right',
		font:{fontFamily:'Helvetica Neue',fontWeight:'bold',fontSize:10}
		});
	item_window.add(item_pubdate_label);
	var item_desc_label = Ti.UI.createLabel({
		text: '',
		color: '#000',
		textAlign:'left',
		left:10,
		right:10,
		top:55,
		height:45,
		font:{fontFamily:'Helvetica Neue',fontWeight:'bold',fontSize:14}
		});
	item_window.add(item_desc_label);	
	
	function displayItems(itemList){
		// Ti.API.info('DisplayItems')
		for (var c=0;c < itemList.length;c++){	
	
			var title = null;
			var desc = null;
			var pubdate = null;
			var link = null
			// var mp3_url = null;

			// Item title
			title = itemList.item(c).getElementsByTagName("title").item(0).text;
			// Item description
			desc = itemList.item(c).getElementsByTagName("description").item(0).text;
			// Item publish date
			pubdate = itemList.item(c).getElementsByTagName("pubDate").item(0).text;
			// Item publish date
			
			
			var urls = itemList.item(c).getElementsByTagName("link");

			if (urls && urls.length > 0)
			{
				// Ti.API.info('DisplayItems2')
				link = urls.item(0).text;
				for (var j=0; j<urls.length;j++){
					// Ti.API.info('DisplayItems3')
					if (urls.item(j).text!==''){
						
						link = urls.item(j).text;
						// Ti.API.info('DisplayItems4:'+link)
					}					
				}
			}
			// Ti.API.info('DisplayItems5')
			// link = itemList.item(c).getElementsByTagName("link").item(0).text;
			// Clean up any nasty linebreaks in the title and description
			title = title.replace(/\n/gi, " ");			
			desc = desc.replace(/\n/gi, " ");
			pubdate = pubdate.replace(/\n/gi, " ");
			
			// Create a table row for this item
			var row = Ti.UI.createTableViewRow({height:40,backgroundColor:'#eeeeee'}); 
			
			if (Math.round(c/2) != c/2 ) {
				row.backgroundColor='#ddd'
			} else {
				row.backgroundColor='#aaa'
			}
			// Create a label for the title
			var post_title = Ti.UI.createLabel({
				text: title,
				color: '#000',
				textAlign:'left',
				left:60,
				height:35,
				// wordWrap:false,
				width:'auto',
				top:2,
				font:{fontWeight:'bold',fontSize:14}
			});
			row.add(post_title);
			
			// add the CNN logo on the left
			// naturally this could be an image in the feed itself if it existed
			var item_image = Ti.UI.createImageView({
				image:'http://river-traveler.org/wp-content/plugins/social-sharing-toolkit/images/icons_large/rss.png',
				//image:'https://www.sugarsync.com/piv/D490822_7781138_49554',
				left:3,
				top:4,
				width:45,
				height:30
			});
			row.add(item_image);
			
			// Add some rowData for when it is clicked			
			row.thisTitle = title;
			row.thisDesc = desc;
			row.thisPubDate = pubdate;
			row.thisLink = link;
			
			// Add the row to the data
			data[i] = row;
			// I use 'i' here instead of 'c', as I'm only adding rows which have mp3 enclosures
			i++;
			//alert(title +' / '+pubdate+' / '+link);
		}
		
		// create the table
		feedTableView = Titanium.UI.createTableView({
			data:data,
			top:0,
			bottom:110,
			width:320
			// height:260
		});
		
		// Add the tableView to the current window
		win.add(feedTableView);
		
		// Create tableView row event listener
		feedTableView.addEventListener('click', function(e){
	
			// a feed item was clicked
			Ti.API.info('item index clicked :'+e.index);
			Ti.API.info('title  :'+e.rowData.thisTitle);
			Ti.API.info('description  :'+strip_tags(e.rowData.thisDesc));

			item_window.link = e.rowData.thisLink;
			
			item_title_label.text = strip_tags(e.rowData.thisTitle);
			item_pubdate_label.text = strip_tags(e.rowData.thisPubDate);
			item_desc_label.text = strip_tags(e.rowData.thisDesc);

		});
	}
	
	function loadRSSFeed(url){
	
		data = [];
		Ti.API.info('>>>> loading RSS feed '+url);
		xhr = Titanium.Network.createHTTPClient();
		xhr.open('GET',url);
		xhr.onload = function()
		{
				
			Ti.API.info('>>> got the feed! ... ');
			
			// Now parse the feed XML 
			var xml = this.responseXML;
			
			// Find the channel element 
			var channel = xml.documentElement.getElementsByTagName("channel");
	
			feedTitle = channel.item(0).getElementsByTagName("title").item(0).text;
			
			Ti.API.info("FEED TITLE " + feedTitle);
			
			win.title = feedTitle;
			// Find the RSS feed 'items'
			var itemList = xml.documentElement.getElementsByTagName("item");
			Ti.API.info('found '+itemList.length+' items in the RSS feed');
	
			item_title_label.text = 'DONE';
			item_desc_label.text = '';
			
			// Now add the items to a tableView
			displayItems(itemList);
	
		};
		
		item_title_label.text = 'LOADING RSS FEED..';
		item_title_label.textAlign='center';
		item_desc_label.text = '';
		item_pubdate_label.text = '';
		xhr.send();	
	}
	
	if ((Ti.Platform.osname=='iphone') || (Ti.Platform.osname=='ipad') || (Ti.Platform.osname=='ipod')){
		// RIGHT NAVBAR REFRESH BUTTON		
		var r = Titanium.UI.createButton({
			systemButton:Titanium.UI.iPhone.SystemButton.REFRESH
		});
		r.addEventListener('click',function()
		{
			// reload feed
			loadRSSFeed(url);	
		});
		win.setRightNavButton(r);
	}
	
	// load the feed
	loadRSSFeed(url);
	
	// win.addEventListener('open',function(){logging('RSS', title)})
	return win
};

module.exports = RSSWindow;
