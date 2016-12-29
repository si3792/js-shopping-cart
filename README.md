# js-shopping-cart

# Notes on requirements

## Price

Price is not mentioned as Product parameter, but is implied
in the Cart description (products, subtotal - add 5% tax for shipping, total), so I've included it as a field in Product.


## Quantity

Quantity is specified as a property of the Product, but it makes more sense to be a part of the List, as different lists can have different quantities of the same Product.
