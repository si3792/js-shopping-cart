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
    let validateTitle = function(title) {
        if (title == null) throw {
            'Product': 'validateTitle - null title'
        };
        if (title.length < CONSTANTS.productTitleMin || title.length > CONSTANTS.productTitleMax) throw {
            'Product': 'validateTitle - invalid title length'
        };
    }

    /**
     *    Performs validation on Product description
     *
     *    @param  {String} description
     */
    let validateDescription = function(description) {
        if (description == null) throw {
            'Product': 'validateDescription - null description'
        };
        if (description.length < CONSTANTS.productDescMin || description.length > CONSTANTS.productDescMax) throw {
            'Product': 'validateDescription - invalid description length'
        };
    }

    /**
     *    Performs validation on Product price
     *
     *    @param  {[type]} price
     */
    let validatePrice = function(price) {
        if (price == null) throw {
            'Product': 'validatePrice - null price'
        };
        if( isNaN(price) ) throw {
          'Product': 'validatePrice - price is NaN'
        }
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
     *    @param  {Number} price
     */
    function Product(title, description, price) {

        validateTitle(title);
        validateDescription(description);
        validatePrice(price);

        // Private properties
        var _id = createID();
        var _title = title;
        var _description = description;
        var _price = price;

        this.getID = function() {
            return _id;
        }

        this.getTitle = function() {
            return _title;
        }
        this.setTitle = function(title) {
            validateTitle(title);
            _title = title;
        }

        this.getDescription = function() {
            return _description;
        }
        this.setDescription = function(description) {
            validateDescription(description);
            _description = description;
        }

        this.getPrice = function() {
            return _price;
        }
        this.setPrice = function(price) {
            validatePrice(price);
            _price = price;
        }
    }
    return Product;
}());

/**
 *    Static method for checking if an object is a Product
 *
 *    @param  {Object}  product The object to be tested
 *
 *    @return {Boolean}
 */
Product.isProduct = function(product) {
  return product.constructor.name == 'Product';
}
