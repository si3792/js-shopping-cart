# js-shopping-cart

## Installation

After cloning the repository, run `npm install` to install dependencies.
Then, simply open `index.html`.

## Dependencies

- jquery for DOM manipulation
- jquery-validation for form validation
- Materialize as CSS framework

## Notes on requirements

### Price

Price is not mentioned as Product parameter, but is implied
in the Cart description (products, subtotal - add 5% tax for shipping, total), so I've included it as a field in Product.


### Quantity

Quantity is specified as a property of the Product, but it makes more sense to be a part of the List, as different lists can have different quantities of the same Product.

### Image size and localStorage

localStorage usually has a limit of ~5-10 megabytes (per domain, depending on the browser).
Thus, image compression is used to store less data per Product. This makes the requirement for
max size of 3mb per image a bit unnecessary. Check out configs.js for raising this limit.
