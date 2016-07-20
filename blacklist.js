function URLController($scope){
    $scope.sites=[];
    $scope.addSite=function(){
        $scope.sites.push($scope.newSite);
    }
}
