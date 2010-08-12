// ==UserScript==
// @name          YouTube HD Ultimate
// @description   The best of the hundreds of YouTube scripts, because we make it. Updated all the time, by me and you! Your favorite YouTube script is better than ever!
// @include       http://www.youtube.com/watch*
// @include       http://youtube.com/watch*
// @namespace     #aVg
// @license       CC-BY-NC-ND http://creativecommons.org/licenses/by-nc-nd/3.0/
// @version       1.2.0
// ==/UserScript==
// Do not fiddle with the script for any reason! If you're having problems, use the various contact options!
// This entire script is licensed under the license listed above. If you want to add a feature to it,
// request the feature. If you supply the code, I will give you attribution if you so desire.
function Params(A) {
	var obj = {}, isProp = true, cur, curProp = "", curValue = "";
	for (var i = 0; i < A.length; ++i) {
		cur = A.charAt(i);
		if (isProp) {
			if (cur=="=") {
				isProp = false;
				continue;
			} else curProp += cur;
		} else {
			if (cur=="&") {
				obj[curProp] = decodeURIComponent(curValue).replace(/\+/g, " ");
				curValue = "";
				curProp = "";
				isProp = true;
				continue;
			} else curValue += cur;
		}
	}
	return obj;
};
function $(A) {return document.getElementById(A);}
const thisVer="1.2.0";
function script() {
function refresh() {
	var pos = window.scrollY;
	window.scroll(0, pos + 1);
	window.scroll(0, pos);
}
function update(resp) {
	GM_xmlhttpRequest({
		url : "http://userscripts.org/scripts/source/31864.meta.js",
		method : "GET",
		onload : function(A) {
			if (A.responseText.match(/\/\/ @version       (\S+)/) == null) return;
			if (RegExp.$1 != thisVer) {
				if (confirm("There is a new version of YouTube HD Ultimate.\n\nInstall it?")) location.href = "http://userscripts.org/scripts/source/31864.user.js";
			} else if (resp) alert("There is no new version at this time.");
		}
	});
}
var now=new Date().getTime();
if ((GM_getValue("lastCheck"), now) <= (now - 86400000)) {
	GM_setValue("lastCheck", now);
	update(false);
}
function ifdo(A, B) {if (A) B(A)}
var player=unsafeWindow.document.getElementById("movie_player"),
	config = unsafeWindow.yt.config_, swfArgs = new Params(player.getAttribute("flashvars")),
	optionBox,
	toggler,
	globals = {},
	head=$("watch-headline-title"),
	newOpts = new Array();
document.title = document.title.substring(10);
var opts = {
	vq : new Array("Max Quality", ["240p", "360p", "480p", "720p", "1080p"], "Please choose the maximum video quality your computer can handle"),
	player : new Array("Player", ["v8", "v9as2", "Latest"], "Choose which player you prefer using."),
	autoplay : new Array("Autoplay", true, "By default, YouTube autoplays all of it's videos."),
	autobuffer : new Array("Autobuffer", false, "If you have a slow computer and/or a slow connection, turn this on to let the video download while it's paused, then you can hit the play button."),
	usecolor : new Array("Enable colors", true, "Choose this option if you want to enable custom colors. Colors only work in the old player."),
	c1 : new Array("Color 1", "000000", "The background color of the player bar. Must be in HEX format. (Six hex digits only)."),
	c2 : new Array("Color 2", "FFFFFF", "The foreground color of the player bar. Must be in HEX format. (Six hex digits only)."),
	hidenotes : new Array("Hide annotations", true, "Annotations are those annoying notes some users leave that say \"visit my site!\" or \"make sure to watch in HD!!\" in the video. But we already know that, right? You can turn them off if you want."),
	hideRate : new Array("Hide Warnings", false, "Choose this if you want to hide warnings about language, sex or violence."),
	fit : new Array("Fit to window", false, "When viewing videos in HIGH QUALITY or HIGH DEFINITION, the player will size itself to the window."),
	bigMode : new Array("Big mode", true, "Have a nice monitor? Like seeing things big? Turn this on. Ensures proper aspect ratio, and maximum viewing in the comfort of your browser."),
	min : new Array("Mini mode", false, "For those who use YouTube mainly for music, turn this on."),
	true720p : new Array("True 720p", false, "Turn this on for all HD videos to load in \"true\" 720p. Yeah, it's a pretty lame option on most computers."),
	useVol : new Array("Enabled Fixed Volume", false, "This will enabled the fixed volume feature (script sets volume to custom amount at the start of every video)."),
	vol : new Array("Volume", "50", "The volume, as an integer, from 0 to 100."),
	snapBack : new Array("Snap back", true, "Makes the video smaller if you turn off HD/HQ mid-video using the player's button."),
	loop : new Array("Loop", false, "Are you a loopy fanatic? Turn this on! Goes well if you watch a lot of AMV's I hear."),
	autoCinema : new Array("Automatic Cinema", false, "Like YouTube \"Comfort in Black\", this darkens everything except for the video player. Perfectly mimics YouTube's native cinema mode."),
	utterBlack : new Array("Total Black", false, "This will make cinema mode opaque black, as opposed to trasparent black."),
	jumpToPlayer : new Array("Jump to player", true, "Especially with big mode on, this is nice. It scrolls down to the video for you.")
};
ifdo($("watch-longform-player"), function(toggle) {
	toggle.removeAttribute("onclick");
	toggle.addEventListener("click", fitBig, false);
});
player.style.__defineSetter__("width", function(x) {
	player.setAttribute("style", "width:" + x + "!important;");
});
function Element(A, B, C, D) {
	A = document.createElement(A);
	if (B) for (var b in B) {
		var cur=B[b];
		if (b.indexOf("on")==0)try{A.addEventListener(b.substring(2), cur, false);}catch(e){alert([b.substring(2), cur])}
		else if (b=="style") A.setAttribute("style", B[b]);
		else A[b]=B[b];
	}
	if (D) for (var d in D) A.setAttribute(d, D[d]);
	if (C) for each(var c in C) A.appendChild(c);
	return A;
}
function center() {
	var psize = Number(player.style.width.replace(/ ?px/, ""));
	if (psize > 960) {
		player.style.marginLeft =  (Math.round(player.parentNode.offsetWidth / 2 - psize / 2) - 1) + "px";
	}
	else {
		player.style.marginLeft = "0px";
		var amt = -2 * (player.offsetLeft + player.parentNode.offsetLeft);
		if (psize >= 855) {
			amt += (psize - player.parentNode.offsetWidth);
			if (psize >= 908) amt -= psize - 907;
		}
		player.style.marginLeft = amt + "px";
	}
}
function fitToWindow() {
	player.setAttribute("style", "width:" + document.body.offsetWidth + "px!important;");
	player.parentNode.style.height = (window.innerHeight - 150) + "px";
	center();
}
function fitBig(force) {
	var already = (typeof force=="boolean") ? force : !unsafeWindow._hasclass($("baseDiv"), "watch-wide-mode");
	unsafeWindow.yt.www.watch.player.enableWideScreen(already, true);
	if (already)
		player.parentNode.style.height = player.style.height = (window.innerHeight - 150) + "px";
	else {
		player.style.marginLeft="0";
		player.style.width = "640px";
		player.style.height = "385px";
	}
	var ratio = config.IS_WIDESCREEN ? 1.77 : 1.33, w = Math.round((player.offsetHeight - 25) * ratio);
	if (w > player.parentNode.offsetWidth) {
		w = player.parentNode.offsetWidth;
		player.style.height = Math.round(w / ratio + 25) + "px";
	}
	player.style.width = w + "px";
	center();
}
// if (player.PercentLoaded()!=100) player.src += "";
GM_addStyle("#vidtools > * {\
	position : relative;\
	z-index : 6 !important;\
	float:right;\
}\
.yt-menulink-menu {z-index:700 !important}\
.yt-menulink {z-index:4 !important}\
.yt-rounded {background-color:white!important}\
#movie_player {\
width:1px!important;height:1px!important;\
}\
#light-switch {width:17px;height:25px;}\
#watch-longform-shade {z-index:5!important}\
.loop {\
	width: 11px;height: 15px;\
	margin-left: 3px;\
	margin-right: 3px;\
	margin-top: 4px;\
}\
.loop.on {\
	background-image: url(data:image/gif,GIF89a%10%00%10%00%F4%00%00%FF%F6%F6%FF%00%00%FE%F0%F0%FE66%FE%7F%7F%FE%05%05%FE%24%24%FE%CF%CF%FE%A2%A2%FE%15%15%FErr%FEbb%FE%DC%DC%FE%93%93%FE%BF%BF%FEEE%FESS%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%21%FF%0BNETSCAPE2.0%03%01%00%00%00%21%FE%1ACreated%20with%20ajaxload.info%00%21%F9%04%09%0A%00%00%00%2C%00%00%00%00%10%00%10%00%00%05P%20%20%8Edi%9E%A50%14l%21%2A%84%60%AA%AD%98%14%C6%91%1A5%80%F0%06%D9%88%80%5B%8D%04%3C%02i%85P%91%10%85%01%89%85%A2%8E%AC%29%2C%80IZ%F8%A2%24b%F0%BAH%92%908%84%A85%26%1Dx%895k%20%3C%13%14%F2y%1D%C5%EF%8FB%00%21%F9%04%09%0A%00%00%00%2C%00%00%00%00%10%00%10%00%00%05h%20%20%8AG%D2%8Ch%2A%1A%C5%E0%A8%A8%40%24E%7D%C0%C0%C1%D6%C5%02%08%8C%94%80eh%14%12%0C%C1%C0%20%40%11%0AL%C0%80%F0cQG%83%02B%B4%E5%B6P5%98%20%3C%AA5UdQ%B6%2B%E8%22%BE%A3g%940%A8%16%AE%A2%A1%8FAk%10%CF%23A%00%0B%3CP70%07%3C%09%04%800%0EY%068%2A%0D%09%87%23%21%00%21%F9%04%09%0A%00%00%00%2C%00%00%00%00%10%00%10%00%00%05%60%20%20%8E%23%F3%90%28%DA%14H%2A%0A%C4P%14%09-%A4%871%EF3%81%0A%3AC%CB1K%B4H%84%82%E1%06H.%98%24%D9%B1y%00%08%10%BE%D1%CC%05%D8j%0B.%81WD%40%DC%0EY%00%A20H%09%16%85%2C0%8EB%D4%0A%8Ek%10J%E6%ED%0CU%3F5w%03%04%7C%24k%0D%5C%29%0F%0C%8B%21%00%21%F9%04%09%0A%00%00%00%2C%00%00%00%00%10%00%10%00%00%05R%20%20%8Edi%9E%80%20%94%021%14%C5%40%A8%83C%1E%06%AC%17%C6k%8B%82%9C%01%21B%E4%60%3F%00%81%B7%02%BE%90%23E%828zBQX%80c%BBm%A2v%0B%12%22%A1%20%E9%C2%A3%60%81%60%86%0DUF%A6%19r%DC%19%0E%A5p%EB%29%F3f%FF%80%21%00%21%F9%04%09%0A%00%00%00%2C%00%00%00%00%10%00%10%00%00%05%60%20%20%8Edi%9E%A8%40%0CE1%10%C2%C9%18m%5D%18%C7%B9%18H%8C%D0%86%D8%28%07%10%8A%044%02%20%E7%28%2C%18%A6F%21aH%00XS%98%08%81m5%A4%B5%01bDH%B4%06%00%AA%B9ab%2C%0A%8E%25%80p3%16c%C4%23%B0%27%F8%0D%EC%22%07467P%26%2AX%2F%80%28%8C%8D%24%21%00%21%F9%04%09%0A%00%00%00%2C%00%00%00%00%10%00%10%00%00%05_%20%20%8Edi%9E%A8H%14%C5%40%08%A6%404%00%C2%B2%C6A%22I%91%08%B0%9A%A1%60%08%3En%85%05I0%24%88%18%8D%1EK7%B2%0DH%2C%07%C1%89-t%83%2A%82%83E%1A%14%10%A4%C3-%D1%60%A8%88%60%C0%02%F9%101%89%08%18%B0%97%40%8F%0EC7h%08%2F1%04f%05%5C%29%8B%8C%26%21%00%3B%00%00%00%00%00%00%00%00%00);\
}\
.loop.off {\
	background-image: url(data:image/gif;base64,R0lGODlhEAAQAKUuAG0AAG8AAoYAAIgAAYoAAIwAAI0AAJIAAJQAAZUAAJYAAJcAAaAAAKYAAKYAAaECAK4AAK8AALAAAa0BALAAA64BALQAAK8CALkAAboAALQDALsBAMEAAMQAAMkAAMcBAMsBAMwBANYAANcAANgAAdoAANoBAN4BAOMAANkDAOQBAOoBAP8AAP8BAP///////////////////////////////////////////////////////////////////////yH+DUJ5IEplcm9lbnowcgoAIfkEAQoAPwAsAAAAABAAEAAABmfAn3BILBqPxsJjozEIE8jfanSSCAUIx1HVKkWGlEWjiOJwRAgiBlI0eYSBIidF/ICQoU89hATphyQcRQBCHiZFEBhEByIdHChFDgoVQxMlLCpHDQgDQhcnIytRUD8EFhkMBVGrrERBADs=);\
}\
.light {background-position:0 -592px}\
.light:hover {background-position:-17px -592px!important;}\
.dark {background-position:-34px -592px}\
.dark:hover {background-position:-51px -592px!important;}\
#version {\
	float : right;\
	padding-left: 7px !important;padding-right: 3px;\
	background-color: white;\
	color: black;\
	-moz-border-radius-bottomright : 5px;-moz-border-radius-bottomleft : 3px;\
	border : solid grey 1px;\
}\
#opts {\
	background-color: black;\
	color : white;\
	position : absolute;\
	padding : 20px;\
	top : 80px;left : 25%;right : 25%;\
	-moz-border-radius : 12px;\
	border : 5px outset red;\
	z-index : 100000;\
}\
#myLinks {\
	float : right;\
	margin-top : -435px;\
	margin-right: 17px;\
	font-size: 16px;\
}\
#myLinks a {\
	color : white;\
	text-decoration: underline;\
	display: block;\
	font-size: 12px;\
}\
#opts input, #opts select {\
	margin-left: 3px;\
	padding-left: 4px;\
}\
#opts label {\
	display : block;\
	padding : 2px;\
}\
#opts label:hover {text-shadow: 1px 2px 1px yellow !important;}\
#opts label.on {\
	font-style : italic;\
	text-shadow : 1px 0 4px white;\
	color : white;\
}\
a {cursor:pointer;}\
#opts h1 {\
	background-color: red;\
	-moz-border-radius: 6px;\
	padding : 4px;\
	text-shadow: 1px -1px 4px white;\
}\
.watch-wide-mode, #watch-this-vid, #watch-player-div {padding-left:0!important}\
#opts p {\
	padding-left: 20px;\
	font-family : Calibri, Comic Sans MS;\
}");
optionBox = new Element("div", {
	innerHTML : "<h1>YouTube HD Ultimate Options</h1><span id=\"version\">v "+thisVer+"</span><p>Settings, if changed, will be applied on the next video. Roll over an option to find out more about it.</p>",
	style : "display : none",
	id : "opts"
});
for (var opt in opts) {
	var val = GM_getValue(opt), full = opts[opt][1], a, s=document.createElement("label"), append = true;
	if (val == null) {
		if (typeof full == "object") val = 0;
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
		if (val) s.className = "on";
		s.appendChild(a);
		s.appendChild(document.createTextNode(opts[opt][0]));
		append = false;
		break;
		case "number" :
		a = document.createElement("select");
		for (var i = full.length - 1; i>=0; --i) {
			a.appendChild(new Element("option", {
				textContent : full[i]
			}));
		}
		a.selectedIndex = val;
		break;
	}
	optionBox.addEventListener("keydown", refresh, false);
	a.addEventListener("click", refresh, false);
	a.name = opt;
	if (append) {
		s.appendChild(document.createTextNode(opts[opt][0]));
		s.appendChild(a);
	}
	s.title=opts[opt][2];
	optionBox.appendChild(s);
	opts[opt]=val;
	newOpts.push(a);
}
optionBox.appendChild(new Element("a", {
	className : "yt-button yt-button-primary",
	style : "float:right;margin-top:-25px;",
	onclick : function(E) {
		E.preventDefault();
		toggler.textContent="Show Ultimate Options";
		for (var newOpt, i=newOpts.length-1; i>=0; --i) {
			newOpt=newOpts[i];
			GM_setValue(newOpt.name, newOpt.nodeName=="SELECT" ? newOpt.selectedIndex : newOpt[newOpt.type=="text" ? "value" : "checked"]);
		}
		optionBox.style.display="none";
		refresh();
	}
	}, new Array(
		new Element("span", {
			textContent : "Save Options"
		})
	)
));
var linkbox;
optionBox.appendChild(linkbox=new Element("span",
	{
		id : "myLinks"
	}, new Array(
		document.createTextNode("Script links: ")
	)
));
var sLinks = {
	"homepage" : "http://userscripts.org/scripts/show/31864",
	"official" : "http://code.google.com/p/youtubehd/",
	"author" : "http://userscripts.org/users/avindra",
	"donate" : "https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=steveaarti%40gmail%2ecom&lc=US&item_name=Avindra%20Goolcharan&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donate_LG%2egif%3aNonHosted",
	"e-mail" : "mailto:aavindraa@gmail.com",
	"forums" : "http://userscripts.org/scripts/discuss/31864",
	"wiki + F1" : "http://code.google.com/p/youtubehd/wiki/mainPage",
	"open bugs + requests" : "http://code.google.com/p/youtubehd/issues/list",
	"all bugs + requests" : "http://code.google.com/p/youtubehd/issues/list?can=1",
	"new bug" : "http://code.google.com/p/youtubehd/issues/entry",
	"new request" : "http://code.google.com/p/youtubehd/issues/entry?template=Feature%20Request"
};
for (var link in sLinks) {
	linkbox.appendChild(new Element("a", {
		textContent : link,
		href : sLinks[link]
	}));
}
linkbox.appendChild(new Element("a", {
	textContent : "check for update",
	onclick : function(E) {
		E.preventDefault();
		update(true);
	}
}));
linkbox.appendChild(new Element("a", {
	textContent : "debugString",
	title : "This is for easing development. Don't worry about it unless Avindra tells you to use it.",
	onclick : function(E) {
		E.preventDefault();
		for (var arg in swfArgs) if (arg.indexOf("rv")==0) delete swfArgs[arg];
		opts.swfArgs = swfArgs;
		opts.ver = thisVer;
		opts.ua = navigator.userAgent;
		prompt("Here is your debugString:", opts.toSource());
	}
}));
document.body.appendChild(optionBox);
$("masthead-nav").appendChild(toggler=new Element("a", {
	style : "font-weight:bold; padding: 4px 10px; background-color: #0033CC; color: white; -moz-border-radius: 8px;",
	textContent : "Show Ultimate Options",
	onclick : function(E) {
		E.preventDefault();
		var isHidden = optionBox.style.display=="none";
		this.textContent= (isHidden ? "Hide" : "Show") + " Ultimate Options";
		optionBox.style.display=isHidden ? "inline" : "none";
		refresh();
	}
}));
if (!opts.bigMode && (opts.fit || opts.true720p)) opts.bigMode = true;
head.addEventListener("click", function() {
	this.scrollIntoView(true);
	refresh();
}, false);
if (opts.jumpToPlayer) head.scrollIntoView(true);
unsafeWindow.stateChanged=function(state) {
	if (state!=0) return;
	if (config.SWF_IS_PLAYING_ALL) unsafeWindow.gotoNext();
	else if (opts.loop) {
		player.seekTo(0, true);
		player.playVideo();
	}
};
unsafeWindow.onYouTubePlayerReady=function(A) {
	player.setPlaybackQuality(["hd1080", "hd720", "large", "medium", "small"][opts.vq]);
	if (opts.bigMode) fitBig(true);
	if (opts.min) {
		fitToWindow();
		player.style.height = "25px";
	} else if (opts.fit) {
		setTimeout(fitToWindow, 500);
		unsafeWindow.onresize = fitToWindow;
	} else if (opts.true720p && config.IS_HD_AVAILABLE) {
		player.style.width="1280px";
		player.style.height="745px";
		player.style.marginLeft="-160px";
	}
	if (opts.useVol && opts.vol.match(/(\d+)/)) player.setVolume(Number(RegExp.$1))
	if (opts.autobuffer) player.pauseVideo();
	if (player.getAttribute("wmode")!="transparent") return;
	if (!player.isMuted) {
		player.data += "";
		return;
	}
	globals.height = player.style.height;
	player.addEventListener("onStateChange", "stateChanged");
	if (opts.snapBack) {
		unsafeWindow.newFmt=function(fmt) {
			var isBig = /hd(?:72|108)0|large/.test(fmt);
			fitBig(isBig);
			if (isBig) {
				if (opts.fit) {
					unsafeWindow.onresize = fitToWindow;
					fitToWindow();
				}
			} else unsafeWindow.onresize = null;
		};
		player.addEventListener("onPlaybackQualityChange", "newFmt");
	}
	if (unsafeWindow.toggleLights && opts.autoCinema) unsafeWindow.toggleLights(true);
	player.focus();
};
if (opts.usecolor) {
	swfArgs.color1=opts.c1;
	swfArgs.color2=opts.c2;
}
if (opts.hidenotes) swfArgs.iv_load_policy="3";
if (config.SWF_IS_PLAYING_ALL) swfArgs.playnext = "1";
if (!opts.autoplay && !opts.autobuffer)
	swfArgs.autoplay="0";
else if (opts.autoplay) swfArgs.autoplay="1";
if (location.hash.match(/t=(?:(\d+)m)?(?:(\d+)s)?(\d*)/)) {
	var start=0;
	if (RegExp.$1) start += Number(RegExp.$1 + "0") * 6;
	if (RegExp.$2) start += Number(RegExp.$2);
	if (RegExp.$3) start += Number(RegExp.$3);
	swfArgs.start = start;
}
var ads=new Array("infringe", "invideo", "ctb", "interstitial", "watermark");
if (opts.hideRate) {
	ads.push("ratings");
	ads.push("ratings_module");
}
for (var i=ads.length-1;i>=0;i--)
	delete swfArgs[ads[i]];
/*
	swfArgs.cc_load_policy = "1";
	swfArgs.cc_font = "Arial Unicode MS, arial, verdana, _sans";
*/
swfArgs.vq=["hd1080", "hd720", "large", "medium", "small"][opts.vq];
if (swfArgs.fmt_map.indexOf("18")==0 && /3[457]|22/.test(swfArgs.fmt_map)) swfArgs.fmt_map=swfArgs.fmt_map.replace(/18.+?,/, "");
else if (/5\/(0|320x240)\/7\/0\/0/.test(swfArgs.fmt_map) && !/(?:18|22|3[457])\//.test(swfArgs.fmt_map)) {
	swfArgs.fmt_list = "18/" + (RegExp.$1=="0" ? "512000" : "640x360") + "/9/0/115," + swfArgs.fmt_list;
	swfArgs.fmt_map = swfArgs.fmt_list;
	if (swfArgs.fmt_stream_map.split(",").length == 1) {
		// 240p default, 360p secret
		if (location.search.indexOf("fmt=18")==-1) {
			location.replace(location.protocol + "//" + location.host +location.pathname + location.search + "&fmt=18" + location.hash);
			return;
		}
	}
	else swfArgs.fmt_stream_map = swfArgs.fmt_stream_map.match(/\|([^,]+)/)[1].replace(/itag=\d+/, "itag=18");
	swfArgs.fmt_url_map = swfArgs.fmt_stream_map.replace(/\|\|tc\.v\d+\.cache\d+\.c\.youtube\.com/g, "");
}
var vars="";
for (var arg in swfArgs) if (!/^(?:ad|ctb|rec)_/i.test(arg)) vars+="&"+arg+"="+encodeURIComponent(swfArgs[arg]);
player.setAttribute("flashvars", vars);
player.setAttribute("wmode", "transparent");
player.src = config.SWF_CONFIG["url" + new Array("", "_v8", "_v9as2")[opts.player]];
head = head.insertBefore(new Element("div", {id:"vidtools"}), head.firstChild);
document.addEventListener("keydown", function(E) {
	if ("INPUTEXTAREA".indexOf(E.target.nodeName) >= 0) return;
	switch (E.keyCode) {
		case 83: player.style.height = "25px"; return;
		case 80: player[(player.getPlayerState()==1 ? "pause" : "play") + "Video"](); return;
		case 82: player.seekTo(0, true); return;
		case 77: player[player.isMuted() ? "unMute" : "mute"](); return;
		case 69: player.seekTo(player.getDuration(), true); return;
		case 66: fitBig(); return;
		case 39: player.seekTo(player.getCurrentTime()+.5, true);return;
		case 37: player.seekTo(Math.round(player.getCurrentTime()-1), true);return;
		return;
	}
	if (E.ctrlKey)
		switch (E.keyCode) {
			case 38:
				E.preventDefault();
				player.setVolume(player.getVolume() + 4);
				return;
			case 40:
				E.preventDefault();
				player.setVolume(player.getVolume() - 4);
				return;
		}
}, false);
var shade, tog;
function toggle() {
	if (document.body.className.indexOf("watch-lights-off") != -1) {
		tog.className=tog.className.replace("dark", "light");
		shade.style.display = "none";
		document.body.className = document.body.className.replace("watch-lights-off", "");
	} else {
		shade.style.height = (window.innerHeight + window.scrollMaxY) + "px";
		tog.className=tog.className.replace("light", "dark");
		shade.style.display = "inline";
		document.body.className += " watch-lights-off";
	}
}
if (!unsafeWindow.toggleLights) {
	if (opts.autoCinema) document.body.className += " watch-lights-off";
	document.body.appendChild(shade=new Element("div", {onclick : toggle, id : "watch-longform-shade", style : "height : "+(window.innerHeight + window.scrollMaxY) + "px; display : " + (opts.autoCinema ? "" : "none")}));
	head.appendChild(tog=new Element("span", {
			id : "light-switch",
			className : "master-sprite " + (opts.autoCinema ? "dark" : "light"),
			onclick : toggle
	}));
}
head.appendChild(new Element("span", {
	className : "loop o" + (opts.loop ? "n" : "ff"),
	style : "padding-left:2px;padding-right:2px;",
	onclick : function() {
		GM_setValue("loop", opts.loop = !opts.loop);
		this.className = "loop o" + (opts.loop ? "n" : "ff");
	}
}));
head.appendChild(new Element("a", {
	style : "font-size:12px;padding-top:3px;padding-left:3px;",
	onclick : function() {
		if (this.textContent=="mini mode on")
		{
			this.textContent = "mini mode off";
			if (opts.fit) {
				unsafeWindow.onresize = fitToWindow;
				fitToWindow();
			} else player.style.height = globals.height;
		} else {
			this.textContent = "mini mode on";
			player.parentNode.style.height = player.style.height = "25px";
			unsafeWindow.onresize = null;
		}
	},
	textContent : "mini mode o" + (opts.min ? "n" : "ff")
}));
var mnuActions;
var watch=$("watch-actions");
$("watch-actions-right").appendChild(
	new Element("button", {
		className : "yt-uix-button yt-uix-tooltip",
		onclick : function(E) {
		//	E.preventDefault();
		}
	}, [
		new Element("span", {
			className : "yt-uix-button-content",
			textContent : "YTHD",
			onclick : function() {
			}
		}),
		new Element("img", {
			className : "yt-uix-button-arrow"
		}),
		mnuActions = new Element("ul", {
			className : "yt-uix-button-menu"
		})
	], {
		"type" : "button",
		"data-tooltip" : "This allows you to share links with friends with the current time and best quality."
	}),
	watch.childNodes[8]
);
var actions = {
	"Get time link" : function() {
			var time = "";
			var ct = player.getCurrentTime();
			var m = Math.floor( ct / 60), s = Math.round(ct - m * 60);
			time = "#t=";
			if (m > 0) time += m + "m";
			if (s > 0) time += s + "s";
			prompt("Here is your custom made link for highest quality:", "http://www.youtube.com/watch" + location.search.replace(/[?&]fmt=\d*/,"") + "&fmt=" + (config.IS_HD_AVAILABLE ? "22" : "18") + time);
	}
};
unsafeWindow.actions = actions;
for (var action in actions) {
	mnuActions.appendChild(new Element("li", null, [new Element(
	"span", {
		className : "yt-uix-button-menu-item",
		onclick : actions[action],
		textContent : action
	}, null, {
		onclick : "actions[\"" + action + "\"]()"
	})]));
}
if (opts.utterBlack) GM_addStyle("#watch-longform-shade, .watch-lights-off {background : black !important;}");

var downloads={"3gp":"17", mp4:"18"};
if (/(?:^|,)34/.test(swfArgs.fmt_map)) downloads["hq flv"]="34";
if (config.IS_HD_AVAILABLE || /(?:^|,)35/.test(swfArgs.fmt_map)) downloads["super hq flv"]="35";
if (config.IS_HD_AVAILABLE) {
	downloads["720p mp4"] = "22";
	if (/(?:^|,)37/.test(swfArgs.fmt_map)) downloads["1080p mp4"] = "37";
}
var info=$("watch-ratings-views"), block=new Element("div");
block.appendChild(document.createTextNode("Download this video as: "));
var flv=new Element("a", {
	href : "/get_video?video_id="+swfArgs.video_id+"&t="+swfArgs.t+"&asv=",
	innerHTML : "flv"
});
block.appendChild(flv);
for (var dl in downloads) {
	var temp=flv.cloneNode(false);
	temp.innerHTML=dl;
	temp.href+="&fmt="+downloads[dl];
	block.appendChild(document.createTextNode(" // "));
	block.appendChild(temp);
}
$("watch-info").appendChild(block);
ifdo($("watch-channel-icon"), function(f) {
	f.className="";
});
}
function listener() {
	setTimeout(function() {
	try{
		script();
	} catch(e) {
		alert("Error! Please let me know about it (http://userscripts.org/scripts/show/31864):\n" + e);
	}}, 1000);
	$("content").removeEventListener("DOMNodeInserted", listener, false);
}
if ($("watch-headline-title")) {
	try {
		script();
	} catch(e) {
		alert("Error! Please let me know about it (http://userscripts.org/scripts/show/31864):\n\n" + e);
	}
} else $("content").addEventListener("DOMNodeInserted", listener, false);