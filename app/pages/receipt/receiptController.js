app.controller("ReceiptController", ['$scope', '$routeParams', 'PaymentService', 'SettingsService', 'HelperService', '$document', function ($scope, $routeParams, PaymentService, SettingsService, HelperService, $document) {
        
        // Define a place to hold your data
        $scope.data = {};
        
        // Load in some helpers
        $scope.helpers = HelperService;

        $scope.data.params = {};
        $scope.data.params.expand = "payment_method,payment_method.data,order.customer,order.items.product,order.items.subscription,order.options,cart.options,invoice.options";
        $scope.data.params.show = "payment_method.*,payment_method.data.*,date_created,order.order_id,order.subtotal,order.total,order.tax,order.discount,order.currency,order.customer.name,order.tax_inclusive,order.customer.customer_id,order.customer.email,order.customer.username,order.customer.billing_address.*,order.items.item_id,order.items.quantity,order.items.price,order.items.price_original,order.items.subtotal,order.items.subtotal_original,order.items.total,order.items.total_original,order.items.name,order.items.subscription.description,order.shipping_item.quantity,order.shipping_item.name,order.shipping_item.price,order.shipping_item.price_original,order.shipping_item.subtotal,order.shipping_item.subtotal_original,order.shipping_item.total,order.shipping_item.total_original,order.items.product.images.link_square,order.options.customer_optional_fields,order,cart.options.*,invoice.options.customer_optional_fields";

        if (SettingsService.get().app.show_digital_delivery == true) {
            $scope.data.params.expand += ",order.items.download,order.items.license";
            $scope.data.params.show += ",order.items.item_id,order.items.license.html,order.items.license.label,order.items.download.link";
        }

        $scope.data.params.options = true;
        $scope.data.params.formatted = true;
        
        // A customer object if the user creates an account
        $scope.customer = {};
        
        // Get the payment, if any.
        PaymentService.get($routeParams.id, $scope.data.params).then(function (payment) {

            // Only display images if all items in the invoice have images
            $scope.showImages = false;
            var hasImageCount = 0;
            _.each(payment.order.items, function (item) {
                if (item.product != null) {
                    if (item.product.images.length == 0) {
                        hasImageCount++;
                    }
                }
            });
            
            if (hasImageCount == payment.order.items.length) {
                $scope.showImages = true;
            }

            // If we have a completed order and show digital delivery is true, slip the digital delivery items from the order into the order.
            if (SettingsService.get().app.show_digital_delivery == true && payment.order != null) {
                _.each(payment.order.items, function (item) {
                    if (item.license) {
                        _.find(payment.order.items, function (orderItem) { return orderItem.item_id == item.item_id }).license = item.license;
                    }
                    if (item.download) {
                        _.find(payment.order.items, function (orderItem) { return orderItem.item_id == item.item_id }).download = item.download;
                    }
                });
            }
            
            // Set the options to determine if you ask for the customer to create an account
            if (payment.cart) {
                $scope.options = payment.cart.options;
            } else {
                $scope.options = payment.invoice.options;
            }
            
            // Make the payment available to the view.
            $scope.data.payment = payment;

        }, function (error) {
            $scope.exception = error;
        });
        
        // Watch for error to be populated, and if so, scroll to it.
        $scope.$watch("data.error", function (newVal, oldVal) {
            if ($scope.data.error) {
                $document.scrollTop(0, 500);
            }
        });

    }]);