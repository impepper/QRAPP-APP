function QR_VCARDWindow(title,url) {

	Ti.include('/jslib/fnc_logging.js');
	Ti.include('/jslib/fnc_db.js');
	Ti.include('/stylelib/style_01.js');

	var win = Ti.UI.createWindow({
		title:title,
		backgroundColor:stytle_winBGColor,
		barColor:stytle_winBarColor,	
		navBarHidden:false
	});
	
	var osname = Ti.Platform.osname,
		version = Ti.Platform.version,
		height = Ti.Platform.displayCaps.platformHeight,
		width = Ti.Platform.displayCaps.platformWidth;	
	var isTablet = osname === 'ipad' || (osname === 'android' && (width > 899 || height > 899));
	var adgap=(isTablet?90:50);
	var adwidth=(isTablet?728:320);
	var ad_role = Ti.App.Properties.getInt('cloud_userrole',0)
	var view_header_gap=0,view_footer_gap=0
	if (Ti.Platform.osname=='mobileweb'){
		var scrollView = Ti.UI.createScrollView({
		  contentWidth: 'auto',
		  contentHeight: 'auto',
		  height: 'auto',
		  width: 'auto',
		  layout:'vertical'
		});		
	}
	if ((ad_role < 5) && (Ti.Platform.osname!='mobileweb')){
		//Admob Setting
		var Admob = require('ti.admob');

		win.add(Admob.createView({
		    bottom: 0, //left: 0,
		    width: adwidth, height: adgap,
		    publisherId: 'a14fc70a8d46176', // You can get your own at http: //www.admob.com/
		    adBackgroundColor: 'black',
		    // testing: true,
		    // dateOfBirth: new Date(1985, 10, 1, 12, 1, 1),
		    gender: 'male',
		    keywords: 'movie'
		}));
		view_footer_gap = adgap	        
		//End of Admob		
	}
	function regIndex(str,pattern, startIndex){
	    startIndex = startIndex || 0;
	    // var searchResult = str.substr( startIndex ).search( pattern );
	    var tempstr = str.toString().substr(startIndex,500)
	    // alert(tempstr)
	    var searchResult = tempstr.search(pattern);
	    return ( -1 === searchResult ) ? -1 : searchResult + startIndex;
	}	
	
	function checkVcardItem(vcardText,itemTitle){
		var item_position=vcardText.toString().indexOf(itemTitle+':')
		if (item_position>0){
			// alert('str_position:'+item_position)
			var str_postion=regIndex(vcardText,/\r\n/,item_position)
			// alert(str_postion);
			if (str_postion>0) {
				return vcardText.toString().substr(item_position+itemTitle.toString().length+1,str_postion-item_position-itemTitle.length)
			} else {
				return false
			}
		}
	}
	
	var contentview = Ti.UI.createScrollView({
		top:view_header_gap,
		bottom:view_header_gap,
		height :300
	})
	
	win.add(contentview);	
	
	var vc_name=checkVcardItem(url.substr(5,300),'N')
	if (vc_name){
		// alert(vc_name.replace(/\;/,' '))
		// alert(vc_name.replace(/\;/g,' '))
		vc_name=vc_name.replace(/\;/g,' ')
		
		var lbl_vc_name=Ti.UI.createLabel({
			text:vc_name,
			top:175,
			color:style_fontcolor
		})
		contentview.add(lbl_vc_name)
		QRDescUpdate(url,vc_name,'','')
	}

	var vc_org=checkVcardItem(url.substr(5,300),'ORG')
	var vc_title=checkVcardItem(url.substr(5,300),'TITLE')
	// vc_org
	// alert(vc_org)
	if (vc_org || vc_title){
		var vc_company = ''
		// if (vc_org) { vc_company += vc_org}
		// // if ((vc_org && vc_title)){vc_company += '  '}
		// if (vc_title) { vc_company += vc_title}
		vc_company = (vc_org)?vc_org:vc_title;
		// vc_company = vc_company.replace(/\r\n/g,'')
		// alert(vc_company)
		var lbl_vc_company=Ti.UI.createLabel({
			text:vc_company,
			top:200,
			color:style_fontcolor,
			width:'auto'
		})
		contentview.add(lbl_vc_company)		
	}

	var vc_tel_home=checkVcardItem(url.substr(5,300),'TEL;HOME')
	if (vc_tel_home){
		var lbl_vc_tel_home=Ti.UI.createLabel({
			text:vc_tel_home,
			top:225,
			color:style_fontcolor
		})
		lbl_vc_tel_home.addEventListener('click',function(){
			Ti.Platform.openURL('tel:'+vc_tel_home);
		})
		contentview.add(lbl_vc_tel_home)
	}

	var vc_tel_cell=checkVcardItem(url.substr(5,300),'TEL;CELL')
	if (vc_tel_cell){
		var lbl_vc_tel_cell=Ti.UI.createLabel({
			text:vc_tel_cell,
			top:250,
			color:style_fontcolor
		})
		lbl_vc_tel_cell.addEventListener('click',function(){
			Ti.Platform.openURL('tel:'+vc_tel_cell);
		})
		contentview.add(lbl_vc_tel_cell)		
	}	

	var vc_add_home=checkVcardItem(url.substr(5,300),'ADR;HOME')
	var vc_add_work=checkVcardItem(url.substr(5,300),'ADR;WORK')
	var vc_geo=checkVcardItem(url,'GEO')
	if (vc_geo){
		vc_geo=vc_geo.replace(/\;/g,',')
		vc_geo_label = 'Location'+vc_geo
	}	
	if (vc_add_home || vc_add_work || vc_geo){
		// alert(vc_add_home)
		// alert(vc_add_work)
		if (vc_add_home){vc_add_home = vc_add_home.replace(/\;/g,'')}
		if (vc_add_work){vc_add_work = vc_add_work.replace(/\;/g,'')}
		if (vc_geo){
			vc_geo=vc_geo.replace(/\;/g,',')
			geo_sep_index= vc_geo.search(',')
			var geo_lat = (vc_geo.substr(geo_sep_index+1,vc_geo.length-geo_sep_index-1))
			var geo_long = (vc_geo.substr(0,geo_sep_index))	
			vc_geo = parseFloat(geo_lat)+','+parseFloat(geo_long)
		}
		// vc_add_work.replace(/\;/,'')
		// alert(vc_add_home)
		// alert(vc_add_work)	
		if (vc_add_home || vc_add_work)	{
			var using_vc_add = (vc_add_home)?vc_add_home:vc_add_work;
			var mapurl='http://maps.google.com/maps?z=15&q='+using_vc_add
		} else {
			var using_vc_add = 'Location :'+vc_geo
			var mapurl='http://maps.google.com/maps?z=15&q='+vc_geo
		}
		
		var lbl_vc_add=Ti.UI.createLabel({
			text:using_vc_add,
			top:280,
			color:style_fontcolor
		})
		
		lbl_vc_add.addEventListener('click',function(){
			var mapwin=Ti.UI.createWindow({
				title:'MAP',
				modal:true
			})
			
			
			if (Ti.Platform.name=='iPhone OS'){
				var btn_close=Ti.UI.createButton({
					titleid:'CLOSE_WIN'
				})
				
				btn_close.addEventListener('click',function(e){
					mapwin.close();
				})
				mapwin.setLeftNavButton(btn_close)
			}						
			var mapview=Ti.UI.createWebView({
				url:mapurl
			})		
			mapwin.add(mapview)
			
			mapwin.open();
		})
		contentview.add(lbl_vc_add)		
	}

	var vc_photo=checkVcardItem(url.substr(5,300),'PHOTO;JPEG')
	// if (vc_photo){
	if (true){
		var img_vc_photo=Ti.UI.createImageView({
			image:(vc_photo)?vc_photo:'/images/qr_contact.png',
			height:150,
			top:20,
			width:'auto'
			// left:20
		})
		contentview.add(img_vc_photo)		
	}		

	// win.addEventListener('open',function(){logging('QR_VCARD', title)})
	
	return win
};

module.exports = QR_VCARDWindow;
