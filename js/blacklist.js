var application = angular.module('Ladybug', []);
application.controller('URLController', function($scope) {
  $scope.sites = ['www.facebook.com'];
  $scope.addSite = function(){
    $scope.sites.push($scope.newSite);
  }
})





// function URLController($scope){
//     $scope.sites=[];
//     $scope.addSite=function($scope.newSite){
//         $scope.sites.push($scope.newSite);
//
//     }
// }


//Inside script of blacklist.html
// var application = angular.module('Ladybug', []);
//     function URLController($scope){
//         $scope.newSite=""
//         $scope.sites=['www.facebook.com'];
//         $scope.addSite=function(){
//              $scope.sites.push($scope.newSite);
//         }
//     }
