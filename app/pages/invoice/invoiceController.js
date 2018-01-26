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