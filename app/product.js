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
     *    createID is used to generate a unique ID during Product construction,
     *    by using localStorage to keep track of used IDs.
     *
     *    @return {Number} An unused Product id
     */
    let createID = function() {
      let idCount = Number(localStorage.getItem('idCount')) || 0; // Get current idCount or 0 if it doesn't exist
      localStorage.setItem('idCount', idCount + 1);
      return idCount + 1;
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

        // Private properties
        var _id = createID();
        var _title = title;
        var _description = description;
        var _quantity = quantity;
        var _price = price;

        this.getID = function() {
          return _id;
        }

        this.getTitle = function() {
          return _title;
        }
        this.setTitle = function(title) {
          validate_title(title);
          _title = title;
        }

        this.getDescription = function() {
          return _description;
        }
        this.setDescription = function(description) {
          validate_description(description);
          _description = description;
        }

        this.getQuantity = function() {
          return this._quantity;
        }
        this.setQuantity = function(quantity) {
          validate_quantity(quantity);
          _quantity = quantity;
        }

        this.getPrice = function() {
          return _price;
        }
        this.setPrice = function(price) {
          validate_price(price);
          _price = price;
        }
    }
    return Product;
}());
