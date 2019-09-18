app.controller("ReceiptController", ['$scope', '$routeParams', 'PaymentService', 'OrderService', 'SettingsService', 'HelperService', '$document', '$interpolate', function ($scope, $routeParams, PaymentService, OrderService, SettingsService, HelperService, $document, $interpolate) {

    // Define a place to hold your data
    $scope.data = {};

    // Load in some helpers
    $scope.helpers = HelperService;
    $scope.settings = SettingsService.get();

    $scope.data.params = {};
    $scope.data.params.expand = "payment_method,payment_method.data,order.customer,order.items.product,order.items.subscription_terms,order.options,cart.options,invoice.options";

    if (SettingsService.get().app.show_digital_delivery == true) {
        $scope.data.params.expand += ",order.items.download,order.items.license";
    }

    $scope.data.params.options = true;
    $scope.data.params.formatted = true;

    // A customer object if the user creates an account
    $scope.customer = {};

    // A variable that indicates if any of the products are digital
    $scope.awaitingLicense = false;

    // Get the payment, if any.
    PaymentService.get($routeParams.id, $scope.data.params).then(function (payment) {

        if (payment.order && $scope.settings.app.receipt_redirect_url) {
            var url = compileUrl($scope.settings.app.receipt_redirect_url, payment);
            if (url) {
                window.location.replace(url, payment);
            }
        }

        // Only display images if all items in the sale have images
        $scope.showImages = false;
        var hasImageCount = 0;
        _.each(payment.order.items, function (item) {
            if (item.product != null) {
                if (item.product.images.length > 0) {
                    hasImageCount++;
                }
            }
        });

        if (hasImageCount == payment.order.items.length) {
            $scope.showImages = true;
        }

        // Set the options to determine if you ask for the customer to create an account
        if (payment.cart) {
            $scope.options = payment.cart.options;
        } else {
            $scope.options = payment.invoice.options;
        }

        // Make the payment available to the view.
        $scope.data.payment = payment;

        // Invoke the conversion. If the user reloads the receipt page the conversion code will prevent the conversion from being recorded multiple times.
        if (window.__conversion && window.__conversion.recordConversion) {
            window.__conversion.recordConversion(payment.order.order_id);
        }

        // Load unpopulated licenses as necessary.
        setTimeout(function () {
            getLicenses(payment.order.order_id);
        }, 1000);

    }, function (error) {
        $scope.exception = error;
    });

    var getLicenses = function (order_id, count) {

        // This function checks for digital items in the order that do not have licenses yet assigned. It polls the API several times to refresh the license data after the receipt is loaded.

        if (SettingsService.get().app.show_digital_delivery == false || $scope.data.payment.order == null) {
            return;
        }

        count = count || 0;

        if (_.where($scope.data.payment.order.items, { license_pending: true }).length > 0) {
            $scope.data.awaitingLicense = true;
        } else {
            $scope.data.awaitingLicense = false;
        }

        if ($scope.data.awaitingLicense == false || count > 3) {
            $scope.$apply(function () {
                $scope.data.awaitingLicense = false;
            });
            return;
        }

        var params = { show: "items.item_id,items.license.*", expand: "items.license" };
        OrderService.get(order_id, params).then(function (order) {
            // Update each of the items with the items from the newly fetched order.
            _.each(order.items, function (orderItem) {
                if (orderItem.license) {
                    _.find($scope.data.payment.order.items, function (item) { return item.item_id == orderItem.item_id }).license = orderItem.license;
                }
            });

            if (_.where($scope.data.payment.order.items, { type: "digital", license: null }).length == 0) {
                $scope.data.awaitingLicense = false;
                return;
            }

            // Try again after a delay.
            count++;
            setTimeout(function () {
                getLicenses(order_id, count);
            }, 3500)

        });
    }

    function compileUrl(urlTemplate, payment) {

        if (payment) {

            var scp = {
                payment: payment,
                order: payment.order
            }

            return $interpolate(urlTemplate)(scp);
        }

        return null;

    }

    $scope.getReceiptButtonUrl = function (url, payment) {
        if (url) {
            return compileUrl(url, payment);
        } else {
            // Return the main shopping URL or the main app URL, if not present.
            return $scope.settings.app.main_shopping_url || window.location.href.substring(0, window.location.href.indexOf("#")) + "#/";
        }
    }

    // Watch for error to be populated, and if so, scroll to it.
    $scope.$watch("data.error", function (newVal, oldVal) {
        if ($scope.data.error) {
            $document.scrollTop(0, 500);
        }
    });

}]);