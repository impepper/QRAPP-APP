function strTrim(str) {  
  var start = -1,  
  end = str.length;  
  while (str.charCodeAt(--end) < 33);  
  while (str.charCodeAt(++start) < 33);  
  return str.slice(start, end + 1);  
}; 

function strTrimSize(str){
	var strStart=-1;
	var strEnd=str.length;
	while(str.charCodeAt(--strEnd) < 125);
	while(str.charCodeAt(++strStart) < 33);	
	return str.slice(strStart, strEnd);
};

function strTrimSize2(str){
	var strStart=-1;
	
	while(str.charCodeAt(++strStart) < 125);
	var strEnd=str.length-strStart+1;
	return str.slice(strStart+1, str.length);
};

//將數字加上千位數逗號
function addCommas(nStr)
{
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

function strip_tags (str, allowed_tags) {
    // http://kevin.vanzonneveld.net
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Luke Godfrey
    // +      input by: Pul
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Onno Marsman
    // +      input by: Alex
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Marc Palau
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Eric Nagel
    // +      input by: Bobby Drake
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Tomasz Wesolowski
    
    // fixed Titanium warning by: Kosso
    
    // *     example 1: strip_tags('<p>Kevin</p> <br /><b>van</b> <i>Zonneveld</i>', '<i><b>');
    // *     returns 1: 'Kevin <b>van</b> <i>Zonneveld</i>'
    // *     example 2: strip_tags('<p>Kevin <img src="someimage.png" onmouseover="someFunction()">van <i>Zonneveld</i></p>', '<p>');
    // *     returns 2: '<p>Kevin van Zonneveld</p>'
    // *     example 3: strip_tags("<a href='http://kevin.vanzonneveld.net'>Kevin van Zonneveld</a>", "<a>");
    // *     returns 3: '<a href='http://kevin.vanzonneveld.net'>Kevin van Zonneveld</a>'
    // *     example 4: strip_tags('1 < 5 5 > 1');
    // *     returns 4: '1 < 5 5 > 1'

    var key = '', allowed = false;
    var matches = [];
    var allowed_array = [];
    var allowed_tag = '';
    var i = 0;
    var k = '';
    var html = '';

    var replacer = function (search, replace, str) {
        return str.split(search).join(replace);
    };

    // Build allowes tags associative array
    if (allowed_tags) {
        allowed_array = allowed_tags.match(/([a-zA-Z0-9]+)/gi);
    }

    str += '';

    // Match tags
    matches = str.match(/(<\/?[\S][^>]*>)/gi);

    // Go through all HTML tags
    for (key in matches) {
	
		if(key){
	
			// Save HTML tag
			html = matches[key].toString();
	
			// Is tag not in allowed list? Remove from str!
			allowed = false;
	
			// Go through all allowed tags
			for (k in allowed_array) {
	
				if(k){
		
					// Init
					allowed_tag = allowed_array[k];
					i = -1;
		
					if (i != 0) { i = html.toLowerCase().indexOf('<'+allowed_tag+'>');}
					if (i != 0) { i = html.toLowerCase().indexOf('<'+allowed_tag+' ');}
					if (i != 0) { i = html.toLowerCase().indexOf('</'+allowed_tag)   ;}
		
					// Determine
					if (i == 0) {
						allowed = true;
						break;
					}
				
				}
			}
	
			if (!allowed) {
				str = replacer(html, "", str); // Custom replace. No regexing
			}
        
        }
    }

    return str;
}
