/**
 * @file Section change.
 * 
 * Implements script to change metadata and title dinamically.
 */

(function($) {
  /**
   * If you are getting this script to use in another project, see
   * views-view-fields.tpl.php and template.php for info about the classes used.
   */

  $.fn.sectionChange = function(options) {

    var defaults = {
      onlyHash : false,
      dataSectionName : 'section',
      viewsRowSelector : '.views-row',
      animationTime : 500,
      discount : 0,
      ignore : '',
      linksSelector : ''
    };

    var settings = $.extend({}, defaults, options);
    var viewName = '';
    var pathName = '';
    var currentSection = '';
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
     * Returns the view section name
     * 
     * @param {jQuery object} view
     * 
     * @returns {string}
     */
    var getSectionByView = function(view) {
      return $(view).find("[data-" + settings.dataSectionName + "]").data(settings.dataSectionName);
    }

    /**
     * Returns the pathname and hash if it's not iqual to the last one.
     * 
     * @param {string} id - Section id
     * 
     * @returns {string}
     */
    var getSectionPathname = function(id) {
      if (getSectionByView($(settings.viewsRowSelector).first()) == id) {
        return pathName;
      }

      return settings.onlyHash ? pathName + '#' + id : pathName + id;
    }

    /**
     * Returns the section view object.
     * 
     * @param {jQuery object=} section - The section object
     * 
     * @return {jQuery object}
     */
    var getViewBySection = function(section) {
      if (typeof section === 'undefined') {
        section = $('');
      }

      var view = section.closest(settings.viewsRowSelector);
      if (view.length < 1) {
        view = $(settings.viewsRowSelector).first();
      }
      return view;
    }

    /**
     * Get the active view at the moment.
     * 
     * @return {jQuery object}
     */
    var getActiveView = function() {
      var hash = getWindowHash();
      var section = getSectionObjectByHash(hash);
      return getViewBySection(section);
    }

    /**
     * Get any size to be desconted on scroll events
     */
    var getDiscount = function() {
      if (typeof settings.discount === "function") {
        return settings.discount();
      }
      else {
        return settings.discount;
      }
    }

    /**
     * Returns the windowScroll. Plus: discounts any configured size.
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
    var isNotSection = function(view) {
      // TODO not working when settings.onlyHasg = false
      return $(view).find(settings.ignore).length > 0 ? true : false;
    }

    /**
     * Verify if is on a new section based on scroll.
     * 
     * @see settings.ignore
     * @param {string/jQuery object} view
     * 
     * @return {boolean}
     */
    var isInNewSection = function(view) {
      var scroll = getWindowScroll();
      var section = getSectionByView(view);
      var top = view.offset().top;
      var bottom = top + view.height();
      if (scroll >= top && scroll <= bottom && section != currentSection && !isNotSection(view)) {
        currentSection = section;
        return true;
      }
      return false;
    }

    /**
     * Animate page to the begin of the given active view.
     * 
     * @param {jQuery object} activeView
     */
    var animateToActiveView = function(activeView) {
      $(bodyScrollElement).animate({
        scrollTop : activeView.offset().top - getDiscount()
      }, settings.animationTime);
    }

    /**
     * Change the page url, metadatas and make the page animate.
     * 
     * @param {jQuery object} activeView
     */
    var goToSection = function(activeView) {
      changePageMetaData(activeView);
      changePageUrl(activeView);
      animateToActiveView(activeView);
    }

    /**
     * Forces the page scroll to the active section. It uses the url path or
     * hash to determine the current section.
     * 
     */
    var goToActiveSection = function() {
      var activeView = getActiveView();
      goToSection(activeView);
    }
    
    /**
     * Watch the page load to trigger initial section change.
     */
    var changePageMetaDataOnLoad = function() {
      $(window).load(function() {
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
      });
    }

    /**
     * Watch the page scroll to trigger section change.
     */
    var changePageMetaDataOnScoll = function() {
      // Change .view-pfe-pages to your view class.
      var views = $(viewName).find(' > .view-content > .views-row');
      $(window).on('scroll', function() {
        if (!$(bodyScrollElement).is(':animated')) {
          views.each(function() {
            if (isInNewSection($(this))) {
              changePageMetaData($(this));
              changePageUrl($(this));
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
        var view = getViewBySection(section);
        goToSection(view);
        e.preventDefault();
      });
    }

    /**
     * Changes page metadatas. These fields must be added in the TPL for the
     * script to work.
     * 
     * @param {jQuery object} activeView
     */
    var changePageMetaData = function(activeView) {
      var title = $(activeView).find('.metatag-title').length > 0 ? $(activeView).find('.metatag-title').html() : '';
      var description = $(activeView).find('.metatag-description').length > 0 ? $(activeView).find('.metatag-description').html() : '';
      $('title').html(title.trim());
      $('meta[name=description]').attr('content', description.trim());
    }

    /**
     * Changes page url.
     * 
     * @param {jQuery object} activeView
     */
    var changePageUrl = function(activeView) {
      var title = getSectionByView(activeView);
      if (title != '' && history.pushState) {
        var id = title;
        var url = getSectionPathname(id);
        var stateObj = {
          'id' : id
        };

        if (history.state != null && id != history.state.id) {
          history.pushState(stateObj, title, url);
        }
        else {
          history.replaceState(stateObj, title, url);
        }
      }
    }

    var init = function(selector) {
      viewName = selector;
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
