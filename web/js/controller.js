var dmap = angular.module('dmap');
dmap.controller('MainController', ['$scope', 'global', '$http', 'PlacesApi', 'GoogleMaps', '$window',
function($scope, $global, $http, PlacesApi, GoogleMaps, $window){

  GoogleMaps.set(document.getElementById('map'), $scope);
  GoogleMaps.setMarkCallback(function(latLng){
     
      $scope.place.position = {};
      $scope.place.position.latitude = latLng.lat();
      $scope.place.position.longitude = latLng.lng();
      $scope.$apply();
      console.log('New Marker Position', $scope.place.position);

  });

  $scope.types = {};
  $scope.place = null;
  $scope.places = {};
  $scope.loading = false;
  $scope.placeStatement = "create";
  $scope.search = {$:""};

  PlacesApi.get(function(r){
    console.log("PlacesApi.data", r);
    $scope.places = r.data;
  }, function(r){
    console.log("PlacesApi.error");
  });

  $http.get($global.url('/types')).then(function(response){
    if(response.status == 200) {
      $scope.types = response.data;
    }
  }, function(error){
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
      alert("Item excluído com sucesso!");

    }, function(r){

      $scope.loading = false;
      alert("Erro ao tentar excluir!");

    });

  };

  $scope.save = function(place){

    $scope.loading = true;

    PlacesApi.save(place, function(r){
      $scope.places.push(place);
      $scope.loading = false;

      alert("Novo item cadastrado com sucesso!");

    }, function(r){
      $scope.loading = false;
      alert("Erro de validação. Verifique os dados");
    });

  };

  $scope.update = function(place){

    $scope.loading = true;

    PlacesApi.update(place._id.$id, place, function(r){
      $scope.loading = false;
      alert("Item atualizado com sucesso!");
    }, function(r){
      $scope.loading = false;
      alert("Erro de validação. Verifique os dados");
    });

  };

  $scope.locateMap = function(){

    GoogleMaps.locateByAddress($scope.place.address);

  };

  // Escuta latitude e longitude
  $scope.$watchCollection('place.position', function(n, o){
    console.log("$scope.$watch -> place.position", n);
    GoogleMaps.updateLatLng(n);
  });
  $scope.$watch('place.address.zipcode', function(n, o){
    console.log("$scope.$watch -> Zipcode");
  });

}]);
