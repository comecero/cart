/*
Comecero Cart version: ﻿1.1.1
https://comecero.com
https://github.com/comecero/cart
Copyright Comecero and other contributors. Released under MIT license. See LICENSE for details.
*/

app.controller("CartController", ['$scope', '$location', 'CartService', 'GeoService', 'CurrencyService', 'SettingsService', 'HelperService', '$document', '$timeout', function ($scope, $location, CartService, GeoService, CurrencyService, SettingsService, HelperService, $document, $timeout) {

    // Define a place to hold your data
    $scope.data = {};

    // Load in some helpers
    $scope.geoService = GeoService;
    $scope.settings = SettingsService.get();
    $scope.helpers = HelperService;

    // Set the cart parameters
    $scope.data.params = {};
    $scope.data.params.expand = "items.product,items.subscription_terms,customer.payment_methods,options";
    $scope.data.params.hide = "items.product.formatted,items.product.prices,items.product.url,items.product.description,items.product.images.link_medium,items.product.images.link_large,items.product.images.link,items.product.images.filename,items.product.images.formatted,items.product.images.url,items.product.images.date_created,items.product.images.date_modified";

    // Set default values.
    $scope.data.shipping_is_billing = true; // User can toggle.

    // Build your payment method models
    $scope.data.payment_method = { "type": "credit_card" };
    $scope.data.paypal = {
        "type": "paypal",
        data: {
            // The following tokens are allowed in the URL: {{payment_id}}, {{order_id}}, {{customer_id}}, {{invoice_id}}. The tokens will be replaced with the actual values upon redirect.
            "success_url": window.location.href.substring(0, window.location.href.indexOf("#")) + "#/payment/review/{{payment_id}}",
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

        // If PayPal and status is initiated, redirect to PayPal for approval.
        if (payment.payment_method.type == "paypal" && payment.status == "initiated") {
            window.location = payment.response_data.redirect_url;
        } else {
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

    // Watch for error to be populated, and if so, scroll to it.
    $scope.$watch("data.error", function (newVal, oldVal) {
        if ($scope.data.error) {
            $document.scrollTop(0, 500);
        }
    });

}]);
app.controller("InvoiceController", ['$scope', '$location', 'InvoiceService', 'GeoService', 'CurrencyService', 'HelperService', '$document', function ($scope, $location, InvoiceService, GeoService, CurrencyService, HelperService, $document) {

    // Define a place to hold your data
    $scope.data = {};

    // Load in some helpers
    $scope.geoService = GeoService;
    $scope.helpers = HelperService;

    // Set the invoice parameters
    $scope.data.params = {};
    $scope.data.params.expand = "items.product,items.subscription_terms,customer.payment_methods,options";
    $scope.data.params.hide = "items.product.formatted,items.product.prices,items.product.url,items.product.description,items.product.images.link_medium,items.product.images.link_large,items.product.images.link,items.product.images.filename,items.product.images.formatted,items.product.images.url,items.product.images.date_created,items.product.images.date_modified";

    // Set default values.
    $scope.data.payment_method = {}; // Will be populated from the user's input into the form.

    // Build your payment method models
    $scope.data.payment_method = { "type": "credit_card" };
    $scope.data.paypal = {
        "type": "paypal",
        data: {
            // The following tokens are allowed in the URL: {{payment_id}}, {{order_id}}, {{customer_id}}, {{invoice_id}}. The tokens will be replaced with the actual values upon redirect.
            "success_url": window.location.href.substring(0, window.location.href.indexOf("#")) + "#/payment/review/{{payment_id}}",
            "cancel_url": window.location.href.substring(0, window.location.href.indexOf("#")) + "#/invoice"
        }
    }

    // Get the invoice
    InvoiceService.get($scope.data.params).then(function (invoice) {

        $scope.data.invoice = invoice;

        // Only display images if all items in the invoice have images
        $scope.showImages = false;
        var hasImageCount = 0;
        _.each(invoice.items, function (item) {
            if (item.product != null) {
                if (item.product.images.length > 0) {
                    hasImageCount++;
                }
            }
        });

        if (hasImageCount == invoice.items.length) {
            $scope.showImages = true;
        }

        // If there are payment methods, set the default onto the payment method object
        var data = ((invoice.customer || {}).payment_methods || {}).data;
        if (data) {
            if (data.length > 0) {
                $scope.data.payment_method = { payment_method_id: _.find(invoice.customer.payment_methods.data, function (payment_method) { return payment_method.is_default == true }).payment_method_id };
            }
        }

    }, function (error) {
        $scope.data.error = error;
    });

    // Handle a payment
    $scope.onPaymentSuccess = function (payment) {

        // If PayPal and status is initiated, redirect to PayPal for approval.
        if (payment.payment_method.type == "paypal" && payment.status == "initiated") {
            window.location = payment.response_data.redirect_url;
        } else {
            $location.path("/receipt/" + payment.payment_id);
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

    // Watch for error to be populated, and if so, scroll to it.
    $scope.$watch("data.error", function (newVal, oldVal) {
        if ($scope.data.error) {
            $document.scrollTop(0, 500);
        }
    });

}]);
app.controller("MainController", ['$scope', 'SettingsService', 'CurrencyService', function ($scope, SettingsService, CurrencyService) {
 
        $scope.settings = SettingsService.get();
        $scope.currency = CurrencyService.getCurrencyName();

    }]);
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
//# sourceMappingURL=pages.js.map
