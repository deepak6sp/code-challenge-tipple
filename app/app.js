var app = angular.module('myApp', []);


app.controller('stockCtrl', function($scope, $http, $timeout) {

  var products_in_stock, products_in_invoice;
  $scope.current = "Current";

  $http.get('./api/stock.json')
  .then(function(res){
      $scope.stockList = res.data; 
  });

  $timeout(function(){
    products_in_stock = $scope.stockList;
  }, 1000);

  $http.get('./api/invoice.json')
  .then(function(res){
      $scope.invoiceList = res.data; 
  });

  $timeout(function(){
    products_in_invoice = $scope.invoiceList[0].products;
  }, 1000);

  $scope.update = function() {
      angular.forEach(products_in_invoice, function(invoice_product, key) {
        angular.forEach(products_in_stock, function(stock_product, key) {
          if (invoice_product.product_id == stock_product.product_id){
            stock_product.units += invoice_product.units;
            var cost_price_difference = invoice_product.unit_price / stock_product.cost_price;
            stock_product.sale_price *= cost_price_difference;
            stock_product.cost_price = invoice_product.unit_price
            $scope.current = "Updated";
            $scope.red = "red"; 
          } 
        });
      });
  };
});


