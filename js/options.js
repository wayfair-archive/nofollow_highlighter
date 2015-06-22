/**
 * Set rules on options page from local storage values
 */
function showRules() {
  if (window.localStorage.toggleBehaviour == "site") {
    document.getElementById("nfe_state").value = chrome.extension.getBackgroundPage().getLocalStorageRules();
    $('.enabled_sites').addClass('enabled');
  } else {
    $('.enabled_sites').removeClass('enabled');
  }

}

/**
 * Set domains on options page from local storage values
 */
function showDomains() {
  document.getElementById("domains").value = chrome.extension.getBackgroundPage().getDomains().join("\n");
}

/**
 * Show the colors.
 */
function showColors() {
  var colors = chrome.extension.getBackgroundPage().getColors();
  document.getElementById("follow_fg").value = colors.follow_fg;
  document.getElementById("follow_bg").value = colors.follow_bg;
  document.getElementById("nofollow_fg").value = colors.nofollow_fg;
  document.getElementById("nofollow_bg").value = colors.nofollow_bg;
  var follow = $('.colors .follow');
  var nofollow = $('.colors .nofollow');
  if (window.localStorage.follow_enabled === 'false') {
    follow.addClass("disabled");
  } else {
    follow.removeClass("disabled");
    $('[name=follow_enabled]').attr("checked", "checked");
  }
  if (window.localStorage.nofollow_enabled === 'false') {
    nofollow.addClass("disabled");
  } else {
    nofollow.removeClass("disabled");
    $('[name=nofollow_enabled]').attr("checked", "checked");

  }
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
  showColors();

  $('input[name=toggle_behaviour]').each(function(idx, el) {
    if (window.localStorage.toggleBehaviour == el.value) {
      $(el).attr('checked', "checked");
    }
  });

	document.getElementById("domains").onchange = function(evt) {
    window.localStorage.setItem('nfe_domains', document.getElementById("domains").value);
	};

  document.getElementById("nfe_state").onchange = function(evt) {
    if (evt.target.value !== "") {
      chrome.extension.getBackgroundPage().importRules(JSON.parse(document.getElementById("nfe_state").value));
    }
  };

  $('[name=toggle_behaviour]').change(function(evt) {
    window.localStorage.toggleBehaviour = evt.target.value;
    showRules();
  });

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

  $("input[name=follow_enabled]").change(function(evt) {
    window.localStorage.follow_enabled = $(evt.target).is(':checked');
    showColors();
  });

  $("input[name=nofollow_enabled]").change(function(evt) {
    window.localStorage.nofollow_enabled = $(evt.target).is(':checked');
    showColors();
  });

};

