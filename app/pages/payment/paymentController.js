app.controller("PaymentController", ['$scope', '$location', '$routeParams', 'CartService', 'PaymentService', 'SettingsService', 'HelperService', 'GeoService', '$document', function ($scope, $location, $routeParams, CartService, PaymentService, SettingsService, HelperService, GeoService, $document) {
        
        // Define a place to hold your data
        $scope.data = {};
        $scope.options = {};
        
        
        // Parse the query parameters
        var query = $location.search();
        
        // Define the payment_id
        $scope.data.payment_id = $routeParams.id;
        
        // If no payment_id is supplied, redirect back to the cart.
        if (!$scope.data.payment_id) {
            // Redirect back to the cart
            $location.path("/cart");
        }
        
        // Load in some helpers
        $scope.settings = SettingsService.get();
        $scope.helpers = HelperService;
        $scope.geoService = GeoService;
        
        // Set the cart parameters
        $scope.data.params = {};
        
        // The payment will have a cart or an invoice, we don't know which. Expand both and we'll use whatever one comes back as not null.
        $scope.data.params.expand = "cart.items.product,cart.items.subscription_terms,invoice.items.product,invoice.items.subscription_terms,cart.options,invoice.options";
        $scope.data.params.hide = "cart.items.product.formatted,cart.items.product.prices,cart.items.product.url,cart.items.product.description,cart.items.product.images.link_medium,cart.items.product.images.link_large,cart.items.product.images.link,cart.items.product.images.filename,cart.items.product.images.formatted,cart.items.product.images.url,cart.items.product.images.date_created,cart.items.product.images.date_modified,invoice.items.product.formatted,invoice.items.product.prices,invoice.items.product.url,invoice.items.product.description,invoice.items.product.images.link_medium,invoice.items.product.images.link_large,invoice.items.product.images.link,invoice.items.product.images.filename,invoice.items.product.images.formatted,invoice.items.product.images.url,invoice.items.product.images.date_created,invoice.items.product.images.date_modified";
        
        // Set the cart params for your shipping dropdown directive. They are the same as above, but you have to remove the "cart" and "invoice" prefixes. We'll also have a bunch of duplicates after stripping the prefix, so we'll remove them.
        $scope.data.saleParams = { expand: utils.deDuplicateCsv($scope.data.params.expand.replaceAll("cart.", "").replaceAll("invoice.", "")), hide: utils.deDuplicateCsv($scope.data.params.hide.replaceAll("cart.", "").replaceAll("invoice.", "")) };
        
        PaymentService.get($scope.data.payment_id, $scope.data.params).then(function (payment) {
            
            if (payment.status == "completed") {
                // The payment was previously completed, redirect to receipt.
                $location.path("/receipt/" + payment.payment_id);
            }
            
            // Get the cart or invoice that the payment is associated with
            $scope.data.sale = payment.cart || payment.invoice;
            if (payment.cart) {
                $scope.options.isCartPayment = true;
            }

            // Only display images if all items in the sale have images
            $scope.showImages = false;
            var hasImageCount = 0;
            _.each($scope.data.sale.items, function (item) {
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

            if (hasImageCount == $scope.data.sale.items.length) {
                $scope.showImages = true;
            }
            
            // Set flags to indicate if we need to request the company name and phone number fields, which happens when they're required and not already populated.
            if (HelperService.isRequiredCustomerField('company_name', $scope.data.sale.options) && $scope.data.sale.customer.company_name == null) {
                $scope.options.showCompanyName = true;
            }
            
            if (HelperService.isRequiredCustomerField('phone', $scope.data.sale.options) && $scope.data.sale.customer.phone == null) {
                $scope.options.showPhone = true;
            }

        }, function (error) {
            $scope.data.error = error;
        });
        
        // Handle a successful payment
        $scope.onPaymentSuccess = function (payment) {
            
            // If the payment comes back as initiated, it means significant changes to the cart have been done that has changed the payment amount significantly enough that the buyer must re-approve the total through PayPal. Redirect.
            if (payment.status == "initiated") {
                
                // Redirect to the supplied redirect URL.
                window.location.replace(payment.response_data.redirect_url);

            } else {
                
                // The payment is completed. Redirect to the receipt.
                $location.path("/receipt/" + payment.payment_id);

            }
        }
        
        // Watch for error to be populated, and if so, scroll to it.
        $scope.$watch("data.error", function (newVal, oldVal) {
            if ($scope.data.error) {
                $document.scrollTop(0, 500);
            }
        });

    }]);
