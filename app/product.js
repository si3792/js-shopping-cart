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
        if (isNaN(price)) throw {
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

    // This holds all instantiated Products
    let instantiatedProducts = {};


    /**
     *    Whenever a persistent Product is instantiated (deserialized), it calls this function to register itself by its id.
     *    This is done in case of consequent calls for deserialization with the same id, which then return reference to the registered product.
     *
     *    @param  {Number} id
     *    @param  {Product} product
     */
    let registerProductInstantiation = function(id, product) {
        instantiatedProducts[id] = product;
    }

    /**
     *    If a Product with the given id is already instantiated, return a reference to it
     *
     *    @param  {Number} id
     *
     *    @return {Product}
     */
    Product.getInstantiatedProductByID = function(id) {
        return instantiatedProducts[id];
    }

    /**
     *    Product constructor
     *
     *    @param  {String} title
     *    @param  {String} description
     *    @param  {Number} price
     *    @param  {Boolean} persistence If persistence is enabled, the product is automatically saved in localStorage (key=id) after each operation on it.
     */
    function Product(title, description, price, persistence) {

        validateTitle(title);
        validateDescription(description);
        validatePrice(price);

        // Private properties
        var _id = createID();
        var _title = title;
        var _description = description;
        var _price = price;
        var _persistence = persistence;

        var self = this;

        // Temporary Products are not registered
        if (_persistence)
            registerProductInstantiation(_id, this);

        /**
         *    JSON serialization for Product.
         *
         *    Use with Product.fromJSON() for deserialization.
         *
         *    @return {String}
         */
        this.toJSON = function() {
            let product = {
                id: _id,
                title: _title,
                description: _description,
                price: _price
            };
            return JSON.stringify(product);
        }

        /**
         *    Transforms this Product to a serialized Product
         *
         *    Use Product.fromJSON() for deserialization,
         *    which returns a new Product and is easier to use.
         *
         *    @param  {String} str The serialized Product
         */
        this.fromJSON = function(str) {

            let obj = JSON.parse(str);
            if (instantiatedProducts[obj.id] != null) {
                DEBUG && console.log("Trying to deserialize a product that is already instantiated. ID: " + obj.id);
                throw {
                    'Product': 'Trying to deserialize a product that is already instantiated',
                    'id': obj.id
                };
            }

            validateTitle(obj.title);
            validateDescription(obj.description);
            validatePrice(obj.price);

            if (obj.id == null || !Number(obj.id)) throw {
                'Product': 'fromJSON - invalid id'
            };

            _id = obj.id;
            _title = obj.title;
            _description = obj.description;
            _price = obj.price;
            _persistence = true;

            registerProductInstantiation(_id, this);
        }

        /**
         *    Private method
         *    If _persistence is enabled, saves Product's state
         *    to localStorage with key _id
         *
         */
        var saveState = function() {
            if (!_persistence) return;
            DEBUG && console.log('Saving object with id ' + _id + ' to localStorage');
            localStorage.setItem(_id, self.toJSON());
        }
        saveState();


        this.getID = function() {
            return _id;
        }

        this.getTitle = function() {
            return _title;
        }
        this.setTitle = function(title) {
            if (title == _title) return;
            validateTitle(title);
            _title = title;
            saveState();
        }

        this.getDescription = function() {
            return _description;
        }
        this.setDescription = function(description) {
            if (_description == description) return;
            validateDescription(description);
            _description = description;
            saveState();
        }

        this.getPrice = function() {
            return _price;
        }
        this.setPrice = function(price) {
            if (_price == price) return;
            validatePrice(price);
            _price = price;
            saveState();
        }

    }
    return Product;
}());


/**
 *    Function for Product deserialization.
 *    If a Product with the same ID is already instantiated,
 *    returns a reference to it instead.
 *
 *    @param  {String} str The serialized Product
 *
 *    @return {Product}
 */
Product.fromJSON = function(str) {

    var tmpTitle = Array(CONSTANTS.productTitleMin + 1).join('a');
    var tmpDesc = Array(CONSTANTS.productDescMin + 1).join('a');
    let product = new Product(tmpTitle, tmpDesc, 10, false);

    try {
        product.fromJSON(str);
    } catch (e) {
        if (e.Product == 'Trying to deserialize a product that is already instantiated') {
            DEBUG && console.log('Returning reference to instantiated Product instead. ID: ' + e.id);
            return Product.getInstantiatedProductByID(e.id);
        } else
            throw e;
    }

    return product;
}
