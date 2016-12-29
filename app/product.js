/*************************
 *    Product definition *
 *************************/

'use strict';

var Product = (function() {

    /**
     *    Performs validation on Product title
     *
     *    @param  {String} title
     */
    let validate_title = function(title) {
        if (title == null) throw {
            'Product': 'validate_title - null title'
        };
        if (title.length < CONSTANTS.productTitleMin || title.length > CONSTANTS.productTitleMax) throw {
            'Product': 'validate_title - invalid title length'
        };
    }

    /**
     *    Performs validation on Product description
     *
     *    @param  {String} description
     */
    let validate_description = function(description) {
        if (description == null) throw {
            'Product': 'validate_description - null description'
        };
        if (description.length < CONSTANTS.productDescMin || description.length > CONSTANTS.productDescMax) throw {
            'Product': 'validate_description - invalid description length'
        };
    }

    /**
     *    Performs validation on Product quantity
     *
     *    @param  {Number} quantity
     */
    let validate_quantity = function(quantity) {
        if (quantity == null) throw {
            'Product': 'validate_quantity - null quantity'
        };
        if (quantity % 1 != 0) throw {
            'Product': 'validate_quantity - quantity is not a whole number'
        };
    }

    /**
     *    Performs validation on Product price
     *
     *    @param  {[type]} price
     */
    let validate_price = function(price) {
        if (price == null) throw {
            'Product': 'validate_price - null price'
        };
    }

    /**
     *    Product constructor
     *
     *    @param  {String} title
     *    @param  {String} description
     *    @param  {Number} quantity
     *    @param  {Number} price
     */
    function Product(title, description, quantity, price) {

        validate_title(title);
        validate_description(description);
        validate_quantity(quantity);
        validate_price(price);

        DEBUG && console.log('Creating product..');
        this._title = title;
        this._description = description;
        this._quantity = quantity;
        this._price = price;

        this.getTitle = function() {
          return this._title;
        }
        this.setTitle = function(title) {
          validate_title(title);
          this._title = title;
        }

        this.getDescription = function() {
          return this._description;
        }
        this.setDescription = function(description) {
          validate_description(description);
          this._description = description;
        }

        this.getQuantity = function() {
          return this._quantity;
        }
        this.setQuantity = function(quantity) {
          validate_quantity(quantity);
          this._quantity = quantity;
        }

        this.getPrice = function() {
          return this._price;
        }
        this.setPrice = function(price) {
          validate_price(price);
          this._price = price;
        }
    }
    return Product;
}());
