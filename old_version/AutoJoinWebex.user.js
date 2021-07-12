// ==UserScript==
// @name AutoJoinWebex
// @namespace https://github.com/V3D4N7V2/AutoJoinWebex
// @match http*://*.webex.com/webappng/sites/*/meeting/info/*
// @match http*://*.webex.com/webappng/sites/*/meeting/download/*
// @grant none
// @version 1.0
// @author V3D4N7V2
// @description -
// @run-at document-start
// @noframes
// ==/UserScript==
if (/https*\:\/\/.*\.webex\.com\/webappng\/sites\/.*\/meeting\/download/.test(window.location.href) && !window.location.search == "?join=true") {
	window.location.href = window.location.href.replace("download", "info") + "?join=true";
}
if (/https*\:\/\/.*\.webex\.com\/webappng\/sites\/.*\/meeting\/info/.test(window.location.href) && window.location.search == "?join=true") {
	var interval;
	var url = document.location.origin + "/webappng/api/v1/meetings/" + document.location.pathname.slice(-32);
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var object = JSON.parse(this.responseText);
			if (object.meetingStarted) {
				clearInterval(interval);
				window.location.href = window.location.href.replace("/meeting/info/", "/meeting/download/");
			}
		}
	};
	interval = setInterval(function() {
		xhttp.open("GET", url, true);
		xhttp.send();
	}, 5000);
}