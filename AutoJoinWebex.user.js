
// ==UserScript==
// @name AutoJoinWebex
// @namespace Violentmonkey Scripts
// @match http*://*.webex.com/webappng/sites/*/meeting/info/*
// @grant none
// @version 1.0
// @author V3D4N7
// @description 9/15/2020, 2:00:49 PM
// @run-at document-idle
// ==/UserScript==
if (document.referrer.search("meeting/download/") == -1) {
	setTimeout(function() {
		var group = document.body.getElementsByClassName("el-button-group")[1];
		if (typeof group == 'undefined') {
			console.log("Group undefined");
			location.reload();
		}
		var state = document.body.getElementsByClassName("el-button-group")[1].children[0].disabled;
		setTimeout(function() {
			console.log("Delay");
		}, 3000);
		if (typeof state == 'undefined') {
			console.log("state undefined")
			location.reload();
		}
		if (!state) {
		  document.body.getElementsByClassName("el-button-group")[1].children[0].click();
		}
		if (state) {
			location.reload();
		}
		console.log(state);
	}, 10000);
} else {
	// do other stuff on meeting joined
}
