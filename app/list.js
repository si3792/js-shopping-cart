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

        if (quantity <= 0) throw {
            'Product': 'validateQuantity - quantity is negative or zero'
        };
    }

    function List(name) {

        var _products = [];
        this.name = name;

        /**
         *    Returns a list of products and their quantities
         *
         *    @return {Array}
         */
        this.getProductsList = function() {
            let list = [];

            for (var i in _products) {
                list.push({
                    quantity: _products[i].quantity,
                    product: {
                        id: _products[i].product.getID(),
                        title: _products[i].product.getTitle(),
                        description: _products[i].product.getDescription(),
                        price: _products[i].product.getPrice()
                    }
                });
            }

            return list;
        }

        /**
         *    Returns a Product with a given Id (if it exists in the list)
         *
         *    @param  {Number} id
         *
         *    @return {Product}
         */
        this.getProduct = function(id) {
            for (var i in _products) {
                if (_products[i].product.getID() == id) {
                    return _products[i].product;
                }
            }
            DEBUG && console.log('Could not find product with id ' + id + ' in list ' + this.name);
        }

        /**
         *    Inserts a product into the list, with given quantity
         *
         *    @param {Product} product
         *    @param {Number} quantity
         */
        this.addProduct = function(product, quantity) {
            validateQuantity(quantity);
            if (!Product.isProduct(product)) {
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

        /**
         *    Removes a product from the list with a given Id
         *
         *    @param  {Number} id Id of the product to be removed
         */
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

        /**
         *    Updates the quantity for a product in the list with given id
         *
         *    @param  {Number} id
         *    @param  {Number} quantity
         */
        this.updateQuantity = function(id, quantity) {
            validateQuantity(quantity);

            for (var i in _products) {
                if (_products[i].product.getID() == id) {
                    _products[i].quantity = quantity;
                    DEBUG && console.log('Updated product quantity with id ' + id + ' in list ' + this.name);
                    return;
                }
            }
            DEBUG && console.log('Could not find product with id ' + id + ' in list ' + this.name);
        }


        this.getQuantity = function(id) {

          for (var i in _products) {
              if (_products[i].product.getID() == id) {
                  return Number(_products[i].quantity);
              }
          }
          DEBUG && console.log('Could not find product with id ' + id + ' in list ' + this.name);
        }

        /**
         *    Clears the list
         */
        this.clearList = function() {
            _products = [];
            DEBUG && console.log('Emptied list ' + this.name);
        }

    }
    return List;
}());
