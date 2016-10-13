var app = angular.module('myApp', []);


app.factory('getApi', function ($http) { // get api result
  return {
    stockLists: function () {
        return $http.get("./api/stock.json");
    },
    invoiceLists: function(){
        return $http.get("./api/invoice.json");
    }
  };
});


app.controller('appCtrl', function($scope, $timeout, getApi) {

  var products_in_stock, products_in_invoice, invoice, track_invoice=[];

  getApi.stockLists().then(function(res){ // get promise result and add to scope.stockList
    $scope.stockList = res.data;
  });

  getApi.invoiceLists().then(function(res){ // get promise result and add to scope.invoiceList
    $scope.invoiceList = res.data;
  });

  $timeout(function(){          // assign values returned from apiService
    products_in_stock = $scope.stockList;
    invoice = $scope.invoiceList;
    products_in_invoice = $scope.invoiceList[0].products;
  }, 1000);

  function isInArray(value, array) {  // check if invoice exist in track_invoice array
    return array.indexOf(value) > -1;
  }
  
  $scope.update = function() {
     
    if(isInArray(invoice[0].invoice_number,track_invoice)){    // if invoice already added to stock do not duplicate else modify current stock
      alert(invoice[0].invoice_number+" invoice already updated.");
    } else {
      angular.forEach(products_in_invoice, function(invoice_product, key) {
        angular.forEach(products_in_stock, function(stock_product, key) {
          if (invoice_product.product_id == stock_product.product_id){  // update stock
            stock_product.units += invoice_product.units; // update units in stock
            var cost_price_difference = invoice_product.unit_price / stock_product.cost_price; // calculate cost price margin
            stock_product.sale_price *= cost_price_difference;    // update sale price in stock
            stock_product.cost_price = invoice_product.unit_price // update cost price to unit price in invoice
          } 
        });
      });
    
      var update_text = document.getElementsByClassName("updated_invoice_number");
      update_text[0].innerHTML = " Invoice "+invoice[0].invoice_number+" successfully added to stock";
      track_invoice.push(invoice[0].invoice_number);
    }
  }

});




