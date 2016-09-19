/**
 * @file
 * Section change.
 *
 * Implements script to change metadata and title dinamically.
 */

(function($) {
  /**
   * If you are getting this script to use in another project, see
   * views-view-fields.tpl.php and template.php for info about the classes used.
   */

  var currentSection = '';
  var bodyScrollElement = 'html, body';
  var animationTime = 500;

  $(document).ready(function() {
    setScrollRestoration('manual');
    setBodyScrollElement();
  });

  $(window).load(function() {
    goToActiveSection(getHeaderHeight());

    // TODO setTimeout is been used to avoid the scroll hendler,
    // before we go to some section when page loads.
    // This was a bug on Safari IOS.
    // See if we can remove timeout and fix it with another approach.
    setTimeout(function() {
      changePageMetaDataOnScoll();
      changePageMetaDataOnPopstate();
      changePageMetaDataOnMenuClick();
    }, animationTime);
  });

  /**
   * Select the right element to scroll based on webkit user agent.
   * 
   * @see http://harmssite.com/2013/08/jquery-animate-body-for-all-browsers/
   * 
   * @returns {string}
   */
  function setBodyScrollElement() {
    bodyScrollElement = (navigator.userAgent.toLowerCase().indexOf('webkit') > 0 ? 'body' : 'html');
  }

  /**
   * Splits the hash character '#' and returns only the real name of the
   * section.
   * 
   * @param {string} hash - The hash to be splitted
   * 
   * @returns {string}
   */
  function getSectionByHash(hash) {
    return hash.split('#')[1]
  }

  /**
   * Get section name based on path. Actualy we get this based on hash. If your
   * project will use only path, this need to be changed.
   * 
   * @returns {string}
   */
  function getSectionByPath() {
    return getSectionByHash(window.location.href);
  }

  /**
   * Finds the section element based on path.
   * 
   * @param {string} hash - The section hash
   * 
   * @returns {jQuery object}
   */
  function getSectionObjectByHash(hash) {
    return $("[data-section='" + getSectionByHash(hash) + "']");
  }

  /**
   * Finds the section element based on path.
   * 
   * @returns {jQuery object}
   */
  function getSectionObjectByPath() {
    return $("[data-section='" + getSectionByPath() + "']");
  }

  function isNotSection(view) {
    return $(view).find('.among-children').length > 0 ? true : false;
  }

  function getSectionByView(view) {
    return $(view).find('.background-section').data("section");
  }

  function getSectionPathname(id) {
    var pathname = window.location.pathname.split("/");
    if (getSectionByView($('.views-row-1')) == getSectionByHash(id)) {
      return " ";
    }
    return pathname[1] + id;
  }

  function getViewBySection(section) {
    if (typeof section === 'undefined') {
      section = $('');
    }

    var view = section.closest('.views-row');
    if (view.length < 1) {
      view = $('.views-row').first();
    }
    return view;
  }

  function getActiveView() {
    var section = getSectionObjectByPath();
    return getViewBySection(section);
  }

  function getHeaderHeight() {
    return $('#navbar').outerHeight();
  }

  /**
   * An specific size from Project.
   * 
   * @returns int
   */
  function getScrollDeltaSize() {
    return getHeaderHeight() + 1;
  }

  function getWindowScroll() {
    return $(document).scrollTop() + getScrollDeltaSize();
  }

  function isInNewSection(element) {
    var scroll = getWindowScroll();
    var section = getSectionByView(element);
    var top = element.offset().top;
    var bottom = top + element.height();
    if (scroll >= top && scroll <= bottom && section != currentSection && !isNotSection(element)) {
      currentSection = section;
      return true;
    }
    return false;
  }

  function animateToActiveView(activeView, discount) {
    $(bodyScrollElement).animate({
      scrollTop : activeView.offset().top - discount
    }, animationTime, function() {
    });
  }

  function goToSection(element, discount) {
    changePageMetaData(element);
    changePageUrl(element);
    changeActiveMenu(element);
    animateToActiveView(element, discount);
  }

  function changeActiveMenu(element) {
    var activeLink = $('#navbar li a[href="#' + getSectionByView(element) + '"]');
    $('#navbar li, #navbar li a').removeClass('active');
    activeLink.addClass('active');
    activeLink.closest('li').addClass('active');
  }

  /**
   * Forces the page scroll to the active section. It uses the url path or hash
   * to determine the current section.
   * 
   * @param discount(optional) - Used to reduce a parte of scroll when needed
   */
  function goToActiveSection(discount) {
    if (typeof discount === 'undefined') {
      discount = 0;
    }

    var activeView = getActiveView();
    goToSection(activeView, discount);
  }

  /**
   * Remove default history scroll restoration.
   * 
   * @see https://developers.google.com/web/updates/2015/09/history-api-scroll-restoration
   */
  function setScrollRestoration(val) {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = val;
    }
  }

  function changePageMetaDataOnScoll() {
    // Change .view-pfe-pages to your view class.
    var views = $('.view-ipd-facts-section-view > .view-content > .views-row');
    $(window).on('scroll', function() {
      if (!$(bodyScrollElement).is(':animated')) {
        views.each(function() {
          if (isInNewSection($(this))) {
            changePageMetaData($(this));
            changePageUrl($(this));
            changeActiveMenu($(this))
          }
        });
      }
    });
  }

  function changePageMetaDataOnPopstate() {
    $(window).on('popstate', function(e) {
      e.preventDefault();
      goToActiveSection(getHeaderHeight());
    });
  }

  function changePageMetaDataOnMenuClick() {
    $('#navbar li:not(.icon) a, .link-section a').on('click', function(e) {
      var section = getSectionObjectByHash($(this).attr('href'));
      var view = getViewBySection(section);
      goToSection(view, getHeaderHeight());
      e.preventDefault();
    });
  }

  /**
   * The meta datas are not used on this specific site but ples don't remove
   * this function
   */
  function changePageMetaData(element) {
    // These fields must be added in the TPL for the script to work.
    /**
     * var title = $(element).find('.metatag-title').length > 0 ?
     * $(element).find('.metatag-title').html() : ''; var description =
     * $(element).find('.metatag-description').length > 0 ?
     * $(element).find('.metatag-description').html() : '';
     * $('title').html(title.trim());
     * $('meta[name=description]').attr('content', description.trim());
     */
  }

  function changePageUrl(element) {
    var title = getSectionByView(element);
    if (title != '' && history.pushState) {
      var id = '#' + title;
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
})(jQuery);
