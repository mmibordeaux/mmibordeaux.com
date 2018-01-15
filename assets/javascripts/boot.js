(function($) {
    "use strict";
    $(document).ready(function() {
        var $page = $('body');
        var config = {
          dependencyPath: {
            plugin: 'javascripts/'
          }
        }
        var application = new Tc.Application($page, config);
        application.registerModules();
        application.start();
    });
})(Tc.$);