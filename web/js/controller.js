var dmap = angular.module('dmap');
dmap.controller('MainController', ['$scope', 'global', '$http', 'PlacesApi', 'GoogleMaps', '$window',
function($scope, $global, $http, PlacesApi, GoogleMaps, $window){

  $scope.map = GoogleMaps.set(document.getElementById('map'));

  $scope.types = {};
  $scope.place = null;
  $scope.places = {};
  $scope.loading = false;
  $scope.placeStatement = "create";
  $scope.search = {$:""};

  PlacesApi.get(function(r){
    $scope.places = r.data;
  }, function(r){
  });

  $http.get($global.url('/types')).then(function(response){
    if(response.status == 200) {
      $scope.types = response.data;
    }
  }, function(error){
  });

  // Funcionalidades do mapa
  $scope.$watch('place.position.latitude', function(n,o) {
  });
  $scope.$watch('place.position.longitude', function(n,o) {
  });

  $scope.openEdit = function(place){
    $scope.place = place;
    $scope.placeStatement = "edit";
  };
  $scope.openCreate = function(place){
    $scope.place = {
      active: true,
      type: "ALL",
      address: {
        country: "Brasil",
        state: "RS"
      }
    };
    $scope.placeStatement = "create";
  };

  $scope.delete = function(index){

    var place = $scope.places[index];

    if(!confirm("Tem certeza que deseja excluir "+place.name+"?")) {
      return;
    }

    $scope.loading = true;
    PlacesApi.delete(place._id.$id, function(r){

      $scope.places.splice(index, 1);

      $scope.loading = false;

    }, function(r){

      $scope.loading = false;

    });

  };

  $scope.save = function(place){

    $scope.loading = true;

    PlacesApi.save(place, function(r){
      $scope.places.push(place);
      $scope.loading = false;

    }, function(r){
      $scope.loading = false;
      alert("Erro de validação. Verifique os dados");
    });

  };

  $scope.update = function(place){

    $scope.loading = true;

    PlacesApi.update(place._id.$id, place, function(r){
      $scope.loading = false;
    }, function(r){
      $scope.loading = false;
    });

  };

}]);
