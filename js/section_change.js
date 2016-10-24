/**
 * @file Section change.
 * 
 * Implements script to change metadata and title dinamically.
 */

(function($) {

  $.fn.sectionChange = function(options) {

    var defaults = {
      animationTime : 500,
      dataSectionName : 'section',
      discount : 0,
      ignore : '',
      linksSelector : '',
      changePath : false,
      rowTitle : '.title',
      rowDescription : '.description',
      sectionRowSelector : '.row'
    };

    var settings = $.extend({}, defaults, options);
    var sectionsContainer, pathName, currentSection = '';
    var bodyScrollElement = 'html, body';

    /**
     * Select the right element to scroll based on webkit user agent.
     * 
     * @see http://harmssite.com/2013/08/jquery-animate-body-for-all-browsers/
     * 
     * @returns {string}
     */
    var setBodyScrollElement = function() {
      bodyScrollElement = (navigator.userAgent.toLowerCase().indexOf('webkit') > 0 ? 'body' : 'html');
    }

    /**
     * Remove default history scroll restoration.
     * 
     * @see https://developers.google.com/web/updates/2015/09/history-api-scroll-restoration
     */
    var setScrollRestoration = function(val) {
      if ('scrollRestoration' in history) {
        history.scrollRestoration = val;
      }
    }

    /**
     * Splits the hash character '#' and returns only the real name of the
     * section.
     * 
     * @param {string} hash - The hash to be splitted
     * 
     * @returns {string}
     */
    var getSectionByHash = function(hash) {
      if (hash.charAt(0) == "#") {
        hash = hash.substr(1);
      }
      return hash;
    }

    /**
     * Get section name based on path.
     * 
     * @returns {string}
     */
    var getSectionByPath = function() {
      return getSectionByHash(window.location.href);
    }

    /**
     * Get window location hash
     * 
     * @returns {string}
     */
    var getWindowHash = function() {
      return window.location.hash;
    }

    /**
     * Finds the section element based on path.
     * 
     * @param {string} hash - The section hash
     * 
     * @returns {jQuery object}
     */
    var getSectionObjectByHash = function(hash) {
      return $("[data-" + settings.dataSectionName + "='" + getSectionByHash(hash) + "']");
    }

    /**
     * Finds the section element based on path.
     * 
     * @returns {jQuery object}
     */
    var getSectionObjectByPath = function() {
      return $("[data-" + settings.dataSectionName + "='" + getSectionByPath() + "']");
    }

    /**
     * Returns the section name
     * 
     * @param {jQuery object} row
     * 
     * @returns {string}
     */
    var getSectionByRow = function(row) {
      return $(row).find("[data-" + settings.dataSectionName + "]").data(settings.dataSectionName);
    }

    /**
     * Returns the pathname and hash.
     * 
     * @param {string} id - Section id
     * 
     * @returns {string}
     */
    var getSectionPathname = function(id) {
      if (getSectionByRow($(settings.sectionRowSelector).first()) == id) {
        return pathName;
      }

      return settings.changePath == false ? pathName + '#' + id : pathName + id;
    }

    /**
     * Returns the section row object.
     * 
     * @param {jQuery object} section - The section object
     * 
     * @return {jQuery object}
     */
    var getRowBySection = function(section) {
      if (typeof section === 'undefined') {
        section = $('');
      }

      var row = section.closest(settings.sectionRowSelector);
      if (row.length < 1) {
        row = $(settings.sectionRowSelector).first();
      }
      return row;
    }

    /**
     * Get the active row.
     * 
     * @return {jQuery object}
     */
    var getActiveRow = function() {
      var hash = getWindowHash();
      var section = getSectionObjectByHash(hash);
      return getRowBySection(section);
    }

    /**
     * Get any size to be desconted on scroll events
     */
    var getDiscount = function() {
      switch (typeof settings.discount) {
        case 'function':
          return settings.discount();
        break;

        case 'string':
          if (isNaN(parseInt(settings.discount))) {
            return 0;
          }
          return parseInt(settings.discount);
        break;

        case 'number':
          return settings.discount;
        break;

        default:
          return 0;
      }
    }

    /**
     * Returns the windowScroll plus any configured discount size.
     * 
     * @see settings.discount
     * 
     * @return {number}
     */
    var getWindowScroll = function() {
      return $(document).scrollTop() + getDiscount() + 1;
    }

    /**
     * Ignore section if configured.
     * 
     * @see settings.ignore
     * @param {string/jQuery object} view
     * 
     * @return {boolean}
     */
    var isNotSection = function(row) {
      // TODO not working when settings.onlyHasg = false
      return $(row).is(settings.ignore);
    }

    /**
     * Verify if is on a new section based on scroll.
     * 
     * @see settings.ignore
     * @param {string/jQuery object} view
     * 
     * @return {boolean}
     */
    var isInNewSection = function(row) {
      var scroll = getWindowScroll();
      var section = getSectionByRow(row);
      var top = row.offset().top;
      var bottom = top + row.height();
      if (scroll >= top && scroll <= bottom && section != currentSection && !isNotSection(row)) {
        currentSection = section;
        return true;
      }
      return false;
    }

    /**
     * Trigger the sc.changed custom event
     * 
     * @param {string/jQuery object} row
     */
    var triggerChangedEvent = function(row) {
      var event = $.Event('sc.changed');
      event.relatedTarget = row;
      $(sectionsContainer).trigger(event);
    }

    /**
     * Animate page to the begin of the given row.
     * 
     * @param {jQuery object} row
     */
    var animateToSection = function(row) {
      $(bodyScrollElement).animate({
        scrollTop : row.offset().top - getDiscount()
      }, settings.animationTime);
    }

    /**
     * Change the page url, metadatas and make the page animate.
     * 
     * @param {jQuery object} row
     */
    var goToSection = function(row) {
      changePageMetaData(row);
      changePageUrl(row);
      animateToSection(row);
    }

    /**
     * Forces the page scroll to the active section. It uses the url path or
     * hash to determine the current section.
     * 
     */
    var goToActiveSection = function() {
      var row = getActiveRow();
      goToSection(row);
    }

    /**
     * Watch the page load to trigger initial section change.
     */
    var changePageMetaDataOnLoad = function() {
      goToActiveSection();

      // TODO setTimeout is been used to avoid the scroll hendler,
      // before we go to some section when page loads.
      // This was a bug on Safari IOS.
      // See if we can remove timeout and fix it with another approach.
      setTimeout(function() {
        changePageMetaDataOnScoll();
        changePageMetaDataOnPopstate();
        changePageMetaDataOnLinkClick();
      }, settings.animationTime);
    }

    /**
     * Watch the page scroll to trigger section change.
     */
    var changePageMetaDataOnScoll = function() {
      var rows = $(sectionsContainer).find(settings.sectionRowSelector);

      $(window).on('scroll', function() {
        if (!$(bodyScrollElement).is(':animated')) {
          rows.each(function() {
            var row = $(this);

            if (isInNewSection(row)) {
              changePageMetaData(row);
              changePageUrl(row);
            }
          });
        }
      });
    }

    /**
     * Handle to the browser history back.
     */
    var changePageMetaDataOnPopstate = function() {
      $(window).on('popstate', function(e) {
        e.preventDefault();
        goToActiveSection();
      });
    }

    /**
     * Change section on link click.
     * 
     * @see settings.linksSelector
     */
    var changePageMetaDataOnLinkClick = function() {
      $(settings.linksSelector).on('click', function(e) {
        var href = $(this).attr('href');
        var section = getSectionObjectByHash(href);
        var row = getRowBySection(section);

        goToSection(row);
        e.preventDefault();
      });
    }
    
    /**
     * Set up meta tags if don't already exists
     */
    var addMetaTags = function() {
      if ($('title').length == 0) {
        $('head').append('title');
      }
    };

    /**
     * Changes page metadatas.
     * 
     * @param {jQuery object} row
     */
    var changePageMetaData = function(row) {
      addMetaTags();
      
      var title = $(row).find(settings.rowTitle).length > 0 ? $(row).find(settings.rowTitle).html() : '';
      var description = $(row).find(settings.rowDescription).length > 0 ? $(row).find(settings.rowDescription).html() : '';

      $('title').html(title.trim());
      $('meta[name=description]').attr('content', description.trim());
    }

    /**
     * Changes page url.
     * 
     * @param {jQuery object} row
     */
    var changePageUrl = function(row) {
      var sectionName = getSectionByRow(row);
      if (sectionName != '' && history.pushState) {
        var url = getSectionPathname(sectionName);
        var stateObj = {
          'id' : sectionName
        };

        if (history.state != null && sectionName != history.state.id) {
          history.pushState(stateObj, sectionName, url);
          triggerChangedEvent(row);
        }
        else {
          history.replaceState(stateObj, sectionName, url);
        }
      }
    }

    var init = function(selector) {
      sectionsContainer = selector;
      pathName = window.location.pathname;

      setScrollRestoration('manual');
      setBodyScrollElement();

      changePageMetaDataOnLoad();
    };

    return this.each(function() {
      init(this);
    });
  };
})(jQuery);
