'use strict';

const STORE = {
	items: [
		{name: 'apples', checked: false, filtered: false},
		{name: 'oranges', checked: false, filtered: false},
		{name: 'milk', checked: true, filtered: false},
		{name: 'bread', checked: false, filtered: false}
	],
  hideChecked: false,
  searchList: false
};


function generateItemElement(item, itemIndex, template) {
  return `
    <li class="js-item-index-element" data-item-index="${itemIndex}">
      <span class="shopping-item js-shopping-item ${item.checked ? "shopping-item__checked" : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
      </div>
    </li>`;
}


function generateShoppingItemsString(shoppingList) {
  console.log("Generating shopping list element");

  const items = shoppingList.map((item, index) => generateItemElement(item, index));
  
  return items.join("");
}


function renderShoppingList() {
  // render the shopping list in the DOM
  console.log('`renderShoppingList` ran');
  let shoppingListItemsString;

  if (STORE.hideChecked) {
    const uncheckedItemFilter = STORE.items.filter(item => (item.checked === false));
    shoppingListItemsString = generateShoppingItemsString(uncheckedItemFilter);
  }
  else if(STORE.searchList){
    const searchFilter = STORE.items.filter(item => item.filtered === true);
    shoppingListItemsString = generateShoppingItemsString(searchFilter);
  }
  else {
    shoppingListItemsString = generateShoppingItemsString(STORE.items);
  }

  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}


function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.items.push({name: itemName, checked: false});
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').on('click', '[name="addItem"]', function(event) {
    event.preventDefault();
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

function searchItemFilter(item){
  
}

function handleSearchItem(){
  $('#js-shopping-list-form').on('click', '[name="searchButton"]', function(event) {
    console.log('`search` ran');
    event.preventDefault();
    const filteredItem = $('.js-search-shopping-list').val();
    $('.js-search-shopping-list').val("");
    const searchedItem = STORE.items.find(item => item.name === filteredItem);
    if(searchedItem !== undefined){
      searchedItem.filtered = true;
      STORE.searchList = true;
      renderShoppingList();
    } else {
      alert("Sorry not in list");
    };
   
    console.log(STORE);

    // getItemIndexFromElement()
    // STORE.searchList = true;
    // renderShoppingList();
    
    // const newItemName = $('.js-shopping-list-entry').val();
    // $('.js-shopping-list-entry').val('');
    // addItemToShoppingList(newItemName);
    // renderShoppingList();
  });
}

function toggleCheckedForListItem(itemIndex) {
  console.log("Toggling checked property for item at index " + itemIndex);
  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}


function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', `.js-item-toggle`, event => {
    console.log('`handleItemCheckClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

function deleteFromListItems(index){
  STORE.items.splice(index, 1);
  console.log(STORE);
}

function handleDeleteItemClicked() {
  // this function will be responsible for when users want to delete a shopping list
  // item
   $('.js-shopping-list').on('click', `.js-item-delete`, event => {
    console.log('`handleItemDelete` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    deleteFromListItems(itemIndex);
    renderShoppingList();
  });
  console.log('`handleDeleteItemClicked` ran')
}

function displayCheckedItems(){
  $('#hide_checkitems').change(function(){
    console.log('displayCheckedItems ran')
    if($(this).is(':checked')){
      STORE.hideChecked = true
    } else {
      STORE.hideChecked = false;
    } renderShoppingList();
  });

}

// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  displayCheckedItems();
  handleSearchItem();
}



// when the page loads, call `handleShoppingList`
$(handleShoppingList);