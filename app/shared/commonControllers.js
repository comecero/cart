// Custom title controller
app.controller("TitleController", ['$scope', 'SettingsService', function ($scope, SettingsService) {

    var settings = SettingsService.get().app;
    $scope.title = settings.page_title || "Checkout";

}]);