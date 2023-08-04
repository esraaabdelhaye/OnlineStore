const store = document.querySelector(".store")
const catUL = document.querySelector(".categories")
const searchBtn = document.querySelector('.search-btn')
const searchBar = document.querySelector('.search-bar')
const logo = document.querySelector('.logo')
const applyFilter= document.querySelector('.apply-filter')
let basketItemsInfo = JSON.parse(localStorage.getItem('storageItemInfo')) || []
const alertMessage = document.querySelector('.alert')
const ItemsNumberPlaceHolder = document.querySelector('.items-number')

/*
!displaying items data
*/

window.addEventListener('load' , ()=>{
  fetchAll()
  ItemsNumber = JSON.parse(localStorage.getItem('storageItemsNumber')) || 0
  ItemsNumberPlaceHolder.textContent = ItemsNumber
})
logo.addEventListener('click', ()=>fetchAll())

function displayData(Items){
  console.log(Items);
  window.scrollTo(0,0)
  store.innerHTML = ''
  Items.forEach(Item=>{
    let {price , description , thumbnail , title ,id , discountPercentage , rating} = Item
    store.innerHTML += `
    <div class="item" id="product-id-${id}">
      <p class="delivery appear-delivery ${id%4==0?"":"disappear"}">Free delivery</p>
      <p class="discount ${discountPercentage>15?"":"disappear"} ">${discountPercentage}% <br>Sale</p>
      <img src=${thumbnail} alt="${id}">
      <div class="item-info">
          <h4>${title}</h4>
          <p class="description">${description.substr(0,70)}.....</p>
          <p class="rate">Rate: ${rating} ⭐⭐⭐⭐</p>
          <div class="controlers">
              <h3 class="price">$${price}</h3>
              <div class="cart">
                  <i onClick="incrementItem(${id})" class="fa-solid fa-cart-plus"></i>
              </div>
          </div>
      </div>
    </div>
    `
  })
}

function fetchAll(){
  fetch('https://dummyjson.com/products?limit=0')
  .then(res=>res.json())
  .then(data=>{ 
    displayData(data.products) 
    data.products.forEach(product=> basketItemsInfo.push({
      id: product.id,
      number : 0
    }))
    localStorage.setItem('storageItemInfo' , JSON.stringify(basketItemsInfo))
    const checkBoxes = document.querySelectorAll('[type="checkbox"]');
    checkBoxes.forEach(checkbox=>{
      if(checkbox.checked) checkbox.checked=false
    })
  })
  .catch(error => console.log( "We Caught This Error: " + error))
}

/*
!displaying the categories data in the side bar
*/

fetch('https://dummyjson.com/products/categories')
.then(res=>res.json())
.then(cats=>displayCategories(cats))

function displayCategories(cats){
  cats.forEach(cat=>{
    catUL.innerHTML+=`
    <li>
      <input type="checkbox" id="${cats.indexOf(cat)}"/>
      <label for="1">${cat}</label>
    </li>
    `
  })
}

/* 
!The search functionality 
*/

searchBtn.addEventListener("click" , ()=>{
  Search(searchBar.value);
})

searchBar.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    Search(searchBar.value)
  }
});

function Search(input){
  fetch(`https://dummyjson.com/products/search?q=${input}`)
  .then(res=>res.json())
  .then(data=>displayData(data.products))
}

/* 
!Filter by category
*/

applyFilter.addEventListener('click' , ()=>{
  const chexedCatsUrls = []
  const checkBoxes = document.querySelectorAll('[type="checkbox"]');
  checkBoxes.forEach(checkbox=>{
    if(checkbox.checked){
      const category= checkbox.parentNode.children[1].innerText;
      chexedCatsUrls.push(`https://dummyjson.com/products/category/${category}`)
    }
  })
  let requests = chexedCatsUrls.map(url=>fetch(url).then(res=>res.json()))
  Promise.all(requests)
  .then(data=>{
    const Items = data.map(item=>item.products)
    displayData(Items.flat())
  })
})

/* 
!Adding An Item To Cart
*/

function incrementItem(id){
  basketItemsInfo[id-1].number++;
  ItemsNumber++;
  ItemsNumberPlaceHolder.textContent = ItemsNumber
  localStorage.setItem('storageItemsNumber' , ItemsNumber)
  localStorage.setItem('storageItemInfo' , JSON.stringify(basketItemsInfo))

  alertMessage.style.animationName=""
  alertMessage.style.animationName="showAnimation"
  setTimeout(()=>{
    alertMessage.style.animationName=""
  }, 1000)
}




/**
 * TODO: Add transitions on hover
 * TODO: put 3 pages 7 products in each navigation through numbers
 * TODO: cart
 * TODO: Dark and Light Mode
 * TODO: alert on adding the item successfully
*/




