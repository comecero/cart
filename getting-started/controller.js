app.controller("DocsController", ['$scope', 'PaymentService', 'SettingsService', 'ProductService', function ($scope, PaymentService, SettingsService, ProductService) {

    $scope.data = {};
    $scope.settings = SettingsService.get();

    // Set the app URL for the snippet example
    var path = window.location.pathname.substring(1);
    path = path.substring(0, path.indexOf("/"));
    $scope.data.src = window.location.protocol + "//" + window.location.hostname + "/" + path;

    $scope.data.test = false;

    // Get the payment options
    PaymentService.getOptions().then(function (options) {
        $scope.data.options = options;
    });

}]);

app.controller("LinkBuilderController", ['$scope', 'PaymentService', 'SettingsService', '$httpParamSerializer', 'ProductService', function ($scope, PaymentService, SettingsService, $httpParamSerializer, ProductService) {

    $scope.data = {};
    $scope.link = {};
    $scope.meta = [];
    $scope.functions = {};
    $scope.options = { amount: "none" };
    $scope.settings = SettingsService.get();
    var pageSize = 10;

    // Set the app URL for the snippet example
    var path = window.location.pathname.substring(1);
    path = path.substring(0, path.indexOf("/"));
    $scope.data.src = window.location.protocol + "//" + window.location.hostname + "/" + path;

    $scope.data.test = false;
    $scope.link.empty_cart = false;

    // Get some products
    loadDefaultProducts();

    // Get the payment options
    PaymentService.getOptions().then(function (options) {
        $scope.data.options = options;
        $scope.data.options.currencies.unshift({ code: null, name: "Automatically selected" });
        $scope.link.currency = null;
    });

    $scope.functions.search = function () {

        if (!$scope.data.q) {
            loadDefaultProducts();
            return;
        }

        ProductService.getList({ q: $scope.data.q, show: "name,product_id,price,currency,images.*", expand: "images", limit: pageSize, hidden: null }).then(function (list) {
            $scope.products = list;
        }, function (error) {
            $scope.data.error = error;
        });

    };

    $scope.functions.addProduct = function (product) {
        $scope.data.addedProducts = $scope.data.addedProducts || [];

        if (_.where($scope.data.addedProducts, { product_id: product.product_id }).length == 0) {
            product.quantity = 1;
            $scope.data.addedProducts.push(product);
        }

        setShowImages();

    }

    $scope.functions.removeProduct = function (product) {

        $scope.data.addedProducts = $scope.data.addedProducts || [];
        $scope.data.addedProducts = _.reject($scope.data.addedProducts, function (p) { return p.product_id == product.product_id });
        setShowImages();

    }

    // Handle quantity changes
    $scope.functions.changeQuantity = function (item, direction, quantity) {

        if (direction) {
            // Change the item quantity by one.
            if (direction == "+") {
                item.quantity++;
            } else {
                item.quantity--;
            }
        } else if (quantity !== null) {
            item.quantity = quantity;
        }

        // If the quantity is 0, remove the item from the model immediately
        if (item.quantity == 0) {
            $scope.data.addedProducts = _.reject($scope.data.addedProducts, function (i) { return i.product_id == item.product_id });
            setShowImages();
        }

    }

    function setShowImages() {
        // If all items have images, show images.
        $scope.showImages = true;
        _.each($scope.data.addedProducts, function (product) {
            if (product.images.length == 0) {
                $scope.showImages = false;
            }
        });
    }

    function loadDefaultProducts() {
        ProductService.getList({ q: $scope.data.q, show: "name,product_id,price,currency,images.*", expand: "images", limit: pageSize, hidden: null }).then(function (products) {
            $scope.products = products;
        }, function (error) {
            $scope.data.error = error;
        });
    }

    $scope.functions.getLink = function () {

        var base = $scope.data.src + "/#/cart"
        var params = {};

        // Add the products
        _.each($scope.data.addedProducts, function (product) {
            params["product_id:" + product.product_id] = product.quantity;
        });

        // Even if advanced options are provided, only add them to the link if it's shown.
        if ($scope.showAdvancedOptions) {
            params.currency = $scope.link.currency;
            params.referrer = $scope.link.referrer;
            params.promotion_code = $scope.link.promotion_code;
            params.empty_cart = $scope.link.empty_cart;

            // Customer info
            params.name = $scope.link.name;
            params.email = $scope.link.email;
            params.company_name = $scope.link.company_name;

            // Custom data
            for (var i = 0; i < $scope.meta.length; i++) {
                if ($scope.meta[i].value) {
                    params[$scope.meta[i].name.trim()] = $scope.meta[i].value.trim();
                }
            }

            // Remove anything that is blank or null
            for (var property in params) {
                if (params.hasOwnProperty(property)) {
                    if (!params[property]) {
                        delete params[property];
                    }
                }
            }
        }

        var qs = $httpParamSerializer(params);

        if (qs.length) {
            $scope.url = base + "?" + qs;
        } else {
            $scope.url = base;
        }

        // Set up clipboard.js
        var clipboard = new Clipboard('.clipboard');

        clipboard.on('success', function (e) {
            e.clearSelection();
        });

    }

    $scope.functions.reset = function () {

        $scope.link = { currency: null, empty_cart: false };
        $scope.meta = [];
        $scope.url = null;
        $scope.data.addedProducts = null;
        $scope.data.q = null;
        $scope.showAdvancedOptions = false;
        loadDefaultProducts();
    }

    $scope.functions.removeMeta = function (index) {
        $scope.meta.splice(index, 1);
    }

    $scope.movePage = function (direction) {
        var offset;
        if (direction == "+") {
            offset = $scope.products.next_page_offset;
        } else {
           offset = $scope.products.previous_page_offset;
        }

        ProductService.getList({ q: $scope.data.q, show: "name,product_id,price,currency,images.*", expand: "images", limit: pageSize, offset: offset , hidden: null }).then(function (products) {
            $scope.products = products;
        }, function (error) {
            $scope.data.error = error;
        });

    }

    // Watch if link or meta changes. If so, reset URL
    $scope.$watch("[link, meta, data.addedProducts]", function (oldVal, newVal) {

        if (newVal !== oldVal && url) {
            $scope.url = null;
        }

    }, true);

}]);