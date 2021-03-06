/*************************
 *    Presentation Logic *
 *************************/

'use strict';

var ProductsArray = [];
var CartArray = [];

var ProductsList;
var CartList;

/*
  Restore ProductsList and CartList from localStorage, or create them if they don't yet exist
 */
if (localStorage.getItem('ProductsList') == null) ProductsList = new List('ProductsList', true);
else ProductsList = List.fromJSON(localStorage.getItem('ProductsList'));

if (localStorage.getItem('CartList') == null) CartList = new List('CartList', true);
else CartList = List.fromJSON(localStorage.getItem('CartList'));

var modalProductId; // The id of the product currently open in the modal for editing
var CartListBaseCost; // Cost of all items in CartList, tax not included

var modalValidaror; // Validator for the modal form
var modalCanvasTouchedFlag; // Boolean for checking whether an image was uploaded with the modal

/**
 *    Handles rendering of Cart tab and
 *    wiring its logic.
 *
 *    Should be called
 *    whenever CartList is updated
 *
 */
var refreshCartUI = function() {

    // Update CartArray
    CartArray = CartList.getProductsList();

    /*
      Generating HTML for #CartDiv and calculating CartListBaseCost
     */
    CartListBaseCost = 0;
    var inHTML = `<ul class="collapsible" data-collapsible="accordion">`;
    for (var i in CartArray) {

        CartListBaseCost += CartArray[i].product.price * CartArray[i].quantity;

        let htmlPart = `<li>
                    <div class="collapsible-header">
                    <i class="material-icons">shopping_basket</i>` + CartArray[i].quantity + ' x ' + CartArray[i].product.title +
            `<span class='right'> $` + (CartArray[i].product.price * CartArray[i].quantity) + `</span>
                    </div>
                    <div class="collapsible-body">
                      <div class='container valign-wrapper'>
                      <div class='col s6 m4 valign'>
                      <div class="input-field inline">
                          <input id="quantityField" class="cartQuantityFields active" type="number" refersTo="` + CartArray[i].product.id + `">
                          <label for="quantityField">Quantity</label>
                      </div>
                      </div>
                      <div class='col s6 m4 valign'>
                          <a class="removefromcart-trigger waves-effect waves-light btn" refersTo="` + CartArray[i].product.id + `">Remove</a>
                      </div>
                      </div>
                    </div>
                    </li>`;
        inHTML += htmlPart;
    }

    DEBUG && console.log('Total cost of items in cart: ' + CartListBaseCost);

    inHTML += `
    <li>
      <div class="collapsible-header grey white-text darken-1">
      <i class="material-icons">description</i> Products cost <span class='right'> $` + CartListBaseCost + `</span>
      </div>
      <div class="collapsible-header grey darken-2 white-text">
      <i class="material-icons">description</i> Shipping cost <span class='right'> $` + (CartListBaseCost * CONSTANTS.shippingTaxPercent) / 100 + `</span>
      </div>
      <div class="collapsible-header white-text grey darken-4">
      <i class="material-icons">description</i> Total cost <span class='right'> $` + (CartListBaseCost + ((CartListBaseCost * CONSTANTS.shippingTaxPercent) / 100)) + `</span>
      </div>
    </li>
    </ul>`;
    $("#cartDiv").html(inHTML);

    // Initialize Materialize collapsibles
    $('.collapsible').collapsible();

    // Logic for Remove (from cart) buttons
    $('.removefromcart-trigger').click(function() {
        let id = $(this).attr('refersTo');
        CartList.removeProduct(id);
        refreshCartUI();
    });

    // Logic for quantity fields in Cart
    $('.cartQuantityFields').each(function() {
        let id = $(this).attr('refersTo');
        $(this).val(CartList.getQuantity(id));
    });

    $('.cartQuantityFields').change(function() {

        let id = $(this).attr('refersTo');
        let newVal = $(this).val();

        try {
            CartList.updateQuantity(id, newVal);
        } catch (e) {
            // Reset input to previous value if newVal is not valid
            $(this).val(CartList.getQuantity(id));
        }
        refreshCartUI();
    });
    Materialize.updateTextFields();
}

/**
 *    Handles rendering of Products tab and
 *    wiring its logic.
 *
 *    Should be called
 *    whenever ProductsList is updated
 *
 */
var refreshProductsUI = function() {

    // Update ProductsArray
    ProductsArray = ProductsList.getProductsList();

    /*
      Generating HTML for #ProductsDiv
     */
    var inHTML = "";
    for (var i in ProductsArray) {
        let htmlPart = `
        <div class="col s12 m6">
          <div class="card blue-grey darken-1">`;
        if (ProductsArray[i].product.imgData != '')
            htmlPart += `<div class="card-image-holder" style="background-image:url('` + ProductsArray[i].product.imgData + `')"> </div>`;

        htmlPart += `
            <div class="card-content white-text">
              <h5>` + ProductsArray[i].product.title + `</h5>
              <span class="card-title">$` + ProductsArray[i].product.price + `</span>
              <p>` + ProductsArray[i].product.description + `</p>
            </div>
           <div class="card-action">
              <a href="#productModal" class="modal-trigger" refersTo="` + ProductsArray[i].product.id + `">Edit</a>
              <a href="#productModal" class="delete-trigger" refersTo="` + ProductsArray[i].product.id + `">Delete</a>
           </div>
           <ul class="collapsible" data-collapsible="accordion">
            <li>
              <div class="collapsible-header"><i class="material-icons">add_shopping_cart</i>Order</div>
              <div class="collapsible-body grey lighten-4">
              <div class="row valign-wrapper">
              <div class="col s10 offset-s1 m4 offset-m2 valign">
                <div class="input-field inline">
                <input id="quantityField" class="quantityFields" type="number" value='1' refersTo="` + ProductsArray[i].product.id + `">
                <label for="quantityField">Quantity</label>
                </div>
              </div>
              <div class="col s10 offset-s1 m4 valign">
                <a class="waves-effect waves-light btn-large addtocart-trigger" refersTo="` + ProductsArray[i].product.id + `">Add to cart</a>
              </div>
              </div>
              </div>
            </li>
          </ul>
          </div>
        </div>`;

        inHTML += htmlPart;
    }
    $("#ProductsDiv").html(inHTML);

    // Initialize Materialize collapsibles
    $('.collapsible').collapsible();

    // Initialize Meterialize modal triggers
    $('.modal-trigger').leanModal();

    // .modal-trigger's custom logic on modal open
    $('.modal-trigger').click(function() {

        modalCanvasTouchedFlag = false;

        // Configure modal for Creation or Editing depending on how (from where) it was called
        if ($(this).attr('refersTo') == 'new') {
            DEBUG && console.log('Opening modal for product creation');

            $('.modalShowOnCreate').show();
            $('.modalShowOnEdit').hide();

            let clearModal = function() {
                // Clear modal fields
                $('#modalTitle').val('');
                $('#modalDesc').val('');
                $('#modalPrice').val('');

                let canvas = $('#modalImageCanvas')[0];
                canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

                // Reset form validation
                modalValidaror.resetForm();
            }
            clearModal();

            // CREATE button logic
            $('#createProductBtn').off('click.createProduct').on('click.createProduct', function() {

                if (!$('#modalForm').valid()) {
                    alert('You are trying to submit an invalid form');
                    return;
                }

                DEBUG && console.log('Creating new product');

                let title = $('#modalTitle').val();
                let description = $('#modalDesc').val();
                let price = $('#modalPrice').val();
                let product = new Product(title, description, price, true);

                if (modalCanvasTouchedFlag) {
                    product.setImgData($('#modalImageCanvas')[0].toDataURL("image/png"));
                }

                clearModal();

                ProductsList.addProduct(product, 1);
                TOASTS && Materialize.toast('Product successfuly added', 3000)
                refreshProductsUI();
            });

        } else {
            DEBUG && console.log('Opening modal for editing Product');

            $('.modalShowOnCreate').hide();
            $('.modalShowOnEdit').show();

            // Prefill the modal fields with the current values of the Product we are editing
            for (var i in ProductsArray) {
                if (ProductsArray[i].product.id == $(this).attr('refersTo')) {
                    $('#modalTitle').val(ProductsArray[i].product.title);
                    $('#modalDesc').val(ProductsArray[i].product.description);
                    $('#modalPrice').val(ProductsArray[i].product.price);

                    // draw product image on canvas
                    let img = new Image;
                    let canvas = $('#modalImageCanvas')[0];
                    img.src = ProductsArray[i].product.imgData;

                    canvas.width = img.width;
                    canvas.height = img.height;
                    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);

                    Materialize.updateTextFields();
                    modalProductId = ProductsArray[i].product.id;
                }
            }

            // Reset form validation
            modalValidaror.resetForm();

            // UPDATE button logic
            $('#updateProductBtn').off('click.updateProduct').on('click.updateProduct', function() {

                if (!$('#modalForm').valid()) {
                    alert('You are trying to submit an invalid form');
                    return;
                }

                DEBUG && console.log('Updating product with id ' + modalProductId);
                let updatedProduct = ProductsList.getProduct(modalProductId);
                updatedProduct.setTitle($('#modalTitle').val());
                updatedProduct.setDescription($('#modalDesc').val());
                updatedProduct.setPrice($('#modalPrice').val());

                if (modalCanvasTouchedFlag) {
                    updatedProduct.setImgData($('#modalImageCanvas')[0].toDataURL("image/png"));
                }

                TOASTS && Materialize.toast('Product successfuly updated', 3000)
                refreshProductsUI();
                refreshCartUI();
            });
        }

    });

    // Logic for Delete buttons
    $('.delete-trigger').click(function() {
        let id = $(this).attr('refersTo')
        ProductsList.removeProduct(id);
        TOASTS && Materialize.toast('Product successfuly deleted', 3000)
        refreshProductsUI();
    });

    // Logic for Add to cart buttons
    $('.addtocart-trigger').click(function() {

        let id = $(this).attr('refersTo');
        let product = ProductsList.getProduct(id);
        let quantity = $('.quantityFields').filter(function() {
            return $(this).attr('refersTo') == id;
        }).val();

        if (quantity % 1 != 0 || quantity == '' || quantity < 0) {
            alert('Invalid quantity value!');
        }

        if (CartList.getProduct(id) == null) {
            // If the cart doesn't have this product, add it
            CartList.addProduct(product, quantity);
        } else {
            // If the cart already has this product, increase its quantity instead
            CartList.updateQuantity(id,
                CartList.getQuantity(id) + Number(quantity)
            );
        }

        refreshCartUI();
        TOASTS && Materialize.toast('Product(s) for total of $' + product.getPrice() * quantity + ' added to cart', 3000);
    });
}

/**
 *    Small helper function which iterates over localStorage products
 *    and removes those which are not instantiated. Should be run after
 *    loading ProductsList and CartList in order to purge unused entries.
 */
var purgeOldProductEntries = function() {

    $.each(localStorage, function(key, value) {
        if (key == 'idCount' || key == 'CartList' || key == 'ProductsList') return;

        if (Product.getInstantiatedProductByID(key) == null) {
            localStorage.removeItem(key);
        }
    });
}
purgeOldProductEntries()

$(document).ready(function() {

    // Start UI
    refreshCartUI();
    refreshProductsUI();

    // Logic for Empty Cart button
    $('#emptyCartBtn').click(function() {
        CartList.clearList();
        TOASTS && Materialize.toast('Cart is now empty', 3000)
        refreshCartUI();
    });

    // Logic for Checkout button
    $('#checkoutBtn').click(function() {
        CartList.clearList();
        TOASTS && Materialize.toast('Mock checkout called', 3000)
        refreshCartUI();
    });

    // Logic for image
    $('#imageLoader').change(function(e) {

        /**
         *    Given x and y of an image, and maximum dimensions
         *    for a canvas, calculateImageScaleFactor() returns
         *    the scale factor, by which the image should be scaled
         *    to optimally fit inside the canvas, without changing its aspect ratio.
         *
         *    @param  {Number} imageWidth
         *    @param  {Number} imageHeight
         *    @param  {Number} maxCanvasWidth
         *    @param  {Number} maxCanvasHeight
         *
         *    @return {Number} scale factor
         */
        var calculateImageScaleFactor = function(imageWidth, imageHeight, maxCanvasWidth, maxCanvasHeight) {
            let canvasAspectRatio = maxCanvasWidth / maxCanvasHeight;
            let imageAspectRatio = imageWidth / imageHeight;

            if (imageAspectRatio > canvasAspectRatio)
                return maxCanvasWidth / imageWidth;
            else
                return maxCanvasHeight / imageHeight;
        }

        var reader = new FileReader();
        reader.onload = function(event) {
            var img = new Image();
            img.onload = function() {

                let canvas = $('#modalImageCanvas')[0];
                let ctx = canvas.getContext('2d');

                let scaleFactor = calculateImageScaleFactor(img.width, img.height, 450, 250);
                canvas.width = img.width * scaleFactor;
                canvas.height = img.height * scaleFactor;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                modalCanvasTouchedFlag = true;
            }
            img.src = event.target.result;
        }

        let imgSizeMB = e.target.files[0].size / (1024*1024);
        DEBUG && console.log('Trying to upload image with size: ' + imgSizeMB);
        if(imgSizeMB > CONSTANTS.productImgMaxSizeMB) {
          alert('Selected file is over the limit of ' + CONSTANTS.productImgMaxSizeMB + ' megabytes!');
          return;
        }

        reader.readAsDataURL(e.target.files[0]);
    });

    // Configure modal form validation
    modalValidaror = $('#modalForm').validate({
        rules: {
            modalTitle: {
                required: true,
                minlength: CONSTANTS.productTitleMin,
                maxlength: CONSTANTS.productTitleMax
            },
            modalDesc: {
                required: true,
                minlength: CONSTANTS.productDescMin,
                maxlength: CONSTANTS.productDescMax
            },
            modalPrice: {
                required: true,
                min: 0
            }
        },
        messages: {
            modalTitle: {
                required: 'Title is required',
                minlength: 'Title must be at least ' + CONSTANTS.productTitleMin + ' characters',
                maxlength: 'Title must be at most ' + CONSTANTS.productTitleMax + ' characters',
            },
            modalDesc: {
                required: 'Description is required',
                minlength: 'Description must be at least ' + CONSTANTS.productDescMin + ' characters',
                maxlength: 'Description must be at most ' + CONSTANTS.productDescMax + ' characters',
            },
            modalPrice: {
                required: 'Price is required',
                min: 'Price must be positive'
            }
        }
    });

});
