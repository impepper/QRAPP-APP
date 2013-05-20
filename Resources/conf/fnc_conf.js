Titanium.include('lib/taffy.js');

var db,dbName,dbPath,resultRows,jsonDefault,jsonDB,jsonFileName
// jsonDefault = Ti.Filesystem.getResRawDirectory+'conf/default.json'
jsonDefault = 'conf/default.json'
jsonFileName = Ti.Filesystem.getResRawDirectory+'conf/localdb.json'

// if (Ti.Platform.name == 'android'){
	// dbPath = 'file:///data/data/' + Ti.App.getID() + '/databases/'
// }

function initLocalDB(){
	Ti.include('conf/default.json')
	Ti.API.info(defaultJSON.length)
	var jsonDB = TAFFY(defaultJSON)

	// Saving them into TAFFYDb flatfile.
	jsonDB.saveFlatFile('db.json');
	
	// Loading from TAFFYDb flatfile. 	
	// jsonDB =TAFFY( TAFFY.loadFlatFile(jsonDefault) );
	
	// Extracting db records that have name's "like" Ray.
	var blueRayPlayers = jsonDB( { name:{like:"Ray"} } );
	
	// Showing matching record counts
	Ti.API.info(blueRayPlayers.count())
	
	
	Ti.API.info( 'Select:' +blueRayPlayers.select("name") );
	return false		
} 



function loadJsonDB(fileName){
	// var tmpFile = Ti.Filesystem.getFile(fileName).read().getText()
	// Ti.API.info(tmpFile)
	return Ti.include(fileName)
}

function checkDB(){
	// alert(Ti.Filesystem.applicationDataDirectory)
	// var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'thav.sql');
	db = Ti.Database.open(dbName)
	var f
	if (Ti.Platform.name == 'android'){
		f = Ti.Filesystem.getFile(dbPath+dbName)
	} else {
		f = db.file
	} 
	
	if(f.exists() == true){
		db.close()
	     return true
	}else{
		db.close
	     return false
	}
} 

function updateDB(){
	
	db = Ti.Database.open(dbName)
	var f 
	if (Ti.Platform.name == 'android'){
		f = Ti.Filesystem.getFile(dbPath+dbName)
	} else {
		f = db.file
	} 
		
	if(f.exists() == true){
		db.close()
		f.deleteFile();
	}else{
		db.close()
	    
	}
	db = Ti.Database.install('thav.db', dbName);
	db.close()	
	// var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'thav.sql');
	// //If it's there, delete it and reinstall the DB
	// if(f.exists() == true){
	     // f.deleteFile();
	     // db = Ti.Database.install('thav.db', dbName);
	// }else{
	     // //Otherwise, install it for the first time
	     // db = Ti.Database.install('thav.db', dbName);
	// }
	return false	
}

function getPOI(){
	return dictionary
}

function getStaticInfo(category,section){
	var return_dic=[]
	if (checkDB()){
	// if (true){
		db = Ti.Database.open(dbName)
		resultRows = db.execute('SELECT * FROM intro WHERE category=? and section=?',category,section)
		if (resultRows.isValidRow()){
		    // alert(resultRows.fieldByName('title_cht'))
		    return_dic['title_cht'] = resultRows.fieldByName('title_cht')
		    return_dic['desc_cht']  = resultRows.fieldByName('desc_cht')
		    return_dic['title_eng'] = resultRows.fieldByName('title_eng')
		    return_dic['desc_eng']  = resultRows.fieldByName('desc_eng')
		}
		db.close()
	} else {
	    alert('No Data Found')
	    return_dic['title_cht'] = 'No title_cht'
	    return_dic['desc_cht']  = 'No desc_cht'
	    return_dic['title_eng'] = 'No title_eng'
	    return_dic['desc_eng']  = 'No desc_eng'	
	}
	return return_dic
}

function getDistInfo(category,coordX,coordY){
	
	var returnArray=[]
	var dictRow= {}
	if (checkDB()){
	// if (true){
		db = Ti.Database.open(dbName)
		var resultRows = db.execute('SELECT *,((coordX-'+coordX+')*(coordX-'+coordX+')+(coordY-'+coordY+')*(coordY-'+coordY+')) as dist FROM refcoords ORDER BY dist')
		var i = 0
		while (resultRows.isValidRow()){
			dictRow = {posX:0,posY:0,dist:0}
			dictRow.posX = resultRows.fieldByName('posX')
			dictRow.posY = resultRows.fieldByName('posY')
			dictRow.dist = resultRows.fieldByName('dist')
			Ti.API.info('dist ' + i +' :'+ dictRow.dist)
			returnArray.push(dictRow)
			resultRows.next();
			i++	
		}
		db.close()
		// alert('xhexkpoint:'+returnArray.length)
	} else {
	    alert('No Data Found')
	}
	
	return returnArray
}


// Changes XML to JSON
function xmlToJson(xml) {
	
	// Create the return object
	var obj = {};

	if (xml.nodeType == 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
		obj["@attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) { // text
		obj = xml.nodeValue;
	}

	// do children
	if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) == "undefined") {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].push) == "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
	return obj;
};
