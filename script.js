const loadCategory=()=>{
    const url ="https://taxi-kitchen-api.vercel.app/api/v1/categories"
    fetch(url)
    .then((res)=> res.json())
    .then((data)=> displayCategory(data.categories))
}
const loadFoods =(id)=>{
    //console.log("clicked",id)
    document.getElementById("food-container").classList.add("hidden")
    document.getElementById("loading-spinner").classList.remove("hidden")

    const url = `https://taxi-kitchen-api.vercel.app/api/v1/categories/${id}`
    const catBtns = document.querySelectorAll(".btn-category")
    //console.log(catBtns)
    catBtns.forEach(btn => btn.classList?.remove("active"))
    const currentBtn=document.getElementById(`cat-btn-${id}`)
    currentBtn.classList?.add("active");
    fetch(url)
    .then(res=> res.json())
    .then(data => displayFoods(data.foods))
    //console.log(currentBtn)
    
    

}
const randomFoods =(id)=>{
    //console.log("clicked",id)
    const url = `https://taxi-kitchen-api.vercel.app/api/v1/foods/random`
    fetch(url)
    .then(res=> res.json())
    .then(data => displayFoods(data.foods))
    
}
const loadFoodDetails=(id)=>{
    const url =` https://taxi-kitchen-api.vercel.app/api/v1/foods/${id}`
    fetch(url)
    .then(res => res.json())
    .then(data => displayDetails(data.details))

}
const displayFoods=(foods)=>{
    const foodContainer = document.getElementById("food-container")
    foodContainer.innerHTML = "";
    for(let food of foods)
    {
        const foodCard = document.createElement("div")
        foodCard.innerHTML=
        `
          <div  class="p-5 bg-white flex gap-3 shadow rounded-xl">
            <div class="img flex-1">
              <img onclick="loadFoodDetails(${food.id})"
                src="${food.foodImg}"
                alt=""
                class="food-img w-[160px] rounded-xl h-[160px] object-cover"
              />
            </div>
            <div class="flex-2">
              <h1 class="food-title text-xl font-bold food-title">
                ${food.title}
              </h1>

              <div class="badge badge-warning">${food.category}</div>

              <div class="divider divider-end">
                <h2 class="text-yellow-600 font-semibold">
                  $ <span class="food-price">${food.price}</span> BDT
                </h2>
              </div>

              <button onclick="addToCart(this,event)" class="btn btn-warning">
                <i class="fa-solid fa-square-plus"></i>
                Add This Item
              </button>
            </div>
         
        `
        foodContainer.append(foodCard)
    }
    document.getElementById("food-container").classList.remove("hidden")
    document.getElementById("loading-spinner").classList.add("hidden")
}

const displayDetails =(food) =>{
    const detailsContainer = document.getElementById("details-container")
    detailsContainer.innerHTML = 
    `
        <div class="">
            <h2 class="text-3xl font-bold">${food.title}</h2>
            <img src="${food.foodImg}" alt="" class="">
        </div>
        <div class="badge badge-primary">
            ${food.area}
        </div>
        <a href="${food.video}" target="_blank " class="btn btn-warning">Watch Video</a>
    `
    document.getElementById("my_modal_3").showModal()

}

const displayCategory=(categories)=>{
    const catContainer = document.getElementById("category-container")
    //console.log(catContainer)
    catContainer.innerHTML="";
    for(let cat of categories)
    {
        // console.log(cat)
        const categoryCard = document.createElement("div")
        categoryCard.innerHTML =`
            <button id="cat-btn-${cat.id}" onclick="loadFoods(${cat.id})" class="btn justify-start btn-block shadow btn-category">
                <img
                src="${cat.categoryImg}"
                alt=""
                class="w-10"
                />${cat.categoryName}
            </button>
        
        `;
        catContainer.append(categoryCard)

    }
}

loadCategory()
randomFoods()


// cart functionality
// document.getElementById("food-container").addEventListener("click",(e)=>{
//   console.log(e.target)
// })\
let cart = [];
let total =0

const addToCart =(btn,event)=>{
  event.stopImmediatePropagation()
  const card = btn.parentNode.parentNode
  const foodTitle = card.querySelector(".food-title").innerText
  const foodImg = card.querySelector(".food-img").src
  const foodPrice = card.querySelector(".food-price").innerText
  const foodPriceNum = Number(foodPrice)
  //console.log(foodTitle,foodImg,foodPrice)
  //console.log("add to cart button clicked",btn)

  let existingItem = cart.find(item => item.foodTitle === foodTitle);
   if(existingItem){
      existingItem.quantity++;   // increase quantity
      total += foodPriceNum;
  } else {
      const selectedItem = {
        id: cart.length + 1,
        quantity: 1,
        foodTitle,
        foodImg,
        foodPrice: foodPriceNum
      };
      cart.push(selectedItem);
      total += foodPriceNum;
  }

  displayCart(cart)
  displayTotal(total)
}
const displayTotal=(val)=>{
  document.getElementById("cart-total").innerHTML = val
}
const displayCart =(cart)=>{
    const cartContainer =document.getElementById("cart-container")
    cartContainer.innerHTML ="";

    for(let item of cart)
    {
      const newItem = document.createElement("div")
      newItem.innerHTML =`
       <div class="p-1 bg-white flex gap-3 shadow rounded-xl relative">
            <div class="img">
              <span class="hidden cart-id">${item.id}</span>
              <img
                src="${item.foodImg}"
                alt=""
                class="w-[50px] rounded-xl h-[50px] object-cover"
              />
            </div>
            <div class="flex-1">
              <h1  class="text-xs font-bold food-title">
                ${item.foodTitle}
              </h1>

              <div class="">
                <h2 class="text-yellow-600 font-semibold">
                 ${item.quantity} x $ <span class="item-price">${item.foodPrice}</span> BDT
                </h2>
                
              </div>
            </div>
            <div onclick="removeCart(this)"
              class="w-6 h-6 flex justify-center items-center bg-red-600 rounded-full absolute -top-1 -right-1 text-white cursor-pointer"
            >
              <i class="fa-solid fa-xmark"></i>
            </div>
          </div>`
          cartContainer.append(newItem)

    }
}
const removeCart=(btn)=>{
  const item = btn.parentNode;

  const id = Number(item.querySelector(".cart-id").innerText);

  const foodPrice = Number(item.querySelector(".item-price").innerText);

  cart = cart.filter((item) => item.id != id);

  total = 0;
  cart.forEach((item) => (total += item.foodPrice));

  displayCart(cart);
  displayTotal(total);
}