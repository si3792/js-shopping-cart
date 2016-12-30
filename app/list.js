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

    /**
     *    Constructs a List object
     *
     *    @param {String} name
     *    @param {Boolean} persistence If persistence is enabled, the list is automatically saved in localStorage (key=name) after each operation on it.
     */
    function List(name, persistence) {

        var _products = [];
        this.name = name;
        var _persistence = persistence;

        var self = this;

        /**
         *    Creates a simple JSON representation of the list, containing
         *    its name and an array of (product_id, quantity) objects
         *
         *    @return {String}
         */
        this.toJSON = function() {

            let products = [];
            for (var i in _products) {
                products.push({
                    product_id: _products[i].product.getID(),
                    quantity: _products[i].quantity
                });
            }
            return JSON.stringify({
                name: name,
                products: products
            });
        }

        /**
         *    Private method
         *    If _persistence is enabled, saves List's state
         *    to localStorage with key name
         *
         */
        var saveState = function() {
            if (!_persistence) return;
            DEBUG && console.log('Saving list with name ' + name + ' to localStorage');
            localStorage.setItem(name, self.toJSON());
        }

        /**
         *    Returns a list of products and their quantities, for displaying to the user
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
            saveState();
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
                    saveState();
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
                    saveState();
                    return;
                }
            }
            DEBUG && console.log('Could not find product with id ' + id + ' in list ' + this.name);
        }

        /**
         *    Returns quantity for a product in the list with given id
         *
         *    @param  {Number} id
         *
         *    @return {Number} quantity
         */
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
            saveState();
            DEBUG && console.log('Emptied list ' + this.name);
        }

    }
    return List;
}());

/**
 *    Static function for List deserialization
 *
 *    @param  {String} str
 *
 *    @return {List}
 */
List.fromJSON = function(str) {
    let obj = JSON.parse(str);

    let list = new List(obj.name, true);

    for (var i in obj.products) {
        let str = localStorage.getItem(obj.products[i].product_id);
        if (str != null) {

            let product = Product.fromJSON(str);
            list.addProduct(product, obj.products[i].quantity);
        }
    }

    return list;
}
