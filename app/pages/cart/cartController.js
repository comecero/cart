app.controller("CartController", ['$scope', '$location', 'CartService', 'GeoService', 'CurrencyService', 'SettingsService', 'HelperService', '$document', '$timeout', function ($scope, $location, CartService, GeoService, CurrencyService, SettingsService, HelperService, $document, $timeout) {

    // Define a place to hold your data and functions
    $scope.data = {};

    // Load in the default payment method
    $scope.options = { "payment_method": "credit_card" };

    // Load in some helpers
    $scope.geoService = GeoService;
    $scope.settings = SettingsService.get();
    $scope.helpers = HelperService;

    // Set the cart parameters
    $scope.data.params = {};
    $scope.data.params.expand = "items.product,items.subscription_terms,customer.payment_methods,options,cross_sells.product";
    $scope.data.params.hide = "items.product.formatted,items.product.prices,items.product.url,items.product.description,items.product.images.link_medium,items.product.images.link_large,items.product.images.link,items.product.images.filename,items.product.images.formatted,items.product.images.url,items.product.images.date_created,items.product.images.date_modified";

    // Set default values.
    $scope.data.shipping_is_billing = true; // User can toggle.

    // Build your payment method models
    $scope.data.payment_method = { "type": "credit_card" };
    $scope.data.amazon_pay = { "type": "amazon_pay" };
    $scope.data.paypal = {
        "type": "paypal",
        data: {
            // The following tokens are allowed in the URL: {{payment_id}}, {{order_id}}, {{customer_id}}, {{invoice_id}}. The tokens will be replaced with the actual values upon redirect.
            "success_url": window.location.href.substring(0, window.location.href.indexOf("#")) + "#/review/{{payment_id}}",
            "cancel_url": window.location.href.substring(0, window.location.href.indexOf("#")) + "#/cart"
        }
    }

    // Get the current cart
    CartService.get().then(function (cart) {

        // Build up any items from the query string, if provided. This loads in products, quantities and other data (such as customer name, email address) that may have been supplied through the query string. If nothing is provided in the query string, then no values are supplied to the cart.
        cart = CartService.fromParams(cart, $location);

        // Update the cart. There might not be a cart at this point; if not, the CartService.update process will create and return a new cart for the user.
        CartService.update(cart, $scope.data.params, false, true).then(function (cart) {

            // Set the scope on the cart.
            $scope.data.cart = cart;

            // Only display images if all items in the cart have images
            setShowImages($scope.data.cart);

            // If there is a shipping address line 1, set shipping_is_billing to false so the user will see what's provided in the shipping address.
            $scope.data.shipping_is_billing = !HelperService.hasShippingAddress(cart.customer);

            // If there are payment methods, set the default onto the payment method object
            var data = ((cart.customer || {}).payment_methods || {}).data;
            if (data) {
                if (data.length > 0) {
                    $scope.data.payment_method = { payment_method_id: _.find(cart.customer.payment_methods.data, function (payment_method) { return payment_method.is_default == true }).payment_method_id };
                }
            }

        }, function (error) {
            // Error updating the cart
            $scope.data.error = error;
        });

    }, function (error) {
        // Error getting the cart
        $scope.data.error = error;
    });

    // Handle quantity changes
    var updateBuffer;
    $scope.changeQuantity = function (item, direction, quantity) {

        // Put the requests in a buffer so that if several successive requests are made only the last one is sent.
        if (updateBuffer) {
            $timeout.cancel(updateBuffer);
        }

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
            $scope.data.cart.items = _.reject($scope.data.cart.items, function (i) { return i.item_id == item.item_id });
        }

        // Clear error if no items in the cart
        if ($scope.data.cart.items.length == 0) {
            $scope.data.error = null;
        }

        updateBuffer = $timeout(function () {

            CartService.update($scope.data.cart, $scope.data.params).then(function (cart) {
                $scope.data.cart = cart;
                setShowImages($scope.data.cart);
            }, function (error) {
                // Error updating the cart
                $scope.data.error = error;
            });

        }, 500);

    }

    // Handle a successful payment
    $scope.onPaymentSuccess = function (payment) {

        if (payment.payment_method.type == "paypal" && payment.status == "initiated") {
            // If PayPal and status is initiated, redirect to PayPal for approval.
            window.location = payment.response_data.redirect_url;
        } else if (payment.payment_method.type == "amazon_pay") {
            // If Amazon Pay, redirect for review
            $location.path("/review/" + payment.payment_id);
        } else {
            // A successful card payment. Redirect to the receipt.
            $location.path("/receipt/" + payment.payment_id);
        }

    }

    // If the user logs out
    $scope.onSignOut = function () {
        if ($scope.data.payment_method) {
            $scope.data.payment_method.payment_method_id = null;
            $scope.data.payment_method.type = "credit_card";
        }
    }

    $scope.setPaymentMethod = function (id, type) {

        // Remove all data from the payment method
        $scope.data.payment_method = {};

        // If a payment_method_id or type is provided, set it.
        if (id)
            $scope.data.payment_method.payment_method_id = id;

        if (type)
            $scope.data.payment_method.type = type;

    }

    function setShowImages(cart) {
        // Only display images if all items in the cart have images
        $scope.showImages = true;
        _.each(cart.items, function (item) {
            if (item.product.images.length == 0) {
                $scope.showImages = false;
            }
        });
    }

    $scope.showElectronicDelivery = function(cart, item) {

        // If there's only one item in the cart and there's a shipping item, we'll show the delivery method, regardless of any other setting.
        if (cart.items.length == 1 && cart.shipping_item) {
            return false;
        }

        if (item.product.type == "digital") {
            return true;
        }

        if (item.product.type == "service" && (item.product.has_file || item.product.has_license_service)) {
            return true;
        }

        return false;

    }

    $scope.showPhysicalDelivery = function (cart, item) {

        // If a physical product and a shipping item, show.
        if (item.product.type == "physical" && cart.shipping_item) {
            return true;
        }

        return false;
    }


    // Watch for error to be populated, and if so, scroll to it.
    $scope.$watch("data.error", function (newVal, oldVal) {
        if ($scope.data.error) {
            $document.scrollTop(0, 500);
        }
    });

}]);