﻿"use strict";
app.controller('MainCtrl', function ($scope, $http, $log, $location, spFormFactory) {    
    $scope.spFormFactory = spFormFactory;

    spFormFactory.initialize($scope, 'Travel Requests').then(init);
    $scope.calendarFormat = 'dd-MMMM-yyyy';   

    $scope.saveWithButtonDisabled = function(){
        $scope.hideSaveButton = 'true';
        $scope.save();
    }

    function init() {
        //Business logic goes here:
   
    }

});