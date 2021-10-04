// ==UserScript==
// @name AutoJoinWebex
// @namespace https://github.com/V3D4N7V2/AutoJoinWebex
// @match http*://*.webex.com/webappng/sites/*/meeting/info/*
// @match http*://*.webex.com/webappng/sites/*/meeting/download/*
// @grant window.close
// @version 1.6
// @author V3D4N7V2
// @description -
// @run-at document-start
// @updateURL https://raw.githubusercontent.com/V3D4N7V2/AutoJoinWebex/main/AutoJoinWebex.user.js
// @downloadURL https://raw.githubusercontent.com/V3D4N7V2/AutoJoinWebex/main/AutoJoinWebex.user.js
// ==/UserScript==
if (/https*\:\/\/.*\.webex\.com\/webappng\/sites\/.*\/meeting\/download/.test(window.location.href) && !(window.location.search == "?launchApp=true")) {
	window.location.replace(window.location.href.replace("download", "info"));
}
if (/https*\:\/\/.*\.webex\.com\/webappng\/sites\/.*\/meeting\/info/.test(window.location.href)) window.addEventListener('DOMContentLoaded', function() {
	var interval;
	var url = document.location.origin + "/webappng/api/v1/meetings/" + document.location.pathname.slice(-32) + document.location.search;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var object = JSON.parse(this.responseText);
			if (object.meetingOccurrenceStatus == null && object.meetingStarted == null) {
				clearInterval(interval);
				alert("Not Sufficient info , you'll have to join this manually");
				return;
			}
			if (object.meetingHost) {
				clearInterval(interval);
			}
			if (object.meetingOccurrenceStatus) {
				if (object.meetingOccurrenceStatus.inProgress) {
					clearInterval(interval);
					joinMeeting(object);
				}
			} else if (object.meetingStarted) {
				clearInterval(interval);
				joinMeeting(object);
			}
		}
	};
	interval = setInterval(function() {
		console.log("Checking");
		xhttp.open("GET", url, true);
		xhttp.send();
	}, 5000);
	console.log("Checking");
	xhttp.open("GET", url, true);
	xhttp.send();
}, false);

function joinMeeting(meeting) {
	console.log("Joining");
	if (document.getElementsByClassName("el-dropdown-menu__item thinclientjoin") != null && document.getElementsByClassName("el-dropdown-menu__item thinclientjoin")[0].getAttribute("aria-checked") == "true") {
		var url = new URL(window.location.href.replace("info", "download"));
		url.searchParams.set('launchApp', true);
		window.location.href = url;
	} else {
		var meetingURL = window.location.href.replace("info", "download");
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				var parser = new DOMParser();
				var htmlDoc = parser.parseFromString(this.responseText, 'text/html');
				var extendedData = htmlDoc.getElementById("extendedData").innerHTML;
				var object = JSON.parse(extendedData);
				window.location.href = object.simpleflowMapping.urlProtocollink;
				// window.location.href = "obsrec://";
				// switch (meeting.hostDisplayName) {
				// 	case "<HOST_NAME>":
				// 		<DO_SOMETHING_HERE>
				// 		break;
				// }
				window.close();
			}
		}
		xhttp.open("GET", meetingURL, true);
		xhttp.send();
	}
	return;
}