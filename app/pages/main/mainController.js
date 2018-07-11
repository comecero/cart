app.controller("MainController", ['$scope', 'SettingsService', 'CurrencyService', function ($scope, SettingsService, CurrencyService) {

    $scope.settings = SettingsService.get();
    $scope.currency = CurrencyService.getCurrencyName();

}]);