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