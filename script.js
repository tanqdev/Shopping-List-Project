const itemForm=document.getElementById('item-form');
const itemInput=document.getElementById('item-input');
const itemList=document.getElementById('item-list');
const clrbtn=document.getElementById('clear');
const itemFilter=document.getElementById('filter');
const formBtn=itemForm.querySelector('button');
let isEditMode=false;

function displayItems(){
  const itemFromStorage=getItemFromStorage();
  itemFromStorage.forEach(item=>addItemToDOM(item));
  checkUI();
}
//Add items
function onAddItemSubmit(e){
  e.preventDefault();
  const new_item=itemInput.value;
  if (new_item===''){
    alert('!! Please enter an item !!');
    return;
  }
  //Check for edit mode
  if (isEditMode){
    const itemToEdit=itemList.querySelector('.edit-mode');
    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
    isEditMode=false;
  }
  else{
    if(checkIfItemExists(new_item)){
      alert('That item is already in your list');
      return;
    }
  }
  //Create item DOM element
  addItemToDOM(new_item);
  
  //Add item to local storage
  addItemToStorage(new_item);

  checkUI();

  itemInput.value='';  // Clear input
  itemFilter.value = '';  // Clear filter input
  filterItem({ target: { value: '' } }); // Reset filter (simulate input event)
}

function addItemToDOM(item){
  // Create a new <li> element
  const li=document.createElement('li');
  
  // Add the item text as a text node inside the <li>
  li.appendChild(document.createTextNode(item));
  
  // Create the remove (X) button and append it to the <li>
  const button=createButton("remove-item btn-link text-red");
  li.appendChild(button);
  
  // Append the completed <li> to the item list in the DOM
  itemList.appendChild(li);
}


function createButton(classes){
  const button=document.createElement('button');
  button.className=classes;
  const icon=createIcon("fa-solid fa-xmark");
  button.appendChild(icon);
  return button;
}

function createIcon(classes){
  const icon=document.createElement('i');
  icon.className=classes;
  return icon;
}

function addItemToStorage(item){
  const itemFromStorage=getItemFromStorage();
  
   // Add the new item to the array
  itemFromStorage.push(item);

  // Save the updated array back to localStorage as a JSON string
  localStorage.setItem('items',JSON.stringify(itemFromStorage));
}

function getItemFromStorage(){
  let itemFromStorage;

  // Check if 'items' already exists in localStorage
  if(localStorage.getItem('items')===null){
     // If not, start with an empty array
    itemFromStorage=[];
  }
  else{
    // Otherwise, parse the existing items from JSON
    itemFromStorage=JSON.parse(localStorage.getItem('items'));
  }
  return itemFromStorage;
}

function onClickItem(e){
  if (e.target.parentElement.classList.contains('btn-link')){
    removeItem(e.target.parentElement.parentElement);
  }
  else{
    setItemToEdit(e.target);
  }
}

function checkIfItemExists(item){
  const itemFromStorage=getItemFromStorage();
  return itemFromStorage.includes(item);
}

function setItemToEdit(item){
  isEditMode=true;
  itemList.querySelectorAll('li').forEach((i)=>i.classList.remove('edit-mode'));
  item.classList.add('edit-mode');
  formBtn.innerHTML='<i class="fa-solid fa-pen"></i> Update item';
  itemInput.value=item.textContent;
  formBtn.style.backgroundColor='#228B22';
}
//Remove items from DOM
function removeItem(item){
  item.remove();
  removeItemFromStorage(item.textContent);
  checkUI();
}
//Remove items from storage
function removeItemFromStorage(item){
  let itemFromStorage=getItemFromStorage();
  //Filter out items to be removed
  itemFromStorage=itemFromStorage.filter((i)=>i!==item);
  //Re-set items to LS
  localStorage.setItem('items',JSON.stringify(itemFromStorage));
}
//Clear All items
function clearAll(){
  while(itemList.firstChild){
    itemList.removeChild(itemList.firstChild);
  }
  //Clear from LS
  localStorage.removeItem('items');
  checkUI();
}
//Remove clear and fliter when no items
function checkUI(){
  itemInput.value='';
  const items=itemList.querySelectorAll('li');
  if (items.length==0){
    clrbtn.style.display='none';
    itemFilter.style.display='none';
  }
  else{
    clrbtn.style.display='block';
    itemFilter.style.display='block';
  }
  formBtn.innerHTML='<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor='#333';

  isEditMode=false;
}

//Filter list items based on the exact letter positions (i.e. same index matching), not just general substring matching
function filterItem(e){
  const items=itemList.querySelectorAll('li');
  const text=e.target.value.toLowerCase();

  items.forEach(item => {
    const itemName = item.childNodes[0].textContent.trim().toLowerCase();
    let match = true;

    for (let i = 0; i < text.length; i++) {
      if (itemName[i] !== text[i]) {
        match = false;
        break;
      }
    }

    item.style.display = match ? 'flex' : 'none';
  });
}
function init(){
  itemForm.addEventListener('submit',onAddItemSubmit);
  itemList.addEventListener('click',onClickItem);
  clrbtn.addEventListener('click',clearAll);
  itemFilter.addEventListener('input',filterItem);
  document.addEventListener('DOMContentLoaded',displayItems);
  checkUI();
}

init();