// Constructor function used to create the product objects
function Product(name, price, image, quantity) {
    this.name = name;
    this.price = price;
    this.image = image;
    this.quantity = quantity;
}

// onload function of catalogue page
function loadCataloguePage() {
    linkAddToCartButtonClickEventsToFunctions();
}

// onload function of cart page
function loadCart() {
    addRowsToCartPage();
    updatingSubTotals();
}

// looping through the array to add a click eventlistener to the add to cart buttons
function linkAddToCartButtonClickEventsToFunctions() {
    let btnAddToCart = document.getElementsByClassName("btnAddToCart");
    for (let i = 0; i < btnAddToCart.length; i++) {
        let button = btnAddToCart[i];
        button.addEventListener("click", addToCartFromCataloguePage);
    }
} 

// function gets the details of the product that was clicked on the catalogue page and calculates the total incl VAT
// the updateLocalStorage function is called
// the subtotalPlusVat is calculated and alerted when an item is clicked
function addToCartFromCataloguePage(event) {
    let button = event.target;
    let catItemElement = button.parentElement;
    // element at [0] because there is only one element with class name
    let title = catItemElement.getElementsByClassName("catItemHeading")[0].innerText;      
    let priceWithCurrency = catItemElement.getElementsByClassName("itemPrice")[0].innerText;
    let img = catItemElement.getElementsByClassName("catItemImg")[0].src;
    
    // Removing "R" from string using substring method https://www.w3schools.com/jsref/jsref_substring.asp
    let itemPriceExcludingVat = priceWithCurrency.substring(1, priceWithCurrency.length); 

    updateLocalStorage(title, itemPriceExcludingVat, img);
    
    // alerting the total of the cart 
    let subtotalPlusVat = calculateSubtotalPlusVat();
    alert(`Your item has been added to your cart. \nYour current total incl. VAT is R${subtotalPlusVat}`);
}

// calculating the subtotalPlus Vat
// if an item has been added to cart before then the products are retrieved from local storage
// the subtotalPlusVat is calculated and returned
// function called when the add to cart btn is clicked in catalogue page
function calculateSubtotalPlusVat() {
    let subtotalPlusVat = 0;

    if (localStorage.getItem("hasCodeRunBefore") != null) {
        let productsArray = JSON.parse(localStorage.getItem("products"));
        productsArray.forEach(product => {
            subtotalPlusVat = subtotalPlusVat + (product.price * 1.15 * product.quantity);
        });
    }

    return subtotalPlusVat;
}

// function is called on load of the cart page
// function updates the sub-totals, vat and subtotal + vat in the cart
function updatingSubTotals() {
    let subtotals = 0;
    if (localStorage.getItem("hasCodeRunBefore") != null) {
        let productsArray = JSON.parse(localStorage.getItem("products"));
        productsArray.forEach(product => {
            subtotals = subtotals + (parseInt(product.price) * product.quantity);
        });
    }
    document.getElementsByClassName("cartSubTotalPrice")[0].innerText = 'R' + subtotals;

    let vat = subtotals * 0.15;
    document.getElementsByClassName("cartVATPrice")[0].innerText = 'R' + vat;

    let subtotalPlusVat = subtotals + vat;
    document.getElementsByClassName("cartSubTotalPlusVatPrice")[0].innerText = 'R' + subtotalPlusVat;

    let totalPrice = document.getElementsByClassName("cartTotalPrice")[0];
    totalPrice.innerText = "R" + subtotalPlusVat;
} 

// adds the items that are added to the cart into localstorage
function updateLocalStorage(title, price, image) {
    // if an item has been added to the cart, hasCodeRunBefore is set to true.
    if (localStorage.getItem("hasCodeRunBefore") === null) {
        localStorage.setItem("hasCodeRunBefore", true);
        localStorage.setItem("products", "[]");
    }
    // The products are retrieved from localStorage and assigned to the array 'productsArray'
    let productsArray = JSON.parse(localStorage.getItem("products")); 
    
    let productAndIndex = getProductAndIndexByTitle(title);
    
    // creating variables to be assigned if the product is found
    let existingProduct = productAndIndex.product;
    let existingProductIndex = productAndIndex.index;
    
    // checking if the product is found, the quantity is updated and the product is updated in the product array
    if (existingProduct != null) {
        existingProduct.quantity = existingProduct.quantity + 1;
        productsArray[existingProductIndex] = existingProduct;        
    } else {
        // add product to products array
        let newProduct = new Product(title, price, image, 1);
        productsArray.push(newProduct);
    }        
    
    // save to local storage
    localStorage.setItem("products", JSON.stringify(productsArray));
}

// populate the cart page rows with the product details
function addRowsToCartPage() {
    if (localStorage.getItem("hasCodeRunBefore") != null) {
        // get products from localStorage
        let productsArray = JSON.parse(localStorage.getItem("products"));
        productsArray.forEach(product => {
            addRowToCartPage(product.name, product.price, product.image);
        });
    }
}

// populate the row added above with product
function addRowToCartPage(name, price, image) {
    let cartItems = document.getElementsByClassName("cartItems")[0];
    let cartItemTitles = cartItems.getElementsByClassName("cartItemTitle");
    
    for (let i = 0; i < cartItemTitles.length; i++) {
        if (cartItemTitles[i].innerText == name) {
            return; // exit the function immediately if the item is already added to the cart
        }
    }
    
    // creating a new cart row in html
    var cartRow = document.createElement('div');
    cartRow.classList.add("cartRow");
    
    // set the cart row contents
    let cartRowContents = `
    <div class="cartItem cartColumn">
    <img class="cartItemImg" src="${image}" width="100" height="100">
    <span class="cartItemTitle">${name}</span>
    </div>
    <span class="cartPrice cartColumn">${price}</span>
    <div class="cartQuantity cartColumn">
    <input class="cartQuantityInput" type="number" value="1">
    <button class="btn btn-danger" type="button">REMOVE</button>
    </div>`
    cartRow.innerHTML = cartRowContents;
    
    // add cart row to the html page
    cartItems.append(cartRow);
    
    // adding click eventlistener to the remove button
    cartRow.getElementsByClassName("btn-danger")[0].addEventListener("click", removeCartItem);
    cartRow.getElementsByClassName("cartQuantityInput")[0].addEventListener("change", quantityChanged);
}

function linkRemoveFromCartButtonClickEventsToFunctions() {
    let removeCartItemBtn = document.getElementsByClassName("btn-danger");
    for (let i = 0; i < removeCartItemBtn.length; i++) {
        let button = removeCartItemBtn[i];
        button.addEventListener("click", removeCartItem);
    }
}

// when the remove button is clicked the item row is removed from the cart and local storage and the totals are updated
function removeCartItem(event) {
    let buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove();
    
    
    let cartRowElement = buttonClicked.parentElement.parentElement;
    let cartItemTitleElement = cartRowElement.getElementsByClassName("cartItemTitle")[0];
    let title = cartItemTitleElement.innerText;
    
    let productsArray = JSON.parse(localStorage.getItem("products")); 

    let productAndIndex = getProductAndIndexByTitle(title);

    let indexOfProductToRemove = productAndIndex.index;
    
    productsArray.splice(indexOfProductToRemove, 1);
    
    localStorage.setItem("products", JSON.stringify(productsArray));
    
    updatingSubTotals();
}

// displays the coupon discount (R50) when the apply button is clicked
function applyCouponButtonClicked() {
    document.getElementsByClassName("cartCouponPrice")[0].innerText = 'R' + 50;
    updatingTotalIfCouponApplied();
}

// Subtracting the coupon discount from the total price
function updatingTotalIfCouponApplied() {
    let total = calculateSubtotalPlusVat();
    let couponDiscount = document.getElementsByClassName("cartCouponPrice")[0];
    let totalPrice = document.getElementsByClassName("cartTotalPrice")[0];

    if (couponDiscount.innerText.includes("50")) {
        totalPrice.innerText = 'R' + (total - 50);
    } else {
        totalPrice.innerText = 'R' + total;
    }
}

// if next day delivery is chosen, the delivery total is changed to R100
function nextDayDeliveryChosen() {
    document.getElementsByClassName("cartDeliveryPrice")[0].innerText = 'R' + 100;
    updatingTotalAfterDeliveryChosen();
}

// if three day delivery is chosen, the delivery total is changed to R45
function threeDayDeliveryChosen() {
    document.getElementsByClassName("cartDeliveryPrice")[0].innerText = 'R' + 45;
    updatingTotalAfterDeliveryChosen();
}

function updatingTotalAfterDeliveryChosen() {
    let totalPriceWithCurrencyElement = document.getElementsByClassName("cartTotalPrice")[0];
    let totalPrice = totalPriceWithCurrencyElement.innerText.substring(1, totalPriceWithCurrencyElement.innerText.length);
   
    let deliveryAmountWithCurrency = document.getElementsByClassName("cartDeliveryPrice")[0].innerText;
    let deliveryAmountString = deliveryAmountWithCurrency.substring(1, deliveryAmountWithCurrency.length);
    let deliveryAmount = parseInt(deliveryAmountString);

    if (deliveryAmount == 100) {
        totalPriceWithCurrencyElement.innerText = "R" + (parseInt(totalPrice) + 100);
    } else {
        totalPriceWithCurrencyElement.innerText = "R" + (parseInt(totalPrice) + 45);
    }
}

/* /[]/g =RegExp Modifier. Matches character in [] and replaces it with the returned values
math.random creates a number from 0-1. *16 | 0 converts the number to an integer
I used this link to generate the number:
https://newbedev.com/auto-generate-reference-number-is-javascript-code-example */

function createReference() {
    return "xxxx-4xxx-yxxx".replace(/[xy]/g,         
    function(c) {
        var r = Math.random() * 16 | 0, 
        v = (c == 'x') ? r : (r & 0x3 | 0x8);
            
            return v.toString(16);
        });
}

// after the confirm order button is clicked the cart is emptied using the clear() method
function confirmOrder() {
    let referenceNumber = createReference();
    alert (`Thank You for shopping with us! \nYour Reference Number is ${referenceNumber}`); // \n = new line

    // clearing the shopping cart after order is confirmed
    clearLocalStorage();

    // clearing rows 
    let cartItems = document.getElementsByClassName("cartItems")[0];
    cartItems.innerHTML = "";

    // clearing the coupon discount amount in totals 
    document.getElementsByClassName("cartCouponPrice")[0].innerText = 'R' + 0;

    // clearing the discount chosen
    document.getElementsByClassName("cartDeliveryPrice")[0].innerText = 'R' + 0;

    updatingSubTotals();
}

function clearLocalStorage() {
    localStorage.clear();
}

// if the quantity is changed in the cart, update totals and set to products array in storage
function quantityChanged(event) {

    // find out product title
    let inputElement = event.target;
    let quantity = inputElement.valueAsNumber; // get quantity from input

    let parentElement = inputElement.parentElement.parentElement;
    let cartItemTitleElement = parentElement.getElementsByClassName("cartItemTitle")[0];
    let title = cartItemTitleElement.innerText;

    let productAndIndex = getProductAndIndexByTitle(title);
    
    // creating empty variables to be assigned if the product is found
    let existingProduct = productAndIndex.product;
    let existingProductIndex = productAndIndex.index;
    
    existingProduct.quantity = quantity;
    
    // // The products are retrieved from localStorage and assigned to the array 'productsArray'
    let productsArray = JSON.parse(localStorage.getItem("products")); 

    productsArray[existingProductIndex] = existingProduct;        

    localStorage.setItem("products", JSON.stringify(productsArray));

    updatingSubTotals();
}

// retrieving the product title and the index from the product array
function getProductAndIndexByTitle(title) {
    let productsArray = JSON.parse(localStorage.getItem("products")); 

    // looping through arrray to find the product with the same name
    for (let i = 0; i < productsArray.length; i++) {
        let product = productsArray[i];
        if (product.name === title) {
            return { product, index: i };
        }
    }

    return { product: null, index: null };
}

/* ************RESOURCES USED*******
- https://www.youtube.com/watch?v=YeFzkC2awTM&t=545s - JavaScript Shopping Cart Tutorial for Beginners
- https://www.youtube.com/watch?v=k8yJCeuP6I8 -How to use Local Storage in JavaScript
- https://www.youtube.com/watch?v=cNjIUSDnb9k&t=460s - Callbacks in JavaScript Explained!
*/