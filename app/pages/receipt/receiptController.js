app.controller("ReceiptController", ['$scope', '$routeParams', 'PaymentService', 'OrderService', 'SettingsService', 'HelperService', '$document', function ($scope, $routeParams, PaymentService, OrderService, SettingsService, HelperService, $document) {

    // Define a place to hold your data
    $scope.data = {};

    // Load in some helpers
    $scope.helpers = HelperService;

    $scope.data.params = {};
    $scope.data.params.expand = "payment_method,payment_method.data,order.customer,order.items.product,order.items.subscription,order.options,cart.options,invoice.options";
    $scope.data.params.show = "payment_method.*,payment_method.data.*,date_created,order.order_id,order.subtotal,order.total,order.tax,order.discount,order.currency,order.customer.name,order.tax_inclusive,order.customer.customer_id,order.customer.email,order.customer.username,order.customer.billing_address.*,order.items.item_id,order.items.quantity,order.items.price,order.items.price_original,order.items.subtotal,order.items.subtotal_original,order.items.total,order.items.total_original,order.items.name,order.items.subscription.description,order.items.type,order.items.license_pending,order.shipping_item.quantity,order.shipping_item.name,order.shipping_item.price,order.shipping_item.price_original,order.shipping_item.subtotal,order.shipping_item.subtotal_original,order.shipping_item.total,order.shipping_item.total_original,order.items.product.images.link_square,order.items.product.images.link_small,order.options.customer_optional_fields,order,cart.options.*,invoice.options.customer_optional_fields";

    if (SettingsService.get().app.show_digital_delivery == true) {
        $scope.data.params.expand += ",order.items.download,order.items.license";
        $scope.data.params.show += ",order.items.item_id,order.items.license.html,order.items.license.label,order.items.download.link";
    }

    $scope.data.params.options = true;
    $scope.data.params.formatted = true;

    // A customer object if the user creates an account
    $scope.customer = {};

    // A variable that indicates if any of the products are digital
    $scope.awaitingLicense = false;

    // Get the payment, if any.
    PaymentService.get($routeParams.id, $scope.data.params).then(function (payment) {

        // Only display images if all items in the sale have images
        $scope.showImages = false;
        var hasImageCount = 0;
        _.each(payment.order.items, function (item) {
            if (item.product != null) {
                if (item.product.images.length > 0) {
                    hasImageCount++;
                    if ($scope.settings.app.use_square_images) {
                        item.image_link = item.product.images[0].link_square;
                    } else {
                        item.image_link = item.product.images[0].link_small;
                    }
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

            if (_.where($scope.data.payment.order.items, { type: "digital", license: null, download: null }).length == 0) {
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

    // Watch for error to be populated, and if so, scroll to it.
    $scope.$watch("data.error", function (newVal, oldVal) {
        if ($scope.data.error) {
            $document.scrollTop(0, 500);
        }
    });

}]);