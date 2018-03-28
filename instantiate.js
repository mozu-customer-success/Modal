require([
  'modules/jquery-mozu',
  'modules/api',
  'modules/quick-view'
], function($, api, ProductQuickView) {
  var log = function(value) {
    var pageContext = require.mozuData('pageContext');
    if(!pageContext || !pageContext.isDebugMode) return value;
    console.log(value);
    return value;
  }
  $('button.quickview').click(function (e) {
    var productCode = $(this).attr('productCode');
    if (!productCode) return log('no product code');
    api.get('product', { productCode: productCode }).then(function (prod) {
  
      var productQuickView = ProductQuickView.create(prod);
  
      if (!productQuickView) return log('couldnt create quick view');
      productQuickView.render();
      productQuickView.open();
  
      window.productQuickView = productQuickView;
    }, log);
  });
});