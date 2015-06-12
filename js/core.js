var extractHostname = new RegExp('^(https?\:)?//([^/]+)', 'im'),
    url,
    tabId;

init();

/**
 * Update the icon
 * @param setting - 'on' or 'off'
 */
function updateIcon(setting) {
  chrome.browserAction.setIcon({path: "images/icon-" + setting + ".png"});
}

/**
 * Checks that the current page is turned on or off, and sends message to content script
 */
function checkCurrent() {
  chrome.tabs.getSelected(undefined, function (tab) {
    url = tab.url;
    tabId = tab.id;
    var pattern = getPattern(url);
    var state = JSON.parse(chrome.extension.getBackgroundPage().getLocalStorageRules());
    var settings = 'off';
    for (var i = 0; i < state.length; i++) {
      if (state[i].primaryPattern == pattern) {
        settings = state[i].setting
      }
    }
    updateIcon(settings);
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      if (tabs && tabs.length > 0) {
        var domains = chrome.extension.getBackgroundPage().getDomains();
        var colors = chrome.extension.getBackgroundPage().getColors();
        if (domains.length) {
          chrome.tabs.sendMessage(tabs[0].id, {show: settings === 'on', domains: domains, colors: colors});
        }
      }
    });
  });
}

/**
 * Gets 'on' or 'off' for this page
 * @returns {string} 'on' | 'off'
 */
function getCurrentSetting() {
  var pattern = getPattern(url);
  var setting = 'off';
  var state = JSON.parse(chrome.extension.getBackgroundPage().getLocalStorageRules());
  for (var i = 0; i < state.length; i++) {
    if (state[i].primaryPattern == pattern) {
      setting = state[i].setting
    }
  }
  return setting;
}

/**
 * Gets pattern for
 * @returns hostname pattern for this url
 */
function getPattern() {
  var match, pattern;
  match = url.match(extractHostname);
  if (match) {
    pattern = match[0] + '/*';
  }
  return pattern;
}

/**
 * Change the settings for the current page/tab
 * @param tab
 */
function changeSettings(tab) {
  var setting = getCurrentSetting();
  var newSetting = (setting == 'on' ? 'off' : 'on');
  var pattern = getPattern(tab.url);
  if (pattern) {
    setLocalStorageRule(pattern, newSetting);
    updateIcon(newSetting);
    checkCurrent();
  }
}

/**
 * Gets the enabled sites via local storage, or "[]" if nothing is there
 * @returns {Document.nfe_state|string}
 */
function getLocalStorageRules() {
  return window.localStorage.nfe_state || "[]";
}

/**
 * Gets the list of domains that we should look for links in
 * @returns {Array}
 */
function getDomains() {
  var domains = window.localStorage.nfe_domains || "";
  return domains.split("\n");
}

/**
 * Gets the colors
 */
function getColors() {
  return {
    follow_fg: window.localStorage.follow_fg || "000000",
    follow_bg: window.localStorage.follow_bg || "00FF00",
    nofollow_fg: window.localStorage.nofollow_fg || "000000",
    nofollow_bg: window.localStorage.nofollow_bg || "FFD000"
  }
}

/**
 * Sets a single rule
 * @param pattern
 * @param newSetting - 'on'|'off'
 */
function setLocalStorageRule(pattern, newSetting) {
  var index = -1;
  var rules = JSON.parse(getLocalStorageRules());
  if (rules.length) {
    for (var i = 0; i < rules.length; i++) {
      if (pattern == rules[i].primaryPattern) {
        rules[i].setting = newSetting;
        index = i;
        break;
      }
    }
  }

  if (index >= 0) {
    if (newSetting === 'off') {
      rules.splice(index, 1);
    }
  } else {
    rules.push({
      'primaryPattern': pattern,
      'setting': newSetting
    });
  }

  window.localStorage.setItem('nfe_state', JSON.stringify(rules));
}

/**
 * Saves rules from the options page
 * @param localStorageRules
 */
function importRules(localStorageRules) {
  window.localStorage.setItem('nfe_state', JSON.stringify(localStorageRules));
}

/**
 * Removes rules, returning to default of []
 */
function clearRules() {
  window.localStorage.setItem('nfe_state', []);
}

/**
 * Gets the version from chrome
 * @returns {string|CSSStyleDeclaration.version|*}
 */
function getVersion() {
  var details = chrome.app.getDetails();
  return details.version;
}

/**
 * Initializes the extension
 */
function init() {
  // nfe_state
  if (!window.localStorage.nfe_state) {
    clearRules();
  }

  // Version
  var currentVersion = getVersion();
  var previousVersion = window.localStorage.nfe_version;
  if (currentVersion != previousVersion) {
    window.localStorage.nfe_version = currentVersion;
  }

  checkCurrent();
}

/*
 * Listeners
 */

chrome.tabs.onUpdated.addListener(function () {
  checkCurrent();
});

chrome.tabs.onHighlighted.addListener(function () {
  checkCurrent();
});

chrome.windows.onFocusChanged.addListener(function () {
  checkCurrent();
});

chrome.browserAction.onClicked.addListener(changeSettings);

chrome.commands.onCommand.addListener(function (command) {
  console.info(command);
  if (command == "toggle-wfnflh") {
    changeSettings();
  }
});