// ==UserScript==
// @name AutoJoinWebex
// @namespace https://github.com/V3D4N7V2/AutoJoinWebex
// @match http*://*.webex.com/webappng/sites/*/meeting/info/*
// @match http*://*.webex.com/webappng/sites/*/meeting/download/*
// @grant window.close
// @version 1.0
// @author V3D4N7V2
// @description -
// @run-at document-start
// @updateURL https://raw.githubusercontent.com/V3D4N7V2/AutoJoinWebex/main/AutoJoinWebex.user.js?token=AQPCK7KVGEAFML5E7W27JGDA6VBI4
// @downloadURL https://raw.githubusercontent.com/V3D4N7V2/AutoJoinWebex/main/AutoJoinWebex.user.js?token=AQPCK7KVGEAFML5E7W27JGDA6VBI4
// ==/UserScript==
if (/https*\:\/\/.*\.webex\.com\/webappng\/sites\/.*\/meeting\/download/.test(window.location.href) && !(window.location.search == "?launchApp=true")) {
	window.location.replace(window.location.href.replace("download", "info"));
}
if (/https*\:\/\/.*\.webex\.com\/webappng\/sites\/.*\/meeting\/info/.test(window.location.href)) {
	var interval;
	var url = document.location.origin + "/webappng/api/v1/meetings/" + document.location.pathname.slice(-32);
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var object = JSON.parse(this.responseText);
			if (object.meetingHost) {
				clearInterval(interval);
			}
			if (object.meetingStarted) {
				clearInterval(interval);
				joinMeeting();
			}
		}
	};
	interval = setInterval(function() {
		xhttp.open("GET", url, true);
		xhttp.send();
	}, 1000);
}

function joinMeeting() {
	var meetingURL = window.location.href.replace("/meeting/info/", "/meeting/download/");
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var parser = new DOMParser();
			var htmlDoc = parser.parseFromString(this.responseText, 'text/html');
			var extendedData = htmlDoc.getElementById("extendedData").innerHTML;
			var object = JSON.parse(extendedData);
			window.location.href = object2.simpleflowMapping.urlProtocollink;
		}
	}
	xhttp.open("GET", meetingURL, true);
	xhttp.send();
	return;
}