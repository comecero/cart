app.controller("CartController", ['$scope', '$location', 'CartService', 'GeoService', 'CurrencyService', 'SettingsService', 'HelperService', '$document', '$timeout', '$uibModal', function ($scope, $location, CartService, GeoService, CurrencyService, SettingsService, HelperService, $document, $timeout, $uibModal) {

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
    $scope.data.params.expand = "items.product,items.subscription_terms,customer.payment_methods,options";

    if ($scope.settings.app.cross_sell_items && Number($scope.settings.app.cross_sell_items)) {
        $scope.data.params.expand += ",cross_sells.product";
    }

    if ($scope.settings.app.upsell_trigger && $scope.settings.app.upsell_trigger != "disable") {
        $scope.data.params.expand += ",up_sells.product,up_sells.up_sell_from_product";
    }

    $scope.data.params.hide = "items.product.prices,items.product.url,items.product.description,items.product.images.link_medium,items.product.images.link_large,items.product.images.link,items.product.images.filename,items.product.images.formatted,items.product.images.url,items.product.images.date_created,items.product.images.date_modified";

    // Set default values.
    $scope.data.shipping_is_billing = true; // User can toggle.

    // Build your payment method models
    $scope.data.credit_card = { "type": "credit_card" };
    $scope.data.amazon_pay = { "type": "amazon_pay" };
    $scope.data.paypal = {
        "type": "paypal",
        data: {
            // The following tokens are allowed in the URL: {{payment_id}}, {{order_id}}, {{customer_id}}, {{invoice_id}}. The tokens will be replaced with the actual values upon redirect.
            "success_url": window.location.href.substring(0, window.location.href.indexOf("#")) + "#/review/{{payment_id}}",
            "cancel_url": window.location.href.substring(0, window.location.href.indexOf("#")) + "#/cart"
        }
    }

    // Set the default selected payment method.
    $scope.data.payment_method = $scope.data.credit_card;

    // Get the current cart
    CartService.get().then(function (cart) {

        // Build up any items from the query string, if provided. This loads in products, quantities and other data (such as customer name, email address) that may have been supplied through the query string. If nothing is provided in the query string, then no values are supplied to the cart.
        cart = CartService.fromParams(cart, $location);

        // Define the updateCart function. There might not be a cart at this point; if not, the CartService.update process will create and return a new cart for the user.
        var updateCart = function (cart) {

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

                // Open the upsell, if configured.
                if ($scope.settings.app.upsell_trigger == "cart_load") {
                    openUpsell($scope.settings.app.upsell_type, $scope.settings.app.upsell_trigger, $scope.settings.app.upsell_delay);
                }

            }, function (error) {
                // Error updating the cart
                $scope.data.error = error;

                // If you get an invalid inventory response, show an error and re-run the request with an adjustment.
                if (error.code == "insufficient_inventory") {
                    var item = _.find(cart.items, function (item) { return item.product_id == error.meta.product_id });
                    item.quantity = error.meta.max_quantity;
                    updateCart(cart);
                }

                if (error.code == "unavailable_inventory") {
                    cart.items = _.reject(cart.items, function (item) { return item.product_id == error.meta.product_id });
                    updateCart(cart);
                }

            });
        }

        // Run the function
        updateCart(cart);

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
                if (item.quantity > 0)
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

            var updateCart = function (cart, quantityErrorReplay) {
                CartService.update($scope.data.cart, $scope.data.params).then(function (cart) {
                    $scope.data.cart = cart;
                    setShowImages($scope.data.cart);
                    if (!quantityErrorReplay) {
                        $scope.data.error = null;
                    }
                }, function (error) {
                    // Error updating the cart
                    $scope.data.error = error;

                    // If you get an invalid inventory response, show an error and re-run the request with an adjustment.
                    if (error.code == "insufficient_inventory") {
                        var item = _.find(cart.items, function (item) { return item.product_id == error.meta.product_id });
                        item.quantity = error.meta.max_quantity;
                        updateCart(cart, true);
                    }

                    if (error.code == "unavailable_inventory") {
                        cart.items = _.reject(cart.items, function (item) { return item.product_id == error.meta.product_id });
                        updateCart(cart, true);
                    }

                });
            }

            updateCart($scope.data.cart);

        }, 0);

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

    $scope.showElectronicDelivery = function (cart, item) {

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

    $scope.onPaymentValidationSuccess = function () {
        if ($scope.settings.app.upsell_trigger == "payment_submit" && $scope.data.cart.up_sells && $scope.data.cart.up_sells.data && $scope.data.cart.up_sells.data.length && utils.getCookie("upsell-" + $scope.data.cart.cart_id) == null) {
            openUpsell($scope.settings.app.upsell_type, $scope.settings.app.upsell_trigger);
            return false; // Return false to tell the submit-payment directive to stop processing.
        }
    }

    var upsellTimeout;
    function openUpsell(type, trigger, delay) {

        // Don't launch if disabled
        if (!type) {
            return;
        }

        // Don't launch if no upsell is available
        if (!$scope.data.cart.up_sells || !$scope.data.cart.up_sells.total_items)
        {
            return;
        }

        // Don't show if we've already displayed an upsell for this cart recently.
        if (utils.getCookie("upsell-" + $scope.data.cart.cart_id) != null) {
            return;
        }

        // Set a cookie so we don't show it again for a while.
        utils.setCookie("upsell-" + $scope.data.cart.cart_id, true, 60);

        if (!delay)
            delay = 0;

        delay = delay * 1000;

        var templateUrl = "app/templates/upsell-" + type;
        if (trigger == "cart_load") {
            templateUrl += "-load";
        }
        templateUrl += ".html";

        upsellTimeout = $timeout(function () {
            $scope.upsellModal = $uibModal.open({
                size: "md",
                templateUrl: templateUrl,
                scope: $scope
            });
        }, delay);

    }

    $scope.closeUpsell = function () {
        if ($scope.upsellModal)
            $scope.upsellModal.dismiss();
    }

    $scope.commitUpsellAndPay = function (upsell, elementId) {

        if (elementId) {
            var elem = document.getElementById(elementId);
            if (elem)
                elem.disabled = true;
        }

        // Make a copy of the cart
        var cartCopy = angular.copy($scope.data.cart);

        // Define the item that triggered the upsell offer.
        var triggerItem = _.find($scope.data.cart.items, function (i) { return i.item_id == upsell.up_sell_from_product.product_id });

        // Add the upsell item to the cart, using the quantity from the trigger item. Add the upsell ID to get the discount.
        cartCopy.items.push({ product_id: upsell.product_id, up_sell_id: upsell.up_sell_id, quantity: triggerItem.quantity });

        // Remove the trigger item from the cart.
        cartCopy.items = _.reject(cartCopy.items, function (item) { return item.product_id == triggerItem.product_id });

        CartService.pay(cartCopy, $scope.data.payment_method, null, $scope.data.params).then(function (payment) {
            $scope.data.cart = cartCopy;
            $scope.onPaymentSuccess(payment);
            $scope.closeUpsell();
        }, function (error) {
            $scope.data.cart = cartCopy;
            $scope.data.error = error;
        });
    }

    $scope.commitUpsell = function (upsell) {

        // Make a copy of the cart
        var cartCopy = angular.copy($scope.data.cart);

        // Define the item that triggered the upsell offer.
        var triggerItem = _.find($scope.data.cart.items, function (i) { return i.item_id == upsell.up_sell_from_product.product_id });

        // Add the upsell item to the cart, using the quantity from the trigger item. Add the upsell ID to get the discount.
        cartCopy.items.push({ product_id: upsell.product_id, up_sell_id: upsell.up_sell_id, quantity: triggerItem.quantity });

        // Remove the trigger item from the cart.
        cartCopy.items = _.reject(cartCopy.items, function (item) { return item.product_id == triggerItem.product_id });

        CartService.update(cartCopy, $scope.data.params).then(function (cart) {
            $scope.data.cart = cart;
            $scope.closeUpsell();
        }, function (error) {
            $scope.data.error = error;
        });
    }

    // Watch for error to be populated, and if so, scroll to it.
    $scope.$watch("data.error", function (newVal, oldVal) {
        if ($scope.data.error) {
            $scope.closeUpsell();
            $document.scrollTop(0, 500);
        }
    });

    // Keep the customer billing address name in sync with the customer name. We only ask for the customer name, so this makes sure the two are 
    $scope.$watch("data.cart.customer.name", function (newVal, oldVal) {
        if ($scope.data.cart && $scope.data.cart.customer) {
            $scope.data.cart.customer.billing_address.name = newVal;
        }
    });

    // Watch for the payment method to switch, and set the payment method data accordingly.
    $scope.$watch("options.payment_method", function (newVal, oldVal) {
        if (newVal) {
            $scope.data.payment_method = $scope.data[newVal];
        }
    });

    // Clear any pending timeouts, otherwise they may trigger when you change pages
    $scope.$on("$destroy", function () {
        if (angular.isDefined(updateBuffer))
            $timeout.cancel(updateBuffer);

        if (angular.isDefined(upsellTimeout))
            $timeout.cancel(upsellTimeout);
    });

}]);