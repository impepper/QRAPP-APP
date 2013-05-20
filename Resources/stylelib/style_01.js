// build arrays for stytles : ios->android->mobilewe
//Window Stytles
var array_winBGColor=['#eee','#ccc']
var array_winBarColor=['#222']
var array_winBGImage=['','Nash.jpg']

//Font Stytles
var array_fontcolor=['#123','#600']

//TableView Stytles
// var array_rowBGColor=['transparent','#fff']
var array_tableBGColor=['#eee']
var array_rowBGColor=['#eee','transparent']
var array_rowBGImage=['','Nash.jpg']

function getStyleValue(array_style){
	var return_value = array_style[0]
	if ((Ti.Platform.name=='android') && (array_style.length >=2)){
		return_value = array_style[1]
	}
	
	if ((Ti.Platform.name!='iPhone OS') && (Ti.Platform.name!='android') ){
		return_value= array_style[array_style.length-1]
	}
	
	return return_value
}

var stytle_winBGColor = getStyleValue(array_winBGColor)
var stytle_winBarColor = getStyleValue(array_winBarColor)
var stytle_winBGImage = getStyleValue(array_winBGImage)

var style_fontcolor = getStyleValue(array_fontcolor)

var stytle_tableBGColor = getStyleValue(array_tableBGColor)
var stytle_rowBGColor = getStyleValue(array_rowBGColor)
var stytle_rowBGImage = getStyleValue(array_rowBGImage)