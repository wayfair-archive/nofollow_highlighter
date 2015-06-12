/**
 * Set rules on options page from local storage values
 */
function showRules() {
	document.getElementById("nfe_state").value = chrome.extension.getBackgroundPage().getLocalStorageRules();
}

/**
 * Set domains on options page from local storage values
 */
function showDomains() {
  document.getElementById("domains").value = chrome.extension.getBackgroundPage().getDomains().join("\n");
}

/*
 * Listeners
 */

document.addEventListener("webkitvisibilitychange", showRules, false);

/**
 * Initialize options
 */
window.onload = function() {
	showRules();
  showDomains();
  var colors = chrome.extension.getBackgroundPage().getColors();
  document.getElementById("follow_fg").value = colors.follow_fg;
  document.getElementById("follow_bg").value = colors.follow_bg;
  document.getElementById("nofollow_fg").value = colors.nofollow_fg;
  document.getElementById("nofollow_bg").value = colors.nofollow_bg;

	document.getElementById("saveSites").onclick = function() {
		if (document.getElementById("nfe_state").value !== "") {
			chrome.extension.getBackgroundPage().importRules(JSON.parse(document.getElementById("nfe_state").value));
		}
    window.localStorage.setItem('nfe_domains', document.getElementById("domains").value);
	};

	document.getElementById("clearSites").onclick = function() {
		chrome.extension.getBackgroundPage().clearRules();
		showRules();
	};

  document.getElementById("follow_fg").onchange = function() {
    window.localStorage.follow_fg = document.getElementById("follow_fg").value;
  };

  document.getElementById("follow_bg").onchange = function() {
    window.localStorage.follow_bg = document.getElementById("follow_bg").value;
  };

  document.getElementById("nofollow_fg").onchange = function() {
    window.localStorage.nofollow_fg = document.getElementById("nofollow_fg").value;
  };

  document.getElementById("nofollow_bg").onchange = function() {
    window.localStorage.nofollow_bg = document.getElementById("nofollow_bg").value;
  };
};

