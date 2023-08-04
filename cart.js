const cartContaner = document.querySelector('.cart-container')
const cartItems = JSON.parse(localStorage.getItem('storageItemInfo'))
let ItemsNumber = JSON.parse(localStorage.getItem('storageItemsNumber')) || 0

window.addEventListener('load' , ()=>{

    fetchById(cartItems)
})

function fetchById(products){
    
    products.forEach(product=>{
        if(product.number!=0){
            fetch(`https://dummyjson.com/products/${product.id}`)
            .then(res=>res.json())
            .then(item=>displayItem({...item , number:product.number}))
        }
    })
    
}


function displayItem(Item){
    const {id , title ,price , thumbnail , description , rating , discountPercentage , number} = Item
    cartContaner.innerHTML+=
    `
    <div class="cart-item item" id="product-id-${id}">
        <p class="delivery delivery-cart ${id%4==0?"":"disappear"}">Free delivery</p>
        <p class="discount ${discountPercentage>15?"":"disappear"} ">${discountPercentage}% <br>Sale</p>
        <img src='${thumbnail}' alt="${id}">
        <div class="item-info">
            <h4>${title}</h4>
            <p class="description">${description}</p>
            <p class="rate">Rate: ${rating} ⭐⭐⭐⭐</p>
            <div class="cart-controlers">
                <h3 class="price">$${price}</h3>
                <p class="prodcut-number product-number-${id}">Number Of Items : <span>${number}</span></p>
                <div class="cart-btns">
                    <button onClick="removeFromCart(${id})" class="remove">Remove</button>
                    <button onClick="incrementCartItem(${id})" class="plus"><i class="fa fa-plus"></i></button>
                    <button onClick="decrementCartItem(${id})" class="minus"><i class="fa fa-minus"></i></button>
                </div>
            </div>
        </div>
    </div>
    `
}

function incrementCartItem(id){
    document.querySelector(`.product-number-${id}`).innerHTML = `Number Of Items : <span>${cartItems[id-1].number+1}</span>` 
    cartItems[id-1].number++;
    localStorage.setItem('storageItemInfo' , JSON.stringify(cartItems))
    ItemsNumber++
    localStorage.setItem('storageItemsNumber' , ItemsNumber)
}
function decrementCartItem(id){
    if(cartItems[id-1].number!=1){
        document.querySelector(`.product-number-${id}`).innerHTML = `Number Of Items : <span>${cartItems[id-1].number-1}</span>` 
        cartItems[id-1].number--
        ItemsNumber--
        localStorage.setItem('storageItemsNumber' , ItemsNumber)
    }
    else{
        removeFromCart(id)
    }
    localStorage.setItem('storageItemInfo' , JSON.stringify(cartItems))
}

function removeFromCart(id){
    ItemsNumber-=cartItems[id-1].number
    cartItems[id-1].number = 0
    localStorage.setItem('storageItemInfo' , JSON.stringify(cartItems))
    cartContaner.innerHTML = ''
    fetchById(cartItems)
    localStorage.setItem('storageItemsNumber' , ItemsNumber)
}