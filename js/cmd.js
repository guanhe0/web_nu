var g_asynv_type = false;
(function($){ 
    $.extend({
        sendCmd: function(cmd, body){
			if(cmd == "CW_JSON_UPDATE"){
				g_asynv_type = body.async;
				return false;
			}
        	var defer = $.Deferred();
        	var message = $.buildMessage(cmd, body);
        	log("[send message]" + message);
			
			$.ajax({
				url: "cmd",
				async: g_asynv_type,
				cache: false,
				data: {
					CWPCmd: message
				}
			}).done(function(data) {
				log("[recv message]" + data);
				var result = $.parseMessage(data);
				if (result.success) {
					defer.resolve(result.data);
				}
				else {
					return defer.reject()
				}
			}).fail(function() {
				return defer.reject();
			})				
			return defer.promise();
		},
        sendCmdAsync: function(cmd, body){
        	var defer = $.Deferred();
        	var message = $.buildMessage(cmd, body);
        	log("[send message]" + message);
			$.ajax({
				url: "cmd",
				async: true,
				cache: false,
				data: {
					CWPCmd: message
				}
			}).done(function(data) {
				log("[recv message]" + data);
				var result = $.parseMessage(data);
				if (result.success) {
					defer.resolve(result.data);
				}
				else {
					return defer.reject()
				}
			}).fail(function() {
				return defer.reject();
			})

			return defer.promise();
        },
        buildMessage: function(cmd, bodyMsg) {
        	var message = {
        		head: {
        			version: "1.0",
	        		token: $.trim($.cookie("token")),
	        		type: "request",
	        		action: cmd,
	        		message_id: ""
        		},
        		body: bodyMsg
        	}

        	return $.toJSON(message);
        },

        parseMessage: function(message) {
			
			message = $.trim(message);
			var index_div = message.indexOf("@");
			/*
	        	message = message.split("@");
				
				log("first @ at = " + indexa);
	            if (message.length != 2) {
	                return {success: false, data: ""};
	            }
	            
	        	var begin = message[0].indexOf("CWP");
	        	var len = message[0].substring(begin + 3);
	            log("[len: " + len + " , " + $.messageLen(message[1]) + "]");
			*/
			var StrHead = message.substring(0,index_div);
			var StrContent = message.substring(index_div+1);
			var index_cwp = StrHead.indexOf("CWP");
			var MessageLen = StrHead.substring(index_cwp+3);
			log("MessageLen = " + MessageLen + "  ContentLen = " + $.messageLen(StrContent));
        	if (parseInt(MessageLen, 10) == $.messageLen(StrContent)) {
                var dataStr = $.evalJSON(StrContent);
                if (typeof dataStr.body === "undefined") {
                    log("[ERROR] " + dataStr.head["code"] + "--" + dataStr.head["reason"]);
                    return {success: false, data: ""};
                } else {
                    return {success: true, data: dataStr.body};
                }
        	}
        	else {
        		return {success: false, data: ""};
        	}
        },

    	messageLen: function(message) {
    		var index = 0,
    			totalLen = 0,
    			charCode = 0;

    		for (index = 0; index < message.length; index ++) {
    			charCode = message.charCodeAt(index);
    			if (charCode < 0x007f) {
    				totalLen += 1;
    			}
    			else if ((0x0080 <= charCode) && (charCode <= 0x07ff)) {
    				totalLen += 2;
    			}
    			else if ((0x0800 <= charCode) && (charCode <= 0xffff)) {
    				totalLen += 3;	
    			}
    		}

    		return totalLen;
    	}
    })
})(jQuery);

// function sendMessage(cmd, bodyMsg) {
// 	var defer = $.Deferred();
// 	var message = buildMessage(cmd, bodyMsg);
// 	log("[send message]" + message);
// 	$.ajax({
// 		url: "cmd",
// 		data: {
// 			CWPCmd: message
// 		}
// 	}).done(function(data) {
// 		log("[recv message]" + data);
// 		var result = parseMessage(data);
// 		if (result.success) {
// 			defer.resolve(result.data);
// 		}
// 		else {
// 			return defer.reject()
// 		}
// 	}).fail(function() {
// 		return defer.reject();
// 	})

// 	return defer.promise();
// }

// function buildMessage(cmd, bodyMsg) {
// 	var message = {
// 		head: {
// 			version: "1.0",
//     		token: "",
//     		type: "request",
//     		action: cmd,
//     		message_id: ""
// 		},
// 		body: bodyMsg
// 	}

// 	return $.toJSON(message);
// }

// function parseMessage(message) {
// 	message = $.trim(message);
// 	message = message.split("@");
// 	var begin = message[0].indexOf("CWP");
// 	var len = message[0].substring(begin + 3);
// 	if (parseInt(len, 10) == messageLen(message[1])) {
// 		return {success: true, data: $.evalJSON(message[1]).body};
// 	}
// 	else {
// 		return {success: false, data: ""};
// 	}
// }

// function messageLen(message) {
// 	var index = 0,
// 		totalLen = 0,
// 		charCode = 0;

// 	for (index = 0; index < message.length; index ++) {
// 		charCode = message.charCodeAt(index);
// 		if (charCode < 0x007f) {
// 			totalLen += 1;
// 		}
// 		else if ((0x0080 <= charCode) && (charCode <= 0x07ff)) {
// 			totalLen += 2;
// 		}
// 		else if ((0x0800 <= charCode) && (charCode <= 0xffff)) {
// 			totalLen += 3;	
// 		}
// 	}

// 	return totalLen;
// }
