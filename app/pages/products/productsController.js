app.controller("ProductsController", ['$scope', '$routeParams', '$location', '$document', 'ProductService', 'CartService', 'GeoService', 'CurrencyService', 'SettingsService', function ($scope, $routeParams, $location, $document, ProductService, CartService, GeoService, CurrencyService, SettingsService) {
        
        // Define a place to hold your data
        $scope.data = {};
        
        // Load the geo service for countries, states, provinces (used for dropdowns).
        $scope.geo = GeoService.getData();
        $scope.settings = SettingsService.get();
        
        $scope.data.params = {};
        $scope.data.params.expand = "items.product,items.subscription_terms,customer.payment_methods";
        $scope.data.params.show = "product_id,name,price,currency,description,images.*";
        $scope.data.params.currency = CurrencyService.getCurrency();
        $scope.data.params.formatted = true;
        $scope.data.params.limit = 50;
        
        // Load the products
        ProductService.getList($scope.data.params).then(function (products) {
            $scope.data.products = products;

            // Determine the image to use
            _.each($scope.data.products.data, function (product) {
                if (product.images.length) {
                    if ($scope.settings.app.use_square_images) {
                        product.image_link = product.images[0].link_square;
                    } else {
                        product.image_link = product.images[0].link_small;
                    }
                }
            });

        }, function (error) {
            $scope.data.error = error;
        });
        
        $scope.onAddToCart = function (item) {
            $location.path("/cart");
        }
        
        // Watch for error to be populated, and if so, scroll to it.
        $scope.$watch("data.error", function (newVal, oldVal) {
            if ($scope.data.error) {
                $document.scrollTop(0, 500);
            }
        });

    }]);