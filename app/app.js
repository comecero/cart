var app = angular.module("checkout", ['ngRoute', 'ngSanitize', 'ui.bootstrap', 'angular-loading-bar', 'gettext', 'duScroll']);

app.config(['$httpProvider', '$routeProvider', '$locationProvider', '$provide', 'cfpLoadingBarProvider', function ($httpProvider, $routeProvider, $locationProvider, $provide, cfpLoadingBarProvider) {

    // Determine the layout
    var layout = "two-column";
    if (window.__settings && window.__settings.style && window.__settings.style.layout) {
        layout = window.__settings.style.layout;
    }

    // Define routes
    $routeProvider.when("/cart", { templateUrl: "app/pages/cart/cart-" + layout + ".html", reloadOnSearch: false });
    $routeProvider.when("/invoice", { templateUrl: "app/pages/invoice/invoice-" + layout + ".html", reloadOnSearch: false });
    $routeProvider.when("/review/:id", { templateUrl: "app/pages/review/review-" + layout + ".html" });
    $routeProvider.when("/receipt/:id", { templateUrl: "app/pages/receipt/receipt-" + layout + ".html" });
    $routeProvider.when("/", { templateUrl: "app/pages/products/products-" + layout + ".html" });

    // Non-handled routes.
    var notFoundUrl = window.__settings.app.not_found_url;

    if (notFoundUrl == null) {
        notFoundUrl = window.__settings.app.main_shopping_url;
    }

    if (notFoundUrl == null) {
        // The root of the app
        notFoundUrl = window.location.href.substring(0, window.location.href.indexOf("#")) + "#/";
    }

    $routeProvider.otherwise({
        redirectTo: function () {
            window.location.replace(notFoundUrl);
        }
    });

    // Loading bar https://github.com/chieffancypants/angular-loading-bar A global loading bar when HTTP requests are being made so you don't have to manually trigger spinners on each ajax call.
    cfpLoadingBarProvider.latencyThreshold = 300;
    cfpLoadingBarProvider.includeSpinner = false;

    // Set the favicon
    var favicon = document.createElement("link");
    favicon.setAttribute("rel", "icon");
    favicon.setAttribute("type", "image/x-icon");

    if (window.__settings.style.favicon_full) {
        favicon.setAttribute("href", window.__settings.style.favicon_full);
    } else {
        favicon.setAttribute("href", "images/default_favicon.png");
    }

    document.head.appendChild(favicon);

}]);

// Bootstrap settings
app.run(['$rootScope', 'SettingsService', function ($rootScope, SettingsService) {

    // This defines the languages supported by the app. Each supported language must have an associated translation file in the languages folder. It ain't magic.

    var settings = SettingsService.get();

    if (settings.app.enable_languages) {
        $rootScope.languages = [
            {
                code: "en",
                name: "English"
            },
            {
                code: "cs",
                name: "Čeština"
            },
            {
                code: "de",
                name: "Deutsche"
            },
            {
                code: "el",
                name: "Ελληνικά"
            },
            {
                code: "es",
                name: "Español"
            },
            {
                code: "fi",
                name: "Suomalainen"
            },
            {
                code: "fr",
                name: "Français"
            },
            {
                code: "it",
                name: "Italiano"
            },
            {
                code: "ja",
                name: "日本語"
            },
            {
                code: "ko",
                name: "한국어"
            },
            {
                code: "nl",
                name: "Nederlands"
            },
            {
                code: "pl",
                name: "Polskie"
            },
            {
                code: "pt",
                name: "Português"
            },
            {
                code: "ru",
                name: "Русский"
            },
            {
                code: "sv",
                name: "Svenska"
            },
            {
                code: "zh-CN",
                name: "中文"
            }
        ]
    }

    // Analytics. Watch for route changes and load analytics accordingly.
    $rootScope.$on('$locationChangeSuccess', function () {
        if (window.__pageview && window.__pageview.recordPageLoad) {
            window.__pageview.recordPageLoad();
        }
    });

}]);


