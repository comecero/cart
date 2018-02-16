/*
Comecero Kit version: ﻿1.0.6
https://comecero.com
https://github.com/comecero/kit
Copyright Comecero and other contributors. Released under MIT license. See LICENSE for details.
*/

var utils = (function () {

    // These are general, home-grown javascript functions for common functions used withing the app.

    function setCookie(name, value, minutes) {
        if (minutes) {
            var date = new Date();
            date.setTime(date.getTime() + (minutes * 60 * 1000));
            var expires = "; expires=" + date.toUTCString();
        }
        else var expires = "";
        document.cookie = name + "=" + value + expires + "; path=/";
    }

    function getCookie(name) {
        if (document.cookie.length > 0) {
            c_start = document.cookie.indexOf(name + "=");
            if (c_start != -1) {
                c_start = c_start + name.length + 1;
                c_end = document.cookie.indexOf(";", c_start);
                if (c_end == -1) {
                    c_end = document.cookie.length;
                }
                return unescape(document.cookie.substring(c_start, c_end));
            }
        }
        return null;
    }

    function deleteCookie(name) {
        setCookie(name, "", -60);
    }

    function resetCookieExpiration(name, minutes) {

        var value = getCookie(name);

        if (value != null) {
            setCookie(name, value, minutes);
        }

    }

    function getPageHashParameters() {

        return getHashParameters(window.location.href);

    }

    function getHashParameters(url) {

        var hashParameters = {};

        if (url.indexOf("#") == -1) {
            return hashParameters;
        }

        var e,
            a = /\+/g,  // Regex for replacing addition symbol with a space
            r = /([^&;=]+)=?([^&;]*)/g,
            d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
            q = url.substring(url.indexOf("#") + 1);

        while (e = r.exec(q))
            hashParameters[d(e[1])] = d(e[2]);

        return hashParameters;
    }

    function getPageQueryParameters() {

        return getQueryParameters(window.location.href);

    }

    function getQueryParameters(url) {

        if (url.indexOf("?") == -1) {
            return {};
        }

        q = url.substring(url.indexOf("?") + 1);

        // Strip off any hash parameters
        if (q.indexOf("#") > 0) {
            q = q.substring(0, q.indexOf("#"));
        }

        return parseQueryParameters(q);
    }

    function parseQueryParameters(query) {

        var queryParameters = {};

        if (isNullOrEmpty(query)) {
            return queryParameters;
        }

        var e,
        a = /\+/g,  // Regex for replacing addition symbol with a space
        r = /([^&;=]+)=?([^&;]*)/g,
        d = function (s) { return decodeURIComponent(s.replace(a, " ")); }
        var queryParameters = {};

        while (e = r.exec(query))
            queryParameters[d(e[1])] = d(e[2]);

        return queryParameters;

    }

    function appendParams(url, params) {

        if (params.length == 0) {
            return url;
        }

        url += "?";

        _.each(params, function (item, index) {
            url += index + "=" + item + "&";
        });

        // remove the trailing ampersand
        url = url.substring(0, (url.length - 1));

        return url;

    }

    function left(str, n) {
        if (n <= 0)
            return "";
        else if (n > String(str).length)
            return str;
        else
            return String(str).substring(0, n);
    }

    function right(str, n) {
        if (n <= 0)
            return "";
        else if (n > String(str).length)
            return str;
        else {
            var iLen = String(str).length;
            return String(str).substring(iLen, iLen - n);
        }
    }

    function isValidNumber(value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    }

    function isValidInteger(value) {

        if (isValidNumber(value) == false) {
            return false;
        }

        value = parseFloat(value);

        var result = (value === (parseInt(value) | 0));

        return result;
    }

    function isValidEmail(value) {

        // http://stackoverflow.com/a/46181/2002383 anystring@anystring.anystring
        return /\S+@\S+\.\S+/.test(value);

    }

    function getRandom() {
        return Math.floor((Math.random() * 10000000) + 1);
    }

    function hasProperty(obj, prop) {

        // Determine if an object has a particular property http://stackoverflow.com/a/136411/2002383

        if (obj != null) {
            var proto = obj.__proto__ || obj.constructor.prototype;
            return (prop in obj) &&
                (!(prop in proto) || proto[prop] !== obj[prop]);
        }

        return false;
    }

    function sumProperties(collection, prop) {

        // Get the sum of a particular property from a collection
        var sum = 0;

        _.each(collection, function (item) {
            if (hasProperty(item, prop)) {
                sum += item[prop];
            }
        });

        return sum;
    }

    function areEqual() {
        
        // For an unlimited number of parameters, determines if they are all equal, i.e. areEqual(x, y, z, ...)
        var len = arguments.length;
        for (var i = 1; i < len; i++) {
            if (arguments[i] == null || arguments[i] != arguments[i - 1])
                return false;
        }

        return true;
    }

    function isNullOrEmpty(string) {

        if (string == null || string == undefined) {
            return true;
        }

        if (string == "") {
            return true;
        }

        if (removeWhitespace(string) == null) {
            return true;
        }

        return false;

    }

    function stringsToBool(object) {

        // This converts all properties with "true" and "false" values to true and false, respectively.

        for (var property in object) {
            if (object.hasOwnProperty(property)) {
                if (object[property] === "false") {
                    object[property] = false;
                }
                if (object[property] === "true") {
                    object[property] = true;
                }
            }
        }
    }

    function stringToBool(string) {
        return (string == "true");
    }

    function removeWhitespace(string) {
        return string.replace(/ /g, '');
    }
    
    function convert(money, rate) {
        return Math.round((money * rate) * 100) / 100;
    }

    function luhnCheck(value) {

        var nCheck = 0, nDigit = 0, bEven = false;
        value = value.replace(/\D/g, "");

        for (var n = value.length - 1; n >= 0; n--) {
            var cDigit = value.charAt(n),
                nDigit = parseInt(cDigit, 10);

            if (bEven) {
                if ((nDigit *= 2) > 9) nDigit -= 9;
            }

            nCheck += nDigit;
            bEven = !bEven;
        }

        return (nCheck % 10) == 0;
    }

    function undefinedToNull(object) {
        for (var property in object) {
            if (object.hasOwnProperty(property)) {

                // If an object, run through all its properties
                if (Object.prototype.toString.call(object[property]) === '[object Object]') {
                    undefinedToNull(object[property]);
                }

                // If an array, run through all items in the array
                if (Object.prototype.toString.call(object[property]) === '[object Array]') {
                    for (var obj in object[property]) {
                        undefinedToNull(obj);
                    }
                }

                // Otherwise, convert to null
                if (object[property] === undefined) {
                    object[property] = null;
                }
            }
        }
    }

    function getChildrenElements(n, skipMe, type) {
        // Get children elements from an HTML element
        var r = [];
        for (; n; n = n.nextSibling)
            if (n.nodeType == 1 && n != skipMe)
                if (type) {
                    if (type.toUpperCase() == n.nodeName.toUpperCase()) {
                        r.push(n);
                    }
                } else {
                    r.push(n);
                }
        return r;
    };

    function getSiblingElements(n, type) {
        // Get sibling elements from an HTML element, excluding self.
        return getChildrenElements(n.parentNode.firstChild, n, type);
    }
    
    function getCurrentIsoDate(atStartOfDay) {

        var date = new Date();
        
        function pad(number) {
            var r = String(number);
            if (r.length === 1) {
                r = '0' + r;
            }
            return r;
        }
        
        var hours = "00";
        var minutes = "00";
        var seconds = "00"
        
        if (!atStartOfDay) {
            hours = date.getUTCHours();
            minutes = date.getUTCMinutes();
            seconds = date.getUTCSeconds();
        }

        return date.getUTCFullYear() 
        + '-' + pad(date.getUTCMonth() + 1) 
        + '-' + pad(date.getUTCDate())
        + 'T' + pad(hours) 
        + ':' + pad(minutes) 
        + ':' + pad(seconds) 
        + 'Z';
    };
    
    function repeat(char, number) {
        var e = "";
        for (i = 0; i < number; i++) {
            e += char;
        }
        return e;
    }
    
    function mergeParams(params, required, expand) {
        
        // If you have a string, parse it into an object
        if (_.isString(params)) {
            params = parseQueryParameters(params);
        }

        // If null, set as an empty object
        params = params || {};
        
        // Takes parameters, removes any hidden that are listed in required from the existing, adds any supplied expand parameters.

        var currentHide = String((params.hide || "")).split(",");
        var currentExpand = String((params.expand || "")).split(",");
        
        var newRequired = String((required || "")).split(",");
        var newExpand = String((expand || "")).split(",");

        // Remove items from hide that are in newRequired
        currentHide = _.reject(currentHide, function (val) {
            return (newRequired.indexOf(val) >= 0);
        });
        
        // Concat expand
        currentExpand = currentExpand.concat(newExpand);
        currentExpand = _.uniq(currentExpand);

        // Return
        params.hide = currentHide.join(",");
        params.expand = currentExpand.join(",");
        
        // Remove any leading or trailing commas
        params.hide = TrimIf(params.hide, ",");
        params.expand = TrimIf(params.expand, ",");

        return params;

    }
    
    function LeftTrimIf(str, char) {
        if (str) {
            if (str.substring(0, 1) == char) {
                str = str.substring(1);
            }
        }
        return str;
    }
    
    function RightTrimIf(str, char) {
        if (str) {
            if (str.charAt(str.length - 1) == "/") {
                str = str.substr(0, str.length - 1)
            }
        }
        return str;
    }
    
    function deDuplicateCsv(csv) {
        var array = csv.split(',');
        var unique = _.uniq(array);
        return unique.join(",");
    }
    
    function TrimIf(str, char) {
        return (RightTrimIf(LeftTrimIf(str, char), char));
    }
    
    function getLocale(language) {
        
        // Array of supported locales
        var locales = [];
        locales.push("af-na", "af-za", "af", "ar-ae", "ar-bh", "ar-dj", "ar-dz", "ar-eg", "ar-eh", "ar-er", "ar-il", "ar-iq", "ar-jo", "ar-km", "ar-kw", "ar-lb", "ar-ly", "ar-ma", "ar-mr", "ar-om", "ar-ps", "ar-qa", "ar-sa", "ar-sd", "ar-so", "ar-ss", "ar-sy", "ar-td", "ar-tn", "ar-ye", "ar", "az-cyrl-az", "az-cyrl", "az-latn-az", "az-latn", "az", "bg-bg", "bg", "bo-cn", "bo-in", "bo", "cs-cz", "cs", "da-dk", "da-gl", "da", "dav-ke", "dav", "de-at", "de-be", "de-ch", "de-de", "de-li", "de-lu", "de", "el-cy", "el-gr", "el", "en-ag", "en-ai", "en-as", "en-au", "en-bb", "en-be", "en-bm", "en-bs", "en-bw", "en-bz", "en-ca", "en-cc", "en-ck", "en-cm", "en-cx", "en-dg", "en-dm", "en-dsrt-us", "en-dsrt", "en-er", "en-fj", "en-fk", "en-fm", "en-gb", "en-gd", "en-gg", "en-gh", "en-gi", "en-gm", "en-gu", "en-gy", "en-hk", "en-ie", "en-im", "en-in", "en-io", "en-iso", "en-je", "en-jm", "en-ke", "en-ki", "en-kn", "en-ky", "en-lc", "en-lr", "en-ls", "en-mg", "en-mh", "en-mo", "en-mp", "en-ms", "en-mt", "en-mu", "en-mw", "en-na", "en-nf", "en-ng", "en-nr", "en-nu", "en-nz", "en-pg", "en-ph", "en-pk", "en-pn", "en-pr", "en-pw", "en-rw", "en-sb", "en-sc", "en-sd", "en-sg", "en-sh", "en-sl", "en-ss", "en-sx", "en-sz", "en-tc", "en-tk", "en-to", "en-tt", "en-tv", "en-tz", "en-ug", "en-um", "en-us", "en-vc", "en-vg", "en-vi", "en-vu", "en-ws", "en-za", "en-zm", "en-zw", "en", "es-ar", "es-bo", "es-cl", "es-co", "es-cr", "es-cu", "es-do", "es-ea", "es-ec", "es-es", "es-gq", "es-gt", "es-hn", "es-ic", "es-mx", "es-ni", "es-pa", "es-pe", "es-ph", "es-pr", "es-py", "es-sv", "es-us", "es-uy", "es-ve", "es", "et-ee", "et", "eu-es", "eu", "fa-af", "fa-ir", "fa", "fi-fi", "fi", "fil-ph", "fil", "fr-be", "fr-bf", "fr-bi", "fr-bj", "fr-bl", "fr-ca", "fr-cd", "fr-cf", "fr-cg", "fr-ch", "fr-ci", "fr-cm", "fr-dj", "fr-dz", "fr-fr", "fr-ga", "fr-gf", "fr-gn", "fr-gp", "fr-gq", "fr-ht", "fr-km", "fr-lu", "fr-ma", "fr-mc", "fr-mf", "fr-mg", "fr-ml", "fr-mq", "fr-mr", "fr-mu", "fr-nc", "fr-ne", "fr-pf", "fr-pm", "fr-re", "fr-rw", "fr-sc", "fr-sn", "fr-sy", "fr-td", "fr-tg", "fr-tn", "fr-vu", "fr-wf", "fr-yt", "fr", "hi-in", "hi", "hr-ba", "hr-hr", "hr", "hu-hu", "hu", "hy-am", "hy", "is-is", "is", "it-ch", "it-it", "it-sm", "it", "ja-jp", "ja", "ka-ge", "ka", "kab-dz", "kab", "kam-ke", "kam", "kk-cyrl-kz", "kk-cyrl", "kk", "kkj-cm", "kkj", "kl-gl", "kl", "kln-ke", "kln", "km-kh", "km", "ko-kp", "ko-kr", "ko", "kok-in", "kok", "lo-la", "lo", "lt-lt", "lt", "mg-mg", "mg", "mgh-mz", "mgh", "mgo-cm", "mgo", "mk-mk", "mk", "mn-cyrl-mn", "mn-cyrl", "mn", "ms-bn", "ms-latn-bn", "ms-latn-my", "ms-latn-sg", "ms-latn", "ms-my", "ms", "mt-mt", "mt", "ne-in", "ne-np", "ne", "nl-aw", "nl-be", "nl-bq", "nl-cw", "nl-nl", "nl-sr", "nl-sx", "nl", "no-no", "no", "pl-pl", "pl", "pt-ao", "pt-br", "pt-cv", "pt-gw", "pt-mo", "pt-mz", "pt-pt", "pt-st", "pt-tl", "pt", "ro-md", "ro-ro", "ro", "rof-tz", "rof", "ru-by", "ru-kg", "ru-kz", "ru-md", "ru-ru", "ru-ua", "ru", "shi-latn-ma", "shi-latn", "shi-tfng-ma", "shi-tfng", "shi", "sk-sk", "sk", "sl-si", "sl", "sq-al", "sq-mk", "sq-xk", "sq", "sr-cyrl-ba", "sr-cyrl-me", "sr-cyrl-rs", "sr-cyrl-xk", "sr-cyrl", "sr-latn-ba", "sr-latn-me", "sr-latn-rs", "sr-latn-xk", "sr-latn", "sr", "sv-ax", "sv-fi", "sv-se", "sv", "th-th", "th", "tl", "to-to", "to", "tr-cy", "tr-tr", "tr", "uk-ua", "uk", "uz-arab-af", "uz-arab", "uz-cyrl-uz", "uz-cyrl", "uz-latn-uz", "uz-latn", "uz", "vi-vn", "vi", "zh-cn", "zh-hans-cn", "zh-hans-hk", "zh-hans-mo", "zh-hans-sg", "zh-hans", "zh-hant-hk", "zh-hant-mo", "zh-hant-tw", "zh-hant", "zh-hk", "zh-tw", "zh");
        
        // If their locale exists in the locale list, use it. Otherwise, use the locale from their selected language.
        if (locales.indexOf(localStorage.getItem("locale")) >= 0) {
            return localStorage.getItem("locale");
        } else {
            return language;
        }

    }

    function cleanPrice(price) {
        // Strip everything except numbers and decimals

        if (typeof price === 'undefined' || price == null) {
            return "";
        }

        var cleanedPrice = price.toString().replace(/[^0-9\.\s]/g, '').trim();

        if (isNaN(cleanedPrice) == true || cleanedPrice.trim() == "") {
            // The value is not reasonably close enough for it to be a valid price. Just return the original input.
            return price;
        } else {
            // Truncate at two decimal places.
            return parseFloat(cleanedPrice).toFixed(2);
        }
    }
    
    return {
        setCookie: setCookie,
        getCookie: getCookie,
        deleteCookie: deleteCookie,
        getPageHashParameters: getPageHashParameters,
        getHashParameters: getHashParameters,
        getPageQueryParameters: getPageQueryParameters,
        getQueryParameters: getQueryParameters,
        appendParams: appendParams,
        left: left,
        right: right,
        isValidNumber: isValidNumber,
        isValidInteger: isValidInteger,
        getRandom: getRandom,
        stringsToBool: stringsToBool,
        stringToBool: stringToBool,
        hasProperty: hasProperty,
        areEqual: areEqual,
        sumProperties: sumProperties,
        isNullOrEmpty: isNullOrEmpty,
        resetCookieExpiration: resetCookieExpiration,
        removeWhitespace: removeWhitespace,
        luhnCheck: luhnCheck,
        undefinedToNull: undefinedToNull,
        parseQueryParameters: parseQueryParameters,
        isValidEmail: isValidEmail,
        getChildrenElements: getChildrenElements,
        getSiblingElements: getSiblingElements,
        convert: convert,
        getCurrentIsoDate: getCurrentIsoDate,
        repeat: repeat,
        mergeParams: mergeParams,
        deDuplicateCsv: deDuplicateCsv,
        getLocale: getLocale,
        cleanPrice: cleanPrice
    };

})();

// Prototypes
String.prototype.replaceAll = function (f, r) {
    return this.split(f).join(r);
}

// The following code needs to run after app.js and after utilities.js are loaded but before any directive, controller, etc. are run. This bootstraps the app at run time with the initial settings and configurations.

app.run(['$rootScope', '$http', 'SettingsService', 'StorageService', 'LanguageService', 'ApiService', function ($rootScope, $http, SettingsService, StorageService, LanguageService, ApiService) {
        
        // Get the settings
        var settings = SettingsService.get();
        
        // Enable CORS when running in development environments.
        if (settings.config.development) {
            $http.defaults.useXDomain = true;
        }
               
    // Establish the app language
        LanguageService.establishLanguage($rootScope.languagesPath);
        
        // Establish the pageview load code. This is used to send Analytics data to the platform.
        var loadPageview = function () {
            
            // Find the pageview script in the DOM. If present, append the pageview analytics source to the page. Replace any previous to not pollute the page with each pageview.
            var app_pageview = document.getElementById("app_pageview");
            
            if (app_pageview && settings.config.development != true) {
                var head = document.getElementsByTagName("head")[0];
                var js = document.createElement("script");
                js.id = "app_pageviewload";
                js.type = "text/javascript";
                js.src = "analytics/pageview.js";
                
                // Remove any existing
                if (document.getElementById("app_pageviewload") != null) {
                    head.removeChild(document.getElementById("app_pageviewload"));
                }
                
                // Add again to force reload.
                head.appendChild(js);
            }
        }
        
    }]);
/* FileSaver.js
 * A saveAs() FileSaver implementation.
 * 1.3.0
 *
 * By Eli Grey, http://eligrey.com
 * License: MIT
 *   See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
 */

/*global self */
/*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */

/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */

var saveAs = saveAs || (function(view) {
	"use strict";
	// IE <10 is explicitly unsupported
	if (typeof view === "undefined" || typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
		return;
	}
	var
		  doc = view.document
		  // only get URL when necessary in case Blob.js hasn't overridden it yet
		, get_URL = function() {
			return view.URL || view.webkitURL || view;
		}
		, save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
		, can_use_save_link = "download" in save_link
		, click = function(node) {
			var event = new MouseEvent("click");
			node.dispatchEvent(event);
		}
		, is_safari = /constructor/i.test(view.HTMLElement)
		, throw_outside = function(ex) {
			(view.setImmediate || view.setTimeout)(function() {
				throw ex;
			}, 0);
		}
		, force_saveable_type = "application/octet-stream"
		// the Blob API is fundamentally broken as there is no "downloadfinished" event to subscribe to
		, arbitrary_revoke_timeout = 1000 * 40 // in ms
		, revoke = function(file) {
			var revoker = function() {
				if (typeof file === "string") { // file is an object URL
					get_URL().revokeObjectURL(file);
				} else { // file is a File
					file.remove();
				}
			};
			setTimeout(revoker, arbitrary_revoke_timeout);
		}
		, dispatch = function(filesaver, event_types, event) {
			event_types = [].concat(event_types);
			var i = event_types.length;
			while (i--) {
				var listener = filesaver["on" + event_types[i]];
				if (typeof listener === "function") {
					try {
						listener.call(filesaver, event || filesaver);
					} catch (ex) {
						throw_outside(ex);
					}
				}
			}
		}
		, auto_bom = function(blob) {
			// prepend BOM for UTF-8 XML and text/* types (including HTML)
			// note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
			if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
				return new Blob([String.fromCharCode(0xFEFF), blob], {type: blob.type});
			}
			return blob;
		}
		, FileSaver = function(blob, name, no_auto_bom) {
			if (!no_auto_bom) {
				blob = auto_bom(blob);
			}
			// First try a.download, then web filesystem, then object URLs
			var
				  filesaver = this
				, type = blob.type
				, force = type === force_saveable_type
				, object_url
				, dispatch_all = function() {
					dispatch(filesaver, "writestart progress write writeend".split(" "));
				}
				// on any filesys errors revert to saving with object URLs
				, fs_error = function() {
					if (force && is_safari && view.FileReader) {
						// Safari doesn't allow downloading of blob urls
						var reader = new FileReader();
						reader.onloadend = function() {
							var base64Data = reader.result;
							view.location.href = "data:attachment/file" + base64Data.slice(base64Data.search(/[,;]/));
							filesaver.readyState = filesaver.DONE;
							dispatch_all();
						};
						reader.readAsDataURL(blob);
						filesaver.readyState = filesaver.INIT;
						return;
					}
					// don't create more object URLs than needed
					if (!object_url) {
						object_url = get_URL().createObjectURL(blob);
					}
					if (force) {
						view.location.href = object_url;
					} else {
						var opened = view.open(object_url, "_blank");
						if (!opened) {
							// Apple does not allow window.open, see https://developer.apple.com/library/safari/documentation/Tools/Conceptual/SafariExtensionGuide/WorkingwithWindowsandTabs/WorkingwithWindowsandTabs.html
							view.location.href = object_url;
						}
					}
					filesaver.readyState = filesaver.DONE;
					dispatch_all();
					revoke(object_url);
				}
			;
			filesaver.readyState = filesaver.INIT;

			if (can_use_save_link) {
				object_url = get_URL().createObjectURL(blob);
				setTimeout(function() {
					save_link.href = object_url;
					save_link.download = name;
					click(save_link);
					dispatch_all();
					revoke(object_url);
					filesaver.readyState = filesaver.DONE;
				});
				return;
			}

			fs_error();
		}
		, FS_proto = FileSaver.prototype
		, saveAs = function(blob, name, no_auto_bom) {
			return new FileSaver(blob, name || blob.name || "download", no_auto_bom);
		}
	;
	// IE 10+ (native saveAs)
	if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
		return function(blob, name, no_auto_bom) {
			name = name || blob.name || "download";

			if (!no_auto_bom) {
				blob = auto_bom(blob);
			}
			return navigator.msSaveOrOpenBlob(blob, name);
		};
	}

	FS_proto.abort = function(){};
	FS_proto.readyState = FS_proto.INIT = 0;
	FS_proto.WRITING = 1;
	FS_proto.DONE = 2;

	FS_proto.error =
	FS_proto.onwritestart =
	FS_proto.onprogress =
	FS_proto.onwrite =
	FS_proto.onabort =
	FS_proto.onerror =
	FS_proto.onwriteend =
		null;

	return saveAs;
}(
	   typeof self !== "undefined" && self
	|| typeof window !== "undefined" && window
	|| this.content
));
// `self` is undefined in Firefox for Android content script context
// while `this` is nsIContentFrameMessageManager
// with an attribute `content` that corresponds to the window

if (typeof module !== "undefined" && module.exports) {
  module.exports.saveAs = saveAs;
} else if ((typeof define !== "undefined" && define !== null) && (define.amd !== null)) {
  define([], function() {
    return saveAs;
  });
}

//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.
(function () { function n(n) { function t(t, r, e, u, i, o) { for (; i >= 0 && o > i; i += n) { var a = u ? u[i] : i; e = r(e, t[a], a, t) } return e } return function (r, e, u, i) { e = b(e, i, 4); var o = !k(r) && m.keys(r), a = (o || r).length, c = n > 0 ? 0 : a - 1; return arguments.length < 3 && (u = r[o ? o[c] : c], c += n), t(r, e, u, o, c, a) } } function t(n) { return function (t, r, e) { r = x(r, e); for (var u = O(t), i = n > 0 ? 0 : u - 1; i >= 0 && u > i; i += n) if (r(t[i], i, t)) return i; return -1 } } function r(n, t, r) { return function (e, u, i) { var o = 0, a = O(e); if ("number" == typeof i) n > 0 ? o = i >= 0 ? i : Math.max(i + a, o) : a = i >= 0 ? Math.min(i + 1, a) : i + a + 1; else if (r && i && a) return i = r(e, u), e[i] === u ? i : -1; if (u !== u) return i = t(l.call(e, o, a), m.isNaN), i >= 0 ? i + o : -1; for (i = n > 0 ? o : a - 1; i >= 0 && a > i; i += n) if (e[i] === u) return i; return -1 } } function e(n, t) { var r = I.length, e = n.constructor, u = m.isFunction(e) && e.prototype || a, i = "constructor"; for (m.has(n, i) && !m.contains(t, i) && t.push(i) ; r--;) i = I[r], i in n && n[i] !== u[i] && !m.contains(t, i) && t.push(i) } var u = this, i = u._, o = Array.prototype, a = Object.prototype, c = Function.prototype, f = o.push, l = o.slice, s = a.toString, p = a.hasOwnProperty, h = Array.isArray, v = Object.keys, g = c.bind, y = Object.create, d = function () { }, m = function (n) { return n instanceof m ? n : this instanceof m ? void (this._wrapped = n) : new m(n) }; "undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = m), exports._ = m) : u._ = m, m.VERSION = "1.8.3"; var b = function (n, t, r) { if (t === void 0) return n; switch (null == r ? 3 : r) { case 1: return function (r) { return n.call(t, r) }; case 2: return function (r, e) { return n.call(t, r, e) }; case 3: return function (r, e, u) { return n.call(t, r, e, u) }; case 4: return function (r, e, u, i) { return n.call(t, r, e, u, i) } } return function () { return n.apply(t, arguments) } }, x = function (n, t, r) { return null == n ? m.identity : m.isFunction(n) ? b(n, t, r) : m.isObject(n) ? m.matcher(n) : m.property(n) }; m.iteratee = function (n, t) { return x(n, t, 1 / 0) }; var _ = function (n, t) { return function (r) { var e = arguments.length; if (2 > e || null == r) return r; for (var u = 1; e > u; u++) for (var i = arguments[u], o = n(i), a = o.length, c = 0; a > c; c++) { var f = o[c]; t && r[f] !== void 0 || (r[f] = i[f]) } return r } }, j = function (n) { if (!m.isObject(n)) return {}; if (y) return y(n); d.prototype = n; var t = new d; return d.prototype = null, t }, w = function (n) { return function (t) { return null == t ? void 0 : t[n] } }, A = Math.pow(2, 53) - 1, O = w("length"), k = function (n) { var t = O(n); return "number" == typeof t && t >= 0 && A >= t }; m.each = m.forEach = function (n, t, r) { t = b(t, r); var e, u; if (k(n)) for (e = 0, u = n.length; u > e; e++) t(n[e], e, n); else { var i = m.keys(n); for (e = 0, u = i.length; u > e; e++) t(n[i[e]], i[e], n) } return n }, m.map = m.collect = function (n, t, r) { t = x(t, r); for (var e = !k(n) && m.keys(n), u = (e || n).length, i = Array(u), o = 0; u > o; o++) { var a = e ? e[o] : o; i[o] = t(n[a], a, n) } return i }, m.reduce = m.foldl = m.inject = n(1), m.reduceRight = m.foldr = n(-1), m.find = m.detect = function (n, t, r) { var e; return e = k(n) ? m.findIndex(n, t, r) : m.findKey(n, t, r), e !== void 0 && e !== -1 ? n[e] : void 0 }, m.filter = m.select = function (n, t, r) { var e = []; return t = x(t, r), m.each(n, function (n, r, u) { t(n, r, u) && e.push(n) }), e }, m.reject = function (n, t, r) { return m.filter(n, m.negate(x(t)), r) }, m.every = m.all = function (n, t, r) { t = x(t, r); for (var e = !k(n) && m.keys(n), u = (e || n).length, i = 0; u > i; i++) { var o = e ? e[i] : i; if (!t(n[o], o, n)) return !1 } return !0 }, m.some = m.any = function (n, t, r) { t = x(t, r); for (var e = !k(n) && m.keys(n), u = (e || n).length, i = 0; u > i; i++) { var o = e ? e[i] : i; if (t(n[o], o, n)) return !0 } return !1 }, m.contains = m.includes = m.include = function (n, t, r, e) { return k(n) || (n = m.values(n)), ("number" != typeof r || e) && (r = 0), m.indexOf(n, t, r) >= 0 }, m.invoke = function (n, t) { var r = l.call(arguments, 2), e = m.isFunction(t); return m.map(n, function (n) { var u = e ? t : n[t]; return null == u ? u : u.apply(n, r) }) }, m.pluck = function (n, t) { return m.map(n, m.property(t)) }, m.where = function (n, t) { return m.filter(n, m.matcher(t)) }, m.findWhere = function (n, t) { return m.find(n, m.matcher(t)) }, m.max = function (n, t, r) { var e, u, i = -1 / 0, o = -1 / 0; if (null == t && null != n) { n = k(n) ? n : m.values(n); for (var a = 0, c = n.length; c > a; a++) e = n[a], e > i && (i = e) } else t = x(t, r), m.each(n, function (n, r, e) { u = t(n, r, e), (u > o || u === -1 / 0 && i === -1 / 0) && (i = n, o = u) }); return i }, m.min = function (n, t, r) { var e, u, i = 1 / 0, o = 1 / 0; if (null == t && null != n) { n = k(n) ? n : m.values(n); for (var a = 0, c = n.length; c > a; a++) e = n[a], i > e && (i = e) } else t = x(t, r), m.each(n, function (n, r, e) { u = t(n, r, e), (o > u || 1 / 0 === u && 1 / 0 === i) && (i = n, o = u) }); return i }, m.shuffle = function (n) { for (var t, r = k(n) ? n : m.values(n), e = r.length, u = Array(e), i = 0; e > i; i++) t = m.random(0, i), t !== i && (u[i] = u[t]), u[t] = r[i]; return u }, m.sample = function (n, t, r) { return null == t || r ? (k(n) || (n = m.values(n)), n[m.random(n.length - 1)]) : m.shuffle(n).slice(0, Math.max(0, t)) }, m.sortBy = function (n, t, r) { return t = x(t, r), m.pluck(m.map(n, function (n, r, e) { return { value: n, index: r, criteria: t(n, r, e) } }).sort(function (n, t) { var r = n.criteria, e = t.criteria; if (r !== e) { if (r > e || r === void 0) return 1; if (e > r || e === void 0) return -1 } return n.index - t.index }), "value") }; var F = function (n) { return function (t, r, e) { var u = {}; return r = x(r, e), m.each(t, function (e, i) { var o = r(e, i, t); n(u, e, o) }), u } }; m.groupBy = F(function (n, t, r) { m.has(n, r) ? n[r].push(t) : n[r] = [t] }), m.indexBy = F(function (n, t, r) { n[r] = t }), m.countBy = F(function (n, t, r) { m.has(n, r) ? n[r]++ : n[r] = 1 }), m.toArray = function (n) { return n ? m.isArray(n) ? l.call(n) : k(n) ? m.map(n, m.identity) : m.values(n) : [] }, m.size = function (n) { return null == n ? 0 : k(n) ? n.length : m.keys(n).length }, m.partition = function (n, t, r) { t = x(t, r); var e = [], u = []; return m.each(n, function (n, r, i) { (t(n, r, i) ? e : u).push(n) }), [e, u] }, m.first = m.head = m.take = function (n, t, r) { return null == n ? void 0 : null == t || r ? n[0] : m.initial(n, n.length - t) }, m.initial = function (n, t, r) { return l.call(n, 0, Math.max(0, n.length - (null == t || r ? 1 : t))) }, m.last = function (n, t, r) { return null == n ? void 0 : null == t || r ? n[n.length - 1] : m.rest(n, Math.max(0, n.length - t)) }, m.rest = m.tail = m.drop = function (n, t, r) { return l.call(n, null == t || r ? 1 : t) }, m.compact = function (n) { return m.filter(n, m.identity) }; var S = function (n, t, r, e) { for (var u = [], i = 0, o = e || 0, a = O(n) ; a > o; o++) { var c = n[o]; if (k(c) && (m.isArray(c) || m.isArguments(c))) { t || (c = S(c, t, r)); var f = 0, l = c.length; for (u.length += l; l > f;) u[i++] = c[f++] } else r || (u[i++] = c) } return u }; m.flatten = function (n, t) { return S(n, t, !1) }, m.without = function (n) { return m.difference(n, l.call(arguments, 1)) }, m.uniq = m.unique = function (n, t, r, e) { m.isBoolean(t) || (e = r, r = t, t = !1), null != r && (r = x(r, e)); for (var u = [], i = [], o = 0, a = O(n) ; a > o; o++) { var c = n[o], f = r ? r(c, o, n) : c; t ? (o && i === f || u.push(c), i = f) : r ? m.contains(i, f) || (i.push(f), u.push(c)) : m.contains(u, c) || u.push(c) } return u }, m.union = function () { return m.uniq(S(arguments, !0, !0)) }, m.intersection = function (n) { for (var t = [], r = arguments.length, e = 0, u = O(n) ; u > e; e++) { var i = n[e]; if (!m.contains(t, i)) { for (var o = 1; r > o && m.contains(arguments[o], i) ; o++); o === r && t.push(i) } } return t }, m.difference = function (n) { var t = S(arguments, !0, !0, 1); return m.filter(n, function (n) { return !m.contains(t, n) }) }, m.zip = function () { return m.unzip(arguments) }, m.unzip = function (n) { for (var t = n && m.max(n, O).length || 0, r = Array(t), e = 0; t > e; e++) r[e] = m.pluck(n, e); return r }, m.object = function (n, t) { for (var r = {}, e = 0, u = O(n) ; u > e; e++) t ? r[n[e]] = t[e] : r[n[e][0]] = n[e][1]; return r }, m.findIndex = t(1), m.findLastIndex = t(-1), m.sortedIndex = function (n, t, r, e) { r = x(r, e, 1); for (var u = r(t), i = 0, o = O(n) ; o > i;) { var a = Math.floor((i + o) / 2); r(n[a]) < u ? i = a + 1 : o = a } return i }, m.indexOf = r(1, m.findIndex, m.sortedIndex), m.lastIndexOf = r(-1, m.findLastIndex), m.range = function (n, t, r) { null == t && (t = n || 0, n = 0), r = r || 1; for (var e = Math.max(Math.ceil((t - n) / r), 0), u = Array(e), i = 0; e > i; i++, n += r) u[i] = n; return u }; var E = function (n, t, r, e, u) { if (!(e instanceof t)) return n.apply(r, u); var i = j(n.prototype), o = n.apply(i, u); return m.isObject(o) ? o : i }; m.bind = function (n, t) { if (g && n.bind === g) return g.apply(n, l.call(arguments, 1)); if (!m.isFunction(n)) throw new TypeError("Bind must be called on a function"); var r = l.call(arguments, 2), e = function () { return E(n, e, t, this, r.concat(l.call(arguments))) }; return e }, m.partial = function (n) { var t = l.call(arguments, 1), r = function () { for (var e = 0, u = t.length, i = Array(u), o = 0; u > o; o++) i[o] = t[o] === m ? arguments[e++] : t[o]; for (; e < arguments.length;) i.push(arguments[e++]); return E(n, r, this, this, i) }; return r }, m.bindAll = function (n) { var t, r, e = arguments.length; if (1 >= e) throw new Error("bindAll must be passed function names"); for (t = 1; e > t; t++) r = arguments[t], n[r] = m.bind(n[r], n); return n }, m.memoize = function (n, t) { var r = function (e) { var u = r.cache, i = "" + (t ? t.apply(this, arguments) : e); return m.has(u, i) || (u[i] = n.apply(this, arguments)), u[i] }; return r.cache = {}, r }, m.delay = function (n, t) { var r = l.call(arguments, 2); return setTimeout(function () { return n.apply(null, r) }, t) }, m.defer = m.partial(m.delay, m, 1), m.throttle = function (n, t, r) { var e, u, i, o = null, a = 0; r || (r = {}); var c = function () { a = r.leading === !1 ? 0 : m.now(), o = null, i = n.apply(e, u), o || (e = u = null) }; return function () { var f = m.now(); a || r.leading !== !1 || (a = f); var l = t - (f - a); return e = this, u = arguments, 0 >= l || l > t ? (o && (clearTimeout(o), o = null), a = f, i = n.apply(e, u), o || (e = u = null)) : o || r.trailing === !1 || (o = setTimeout(c, l)), i } }, m.debounce = function (n, t, r) { var e, u, i, o, a, c = function () { var f = m.now() - o; t > f && f >= 0 ? e = setTimeout(c, t - f) : (e = null, r || (a = n.apply(i, u), e || (i = u = null))) }; return function () { i = this, u = arguments, o = m.now(); var f = r && !e; return e || (e = setTimeout(c, t)), f && (a = n.apply(i, u), i = u = null), a } }, m.wrap = function (n, t) { return m.partial(t, n) }, m.negate = function (n) { return function () { return !n.apply(this, arguments) } }, m.compose = function () { var n = arguments, t = n.length - 1; return function () { for (var r = t, e = n[t].apply(this, arguments) ; r--;) e = n[r].call(this, e); return e } }, m.after = function (n, t) { return function () { return --n < 1 ? t.apply(this, arguments) : void 0 } }, m.before = function (n, t) { var r; return function () { return --n > 0 && (r = t.apply(this, arguments)), 1 >= n && (t = null), r } }, m.once = m.partial(m.before, 2); var M = !{ toString: null }.propertyIsEnumerable("toString"), I = ["valueOf", "isPrototypeOf", "toString", "propertyIsEnumerable", "hasOwnProperty", "toLocaleString"]; m.keys = function (n) { if (!m.isObject(n)) return []; if (v) return v(n); var t = []; for (var r in n) m.has(n, r) && t.push(r); return M && e(n, t), t }, m.allKeys = function (n) { if (!m.isObject(n)) return []; var t = []; for (var r in n) t.push(r); return M && e(n, t), t }, m.values = function (n) { for (var t = m.keys(n), r = t.length, e = Array(r), u = 0; r > u; u++) e[u] = n[t[u]]; return e }, m.mapObject = function (n, t, r) { t = x(t, r); for (var e, u = m.keys(n), i = u.length, o = {}, a = 0; i > a; a++) e = u[a], o[e] = t(n[e], e, n); return o }, m.pairs = function (n) { for (var t = m.keys(n), r = t.length, e = Array(r), u = 0; r > u; u++) e[u] = [t[u], n[t[u]]]; return e }, m.invert = function (n) { for (var t = {}, r = m.keys(n), e = 0, u = r.length; u > e; e++) t[n[r[e]]] = r[e]; return t }, m.functions = m.methods = function (n) { var t = []; for (var r in n) m.isFunction(n[r]) && t.push(r); return t.sort() }, m.extend = _(m.allKeys), m.extendOwn = m.assign = _(m.keys), m.findKey = function (n, t, r) { t = x(t, r); for (var e, u = m.keys(n), i = 0, o = u.length; o > i; i++) if (e = u[i], t(n[e], e, n)) return e }, m.pick = function (n, t, r) { var e, u, i = {}, o = n; if (null == o) return i; m.isFunction(t) ? (u = m.allKeys(o), e = b(t, r)) : (u = S(arguments, !1, !1, 1), e = function (n, t, r) { return t in r }, o = Object(o)); for (var a = 0, c = u.length; c > a; a++) { var f = u[a], l = o[f]; e(l, f, o) && (i[f] = l) } return i }, m.omit = function (n, t, r) { if (m.isFunction(t)) t = m.negate(t); else { var e = m.map(S(arguments, !1, !1, 1), String); t = function (n, t) { return !m.contains(e, t) } } return m.pick(n, t, r) }, m.defaults = _(m.allKeys, !0), m.create = function (n, t) { var r = j(n); return t && m.extendOwn(r, t), r }, m.clone = function (n) { return m.isObject(n) ? m.isArray(n) ? n.slice() : m.extend({}, n) : n }, m.tap = function (n, t) { return t(n), n }, m.isMatch = function (n, t) { var r = m.keys(t), e = r.length; if (null == n) return !e; for (var u = Object(n), i = 0; e > i; i++) { var o = r[i]; if (t[o] !== u[o] || !(o in u)) return !1 } return !0 }; var N = function (n, t, r, e) { if (n === t) return 0 !== n || 1 / n === 1 / t; if (null == n || null == t) return n === t; n instanceof m && (n = n._wrapped), t instanceof m && (t = t._wrapped); var u = s.call(n); if (u !== s.call(t)) return !1; switch (u) { case "[object RegExp]": case "[object String]": return "" + n == "" + t; case "[object Number]": return +n !== +n ? +t !== +t : 0 === +n ? 1 / +n === 1 / t : +n === +t; case "[object Date]": case "[object Boolean]": return +n === +t } var i = "[object Array]" === u; if (!i) { if ("object" != typeof n || "object" != typeof t) return !1; var o = n.constructor, a = t.constructor; if (o !== a && !(m.isFunction(o) && o instanceof o && m.isFunction(a) && a instanceof a) && "constructor" in n && "constructor" in t) return !1 } r = r || [], e = e || []; for (var c = r.length; c--;) if (r[c] === n) return e[c] === t; if (r.push(n), e.push(t), i) { if (c = n.length, c !== t.length) return !1; for (; c--;) if (!N(n[c], t[c], r, e)) return !1 } else { var f, l = m.keys(n); if (c = l.length, m.keys(t).length !== c) return !1; for (; c--;) if (f = l[c], !m.has(t, f) || !N(n[f], t[f], r, e)) return !1 } return r.pop(), e.pop(), !0 }; m.isEqual = function (n, t) { return N(n, t) }, m.isEmpty = function (n) { return null == n ? !0 : k(n) && (m.isArray(n) || m.isString(n) || m.isArguments(n)) ? 0 === n.length : 0 === m.keys(n).length }, m.isElement = function (n) { return !(!n || 1 !== n.nodeType) }, m.isArray = h || function (n) { return "[object Array]" === s.call(n) }, m.isObject = function (n) { var t = typeof n; return "function" === t || "object" === t && !!n }, m.each(["Arguments", "Function", "String", "Number", "Date", "RegExp", "Error"], function (n) { m["is" + n] = function (t) { return s.call(t) === "[object " + n + "]" } }), m.isArguments(arguments) || (m.isArguments = function (n) { return m.has(n, "callee") }), "function" != typeof /./ && "object" != typeof Int8Array && (m.isFunction = function (n) { return "function" == typeof n || !1 }), m.isFinite = function (n) { return isFinite(n) && !isNaN(parseFloat(n)) }, m.isNaN = function (n) { return m.isNumber(n) && n !== +n }, m.isBoolean = function (n) { return n === !0 || n === !1 || "[object Boolean]" === s.call(n) }, m.isNull = function (n) { return null === n }, m.isUndefined = function (n) { return n === void 0 }, m.has = function (n, t) { return null != n && p.call(n, t) }, m.noConflict = function () { return u._ = i, this }, m.identity = function (n) { return n }, m.constant = function (n) { return function () { return n } }, m.noop = function () { }, m.property = w, m.propertyOf = function (n) { return null == n ? function () { } : function (t) { return n[t] } }, m.matcher = m.matches = function (n) { return n = m.extendOwn({}, n), function (t) { return m.isMatch(t, n) } }, m.times = function (n, t, r) { var e = Array(Math.max(0, n)); t = b(t, r, 1); for (var u = 0; n > u; u++) e[u] = t(u); return e }, m.random = function (n, t) { return null == t && (t = n, n = 0), n + Math.floor(Math.random() * (t - n + 1)) }, m.now = Date.now || function () { return (new Date).getTime() }; var B = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#x27;", "`": "&#x60;" }, T = m.invert(B), R = function (n) { var t = function (t) { return n[t] }, r = "(?:" + m.keys(n).join("|") + ")", e = RegExp(r), u = RegExp(r, "g"); return function (n) { return n = null == n ? "" : "" + n, e.test(n) ? n.replace(u, t) : n } }; m.escape = R(B), m.unescape = R(T), m.result = function (n, t, r) { var e = null == n ? void 0 : n[t]; return e === void 0 && (e = r), m.isFunction(e) ? e.call(n) : e }; var q = 0; m.uniqueId = function (n) { var t = ++q + ""; return n ? n + t : t }, m.templateSettings = { evaluate: /<%([\s\S]+?)%>/g, interpolate: /<%=([\s\S]+?)%>/g, escape: /<%-([\s\S]+?)%>/g }; var K = /(.)^/, z = { "'": "'", "\\": "\\", "\r": "r", "\n": "n", "\u2028": "u2028", "\u2029": "u2029" }, D = /\\|'|\r|\n|\u2028|\u2029/g, L = function (n) { return "\\" + z[n] }; m.template = function (n, t, r) { !t && r && (t = r), t = m.defaults({}, t, m.templateSettings); var e = RegExp([(t.escape || K).source, (t.interpolate || K).source, (t.evaluate || K).source].join("|") + "|$", "g"), u = 0, i = "__p+='"; n.replace(e, function (t, r, e, o, a) { return i += n.slice(u, a).replace(D, L), u = a + t.length, r ? i += "'+\n((__t=(" + r + "))==null?'':_.escape(__t))+\n'" : e ? i += "'+\n((__t=(" + e + "))==null?'':__t)+\n'" : o && (i += "';\n" + o + "\n__p+='"), t }), i += "';\n", t.variable || (i = "with(obj||{}){\n" + i + "}\n"), i = "var __t,__p='',__j=Array.prototype.join," + "print=function(){__p+=__j.call(arguments,'');};\n" + i + "return __p;\n"; try { var o = new Function(t.variable || "obj", "_", i) } catch (a) { throw a.source = i, a } var c = function (n) { return o.call(this, n, m) }, f = t.variable || "obj"; return c.source = "function(" + f + "){\n" + i + "}", c }, m.chain = function (n) { var t = m(n); return t._chain = !0, t }; var P = function (n, t) { return n._chain ? m(t).chain() : t }; m.mixin = function (n) { m.each(m.functions(n), function (t) { var r = m[t] = n[t]; m.prototype[t] = function () { var n = [this._wrapped]; return f.apply(n, arguments), P(this, r.apply(m, n)) } }) }, m.mixin(m), m.each(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function (n) { var t = o[n]; m.prototype[n] = function () { var r = this._wrapped; return t.apply(r, arguments), "shift" !== n && "splice" !== n || 0 !== r.length || delete r[0], P(this, r) } }), m.each(["concat", "join", "slice"], function (n) { var t = o[n]; m.prototype[n] = function () { return P(this, t.apply(this._wrapped, arguments)) } }), m.prototype.value = function () { return this._wrapped }, m.prototype.valueOf = m.prototype.toJSON = m.prototype.value, m.prototype.toString = function () { return "" + this._wrapped }, "function" == typeof define && define.amd && define("underscore", [], function () { return m }) }).call(this);
//# sourceMappingURL=underscore-min.map
// 2.2.1
angular.module("gettext", []), angular.module("gettext").constant("gettext", function (a) { return a }), angular.module("gettext").factory("gettextCatalog", ["gettextPlurals", "gettextFallbackLanguage", "$http", "$cacheFactory", "$interpolate", "$rootScope", function (a, b, c, d, e, f) { function g() { f.$broadcast("gettextLanguageChanged") } var h, i = "$$noContext", j = '<span id="test" title="test" class="tested">test</span>', k = angular.element("<span>" + j + "</span>").html() !== j, l = function (a) { return h.debug && h.currentLanguage !== h.baseLanguage?h.debugPrefix + a:a }, m = function (a) { return h.showTranslatedMarkers?h.translatedMarkerPrefix + a + h.translatedMarkerSuffix:a }; return h = { debug: !1, debugPrefix: "[MISSING]: ", showTranslatedMarkers: !1, translatedMarkerPrefix: "[", translatedMarkerSuffix: "]", strings: {}, baseLanguage: "en", currentLanguage: "en", cache: d("strings"), setCurrentLanguage: function (a) { this.currentLanguage = a, g() }, getCurrentLanguage: function () { return this.currentLanguage }, setStrings: function (a, b) { this.strings[a] || (this.strings[a] = {}); for (var c in b) { var d = b[c]; if (k && (c = angular.element("<span>" + c + "</span>").html()), angular.isString(d) || angular.isArray(d)) { var e = {}; e[i] = d, d = e } for (var f in d) { var h = d[f]; d[f] = angular.isArray(h)?h:[h] } this.strings[a][c] = d } g() }, getStringFormFor: function (b, c, d, e) { if (!b) return null; var f = this.strings[b] || {}, g = f[c] || {}, h = g[e || i] || []; return h[a(b, d)] }, getString: function (a, c, d) { var f = b(this.currentLanguage); return a = this.getStringFormFor(this.currentLanguage, a, 1, d) || this.getStringFormFor(f, a, 1, d) || l(a), a = c?e(a)(c):a, m(a) }, getPlural: function (a, c, d, f, g) { var h = b(this.currentLanguage); return c = this.getStringFormFor(this.currentLanguage, c, a, g) || this.getStringFormFor(h, c, a, g) || l(1 === a?c:d), f && (f.$count = a, c = e(c)(f)), m(c) }, loadRemote: function (a) { return c({ method: "GET", url: a, cache: h.cache }).then(function (a) { var b = a.data; for (var c in b) h.setStrings(c, b[c]); return a }) } } }]), angular.module("gettext").directive("translate", ["gettextCatalog", "$parse", "$animate", "$compile", "$window", function (a, b, c, d, e) { function f(a, b, c) { if (!a) throw new Error("You should add a " + b + " attribute whenever you add a " + c + " attribute.") } var g = function () { return String.prototype.trim?function (a) { return "string" == typeof a?a.trim():a }:function (a) { return "string" == typeof a?a.replace(/^\s*/, "").replace(/\s*$/, ""):a } }(), h = parseInt((/msie (\d+)/.exec(angular.lowercase(e.navigator.userAgent)) || [])[1], 10); return { restrict: "AE", terminal: !0, compile: function (e, i) { f(!i.translatePlural || i.translateN, "translate-n", "translate-plural"), f(!i.translateN || i.translatePlural, "translate-plural", "translate-n"); var j = g(e.html()), k = i.translatePlural, l = i.translateContext; return 8 >= h && "<!--IE fix-->" === j.slice(-13) && (j = j.slice(0, -13)), { post: function (e, f, h) { function i() { var b; k?(e = n || (n = e.$new()), e.$count = m(e), b = a.getPlural(e.$count, j, k, null, l)):b = a.getString(j, null, l); var h = f.contents(); if (0 !== h.length) { if (b === g(h.html())) return void (o && d(h)(e)); var i = angular.element("<span>" + b + "</span>"); d(i.contents())(e); var p = i.contents(); c.enter(p, f), c.leave(h) } } var m = b(h.translateN), n = null, o = !0; h.translateN && e.$watch(h.translateN, i), e.$on("gettextLanguageChanged", i), i(), o = !1 } } } } }]), angular.module("gettext").factory("gettextFallbackLanguage", function () { var a = {}, b = /([^_]+)_[^_]+$/; return function (c) { if (a[c]) return a[c]; var d = b.exec(c); return d?(a[c] = d[1], d[1]):null } }), angular.module("gettext").filter("translate", ["gettextCatalog", function (a) { function b(b, c) { return a.getString(b, null, c) } return b.$stateful = !0, b }]), angular.module("gettext").factory("gettextPlurals", function () { return function (a, b) { switch (a) {case "ay":case "bo":case "cgg":case "dz":case "fa":case "id":case "ja":case "jbo":case "ka":case "kk":case "km":case "ko":case "ky":case "lo":case "ms":case "my":case "sah":case "su":case "th":case "tt":case "ug":case "vi":case "wo":case "zh": return 0;case "is": return b % 10 != 1 || b % 100 == 11?1:0;case "jv": return 0 != b?1:0;case "mk": return 1 == b || b % 10 == 1?0:1;case "ach":case "ak":case "am":case "arn":case "br":case "fil":case "fr":case "gun":case "ln":case "mfe":case "mg":case "mi":case "oc":case "pt_BR":case "tg":case "ti":case "tr":case "uz":case "wa":case "zh": return b > 1?1:0;case "lv": return b % 10 == 1 && b % 100 != 11?0:0 != b?1:2;case "lt": return b % 10 == 1 && b % 100 != 11?0:b % 10 >= 2 && (10 > b % 100 || b % 100 >= 20)?1:2;case "be":case "bs":case "hr":case "ru":case "sr":case "uk": return b % 10 == 1 && b % 100 != 11?0:b % 10 >= 2 && 4 >= b % 10 && (10 > b % 100 || b % 100 >= 20)?1:2;case "mnk": return 0 == b?0:1 == b?1:2;case "ro": return 1 == b?0:0 == b || b % 100 > 0 && 20 > b % 100?1:2;case "pl": return 1 == b?0:b % 10 >= 2 && 4 >= b % 10 && (10 > b % 100 || b % 100 >= 20)?1:2;case "cs":case "sk": return 1 == b?0:b >= 2 && 4 >= b?1:2;case "sl": return b % 100 == 1?1:b % 100 == 2?2:b % 100 == 3 || b % 100 == 4?3:0;case "mt": return 1 == b?0:0 == b || b % 100 > 1 && 11 > b % 100?1:b % 100 > 10 && 20 > b % 100?2:3;case "gd": return 1 == b || 11 == b?0:2 == b || 12 == b?1:b > 2 && 20 > b?2:3;case "cy": return 1 == b?0:2 == b?1:8 != b && 11 != b?2:3;case "kw": return 1 == b?0:2 == b?1:3 == b?2:3;case "ga": return 1 == b?0:2 == b?1:7 > b?2:11 > b?3:4;case "ar": return 0 == b?0:1 == b?1:2 == b?2:b % 100 >= 3 && 10 >= b % 100?3:b % 100 >= 11?4:5;default: return 1 != b?1:0} } });
// https://github.com/oblador/angular-scroll
var duScrollDefaultEasing = function (e) { "use strict"; return .5 > e ? Math.pow(2 * e, 2) / 2 : 1 - Math.pow(2 * (1 - e), 2) / 2 }; angular.module("duScroll", ["duScroll.scrollspy", "duScroll.smoothScroll", "duScroll.scrollContainer", "duScroll.spyContext", "duScroll.scrollHelpers"]).value("duScrollDuration", 350).value("duScrollSpyWait", 100).value("duScrollGreedy", !1).value("duScrollOffset", 0).value("duScrollEasing", duScrollDefaultEasing).value("duScrollCancelOnEvents", "scroll mousedown mousewheel touchmove keydown").value("duScrollBottomSpy", !1).value("duScrollActiveClass", "active"), angular.module("duScroll.scrollHelpers", ["duScroll.requestAnimation"]).run(["$window", "$q", "cancelAnimation", "requestAnimation", "duScrollEasing", "duScrollDuration", "duScrollOffset", "duScrollCancelOnEvents", function (e, t, n, r, o, l, u, i) { "use strict"; var c = {}, a = function (e) { return "undefined" != typeof HTMLDocument && e instanceof HTMLDocument || e.nodeType && e.nodeType === e.DOCUMENT_NODE }, s = function (e) { return "undefined" != typeof HTMLElement && e instanceof HTMLElement || e.nodeType && e.nodeType === e.ELEMENT_NODE }, d = function (e) { return s(e) || a(e) ? e : e[0] }; c.duScrollTo = function (t, n, r, o) { var l; if (angular.isElement(t) ? l = this.duScrollToElement : angular.isDefined(r) && (l = this.duScrollToAnimated), l) return l.apply(this, arguments); var u = d(this); return a(u) ? e.scrollTo(t, n) : (u.scrollLeft = t, void (u.scrollTop = n)) }; var f, p; c.duScrollToAnimated = function (e, l, u, c) { u && !c && (c = o); var a = this.duScrollLeft(), s = this.duScrollTop(), d = Math.round(e - a), m = Math.round(l - s), S = null, g = 0, h = this, v = function (e) { (!e || g && e.which > 0) && (i && h.unbind(i, v), n(f), p.reject(), f = null) }; if (f && v(), p = t.defer(), 0 === u || !d && !m) return 0 === u && h.duScrollTo(e, l), p.resolve(), p.promise; var y = function (e) { null === S && (S = e), g = e - S; var t = g >= u ? 1 : c(g / u); h.scrollTo(a + Math.ceil(d * t), s + Math.ceil(m * t)), 1 > t ? f = r(y) : (i && h.unbind(i, v), f = null, p.resolve()) }; return h.duScrollTo(a, s), i && h.bind(i, v), f = r(y), p.promise }, c.duScrollToElement = function (e, t, n, r) { var o = d(this); (!angular.isNumber(t) || isNaN(t)) && (t = u); var l = this.duScrollTop() + d(e).getBoundingClientRect().top - t; return s(o) && (l -= o.getBoundingClientRect().top), this.duScrollTo(0, l, n, r) }, c.duScrollLeft = function (t, n, r) { if (angular.isNumber(t)) return this.duScrollTo(t, this.duScrollTop(), n, r); var o = d(this); return a(o) ? e.scrollX || document.documentElement.scrollLeft || document.body.scrollLeft : o.scrollLeft }, c.duScrollTop = function (t, n, r) { if (angular.isNumber(t)) return this.duScrollTo(this.duScrollLeft(), t, n, r); var o = d(this); return a(o) ? e.scrollY || document.documentElement.scrollTop || document.body.scrollTop : o.scrollTop }, c.duScrollToElementAnimated = function (e, t, n, r) { return this.duScrollToElement(e, t, n || l, r) }, c.duScrollTopAnimated = function (e, t, n) { return this.duScrollTop(e, t || l, n) }, c.duScrollLeftAnimated = function (e, t, n) { return this.duScrollLeft(e, t || l, n) }, angular.forEach(c, function (e, t) { angular.element.prototype[t] = e; var n = t.replace(/^duScroll/, "scroll"); angular.isUndefined(angular.element.prototype[n]) && (angular.element.prototype[n] = e) }) }]), angular.module("duScroll.polyfill", []).factory("polyfill", ["$window", function (e) { "use strict"; var t = ["webkit", "moz", "o", "ms"]; return function (n, r) { if (e[n]) return e[n]; for (var o, l = n.substr(0, 1).toUpperCase() + n.substr(1), u = 0; u < t.length; u++) if (o = t[u] + l, e[o]) return e[o]; return r } }]), angular.module("duScroll.requestAnimation", ["duScroll.polyfill"]).factory("requestAnimation", ["polyfill", "$timeout", function (e, t) { "use strict"; var n = 0, r = function (e, r) { var o = (new Date).getTime(), l = Math.max(0, 16 - (o - n)), u = t(function () { e(o + l) }, l); return n = o + l, u }; return e("requestAnimationFrame", r) }]).factory("cancelAnimation", ["polyfill", "$timeout", function (e, t) { "use strict"; var n = function (e) { t.cancel(e) }; return e("cancelAnimationFrame", n) }]), angular.module("duScroll.spyAPI", ["duScroll.scrollContainerAPI"]).factory("spyAPI", ["$rootScope", "$timeout", "$window", "$document", "scrollContainerAPI", "duScrollGreedy", "duScrollSpyWait", "duScrollBottomSpy", "duScrollActiveClass", function (e, t, n, r, o, l, u, i, c) { "use strict"; var a = function (o) { var a = !1, s = !1, d = function () { s = !1; var t, u = o.container, a = u[0], d = 0; "undefined" != typeof HTMLElement && a instanceof HTMLElement || a.nodeType && a.nodeType === a.ELEMENT_NODE ? (d = a.getBoundingClientRect().top, t = Math.round(a.scrollTop + a.clientHeight) >= a.scrollHeight) : t = Math.round(n.pageYOffset + n.innerHeight) >= r[0].body.scrollHeight; var f, p, m, S, g, h, v = i && t ? "bottom" : "top"; for (S = o.spies, p = o.currentlyActive, m = void 0, f = 0; f < S.length; f++) g = S[f], h = g.getTargetPosition(), h && (i && t || h.top + g.offset - d < 20 && (l || -1 * h.top + d) < h.height) && (!m || m[v] < h[v]) && (m = { spy: g }, m[v] = h[v]); m && (m = m.spy), p === m || l && !m || (p && (p.$element.removeClass(c), e.$broadcast("duScrollspy:becameInactive", p.$element, angular.element(p.getTargetElement()))), m && (m.$element.addClass(c), e.$broadcast("duScrollspy:becameActive", m.$element, angular.element(m.getTargetElement()))), o.currentlyActive = m) }; return u ? function () { a ? s = !0 : (d(), a = t(function () { a = !1, s && d() }, u, !1)) } : d }, s = {}, d = function (e) { var t = e.$id, n = { spies: [] }; return n.handler = a(n), s[t] = n, e.$on("$destroy", function () { f(e) }), t }, f = function (e) { var t = e.$id, n = s[t], r = n.container; r && r.off("scroll", n.handler), delete s[t] }, p = d(e), m = function (e) { return s[e.$id] ? s[e.$id] : e.$parent ? m(e.$parent) : s[p] }, S = function (e) { var t, n, r = e.$scope; if (r) return m(r); for (n in s) if (t = s[n], -1 !== t.spies.indexOf(e)) return t }, g = function (e) { for (; e.parentNode;) if (e = e.parentNode, e === document) return !0; return !1 }, h = function (e) { var t = S(e); t && (t.spies.push(e), t.container && g(t.container) || (t.container && t.container.off("scroll", t.handler), t.container = o.getContainer(e.$scope), t.container.on("scroll", t.handler).triggerHandler("scroll"))) }, v = function (e) { var t = S(e); e === t.currentlyActive && (t.currentlyActive = null); var n = t.spies.indexOf(e); -1 !== n && t.spies.splice(n, 1), e.$element = null }; return { addSpy: h, removeSpy: v, createContext: d, destroyContext: f, getContextForScope: m } }]), angular.module("duScroll.scrollContainerAPI", []).factory("scrollContainerAPI", ["$document", function (e) { "use strict"; var t = {}, n = function (e, n) { var r = e.$id; return t[r] = n, r }, r = function (e) { return t[e.$id] ? e.$id : e.$parent ? r(e.$parent) : void 0 }, o = function (n) { var o = r(n); return o ? t[o] : e }, l = function (e) { var n = r(e); n && delete t[n] }; return { getContainerId: r, getContainer: o, setContainer: n, removeContainer: l } }]), angular.module("duScroll.smoothScroll", ["duScroll.scrollHelpers", "duScroll.scrollContainerAPI"]).directive("duSmoothScroll", ["duScrollDuration", "duScrollOffset", "scrollContainerAPI", function (e, t, n) { "use strict"; return { link: function (r, o, l) { o.on("click", function (o) { if (l.href && -1 !== l.href.indexOf("#") || "" !== l.duSmoothScroll) { var u = l.href ? l.href.replace(/.*(?=#[^\s]+$)/, "").substring(1) : l.duSmoothScroll, i = document.getElementById(u) || document.getElementsByName(u)[0]; if (i && i.getBoundingClientRect) { o.stopPropagation && o.stopPropagation(), o.preventDefault && o.preventDefault(); var c = l.offset ? parseInt(l.offset, 10) : t, a = l.duration ? parseInt(l.duration, 10) : e, s = n.getContainer(r); s.duScrollToElement(angular.element(i), isNaN(c) ? 0 : c, isNaN(a) ? 0 : a) } } }) } } }]), angular.module("duScroll.spyContext", ["duScroll.spyAPI"]).directive("duSpyContext", ["spyAPI", function (e) { "use strict"; return { restrict: "A", scope: !0, compile: function (t, n, r) { return { pre: function (t, n, r, o) { e.createContext(t) } } } } }]), angular.module("duScroll.scrollContainer", ["duScroll.scrollContainerAPI"]).directive("duScrollContainer", ["scrollContainerAPI", function (e) { "use strict"; return { restrict: "A", scope: !0, compile: function (t, n, r) { return { pre: function (t, n, r, o) { r.$observe("duScrollContainer", function (r) { angular.isString(r) && (r = document.getElementById(r)), r = angular.isElement(r) ? angular.element(r) : n, e.setContainer(t, r), t.$on("$destroy", function () { e.removeContainer(t) }) }) } } } } }]), angular.module("duScroll.scrollspy", ["duScroll.spyAPI"]).directive("duScrollspy", ["spyAPI", "duScrollOffset", "$timeout", "$rootScope", function (e, t, n, r) { "use strict"; var o = function (e, t, n, r) { angular.isElement(e) ? this.target = e : angular.isString(e) && (this.targetId = e), this.$scope = t, this.$element = n, this.offset = r }; return o.prototype.getTargetElement = function () { return !this.target && this.targetId && (this.target = document.getElementById(this.targetId) || document.getElementsByName(this.targetId)[0]), this.target }, o.prototype.getTargetPosition = function () { var e = this.getTargetElement(); return e ? e.getBoundingClientRect() : void 0 }, o.prototype.flushTargetCache = function () { this.targetId && (this.target = void 0) }, { link: function (l, u, i) { var c, a = i.ngHref || i.href; if (a && -1 !== a.indexOf("#") ? c = a.replace(/.*(?=#[^\s]+$)/, "").substring(1) : i.duScrollspy ? c = i.duScrollspy : i.duSmoothScroll && (c = i.duSmoothScroll), c) { var s = n(function () { var n = new o(c, l, u, -(i.offset ? parseInt(i.offset, 10) : t)); e.addSpy(n), l.$on("$locationChangeSuccess", n.flushTargetCache.bind(n)); var a = r.$on("$stateChangeSuccess", n.flushTargetCache.bind(n)); l.$on("$destroy", function () { e.removeSpy(n), a() }) }, 0, !1); l.$on("$destroy", function () { n.cancel(s) }) } } } }]);
//# sourceMappingURL=angular-scroll.min.js.map
/*! 
 * angular-loading-bar v0.8.0
 * https://chieffancypants.github.io/angular-loading-bar
 * Copyright (c) 2015 Wes Cruver
 * License: MIT
 */
!function(){"use strict";angular.module("angular-loading-bar",["cfp.loadingBarInterceptor"]),angular.module("chieffancypants.loadingBar",["cfp.loadingBarInterceptor"]),angular.module("cfp.loadingBarInterceptor",["cfp.loadingBar"]).config(["$httpProvider",function(a){var b=["$q","$cacheFactory","$timeout","$rootScope","$log","cfpLoadingBar",function(b,c,d,e,f,g){function h(){d.cancel(j),g.complete(),l=0,k=0}function i(b){var d,e=c.get("$http"),f=a.defaults;!b.cache&&!f.cache||b.cache===!1||"GET"!==b.method&&"JSONP"!==b.method||(d=angular.isObject(b.cache)?b.cache:angular.isObject(f.cache)?f.cache:e);var g=void 0!==d?void 0!==d.get(b.url):!1;return void 0!==b.cached&&g!==b.cached?b.cached:(b.cached=g,g)}var j,k=0,l=0,m=g.latencyThreshold;return{request:function(a){return a.ignoreLoadingBar||i(a)||(e.$broadcast("cfpLoadingBar:loading",{url:a.url}),0===k&&(j=d(function(){g.start()},m)),k++,g.set(l/k)),a},response:function(a){return a&&a.config?(a.config.ignoreLoadingBar||i(a.config)||(l++,e.$broadcast("cfpLoadingBar:loaded",{url:a.config.url,result:a}),l>=k?h():g.set(l/k)),a):(f.error("Broken interceptor detected: Config object not supplied in response:\n https://github.com/chieffancypants/angular-loading-bar/pull/50"),a)},responseError:function(a){return a&&a.config?(a.config.ignoreLoadingBar||i(a.config)||(l++,e.$broadcast("cfpLoadingBar:loaded",{url:a.config.url,result:a}),l>=k?h():g.set(l/k)),b.reject(a)):(f.error("Broken interceptor detected: Config object not supplied in rejection:\n https://github.com/chieffancypants/angular-loading-bar/pull/50"),b.reject(a))}}}];a.interceptors.push(b)}]),angular.module("cfp.loadingBar",[]).provider("cfpLoadingBar",function(){this.autoIncrement=!0,this.includeSpinner=!0,this.includeBar=!0,this.latencyThreshold=100,this.startSize=.02,this.parentSelector="body",this.spinnerTemplate='<div id="loading-bar-spinner"><div class="spinner-icon"></div></div>',this.loadingBarTemplate='<div id="loading-bar"><div class="bar"><div class="peg"></div></div></div>',this.$get=["$injector","$document","$timeout","$rootScope",function(a,b,c,d){function e(){k||(k=a.get("$animate"));var e=b.find(n).eq(0);c.cancel(m),r||(d.$broadcast("cfpLoadingBar:started"),r=!0,v&&k.enter(o,e,angular.element(e[0].lastChild)),u&&k.enter(q,e,angular.element(e[0].lastChild)),f(w))}function f(a){if(r){var b=100*a+"%";p.css("width",b),s=a,t&&(c.cancel(l),l=c(function(){g()},250))}}function g(){if(!(h()>=1)){var a=0,b=h();a=b>=0&&.25>b?(3*Math.random()+3)/100:b>=.25&&.65>b?3*Math.random()/100:b>=.65&&.9>b?2*Math.random()/100:b>=.9&&.99>b?.005:0;var c=h()+a;f(c)}}function h(){return s}function i(){s=0,r=!1}function j(){k||(k=a.get("$animate")),d.$broadcast("cfpLoadingBar:completed"),f(1),c.cancel(m),m=c(function(){var a=k.leave(o,i);a&&a.then&&a.then(i),k.leave(q)},500)}var k,l,m,n=this.parentSelector,o=angular.element(this.loadingBarTemplate),p=o.find("div").eq(0),q=angular.element(this.spinnerTemplate),r=!1,s=0,t=this.autoIncrement,u=this.includeSpinner,v=this.includeBar,w=this.startSize;return{start:e,set:f,status:h,inc:g,complete:j,autoIncrement:this.autoIncrement,includeSpinner:this.includeSpinner,latencyThreshold:this.latencyThreshold,parentSelector:this.parentSelector,startSize:this.startSize}}]})}();
(function (window) {
    'use strict';
    angular.module('tmh.dynamicLocale', []).provider('tmhDynamicLocale', function () {

        var defaultLocale,
          localeLocationPattern = 'angular/i18n/angular-locale_{{locale}}.js',
          storageFactory = 'tmhDynamicLocaleStorageCache',
          storage,
          storeKey = 'tmhDynamicLocale.locale',
          promiseCache = {},
          activeLocale;

        /**
         * Loads a script asynchronously
         *
         * @param {string} url The url for the script
         @ @param {function) callback A function to be called once the script is loaded
         */
        function loadScript(url, callback, errorCallback, $timeout) {
            var script = document.createElement('script'),
              body = document.getElementsByTagName('body')[0],
              removed = false;

            script.type = 'text/javascript';
            if (script.readyState) { // IE
                script.onreadystatechange = function () {
                    if (script.readyState === 'complete' ||
                        script.readyState === 'loaded') {
                        script.onreadystatechange = null;
                        $timeout(
                          function () {
                              if (removed) return;
                              removed = true;
                              body.removeChild(script);
                              callback();
                          }, 30, false);
                    }
                };
            } else { // Others
                script.onload = function () {
                    if (removed) return;
                    removed = true;
                    body.removeChild(script);
                    callback();
                };
                script.onerror = function () {
                    if (removed) return;
                    removed = true;
                    body.removeChild(script);
                    errorCallback();
                };
            }
            script.src = url;
            script.async = false;
            body.appendChild(script);
        }

        /**
         * Loads a locale and replaces the properties from the current locale with the new locale information
         *
         * @param localeUrl The path to the new locale
         * @param $locale The locale at the curent scope
         */
        function loadLocale(localeUrl, $locale, localeId, $rootScope, $q, localeCache, $timeout) {

            function overrideValues(oldObject, newObject) {
                if (activeLocale !== localeId) {
                    return;
                }
                angular.forEach(oldObject, function (value, key) {
                    if (!newObject[key]) {
                        delete oldObject[key];
                    } else if (angular.isArray(newObject[key])) {
                        oldObject[key].length = newObject[key].length;
                    }
                });
                angular.forEach(newObject, function (value, key) {
                    if (angular.isArray(newObject[key]) || angular.isObject(newObject[key])) {
                        if (!oldObject[key]) {
                            oldObject[key] = angular.isArray(newObject[key]) ? [] : {};
                        }
                        overrideValues(oldObject[key], newObject[key]);
                    } else {
                        oldObject[key] = newObject[key];
                    }
                });
            }


            if (promiseCache[localeId]) return promiseCache[localeId];

            var cachedLocale,
              deferred = $q.defer();
            if (localeId === activeLocale) {
                deferred.resolve($locale);
            } else if ((cachedLocale = localeCache.get(localeId))) {
                activeLocale = localeId;
                $rootScope.$evalAsync(function () {
                    overrideValues($locale, cachedLocale);
                    $rootScope.$broadcast('$localeChangeSuccess', localeId, $locale);
                    storage.put(storeKey, localeId);
                    deferred.resolve($locale);
                });
            } else {
                activeLocale = localeId;
                promiseCache[localeId] = deferred.promise;
                loadScript(localeUrl, function () {
                    // Create a new injector with the new locale
                    var localInjector = angular.injector(['ngLocale']),
                      externalLocale = localInjector.get('$locale');

                    overrideValues($locale, externalLocale);
                    localeCache.put(localeId, externalLocale);
                    delete promiseCache[localeId];

                    $rootScope.$apply(function () {
                        $rootScope.$broadcast('$localeChangeSuccess', localeId, $locale);
                        storage.put(storeKey, localeId);
                        deferred.resolve($locale);
                    });
                }, function () {
                    delete promiseCache[localeId];

                    $rootScope.$apply(function () {
                        $rootScope.$broadcast('$localeChangeError', localeId);
                        deferred.reject(localeId);
                    });
                }, $timeout);
            }
            return deferred.promise;
        }

        this.localeLocationPattern = function (value) {
            if (value) {
                localeLocationPattern = value;
                return this;
            } else {
                return localeLocationPattern;
            }
        };

        this.useStorage = function (storageName) {
            storageFactory = storageName;
        };

        this.useCookieStorage = function () {
            this.useStorage('$cookieStore');
        };

        this.defaultLocale = function (value) {
            defaultLocale = value;
        };

        this.$get = ['$rootScope', '$injector', '$interpolate', '$locale', '$q', 'tmhDynamicLocaleCache', '$timeout', function ($rootScope, $injector, interpolate, locale, $q, tmhDynamicLocaleCache, $timeout) {
            var localeLocation = interpolate(localeLocationPattern);

            storage = $injector.get(storageFactory);
            $rootScope.$evalAsync(function () {
                var initialLocale;
                if ((initialLocale = (storage.get(storeKey) || defaultLocale))) {
                    loadLocale(localeLocation({ locale: initialLocale }), locale, initialLocale, $rootScope, $q, tmhDynamicLocaleCache, $timeout);
                }
            });
            return {
                /**
                 * @ngdoc method
                 * @description
                 * @param {string=} value Sets the locale to the new locale. Changing the locale will trigger
                 *    a background task that will retrieve the new locale and configure the current $locale
                 *    instance with the information from the new locale
                 */
                set: function (value) {
                    return loadLocale(localeLocation({ locale: value }), locale, value, $rootScope, $q, tmhDynamicLocaleCache, $timeout);
                }
            };
        }];
    }).provider('tmhDynamicLocaleCache', function () {
        this.$get = ['$cacheFactory', function ($cacheFactory) {
            return $cacheFactory('tmh.dynamicLocales');
        }];
    }).provider('tmhDynamicLocaleStorageCache', function () {
        this.$get = ['$cacheFactory', function ($cacheFactory) {
            return $cacheFactory('tmh.dynamicLocales.store');
        }];
    }).run(['tmhDynamicLocale', angular.noop]);
}(window));
/*
 * angular-ui-bootstrap
 * http://angular-ui.github.io/bootstrap/

 * Version: 2.5.0 - 2017-01-28
 * License: MIT
 */
angular.module("ui.bootstrap", ["ui.bootstrap.tpls", "ui.bootstrap.alert", "ui.bootstrap.dropdown", "ui.bootstrap.multiMap", "ui.bootstrap.position", "ui.bootstrap.modal", "ui.bootstrap.stackedMap"]), angular.module("ui.bootstrap.tpls", ["uib/template/alert/alert.html", "uib/template/modal/window.html"]), angular.module("ui.bootstrap.alert", []).controller("UibAlertController", ["$scope", "$element", "$attrs", "$interpolate", "$timeout", function (e, t, o, n, r) { e.closeable = !!o.close, t.addClass("alert"), o.$set("role", "alert"), e.closeable && t.addClass("alert-dismissible"); var i = angular.isDefined(o.dismissOnTimeout) ? n(o.dismissOnTimeout)(e.$parent) : null; i && r(function () { e.close() }, parseInt(i, 10)) }]).directive("uibAlert", function () { return { controller: "UibAlertController", controllerAs: "alert", restrict: "A", templateUrl: function (e, t) { return t.templateUrl || "uib/template/alert/alert.html" }, transclude: !0, scope: { close: "&" } } }), angular.module("ui.bootstrap.dropdown", ["ui.bootstrap.multiMap", "ui.bootstrap.position"]).constant("uibDropdownConfig", { appendToOpenClass: "uib-dropdown-open", openClass: "open" }).service("uibDropdownService", ["$document", "$rootScope", "$$multiMap", function (e, t, o) { var n = null, r = o.createNew(); this.isOnlyOpen = function (e, t) { var o = r.get(t); if (o) { var n = o.reduce(function (t, o) { return o.scope === e ? o : t }, {}); if (n) return 1 === o.length } return !1 }, this.open = function (t, o, a) { if (n || e.on("click", i), n && n !== t && (n.isOpen = !1), n = t, a) { var l = r.get(a); if (l) { var s = l.map(function (e) { return e.scope }); -1 === s.indexOf(t) && r.put(a, { scope: t }) } else r.put(a, { scope: t }) } }, this.close = function (t, o, a) { if (n === t && (e.off("click", i), e.off("keydown", this.keybindFilter), n = null), a) { var l = r.get(a); if (l) { var s = l.reduce(function (e, o) { return o.scope === t ? o : e }, {}); s && r.remove(a, s) } } }; var i = function (e) { if (n && n.isOpen && !(e && "disabled" === n.getAutoClose() || e && 3 === e.which)) { var o = n.getToggleElement(); if (!(e && o && o[0].contains(e.target))) { var r = n.getDropdownElement(); e && "outsideClick" === n.getAutoClose() && r && r[0].contains(e.target) || (n.focusToggleElement(), n.isOpen = !1, t.$$phase || n.$apply()) } } }; this.keybindFilter = function (e) { if (n) { var t = n.getDropdownElement(), o = n.getToggleElement(), r = t && t[0].contains(e.target), a = o && o[0].contains(e.target); 27 === e.which ? (e.stopPropagation(), n.focusToggleElement(), i()) : n.isKeynavEnabled() && -1 !== [38, 40].indexOf(e.which) && n.isOpen && (r || a) && (e.preventDefault(), e.stopPropagation(), n.focusDropdownEntry(e.which)) } } }]).controller("UibDropdownController", ["$scope", "$element", "$attrs", "$parse", "uibDropdownConfig", "uibDropdownService", "$animate", "$uibPosition", "$document", "$compile", "$templateRequest", function (e, t, o, n, r, i, a, l, s, d, u) { function p() { t.append(m.dropdownMenu) } var c, f, m = this, h = e.$new(), g = r.appendToOpenClass, b = r.openClass, v = angular.noop, w = o.onToggle ? n(o.onToggle) : angular.noop, $ = !1, y = s.find("body"); t.addClass("dropdown"), this.init = function () { o.isOpen && (f = n(o.isOpen), v = f.assign, e.$watch(f, function (e) { h.isOpen = !!e })), $ = angular.isDefined(o.keyboardNav) }, this.toggle = function (e) { return h.isOpen = arguments.length ? !!e : !h.isOpen, angular.isFunction(v) && v(h, h.isOpen), h.isOpen }, this.isOpen = function () { return h.isOpen }, h.getToggleElement = function () { return m.toggleElement }, h.getAutoClose = function () { return o.autoClose || "always" }, h.getElement = function () { return t }, h.isKeynavEnabled = function () { return $ }, h.focusDropdownEntry = function (e) { var o = m.dropdownMenu ? angular.element(m.dropdownMenu).find("a") : t.find("ul").eq(0).find("a"); switch (e) { case 40: m.selectedOption = angular.isNumber(m.selectedOption) ? m.selectedOption === o.length - 1 ? m.selectedOption : m.selectedOption + 1 : 0; break; case 38: m.selectedOption = angular.isNumber(m.selectedOption) ? 0 === m.selectedOption ? 0 : m.selectedOption - 1 : o.length - 1 } o[m.selectedOption].focus() }, h.getDropdownElement = function () { return m.dropdownMenu }, h.focusToggleElement = function () { m.toggleElement && m.toggleElement[0].focus() }, h.$watch("isOpen", function (r, f) { var $ = null, C = !1; if (angular.isDefined(o.dropdownAppendTo)) { var k = n(o.dropdownAppendTo)(h); k && ($ = angular.element(k)) } if (angular.isDefined(o.dropdownAppendToBody)) { var M = n(o.dropdownAppendToBody)(h); M !== !1 && (C = !0) } if (C && !$ && ($ = y), $ && m.dropdownMenu && (r ? ($.append(m.dropdownMenu), t.on("$destroy", p)) : (t.off("$destroy", p), p())), $ && m.dropdownMenu) { var E, O, T, D = l.positionElements(t, m.dropdownMenu, "bottom-left", !0), S = 0; if (E = { top: D.top + "px", display: r ? "block" : "none" }, O = m.dropdownMenu.hasClass("dropdown-menu-right"), O ? (E.left = "auto", T = l.scrollbarPadding($), T.heightOverflow && T.scrollbarWidth && (S = T.scrollbarWidth), E.right = window.innerWidth - S - (D.left + t.prop("offsetWidth")) + "px") : (E.left = D.left + "px", E.right = "auto"), !C) { var x = l.offset($); E.top = D.top - x.top + "px", O ? E.right = window.innerWidth - (D.left - x.left + t.prop("offsetWidth")) + "px" : E.left = D.left - x.left + "px" } m.dropdownMenu.css(E) } var N = $ ? $ : t, A = $ ? g : b, R = N.hasClass(A), I = i.isOnlyOpen(e, $); if (R === !r) { var W; W = $ ? I ? "removeClass" : "addClass" : r ? "addClass" : "removeClass", a[W](N, A).then(function () { angular.isDefined(r) && r !== f && w(e, { open: !!r }) }) } if (r) m.dropdownMenuTemplateUrl ? u(m.dropdownMenuTemplateUrl).then(function (e) { c = h.$new(), d(e.trim())(c, function (e) { var t = e; m.dropdownMenu.replaceWith(t), m.dropdownMenu = t, s.on("keydown", i.keybindFilter) }) }) : s.on("keydown", i.keybindFilter), h.focusToggleElement(), i.open(h, t, $); else { if (i.close(h, t, $), m.dropdownMenuTemplateUrl) { c && c.$destroy(); var F = angular.element('<ul class="dropdown-menu"></ul>'); m.dropdownMenu.replaceWith(F), m.dropdownMenu = F } m.selectedOption = null } angular.isFunction(v) && v(e, r) }) }]).directive("uibDropdown", function () { return { controller: "UibDropdownController", link: function (e, t, o, n) { n.init() } } }).directive("uibDropdownMenu", function () { return { restrict: "A", require: "?^uibDropdown", link: function (e, t, o, n) { if (n && !angular.isDefined(o.dropdownNested)) { t.addClass("dropdown-menu"); var r = o.templateUrl; r && (n.dropdownMenuTemplateUrl = r), n.dropdownMenu || (n.dropdownMenu = t) } } } }).directive("uibDropdownToggle", function () { return { require: "?^uibDropdown", link: function (e, t, o, n) { if (n) { t.addClass("dropdown-toggle"), n.toggleElement = t; var r = function (r) { r.preventDefault(), t.hasClass("disabled") || o.disabled || e.$apply(function () { n.toggle() }) }; t.on("click", r), t.attr({ "aria-haspopup": !0, "aria-expanded": !1 }), e.$watch(n.isOpen, function (e) { t.attr("aria-expanded", !!e) }), e.$on("$destroy", function () { t.off("click", r) }) } } } }), angular.module("ui.bootstrap.multiMap", []).factory("$$multiMap", function () { return { createNew: function () { var e = {}; return { entries: function () { return Object.keys(e).map(function (t) { return { key: t, value: e[t] } }) }, get: function (t) { return e[t] }, hasKey: function (t) { return !!e[t] }, keys: function () { return Object.keys(e) }, put: function (t, o) { e[t] || (e[t] = []), e[t].push(o) }, remove: function (t, o) { var n = e[t]; if (n) { var r = n.indexOf(o); -1 !== r && n.splice(r, 1), n.length || delete e[t] } } } } } }), angular.module("ui.bootstrap.position", []).factory("$uibPosition", ["$document", "$window", function (e, t) { var o, n, r = { normal: /(auto|scroll)/, hidden: /(auto|scroll|hidden)/ }, i = { auto: /\s?auto?\s?/i, primary: /^(top|bottom|left|right)$/, secondary: /^(top|bottom|left|right|center)$/, vertical: /^(top|bottom)$/ }, a = /(HTML|BODY)/; return { getRawNode: function (e) { return e.nodeName ? e : e[0] || e }, parseStyle: function (e) { return e = parseFloat(e), isFinite(e) ? e : 0 }, offsetParent: function (o) { function n(e) { return "static" === (t.getComputedStyle(e).position || "static") } o = this.getRawNode(o); for (var r = o.offsetParent || e[0].documentElement; r && r !== e[0].documentElement && n(r) ;) r = r.offsetParent; return r || e[0].documentElement }, scrollbarWidth: function (r) { if (r) { if (angular.isUndefined(n)) { var i = e.find("body"); i.addClass("uib-position-body-scrollbar-measure"), n = t.innerWidth - i[0].clientWidth, n = isFinite(n) ? n : 0, i.removeClass("uib-position-body-scrollbar-measure") } return n } if (angular.isUndefined(o)) { var a = angular.element('<div class="uib-position-scrollbar-measure"></div>'); e.find("body").append(a), o = a[0].offsetWidth - a[0].clientWidth, o = isFinite(o) ? o : 0, a.remove() } return o }, scrollbarPadding: function (e) { e = this.getRawNode(e); var o = t.getComputedStyle(e), n = this.parseStyle(o.paddingRight), r = this.parseStyle(o.paddingBottom), i = this.scrollParent(e, !1, !0), l = this.scrollbarWidth(a.test(i.tagName)); return { scrollbarWidth: l, widthOverflow: i.scrollWidth > i.clientWidth, right: n + l, originalRight: n, heightOverflow: i.scrollHeight > i.clientHeight, bottom: r + l, originalBottom: r } }, isScrollable: function (e, o) { e = this.getRawNode(e); var n = o ? r.hidden : r.normal, i = t.getComputedStyle(e); return n.test(i.overflow + i.overflowY + i.overflowX) }, scrollParent: function (o, n, i) { o = this.getRawNode(o); var a = n ? r.hidden : r.normal, l = e[0].documentElement, s = t.getComputedStyle(o); if (i && a.test(s.overflow + s.overflowY + s.overflowX)) return o; var d = "absolute" === s.position, u = o.parentElement || l; if (u === l || "fixed" === s.position) return l; for (; u.parentElement && u !== l;) { var p = t.getComputedStyle(u); if (d && "static" !== p.position && (d = !1), !d && a.test(p.overflow + p.overflowY + p.overflowX)) break; u = u.parentElement } return u }, position: function (o, n) { o = this.getRawNode(o); var r = this.offset(o); if (n) { var i = t.getComputedStyle(o); r.top -= this.parseStyle(i.marginTop), r.left -= this.parseStyle(i.marginLeft) } var a = this.offsetParent(o), l = { top: 0, left: 0 }; return a !== e[0].documentElement && (l = this.offset(a), l.top += a.clientTop - a.scrollTop, l.left += a.clientLeft - a.scrollLeft), { width: Math.round(angular.isNumber(r.width) ? r.width : o.offsetWidth), height: Math.round(angular.isNumber(r.height) ? r.height : o.offsetHeight), top: Math.round(r.top - l.top), left: Math.round(r.left - l.left) } }, offset: function (o) { o = this.getRawNode(o); var n = o.getBoundingClientRect(); return { width: Math.round(angular.isNumber(n.width) ? n.width : o.offsetWidth), height: Math.round(angular.isNumber(n.height) ? n.height : o.offsetHeight), top: Math.round(n.top + (t.pageYOffset || e[0].documentElement.scrollTop)), left: Math.round(n.left + (t.pageXOffset || e[0].documentElement.scrollLeft)) } }, viewportOffset: function (o, n, r) { o = this.getRawNode(o), r = r !== !1 ? !0 : !1; var i = o.getBoundingClientRect(), a = { top: 0, left: 0, bottom: 0, right: 0 }, l = n ? e[0].documentElement : this.scrollParent(o), s = l.getBoundingClientRect(); if (a.top = s.top + l.clientTop, a.left = s.left + l.clientLeft, l === e[0].documentElement && (a.top += t.pageYOffset, a.left += t.pageXOffset), a.bottom = a.top + l.clientHeight, a.right = a.left + l.clientWidth, r) { var d = t.getComputedStyle(l); a.top += this.parseStyle(d.paddingTop), a.bottom -= this.parseStyle(d.paddingBottom), a.left += this.parseStyle(d.paddingLeft), a.right -= this.parseStyle(d.paddingRight) } return { top: Math.round(i.top - a.top), bottom: Math.round(a.bottom - i.bottom), left: Math.round(i.left - a.left), right: Math.round(a.right - i.right) } }, parsePlacement: function (e) { var t = i.auto.test(e); return t && (e = e.replace(i.auto, "")), e = e.split("-"), e[0] = e[0] || "top", i.primary.test(e[0]) || (e[0] = "top"), e[1] = e[1] || "center", i.secondary.test(e[1]) || (e[1] = "center"), e[2] = t ? !0 : !1, e }, positionElements: function (e, o, n, r) { e = this.getRawNode(e), o = this.getRawNode(o); var a = angular.isDefined(o.offsetWidth) ? o.offsetWidth : o.prop("offsetWidth"), l = angular.isDefined(o.offsetHeight) ? o.offsetHeight : o.prop("offsetHeight"); n = this.parsePlacement(n); var s = r ? this.offset(e) : this.position(e), d = { top: 0, left: 0, placement: "" }; if (n[2]) { var u = this.viewportOffset(e, r), p = t.getComputedStyle(o), c = { width: a + Math.round(Math.abs(this.parseStyle(p.marginLeft) + this.parseStyle(p.marginRight))), height: l + Math.round(Math.abs(this.parseStyle(p.marginTop) + this.parseStyle(p.marginBottom))) }; if (n[0] = "top" === n[0] && c.height > u.top && c.height <= u.bottom ? "bottom" : "bottom" === n[0] && c.height > u.bottom && c.height <= u.top ? "top" : "left" === n[0] && c.width > u.left && c.width <= u.right ? "right" : "right" === n[0] && c.width > u.right && c.width <= u.left ? "left" : n[0], n[1] = "top" === n[1] && c.height - s.height > u.bottom && c.height - s.height <= u.top ? "bottom" : "bottom" === n[1] && c.height - s.height > u.top && c.height - s.height <= u.bottom ? "top" : "left" === n[1] && c.width - s.width > u.right && c.width - s.width <= u.left ? "right" : "right" === n[1] && c.width - s.width > u.left && c.width - s.width <= u.right ? "left" : n[1], "center" === n[1]) if (i.vertical.test(n[0])) { var f = s.width / 2 - a / 2; u.left + f < 0 && c.width - s.width <= u.right ? n[1] = "left" : u.right + f < 0 && c.width - s.width <= u.left && (n[1] = "right") } else { var m = s.height / 2 - c.height / 2; u.top + m < 0 && c.height - s.height <= u.bottom ? n[1] = "top" : u.bottom + m < 0 && c.height - s.height <= u.top && (n[1] = "bottom") } } switch (n[0]) { case "top": d.top = s.top - l; break; case "bottom": d.top = s.top + s.height; break; case "left": d.left = s.left - a; break; case "right": d.left = s.left + s.width } switch (n[1]) { case "top": d.top = s.top; break; case "bottom": d.top = s.top + s.height - l; break; case "left": d.left = s.left; break; case "right": d.left = s.left + s.width - a; break; case "center": i.vertical.test(n[0]) ? d.left = s.left + s.width / 2 - a / 2 : d.top = s.top + s.height / 2 - l / 2 } return d.top = Math.round(d.top), d.left = Math.round(d.left), d.placement = "center" === n[1] ? n[0] : n[0] + "-" + n[1], d }, adjustTop: function (e, t, o, n) { return -1 !== e.indexOf("top") && o !== n ? { top: t.top - n + "px" } : void 0 }, positionArrow: function (e, o) { e = this.getRawNode(e); var n = e.querySelector(".tooltip-inner, .popover-inner"); if (n) { var r = angular.element(n).hasClass("tooltip-inner"), a = e.querySelector(r ? ".tooltip-arrow" : ".arrow"); if (a) { var l = { top: "", bottom: "", left: "", right: "" }; if (o = this.parsePlacement(o), "center" === o[1]) return void angular.element(a).css(l); var s = "border-" + o[0] + "-width", d = t.getComputedStyle(a)[s], u = "border-"; u += i.vertical.test(o[0]) ? o[0] + "-" + o[1] : o[1] + "-" + o[0], u += "-radius"; var p = t.getComputedStyle(r ? n : e)[u]; switch (o[0]) { case "top": l.bottom = r ? "0" : "-" + d; break; case "bottom": l.top = r ? "0" : "-" + d; break; case "left": l.right = r ? "0" : "-" + d; break; case "right": l.left = r ? "0" : "-" + d } l[o[1]] = p, angular.element(a).css(l) } } } } }]), angular.module("ui.bootstrap.modal", ["ui.bootstrap.multiMap", "ui.bootstrap.stackedMap", "ui.bootstrap.position"]).provider("$uibResolve", function () { var e = this; this.resolver = null, this.setResolver = function (e) { this.resolver = e }, this.$get = ["$injector", "$q", function (t, o) { var n = e.resolver ? t.get(e.resolver) : null; return { resolve: function (e, r, i, a) { if (n) return n.resolve(e, r, i, a); var l = []; return angular.forEach(e, function (e) { l.push(angular.isFunction(e) || angular.isArray(e) ? o.resolve(t.invoke(e)) : angular.isString(e) ? o.resolve(t.get(e)) : o.resolve(e)) }), o.all(l).then(function (t) { var o = {}, n = 0; return angular.forEach(e, function (e, r) { o[r] = t[n++] }), o }) } } }] }).directive("uibModalBackdrop", ["$animate", "$injector", "$uibModalStack", function (e, t, o) { function n(t, n, r) { r.modalInClass && (e.addClass(n, r.modalInClass), t.$on(o.NOW_CLOSING_EVENT, function (o, i) { var a = i(); t.modalOptions.animation ? e.removeClass(n, r.modalInClass).then(a) : a() })) } return { restrict: "A", compile: function (e, t) { return e.addClass(t.backdropClass), n } } }]).directive("uibModalWindow", ["$uibModalStack", "$q", "$animateCss", "$document", function (e, t, o, n) { return { scope: { index: "@" }, restrict: "A", transclude: !0, templateUrl: function (e, t) { return t.templateUrl || "uib/template/modal/window.html" }, link: function (r, i, a) { i.addClass(a.windowTopClass || ""), r.size = a.size, r.close = function (t) { var o = e.getTop(); o && o.value.backdrop && "static" !== o.value.backdrop && t.target === t.currentTarget && (t.preventDefault(), t.stopPropagation(), e.dismiss(o.key, "backdrop click")) }, i.on("click", r.close), r.$isRendered = !0; var l = t.defer(); r.$$postDigest(function () { l.resolve() }), l.promise.then(function () { var l = null; a.modalInClass && (l = o(i, { addClass: a.modalInClass }).start(), r.$on(e.NOW_CLOSING_EVENT, function (e, t) { var n = t(); o(i, { removeClass: a.modalInClass }).start().then(n) })), t.when(l).then(function () { var t = e.getTop(); if (t && e.modalRendered(t.key), !n[0].activeElement || !i[0].contains(n[0].activeElement)) { var o = i[0].querySelector("[autofocus]"); o ? o.focus() : i[0].focus() } }) }) } } }]).directive("uibModalAnimationClass", function () { return { compile: function (e, t) { t.modalAnimation && e.addClass(t.uibModalAnimationClass) } } }).directive("uibModalTransclude", ["$animate", function (e) { return { link: function (t, o, n, r, i) { i(t.$parent, function (t) { o.empty(), e.enter(t, o) }) } } }]).factory("$uibModalStack", ["$animate", "$animateCss", "$document", "$compile", "$rootScope", "$q", "$$multiMap", "$$stackedMap", "$uibPosition", function (e, t, o, n, r, i, a, l, s) { function d(e) { var t = "-"; return e.replace(x, function (e, o) { return (o ? t : "") + e.toLowerCase() }) } function u(e) { return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length) } function p() { for (var e = -1, t = k.keys(), o = 0; o < t.length; o++) k.get(t[o]).value.backdrop && (e = o); return e > -1 && O > e && (e = O), e } function c(e, t) { var o = k.get(e).value, n = o.appendTo; k.remove(e), T = k.top(), T && (O = parseInt(T.value.modalDomEl.attr("index"), 10)), h(o.modalDomEl, o.modalScope, function () { var t = o.openedClass || C; M.remove(t, e); var r = M.hasKey(t); n.toggleClass(t, r), !r && y && y.heightOverflow && y.scrollbarWidth && (n.css(y.originalRight ? { paddingRight: y.originalRight + "px" } : { paddingRight: "" }), y = null), f(!0) }, o.closedDeferred), m(), t && t.focus ? t.focus() : n.focus && n.focus() } function f(e) { var t; k.length() > 0 && (t = k.top().value, t.modalDomEl.toggleClass(t.windowTopClass || "", e)) } function m() { if (w && -1 === p()) { var e = $; h(w, $, function () { e = null }), w = void 0, $ = void 0 } } function h(t, o, n, r) { function a() { a.done || (a.done = !0, e.leave(t).then(function () { n && n(), t.remove(), r && r.resolve() }), o.$destroy()) } var l, s = null, d = function () { return l || (l = i.defer(), s = l.promise), function () { l.resolve() } }; return o.$broadcast(E.NOW_CLOSING_EVENT, d), i.when(s).then(a) } function g(e) { if (e.isDefaultPrevented()) return e; var t = k.top(); if (t) switch (e.which) { case 27: t.value.keyboard && (e.preventDefault(), r.$apply(function () { E.dismiss(t.key, "escape key press") })); break; case 9: var o = E.loadFocusElementList(t), n = !1; e.shiftKey ? (E.isFocusInFirstItem(e, o) || E.isModalFocused(e, t)) && (n = E.focusLastFocusableElement(o)) : E.isFocusInLastItem(e, o) && (n = E.focusFirstFocusableElement(o)), n && (e.preventDefault(), e.stopPropagation()) } } function b(e, t, o) { return !e.value.modalScope.$broadcast("modal.closing", t, o).defaultPrevented } function v() { Array.prototype.forEach.call(document.querySelectorAll("[" + D + "]"), function (e) { var t = parseInt(e.getAttribute(D), 10), o = t - 1; e.setAttribute(D, o), o || (e.removeAttribute(D), e.removeAttribute("aria-hidden")) }) } var w, $, y, C = "modal-open", k = l.createNew(), M = a.createNew(), E = { NOW_CLOSING_EVENT: "modal.stack.now-closing" }, O = 0, T = null, D = "data-bootstrap-modal-aria-hidden-count", S = "a[href], area[href], input:not([disabled]):not([tabindex='-1']), button:not([disabled]):not([tabindex='-1']),select:not([disabled]):not([tabindex='-1']), textarea:not([disabled]):not([tabindex='-1']), iframe, object, embed, *[tabindex]:not([tabindex='-1']), *[contenteditable=true]", x = /[A-Z]/g; return r.$watch(p, function (e) { $ && ($.index = e) }), o.on("keydown", g), r.$on("$destroy", function () { o.off("keydown", g) }), E.open = function (t, i) { function a(e) { function t(e) { var t = e.parent() ? e.parent().children() : []; return Array.prototype.filter.call(t, function (t) { return t !== e[0] }) } if (e && "BODY" !== e[0].tagName) return t(e).forEach(function (e) { var t = "true" === e.getAttribute("aria-hidden"), o = parseInt(e.getAttribute(D), 10); o || (o = t ? 1 : 0), e.setAttribute(D, o + 1), e.setAttribute("aria-hidden", "true") }), a(e.parent()) } var l = o[0].activeElement, u = i.openedClass || C; f(!1), T = k.top(), k.add(t, { deferred: i.deferred, renderDeferred: i.renderDeferred, closedDeferred: i.closedDeferred, modalScope: i.scope, backdrop: i.backdrop, keyboard: i.keyboard, openedClass: i.openedClass, windowTopClass: i.windowTopClass, animation: i.animation, appendTo: i.appendTo }), M.put(u, t); var c = i.appendTo, m = p(); m >= 0 && !w && ($ = r.$new(!0), $.modalOptions = i, $.index = m, w = angular.element('<div uib-modal-backdrop="modal-backdrop"></div>'), w.attr({ "class": "modal-backdrop", "ng-style": "{'z-index': 1040 + (index && 1 || 0) + index*10}", "uib-modal-animation-class": "fade", "modal-in-class": "in" }), i.backdropClass && w.addClass(i.backdropClass), i.animation && w.attr("modal-animation", "true"), n(w)($), e.enter(w, c), s.isScrollable(c) && (y = s.scrollbarPadding(c), y.heightOverflow && y.scrollbarWidth && c.css({ paddingRight: y.right + "px" }))); var h; i.component ? (h = document.createElement(d(i.component.name)), h = angular.element(h), h.attr({ resolve: "$resolve", "modal-instance": "$uibModalInstance", close: "$close($value)", dismiss: "$dismiss($value)" })) : h = i.content, O = T ? parseInt(T.value.modalDomEl.attr("index"), 10) + 1 : 0; var g = angular.element('<div uib-modal-window="modal-window"></div>'); g.attr({ "class": "modal", "template-url": i.windowTemplateUrl, "window-top-class": i.windowTopClass, role: "dialog", "aria-labelledby": i.ariaLabelledBy, "aria-describedby": i.ariaDescribedBy, size: i.size, index: O, animate: "animate", "ng-style": "{'z-index': 1050 + $$topModalIndex*10, display: 'block'}", tabindex: -1, "uib-modal-animation-class": "fade", "modal-in-class": "in" }).append(h), i.windowClass && g.addClass(i.windowClass), i.animation && g.attr("modal-animation", "true"), c.addClass(u), i.scope && (i.scope.$$topModalIndex = O), e.enter(n(g)(i.scope), c), k.top().value.modalDomEl = g, k.top().value.modalOpener = l, a(g) }, E.close = function (e, t) { var o = k.get(e); return v(), o && b(o, t, !0) ? (o.value.modalScope.$$uibDestructionScheduled = !0, o.value.deferred.resolve(t), c(e, o.value.modalOpener), !0) : !o }, E.dismiss = function (e, t) { var o = k.get(e); return v(), o && b(o, t, !1) ? (o.value.modalScope.$$uibDestructionScheduled = !0, o.value.deferred.reject(t), c(e, o.value.modalOpener), !0) : !o }, E.dismissAll = function (e) { for (var t = this.getTop() ; t && this.dismiss(t.key, e) ;) t = this.getTop() }, E.getTop = function () { return k.top() }, E.modalRendered = function (e) { var t = k.get(e); t && t.value.renderDeferred.resolve() }, E.focusFirstFocusableElement = function (e) { return e.length > 0 ? (e[0].focus(), !0) : !1 }, E.focusLastFocusableElement = function (e) { return e.length > 0 ? (e[e.length - 1].focus(), !0) : !1 }, E.isModalFocused = function (e, t) { if (e && t) { var o = t.value.modalDomEl; if (o && o.length) return (e.target || e.srcElement) === o[0] } return !1 }, E.isFocusInFirstItem = function (e, t) { return t.length > 0 ? (e.target || e.srcElement) === t[0] : !1 }, E.isFocusInLastItem = function (e, t) { return t.length > 0 ? (e.target || e.srcElement) === t[t.length - 1] : !1 }, E.loadFocusElementList = function (e) { if (e) { var t = e.value.modalDomEl; if (t && t.length) { var o = t[0].querySelectorAll(S); return o ? Array.prototype.filter.call(o, function (e) { return u(e) }) : o } } }, E }]).provider("$uibModal", function () { var e = { options: { animation: !0, backdrop: !0, keyboard: !0 }, $get: ["$rootScope", "$q", "$document", "$templateRequest", "$controller", "$uibResolve", "$uibModalStack", function (t, o, n, r, i, a, l) { function s(e) { return e.template ? o.when(e.template) : r(angular.isFunction(e.templateUrl) ? e.templateUrl() : e.templateUrl) } var d = {}, u = null; return d.getPromiseChain = function () { return u }, d.open = function (r) { function d() { return g } var p = o.defer(), c = o.defer(), f = o.defer(), m = o.defer(), h = { result: p.promise, opened: c.promise, closed: f.promise, rendered: m.promise, close: function (e) { return l.close(h, e) }, dismiss: function (e) { return l.dismiss(h, e) } }; if (r = angular.extend({}, e.options, r), r.resolve = r.resolve || {}, r.appendTo = r.appendTo || n.find("body").eq(0), !r.appendTo.length) throw new Error("appendTo element not found. Make sure that the element passed is in DOM."); if (!r.component && !r.template && !r.templateUrl) throw new Error("One of component or template or templateUrl options is required."); var g; g = r.component ? o.when(a.resolve(r.resolve, {}, null, null)) : o.all([s(r), a.resolve(r.resolve, {}, null, null)]); var b; return b = u = o.all([u]).then(d, d).then(function (e) { function o(t, o, n, r) { t.$scope = a, t.$scope.$resolve = {}, n ? t.$scope.$uibModalInstance = h : t.$uibModalInstance = h; var i = o ? e[1] : e; angular.forEach(i, function (e, o) { r && (t[o] = e), t.$scope.$resolve[o] = e }) } var n = r.scope || t, a = n.$new(); a.$close = h.close, a.$dismiss = h.dismiss, a.$on("$destroy", function () { a.$$uibDestructionScheduled || a.$dismiss("$uibUnscheduledDestruction") }); var s, d, u = { scope: a, deferred: p, renderDeferred: m, closedDeferred: f, animation: r.animation, backdrop: r.backdrop, keyboard: r.keyboard, backdropClass: r.backdropClass, windowTopClass: r.windowTopClass, windowClass: r.windowClass, windowTemplateUrl: r.windowTemplateUrl, ariaLabelledBy: r.ariaLabelledBy, ariaDescribedBy: r.ariaDescribedBy, size: r.size, openedClass: r.openedClass, appendTo: r.appendTo }, g = {}, b = {}; r.component ? (o(g, !1, !0, !1), g.name = r.component, u.component = g) : r.controller && (o(b, !0, !1, !0), d = i(r.controller, b, !0, r.controllerAs), r.controllerAs && r.bindToController && (s = d.instance, s.$close = a.$close, s.$dismiss = a.$dismiss, angular.extend(s, { $resolve: b.$scope.$resolve }, n)), s = d(), angular.isFunction(s.$onInit) && s.$onInit()), r.component || (u.content = e[0]), l.open(h, u), c.resolve(!0) }, function (e) { c.reject(e), p.reject(e) })["finally"](function () { u === b && (u = null) }), h }, d }] }; return e }), angular.module("ui.bootstrap.stackedMap", []).factory("$$stackedMap", function () { return { createNew: function () { var e = []; return { add: function (t, o) { e.push({ key: t, value: o }) }, get: function (t) { for (var o = 0; o < e.length; o++) if (t === e[o].key) return e[o] }, keys: function () { for (var t = [], o = 0; o < e.length; o++) t.push(e[o].key); return t }, top: function () { return e[e.length - 1] }, remove: function (t) { for (var o = -1, n = 0; n < e.length; n++) if (t === e[n].key) { o = n; break } return e.splice(o, 1)[0] }, removeTop: function () { return e.pop() }, length: function () { return e.length } } } } }), angular.module("uib/template/alert/alert.html", []).run(["$templateCache", function (e) { e.put("uib/template/alert/alert.html", '<button ng-show="closeable" type="button" class="close" ng-click="close({$event: $event})">\n  <span aria-hidden="true">&times;</span>\n  <span class="sr-only">Close</span>\n</button>\n<div ng-transclude></div>\n') }]), angular.module("uib/template/modal/window.html", []).run(["$templateCache", function (e) { e.put("uib/template/modal/window.html", "<div class=\"modal-dialog {{size ? 'modal-' + size : ''}}\"><div class=\"modal-content\" uib-modal-transclude></div></div>\n") }]), angular.module("ui.bootstrap.position").run(function () { !angular.$$csp().noInlineStyle && !angular.$$uibPositionCss && angular.element(document).find("head").prepend('<style type="text/css">.uib-position-measure{display:block !important;visibility:hidden !important;position:absolute !important;top:-9999px !important;left:-9999px !important;}.uib-position-scrollbar-measure{position:absolute !important;top:-9999px !important;width:50px !important;height:50px !important;overflow:scroll !important;}.uib-position-body-scrollbar-measure{overflow:scroll !important;}</style>'), angular.$$uibPositionCss = !0 });
app.directive('updateCart', ['CartService', function (CartService) {

    // Shared scope:
    // updateCart: The updated cart to save. If an existing cart does not exist, one will be created and returned.
    // error: The error object to communicate errors.
    // onSubmit: A function that will be called from scope when a cart update is submitted.
    // onSuccess: A function that will be called from scope when the cart is successfully updated. Will include the response cart object as a parameter.
    // onFailure: A function that will be called from scope when the update fails. Will include the error object as a parameter.

    // Attributes
    // params: An object that supplies a list of parameters to send to the api, such as show, hide, formatted, etc. Used to customize the response object.

    return {
        restrict: 'A',
        require: '^form',
        scope: {
            cart: '=updateCart',
            shippingIsBilling: '=?',
            params: '=?',
            error: '=?',
            onSubmit: '=?',
            onSuccess: '=?',
            onError: '=?'
        },
        link: function (scope, elem, attrs, ctrl) {

            elem.bind("click", function () {

                // Fire the submit event
                if (scope.onSubmit) {
                    scope.onSubmit();
                }

                // Clear previous errors
                scope.error = null;

                // Prep the params
                var params = scope.params || attrs.params;
                params = utils.mergeParams(params, null, null);

                // Make a copy of the cart so you can modify the data without modifying the view. This is used when the user has supplied values in shipping fields but then checks "shipping is billing". We don't want to clear the view but we don't want to send a shipping address to the API.
                var cartCopy = angular.copy(scope.cart);

                // If set that billing is same as shipping, set all shipping values to null so that the API doesn't receive any of the data set on the view.
                if (scope.shippingIsBilling) {
                    if (cartCopy.customer.shipping_address) {
                        cartCopy.customer.shipping_address.name = null;
                        cartCopy.customer.shipping_address.address_1 = null;
                        cartCopy.customer.shipping_address.address_2 = null;
                        cartCopy.customer.shipping_address.city = null;
                        cartCopy.customer.shipping_address.state_prov = null;
                        cartCopy.customer.shipping_address.postal_code = null;
                        cartCopy.customer.shipping_address.country = null;
                    }
                }

                CartService.update(cartCopy, scope.params).then(function (cart) {

                    // In the event that there were changes to the view between the time the call was sent and returned, we don't want to overwrite them. As a result, we won't sync the server customer values with the model.
                    if (scope.cart) {
                        cart.customer = scope.cart.customer;
                    }

                    scope.cart = cart;

                    // Fire the success event
                    if (scope.onSuccess) {
                        scope.onSuccess(cart);
                    }

                }, function (error) {
                    scope.error = error;
                    // Fire the error event
                    if (scope.onError) {
                        scope.onError(error);
                    }
                });

            });

        }
    };
}]);

app.directive('updateInvoice', ['InvoiceService', function (InvoiceService) {

    // Shared scope:
    // updateCart: The updated invoice to save. If an existing invoice does not exist, one will be created and returned.
    // error: The error object to communicate errors.
    // onSubmit: A function that will be called from scope when a invoice update is submitted.
    // onSuccess: A function that will be called from scope when the invoice is successfully updated. Will include the response invoice object as a parameter.
    // onFailure: A function that will be called from scope when the update fails. Will include the error object as a parameter.

    // Attributes
    // params: An object that supplies a list of parameters to send to the api, such as show, hide, formatted, etc. Used to customize the response object.

    return {
        restrict: 'A',
        require: '^form',
        scope: {
            invoice: '=updateInvoice',
            params: '=?',
            error: '=?',
            onSubmit: '=?',
            onSuccess: '=?',
            onError: '=?'
        },
        link: function (scope, elem, attrs, ctrl) {

            elem.bind("click", function () {

                // Fire the submit event
                if (scope.onSubmit) {
                    scope.onSubmit();
                }

                // Clear previous errors
                scope.error = null;

                // Prep the params
                var params = scope.params || attrs.params;
                params = utils.mergeParams(params, null, null);

                InvoiceService.update(scope.invoice, scope.params).then(function (invoice) {
                    scope.invoice = invoice;
                    // Fire the success event
                    if (scope.onSuccess) {
                        scope.onSuccess(invoice);
                    }
                }, function (error) {
                    scope.error = error;
                    // Fire the error event
                    if (scope.onError) {
                        scope.onError(error);
                    }
                });

            });

        }
    };
}]);

app.directive('addToCart', ['CartService', 'gettextCatalog', function (CartService, gettextCatalog) {

    // Shared scope:
    // addToCart: The product to add to the cart. Must include the product_id.
    // error: The error object to communicate errors.
    // onSubmit: A function that will be called from scope when the function is triggered.
    // onSuccess: A function that will be called from scope when the item is successfully added. Will include the response item object as a parameter.
    // onError: A function that will be called from scope when the function fails. Will include the error object as a parameter.

    // Attributes
    // params: An object that supplies a list of parameters to send to the api, such as show, hide, formatted, etc. Used to customize the response object.

    return {
        restrict: 'A',
        require: '^form',
        scope: {
            product: '=addToCart',
            params: '=?',
            quantity: '=?',
            error: '=?',
            onSubmit: '=?',
            onSuccess: '=?',
            onError: '=?'
        },
        link: function (scope, elem, attrs, ctrl) {

            elem.bind("click", function () {

                // Fire the submit event
                if (scope.onSubmit) {
                    scope.onSubmit();
                }

                if (ctrl.$invalid == true) {
                    scope.$apply(function () {
                        scope.error = { type: "bad_request", reference: "AWu1twY", code: "invalid_input", message: gettextCatalog.getString("There was a problem with some of the information you supplied. Please review for errors and try again."), status: 400 };
                    });
                    return;
                }

                // Clear previous errors
                scope.error = null;

                // Build the item
                var item = { product_id: scope.product.product_id };

                // Set the quantity
                if (scope.quantity) {
                    item.quantity = scope.quantity;
                }

                // Prep the params
                var params = scope.params || attrs.params;
                params = utils.mergeParams(params, null, null);

                CartService.addItem(item, scope.params).then(function (item) {
                    scope.item = item;
                    // Fire the success event
                    if (scope.onSuccess) {
                        scope.onSuccess(item);
                    }
                }, function (error) {
                    scope.error = error;
                    // Fire the error event
                    if (scope.onError) {
                        scope.onError(error);
                    }
                });

            });

        }
    };
}]);

app.directive('submitPayment', ['CartService', 'InvoiceService', 'PaymentService', 'gettextCatalog', function (CartService, InvoiceService, PaymentService, gettextCatalog) {

    // Shared scope:
    // submitPayment: Provide the payment_method to be used for payment. Should include, at a minimum, the following properties: payment_type, data (data includes payment method-specific fields such as credit card number).
    // cart: Provide the cart that will be paid for. The cart will automatically be updated (or created if not yet created) through the API before the payment for the payment is submitted. Cart or invoice can be supplied, but not both.
    // invoice: Provide the invoice that will be paid for. The invoice will automatically be updated through the API before the payment for the payment is submitted (i.e. a currency change). Cart or invoice can be supplied, but not both.
    // payment: Provide the payment object for a direct, stand-alone payment (no cart or invoice). If payment is provided cart and invoice should NOT be provided.
    // error: The error object to communicate errors.
    // onSubmit: A function that will be called from scope when a payment is submitted.
    // onSuccess: A function that will be called from scope when the payment is successfully completed. Will include the response payment object as a parameter.
    // onError: A function that will be called from scope when the payment fails. Will include the (failed) response payment object as a parameter.
    // shippingIsBilling: A flag to indicate if the billing address and shipping address are the same. If so, the shipping address will be removed.

    // Attributes
    // params: An object that supplies a list of parameters to send to the api, such as show, hide, formatted, etc. Used to customize the response object.

    return {
        restrict: 'A',
        require: '^form',
        scope: {
            paymentMethod: '=submitPayment',
            cart: '=?',
            invoice: '=?',
            payment: '=?',
            params: '=?',
            error: '=?',
            onSubmit: '=?',
            onSuccess: '=?',
            onError: '=?',
            shippingIsBilling: '=?'
        },
        link: function (scope, elem, attrs, ctrl) {

            elem.bind("click", function () {

                // Fire the submit event
                if (scope.onSubmit) {
                    scope.onSubmit();
                }

                // Data is not validated with PayPal since the customer data will come from the response.
                if (ctrl.$invalid == true && scope.paymentMethod.type != "paypal") {

                    scope.$apply(function () {
                        scope.error = { type: "bad_request", reference: "kI1ETNz", code: "invalid_input", message: gettextCatalog.getString("There was a problem with some of the information you supplied. Please review for errors and try again."), status: 400 };
                    });

                    // Fire the error event
                    if (scope.onError) {
                        scope.onError(error);
                    }

                    return;
                }

                // If a direct payment (i.e. hosted payment page - no cart or invoice) and PayPal, total, subtotal and / or shipping must be provided.
                if (scope.paymentMethod.type == "paypal" && !scope.cart && !scope.invoice) {

                    if (!scope.payment.total && !scope.payment.subtotal && !scope.payment.shipping) {
                        scope.$apply(function () {
                            scope.error = { type: "bad_request", reference: "eiptRbg", code: "invalid_input", message: gettextCatalog.getString("Please provide an amount for your payment."), status: 400 };
                        });

                        // Fire the error event
                        if (scope.onError) {
                            scope.onError(error);
                        }

                        return;
                    }

                }

                // Make sure numeric values, if supplied, are not strings. This ensures that the JSON sent to the API will be in numeric format and not string, which the API will reject as invalid.
                if (scope.payment) {
                    if (scope.payment.total)
                        scope.payment.total = Number(scope.payment.total);

                    if (scope.payment.subtotal)
                        scope.payment.subtotal = Number(scope.payment.subtotal);

                    if (scope.payment.shipping)
                        scope.payment.shipping = Number(scope.payment.shipping);

                    if (scope.payment.tax)
                        scope.payment.tax = Number(scope.payment.tax);
                }

                // Disable the clicked element
                elem.prop("disabled", true);

                // Clear previous errors
                scope.error = null;

                // Prep the params
                var params = scope.params || attrs.params;
                params = utils.mergeParams(params, null, "order");

                if (scope.cart) {

                    // If billing is shipping, remove the shipping address
                    if (scope.shippingIsBilling) {
                        delete scope.cart.customer.shipping_address;
                    }

                    CartService.pay(scope.cart, scope.paymentMethod, params).then(function (payment) {

                        // Fire the success event
                        if (scope.onSuccess) {
                            scope.onSuccess(payment);
                        }

                        // Remove the disabled attribute
                        elem.prop("disabled", null);

                    }, function (error) {

                        scope.error = error;

                        // Fire the error event
                        if (scope.onError) {
                            scope.onError(error);
                        }

                        // Remove the disabled attribute
                        elem.prop("disabled", null);

                    });
                }

                if (scope.invoice) {

                    InvoiceService.pay(scope.invoice, scope.paymentMethod, params).then(function (payment) {

                        // Fire the success event
                        if (scope.onSuccess) {
                            scope.onSuccess(payment);
                        }

                        // Remove the disabled attribute
                        elem.prop("disabled", null);

                    }, function (error) {

                        scope.error = error;

                        // Fire the error event
                        if (scope.onError) {
                            scope.onError(error);
                        }

                        // Remove the disabled attribute
                        elem.prop("disabled", null);

                    });
                }

                if (scope.payment) {

                    scope.payment.payment_method = scope.paymentMethod;

                    // If billing is shipping, remove the shipping address
                    if (scope.shippingIsBilling && scope.payment.customer) {
                        delete scope.payment.customer.shipping_address;
                    }

                    PaymentService.createDirect(scope.payment, params).then(function (payment) {

                        // Fire the success event
                        if (scope.onSuccess) {
                            scope.onSuccess(payment);
                        }

                        // Remove the disabled attribute
                        elem.prop("disabled", null);

                    }, function (error) {

                        scope.error = error;

                        // Fire the error event
                        if (scope.onError) {
                            scope.onError(error);
                        }

                        // Remove the disabled attribute
                        elem.prop("disabled", null);

                    });
                }

            });

        }
    };
}]);

app.directive('commitPayment', ['CartService', 'InvoiceService', 'PaymentService', 'gettextCatalog', function (CartService, InvoiceService, PaymentService, gettextCatalog) {

    // This is used for payment methods such as PayPal and Amazon Pay that need to be tiggered for completion after they have been reviewed by the customer. 

    // Shared scope:
    // commitPayment: Provide the payment_id of the payment that will be committed.
    // sale: If a the payment is associated with a cart or invoice, you can supply the it here. If you supply a cart, any changes to the cart (such as customer data changes) will be saved before the commit is attempted.
    // error: The error object to communicate errors.
    // onSubmit: A function that will be called from scope when a payment is submitted.
    // onSuccess: A function that will be called from scope when the payment is successfully completed. Will include the response payment object as a parameter.
    // onError: A function that will be called from scope when the payment fails. Will include the (failed) response payment object as a parameter.

    // Attributes
    // params: An object that supplies a list of parameters to send to the api, such as show, hide, formatted, etc. Used to customize the response object.
    // saleType: "cart" or "invoice" - a string that indicates what is being passed in through the sale shared scope.

    return {
        restrict: 'A',
        require: '^form',
        scope: {
            paymentId: '=commitPayment',
            sale: '=?',
            invoice: '=?',
            params: '=?',
            error: '=?',
            onSubmit: '=?',
            onSuccess: '=?',
            onError: '=?'
        },
        link: function (scope, elem, attrs, ctrl) {

            elem.bind("click", function () {

                // Fire the submit event
                if (scope.onSubmit) {
                    scope.onSubmit();
                }

                // Data is not validated with PayPal since the customer data will come from the response.
                if (ctrl.$invalid == true) {

                    scope.$apply(function () {
                        scope.error = { type: "bad_request", reference: "eS9G9MA", code: "invalid_input", message: gettextCatalog.getString("There was a problem with some of the information you supplied. Please review for errors and try again."), status: 400 };
                    });

                    // Fire the error event
                    if (scope.onError) {
                        scope.onError(error);
                    }

                    return;
                }

                // Disable the clicked element
                elem.prop("disabled", true);

                // Clear previous errors
                scope.error = null;

                // Prep the params
                var params = scope.params || attrs.params;
                params = utils.mergeParams(params, null, "order");

                // Define the commit function.
                var commit = function (payment_id, params) {

                    PaymentService.commit(payment_id, params).then(function (payment) {

                        // Fire the success event
                        if (scope.onSuccess) {
                            scope.onSuccess(payment);
                        }

                        // Remove the disabled attribute
                        elem.prop("disabled", null);

                    }, function (error) {

                        scope.error = error;

                        // Fire the error event
                        if (scope.onError) {
                            scope.onError(error);
                        }

                        // Remove the disabled attribute
                        elem.prop("disabled", null);

                    });
                };

                // Perform the commit. If a cart, update the cart before running the payment.
                if (attrs.saleType == "cart") {

                    CartService.update(scope.sale).then(function (cart) {
                        commit(scope.paymentId, params);
                    }, function (error) {

                        scope.error = error;

                        // Fire the error event
                        if (scope.onError) {
                            scope.onError(error);
                        }

                        // Remove the disabled attribute
                        elem.prop("disabled", null);

                    });

                } else {
                    // An invoice or direct payment. Nothing to update in advance, just run the commit.
                    commit(scope.paymentId, params);
                }

            });

        }
    };
}]);

app.directive('currencySelect', ['CurrencyService', 'CartService', 'InvoiceService', 'PaymentService', 'ProductService', 'SettingsService', 'StorageService', '$timeout', '$rootScope', function (CurrencyService, CartService, InvoiceService, PaymentService, ProductService, SettingsService, StorageService, $timeout, $rootScope) {

    return {
        restrict: 'A',
        scope: {
            currency: '=selectCurrency',
            cart: '=?',
            invoice: '=?',
            payment: '=?',
            options: '=?',
            products: '=?',
            params: '=?',
            onSuccess: '=?',
            onError: '=?',
            error: '=?'
        },
        link: function (scope, elem, attrs) {

            // Shared scope:
            // currency: The new currency
            // cart: If running on a page with an cart, pass the cart object in and it will be updated with the pricing in the new currency
            // invoice: If running on a page with an invoice, pass the invoice object in and it will be updated with the pricing in the new currency
            // payment: If running on a page with a stand-alone payment, pass the payment object in and the currency will be set on the object
            // options: If suppying a payment, you can supply the payment/options object and it will be updated with a new version as a result of the currency selection / change.
            // product: If running on a page with a single product, pass the product in and it will be updated with the pricing in the new currency
            // products: If running on a page with a list of products, pass the products list in and it will be updated with the pricing in the new currency
            // error: The error object to communicate errors.
            // onSuccess: A function that will be called from scope when the currency is successfully changed. Will include the newly set currency as a parameter.
            // onError: A function that will be called from scope when the currency change fails. Will include an error object as a parameter.

            // Attributes
            // params: Any parameters you want to pass to the update function (i.e. expand, show, etc.)
            // asDropdown: If specified, a Bootstrap dropdown will be output. Otherwise, a HTML select intput will be output.

            // Get the settings
            var settings = SettingsService.get();

            if (utils.hasProperty(attrs, "asDropdown")) {

                var elemNg = angular.element(elem[0]);
                _.each(settings.account.currencies, function (item) {

                    var option = '<li><a class="pointer">' + item.name + '</a></li>';
                    optionNg = angular.element(option);

                    elemNg.append(optionNg);

                    optionNg.bind("click", function (event) {

                        // Clear previous errors
                        scope.error = null;

                        // Placed within a timeout otherwise the update was happening before the change to the model occured.
                        $timeout(function () {
                            setCurrency(scope, item.code, attrs);
                        });
                    });

                });

                // Set the current value for display
                var elems = angular.element(elem.parent().children());
                var label = elems.find("span");
                if (label) {
                    label.text(CurrencyService.getCurrencyName());
                }

                // Listen for a change
                $rootScope.$on("currencyChanged", function (event, currency) {
                    var elems = angular.element(elem.parent().children());
                    var label = elems.find("span");
                    if (label) {
                        label.text(CurrencyService.getCurrencyName());
                    }
                });

            } else {

                var elemNg = angular.element(elem[0]);
                _.each(settings.account.currencies, function (item) {

                    var option = '<option value="' + item.code + '"';
                    if (item.code == CurrencyService.getCurrency()) {
                        option += " selected";
                    }
                    option += '>' + item.name + '</option>';
                    elemNg.append(option);

                });

                elem.bind("change", function (event) {

                    // Clear previous errors
                    scope.error = null;

                    var selectedCurrency = angular.element(elem[0]).val();

                    // Placed within a timeout otherwise the update was happening before the change to the model occured.
                    $timeout(function () {
                        setCurrency(scope, selectedCurrency, attrs);
                    });

                });

                // Listen for a change
                $rootScope.$on("currencyChanged", function (event, currency) {
                    elemNg[0].value = currency;
                });
            }

            var setCurrency = function (scope, selectedCurrency, attrs) {

                // Prep the params
                var params = scope.params || attrs.params;
                params = utils.mergeParams(params, null, null);

                // If associated with a cart, update the cart.
                if (scope.cart && StorageService.get("cart_id")) {

                    CartService.update({ currency: selectedCurrency }, scope.params).then(function (cart) {

                        CurrencyService.setCurrency(selectedCurrency);

                        // We don't want to remove unsaved customer values from the view.
                        var customer = null;
                        if (scope.cart) {
                            customer = scope.cart.customer;
                        }
                        scope.cart = cart;

                        if (customer) {
                            // Restore the original customer data.
                            scope.cart.customer = customer;
                        }

                        if (scope.onSuccess) {
                            scope.onSuccess(selectedCurrency);
                        }

                    }, function (error) {
                        scope.error = error;
                        if (scope.onError) {
                            scope.onError(error);
                        }
                    });

                };

                // If associated with an invoice, update the invoice.
                if (scope.invoice && StorageService.get("invoice_id")) {

                    InvoiceService.update({ currency: selectedCurrency }, scope.params).then(function (invoice) {

                        CurrencyService.setCurrency(selectedCurrency);

                        // We don't want to remove unsaved customer values from the view.
                        var customer = null;
                        if (scope.invoice) {
                            customer = scope.invoice.customer;
                        }
                        scope.invoice = invoice;

                        if (customer) {
                            // Restore the original customer data.
                            scope.invoice.customer = customer;
                        }

                        if (scope.onSuccess) {
                            scope.onSuccess(selectedCurrency);
                        }

                    }, function (error) {
                        scope.error = error;
                        if (scope.onError) {
                            scope.onError(error);
                        }
                    });

                };

                // If associated with a payment, update the payment. Refresh the payment options, if provided.
                if (scope.payment) {

                    scope.payment.currency = selectedCurrency;

                    if (scope.options) {
                        // Update the options according to the supplied currency.
                        PaymentService.getOptions({ currency: selectedCurrency }).then(function (options) {
                            scope.options = options;
                        }, function (error) {
                            scope.error = error;
                            if (scope.onError) {
                                scope.onError(error);
                            }
                        });
                    }

                    if (scope.onSuccess) {
                        scope.onSuccess(selectedCurrency);
                    }

                    CurrencyService.setCurrency(selectedCurrency);
                    scope.payment.currency = selectedCurrency;

                };

                // If products were supplied, refresh the list of products to show the products in the newly selected currency
                if (scope.products) {

                    // Pass through the current parameters from products (such as pagination)
                    var pageParams = utils.getQueryParameters(scope.products.current_page_url);

                    // Set the new currency
                    params.currency = selectedCurrency;

                    ProductService.getList(scope.params).then(function (products) {

                        scope.products = products;
                        CurrencyService.setCurrency(selectedCurrency);

                        // If the user changes the currency of a product and has a cart, update the cart to that same currency to provide a better experience.
                        if (StorageService.get("cart_id")) {
                            CartService.update({ currency: selectedCurrency }, scope.params, true);
                        };

                        if (scope.onSuccess) {
                            scope.onSuccess(selectedCurrency);
                        }

                    }, function (error) {
                        scope.error = error;
                        if (scope.onError) {
                            scope.onError(error);
                        }
                    });
                }

                // If a product was supplied, refresh the product to show the product in the newly selected currency
                if (scope.product) {

                    // Pass through the current parameters from product
                    var pageParams = utils.getQueryParameters(scope.product.url);

                    // Set the new currency
                    scope.params.currency = selectedCurrency;

                    ProductService.get(scope.product.product_id, scope.params).then(function (product) {

                        scope.product = product;
                        CurrencyService.setCurrency(selectedCurrency);

                        // If the user changes the currency of a product and has a cart, update the cart to that same currency to provide a better experience.
                        if (StorageService.get("cart_id")) {
                            CartService.update({ currency: selectedCurrency }, scope.params, true);
                        };

                        if (scope.onSuccess) {
                            scope.onSuccess(selectedCurrency);
                        }

                    }, function (error) {
                        scope.error = error;
                        if (scope.onError) {
                            scope.onError(error);
                        }
                    });
                }

            };
        }
    };
}]);

app.directive('languageSelect', ['LanguageService', '$timeout', '$rootScope', function (LanguageService, $timeout, $rootScope) {

    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {

            // Get the languages
            var languages = LanguageService.getLanguages();

            if (utils.hasProperty(attrs, "asDropdown")) {

                var elemNg = angular.element(elem[0]);

                _.each(languages, function (language) {
                    var option = '<li><a class="pointer">' + language.name + '</a></li>';
                    optionNg = angular.element(option);
                    elemNg.append(optionNg);

                    optionNg.bind("click", function (event) {

                        // Placed within a timeout otherwise the update was happening before the change to the model occured.
                        $timeout(function () {
                            LanguageService.setLanguage(language.code, attrs.languagesPath);
                        });

                    });
                });

                // Set the current value for display
                var elems = angular.element(elem.parent().children());
                var label = elems.find("span");
                if (label) {
                    label.text(LanguageService.getSelectedLanguage().name);
                }

                // Listen for a change
                $rootScope.$on("languageChanged", function (event, currency) {
                    var elems = angular.element(elem.parent().children());
                    var label = elems.find("span");
                    if (label) {
                        label.text(LanguageService.getSelectedLanguage().name);
                    }
                });

            } else {

                var elemNg = angular.element(elem[0]);
                _.each(languages, function (language) {

                    var option = '<option value="' + language.code + '"';
                    if (language.code == LanguageService.getSelectedLanguage().code) {
                        option += " selected";
                    }
                    option += '>' + language.name + '</option>';
                    elemNg.append(option);

                });

                elem.bind("change", function (event) {

                    var selectedLanguage = angular.element(elem[0]).val();

                    // Placed within a timeout otherwise the update was happening before the change to the model occured.
                    $timeout(function () {
                        LanguageService.setLanguage(selectedLanguage);
                    });

                });

                // Listen for a change
                $rootScope.$on("languageChanged", function (event, language) {
                    elemNg[0].value = language;
                });
            }
        }
    };
}]);

app.directive('shippingSelect', ['CartService', 'InvoiceService', '$timeout', function (CartService, InvoiceService, $timeout) {

    return {
        restrict: 'A',
        scope: {
            sale: '=?',
            shippingQuotes: '=?',
            params: '=?',
            onSuccess: '=?',
            onError: '=?',
            error: '=?'
        },
        link: function (scope, elem, attrs) {

            // Shared scope:
            // sale: The cart or invoice that is on the current page.
            // error: The error object to communicate errors.
            // onSuccess: A function that will be called from scope when the currency is successfully changed. Will include the newly set currency as a parameter.
            // onError: A function that will be called from scope when the currency change fails. Will include an error object as a parameter.

            // Attributes
            // params: Any parameters you want to pass to the update function (i.e. expand, show, etc.)
            // saleType: "cart" or "invoice" - a string that indicates what is being passed in through the sale shared scope.

            scope.$watch("shippingQuotes", function (newValue, oldValue) {

                if (newValue) {

                    var method_id = null;
                    if (scope.sale.shipping_item) {
                        method_id = scope.sale.shipping_item.item_id;
                    }

                    var elemNg = angular.element(elem[0]);

                    // Clear any previous options
                    elemNg.html("");

                    _.each(scope.shippingQuotes, function (item) {

                        var option = '<option value="' + item.method_id + '"';
                        if (item.method_id == method_id) {
                            option += " selected";
                        }
                        option += '>' + item.description + ' (' + item.formatted.price + ')</option>';
                        elemNg.append(option);

                    });

                }
            });

            elem.bind("change", function (event) {

                // Clear previous errors
                scope.error = null;

                var selectedMethod = angular.element(elem[0]).val();

                // Prep the params
                var params = scope.params || attrs.params;
                params = utils.mergeParams(params, null, null);

                // Placed within a timeout otherwise the update was happening before the change to the model occured.
                $timeout(function () {

                    var data = { shipping_method_id: selectedMethod };

                    if (attrs.saleType == "cart") {
                        CartService.update(data, scope.params).then(function (cart) {

                            // In the event that there were changes to the view between the time the call was sent and returned, we don't want to overwrite them. As a result, we won't sync the server customer values with the model.
                            cart.customer = scope.sale.customer;

                            // Sync the scope to the response.
                            scope.sale = cart;

                            if (scope.onSuccess) {
                                scope.onSuccess(selectedCurrency);
                            }

                        }, function (error) {
                            scope.error = error;
                            if (scope.onError) {
                                scope.onError(error);
                            }
                        });
                    }

                    if (attrs.saleType == "invoice") {
                        InvoiceService.update(data, scope.params).then(function (invoice) {

                            // In the event that there were changes to the view between the time the call was sent and returned, we don't want to overwrite them. As a result, we won't sync the server customer values with the model.
                            invoice.customer = scope.sale.customer;

                            // Sync the scope to the response.
                            scope.sale = invoice;

                            if (scope.onSuccess) {
                                scope.onSuccess(selectedCurrency);
                            }

                        }, function (error) {
                            scope.error = error;
                            if (scope.onError) {
                                scope.onError(error);
                            }
                        });
                    }

                });
            });
        }
    };
}]);

app.directive('shippingRadio', ['CartService', 'InvoiceService', '$timeout', function (CartService, InvoiceService, $timeout) {

    return {
        restrict: 'A',
        scope: {
            sale: '=?',
            shippingQuotes: '=?',
            params: '=?',
            onSuccess: '=?',
            onError: '=?',
            error: '=?'
        },
        link: function (scope, elem, attrs) {

            // Shared scope:
            // sale: The cart or invoice that is on the current page.
            // error: The error object to communicate errors.
            // onSuccess: A function that will be called from scope when the currency is successfully changed. Will include the newly set currency as a parameter.
            // onError: A function that will be called from scope when the currency change fails. Will include an error object as a parameter.

            // Attributes
            // params: Any parameters you want to pass to the update function (i.e. expand, show, etc.)
            // saleType: "cart" or "invoice" - a string that indicates what is being passed in through the sale shared scope.

            elem.bind("change", function (event) {

                // Clear previous errors
                scope.error = null;

                var selectedMethod = attrs.shippingRadio;

                // Prep the params
                var params = scope.params || attrs.params;
                params = utils.mergeParams(params, null, null);

                // Placed within a timeout otherwise the update was happening before the change to the model occured.
                $timeout(function () {
                    var data = { shipping_method_id: selectedMethod };

                    if (attrs.saleType == "cart") {
                        CartService.update(data, scope.params).then(function (cart) {

                            // In the event that there were changes to the view between the time the call was sent and returned, we don't want to overwrite them. As a result, we won't sync the server customer values with the model.
                            if (scope.sale) {
                                cart.customer = scope.sale.customer;
                            }

                            // Sync the scope to the response.
                            scope.sale = cart;

                            if (scope.onSuccess) {
                                scope.onSuccess(selectedCurrency);
                            }

                        }, function (error) {
                            scope.error = error;
                            if (scope.onError) {
                                scope.onError(error);
                            }
                        });
                    }

                    if (attrs.saleType == "invoice") {
                        InvoiceService.update(data, scope.params).then(function (invoice) {

                            // In the event that there were changes to the view between the time the call was sent and returned, we don't want to overwrite them. As a result, we won't sync the server customer values with the model.
                            if (scope.sale) {
                                invoice.customer = scope.sale.customer;
                            }

                            // Sync the scope to the response.
                            scope.sale = invoice;

                            if (scope.onSuccess) {
                                scope.onSuccess(selectedCurrency);
                            }

                        }, function (error) {
                            scope.error = error;
                            if (scope.onError) {
                                scope.onError(error);
                            }
                        });
                    }

                });
            });
        }
    };
}]);

app.directive('customerCountries', ['GeoService', '$timeout', function (GeoService, $timeout) {

    return {
        restrict: 'A',
        require: "ngModel",
        link: function (scope, elem, attrs, ctrl) {

            // Attributes
            // customerCountries: A list of allowed customer countries

            scope.$watch(attrs.customerCountries, function (customerCountries, oldValue) {

                if (customerCountries) {

                    var elemNg = angular.element(elem[0]);

                    // Clear any previous options
                    elemNg.html("");

                    // Get the entire list of countries
                    var countries = GeoService.getData().countries;

                    countries = _.filter(countries, function (country) { return customerCountries.indexOf(country.code) > -1; });

                    // Insert a blank at the top
                    elemNg.append("<option></option>");

                    // Get the value
                    var value = ctrl.$viewValue || ctrl.$modelValue;

                    // Set a flag to indicate if you found a match of current country
                    var match = false;

                    _.each(countries, function (item) {

                        var option = '<option value="' + item.code + '"';
                        if (item.code == value) {
                            option += " selected";
                            match = true;
                        }
                        option += '>' + item.name + '</option>';
                        elemNg.append(option);

                    });

                    // If no match, remove the value of the current control
                    if (match == false) {
                        ctrl.$setViewValue(null);
                    }

                }
            });

        }
    };
}]);

app.directive('showErrors', ['$timeout', 'SettingsService', function ($timeout, SettingsService) {
    return {
        restrict: 'A',
        require: '^form',
        link: function (scope, elem, attrs, ctrl) {

            // Find the input element and error block elements
            var load = function () {
                $timeout(function () {

                    var inputEl = elem[0].querySelector("[name]");
                    var labelEl = elem[0].querySelector("label");
                    var errorEl = angular.element(elem[0].querySelector(".error-block"));

                    // Convert the native angular elements
                    var inputNgEl = angular.element(inputEl);
                    var labelNgEl = angular.element(labelEl);
                    var errorNgEl = angular.element(errorEl);

                    // Remove errors, by default
                    elem.removeClass("has-error");
                    errorNgEl.addClass("hidden");

                    // Get the name of the text box
                    var inputName = inputNgEl.attr("name");

                    // If required, add a required class to the label, if supplied
                    scope.$watch(attrs.showErrors, function (newValue, oldValue) {
                        if (newValue && inputEl) {
                            if (inputEl.required) {
                                if (labelNgEl) {
                                    labelNgEl.addClass("required");
                                }
                            } else {
                                labelNgEl.removeClass("required");
                            }
                        }
                    });

                    // Define the action upon which we re-validate
                    var action = "blur";

                    // We don't do select elements on change because it can get cause a huge performance hit if a user navigates up and down a select list with a keyboard, causing many requests per second.
                    if (inputEl) {
                        if (inputEl.type == "checkbox" || inputEl.type == "radio") {
                            action = "change";
                        }
                    }

                    // Apply and remove has-error and hidden on blur
                    inputNgEl.bind(action, function () {

                        var settings = SettingsService.get();
                        var errorLevel = settings.app.error_notifications || "moderate";

                        // Define how aggressive error messaging is on blur: mild, moderate, aggressive
                        if (errorLevel == "moderate") {
                            elem.toggleClass("has-error", ctrl[inputName].$invalid);
                        }

                        if (errorLevel == "aggressive") {
                            elem.toggleClass("has-error", ctrl[inputName].$invalid);
                            errorNgEl.toggleClass("hidden", !ctrl[inputName].$invalid);
                        }

                        // We only show on form submit, so on blur we only hide.
                        if (ctrl[inputName].$invalid == false) {
                            errorNgEl.toggleClass("hidden", true);
                        }

                    });

                    // Listen for the form submit and show any errors (plus error text)
                    scope.$on("show-errors-check-validity", function () {
                        if (ctrl[inputName]) {
                            elem.toggleClass("has-error", ctrl[inputName].$invalid);
                            errorNgEl.toggleClass("hidden", !ctrl[inputName].$invalid);
                        }
                    });

                });
            };

            // Set the initial listener
            load();

            // Watch for a trigger to reload the listener
            if (attrs.refreshOnChange) {
                scope.$watch(attrs.refreshOnChange, function (newValue, oldValue) {
                    load();
                });
            }
        }
    };
}]);

app.directive('conversion', ['SettingsService', 'StorageService', function (SettingsService, StorageService) {

    // Attributes:
    // orderId: The order_id from the order, if null we don't record the conversion, which helps prevent false positives.

    return {
        restrict: 'A',
        scope: {
            conversion: '@'
        },
        link: function (scope, elem, attrs, ctrl) {

            // Define your observe function
            var setTracking = function () {
                attrs.$observe("conversion", function (order_id) {
                    if (utils.isNullOrEmpty(order_id) == false) {

                        var head = document.getElementsByTagName("head")[0];
                        var js = document.createElement("script");
                        js.id = "__conversion";
                        js.type = "text/javascript";
                        js.src = "analytics/conversion.js";
                        js.setAttribute("data-order_id", order_id);

                        // Remove any existing
                        if (document.getElementById("__conversion") != null) {
                            head.removeChild(document.getElementById("__conversion"));
                        }

                        // Add again to force reload.
                        head.appendChild(js);
                    }
                });
            };

            // Get the settings
            var settings = SettingsService.get();
            if (settings.config.development != true) {
                // Your are not in a development environment, so set the tracking. 
                setTracking();
            }
        }
    };
}]);

app.directive('validateOnSubmit', function () {
    return {
        restrict: 'A',
        require: '^form',
        link: function (scope, elem, attrs, ctrl) {

            elem.bind("click", function () {
                scope.$broadcast('show-errors-check-validity');
            });

        }
    };
});

app.directive('validateExpMonth', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {

            ctrl.$parsers.unshift(function (viewValue) {

                if (utils.isValidInteger(viewValue) == false) {
                    ctrl.$setValidity('month', false);
                    return undefined;
                }

                if (viewValue > 12) {
                    ctrl.$setValidity('month', false);
                    return undefined;
                }

                if (viewValue < 1) {
                    ctrl.$setValidity('month', false);
                    return undefined;
                }

                ctrl.$setValidity('month', true);
                return viewValue;

            });

        }

    };

});

app.directive('validateExpYear', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {

            ctrl.$parsers.unshift(function (viewValue) {

                if (utils.isValidInteger(viewValue) == false) {
                    ctrl.$setValidity('year', false);
                    return undefined;
                }

                if (viewValue.length > 4) {
                    ctrl.$setValidity('year', false);
                    return undefined;
                }

                if (viewValue.length < 2) {
                    ctrl.$setValidity('year', false);
                    return undefined;
                }

                ctrl.$setValidity('year', true);
                return viewValue;

            });

        }

    };

});

app.directive('validateCvv', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {

            ctrl.$parsers.unshift(function (viewValue) {

                var type = attrs.validateCvv;
                var length;

                // If the supplied cart number is Amex, then the length must be 4. Otherwise, 3.
                if (type) {
                    if (type.substring(0, 1).toString() == "3") {
                        length = 4;
                    } else {
                        length = 3;
                    }
                }

                if (utils.isValidInteger(viewValue) == false) {
                    ctrl.$setValidity('cvv', false);
                    return undefined;
                }

                if (viewValue.length < 3) {
                    ctrl.$setValidity('cvv', false);
                    return undefined;
                }

                if (viewValue.length > 4) {
                    ctrl.$setValidity('cvv', false);
                    return undefined;
                }

                // If the length is defined, we have a card number which means we know the card type. If the length does not match the card type, error.
                if (length) {
                    if (viewValue.length != length) {
                        ctrl.$setValidity('cvv', false);
                        return undefined;
                    }
                }

                ctrl.$setValidity('cvv', true);
                return viewValue;

            });

        }

    };

});

app.directive('validateCard', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {

            ctrl.$parsers.unshift(function (viewValue) {

                // Strip any whitespace
                viewValue = utils.removeWhitespace(viewValue);

                if (utils.isNullOrEmpty(viewValue)) {
                    ctrl.$setValidity('card', false);
                    return undefined;
                }

                if (/^\d+$/.test(viewValue) == false) {
                    ctrl.$setValidity('card', false);
                    return undefined;
                }

                if (viewValue.length < 14) {
                    ctrl.$setValidity('card', false);
                    return undefined;
                }

                if (viewValue.length > 19) {
                    ctrl.$setValidity('card', false);
                    return undefined;
                }

                if (utils.luhnCheck(viewValue) == false) {
                    ctrl.$setValidity('card', false);
                    return undefined;
                }

                ctrl.$setValidity('card', true);
                return viewValue;

            });

        }

    };

});

app.directive('isValidInteger', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {

            ctrl.$validators.characters = function (modelValue, viewValue) {
                var value = modelValue || viewValue;
                if (attrs.allowEmptyValue == "true" && (value == "" || value == null)) {
                    return true;
                }
                if (utils.isValidInteger(value) == false) {
                    return false;
                }
                if (attrs.max) {
                    if (value > attrs.max) {
                        return false;
                    }
                }
                if (attrs.lessThan) {
                    if (value >= attrs.lessThan) {
                        return false;
                    }
                }
                if (attrs.min) {
                    if (value < attrs.min) {
                        return false;
                    }
                }
                if (attrs.greaterThan) {
                    if (value <= attrs.greaterThan) {
                        return false;
                    }
                }
                return true;
            };
        }
    };
});

app.directive('isValidNumber', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {

            ctrl.$validators.characters = function (modelValue, viewValue) {
                var value = modelValue || viewValue;
                if (attrs.allowEmptyValue == "true" && (value == "" || value == null)) {
                    return true;
                }
                if (utils.isValidNumber(value) == false) {
                    return false;
                }
                if (attrs.max) {
                    if (value > attrs.max) {
                        return false;
                    }
                }
                if (attrs.lessThan) {
                    if (value >= attrs.lessThan) {
                        return false;
                    }
                }
                if (attrs.min) {
                    if (value < attrs.min) {
                        return false;
                    }
                }
                if (attrs.greaterThan) {
                    if (value <= attrs.greaterThan) {
                        return false;
                    }
                }
                return true;
            };
        }
    };
});

app.directive('promoCode', ['CartService', '$timeout', function (CartService, $timeout) {

    // Shared scope:
    // cart: The cart to which the promo code should be applied
    // onAdd: A function that will be called from scope when the currency is successfully changed. Will include the newly updated cart as a parameter.
    // onRemove: A function that will be called from scope when the currency is successfully changed. Will include the newly updated cart as a parameter.
    // onError: A function that will be called from scope when the currency change fails. Will include an error object as a parameter.
    // error: The error object to communicate errors.

    // Attributes
    // params: Any parameters you want to pass to the update function (i.e. expand, show, etc.)

    // An HTML template that shows the classes that should be applied to each component and state of the promotion code request
    //<div class="col-xs-12 promo-code" ng-cloak promo-code cart="data.cart" error="data.error">
    //    <label class="ask-promo-code">Enter Promo Code</label>
    //    <div class="form-inline supply-promo-code">
    //        <input class="form-control" type="text" placeholder="{{ 'Enter Promo Code' | translate}}">
    //        <button type="submit" class="btn btn-info apply-promo-code">Apply</button>
    //    </div>
    //    <div class="applied-promo-code">
    //        <strong translate>Discount applied.</strong>&nbsp;&nbsp;<strong class="text-success">{{data.cart.promotion_code}}</strong>&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-trash fa-lg pointer remove-promo-code"></i>
    //    </div>
    //</div>

    return {
        restrict: 'A',
        scope: {
            cart: '=?',
            params: '=?',
            error: '=?',
            onAdd: '=?',
            onRemove: '=?',
            onError: '=?'
        },
        link: function (scope, elem, attrs, ctrl) {

            var label = angular.element(elem[0].querySelector('.ask-promo-code'));
            var request = angular.element(elem[0].querySelector('.supply-promo-code'));
            var applied = angular.element(elem[0].querySelector('.applied-promo-code'));
            var input = angular.element(elem.find("input"));
            var button = angular.element(elem[0].querySelector('.apply-promo-code'));
            var remove = angular.element(elem[0].querySelector('.remove-promo-code'));

            // Set the state
            request.addClass("hidden");
            applied.addClass("hidden");

            scope.$watch("cart", function (newCart, oldCart) {
                if (newCart) {
                    if (newCart.promotion_code) {
                        label.addClass("hidden");
                        applied.removeClass("hidden");
                    } else {
                        applied.addClass("hidden");
                    }
                }
            });

            label.bind("click", function () {

                label.addClass("hidden");
                request.removeClass("hidden");

                // Focus the input
                $timeout(function () {
                    elem.find("input")[0].focus();
                });

            });

            button.bind("click", function () {

                // Get the promo code
                var promoCode = input.val();

                if (utils.isNullOrEmpty(promoCode)) {
                    return;
                }

                // Clear previous errors
                scope.error = null;

                // Build the request
                var cart = { promotion_code: promoCode };

                // Prep the params
                var params = scope.params || attrs.params;
                params = utils.mergeParams(params, null, null);

                CartService.update(cart, scope.params).then(function (cart) {
                    scope.cart = cart;

                    // Fire the add event
                    if (scope.onAdd) {
                        scope.onAdd(cart);
                    }

                    // Hide the request form
                    request.addClass("hidden");

                    // Show the applied field
                    applied.removeClass("hidden");

                }, function (error) {

                    scope.error = error;
                    // Fire the error event
                    if (scope.onError) {
                        scope.onError(error);
                    }

                });

            });

            remove.bind("click", function () {

                // Reset the promo code
                input.val("");

                // Clear previous errors
                scope.error = null;

                // Build the request
                var cart = { promotion_code: null };

                // Prep the params
                var params = scope.params || attrs.params;
                params = utils.mergeParams(params, null, null);

                CartService.update(cart, scope.params).then(function (cart) {
                    scope.cart = cart;

                    // Fire the remove event
                    if (scope.onRemove) {
                        scope.onRemove(cart);
                    }

                    // Show the label
                    label.removeClass("hidden");

                    // Hide the applied field
                    applied.addClass("hidden");

                }, function (error) {
                    scope.error = error;

                    // Fire the error event
                    if (scope.onError) {
                        scope.onError(error);
                    }

                });

            });

            input.bind("blur", function () {

                // On blur, if no code is supplied, reset back to default
                if (utils.isNullOrEmpty(input.val())) {
                    request.addClass("hidden");
                    applied.addClass("hidden");
                    label.removeClass("hidden");

                    // Clear previous errors
                    $timeout(function () {
                        scope.error = null;
                    });
                }

            });

        }
    };
}]);

app.directive('customerSignin', ['CartService', 'CustomerService', '$timeout', function (CartService, CustomerService, $timeout) {

    // Shared scope:
    // cart: The cart to which the login should be applied, if the login is associated with a cart
    // customer: The customer object to which the login should be applied. Must be provided if a cart is not provided, if a cart is provided this is unnecessary and will not be used.
    // paymentMethod: The cart's payment method object
    // onSigninSubmit: A function that will be called when the signin is submitted.
    // onSignoutSubmit: A function that will be called when the signout is submitted.
    // onSigninSuccess: A function that will be called when the signin is successfully completed. Will include the cart as a parameter.
    // onSignoutSuccess: A function that will be called when the signout is successfully completed. Will include the cart as a parameter.
    // onSigninError: A function that will be called when the signin fails. Will include an error object as a parameter.
    // onSignoutError: A function that will be called when the signout fails. Will include an error object as a parameter.
    // error: The error object to communicate errors.
    // options: The cart options that indicates if the login prompt should be shown or not.

    // Attributes
    // params: Any parameters you want to pass to the update function (i.e. expand, show, etc.)

    // An HTML template that shows the classes that should be applied to each component and state of the signin
    //<div customer-signin cart="data.cart" payment-method="data.payment_method" options="data.cart.options" error="data.error" params="params">

    //    <div class="well clearfix ask-signin">
    //        <strong><span translate>Have an account?</span></strong>
    //        <strong><a class="pointer pull-right show-signin" translate>Sign In</a></strong>
    //    </div>

    //    <div class="well clearfix supply-signin">
    //        <div class="col-xs-12 col-md-6" id="un">
    //            <div class="form-group">
    //                <label class="control-label" for="un" translate>Username</label>
    //                <input class="form-control signin-username" name="un" type="text">
    //            </div>
    //        </div>

    //        <div class="col-xs-12 col-md-6" id="pw">
    //            <div class="form-group">
    //                <label class="control-label" for="pw" translate>Password</label>
    //                <input class="form-control signin-password" name="pw" type="password">
    //            </div>
    //        </div>

    //        <div class="col-xs-12 text-right">
    //            <button class="btn btn-sm cancel-signin" translate>Cancel</button>
    //            <button type="submit" class="btn btn-default btn-sm submit-signin" customer-login cart="data.cart" username="data.un" password="data.pw" error="data.error" translate>Sign In</button>
    //        </div>
    //    </div>

    //    <div class="well signed-in">
    //        <span>Signed in as {{data.cart.customer.username}}</span><strong><a class="pointer pull-right submit-signout" customer-logout cart="data.cart" error="data.error" translate>Sign out</a></strong>
    //    </div>

    //</div>        


    return {
        restrict: 'A',
        scope: {
            cart: '=',
            customer: '=',
            paymentMethod: '=?',
            options: '=?',
            params: '=?',
            error: '=?',
            onSigninSubmit: '=?',
            onSignoutSubmit: '=?',
            onSigninSuccess: '=?',
            onSignoutSuccess: '=?',
            onSigninError: '=?',
            onSignoutError: '=?'
        },
        link: function (scope, elem, attrs) {

            var askSignin = angular.element(elem[0].querySelector('.ask-signin'));
            var showSignin = angular.element(elem[0].querySelector('.show-signin'));
            var supplySignin = angular.element(elem[0].querySelector('.supply-signin'));
            var username = angular.element(elem[0].querySelector('.signin-username'));
            var password = angular.element(elem[0].querySelector('.signin-password'));
            var submit = angular.element(elem[0].querySelector('.submit-signin'));
            var cancel = angular.element(elem[0].querySelector('.cancel-signin'));
            var signedIn = angular.element(elem[0].querySelector('.signed-in'));
            var signOut = angular.element(elem[0].querySelector('.submit-signout'));

            var hideAll = function () {
                askSignin.addClass("hidden");
                supplySignin.addClass("hidden");
                signedIn.addClass("hidden");
            };

            // Set the default state
            elem.addClass("hidden");
            hideAll();

            scope.$watchGroup(["options", "cart", "customer"], function (newValues, oldValues) {

                var options = newValues[0];
                var cart = newValues[1];
                var customer = newValues[2];

                if (options) {
                    if (options.customer_optional_fields) {
                        if (options.customer_optional_fields.indexOf("username") >= 0) {
                            hideAll();
                            elem.removeClass("hidden");
                            askSignin.removeClass("hidden");
                        }
                    }
                }

                if (cart) {
                    if (cart.customer) {
                        hideAll();
                        if (cart.customer.username) {
                            signedIn.removeClass("hidden");
                        } else {
                            askSignin.removeClass("hidden");
                        }
                    }
                }

                if (customer) {
                    hideAll();
                    if (customer.username) {
                        signedIn.removeClass("hidden");
                    } else {
                        askSignin.removeClass("hidden");
                    }
                }

            }, true);

            showSignin.bind("click", function () {

                askSignin.addClass("hidden");
                supplySignin.removeClass("hidden");

                // Focus the input
                $timeout(function () {
                    elem.find("input")[0].focus();
                });

            });

            // Bind to the password enter event
            password.bind("keydown", function (event) {
                if (event.which == 13) {
                    submitForm();
                }
            });

            // Bind to the username enter event
            username.bind("keydown", function (event) {
                if (event.which == 13) {
                    submitForm();
                }
            });

            // Bind to the submit button click          
            submit.bind("click", function (event) {
                submitForm();
            });

            signOut.bind("click", function () {

                // Fire the event
                if (scope.onSignoutSubmit) {
                    scope.onSignoutSubmit();
                }

                // If associated with a cart, log the customer out of the cart to disassociated the cart from the user.
                if (scope.cart) {

                    // Prep the params
                    var params = scope.params || attrs.params;
                    params = utils.mergeParams(params, null, "customer.payment_methods");

                    CartService.logout(params).then(function (cart) {

                        scope.cart = cart;

                        // Delete the payment_method_id on the payment method object
                        delete scope.paymentMethod.payment_method_id;

                        // Fire the success event
                        if (scope.onSignoutSuccess) {
                            scope.onSignoutSuccess(cart);
                        }

                    }, function (error) {

                        scope.error = error;
                        // Fire the error event
                        if (scope.onSignoutError) {
                            scope.onSignoutError(error);
                        }

                    });

                } else {

                    // Not associated with a cart
                    if (scope.customer) {

                        scope.$apply(function () {

                            // Reset the customer to empty. Set country explicitly to null otherwise you end up with an option 'undefined' in country HTML select controls.
                            scope.customer = { billing_address: { country: null }, shipping_address: { country: null } };

                            // Delete the payment_method_id on the payment method object
                            delete scope.paymentMethod.payment_method_id;
                        });

                        // Fire the success event
                        if (scope.onSignoutSuccess) {
                            scope.onSignoutSuccess();
                        }
                    }

                }

            });

            cancel.bind("click", function () {

                // Reset the username and password
                username.val("");
                password.val("");

                // Clear previous errors
                scope.error = null;

                // Reset back to login prompt.
                hideAll();
                askSignin.removeClass("hidden");

            });

            var submitForm = function () {

                // Get the login values
                var un = username.val();
                var pw = password.val();

                if (utils.isNullOrEmpty(un) || utils.isNullOrEmpty(pw)) {
                    return;
                }

                // Clear previous errors
                scope.error = null;

                // Fire the event
                if (scope.onSigninSubmit) {
                    scope.onSigninSubmit();
                }

                // Build the login object
                var login = { username: un, password: pw };

                // If a cart is provided, log the user into the cart.
                if (scope.cart) {

                    // Prep the params
                    var params = scope.params || attrs.params;
                    params = utils.mergeParams(params, null, "customer.payment_methods");

                    CartService.login(login, params).then(function (cart) {

                        scope.cart = cart;

                        // Remove the username and password
                        username.val("");
                        password.val("");

                        // If the customer has payment methods and the payment method object is supplied, assign the default payment method id
                        if (cart.customer.payment_methods.data.length > 0 && scope.paymentMethod) {
                            var payment_method_id = _.findWhere(cart.customer.payment_methods.data, { is_default: true }).payment_method_id;
                            scope.paymentMethod = { payment_method_id: payment_method_id };
                        }

                        // Fire the success event
                        if (scope.onSigninSuccess) {
                            scope.onSigninSuccess(cart);
                        }

                    }, function (error) {

                        scope.error = error;
                        // Fire the error event
                        if (scope.onSigninError) {
                            scope.onSigninError(error);
                        }

                    });

                } else {

                    // Otherwise, log the customer in directly.

                    // Prep the params
                    var params = scope.params || attrs.params;
                    params = utils.mergeParams(params, null, "payment_methods");

                    CustomerService.login(login, params).then(function (customer) {

                        // Update the customer object with the returned customer.
                        scope.customer = customer;

                        // Remove the username and password
                        username.val("");
                        password.val("");

                        // If the customer has payment methods and the payment method object is supplied, assign the default payment method id
                        if (customer.payment_methods.data.length > 0 && scope.paymentMethod) {
                            var payment_method_id = _.findWhere(customer.payment_methods.data, { is_default: true }).payment_method_id;
                            scope.paymentMethod = { payment_method_id: payment_method_id };
                        }

                        // Fire the success event
                        if (scope.onSigninSuccess) {
                            scope.onSigninSuccess(customer);
                        }

                    }, function (error) {

                        scope.error = error;
                        // Fire the error event
                        if (scope.onSigninError) {
                            scope.onSigninError(error);
                        }

                    });

                }

            };

        }
    };
}]);

app.directive('createAccount', ['CustomerService', '$timeout', function (CustomerService, $timeout) {

    // Shared scope:
    // customer: The customer for which an account will be created. Must include the customer_id.
    // onSubmit: A function that will be called when the signin is submitted.
    // onSuccess: A function that will be called when the signin is successfully completed. Will include the cart as a parameter.
    // onError: A function that will be called when the signout fails. Will include an error object as a parameter.
    // error: The error object to communicate errors.
    // options: The cart options that indicates if the create account prompt should be shown or not.

    // Attributes
    // params: Any parameters you want to pass to the update function (i.e. expand, show, etc.)

    // An HTML template that shows the classes that should be applied to each component and state of the signin
    //<div customer-signin cart="data.cart" payment-method="data.payment_method" options="data.cart.options" error="data.error" params="params">

    //    <div class="well clearfix ask-signin">
    //        <strong><span translate>Have an account?</span></strong>
    //        <strong><a class="pointer pull-right show-signin" translate>Sign In</a></strong>
    //    </div>

    //    <div class="well clearfix create-account">
    //        <div class="col-xs-12 col-md-6" id="un">
    //            <div class="form-group">
    //                <label class="control-label" for="un" translate>Username</label>
    //                <input class="form-control signin-username" name="un" type="text">
    //            </div>
    //        </div>

    //        <div class="col-xs-12 col-md-6" id="pw">
    //            <div class="form-group">
    //                <label class="control-label" for="pw" translate>Password</label>
    //                <input class="form-control signin-password" name="pw" type="password">
    //            </div>
    //        </div>

    //        <div class="col-xs-12 text-right">
    //            <button class="btn btn-sm cancel-signin" translate>Cancel</button>
    //            <button type="submit" class="btn btn-default btn-sm submit-signin" customer-login cart="data.cart" username="data.un" password="data.pw" error="data.error" translate>Sign In</button>
    //        </div>
    //    </div>

    //    <div class="well signed-in">
    //        <span>Signed in as {{data.cart.customer.username}}</span><strong><a class="pointer pull-right submit-signout" customer-logout cart="data.cart" error="data.error" translate>Sign out</a></strong>
    //    </div>

    //</div>        


    return {
        restrict: 'A',
        scope: {
            customer: '=',
            options: '=?',
            params: '=?',
            error: '=?',
            onSubmit: '=?',
            onSuccess: '=?',
            onError: '=?'
        },
        link: function (scope, elem, attrs) {

            var supplyCredentials = angular.element(elem[0].querySelector('.supply-credentials'));
            var username = angular.element(elem[0].querySelector('.create-account-username'));
            var password = angular.element(elem[0].querySelector('.create-account-password'));
            var submit = angular.element(elem[0].querySelector('.submit-create-account'));
            var accountCreated = angular.element(elem[0].querySelector('.account-created'));

            // Set the default state
            elem.addClass("hidden");
            accountCreated.addClass("hidden");

            scope.$watchGroup(["options", "customer"], function (newValues, oldValues) {

                var options = newValues[0];
                var customer = newValues[1];

                // When both the options and customer come through, look to see if the field is set in the options and that a customer username is not already set.
                if (options && customer) {
                    if (options.customer_optional_fields) {
                        if (options.customer_optional_fields.indexOf("username") >= 0 && !customer.username) {
                            // Show the form.
                            elem.removeClass("hidden");
                        }
                    }
                }
            });

            // Bind to the password enter event
            password.bind("keydown", function (event) {
                if (event.which == 13) {
                    submitForm();
                }
            });

            // Bind to the username enter event
            username.bind("keydown", function (event) {
                if (event.which == 13) {
                    submitForm();
                }
            });

            // Bind to the submit button click          
            submit.bind("click", function (event) {
                submitForm();
            });

            var submitForm = function () {

                // Get the login values
                var un = username.val();
                var pw = password.val();

                if (utils.isNullOrEmpty(un) || utils.isNullOrEmpty(pw)) {
                    return;
                }

                // Clear previous errors
                scope.error = null;

                // Fire the event
                if (scope.onSubmit) {
                    scope.onSubmit();
                }

                // Build the login object
                scope.customer.username = un;
                scope.customer.password = pw;

                // Prep the params
                var params = scope.params || attrs.params;
                params = utils.mergeParams(params, null, "customer.payment_methods");

                CustomerService.createAccount(scope.customer, scope.params).then(function (customer) {

                    scope.customer = customer;

                    // Remove the username and password
                    username.val("");
                    password.val("");

                    // Show the success message
                    accountCreated.removeClass("hidden");

                    // Hide the login form
                    supplyCredentials.addClass("hidden");

                    // Fire the success event
                    if (scope.onSuccess) {
                        scope.onSuccess(customer);
                    }

                }, function (error) {

                    scope.error = error;
                    // Fire the error event
                    if (scope.onError) {
                        scope.onError(error);
                    }

                });
            };
        }
    };
}]);

app.directive('selectStateProv', ['GeoService', '$timeout', function (GeoService, $timeout) {

    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {

            scope.$watch(attrs.country, function (country, oldCountry) {

                if (country) {
                    var statesProvs = GeoService.getStatesProvs(country);

                    var elemNg = angular.element(elem[0]);

                    // Clear any previous options
                    elemNg.html("");

                    // Add a blank
                    elemNg.append("<option></option>");

                    var value = ctrl.$viewValue || ctrl.$modelValue;
                    var hasSelected = false;

                    _.each(statesProvs, function (stateProv) {
                        var option = '<option value="' + stateProv.code + '"';
                        if (value == stateProv.code) {
                            option += " selected";
                            hasSelected = true;
                        }
                        option += '>' + stateProv.name + '</option>';
                        elemNg.append(option);
                    });

                    // If not item was selected, then there was no match. If the control currently has a value for state, reset it.
                    if (hasSelected == false) {
                        ctrl.$setViewValue(null);
                    }
                }
            });
        }
    };
}]);

app.directive('customerBackgroundSave', ['CartService', '$timeout', function (CartService, $timeout) {

    // Shared scope:
    // cart: The updated cart to save. If an existing cart does not exist, one will be created and returned.
    // error: The error object to communicate errors.

    // Attributes
    // params: An object that supplies a list of parameters to send to the api, such as show, hide, formatted, etc. Used to customize the response object.
    // quiet: true / false to indicate if the loading bar should be displayed while calling the API. Default is false.

    return {
        restrict: 'A',
        scope: {
            cart: '=customerBackgroundSave',
            shippingIsBilling: '=?',
            params: '=?',
            error: '=?'
        },
        link: function (scope, elem, attrs, ctrl) {

            // Find all inputs that have the attribute of customer-field
            var fields = document.querySelectorAll(".customer-background-save");

            // Only allow one update buffer per page.
            var updateBuffer;

            _.each(fields, function (input) {

                // Bind on blur as the default, on change for select.
                var event = "blur";
                if (input.nodeName == "SELECT") {
                    event = "change";
                }
                if (input.type == "checkbox") {
                    event = "click";
                }

                var inputNg = angular.element(input);

                // Track original value because blur events don't care if value has changed.
                var originalVal = inputNg.val();

                inputNg.bind(event, function () {
                    // Ensure that value has really changed, triggering on blur event makes this needed.
                    if (event == 'blur' && angular.equals(originalVal,inputNg.val())) return;
                    // Reset original value so we can track later changes by user.
                    originalVal = inputNg.val();

                    if (updateBuffer) {
                        $timeout.cancel(updateBuffer);
                    }

                    // Wrap in timeout and apply a buffer so that if a form fill agent is used you only perform one update at the end. The buffer is 25 ms, which seems to accomplish the job.
                    updateBuffer = $timeout(function () {

                        // Since this is a "background update", we need special handling. Angular converts required fields to undefined when they are zero-length, which means they are stripped from the api payload.
                        // This means that if a user sets an item to blank, it will re-populate itself on update because the API didn't see it and didn't know to null it. We'll set all undefined items to null.
                        var cartCopy = angular.copy(scope.cart);
                        utils.undefinedToNull(cartCopy);

                        // Prep the params
                        var params = scope.params || attrs.params;
                        params = utils.mergeParams(params, null, null);

                        if (scope.cart) {

                            // Use the ngModel attribute to get the property name
                            var property = input.getAttribute("ng-model");

                            if (property) {

                                // Strip everything before customer.
                                property = property.split("customer.")[1];

                                scope.cart.customer[property] = inputNg.val();

                                // If set that billing is same as shipping, set all shipping values to null so that the API doesn't receive any of the data set on the view.
                                if (scope.shippingIsBilling) {
                                    if (cartCopy.customer.shipping_address) {
                                        cartCopy.customer.shipping_address.name = null;
                                        cartCopy.customer.shipping_address.address_1 = null;
                                        cartCopy.customer.shipping_address.address_2 = null;
                                        cartCopy.customer.shipping_address.city = null;
                                        cartCopy.customer.shipping_address.state_prov = null;
                                        cartCopy.customer.shipping_address.postal_code = null;
                                        cartCopy.customer.shipping_address.country = null;
                                    }
                                }

                                CartService.update(cartCopy, scope.params, true).then(function (cart) {

                                    // In the event that there were changes to the view between the time the call was sent and returned, we don't want to overwrite them. As a result, we won't sync the server customer values with the model.
                                    if (scope.cart) {
                                        cart.customer = scope.cart.customer;
                                    }

                                    // Sync the scope to the response.
                                    scope.cart = cart;

                                }, function (error) {
                                    scope.error = error;
                                });
                            }
                        }
                    }, 250); // Timeout set to a value that prevents sending every value if user presses and holds down arrow on country select.
                });
            });

        }
    };
}]);

app.directive('creditCardImage', [function () {

    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {

            scope.$watch(attrs.creditCardImage, function (creditCardImage) {

                var path = "images/";
                if (attrs.path) {
                    path = attrs.path;
                }

                if (creditCardImage) {
                    var filename = creditCardImage.replace(" ", "").toLowerCase() + ".png";
                    var image = '<img src="' + path + filename + '" />';
                    var elemNg = angular.element(elem);
                    elemNg.empty();
                    elemNg.html(image);
                }

            });
        }
    };
}]);

app.directive('creditCards', ['CartService', function (CartService) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {

            var path = "images/";
            if (attrs.path) {
                path = attrs.path;
            }

            scope.$watch(attrs.creditCards, function (newVal) {
                if (_.isArray(newVal)) {
                    var images = "";
                    _.each(newVal, function (item) {
                        var filename = item.replace(" ", "").toLowerCase() + ".png";
                        images += '<img src="' + path + filename + '" title="' + item + '" />';
                    });

                    var elemNg = angular.element(elem);
                    elemNg.empty();
                    elemNg.html(images);
                }
            });

        }
    };
}]);

app.directive('stateProvInput', ['GeoService', '$compile', function (GeoService, $compile) {

    return {
        restrict: 'E',
        terminal: true,
        link: function (scope, elem, attrs) {

            attrs.$observe('country', function (country) {

                if (country) {

                    var statesProvs = GeoService.getStatesProvs(attrs.country);

                    if (attrs.type == "select") {

                        // The select element is the template
                        var template = elem[0].querySelector("select").outerHTML;

                        if (statesProvs == null) {

                            // Remove ngModel
                            template = template.replace("ng-model", "suspend-model");
                            var templateEl = angular.element(template);
                            elem.empty();
                            elem.append(templateEl);
                            $compile(templateEl)(scope);

                        } else {

                            // Add ngModel
                            template = template.replace("suspend-model", "ng-model");
                            var templateEl = angular.element(template);
                            elem.empty();
                            elem.append(templateEl);
                            $compile(templateEl)(scope);

                        }

                    }

                    if (attrs.type == "input") {

                        // The select element is the template
                        var template = elem[0].querySelector("input").outerHTML;

                        if (statesProvs != null) {

                            // Remove ngModel
                            template = template.replace("ng-model", "suspend-model");
                            var templateEl = angular.element(template);
                            elem.empty();
                            elem.append(templateEl);
                            $compile(templateEl)(scope);

                        } else {

                            // Add ngModel
                            template = template.replace("suspend-model", "ng-model");
                            var templateEl = angular.element(template);
                            elem.empty();
                            elem.append(templateEl);
                            $compile(templateEl)(scope);

                        }

                    }

                }
            });

        }
    };

}]);

app.directive('selectOnClick', function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.on('click', function () {
                this.select();
            });
        }
    };
});

app.directive('fields', ['CartService', 'InvoiceService', '$timeout', '$rootScope', 'LanguageService', function (CartService, InvoiceService, $timeout, $rootScope, LanguageService) {

    return {
        restrict: 'AE',
        templateUrl: "app/templates/fields.html",
        scope: {
            fieldlist: '=',
            sale: '='
        },
        link: function (scope, elem, attrs, ctrl) {

            // Shared scope:
            // fieldlist: The list of field configurations
            // sale: The cart or invoice

            // The fieldlist will be supplied as a JSON string that must be parsed into an object.
            scope.fields = [];

            var loadFields = function (fieldsJson) {

                // If the fields are a string, parse to an object.
                var fields = [];

                if (typeof fieldsJson == "string" && utils.isNullOrEmpty(fieldsJson) == false) {
                    // Make sure you have valid JSON
                    try {
                        fields = JSON.parse(fieldsJson);
                    } catch (e) {
                        // Set to an empty array if not.
                        fields = [];
                        // Log to help in debugging
                        console.log("The JSON provided for custom fields is not valid JSON. As a result, no custom fields will display. Error message: " + e);
                    }
                }

                // Group by section.
                fields = groupFields(fields);

                // If the user's language is provided in any of the fields, use that language.
                var language = LanguageService.getSelectedLanguage().code;

                _.each(fields, function (field) {

                    if (field.languages) {
                        if (field.languages[language]) {

                            if (field.languages[language].label) {
                                field.label = field.languages[language].label;
                            }

                            if (field.languages[language].description) {
                                field.description = field.languages[language].description;
                            }

                            if (field.languages[language].section) {
                                field.section = field.languages[language].section;
                            }

                            if (field.languages[language].options) {
                                field.options = field.languages[language].options;
                            }

                        }
                    }

                });

                return fields;

            };

            var groupFields = function (fields) {

                // Group the objects together by section
                var sorted = [];
                var processed = [];
                _.each(fields, function (item) {

                    if (processed.indexOf(item.section) == -1) {
                        var matches = _.where(fields, { section: item.section });

                        if (matches) {
                            sorted = sorted.concat(matches);
                            processed.push(item.section);
                        }
                    }

                });

                return sorted;
            };

            var loadDefaults = function (fields, meta) {

                // Loop through the fields and set the default values if a value is not already provided.
                for (var property in fields) {

                    // Set default values for any selections that don't already have a value.
                    if (fields.hasOwnProperty(property)) {
                        if (scope.sale.meta[fields[property].name] == null) {
                            scope.sale.meta[fields[property].name] = fields[property].default_value;
                        }
                    }

                }

            };

            // Load the fields.           
            scope.fields = loadFields(scope.fieldlist);

            // On the first time the sale is loaded, loop through the fields and set default vaules for items that don't already have a value.
            var cancelWatch = scope.$watch('sale.meta', function (newVal, oldValue) {

                // If the sale isn't populated yet, return.
                if (scope.sale == null) {
                    return;
                }

                // If the current selections are null, set to an empty object.
                if (scope.sale.meta == null) {
                    scope.sale.meta = {};
                }

                loadDefaults(scope.fields, scope.sale.meta);

                // With the initial load done, we can cancel the watcher.
                cancelWatch();

            }, true);

            // If the language changes, reload the fields, which will update the display language.
            $rootScope.$on("languageChanged", function (event, language) {
                scope.fields = loadFields(scope.fieldlist);
            });

            scope.pushToProperty = function (property, value, recordOnChange) {

                // If it doesn't exist, add it. If it exists, remove it.
                if (scope.isInProperty(property, value) == false) {
                    if (scope.sale.meta[property] == null) {
                        scope.sale.meta[property] = [];
                        scope.sale.meta[property].push(value);
                    } else {
                        scope.sale.meta[property].push(value);
                    }
                } else {
                    scope.sale.meta[property] = _.without(scope.sale.meta[property], value);
                }

                // If record, save the change
                if (recordOnChange) {
                    scope.record();
                }

            };

            scope.isInProperty = function (property, value) {

                if (scope.sale == null) {
                    return false;
                }

                if (scope.sale.meta == null) {
                    return false;
                }

                if (scope.sale.meta[property] != null) {
                    if (_.indexOf(scope.sale.meta[property], value) >= 0) {
                        return true;
                    }
                }

                return false;

            };

            scope.isNewSection = function (field, index) {

                // The fields come from the api grouped in sections which makes it easy to determine when sections have changed.

                // The first item is always "new"
                if (index == 0) {
                    return true;
                }

                // Otherwise, select the item immediately before this item and see if it's different
                var previous = scope.fields[index - 1];
                if (previous != null) {
                    if (previous.section != field.section) {
                        return true;
                    }
                }

                return false;

            };

            // Save any changes, as requested.
            scope.record = function () {
                // We'll only update the meta
                var sale = { meta: scope.sale.meta };
                if (scope.sale.object == "invoice") {
                    InvoiceService.update(sale);
                } else {
                    CartService.update(sale);
                }
            };

        }
    };

}]);

app.directive('validateField', ['gettextCatalog', '$timeout', function (gettextCatalog, $timeout) {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            field: '=validateField',
            error: '=?'
        },
        link: function (scope, elem, attrs, ctrl) {

            var error = scope.error;
            var field = scope.field;

            // If required, initialize the error with a required error message.
            if (utils.isNullOrEmpty(elem[0].value) && field.required == true) {
                scope.error = gettextCatalog.getString("Please provide a value");
            }

            // Use a different message for boolean or toggle.
            if (field.type == "boolean" && field.required == true) {
                scope.error = gettextCatalog.getString("Please make a selection");
            }

            // A toggle field with required == true means a checkbox that you must check (i.e. accept terms and conditions or something, not allowed to leave it unchecked)
            if (field.type == "toggle" && field.required == true) {
                scope.error = gettextCatalog.getString("Please confirm");
            }

            ctrl.$parsers.unshift(function (viewValue) {

                // Reset the error
                var errorMsg = null;

                // Do some additinal testing for decimals and numbers.
                if (viewValue != null || field.required == true) {

                    switch (field.type) {

                        case "integer":

                            if (!utils.isValidInteger(viewValue)) {
                                errorMsg = gettextCatalog.getString("Please supply a number without decimals");
                            }
                            break;

                        case "decimal":

                            if (!utils.isValidNumber(viewValue)) {
                                errorMsg = gettextCatalog.getString("Please supply a number");
                            }
                            break;

                    }

                    // Regardless of the above, if options is not null, change the text
                    if (field.options != null && utils.isNullOrEmpty(viewValue)) {
                        errorMsg = gettextCatalog.getString("Please make a selection");
                    }

                    // If no error, check restraints
                    if (errorMsg == null) {

                        // If a list of options are provided, ensure the provided value is within the range.
                        if (field.options != null) {
                            if (_.where(field.options, { value: viewValue }) == null) {
                                errorMsg = gettextCatalog.getString("Please provide one of the available options");
                            }
                        }

                        // Range check if a integer or decimal
                        if (field.type == "integer" || field.type == "decimal") {

                            if (field.min_value) {
                                if (viewValue < field.min_value) {
                                    errorMsg = gettextCatalog.getPlural(field.min_value, "The value you provide must be greater than {{$count}}", "The value you provide must be greater than {{$count}}", {});
                                }
                            }

                            if (field.max_value) {
                                if (viewValue > field.max_value) {
                                    errorMsg = gettextCatalog.getPlural(field.max_value, "The value you provide must be less than {{$count}}", "The value you provide must be less than {{$count}}", {});
                                }
                            }

                        }

                        // Size check if string or text
                        if (field.type == "string" || field.type == "text") {

                            if (field.min_length) {
                                if (viewValue.length < field.min_length) {
                                    errorMsg = gettextCatalog.getPlural(field.min_length, "The value must be at least one character", "The value must be at least {{$count}} characters", {});
                                }
                            }

                            if (field.max_length) {
                                if (viewValue.length > field.max_length) {
                                    errorMsg = gettextCatalog.getPlural(field.max_length, "The value must be less than one character", "The value must be less than {{$count}} characters", {});
                                }
                            }
                        }

                    }
                }

                if (errorMsg != null) {
                    ctrl.$setValidity('field', false);
                    scope.error = errorMsg;
                    return undefined;
                }

                ctrl.$setValidity('field', true);
                return viewValue;

            });
        }
    };
}]);

app.directive('cleanPrice', [function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {

            var clean = function (value) {
                if (angular.isUndefined(value)) {
                    return;
                }
                var cleanedPrice = utils.cleanPrice(value);
                if (cleanedPrice !== value) {
                    ctrl.$setViewValue(cleanedPrice);
                    ctrl.$render();
                }
                return cleanedPrice;
            }

            ctrl.$parsers.unshift(clean);
            clean(scope[attrs.ngModel]);
        }
    };
}]);


app.factory('appCache', ['$cacheFactory', function ($cacheFactory) {
        return $cacheFactory('appCache');
    }]);
app.filter('range', function () {
    return function (input, min, max, pad) {
        
        // Convert string to int
        min = parseInt(min); 
        max = parseInt(max);
        
        function pad(number, length) {
            var r = String(number);
            if (r.length < length) {
                r = utils.repeat(0, length - number.toString().length) + r;
            }
            return r;
        }

        for (var i = min; i <= max; i++)
            if (!pad) {
                input.push(i);
            } else {
                input.push(pad(i, max.toString().length));
            }
        return input;
    };
});
app.service("ApiService", ['$http', '$q', '$location', 'SettingsService', 'HelperService', 'StorageService', '$rootScope', 'gettextCatalog', function ($http, $q, $location, SettingsService, HelperService, StorageService, $rootScope, gettextCatalog) {

    // Return public API.
    return {
        create: create,
        getItem: getItem,
        getList: getList,
        update: update,
        remove: remove,
        getItemPdf: getItemPdf,
        getToken: getToken,
        getTokenExpiration: getTokenExpiration
    };

    function getTokenExpiration(expiresInSeconds) {

        // The header response tells us when the cookie expires. Note that the expiration date slides, we'll update the token expiration with every API call.
        var expiresInMinutes = 360; // 6 hours, default if for some reason we didn't get a header value.

        if (expiresInSeconds != null && isNaN(expiresInSeconds) == false) {
            expiresInMinutes = expiresInSeconds / 60;
        }

        // Subtract 5 minutes to ensure we'll be less than the server.
        expiresInMinutes = expiresInMinutes - 10;

        return expiresInMinutes;

    }

    function getToken() {

        var deferred = $q.defer();

        var token = StorageService.get("token");

        if (token != null) {
            deferred.resolve(token);
            return deferred.promise;
        }

        // The account_id is only needed in development environments. The hosted environment can call this endpoint without the account_id and it will be determined on the api side from the hostname.
        var parameters = { browser_info: true };
        var settings = SettingsService.get();

        if (settings.account.account_id && settings.config.development == true) {
            parameters = { account_id: settings.account.account_id };
        }

        // Prepare the url
        var endpoint = buildUrl("/auths/limited", settings);

        var request = $http({
            ignoreLoadingBar: false,
            method: "post",
            url: endpoint + "?timezone=UTC",
            params: parameters,
            timeout: 15000,
            headers: {
                "Content-Type": "application/json"
            }
        });

        // Get the token
        request.then(function (response) {

            StorageService.set("token", response.data.token, response.headers("X-Token-Expires-In-Seconds"));
            StorageService.set("locale", response.data.browser_info.locale);
            StorageService.set("language", response.data.browser_info.language);

            // If you got a new token, delete any cart_id or invoice_id cookie. The new token won't be bound to them and letting them remain will cause a conflict when the new token tries to access a cart_id that it's not associated with.
            StorageService.remove("cart_id");
            StorageService.remove("invoice_id");

            deferred.resolve(response.data.token);
        }, function (error) {
            deferred.reject({ type: "internal_server_error", reference: "6lnOOW1", code: "unspecified_error", message: "There was a problem obtaining authorization for this session. Please reload the page to try your request again.", status: error.status });
        });

        return deferred.promise;
    }

    function create(data, url, parameters, quiet) {

        var deferred = $q.defer();

        getToken().then(function (token) {

            if (data == null) {
                data = undefined;
            }

            // Get the settings
            var settings = SettingsService.get();

            // Prepare the url
            var endpoint = buildUrl(url, settings);

            // Timeout is high to handle payment requests that return slowly.
            var request = $http({
                ignoreLoadingBar: quiet,
                method: "post",
                data: angular.toJson(data),
                url: endpoint + "?timezone=UTC",
                params: parameters,
                timeout: 65000,
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                }
            });

            request.then(function (response) { onApiSuccess(response, deferred); }, function (error) { onApiError(error, deferred); });

        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;

    }

    function getItem(url, parameters, quiet) {

        var deferred = $q.defer();

        getToken().then(function (token) {

            // Get the settings
            var settings = SettingsService.get();

            // Prepare the url
            var endpoint = buildUrl(url, settings);

            var request = $http({
                ignoreLoadingBar: quiet,
                method: "get",
                url: endpoint + "?timezone=UTC",
                params: parameters,
                timeout: 15000,
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                }
            });

            request.then(function (response) { onApiSuccess(response, deferred); }, function (error) { onApiError(error, deferred); });

        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;

    }

    function getList(url, parameters, quiet) {

        var deferred = $q.defer();

        getToken().then(function (token) {

            // Get the settings
            var settings = SettingsService.get();

            // Prepare the url
            var endpoint = buildUrl(url, settings);

            // Parse the query parameters in the url
            var queryParameters = utils.getQueryParameters(url);

            // Remove any query parameters that are explicitly provided in parameters
            _.each(parameters, function (item, index) {
                if (queryParameters[index] != null) {
                    delete queryParameters[index];
                }
            });

            // Remove the current query string
            if (url.indexOf("?") > 0) {
                url = url.substring(0, url.indexOf("?"));
            }

            // Append the parameters
            url = utils.appendParams(url, queryParameters);

            var request = $http({
                ignoreLoadingBar: quiet,
                method: "get",
                url: endpoint,
                params: parameters,
                timeout: 25000,
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                }
            });

            request.then(function (response) { onApiSuccess(response, deferred); }, function (error) { onApiError(error, deferred); });

        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;

    }

    function update(data, url, parameters, quiet) {

        var deferred = $q.defer();

        getToken().then(function (token) {

            // Get the settings
            var settings = SettingsService.get();

            // Prepare the url
            var endpoint = buildUrl(url, settings);

            if (data == null) {
                data = undefined;
            }

            var request = $http({
                ignoreLoadingBar: quiet,
                method: "post",
                data: angular.toJson(slim(data)),
                url: endpoint + "?timezone=UTC",
                params: parameters,
                timeout: 25000,
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                }
            });

            request.then(function (response) { onApiSuccess(response, deferred); }, function (error) { onApiError(error, deferred); });

        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;

    }

    function remove(url, parameters, quiet) {

        var deferred = $q.defer();

        getToken().then(function (token) {

            // Get the settings
            var settings = SettingsService.get();

            // Prepare the url
            var endpoint = buildUrl(url, settings);

            var request = $http({
                ignoreLoadingBar: quiet,
                method: "delete",
                url: endpoint + "?timezone=UTC",
                params: parameters,
                timeout: 15000,
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                }
            });

            request.then(function (response) { onApiSuccess(response, deferred); }, function (error) { onApiError(error, deferred); });

        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;

    }

    function getItemPdf(url, parameters, quiet) {

        var deferred = $q.defer();

        getToken().then(function (token) {

            // Get the settings
            var settings = SettingsService.get();

            // Prepare the url
            var endpoint = buildUrl(url, settings);

            var request = $http({
                ignoreLoadingBar: quiet,
                method: "get",
                url: endpoint + "?timezone=UTC",
                params: parameters,
                timeout: 15000,
                responseType: "arraybuffer",
                headers: {
                    "Authorization": "Bearer " + token,
                    "Accept": "application/pdf"
                }
            });

            request.then(function (response) { onApiSuccess(response, deferred); }, function (error) { onApiError(error, deferred); });

        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;

    }

    function buildUrl(endpoint, settings) {

        // If the url is fully qualified, just return it.
        if (endpoint.substring(0, 7) == "http://" || endpoint.substring(0, 8) == "https://") {
            return endpoint;
        } else {
            // The api prefix will contain the fully qualified URL if you are running in development mode. The prefix is defined during the app's bootstrap.
            return settings.config.apiPrefix + endpoint;
        }

    }

    function slim(data) {

        // Trim down the size of the payload
        if (data != null && typeof data === 'object') {
            var dataCopy = JSON.parse(JSON.stringify(data));

            if (dataCopy.object == "cart") {
                delete dataCopy.options;
                delete dataCopy.shipping_item;
                delete dataCopy.payments;
                _.each(dataCopy.items, function (item) {
                    delete item.subscription_terms;
                    delete item.url;
                    delete item.date_created;
                    delete item.date_modified;
                    delete item.formatted;
                    delete item.product;
                    delete item.subscription_plan;
                });
                delete dataCopy.customer.url;
                delete dataCopy.customer.payments;
                delete dataCopy.customer.refunds;
                delete dataCopy.customer.orders;
                delete dataCopy.customer.subscriptions;
                delete dataCopy.customer.invoices;
                delete dataCopy.promotion;
            }

            delete dataCopy.date_created;
            delete dataCopy.date_modified;
            delete dataCopy.object;
            delete dataCopy.url;
            delete dataCopy.test;
            delete dataCopy.account_id;
            delete dataCopy.formatted;
        }

        return dataCopy;

    }

    function onApiSuccess(response, defer) {

        // Update the token expiration date
        if (StorageService.get("token")) {
            StorageService.set("token", StorageService.get("token"), response.headers("X-Token-Expires-In-Seconds"));
        }

        return defer.resolve(response);
    }

    function onApiError(response, defer) {

        var error = {};

        if (response.data) {
            if (response.data.error) {
                error = response.data.error;
            }
        }

        var type;
        var reference;
        var code;
        var message;

        if (error) {

            if (error.type) {
                type = error.type;
            }

            if (error.code) {
                code = error.code;
            }

            if (error.reference) {
                reference = error.reference;
            }

            if (error.message) {
                message = error.message;
            }

        }

        // If your error is 401, then the token has died, or a login failure.
        if (response.status == 401) {

            // If the response code is invalid_login or account_locked, then don't get a new token. This is a failed login attempt and not a bad token.
            if (code != "invalid_login" && code != "account_locked") {

                // We'll do a full reset because the token is invalid and that means any associated cart_id is now orphaned.
                HelperService.newSessionRedirect(true, "Performing session reset due to invalid token in the cookie / request.");
            }
        }

        if (response.status == 403) {
            message = "There was a problem establishing your session. Please reload the page to try again.";
        }

        // If you don't have an error.message, then you didn't receive a normalized error message from the server. This should not happen rarely but prevents the application from having to consider edge cases where an unexpected response format is returned.
        if (!message) {

            switch (response.status) {
                case 404:
                    type = "not_found";
                    reference = "4jnJPb7";
                    code = "resource_not_found";
                    message = gettextCatalog.getString("The item you are trying to access could not be found.");
                    break;
                default:
                    type = "internal_server_error";
                    reference = "XEnf9FY";
                    code = "unspecified_error";
                    message = gettextCatalog.getString("An error occured while attempting to process your request. Please try your request again. If the problem persists, please contact support.");
            }

        }

        error.type = type;
        error.reference = reference;
        error.code = code;
        error.message = message;
        error.status = response.status;

        defer.reject(error);

    }

}]);

app.service("CartService", ['$http', '$q', '$rootScope', 'ApiService', 'PaymentService', 'SettingsService', 'HelperService', 'StorageService', function ($http, $q, $rootScope, ApiService, PaymentService, SettingsService, HelperService, StorageService) {

    // Return public API.
    return {
        create: create,
        get: get,
        update: update,
        addItem: addItem,
        getItems: getItems,
        pay: pay,
        login: login,
        logout: logout,
        fromParams: fromParams
    };

    function create(data, parameters, quiet, fromParams) {

        // The fromParams parameter indicates if this call is being made with a cart created from URL parameters.
        // This helps determine how invalid promotion codes should be handled.

        var deferred = $q.defer();
        parameters = setDefaultParameters(parameters);

        // If defined, set the currency
        var currency = StorageService.get("currency");
        if (currency) {
            data.currency = currency;
        }

        var url = "/carts";
        ApiService.create(data, url, parameters, quiet).then(function (response) {
            var cart = response.data;
            // Set a cookie. The expiration date of this cookie will be the same as the token expiration, which we can get from the headers.
            StorageService.set("cart_id", cart.cart_id, response.headers("X-Token-Expires-In-Seconds"));

            // Set the display currency
            syncCurrency(cart.currency);

            deferred.resolve(cart);

        }, function (error) {

            // If the error is 400, the error code is "invalid_promotion_code" and the cart was built from URL parameters, replay the request without the promotion code.
            // This allows a user to still create a cart when the URL contains an invalid embedded promotion code, although without a promotion. But it allows the order to continue.
            if (error.code == "invalid_promotion_code" && fromParams) {
                delete data.promotion_code;
                create(data, parameters, quiet, false).then(function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
            } else {
                // Jus reject it
                deferred.reject(error);
            }
        });

        return deferred.promise;

    }

    function get(parameters, quiet) {

        var deferred = $q.defer();
        parameters = setDefaultParameters(parameters);
        var cart_id = StorageService.get("cart_id");

        // Set up some stubs in the event of no cart or customer
        var customerStub = { billing_address: {}, shipping_address: {} };
        var cartStub = { items: [], customer: customerStub };

        if (cart_id) {
            var url = "/carts/" + cart_id;

            ApiService.getItem(url, parameters, quiet).then(function (response) {
                var cart = response.data;
                // If the customer is null, set a stub
                if (cart.customer == null) {
                    cart.customer = customerStub;
                }

                // If the billing country is null, supply from the ip address
                if (cart.customer.billing_address.country == null) {
                    cart.customer.billing_address.country = cart.customer_ip_country;
                }

                // If the shiping country is null, supply from the ip address
                if (cart.customer.shipping_address.country == null) {
                    cart.customer.shipping_address.country = cart.customer_ip_country;
                }

                // In case it changed, sync the currency
                syncCurrency(cart.currency);

                deferred.resolve(cart);

            }, function (error) {

                // If 404, perform a session reset.
                if (error.status == 404) {
                    HelperService.newSessionRedirect(true, "Performing a session reset due to an invalid cart_id in the cookie / request. (404 - cart not found)");
                }

                deferred.reject(error);
            });

        } else {
            // Return an empty cart. Build a stub object to make it easy to reference deep items even before a cart is created.
            deferred.resolve(cartStub);
        }

        return deferred.promise;

    }

    function update(data, parameters, quiet, fromParams) {

        // The fromParams parameter indicates if this call is being made with a cart created from URL parameters.
        // This helps determine how invalid promotion codes should be handled.

        var deferred = $q.defer();
        parameters = setDefaultParameters(parameters);
        var cart_id = StorageService.get("cart_id");

        if (cart_id) {

            var url = "/carts/" + cart_id;
            ApiService.update(data, url, parameters, quiet).then(function (response) {

                var cart = response.data;
                // Update the cookie expiration date. The expiration date of this cookie will be the same as the token expiration, which we can get from the headers.
                StorageService.set("cart_id", cart.cart_id, response.headers("X-Token-Expires-In-Seconds"));

                // In case it changed, sync the currency
                syncCurrency(cart.currency);

                deferred.resolve(cart);

            }, function (error) {

                // If the error is 400, the error code is "invalid_promotion_code" and the cart was built from URL parameters, replay the request without the promotion code.
                // This allows a user to still create a cart when the URL contains an invalid embedded promotion code, although without a promotion. But it allows the order to continue.
                if (error.code == "invalid_promotion_code" && fromParams) {
                    delete data.promotion_code;
                    update(data, parameters, quiet, false).then(function (response) {
                        deferred.resolve(response);
                    }, function (error) {
                        deferred.reject(error);
                    });
                } else {
                    // If 404, perform a session reset.
                    if (error.status == 404) {
                        HelperService.newSessionRedirect(true, "Performing a session reset due to an invalid cart_id in the cookie / request. (404 - cart not found)");
                    }

                    // If invalid state, then the cart is already closed, perform a session reset.
                    if (error.code == "invalid_state") {
                        // Delete the cart_id as it can no longer be modified.
                        StorageService.remove("cart_id");
                        HelperService.newSessionRedirect(false, "Performing a cart_id reset due to an invalid cart_id in the cookie / request. (422 - invalid state): " + error.message);
                    }

                    deferred.reject(error);

                }

            });

            return deferred.promise;

        } else {

            // No cart exists. Create a new cart.
            return create(data, parameters, quiet, fromParams);

        }

    }

    function login(data, parameters, quiet) {

        var deferred = $q.defer();
        parameters = setDefaultParameters(parameters);
        var cart_id = StorageService.get("cart_id");

        var url = "/carts/" + cart_id + "/login";
        ApiService.update(data, url, parameters, quiet).then(function (response) {

            var cart = response.data;
            // Update the cookie expiration date. The expiration date of this cookie will be the same as the token expiration, which we can get from the headers.
            StorageService.set("cart_id", cart.cart_id, response.headers("X-Token-Expires-In-Seconds"));

            // In case it changed, sync the currency
            syncCurrency(cart.currency);

            deferred.resolve(cart);

        }, function (error) {

            // If 404, perform a session reset.
            if (error.status == 404) {
                HelperService.newSessionRedirect(true, "Performing a session reset due to an invalid cart_id in the cookie / request. (404 - cart not found)");
            }

            deferred.reject(error);
        });

        return deferred.promise;

    }

    function logout(parameters, quiet) {

        var deferred = $q.defer();
        parameters = setDefaultParameters(parameters);
        var cart_id = StorageService.get("cart_id");

        var url = "/carts/" + cart_id + "/logout";
        ApiService.update(null, url, parameters, quiet).then(function (response) {

            var cart = response.data;
            // Update the cookie expiration date. The expiration date of this cookie will be the same as the token expiration, which we can get from the headers.
            StorageService.set("cart_id", cart.cart_id, response.headers("X-Token-Expires-In-Seconds"));

            // In case it changed, sync the currency
            syncCurrency(cart.currency);

            deferred.resolve(cart);

        }, function (error) {

            // If 404, perform a session reset.
            if (error.status == 404) {
                HelperService.newSessionRedirect(true, "Performing a session reset due to an invalid cart_id in the cookie / request. (404 - cart not found)");
            }

            deferred.reject(error);
        });

        return deferred.promise;

    }

    function addItem(data, parameters, quiet) {

        var deferred = $q.defer();

        if (data == null) {
            deferred.reject({ type: "bad_request", reference: "vbVcrcF", code: "invalid_input", message: "You must supply an item to add to the cart.", status: 400 });
            return deferred.promise;
        }

        parameters = setDefaultParameters(parameters);

        // Get the cart.
        get(parameters).then(function (cart) {

            // Check if the cart has already been created.
            if (cart.url) {
                // Is the item in the cart?
                var existingItem = _.findWhere(cart.items, data);

                if (existingItem != null) {
                    ApiService.update(data, existingItem.url, parameters, quiet).then(function (response) {

                        var item = response.data;
                        // In case it changed, sync the currency
                        syncCurrency(item.currency);

                        deferred.resolve(item);

                    }, function (error) {
                        deferred.reject(error);
                    });
                } else {
                    // Add it
                    ApiService.create(data, cart.url + "/items", parameters, quiet).then(function (response) {

                        var item = response.data;
                        // In case it changed, sync the currency
                        syncCurrency(item.currency);

                        deferred.resolve(item);

                    }, function (error) {
                        deferred.reject(error);
                    });
                }

            } else {
                // No cart created yet, create a cart with this item and send it.
                cart.items.push(data);
                create(cart, parameters, quiet).then(function (cart) {
                    deferred.resolve(_.findWhere(cart.items, { item_id: data.product_id }));
                }, function (error) {
                    deferred.reject(error);
                });
            }

        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;

    }

    function getItems(parameters, quiet) {

        get(parameters, quiet).then(function (cart) {

            // In case it changed, sync the currency
            syncCurrency(cart.currency);

            deferred.resolve(cart.items);

        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;

    }

    function pay(cart, payment_method, parameters, quiet) {

        var deferred = $q.defer();
        parameters = setDefaultParameters(parameters);

        // Define a function to send the payment, which happens after we create or update the cart.
        var sendPayment = function (cart_id, payment_method) {

            // Create the payment url
            var url = "/carts/" + cart.cart_id + "/payments";

            // Run the payment
            PaymentService.create(payment_method, url, parameters, quiet).then(function (payment) {

                // If the payment status is completed or the payment status is pending and the payment method is credit card, delete the cart_id. Attempting to interact with a closed cart (due to a successful payment) will result in errors.
                if (payment.status == "completed" || payment.status == "pending") {
                    StorageService.remove("cart_id");
                }

                deferred.resolve(payment);

            }, function (error) {
                deferred.reject(error);
            });
        };

        // If there currently is no cart, create it. Otherwise, update the existing cart.
        if (cart.cart_id == null) {
            create(cart, parameters, quiet).then(function (cart) {
                sendPayment(cart.cart_id, payment_method);
            }, function (error) {
                deferred.reject(error);
            });

        } else {
            update(cart, parameters, quiet).then(function (cart) {
                sendPayment(cart.cart_id, payment_method);
            }, function (error) {
                deferred.reject(error);
            });
        }

        return deferred.promise;

    }

    function fromParams(cart, location) {

        // location should be the angular $location object

        var params = location.search();

        // We are looking for the following parameters. This can be exapnded at any time, as needed.
        // product_id:xxxx, promotion_code, currency, name, email.

        // If empty_cart is true, remove the items from the current cart.
        if (utils.stringToBool(params.empty_cart)) {
            cart.items = [];
            location.search("empty_cart", null);
        }

        // Find the product_ids
        for (var property in params) {
            if (params.hasOwnProperty(property)) {
                if (utils.left(property, 11) == "product_id:") {

                    var item = { product_id: property.substring(11) };
                    if (utils.isValidInteger(params[property]) == false) {
                        item.quantity = 1;
                    } else {
                        item.quantity = params[property];
                    }

                    // Remove the item if it already exists in the cart
                    var existingItem = _.find(cart.items, function (i) { return i.product_id == item.product_id; });
                    if (existingItem != null) {
                        cart.items = _.reject(cart.items, function (i) { return i.product_id == item.product_id; });
                    }

                    // Set the item into the cart
                    cart.items = cart.items || [];
                    cart.items.push(item);
                    location.search(property, null);

                }
            }
        }

        // Append the others
        if (params.promotion_code) {
            cart.promotion_code = params.promotion_code;
            location.search("promotion_code", null);
        }

        if (params.currency) {
            cart.currency = params.currency;
            location.search("currency", null);
        }

        if (params.name) {
            cart.customer.name = params.name;
            location.search("name", null);
        }

        if (params.email) {
            if (utils.isValidEmail(params.email)) {
                cart.customer.email = params.email;
            }
            location.search("email", null);
        }

        if (params.referrer) {
            cart.referrer = params.referrer;
            location.search("referrer", null);
        }

        if (params.affiliate_id) {
            cart.affiliate_id = params.affiliate_id;
            location.search("affiliate_id", null);
        }

        // If there are no customer properties, delete the customer property
        if (_.size(cart.customer) == 0) {
            delete cart.customer;
        }

        // Append any other parameters as meta
        params = location.search();

        for (var property in params) {
            if (params.hasOwnProperty(property)) {
                if (cart.meta == null) {
                    cart.meta = {};
                }
                cart.meta[property] = params[property];
            }
        }


        return cart;

    }

    function syncCurrency(newCurrency) {

        // This makes sure that the currency in cart payload responses automatically sync the stored currency value
        var currentCurrency = StorageService.get("currency");

        if (newCurrency != currentCurrency) {

            StorageService.set("currency", newCurrency);

            // Emit the change
            $rootScope.$emit("currencyChanged", newCurrency);
        }
    }

    function setDefaultParameters(parameters, quiet) {

        var parametersCopy = angular.copy(parameters);

        // Cart is a complicated object and a lot of directives interact with it at the same time. As such, we don't allow the show parameter. Too likely toes will get stepped on.
        if (parametersCopy) {
            parametersCopy.formatted = true;
            delete parametersCopy.show;
            return parametersCopy;
        } else {
            return { formatted: true, options: true };
        }

    }

}]);

app.service("InvoiceService", ['$http', '$q', '$rootScope', 'ApiService', 'PaymentService', 'SettingsService', 'HelperService', 'StorageService', function ($http, $q, $rootScope, ApiService, PaymentService, SettingsService, HelperService, StorageService) {

    // Return public API.
    return {
        get: get,
        update: update,
        pay: pay
    };

    function get(parameters, quiet) {

        var deferred = $q.defer();
        parameters = setDefaultParameters(parameters);
        var invoice_id = StorageService.get("invoice_id");

        var url = "/invoices/" + invoice_id;

        ApiService.getItem(url, parameters, quiet).then(function (response) {

            var invoice = response.data;

            // In case it changed, sync the currency
            syncCurrency(invoice.currency);

            deferred.resolve(invoice);

        }, function (error) {

            // If 404, perform a session reset.
            if (error.status == 404) {
                HelperService.newSessionRedirect(true, "Performing a session reset due to an invalid invoice_id in the cookie / request. (404 - invoice not found)");
            }

            deferred.reject(error);
        });

        return deferred.promise;

    }

    function update(data, parameters, quiet) {

        var deferred = $q.defer();
        parameters = setDefaultParameters(parameters);
        var invoice_id = StorageService.get("invoice_id");

        var url = "/invoices/" + invoice_id;
        ApiService.update(data, url, parameters, quiet).then(function (response) {

            var invoice = response.data;
            // Update the cookie expiration date. The expiration date of this cookie will be the same as the token expiration, which we can get from the headers.
            StorageService.set("invoice_id", invoice.invoice_id, response.headers("X-Token-Expires-In-Seconds"));

            // In case it changed, sync the currency
            syncCurrency(invoice.currency);

            deferred.resolve(invoice);

        }, function (error) {

            // If 404, perform a session reset.
            if (error.status == 404) {
                HelperService.newSessionRedirect(true, "Performing a session reset due to an invalid invoice_id in the cookie / request. (404 - invoice not found)");
            }

            deferred.reject(error);
        });

        return deferred.promise;

    }

    function pay(invoice, payment_method, parameters, quiet) {

        var deferred = $q.defer();
        parameters = setDefaultParameters(parameters);

        var sendPayment = function (invoice_id, payment_method) {

            // Create the payment url
            var url = "/invoices/" + invoice.invoice_id + "/payments";

            // Run the payment
            PaymentService.create(payment_method, url, parameters, quiet).then(function (payment) {

                // If the payment is completed or pending, remove the invoice_id from the cookie.
                if (payment.status == "completed" || payment.status == "pending") {
                    StorageService.remove("invoice_id");
                }

                deferred.resolve(payment);

            }, function (error) {
                deferred.reject(error);
            });
        };

        // Send the payment.
        sendPayment(invoice.invoice_id, payment_method);

        return deferred.promise;

    }

    function syncCurrency(newCurrency) {

        // This makes sure that the currency in invoice payload responses automatically sync the stored currency value
        var currentCurrency = StorageService.get("currency");

        if (newCurrency != currentCurrency) {

            StorageService.set("currency", newCurrency);

            // Emit the change
            $rootScope.$emit("currencyChanged", newCurrency);
        }
    }

    function setDefaultParameters(parameters, quiet) {

        var parametersCopy = angular.copy(parameters);

        // Invoice is a complicated object and a lot of directives interact with it at the same time. As such, we don't allow the show parameter. Too likely toes will get stepped on.
        if (parametersCopy) {
            parametersCopy.formatted = true;
            delete parametersCopy.show;
            return parametersCopy;
        } else {
            return { formatted: true, options: true };
        }

    }

}]);

app.service("PaymentService", ['$http', '$q', 'ApiService', 'SettingsService', 'StorageService', function ($http, $q, ApiService, SettingsService, StorageService) {

    // Return public API.
    return {
        create: create,
        createDirect: createDirect,
        get: get,
        update: update,
        getOptions: getOptions,
        commit: commit,
        fromParams: fromParams
    };

    function create(payment_method, url, parameters, quiet) {

        var deferred = $q.defer();
        parameters = setDefaultParameters(parameters);

        // Build the payment method object
        var data = { payment_method: payment_method };

        ApiService.create(data, url, parameters, quiet).then(function (response) {
            var payment = response.data;
            deferred.resolve(payment);
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;

    }

    function update(data, parameters, quiet) {

        var deferred = $q.defer();
        parameters = setDefaultParameters(parameters);

        ApiService.update(data, "/payments/" + data.payment_id, parameters, quiet).then(function (response) {
            var payment = response.data;
            deferred.resolve(payment);
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;

    }

    function createDirect(payment, parameters, quiet) {

        var deferred = $q.defer();
        parameters = setDefaultParameters(parameters);
        var url = "/payments";

        ApiService.create(payment, url, parameters, quiet).then(function (response) {
            var result = response.data;
            deferred.resolve(result);
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;

    }

    function get(payment_id, parameters, quiet) {

        var deferred = $q.defer();
        parameters = setDefaultParameters(parameters);

        if (payment_id) {
            var url = "/payments/" + payment_id;

            ApiService.getItem(url, parameters, quiet).then(function (response) {
                var payment = response.data;
                deferred.resolve(payment);
            }, function (error) {
                deferred.reject(error);
            });

        } else {
            deferred.reject({ "type": "bad_request", reference: "HdPWrih", code: "invalid_input", message: "You request contained invalid data and could not be processed.", status: 400 });
            console.log("Your request for a payment must include a payment_id.");
        }

        return deferred.promise;

    }

    function getOptions(parameters, quiet) {

        var deferred = $q.defer();

        var url = "/payments/options";
        ApiService.getItem(url, parameters, quiet).then(function (response) {
            var options = response.data;
            deferred.resolve(options);
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;

    }

    function commit(payment_id, parameters, quiet) {

        // This is used for payment methods such as PayPal and Amazon Pay that need to be tiggered for completion after they have been reviewed by the customer.

        var url = "/payments/" + payment_id + "/commit";

        var deferred = $q.defer();
        parameters = setDefaultParameters(parameters);

        ApiService.create(null, url, parameters, quiet).then(function (response) {
            var payment = response.data;

            // If the payment status is completed or pending, delete the cart_id and / or invoice_id. Attempting to interact with a closed cart or invoice (due to a successful payment) will result in errors.
            if (payment.status == "completed" || payment.status == "pending") {
                StorageService.remove("cart_id");
                StorageService.remove("invoice_id");
            }

            deferred.resolve(payment);
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;

    }

    function fromParams(payment, location) {

        // Set payment as an object if null
        payment = payment || {}

        // location should be the angular $location object

        // Make a copy so we can modify without changing the original params
        var params = angular.copy(location.search());

        // This is designed to be used for a "hosted payment page", where the customer makes an arbitrary payment not associated with a cart or invoice. Parameters such as amount, currency, description, reference and customer details can be passed as URL params.

        if (params.currency) {
            payment.currency = params.currency;
            delete params.currency;
            location.search("currency", null);
        }

        if (params.total && utils.isValidNumber(params.total)) {
            payment.total = params.total;
            delete params.total;
            location.search("total", null);
        }

        // If the total is not supplied, look for subtotal, shipping, tax.
        if (!payment.total) {

            if (params.subtotal && utils.isValidNumber(params.subtotal)) {
                payment.subtotal = params.subtotal;
                delete params.subtotal;
                location.search("subtotal", null);
            }

            if (params.shipping && utils.isValidNumber(params.shipping)) {
                payment.shipping = params.shipping;
                delete params.shipping;
                location.search("shipping", null);
            }

            if (params.tax && utils.isValidNumber(params.tax)) {
                payment.tax = params.tax;
                delete params.tax;
                location.search("tax", null);
            }

        }

        if (params.reference) {
            payment.reference = params.reference;
            delete params.reference;
            location.search("reference", null);
        }

        if (params.description) {
            payment.description = params.description;
            delete params.description;
            location.search("description", null);
        }

        payment.customer = payment.customer || {};

        if (params.company_name) {
            payment.customer.company_name = params.company_name;
            delete params.company_name;
        }

        if (params.name) {
            payment.customer.name = params.name;
            delete params.name;
        }

        if (params.email) {
            if (utils.isValidEmail(params.email)) {
                payment.customer.email = params.email;
            }
            delete params.email;
        }

        if (params.referrer) {
            payment.referrer = params.referrer;
            delete params.referrer;
        }

        // Append any other parameters as meta
        for (var property in params) {
            if (params.hasOwnProperty(property)) {
                if (payment.meta == null) {
                    payment.meta = {};
                }
                payment.meta[property] = params[property];
            }
        }

        return payment;

    }

    function setDefaultParameters(parameters, quiet) {

        // Make sure the response data and payment method is expanded.
        if (parameters) {

            parameters.formatted = true;

            if (parameters.expand == null) {
                parameters.expand = "response_data,payment_method";
            } else {
                if (parameters.expand.indexOf("response_data") == "-1") {
                    parameters.expand += ",response_data";
                }
                if (parameters.expand.indexOf("payment_method") == "-1") {
                    parameters.expand += ",payment_method";
                }
            }

            return parameters;

        } else {

            return { formatted: true, expand: "response_data,payment_method" };

        }

    }

}]);

app.service("OrderService", ['$http', '$q', 'ApiService', function ($http, $q, ApiService) {

    // Return public API.
    return {
        get: get
    };

    function get(order_id, parameters, quiet) {

        var deferred = $q.defer();
        parameters = setDefaultParameters(parameters);

        if (order_id) {
            var url = "/orders/" + order_id;

            ApiService.getItem(url, parameters, quiet).then(function (response) {
                var payment = response.data;
                deferred.resolve(payment);
            }, function (error) {
                deferred.reject(error);
            });

        } else {
            deferred.reject({ "type": "bad_request", reference: "HdPWrih", code: "invalid_input", message: "The order you are trying to view cannot be found.", status: 400 });
            console.log("The order_id was not provided.");
        }

        return deferred.promise;

    }

    function setDefaultParameters(parameters, quiet) {

        if (parameters) {
            parameters.formatted = true;
            return parameters;
        } else {
            return { formatted: true };
        }

    }

}]);

app.service("CustomerService", ['$http', '$q', 'ApiService', function ($http, $q, ApiService) {

    // Return public API.
    return {
        createAccount: createAccount,
        login: login
    };

    function createAccount(customer, parameters, quiet) {

        var deferred = $q.defer();

        if (customer.customer_id) {
            var url = "/customers/" + customer.customer_id;

            ApiService.update(customer, url, parameters, quiet).then(function (response) {
                deferred.resolve(response.data);
            }, function (error) {
                deferred.reject(error);
            });

        } else {
            deferred.reject({ "type": "bad_request", reference: "8b1oMYs", code: "invalid_input", message: "The request could not be completed.", status: 400 });
            console.log("The customer object in the account creation request did not contain a customer_id.");
        }

        return deferred.promise;

    }

    function login(data, parameters, quiet) {

        var deferred = $q.defer();

        var url = "/customers/login";
        ApiService.create(data, url, parameters, quiet).then(function (response) {

            var customer = response.data;
            deferred.resolve(customer);

        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;

    }

}]);

app.service("ProductService", ['$http', '$q', 'ApiService', 'CurrencyService', function ($http, $q, ApiService, CurrencyService) {

    // Return public API.
    return {
        get: get,
        getList: getList
    };

    function get(product_id, parameters, quiet) {

        var deferred = $q.defer();
        parameters = setDefaultParameters(parameters);

        if (product_id) {
            var url = "/products/" + product_id;

            ApiService.getItem(url, parameters, quiet).then(function (response) {
                var product = response.data;
                // If the currency is not currently set, set it to the value of the returned product.
                if (CurrencyService.getCurrency() == null) {
                    CurrencyService.setCurrency(product.currency);
                }

                deferred.resolve(product);
            }, function (error) {
                deferred.reject(error);
            });

        } else {
            deferred.reject({ "type": "bad_request", reference: "IrUQTRv", code: "invalid_input", message: "The product you are trying to view cannot be found.", status: 400 });
            console.log("The product_id was not provided.");
        }

        return deferred.promise;

    }

    function getList(parameters, quiet) {

        var deferred = $q.defer();
        parameters = setDefaultParameters(parameters);
        var url = "/products";

        ApiService.getList(url, parameters, quiet).then(function (response) {
            var products = response.data;
            // If the currency is not currently set, set it to the value of the returned product.
            if (CurrencyService.getCurrency() == null) {
                if (products.data[0]) {
                    CurrencyService.setCurrency(products.data[0].currency);
                }
            }

            deferred.resolve(products);
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    }

    function setDefaultParameters(parameters, quiet) {

        if (parameters) {
            parameters.formatted = true;
            return parameters;
        } else {
            return { formatted: true };
        }

    }

}]);

app.service("GeoService", [function () {

    // Return public API.
    return {
        getData: getData,
        getStatesProvs: getStatesProvs,
        isEu: isEu,
        getCurrencySymbol: getCurrencySymbol
    };

    function getData() {

        var geo = {};

        geo.countries = [{ name: 'Afghanistan', code: 'AF' }, { name: 'Albania', code: 'AL' }, { name: 'Algeria', code: 'DZ' }, { name: 'American Samoa', code: 'AS' }, { name: 'Andorra', code: 'AD' }, { name: 'Angola', code: 'AO' }, { name: 'Anguilla', code: 'AI' }, { name: 'Antarctica', code: 'AQ' }, { name: 'Antigua and Barbuda', code: 'AG' }, { name: 'Argentina', code: 'AR' }, { name: 'Armenia', code: 'AM' }, { name: 'Aruba', code: 'AW' }, { name: 'Australia', code: 'AU' }, { name: 'Austria', code: 'AT' }, { name: 'Azerbaijan', code: 'AZ' }, { name: 'Bahamas', code: 'BS' }, { name: 'Bahrain', code: 'BH' }, { name: 'Bangladesh', code: 'BD' }, { name: 'Barbados', code: 'BB' }, { name: 'Belarus', code: 'BY' }, { name: 'Belgium', code: 'BE' }, { name: 'Belize', code: 'BZ' }, { name: 'Benin', code: 'BJ' }, { name: 'Bermuda', code: 'BM' }, { name: 'Bhutan', code: 'BT' }, { name: 'Bolivia, Plurinational State of', code: 'BO' }, { name: 'Bonaire, Sint Eustatius and Saba', code: 'BQ' }, { name: 'Bosnia and Herzegovina', code: 'BA' }, { name: 'Botswana', code: 'BW' }, { name: 'Bouvet Island', code: 'BV' }, { name: 'Brazil', code: 'BR' }, { name: 'British Indian Ocean Territory', code: 'IO' }, { name: 'Brunei Darussalam', code: 'BN' }, { name: 'Bulgaria', code: 'BG' }, { name: 'Burkina Faso', code: 'BF' }, { name: 'Burundi', code: 'BI' }, { name: 'Cambodia', code: 'KH' }, { name: 'Cameroon', code: 'CM' }, { name: 'Canada', code: 'CA' }, { name: 'Cape Verde', code: 'CV' }, { name: 'Cayman Islands', code: 'KY' }, { name: 'Central African Republic', code: 'CF' }, { name: 'Chad', code: 'TD' }, { name: 'Chile', code: 'CL' }, { name: 'China', code: 'CN' }, { name: 'Christmas Island', code: 'CX' }, { name: 'Cocos (Keeling) Islands', code: 'CC' }, { name: 'Colombia', code: 'CO' }, { name: 'Comoros', code: 'KM' }, { name: 'Congo', code: 'CG' }, { name: 'Congo, the Democratic Republic of the', code: 'CD' }, { name: 'Cook Islands', code: 'CK' }, { name: 'Costa Rica', code: 'CR' }, { name: 'Cote d Ivoire', code: 'CI' }, { name: 'Croatia', code: 'HR' }, { name: 'Cuba', code: 'CU' }, { name: 'Curacao', code: 'CW' }, { name: 'Cyprus', code: 'CY' }, { name: 'Czech Republic', code: 'CZ' }, { name: 'Denmark', code: 'DK' }, { name: 'Djibouti', code: 'DJ' }, { name: 'Dominica', code: 'DM' }, { name: 'Dominican Republic', code: 'DO' }, { name: 'Ecuador', code: 'EC' }, { name: 'Egypt', code: 'EG' }, { name: 'El Salvador', code: 'SV' }, { name: 'Equatorial Guinea', code: 'GQ' }, { name: 'Eritrea', code: 'ER' }, { name: 'Estonia', code: 'EE' }, { name: 'Ethiopia', code: 'ET' }, { name: 'Falkland Islands', code: 'AX' }, { name: 'Falkland Islands (Malvinas)', code: 'FK' }, { name: 'Faroe Islands', code: 'FO' }, { name: 'Fiji', code: 'FJ' }, { name: 'Finland', code: 'FI' }, { name: 'France', code: 'FR' }, { name: 'French Guiana', code: 'GF' }, { name: 'French Polynesia', code: 'PF' }, { name: 'French Southern Territories', code: 'TF' }, { name: 'Gabon', code: 'GA' }, { name: 'Gambia', code: 'GM' }, { name: 'Georgia', code: 'GE' }, { name: 'Germany', code: 'DE' }, { name: 'Ghana', code: 'GH' }, { name: 'Gibraltar', code: 'GI' }, { name: 'Greece', code: 'GR' }, { name: 'Greenland', code: 'GL' }, { name: 'Grenada', code: 'GD' }, { name: 'Guadeloupe', code: 'GP' }, { name: 'Guam', code: 'GU' }, { name: 'Guatemala', code: 'GT' }, { name: 'Guernsey', code: 'GG' }, { name: 'Guinea', code: 'GN' }, { name: 'Guine Bissau', code: 'GW' }, { name: 'Guyana', code: 'GY' }, { name: 'Haiti', code: 'HT' }, { name: 'Heard Island and McDonald Islands', code: 'HM' }, { name: 'Holy See (Vatican City State)', code: 'VA' }, { name: 'Honduras', code: 'HN' }, { name: 'Hong Kong', code: 'HK' }, { name: 'Hungary', code: 'HU' }, { name: 'Iceland', code: 'IS' }, { name: 'India', code: 'IN' }, { name: 'Indonesia', code: 'ID' }, { name: 'Iran', code: 'IR' }, { name: 'Iraq', code: 'IQ' }, { name: 'Ireland', code: 'IE' }, { name: 'Isle of Man', code: 'IM' }, { name: 'Israel', code: 'IL' }, { name: 'Italy', code: 'IT' }, { name: 'Jamaica', code: 'JM' }, { name: 'Japan', code: 'JP' }, { name: 'Jersey', code: 'JE' }, { name: 'Jordan', code: 'JO' }, { name: 'Kazakhstan', code: 'KZ' }, { name: 'Kenya', code: 'KE' }, { name: 'Kiribati', code: 'KI' }, { name: 'Korea', code: 'KR' }, { name: 'Kuwait', code: 'KW' }, { name: 'Kyrgyzstan', code: 'KG' }, { name: 'Lao Peoples Democratic Republic', code: 'LA' }, { name: 'Latvia', code: 'LV' }, { name: 'Lebanon', code: 'LB' }, { name: 'Lesotho', code: 'LS' }, { name: 'Liberia', code: 'LR' }, { name: 'Libya', code: 'LY' }, { name: 'Liechtenstein', code: 'LI' }, { name: 'Lithuania', code: 'LT' }, { name: 'Luxembourg', code: 'LU' }, { name: 'Macao', code: 'MO' }, { name: 'Macedonia', code: 'MK' }, { name: 'Madagascar', code: 'MG' }, { name: 'Malawi', code: 'MW' }, { name: 'Malaysia', code: 'MY' }, { name: 'Maldives', code: 'MV' }, { name: 'Mali', code: 'ML' }, { name: 'Malta', code: 'MT' }, { name: 'Marshall Islands', code: 'MH' }, { name: 'Martinique', code: 'MQ' }, { name: 'Mauritania', code: 'MR' }, { name: 'Mauritius', code: 'MU' }, { name: 'Mayotte', code: 'YT' }, { name: 'Mexico', code: 'MX' }, { name: 'Micronesia', code: 'FM' }, { name: 'Moldova', code: 'MD' }, { name: 'Monaco', code: 'MC' }, { name: 'Mongolia', code: 'MN' }, { name: 'Montenegro', code: 'ME' }, { name: 'Montserrat', code: 'MS' }, { name: 'Morocco', code: 'MA' }, { name: 'Mozambique', code: 'MZ' }, { name: 'Myanmar', code: 'MM' }, { name: 'Namibia', code: 'NA' }, { name: 'Nauru', code: 'NR' }, { name: 'Nepal', code: 'NP' }, { name: 'Netherlands', code: 'NL' }, { name: 'New Caledonia', code: 'NC' }, { name: 'New Zealand', code: 'NZ' }, { name: 'Nicaragua', code: 'NI' }, { name: 'Niger', code: 'NE' }, { name: 'Nigeria', code: 'NG' }, { name: 'Niue', code: 'NU' }, { name: 'Norfolk Island', code: 'NF' }, { name: 'Northern Mariana Islands', code: 'MP' }, { name: 'Norway', code: 'NO' }, { name: 'Oman', code: 'OM' }, { name: 'Pakistan', code: 'PK' }, { name: 'Palau', code: 'PW' }, { name: 'Panama', code: 'PA' }, { name: 'Papua New Guinea', code: 'PG' }, { name: 'Paraguay', code: 'PY' }, { name: 'Peru', code: 'PE' }, { name: 'Philippines', code: 'PH' }, { name: 'Pitcairn', code: 'PN' }, { name: 'Poland', code: 'PL' }, { name: 'Portugal', code: 'PT' }, { name: 'Puerto Rico', code: 'PR' }, { name: 'Qatar', code: 'QA' }, { name: 'Reunion', code: 'RE' }, { name: 'Romania', code: 'RO' }, { name: 'Russian Federation', code: 'RU' }, { name: 'Rwanda', code: 'RW' }, { name: 'Saint Barthélemy', code: 'BL' }, { name: 'Saint Helena', code: 'SH' }, { name: 'Saint Kitts and Nevis', code: 'KN' }, { name: 'Saint Lucia', code: 'LC' }, { name: 'Saint Martin French', code: 'MF' }, { name: 'Saint Pierre and Miquelon', code: 'PM' }, { name: 'Saint Vincent and the Grenadines', code: 'VC' }, { name: 'Samoa', code: 'WS' }, { name: 'San Marino', code: 'SM' }, { name: 'Sao Tome and Principe', code: 'ST' }, { name: 'Saudi Arabia', code: 'SA' }, { name: 'Senegal', code: 'SN' }, { name: 'Serbia', code: 'RS' }, { name: 'Seychelles', code: 'SC' }, { name: 'Sierra Leone', code: 'SL' }, { name: 'Singapore', code: 'SG' }, { name: 'Sint Maarten Dutch', code: 'SX' }, { name: 'Slovakia', code: 'SK' }, { name: 'Slovenia', code: 'SI' }, { name: 'Solomon Islands', code: 'SB' }, { name: 'Somalia', code: 'SO' }, { name: 'South Africa', code: 'ZA' }, { name: 'South Sudan', code: 'SS' }, { name: 'Spain', code: 'ES' }, { name: 'Sri Lanka', code: 'LK' }, { name: 'Sudan', code: 'SD' }, { name: 'Suriname', code: 'SR' }, { name: 'Svalbard and Jan Mayen', code: 'SJ' }, { name: 'Swaziland', code: 'SZ' }, { name: 'Sweden', code: 'SE' }, { name: 'Switzerland', code: 'CH' }, { name: 'Syrian Arab Republic', code: 'SY' }, { name: 'Taiwan', code: 'TW' }, { name: 'Tajikistan', code: 'TJ' }, { name: 'Tanzania', code: 'TZ' }, { name: 'Thailand', code: 'TH' }, { name: 'Timor Leste', code: 'TL' }, { name: 'Togo', code: 'TG' }, { name: 'Tokelau', code: 'TK' }, { name: 'Tonga', code: 'TO' }, { name: 'Trinidad and Tobago', code: 'TT' }, { name: 'Tunisia', code: 'TN' }, { name: 'Turkey', code: 'TR' }, { name: 'Turkmenistan', code: 'TM' }, { name: 'Turks and Caicos Islands', code: 'TC' }, { name: 'Tuvalu', code: 'TV' }, { name: 'Uganda', code: 'UG' }, { name: 'Ukraine', code: 'UA' }, { name: 'United Arab Emirates', code: 'AE' }, { name: 'United Kingdom', code: 'GB' }, { name: 'United States', code: 'US' }, { name: 'United States Minor Outlying Islands', code: 'UM' }, { name: 'Uruguay', code: 'UY' }, { name: 'Uzbekistan', code: 'UZ' }, { name: 'Vanuatu', code: 'VU' }, { name: 'Venezuela', code: 'VE' }, { name: 'Viet Nam', code: 'VN' }, { name: 'Virgin Islands British', code: 'VG' }, { name: 'Virgin Islands U.S.', code: 'VI' }, { name: 'Wallis and Futuna', code: 'WF' }, { name: 'Western Sahara', code: 'EH' }, { name: 'Yemen', code: 'YE' }, { name: 'Zambia', code: 'ZM' }, { name: 'Zimbabwe', code: 'ZW' }];
        geo.usStates = [{ name: "Alabama", code: "AL" }, { name: "Alaska", code: "AK" }, { name: "American Samoa", code: "AS" }, { name: "Arizona", code: "AZ" }, { name: "Arkansas", code: "AR" }, { name: "California", code: "CA" }, { name: "Colorado", code: "CO" }, { name: "Connecticut", code: "CT" }, { name: "Delaware", code: "DE" }, { name: "District Of Columbia", code: "DC" }, { name: "Federated States Of Micronesia", code: "FM" }, { name: "Florida", code: "FL" }, { name: "Georgia", code: "GA" }, { name: "Guam", code: "GU" }, { name: "Hawaii", code: "HI" }, { name: "Idaho", code: "ID" }, { name: "Illinois", code: "IL" }, { name: "Indiana", code: "IN" }, { name: "Iowa", code: "IA" }, { name: "Kansas", code: "KS" }, { name: "Kentucky", code: "KY" }, { name: "Louisiana", code: "LA" }, { name: "Maine", code: "ME" }, { name: "Marshall Islands", code: "MH" }, { name: "Maryland", code: "MD" }, { name: "Massachusetts", code: "MA" }, { name: "Michigan", code: "MI" }, { name: "Minnesota", code: "MN" }, { name: "Mississippi", code: "MS" }, { name: "Missouri", code: "MO" }, { name: "Montana", code: "MT" }, { name: "Nebraska", code: "NE" }, { name: "Nevada", code: "NV" }, { name: "New Hampshire", code: "NH" }, { name: "New Jersey", code: "NJ" }, { name: "New Mexico", code: "NM" }, { name: "New York", code: "NY" }, { name: "North Carolina", code: "NC" }, { name: "North Dakota", code: "ND" }, { name: "Northern Mariana Islands", code: "MP" }, { name: "Ohio", code: "OH" }, { name: "Oklahoma", code: "OK" }, { name: "Oregon", code: "OR" }, { name: "Palau", code: "PW" }, { name: "Pennsylvania", code: "PA" }, { name: "Puerto Rico", code: "PR" }, { name: "Rhode Island", code: "RI" }, { name: "South Carolina", code: "SC" }, { name: "South Dakota", code: "SD" }, { name: "Tennessee", code: "TN" }, { name: "Texas", code: "TX" }, { name: "Utah", code: "UT" }, { name: "Vermont", code: "VT" }, { name: "Virgin Islands", code: "VI" }, { name: "Virginia", code: "VA" }, { name: "Washington", code: "WA" }, { name: "West Virginia", code: "WV" }, { name: "Wisconsin", code: "WI" }, { name: "Wyoming", code: "WY" }, { name: "U.S. Armed Forces Americas", code: "AA" }, { name: "U.S. Armed Forces Europe", code: "AE" }, { name: "U.S. Armed Forces Pacific", code: "AP" }];
        geo.caProvinces = [{ code: "AB", name: "Alberta" }, { code: "BC", name: "British Columbia" }, { code: "LB", name: "Labrador" }, { code: "MB", name: "Manitoba" }, { code: "NB", name: "New Brunswick" }, { code: "NL", name: "Newfoundland" }, { code: "NS", name: "Nova Scotia" }, { code: "NU", name: "Nunavut" }, { code: "NW", name: "Northwest Territories" }, { code: "ON", name: "Ontario" }, { code: "PE", name: "Prince Edward Island" }, { code: "QC", name: "Quebec" }, { code: "SK", name: "Saskatchewen" }, { code: "YT", name: "Yukon" }];

        return geo;
    }

    function getStatesProvs(country) {

        var data = getData();

        if (country == "US") {
            return data.usStates;
        }

        if (country == "CA") {
            return data.caProvinces;
        }

        return null;

    }

    function isEu(country) {

        var euCountries = ["AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE", "GB"];

        if (euCountries.indexOf(country) > -1) {
            return true;
        }

        return false;

    }

    function getCurrencySymbol(code) {

        var currencies = { "AED": "د.إ", "AFN": "؋", "ALL": "L", "AMD": "֏", "ANG": "ƒ", "AOA": "Kz", "ARS": "$", "AUD": "$", "AWG": "ƒ", "AZN": "ман", "BAM": "KM", "BBD": "$", "BDT": "৳", "BGN": "лв", "BHD": ".د.ب", "BIF": "FBu", "BMD": "$", "BND": "$", "BOB": "$b", "BRL": "R$", "BSD": "$", "BTC": "฿", "BTN": "Nu.", "BWP": "P", "BYR": "p.", "BZD": "BZ$", "CAD": "$", "CDF": "FC", "CHF": "CHF", "CLP": "$", "CNY": "¥", "COP": "$", "CRC": "₡", "CUC": "$", "CUP": "₱", "CVE": "$", "CZK": "Kč", "DJF": "Fdj", "DKK": "kr", "DOP": "RD$", "DZD": "دج", "EEK": "kr", "EGP": "£", "ERN": "Nfk", "ETB": "Br", "ETH": "Ξ", "EUR": "€", "FJD": "$", "FKP": "£", "GBP": "£", "GEL": "₾", "GGP": "£", "GHC": "₵", "GHS": "GH₵", "GIP": "£", "GMD": "D", "GNF": "FG", "GTQ": "Q", "GYD": "$", "HKD": "$", "HNL": "L", "HRK": "kn", "HTG": "G", "HUF": "Ft", "IDR": "Rp", "ILS": "₪", "IMP": "£", "INR": "₹", "IQD": "ع.د", "IRR": "﷼", "ISK": "kr", "JEP": "£", "JMD": "J$", "JOD": "JD", "JPY": "¥", "KES": "KSh", "KGS": "лв", "KHR": "៛", "KMF": "CF", "KPW": "₩", "KRW": "₩", "KWD": "KD", "KYD": "$", "KZT": "лв", "LAK": "₭", "LBP": "£", "LKR": "₨", "LRD": "$", "LSL": "M", "LTC": "Ł", "LTL": "Lt", "LVL": "Ls", "LYD": "LD", "MAD": "MAD", "MDL": "lei", "MGA": "Ar", "MKD": "ден", "MMK": "K", "MNT": "₮", "MOP": "MOP$", "MRO": "UM", "MUR": "₨", "MVR": "Rf", "MWK": "MK", "MXN": "$", "MYR": "RM", "MZN": "MT", "NAD": "$", "NGN": "₦", "NIO": "C$", "NOK": "kr", "NPR": "₨", "NZD": "$", "OMR": "﷼", "PAB": "B/.", "PEN": "S/.", "PGK": "K", "PHP": "₱", "PKR": "₨", "PLN": "zł", "PYG": "Gs", "QAR": "﷼", "RMB": "￥", "RON": "lei", "RSD": "Дин.", "RUB": "₽", "RWF": "R₣", "SAR": "﷼", "SBD": "$", "SCR": "₨", "SDG": "ج.س.", "SEK": "kr", "SGD": "$", "SHP": "£", "SLL": "Le", "SOS": "S", "SRD": "$", "SSP": "£", "STD": "Db", "SVC": "$", "SYP": "£", "SZL": "E", "THB": "฿", "TJS": "SM", "TMT": "T", "TND": "د.ت", "TOP": "T$", "TRL": "₤", "TRY": "₺", "TTD": "TT$", "TVD": "$", "TWD": "NT$", "TZS": "TSh", "UAH": "₴", "UGX": "USh", "USD": "$", "UYU": "$U", "UZS": "лв", "VEF": "Bs", "VND": "₫", "VUV": "VT", "WST": "WS$", "XAF": "FCFA", "XBT": "Ƀ", "XCD": "$", "XOF": "CFA", "XPF": "₣", "YER": "﷼", "ZAR": "R", "ZWD": "Z$" }

        return currencies[code] || "";
    }

}]);

app.service("CurrencyService", ['$q', '$rootScope', 'SettingsService', 'CartService', 'InvoiceService', 'StorageService', 'ApiService', function ($q, $rootScope, SettingsService, CartService, InvoiceService, StorageService, ApiService) {

    // Return public API.
    return {
        getCurrency: getCurrency,
        getCurrencyName: getCurrencyName,
        setCurrency: setCurrency
    };

    function getCurrency() {
        return StorageService.get("currency");
    }

    function getCurrencyName() {

        var code = getCurrency();
        var settings = SettingsService.get();

        var name = null;
        _.each(settings.account.currencies, function (item) {
            if (item.code == code) {
                name = item.name;
            }
        });

        return name;

    }

    function setCurrency(newValue) {

        // Store in a cookie to persist page refreshes
        StorageService.set("currency", newValue);

        // Emit the change
        $rootScope.$emit("currencyChanged", newValue);

    }

}]);

app.service("LanguageService", ['$q', '$rootScope', 'SettingsService', 'StorageService', 'gettextCatalog', 'ApiService', function ($q, $rootScope, SettingsService, StorageService, gettextCatalog, ApiService) {

    // Angular gettext https://angular-gettext.rocketeer.be/ Used to provide application translations. Translation files are located in the languages folder.

    // Return public API.
    return {
        getSelectedLanguage: getSelectedLanguage,
        getLanguages: getLanguages,
        setLanguage: setLanguage,
        establishLanguage: establishLanguage
    };

    function getLanguages() {

        // The supported languages are defined in rootScope. This allows the setting to be changed by apps that use kit don't want to modify kit's source.
        if ($rootScope.languages) {
            return $rootScope.languages;
        } else {
            // Return the default language
            return [{ code: "en", name: "English" }];
        }

    }

    function getSelectedLanguage() {

        var languages = getLanguages();
        var language = StorageService.get("language");

        // Only return if the value is valid.
        language = _.findWhere(languages, { code: language });
        if (language) {
            return language;
        }

        // Return empty.
        return { name: null, code: null };

    }

    function isSupportedLanguage(language) {

        var languages = getLanguages();
        return !(_.findWhere(languages, { code: language }) == null);

    }

    function setLanguage(language, languagesPath) {

        // Only attempt to set the language if the supplied value is valid.
        if (isSupportedLanguage(language) == false) {
            return;
        }

        if (language != null) {
            StorageService.set("language", language);
            gettextCatalog.setCurrentLanguage(language);

            // Emit the change
            $rootScope.$emit("languageChanged", language);

            // English does not need to be loaded since it's embedded in the HTML.
            if (language != "en") {
                // Load the language configuration file.
                gettextCatalog.loadRemote((languagesPath || "languages/") + language + "/" + language + ".json");
            }
        }

    }

    function getUserLanguage() {

        var deferred = $q.defer();

        // Check if languages are provided. If not, just return english and don't bother fetching the user's language from the server.
        if (!$rootScope.languages) {
            deferred.resolve("en");
            return deferred.promise;
        }

        // If a language is already set and it's valid, just return that language.
        var language = getSelectedLanguage();

        if (language.code) {

            // We already have a language set, return it.
            deferred.resolve(language.code);

        } else {

            // Determine the user's language from the server, which is the most reliable way to get browser language settings into JavaScript.
            var settings = SettingsService.get();
            ApiService.getItem("/browser_info", null, true).then(function (response) {

                // The value returned in language will either be a valid two-character language code or null.
                deferred.resolve(response.data.language);

            }, function (error) {
                // We always resolve the promise, just with null in the case of error.
                deferred.resolve(null);
            });

        }

        return deferred.promise;

    }

    function establishLanguage(languagesPath) {

        // This called when the app is intially bootstrapped and sets the language according to the user's preference, auto-detected language or default language.
        getUserLanguage().then(function (language) {

            // If null, set the default
            if (language == null) {
                language = "en";
            }

            // Set the language
            setLanguage(language, languagesPath);

        });

    }

}]);

app.service("SettingsService", [function ($http, $q) {

    // Return public API.
    return {
        get: get
    };

    function get() {

        // The embedded settings/app.js and settings/account.js set the values within the __settings global variable.

        // Get account settings
        var getAccountSettings = function () {

            var accountSettings = {};

            if (window.__settings) {
                if (window.__settings.account) {
                    accountSettings = window.__settings.account;
                }
            }

            // If accountSettings doesn't have the property "date_utc", inject the current client-side date.
            // The purpose is to provide the current server date to the app when running in the hosted environment. It is not designed to give precise time (because the settings file may be cached for minutes) 
            // Therefore, it always returns a date with the time at midnight, but will provide a reliable date "seed" in the application for things like credit card expiration date lists and copyright dates. Useful when you don't want to rely on a client-side clock.
            if (!accountSettings.date_utc) {
                // No value provided in the settings file, which is likely in development environments. Inject the client-side date so the app doesn't have to consider null values.
                accountSettings.date_utc = utils.getCurrentIsoDate(true);
            }

            // Split the date into parts for easy access
            var date = new Date(accountSettings.date_utc);
            accountSettings.year = date.getFullYear();
            accountSettings.month = date.getMonth();
            accountSettings.date = date.getDate();

            return accountSettings;
        };

        // Get app settings
        var getAppSettings = function () {

            var appSettings = {};

            if (window.__settings) {
                if (window.__settings.app) {
                    appSettings = window.__settings.app;
                }
            }

            return appSettings;
        };

        // Build and return the settings object
        var settings = { account: getAccountSettings(), app: getAppSettings(), config: {} };

        // Define the api prefix
        settings.config.apiPrefix = "/api/v1";

        settings.config.development = false;

        // For convenience, if you place a development flag in either one of the settings stubs (during local development), the app will be marked as running in development mode.
        if (settings.account.development || settings.app.development) {

            settings.config.development = true;

            // Make the apiPrefix a fully qualified url since requests in development mode don't have access to the reverse proxy.
            settings.config.apiPrefix = "https://api.comecero.com" + settings.config.apiPrefix;
        }

        return settings;

    }

}]);

app.service("HelperService", ['SettingsService', 'StorageService', '$location', function (SettingsService, StorageService, $location) {

    // Return public API.
    return {
        isRequiredCustomerField: isRequiredCustomerField,
        isOptionalCustomerField: isOptionalCustomerField,
        isCustomerField: isCustomerField,
        hasShippingAddress: hasShippingAddress,
        newSessionRedirect: newSessionRedirect,
        getShoppingUrl: getShoppingUrl,
        hasSubscription: hasSubscription,
        hasPhysical: hasPhysical,
        supportsPaymentMethod: supportsPaymentMethod
    };

    function isRequiredCustomerField(field, options, shippingIsBilling) {

        if (!field || !options) {
            return false;
        }

        // If shippingIsBilling == false and the field is a shipping address, swap shipping_address in the field name with billing_address before you compare.
        var isShippingField = false;
        if (field.substring(0, 17) == "shipping_address.") {
            field = "billing_address." + field.substring(17);
            isShippingField = true;
        }

        if (field == "billing_address.name") {
            field = "name";
        }

        if (shippingIsBilling === true) {
            return false;
        }

        if (!options.customer_required_fields) {
            return false;
        }

        if (options.customer_required_fields.indexOf(field) >= 0) {
            return true;
        }

        return false;

    }

    function isOptionalCustomerField(field, options, shippingIsBilling) {

        if (!field || !options) {
            return false;
        }

        // If shippingIsBilling == false and the field is a shipping address, swap shipping_address in the field name with billing_address before you compare.
        var isShippingField = false;
        if (field.substring(0, 17) == "shipping_address.") {
            field = "billing_address." + field.substring(17);
            isShippingField = true;
        }
        if (field == "billing_address.name") {
            field = "name";
        }

        if (shippingIsBilling === true) {
            return false;
        }

        if (!options.customer_optional_fields) {
            return false;
        }

        if (options.customer_optional_fields.indexOf(field) >= 0) {
            return true;
        }

        return false;

    }

    function isCustomerField(field, options, shippingIsBilling) {

        if (!field || !options) {
            return false;
        }

        if (options.customer_required_fields) {
            if (isRequiredCustomerField(field, options, shippingIsBilling)) {
                return true;
            }
        }

        if (options.customer_optional_fields) {
            if (isOptionalCustomerField(field, options, shippingIsBilling)) {
                return true;
            }
        }

        return false;

    }

    function hasShippingAddress(customer) {

        if (customer) {
            if (customer.shipping_address) {
                if (customer.shipping_address.address_1) {
                    return true;
                }
            }
        }

        return false;

    }

    function newSessionRedirect(reset, debug) {

        // This redirects the user to the base location of a new session, which may be an external URL.
        // If reset == true, then it flushes the cart_id and token before performing the redirect.

        // In the case of a bad token, invalid cart id or other unfortunate situation, this resets the user's session and redirects them to the desired URL.

        console.log(debug);

        if (reset === true) {
            StorageService.remove("cart_id");
            StorageService.remove("invoice_id");
            StorageService.remove("token");
        }

        var settings = SettingsService.get().app;

        if (settings.main_shopping_url) {

            // If a main shopping URL has been provided, redirect to it.
            window.location.replace(settings.main_shopping_url);

        } else {

            // Otherwise, redirect to the app root. If the destination is the same page they're on, the location.replace won't do anything. Reload the current page in that case.
            if ($location.path() != "/") {
                $location.path("/");
                $location.replace();
            } else {
                window.location.reload();
            }

        }
    }

    function getShoppingUrl() {

        var settings = SettingsService.get().app;

        if (settings.main_shopping_url == null) {
            return window.location.href.substring(0, window.location.href.indexOf("#")) + "#/";
        } else {
            return settings.main_shopping_url;
        }

    }

    function hasSubscription(items) {

        if (_.find(items, function (item) { return item.subscription_plan != null; }) != null) {
            return true;
        }

        return false;

    }

    function hasPhysical(items) {

        if (_.find(items, function (item) { return item.type == "physical"; }) != null) {
            return true;
        }

        return false;

    }

    function supportsPaymentMethod(type, options) {

        if (!type || !options) {
            return false;
        }

        if (_.find(options.payment_methods, function (item) { return item.payment_method_type == type; }) != null) {
            return true;
        }

        return false;

    }

}]);

app.service("StorageService", ['appCache', function (appCache) {

    // Return public API.
    return {
        get: get,
        set: set,
        remove: remove
    };

    function get(key) {

        var value = appCache.get(key);

        if (value == null) {
            // Look to to cookie for a backup
            value = utils.getCookie(key);
        }

        return value;

    }

    function set(key, value, expiresInSeconds) {

        appCache.put(key, value);

        // If expiresInSeconds is not defined, we'll use 14 days as the default
        if (expiresInSeconds == null) {
            expiresInSeconds = 1209600;
        }

        // Backup to a cookie
        utils.setCookie(key, value, expiresInSeconds / 60);

    }

    function remove(key) {

        appCache.remove(key);

        // Remove the associated cookie
        utils.deleteCookie(key);

    }

}]);
//# sourceMappingURL=kit.js.map
