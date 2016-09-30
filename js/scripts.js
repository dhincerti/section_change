(function($) {
  $(document).ready(function() {
    $('.view-section-change').sectionChange({
      onlyHash : false,
      linksSelector : '.linkTest',
      discount : function() {
        return $('#admin-menu-wrapper').outerHeight();
      }
    });
  });
})(jQuery);
