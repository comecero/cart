// Custom HTML directive
app.directive('customHtml', function () {
    return {
        restrict: 'AE',
        scope: {
            html: '=?'
        },
        link: function (scope, elem, attrs, ctrl) {
            if (scope.html) {
                elem.html(scope.html);
            }
        }
    }
});

app.directive('downloadReceipt', ['ApiService', function (ApiService) {
    return {
        restrict: 'A',
        scope: {
            orderId: '=?',
            orderUrl: '=?',
            error: '=?'
        },
        link: function (scope, elem, attrs) {
            elem.bind("click", function () {
                ApiService.getItemPdf(scope.orderUrl).then(function (response) {
                    var file = new Blob([response.data], { type: "application/pdf" });
                    saveAs(file, "Order_" + scope.orderId + ".pdf");
                }, function (error) {
                    scope.error = error;
                });
            });
        }
    };
}]);