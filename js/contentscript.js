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
        for (var i = 0; i < domains.length; i++) {
          // only root domains will be in the settings. Check that host ends with the domain
          if (domain.toLowerCase().indexOf(domains[i].toLowerCase(), domain.length - domains[i].length) !== -1) {
            $el.addClass('nfe-extension-link');
            if ($el.attr("rel") && $el.attr("rel").split(' ').indexOf("nofollow") > -1) {
              $el.css('background-color', '#' + colors.nofollow_bg);
              $el.css('color', '#' + colors.nofollow_fg);
            } else {
              $el.css('background-color', '#' + colors.follow_bg);
              $el.css('color', '#' + colors.follow_fg);
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
  links.css('background-color', '');
  links.css('color', '');
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
