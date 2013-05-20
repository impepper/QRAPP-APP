function saveFile(_args) {
  
  // Test if External Storage (Android only)
  if(Ti.Filesystem.isExternalStoragePresent()){
    var file = Ti.Filesystem.getFile(Ti.Filesystem.externalStorageDirectory, _args.filename);
  }

  // No SD or iOS
  else {
    var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, _args.filename);
  }
  
  // Save file
  file.write(_args.file);
  
  // Debug: Test if file exist now
  if(file.exists) {
    Ti.API.info('[saveFile] Saved: YES! (' + file.nativePath + ')');
  } else {
    Ti.API.info('[saveFile] Saved: NO!');
  }
  
  return file.nativePath;

};

function getDataPath(){

	if (Ti.Platform.osname=='android'){

		if (Titanium.Filesystem.isExternalStoragePresent()){
			cert_path = 'file://sdcard';
		    var sdcard_folder = Titanium.Filesystem.getFile(cert_path);
		    
		    if(!sdcard_folder.exists()){
		    	// cert_path = Ti.Filesystem.applicationDataDirectory;
				cert_path = 'file://mnt/sdcard';
			    sdcard_folder = Titanium.Filesystem.getFile(cert_path);
			    if(!sdcard_folder.exists()){
		    		cert_path = Ti.Filesystem.applicationDataDirectory;
			    } else {
			    	
			    	cert_path += Ti.Filesystem.separator;
			    	var sdcard_folder2 = Titanium.Filesystem.getFile(cert_path,Ti.App.id);
			    	if (!sdcard_folder2.exists()){
			    		sdcard_folder2.createDirectory();
			    	}
			    	cert_path += Ti.App.id;
			    }
		    } else {
		    	cert_path += Ti.Filesystem.separator;
		    	var sdcard_folder2 = Titanium.Filesystem.getFile(cert_path,Ti.App.id);
		    	if (!sdcard_folder2.exists()){
		    		sdcard_folder2.createDirectory();
		    	} 
				cert_path += Ti.App.id;
		    }
		    
		    if (cert_path != Ti.Filesystem.applicationDataDirectory){
			 	cert_path += Ti.Filesystem.separator;
			    // this will create the new folder on the sd card and return a filesystem object
			    // var new_folder = Titanium.Filesystem.getFile(cert_path, new_folder_name);
			    // if(!new_folder.exists()){
			        // new_folder.createDirectory();
			    // }
			    // cert_path=cert_path+new_folder_name+Ti.Filesystem.separator	    	
			}
		} else {
			cert_path=Ti.Filesystem.applicationDataDirectory
		}
	} else {
		cert_path=Ti.Filesystem.applicationDataDirectory
	}	
	
	return cert_path
}
