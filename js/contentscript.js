/**
 * Generates the style sheet that we need to use
 */
function generateStyleSheet(colors) {
  var styleEl = document.getElementById('nfe_style');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.type = 'text/css';
    styleEl.id = 'nfe_style';
    document.getElementsByTagName('head')[0].appendChild(styleEl);
    styleEl.appendChild(document.createTextNode('a.nfe-extension-link.nfe-nofollow, a.nfe-extension-link.nfe-nofollow * {color: #' + colors.nofollow_fg + '; background-color: #' + colors.nofollow_bg+ ' !important;}'));
    styleEl.appendChild(document.createTextNode('a.nfe-extension-link.nfe-nofollow img {border: 6px solid #' + colors.nofollow_bg + ' !important;}'));
    styleEl.appendChild(document.createTextNode('a.nfe-extension-link.nfe-follow, a.nfe-extension-link.nfe-follow * {color: #' + colors.follow_fg + '; background-color: #' + colors.follow_bg+ ' !important;}'));
    styleEl.appendChild(document.createTextNode('a.nfe-extension-link.nfe-follow img {border: 6px solid #' + colors.follow_bg + ' !important;}'));
  }

}

/**
 * Applies Nofollow Highlighter classes
 */
function applyClasses(domains, colors) {
  $('a').each(function (index, el) {
    var $el = $(el);
    var href = $el.attr('href');
    if (href) {
      var matches = $el.attr('href').match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
      var domain = matches && matches[1];
      if (domain) {
        generateStyleSheet(colors);
        for (var i = 0; i < domains.length; i++) {
          // only root domains will be in the settings. Check that host ends with the domain
          if (domain.toLowerCase().indexOf(domains[i].toLowerCase(), domain.length - domains[i].length) !== -1) {
            $el.addClass('nfe-extension-link');
            if ($el.attr("rel") && $el.attr("rel").split(' ').indexOf("nofollow") > -1) {
              $el.addClass('nfe-nofollow');
            } else {
              $el.addClass('nfe-follow');
            }
            break;
          }
        }
      }
    }
  });
}

/**
 * Removes all Nofollow Highlighter classes
 */
function removeClasses() {
  var links = $('.nfe-extension-link');
  links.removeClass('nfe-extension-link');
  links.removeClass('nfe-follow');
  links.removeClass('nfe-nofollow');
}

/*
 * Listeners
 */

chrome.runtime.onMessage.addListener(
  function(req, sender, sendResponse) {
    if (req.show) {
      applyClasses(req.domains, req.colors);
    } else {
      removeClasses();
    }

    // ack back to background script
    sendResponse({ok: true});
  }
);
