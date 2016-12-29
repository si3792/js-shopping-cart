/******************************
 *    Product List definition *
 ******************************/

'use strict';

var List = (function() {

    /**
     *    Performs validation on quantity
     *
     *    @param  {Number} quantity
     */
    let validateQuantity = function(quantity) {
        if (quantity == null) throw {
            'Product': 'validateQuantity - null quantity'
        };
        if (quantity % 1 != 0) throw {
            'Product': 'validateQuantity - quantity is not a whole number'
        };
    }

    function List(name) {

        var _products = [];
        this.name = name;

        this.getProducts = function() {
            return _products.slice(); // .slice() clones the array and returns reference to the new array.
        }

        this.addProduct = function(product, quantity) {
            validateQuantity(quantity);
            if( !Product.isProduct(product) ) {
              throw {
                'List': 'addProduct - product parameter is not an instance of Product'
              };
            }

            for (var i in _products) {
                if (_products[i].product.getID() == product.getID()) {
                    DEBUG && console.log('Product with id ' + product.getID() + ' already exists in ' + this.name);
                    return;
                }
            }
            _products.push({
                product: product,
                quantity: quantity
            });
            DEBUG && console.log('Added product with id ' + product.getID() + ' to list ' + this.name);
        }

        this.removeProduct = function(id) {
            for (var i in _products) {
                if (_products[i].product.getID() == id) {
                    _products.splice(i, 1);
                    DEBUG && console.log('Removed product with id ' + id + ' from list ' + this.name);
                    return;
                }
            }
            DEBUG && console.log('Could not find product with id ' + id + ' in list ' + this.name);
        }

        this.updateProduct = function(product, quantity) {
            validateQuantity(quantity);
            if( !Product.isProduct(product) ) {
              throw {
                'List': 'updateProduct - product parameter is not an instance of Product'
              };
            }

            for (var i in _products) {
                if (_products[i].product.getID() == product.getID()) {
                    _products[i].product = product;
                    _products[i].quantity = quantity;
                    DEBUG && console.log('Updated product with id ' + product.getID() + ' in list ' + this.name);
                    return;
                }
            }
        }

        this.clearList = function() {
            _products = [];
            DEBUG && console.log('Emptied list ' + this.name);
        }

    }
    return List;
}());
