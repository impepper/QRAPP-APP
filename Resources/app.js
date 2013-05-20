
if (Ti.version < 1.8 ) {
	alert('Sorry - this application template requires Titanium Mobile SDK 1.8 or later');
}

// Ti.include('/jslib/fnc_logging.js');
Ti.include('/jslib/fnc_db.js');
// Ti.include('/jslib/fnc_cloud.js');
// Ti.include('/jslib/fnc_string.js');
dbInitialize();

if (Ti.Platform.osname == 'android'){
	Ti.App.Properties.setBool('get_location_service',true)
	// Ti.App.Properties.setString('loading_method','LIST')
}



var parent = Ti.Filesystem.getApplicationDataDirectory();
var new_folderlist=['QRImages','QR']
for (var i=0;i < new_folderlist.length;i++){
	var new_folder = Titanium.Filesystem.getFile(parent, new_folderlist[i]);
	if( !new_folder.exists() )
	{
	  new_folder.createDirectory();
	}	
}

// Ti.App.Properties.setString('loading_method','TAB');

(function() {

	var osname = Ti.Platform.osname,
		version = Ti.Platform.version,
		height = Ti.Platform.displayCaps.platformHeight,
		width = Ti.Platform.displayCaps.platformWidth;
	
	var isTablet = osname === 'ipad' || (osname === 'android' && (width > 899 || height > 899));

	var ApplicationTabGroup = require('ui/common/ApplicationTabGroup');
	new ApplicationTabGroup(isTablet).open();

})();