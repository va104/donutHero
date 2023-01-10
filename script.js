let basketAmount = [];
let basketFood = [];
let basketPrice = [];

function init(){
  includeHTML()
  ;renderDonuts()
  ;respMenu() 
}

// ===================================================================================
// Render Functions
// ===================================================================================


function renderDonuts() {
  let donutSection = document.getElementById('dynamicContent');
  donutSection.innerHTML = '';
  for (let i = 0; i < donuts.length; i++) {
    let name = donuts[i].name;
    let filling = donuts[i].filling;
    let topping = donuts[i].topping;
    let price = donuts[i].price;
    let img = donuts[i].img;
    
    donutSection.innerHTML += HTMLTemplateDonuts(name, filling, topping, price, img, i)
  }
}

function renderFilteredDonuts(newDonutArray) {
  let donutSection = document.getElementById('dynamicContent');
  donutSection.innerHTML = "";
  
  for (let i = 0; i < newDonutArray.length; i++) {
    let searchName = newDonutArray[i].name;
    let filling = newDonutArray[i].filling;
    let topping = newDonutArray[i].topping;
    let price = newDonutArray[i].price;
    let img = newDonutArray[i].img;
    // the new Array have wrong IDs for the index
    let result = searchforIndex(searchName);
    donutSection.innerHTML += HTMLTemplateDonuts(searchName, filling, topping, price, img, result)
  }
}

function searchforIndex(searchName){
  // let result = 0;
  for (let y = 0; y < donuts.length; y++) {
    food = donuts[y].name.indexOf(searchName);
    if (food != -1) {
      return y;
    }
  }
}

function renderPaySection() {
  let paySection = document.getElementById('pay-button');
  paySection.innerHTML = ""
  // just for filled basket
  if(basketAmount.length > 0){
  let subtotal = null;
  let total = null;
  let deliveryCosts = 6.95;
  for (let i = 0; i < basketAmount.length; i++) {
    subtotal += basketAmount[i] * basketPrice[i];
  }
  if (subtotal > 6.95) {
    deliveryCosts = 0;
  }
  total = subtotal + deliveryCosts;
  let formattedSubtotal = formattedPrice(subtotal);
  let formattedDelCost = formattedPrice(deliveryCosts);
  let formattedTotal = formattedPrice(total);
  paySection.innerHTML = HTMLTemplateBasketPaying(formattedSubtotal, formattedDelCost, formattedTotal);
  // for the responsive Basket
  respBasket.innerHTML = /*html*/ `<div onclick="showRespBasket()"> Warenkorb (${formattedTotal} €)</div>`
}
else{
  respBasket.innerHTML = /*html*/ `<div onclick="showRespBasket()"> Dein Warenkorb ist leer</div>`
  renderBasket()
  }
}

function showRespBasket(){
  document.getElementById('donut').style.display = "none";
  document.getElementById('sectionSection').style.display = "block";
  document.getElementById('respBasket').style.display = "none";
  document.getElementById('main').style.display = "none";
  document.getElementById('backToMenu').style.display = "block";
}

function backToMenu(){
  document.getElementById('donut').style.display = '';
  document.getElementById('sectionSection').style.display = '';
  document.getElementById('respBasket').style.display = '';
  document.getElementById('main').style.display = '';
  document.getElementById('backToMenu').style.display = '';
}

function renderBasket() {
  if(basketFood.length == 0){
    emptyBasket()
  }
  let basket = document.getElementById('shopping-cart');
  basket.innerHTML = "";
  for (let i = 0; i < basketFood.length; i++) {
    let amount = basketAmount[i];
    let food = basketFood[i];
    let price = basketPrice[i];
    let total = price * amount;
    let priceFormatted = formattedPrice(total);
    basket.innerHTML += HTMLTemplateBasketOrder(amount, food, priceFormatted, i);
  }
}
// ===================================================================================
// Filter Function
// ===================================================================================
function donutFilter(assign) {
  if (assign == 'filterAll-donuts') {
    renderDonuts()
  } else {
    //filter for different donut categories
    let newDonutArray = donuts.filter((item) => {
      return item.category.includes(assign);
    }
    )
    // render the new Array with filtered Donuts
    renderFilteredDonuts(newDonutArray)
  }
}
// ===================================================================================
// HTML Templates
// ===================================================================================
function HTMLTemplateDonuts(name, filling, topping, price, img, i) {
  let priceFormatted = formattedPrice(price);
  return /*html*/ `<div class="margin-section1 allDonuts">
    <div class="food-container">
      <div class="flex-img">
        <div class="food-img">
          <img src=${img} alt="donut">
        </div>
      </div>
      <div class="food-filling">
        <div class="food-name">
          <div class="food-header">${name}</div>
          <div class="sub-header">Füllung: ${filling}</div>
          <div class="sub-header">Topping: ${topping}</div>
        </div>
        <div class="food-price">${priceFormatted} €</div>
    </div>
    <div onclick="addItemToBasket(${i}, '${name}')" class="addToBasket"></div>
  </div>
</div>`;
}

function HTMLTemplateBasketOrder(amount, food, price, i){
  // add or remove the d-none class for the basket section 
  document.getElementById('basket-content').classList.remove('d-none');
  document.getElementById('empty-basket').classList.add('d-none');
  return /*html*/ `
  <div class="order-container">
    <div class="order_plus_mins">
      <div class="order">
        <div class="order-quantity">${amount}</div>
        <div class="order-price">
          <div>${food}</div>
          <div>${price} €</div>
        </div>
      </div>
      <div class="plus-minus-container">
        <img onclick="deleteFood(${i})" src="img/delete.png" alt="Delete">
        <div onclick="plusAmount(${i})" class="plus"></div>
        <div onclick="minusAmount(${i})" class="minus"></div>
      </div>
    </div>
  </div>`
}

function HTMLTemplateBasketPaying (subtotal, deliveryCosts, Total){
  return  /*html*/ ` 
  <div class="costs">
    <div>Zwischensumme</div>
    <div>${subtotal} €</div>
  </div>
  <div class="costs">
    <div>Lieferkosten</div>
    <div>${deliveryCosts} €</div>
  </div>
  <div class="costs">
    <div class="total">Gesamt</div>
    <div class="total">${Total} € </div>
  </div>
  <button onclick="paymentProcess()" class="button" type="submit">Bezahlen (${Total} €)</button>`

}

// ===================================================================================
// Functions for Basket
// ===================================================================================
function addItemToBasket(i, name) {
  let index = basketFood.indexOf(name);
  if (index == - 1) {
    basketAmount.push(1);
    basketFood.push(donuts[i].name);
    basketPrice.push(donuts[i].price);
  } else (
    basketAmount[index]++
  )
  renderBasket();
  renderPaySection();
}

// Formatted Price 
function formattedPrice(price){
  return price.toFixed(2).replace('.', ',');
}

// Display-none Property
function emptyBasket(){
  document.getElementById('basket-content').classList.add('d-none');
  document.getElementById('empty-basket').classList.remove('d-none');
}

// Minus: If only 1 element is in the array, delete all related items
function minusAmount(i){
  if(basketAmount[i] == 1){
    deleteFood(i)
  } else{
    basketAmount[i]--;
    renderBasket();
    renderPaySection();
  }
}

// Plus: Amount increases 1
function plusAmount(i){
  basketAmount[i]++;
  renderBasket();
  renderPaySection();
}

// Trash: Delete Food in Array
function deleteFood(i){
    basketAmount.splice(i, 1);
    basketPrice.splice(i, 1);
    basketFood.splice(i, 1);

    renderBasket();
    renderPaySection();
}

// ===================================================================================
// Optic, Color-Changes & Pop-up-Menu
// ===================================================================================

function colorChange(activeLink) {
  //set the background color to none for every link
  let allLinks = document.getElementsByClassName('item');
  for (let i = 0; i < allLinks.length; i++) {
    allLinks[i].style.backgroundColor = "";
  }

  //set the active Link to another color 
  let active = document.getElementById(activeLink);
  active.style.backgroundColor = "#BC7587";
}

//Pop-up-menu for Completing the Order order deleting an item
function paymentProcess(){
  let popUpSection = document.getElementById('pop-up-menu');
  popUpSection.innerHTML = '';
  popUpSection.classList.remove('no-display');
  popUpSection.innerHTML = /*html*/ `
    <div class="pop-up">
      <h1>Bestellung abschließen</h1>
      <div class="yes-abort-button">
          <a onclick="completeOrder()" class="yes" href="#">Ja</a>
          <a onclick="abortOrder()" class="abort" href="#">Abbrechen</a>
      </div>
    </div>
  `
}

function abortOrder(){
  let popUpSection = document.getElementById('pop-up-menu');
  popUpSection.classList.add('no-display');
  
  //without this property the Viewport starts at the top of the page
  // Timeout-Function is required for working!
  let donutSection = document.getElementById('donut').offsetTop;
  setTimeout(() => {
    window.scrollTo(0, donutSection);
  },1);
}

function completeOrder(){
  let popUpSection = document.getElementById('pop-up-menu');
  popUpSection.classList.add('no-display');
  
  // redirect to the complete Order Section
  window.location.href = "order.html"
}

function respMenu() {
  let acc = document.getElementsByClassName("accordion");
      acc[0].addEventListener("click", function () { 
          /* Toggle between hiding and showing the active panel */
          var panel = this.nextElementSibling;
          panel.style.display = "block";
      });
  }

  function respDonutMenu(text){
    let acc = document.getElementById("respPanel");
    acc.style.display = "none";
    let button = document.getElementById("respButton");
    // button.innerHTML = "";
    button.innerHTML = text
  }
// ===================================================================================
// Template Function for Header and Footer
// ===================================================================================

function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      /* Make an HTTP request using the attribute value as the file name: */
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) { elmnt.innerHTML = this.responseText; }
          if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
          /* Remove the attribute, and call this function once more: */
          elmnt.removeAttribute("w3-include-html");
          includeHTML();
        }
      }
      xhttp.open("GET", file, true);
      xhttp.send();
      /* Exit the function: */
      return;
    }
  }
}

