define([
  'underscore',
  'modules/jquery-mozu',
  'hyprlive',
  "modules/cart-monitor",
  'modules/product-view',
  'modules/modal',
  'modules/models-product',
  "modules/jquery-dateinput-localized",
  "shim!vendor/imagezoom[jQuery=jquery]"
], function(_, $, Hypr, CartMonitor, ProductView, Modal, ProductModels) {
  var ProductQuickView = ProductView.extend(Modal.create({
    // hashTracking: false
    closeEl: '[data-dismiss="modal"]'
  }));


  var $productListing = $('.mz-productlisting.mz-productlist-tiled');


  ProductQuickView.create = function(product) {
    var quickViewModel = new ProductModels.Product(product.data);
    var quickView = new ProductQuickView({
      el: $('.remodal'),
      name: 'quickView',
      templateName: 'modules/quickview',
      model: quickViewModel
    });

    quickViewModel.on('addedtocart', function (cartitem) {
      if (cartitem && cartitem.prop('id')) {
        CartMonitor.addToCount(quickViewModel.get('quantity'));
        quickView.close();
        quickViewModel.isLoading(false);
        $("body").removeClass("is-loading");        
      } else {
        quickViewModel.trigger("error", { message: Hypr.getLabel('unexpectedError') });
      }
    });
    quickViewModel.on('error', function() {
      quickViewModel.isLoading(false);
      quickView.render(quickView);
    });
    quickViewModel.on('addedtowishlist', function (cartitem) {
      $('#add-to-wishlist').prop('disabled', 'disabled').text(Hypr.getLabel('addedToWishlist'));
    });
    quickView.on('render', function bindHandlers() {
      quickViewModel.isLoading(false);
      $('[data-mz-productimage-thumb]').off().click(function(e) {
        quickViewModel.set('selectedImageIx', $(e.currentTarget).data('mz-productimage-thumb'));
        quickView.render();
      });
      quickView.bindClose();
    });

    return quickView;
  };
  return ProductQuickView;
});
