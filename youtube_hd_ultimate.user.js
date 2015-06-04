// ==UserScript==
// @name          YT+
// @description   The best of the hundreds of YouTube scripts, because we make it. Updated all the time, by me and you! Your favorite YouTube script is better than ever!
// @include       http*://www.youtube.com/watch*
// @include       http*://youtube.com/watch*
// @namespace     #aVg
// @grant         GM_addStyle
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_xmlhttpRequest
// @license       CC-BY-NC-SA http://creativecommons.org/licenses/by-nc-sa/3.0/
// @version       1.3.0-dev
// ==/UserScript==
if(self!=top) return;
if(!$("watch-headline-title")) location.replace(location.href.replace("#!", "?"));
var config = unsafeWindow.yt.config_;
const rev="1.3.0-dev";

function $(A) {return document.getElementById(A);}
function update(resp) {
	GM_xmlhttpRequest({
		url : "http://userscripts.org/scripts/source/31864.meta.js",
		method : "GET",
		onload : function(A) {
			if(A.responseText.match(/\/\/ @version {7}(\S+)/) == null) return;
			if(RegExp.$1 != rev) {
				if(confirm("There is a new version of YT+.\n\nInstall it?")) location.href = "http://userscripts.org/scripts/source/31864.user.js";
			} else if(resp) alert("There is no new version at this time.");
		}
	});
}
var now=new Date().getTime();
var last = GM_getValue("lastCheck");
if(!last || ((now - last) >= 86400000)) {
	GM_setValue("lastCheck", now.toString());
	update(false);
}
function script() {
var player=document.getElementById("movie_player");
var swfArgs = unsafeWindow.ytplayer.config.args;

var optionBox,
	globals = {
		getHeight : function(miniMode) {
			return miniMode ? 35 : 29;
		},
		setStyle : function(s, v) {
			player.parentNode.style[s] = v + "px";
		},
		setHeight : function(v) {
			this.setStyle("height", v);
		},
		setWidth : function(v) {
			this.setStyle("width", v);
		},
		handleSize : function(grow) {
			alert("test");
			fitBig(grow);
			unsafeWindow.onresize = grow && opts.fit ? fitToWindow : null;
		},
		isWide : false,
		refresh : function() {
			var pos = window.scrollY;
			window.scroll(0, pos - 1);
			window.scroll(0, pos);
		}
	},
	head=$("watch-headline-title"),
	newOpts = new Array();

var opts = {
	vq : new Array("Max Quality", new Array("240p", "360p", "480p", "720p", "1080p", "max"), "Please choose the maximum video quality your computer and network connection can handle."),
	autoplay : new Array("Autoplay", true, "By default, YouTube autoplays all of it's videos."),
	autobuffer : new Array("Autobuffer", false, "If you have a slow connection, turn this on to let the video download while paused, until you hit the play button."),
	hidenotes : new Array("Hide annotations", true, "Annotations are those annoying notes some users leave that say \"visit my site!\" or \"make sure to watch in HD!!\" in the video. You can turn them off."),
	hideRate : new Array("Hide Warnings", false, "Choose this if you want to hide warnings about language, sex or violence."),
	fit : new Array("Fit to window", true, "The player will size itself to the window, ensuring optimal screen use in windowed mode."),
	min : new Array("Mini mode", false, "For those who use YouTube mainly for music, turn this on. Can also be toggled from the button."),
	maxLock : new Array("True Resolution", false, "Turn this on to lock videos at their actual maximum resolution. Not recommended for most users."),
	useVol : new Array("Enabled Fixed Volume", false, "This will enabled the fixed volume feature (script sets volume to custom amount at the start of every video)."),
	vol : new Array("Volume", "50", "The volume, as an integer, from 0 to 100."),
	snapBack : new Array("Snap back", true, "Makes the video smaller if you turn off HD/HQ mid-video using the player's button."),
	loop : new Array("Loop", false, "Are you a loopy fanatic? Turn this on! Goes well if you watch a lot of AMV's I hear."),
	jumpToPlayer : new Array("Jump to player", true, "The script will scroll down to the video for you."),
	tools : new Array("Script tools", true, "Display the script toolbox to the right of the video title."),
	qlKill : new Array("Kill Quicklist", false, "Permanently removes the quicklist from view. Not recommended if you use playlists.")
};
function Element(A, B, C, D) {
	A = document.createElement(A);
	if(B) for(var b in B) {
		var cur=B[b];
		if(b.indexOf("on")==0) A.addEventListener(b.substring(2), cur, false);
		else if(b=="style") A.setAttribute("style", B[b]);
		else A[b]=B[b];
	}
	if(D) for(var d in D) A.setAttribute(d, D[d]);
	if(C) for(var c in C) A.appendChild(C[c]);
	return A;
}

function center() {
	var psize = player.offsetWidth;
	if(psize > 960) globals.setStyle("marginLeft", Math.round((960 - psize) / 2) - 1);
	else {
		if(globals.isWide) player.parentNode.style.removeProperty("margin-left");
		else globals.setStyle("marginLeft", Math.round((637 - psize) / 2) - 1);
	}
}
function fitToWindow() {
	fitBig(true);
}
function fitBig(force) {
	globals.isWide = (typeof force=="boolean") ? force : !globals.isWide;
	unsafeWindow.yt.www.watch.player.onPlayerSizeClicked(globals.isWide);
	if(globals.isWide) {
		var h = window.innerHeight - 150;
		if(opts.maxLock) {
			var max = ({
			"hd1080" :1080,
			"hd720" : 720,
			"large" : 600,
			"medium" : 480,
			"small" : 360
			})[player.getPlaybackQuality()] + globals.getHeight();
			if(h > max) h = max;
		}
		globals.setHeight(h);
	} else globals.setHeight("385");
	globals.setWidth(Math.round((player.offsetHeight - globals.getHeight()) * (config.IS_WIDESCREEN ? 1.77 : 1.32)));
	center();
}
GM_addStyle("#vidtools > * {\
	position : relative;\
	z-index : 6 !important;\
	float:right;\
} #vidtools {\
	display:inline;\
} .yt-menulink-menu {z-index:700 !important}\
.yt-menulink {z-index:4 !important}\
.yt-rounded {background-color:white!important}\
.loop {\
	width: 11px;height: 15px;\
	margin-left: 3px;\
	margin-right: 3px;\
	margin-top: 4px;\
} .loop.on {\
	background-image: url(data:image/gif;base64,R0lGODlhEAAQAPQAAP/29v8AAP7w8P42Nv5/f/4FBf4kJP7Pz/6iov4VFf5ycv5iYv7c3P6Tk\
/6/v/5FRf5TUwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkKAAAAIf4aQ3JlYXRlZCB3aXRoIGFqYXhsb2FkLmluZm8AIf8L\
TkVUU0NBUEUyLjADAQAAACwAAAAAEAAQAAAFUCAgjmRpnqUwFGwhKoRgqq2YFMaRGjWA8AbZiIBbjQQ8AmmFUJEQhQGJhaKOrCksgEla+KIkYvC6SJKQOISoNSYdeIk1\
ayA8ExTyeR3F749CACH5BAkKAAAALAAAAAAQABAAAAVoICCKR9KMaCoaxeCoqEAkRX3AwMHWxQIIjJSAZWgUEgzBwCBAEQpMwIDwY1FHgwJCtOW2UDWYIDyqNVVkUbYr6\
CK+o2eUMKgWrqKhj0FrEM8jQQALPFA3MAc8CQSAMA5ZBjgqDQmHIyEAIfkECQoAAAAsAAAAABAAEAAABWAgII4j85Ao2hRIKgrEUBQJLaSHMe8zgQo6Q8sxS7RIhILhBk\
gumCTZsXkACBC+0cwF2GoLLoFXREDcDlkAojBICRaFLDCOQtQKjmsQSubtDFU/NXcDBHwkaw1cKQ8MiyEAIfkECQoAAAAsAAAAABAAEAAABVIgII5kaZ6AIJQCMRTFQKiD\
Qx4GrBfGa4uCnAEhQuRgPwCBtwK+kCNFgjh6QlFYgGO7baJ2CxIioSDpwqNggWCGDVVGphly3BkOpXDrKfNm/4AhACH5BAkKAAAALAAAAAAQABAAAAVgICCOZGmeqEAMRT\
EQwskYbV0Yx7kYSIzQhtgoBxCKBDQCIOcoLBimRiFhSABYU5gIgW01pLUBYkRItAYAqrlhYiwKjiWAcDMWY8QjsCf4DewiBzQ2N1AmKlgvgCiMjSQhACH5BAkKAAAALAAA\
AAAQABAAAAVfICCOZGmeqEgUxUAIpkA0AMKyxkEiSZEIsJqhYAg+boUFSTAkiBiNHks3sg1ILAfBiS10gyqCg0UaFBCkwy3RYKiIYMAC+RAxiQgYsJdAjw5DN2gILzEEZg\
VcKYuMJiEAOw==);\
} .loop.off {\
	background-image: url(data:image/gif;base64,R0lGODlhEAAQAPMJAG4AAYoAAJUAAKkAALYAAcYAANkBAOYBAP8AAP///wAAAAAAAAAAAAAAAAAAAA\
AAACH5BAEKAAkAIf4NQnkgSmVyb2VuejByCgAsAAAAABAAEAAABE0wyUmrvTYMQoIUWHIYBiEFwnAdiKFKRFodRWGAE/FORiEBFRulhiFOjBZkolcBJoSUDUXQKxwqA5lk\
YEBcLVlPgmv4XnABzkAcarslEQA7);\
} #version {\
	float : right;\
	padding-left: 7px !important;padding-right: 3px;\
	background-color: white;\
	color: black;\
	-moz-border-radius-bottomright : 5px;-moz-border-radius-bottomleft : 3px;\
	border : solid grey 1px;\
} #opts {\
	background-color: black;\
	color : white;\
	position : absolute;\
	padding : 20px;\
	top : 80px;left : 25%;right : 25%;\
	-moz-border-radius : 12px;\
	border : 5px outset red;\
	z-index : 100000;\
} #myLinks {\
	float : right;\
	font-size: 16px;\
} #myLinks a {\
	color : white;\
	text-decoration: underline;\
	display: block;\
	font-size: 12px;\
	margin-top:7px;\
} #opts input, #opts select {\
	margin-left: 3px;\
	padding-left: 4px;\
} #opts label {\
	display : block;\
	padding : 2px;\
	cursor:pointer;\
} #opts label:hover {text-shadow: 1px 2px 1px yellow !important;}\
#opts label.on {\
	font-style : italic;\
	text-shadow : 1px 0 4px white;\
	color : white;\
} a {cursor:pointer;}\
#opts h1 {\
	background-color: red;\
	-moz-border-radius: 6px;\
	padding : 4px;\
	text-shadow: 1px -1px 4px white;\
} .watch-wide-mode, #watch-this-vid, #watch-player-div {padding-left:0!important}\
#opts p {\
	padding-left: 20px;\
	font-family : Calibri, Comic Sans MS;\
}");
optionBox = new Element("div", {
	innerHTML : "<h1>YT+ Options</h1><span id=\"version\">v "+rev+"</span><p>Settings, if changed, will be applied on the next video. Roll over an option to find out more about it.</p>",
	style : "display : none",
	id : "opts"
});
optionBox = optionBox.appendChild(new Element("div", {
	style : "float:left"
}));
for(var opt in opts) {
	var val = GM_getValue(opt), full = opts[opt][1], a, s=document.createElement("label"), append = true;
	if(val == null) {
		if(typeof full == "object") val = 0;
		else val = full;
	}
	switch (typeof val) {
	case "string" :
	a = document.createElement("input");
	a.value = val;
	break;
	case "boolean" :
	a = document.createElement("input");
	a.type = "checkbox";
	a.addEventListener("click", function() {this.parentNode.className = this.checked ? "on" : "";}, false);
	a.checked = val;
	if(val) s.className = "on";
	s.appendChild(a);
	s.appendChild(document.createTextNode(opts[opt][0]));
	append = false;
	break;
	case "number" :
	a = document.createElement("select");
	for(var i = full.length - 1; i>=0; --i)
		a.appendChild(new Element("option", {
			textContent : full[i]
		}));
	a.selectedIndex = val;
	break;
	}
	a.name = opt;
	if(append) {
		s.appendChild(document.createTextNode(opts[opt][0]));
		s.appendChild(a);
	}
	s.title=opts[opt][2];
	optionBox.appendChild(s);
	opts[opt]=val;
	newOpts.push(a);
}
if(opts.maxLock) opts.fit = true;
optionBox = optionBox.parentNode;
var linkbox;
optionBox.appendChild(linkbox=new Element("div",
	{
		id : "myLinks"
	}, new Array(
		document.createTextNode("Script links: ")
	)
));
optionBox.appendChild(new Element("br", {style : "clear:both"}));
optionBox.appendChild(new Element("a", {
	className : "yt-uix-button",
	style : "float: right; height: 20px; padding-top: 3px; margin-top: -25px; color: black;",
	onclick : function(E) {
		E.preventDefault();
		globals.toggler.textContent="Show YT+ Options";
		for(var newOpt, i=newOpts.length-1; i>=0; --i) {
			newOpt=newOpts[i];
			GM_setValue(newOpt.name, newOpt[newOpt.nodeName=="SELECT" ? "selectedIndex" : newOpt.type=="text" ? "value" : "checked"]);
		}
		optionBox.style.display="none";
	}
	}, new Array(
		new Element("a", {
			className : "yt-uix-button-default yt-uix-button",
			textContent : "Save Options"
		})
	)
));
var sLinks = {
	"homepage" : "http://github.com/avindra/youtubehd",
	"development" : "http://github.com/avindra/youtubehd",
	"author" : "http://twitter.com/avindra",
	"donate" : "https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=steveaarti%40gmail%2ecom&lc=US&item_name=Avindra%20Goolcharan&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donate_LG%2egif%3aNonHosted",
	"e-mail" : "mailto:aavindraa@gmail.com",
	"help / wiki" : "https://github.com/avindra/youtubehd/wiki",
	"issues" : "https://github.com/avindra/youtubehd/issues",
	"report issue / make request" : "https://github.com/avindra/youtubehd/issues/new"
};
for(var link in sLinks)
	linkbox.appendChild(new Element("a", {
		textContent : link,
		href : sLinks[link]
	}));
linkbox.appendChild(new Element("a", {
	textContent : "check for update",
	onclick : function(E) {
		E.preventDefault();
		update(true);
	}
}));
linkbox.appendChild(new Element("a", {
	textContent : "debugString",
	title : "This is for easing development. Don't worry about it unless the devs tell you to use it.",
	onclick : function(E) {
		E.preventDefault();
		for(var arg in swfArgs) if(arg.indexOf("rv")==0) delete swfArgs[arg];
		opts.swfArgs = swfArgs;
		opts.ver = rev;
		opts.ua = navigator.userAgent;
		opts.flash = unsafeWindow.navigator.plugins["Shockwave Flash"].description;
		opts.screen = {
			cur : { x : window.innerWidth, y : window.innerHeight},
			max : { x : screen.width, y : screen.height}
		};
		prompt("This is your debugString. Copy it with CTRL + X. If you don't know how to post code on userscripts.org, please use a pastebin to post it.", opts.toSource());
	}
}));
document.body.appendChild(optionBox);
var mh = $("yt-masthead-user");
mh.insertBefore(globals.toggler=new Element("button", {
	style : "margin-right:5px",
	textContent : "Show YT+ Options",
	className : "yt-uix-button-primary yt-uix-button",
	onclick : function(E) {
		E.preventDefault();
		globals.isHidden = optionBox.style.display=="none";
		this.textContent= (globals.isHidden ? "Hide" : "Show") + " YT+ Options";
		optionBox.style.display=globals.isHidden ? "inline" : "none";
		globals.refresh();
	}
}), mh.childNodes[0]);

head.addEventListener("click", function() {
	this.scrollIntoView(true);
}, false);
unsafeWindow.stateChanged=function(state) {
	console.log(state);
	switch(state) {
	case 3 :
	if(!globals.init) {
		globals.init = true;
		if(opts.jumpToPlayer) {
			head.scrollIntoView(true);
			globals.refresh();
		}
		if(opts.autobuffer) {
			player.seekTo(0, true);
			player.pauseVideo();
		}
	}
	break;
	case 0 :
	if(config.LIST_AUTO_PLAY_ON)  {
		if(config.SHUFFLE_ENABLED) {}
		var l = document.evaluate("//li[contains(@class, 'quicklist-item-playing')]", document.body, null, 9, null).singleNodeValue;
		if(l) {
			l = l.nextSibling;
			if(l) {
				location.href = l.firstChild.href; 
			}
		}
	}
	else if(opts.loop) {
		player.seekTo(0, true);
		player.playVideo();
	}
	return;
	}
};

function guaranteeExecute(code) {
	console.log(code);
	location.href = "javascript:setTimeout(function() {" + code + "}, 10); void(0);";
}

function contentEval(source) {
	if(typeof source == "function") source = '(' + source + ')();'

	var script = document.createElement('script');
	script.setAttribute("type", "application/javascript");
	script.textContent = source;

	document.body.appendChild(script);
}

contentEval (
	"opts = " + JSON.stringify(opts) + "; " + 
	"globals = " + JSON.stringify(globals) + ";";
);

contentEval(function() {
	player = document.getElementById("movie_player");
	document.title = document.title.substring(0, document.title.length - 10);

	var ClientSidePayload = {
		start : function() {
			function $(a) { return document.getElementById(a)}

			player.setPlaybackQuality(["highres", "hd1080", "hd720", "large", "medium", "small"][opts.vq]);

			if(opts.pauseOnLoad) $("movie_player").pauseVideo();

			var el = $("quicklist");
			if(el) {
				if(opts.qlKill) el.style.display = "none";
				else el.setAttribute("data-autohide-mode", "on");
			}
			if(opts.fit) fitToWindow();
			if(opts.min) {
				fitToWindow();
				globals.setHeight(globals.getHeight(true));
			} else if(opts.fit) window.onresize = fitToWindow;
			if(opts.useVol && opts.vol.match(/(\d+)/)) player.setVolume(Number(RegExp.$1));
			window.sizeClicked = globals.handleSize;
			player.addEventListener("onStateChange", "stateChanged");
			player.addEventListener("SIZE_CLICKED", "sizeClicked");
			player.addEventListener("NEXT_CLICKED", "yt.www.watch.player.onPlayerNextClicked");
			player.addEventListener("NEXT_SELECTED", "yt.www.watch.player.onPlayerNextSelected");
			if(opts.snapBack) {
				window.newFmt=function(fmt) {
					if(player.getPlaybackQuality()!=fmt) globals.handleSize(/hd(?:72|108)0|large/.test(fmt));
				};
				player.addEventListener("onPlaybackQualityChange", "newFmt");
			}
			globals.lastHeight = player.offsetHeight;
			player.focus();
		},
		ping : function() {
			if("setPlaybackQuality" in player)
			{
				ClientSidePayload.start();
			} else {
				setTimeout(this.ping, 200);
			}
		}
	};

	ClientSidePayload.ping();

});

if(opts.hidenotes) swfArgs.iv_load_policy="3";
if(config.LIST_AUTO_PLAY_ON) swfArgs.playnext = "1";
if(!opts.autoplay) {
	if(opts.autobuffer)
		opts.pauseOnLoad = true;
	else
		swfArgs.autoplay="0";
}
var ads=new Array("infringe", "invideo", "ctb", "interstitial", "watermark");
if(opts.hideRate) {
	ads.push("ratings_preroll");
	ads.push("ratings_module");
	ads.push("ratings3_module");
	ads.push("ratings");
}
for(var i=ads.length-1;i>=0;i--) delete swfArgs[ads[i]];
swfArgs.vq=["highres", "hd1080", "hd720", "large", "medium", "small"][opts.vq];
if(swfArgs.fmt_list.indexOf("18")==0 && /3[457]|22/.test(swfArgs.fmt_list)) swfArgs.fmt_list=swfArgs.fmt_list.replace(/18.+?,/, "");
else if(/5\/(0|320x240)\/7\/0\/0/.test(swfArgs.fmt_list)) {
	if(swfArgs.fmt_list.split(",").length == 1) {
		// 240p default, 360p secret
		if(location.search.indexOf("fmt=18")==-1) {
			location.replace(location.protocol + "//" + location.host +location.pathname + location.search + "&fmt=18" + location.hash);
			return;
		}
	} else if(!/(?:18|22|3[457])\//.test(swfArgs.fmt_list)) {
		swfArgs.url_encoded_fmt_stream_map = swfArgs.url_encoded_fmt_stream_map.match(/\|([^,]+)/)[1].replace(/itag=\d+/, "itag=18");
		swfArgs.fmt_list = "18/640x360/9/0/115," + swfArgs.fmt_list;
		swfArgs.url_encoded_fmt_stream_map = swfArgs.url_encoded_fmt_stream_map.replace(/\|\|tc\.v\d+\.cache\d+\.c\.youtube\.com/g, "");
	}
}

if(location.hash.match(/t=(?:(\d+)m)?(?:(\d+)s?)?/)) {
	var start=0;
	if(RegExp.$1) start += Number(RegExp.$1 + "0") * 6;
	if(RegExp.$2) start += Number(RegExp.$2);
	swfArgs.start = start;
}
var vars="";
for(var arg in swfArgs) if(!/^(?:ad|ctb|rec)_/i.test(arg)) vars+="&"+arg+"="+encodeURIComponent(swfArgs[arg]);
player.setAttribute("flashvars", vars.substring(1).replace(/%20/g, "+"));
unsafeWindow.console.log(swfArgs);

head = head.insertBefore(new Element("div", {id:"vidtools"}), head.firstChild);

document.addEventListener("keydown", function(E) {
	if("INPUTEXTAREA".indexOf(E.target.nodeName) >= 0) return;
	switch (E.keyCode) {
	case 83: globals.setHeight(globals.getHeight(true)); return;
	case 80: guaranteeExecute('player[(player.getPlayerState()==1 ? "pause" : "play") + "Video"]()'); return;
	case 82: player.seekTo(0, true); return;
	case 77: player[player.isMuted() ? "unMute" : "mute"](); return;
	case 69: player.seekTo(player.getDuration(), true); return;
	case 66: fitBig(); return;
	case 39: guaranteeExecute('player.seekTo(player.getCurrentTime()+.5, true)');return;
	case 37: guaranteeExecute('player.seekTo(Math.round(player.getCurrentTime()-1), true)');return;
	return;
	}
	if(E.ctrlKey)
		switch (E.keyCode) {
		case 38:
		E.preventDefault();
		guaranteeExecute("player.setVolume(player.getVolume() + 4)");
		return;
		case 40:
		E.preventDefault();
		guaranteeExecute("player.setVolume(player.getVolume() - 4)");
		return;
		}
}, false);
if(opts.tools) {
head.appendChild(new Element("span", {
	className : "loop o" + (opts.loop ? "n" : "ff"),
	style : "padding-left:2px;padding-right:2px;",
	onclick : function() {
		GM_setValue("loop", opts.loop = !opts.loop);
		this.className = "loop o" + (opts.loop ? "n" : "ff");
	}
}));
head.appendChild(new Element("a", {
	style : "font-size:12px;",
	onclick : function() {
		if(this.textContent=="mini mode on")
		{
			this.textContent = "mini mode off";
			if(opts.fit) {
				unsafeWindow.onresize = fitToWindow;
				fitToWindow();
			} else globals.setHeight(globals.lastHeight);
		} else {
			this.textContent = "mini mode on";
			globals.setHeight(globals.getHeight(true));
			unsafeWindow.onresize = null;
		}
	},
	textContent : "mini mode o" + (opts.min ? "n" : "ff")
}));
}


var downloads={5 : "terrible flv", 17 : "3gp", 18 : "mp4", 36 : "hq 3gp"}, dls = {};
for(var fmt_list = swfArgs.url_encoded_fmt_stream_map.split(","), i = fmt_list.length - 1; i >= 0; --i) {
	fmt_list[i] = fmt_list[i].substring(4);
	// var itagrgx = /itag=(\d+)/;
	// dls[fmt_list[i].match(itagrgx)[1]] = decodeURIComponent(fmt_list[i].replace(itagrgx, ""));
}
if(34 in dls) downloads[34]="hq flv";
if(config.IS_HD_AVAILABLE || (35 in dls)) downloads[35]="super hq flv";
if(config.IS_HD_AVAILABLE) {
	downloads[22] = "720p mp4";
	if(37 in dls) downloads[37] = "1080p mp4";
	if(38 in dls) downloads[38] = "4k mp4";
}
var trail = "&title=" + encodeURIComponent($("eow-title").title.replace(/"/g, "'"));
function adjust(link) {
	var r = GM_xmlhttpRequest({
		url : link.href,
		method : "GET",
		onreadystatechange : function(A) {
			switch(A.readyState) {
			case 2:
			case 3:
				// abort
				break;
			case 4:
				link.href = A.finalUrl + trail;
			}
		}
	});
}
var block=new Element("div");
block.appendChild(document.createTextNode("Download this video as a(n): "));
var flv=new Element("a", {
	href : "/get_video?video_id="+swfArgs.video_id+"&t="+swfArgs.watch_ajax_token,
	textContent : "flv"
});
adjust(block.appendChild(flv));
for(var dl in downloads) {
	var temp=flv.cloneNode(false);
	temp.appendChild(document.createTextNode(downloads[dl]));
	if(dl in dls)
		temp.href = dls[dl] + trail;
	else {
		temp.href += "&fmt=" + dl;
		adjust(temp);
	}
	temp.title = "fmtCode=" + dl;
	block.appendChild(document.createTextNode(" // "));
	block.appendChild(temp);
}
var commts = $("watch-header");
commts.appendChild(block);
var tail = "&fmt=", highest = "";
for(var dls in downloads) highest = dls;
tail += highest;

config.SHARE_URL += tail;
config.SHARE_URL_SHORT += tail;

}

try { 

script();

} catch(e )  {
	alert(e);
}