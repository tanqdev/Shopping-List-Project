// ==== DOM ELEMENTS ====
const itemForm = document.getElementById('item-form');      // Form to add items
const itemInput = document.getElementById('item-input');    // Input field for new item
const itemList = document.getElementById('item-list');      // UL element to display item list
const clrbtn = document.getElementById('clear');            // Clear all button
const itemFilter = document.getElementById('filter');       // Input to filter/search items
const formBtn = itemForm.querySelector('button');           // The submit/update button inside the form

let isEditMode = false; // Tracks whether user is editing an item

// ==== INITIAL DISPLAY ON LOAD ====
function displayItems() {
  const itemFromStorage = getItemFromStorage(); // Get saved items from localStorage
  itemFromStorage.forEach(item => addItemToDOM(item)); // Add each item to DOM
  checkUI(); // Update UI based on item presence
}

// ==== HANDLE FORM SUBMISSION ====
function onAddItemSubmit(e) {
  e.preventDefault(); // Prevent page reload

  const new_item = itemInput.value; // Get the new item input
  if (new_item === '') {
    alert('!! Please enter an item !!');
    return;
  }

  // If in edit mode, update the item
  if (isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-mode');
    removeItemFromStorage(itemToEdit.textContent); // Remove old item from storage
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove(); // Remove from DOM
    isEditMode = false;
  } else {
    if (checkIfItemExists(new_item)) {
      alert('That item is already in your list');
      return;
    }
  }

  addItemToDOM(new_item);          // Add to the list visually
  addItemToStorage(new_item);      // Add to localStorage

  checkUI();                       // Refresh UI
  itemInput.value = '';            // Clear input
  itemFilter.value = '';           // Reset filter input
  filterItem({ target: { value: '' } }); // Reset filter display
}

// ==== ADD ITEM TO DOM ====
function addItemToDOM(item) {
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(item));

  const button = createButton("remove-item btn-link text-red"); // Delete button
  li.appendChild(button);

  itemList.appendChild(li); // Add to the list
}

// ==== CREATE DELETE BUTTON ====
function createButton(classes) {
  const button = document.createElement('button');
  button.className = classes;
  const icon = createIcon("fa-solid fa-xmark"); // Cross icon
  button.appendChild(icon);
  return button;
}

// ==== CREATE ICON FOR BUTTON ====
function createIcon(classes) {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
}

// ==== ADD ITEM TO LOCAL STORAGE ====
function addItemToStorage(item) {
  const itemFromStorage = getItemFromStorage();
  itemFromStorage.push(item); // Add to array
  localStorage.setItem('items', JSON.stringify(itemFromStorage)); // Save
}

// ==== GET ITEMS FROM STORAGE ====
function getItemFromStorage() {
  let itemFromStorage;
  if (localStorage.getItem('items') === null) {
    itemFromStorage = [];
  } else {
    itemFromStorage = JSON.parse(localStorage.getItem('items'));
  }
  return itemFromStorage;
}

// ==== HANDLE CLICK ON ITEM LIST ====
function onClickItem(e) {
  // If clicked on delete icon
  if (e.target.parentElement.classList.contains('btn-link')) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    // Otherwise, switch to edit mode
    setItemToEdit(e.target);
  }
}

// ==== CHECK IF ITEM ALREADY EXISTS ====
function checkIfItemExists(item) {
  const itemFromStorage = getItemFromStorage();
  return itemFromStorage.includes(item);
}

// ==== ENTER EDIT MODE ====
function setItemToEdit(item) {
  isEditMode = true;

  // Remove edit mode from other items
  itemList.querySelectorAll('li').forEach(i => i.classList.remove('edit-mode'));
  item.classList.add('edit-mode'); // Highlight current item

  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update item'; // Change button text
  itemInput.value = item.textContent;                                // Load item into input
  formBtn.style.backgroundColor = '#228B22';                         // Change button color
}

// ==== REMOVE ITEM FROM DOM AND STORAGE ====
function removeItem(item) {
  item.remove(); // Remove from UI
  removeItemFromStorage(item.textContent); // Remove from storage
  checkUI(); // Refresh UI
}

// ==== REMOVE FROM LOCAL STORAGE ====
function removeItemFromStorage(item) {
  let itemFromStorage = getItemFromStorage();
  itemFromStorage = itemFromStorage.filter(i => i !== item); // Remove matching item
  localStorage.setItem('items', JSON.stringify(itemFromStorage)); // Save updated list
}

// ==== CLEAR ALL ITEMS ====
function clearAll() {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild); // Remove each item
  }
  localStorage.removeItem('items'); // Clear storage
  checkUI(); // Refresh UI
}

// ==== UPDATE UI (SHOW/HIDE FILTER & CLEAR BUTTONS) ====
function checkUI() {
  itemInput.value = '';
  const items = itemList.querySelectorAll('li');
  if (items.length === 0) {
    clrbtn.style.display = 'none';
    itemFilter.style.display = 'none';
  } else {
    clrbtn.style.display = 'block';
    itemFilter.style.display = 'block';
  }

  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item'; // Reset button
  formBtn.style.backgroundColor = '#333';
  isEditMode = false;
}

// ==== FILTER FUNCTION FOR SEARCH BAR ====
function filterItem(e) {
  const items = itemList.querySelectorAll('li');
  const text = e.target.value.toLowerCase(); // Get search query

  items.forEach(item => {
    const itemName = item.childNodes[0].textContent.trim().toLowerCase();

    let match = true;
    for (let i = 0; i < text.length; i++) {
      if (itemName[i] !== text[i]) {
        match = false;
        break;
      }
    }

    // Show or hide items based on match
    item.style.display = match ? 'flex' : 'none';
  });
}

// ==== INITIALIZE EVERYTHING ====
function init() {
  itemForm.addEventListener('submit', onAddItemSubmit); // Form submit
  itemList.addEventListener('click', onClickItem);      // Click on list item
  clrbtn.addEventListener('click', clearAll);           // Clear all button
  itemFilter.addEventListener('input', filterItem);     // Search input
  document.addEventListener('DOMContentLoaded', displayItems); // Load saved items
  checkUI(); // Initial UI setup
}

init(); // Start everything
