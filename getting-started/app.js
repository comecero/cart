var app = angular.module("gettingStarted", ['ngRoute', 'ngSanitize', 'gettext']);

app.config(['$httpProvider', '$routeProvider', '$locationProvider', '$provide', function ($httpProvider, $routeProvider, $locationProvider, $provide) {

    // Define routes
    $routeProvider.when("/docs", { templateUrl: "../getting-started/docs.html", reloadOnSearch: false, title: "Getting Started - Shopping Cart" });
    $routeProvider.when("/link-builder", { templateUrl: "../getting-started/link-builder.html", reloadOnSearch: false, title: "Link Builder - Shopping Cart" });

    // Load highlight.js
    hljs.initHighlightingOnLoad();

    // Set the favicon
    var faviconUrl = "images/favicon.ico";
    if (window.__settings.style.favicon_full) {
        faviconUrl = window.__settings.style.favicon_full;
    }

    var favicon = document.createElement("link");
    favicon.setAttribute("rel", "icon");
    favicon.setAttribute("type", "image/x-icon");
    favicon.setAttribute("href", faviconUrl);
    document.head.appendChild(favicon);

}]);

app.run(['$rootScope', function ($rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
    });
}]);


