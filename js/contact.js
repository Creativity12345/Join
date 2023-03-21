let letters = [];  
let contacts;


/**
 * Downloads data from the backend and initializes the contact list
 */
async function initContacts() {
    setURL('https://sebastian-michael.developerakademie.net/smallest_backend_ever');
    await downloadFromServer();
    contacts = JSON.parse(backend.getItem('contact')) || [];  
    sortArray();
    generateContactlist();
}


/**
 * Add new contact to the list
 */
function submitContact() {
  let name = document.getElementById('AddName').value;
  let email = document.getElementById('AddEmail').value;
  let number = document.getElementById('AddNumber').value;

  if(name.split(" ").length != 2 ){
    document.getElementById('info').innerHTML = 'please write firstname and lastname!';
  } else {
 
  randomBgColor();

  let contact = {
      'name': name.charAt(0).toUpperCase() + name.slice(1),
      'email': email,
      'phone': number,
      'bgcolor':result
  };
  sortArray();
  addContact(contact);
  HideNewContactContainer();
  generateContactlist(); 
  }
}


/**
 * generate a random string for a gb color
 */
function randomBgColor(){
  let x = Math.floor(Math.random() * 156);
  var y = Math.floor(Math.random() * 156);
  var z = Math.floor(Math.random() * 156);
  result = `${x},`+`${y},`+`${z}`;
}
  

/**
 * Add new contact to Arrray
 * @param {JSON} contact 
 */
async function addContact(contact) {
  contacts.push(contact);
  await backend.setItem('contact', JSON.stringify(contacts));
  clearInput();
}


/**
 * Clear input fields
 */
function clearInput () {
  document.getElementById('AddName').value= '';
  document.getElementById('AddEmail').value= '';
  document.getElementById('AddNumber').value= '';
  document.getElementById('info').innerHTML = '&nbsp;'; 
}


/**
 * function to sort the array alphabetical
 */
function sortArray(){
  letters.sort();
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i]['name'];
    contacts.sort(function(a, b){
      if(a.name < b.name) { return -1; }
      if(a.name > b.name) { return 1; }
      return 0;
    })   
  }
}


/**
 * generate the contactlist with data from array contacts
 */
function generateContactlist() {
  letters = [];
  document.getElementById('contactList').innerHTML = '';
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    
    let firstLetter = contact['name'].charAt(0).toUpperCase();
    if(!letters.includes(firstLetter)) {     
      letters.sort();
      letters.push(firstLetter);     
      document.getElementById('contactList').innerHTML += generateLetterbox(firstLetter);
    }
    if (firstLetter === contact['name'].charAt(0).toUpperCase()) {
      document.getElementById(`letterbox${firstLetter}`).innerHTML +=
      generateContactinConttaclist(i, contact);
    }
  }  
}


/**
 * function to show the single contact on the right side and on the mobile scrren
 * @param {number} i // number of array
 */
function showSingleContact(i){      
  if(window.innerWidth > 1170 ){
    document.getElementById('containerRight').innerHTML = showSingleContactTemplate(i);
  } else {
    MobileSingleContactScreen();
    document.getElementById('lightboxMobileContact').innerHTML = showSingleContactMobileTemplate(i);
  }
}


/**
 * function to show the edit contact screen
 * @param {number} i // number of array
 */
function openEditContact(i){
  document.getElementById('lightboxEditContact').classList.remove('d-none');
  document.getElementById('lightboxEditContact').innerHTML = 
  showEditContact(i);
  EditInput(i);
}


/**
 * put the actual strings in the inputfield from edit contact
 * @param {number} i // number of array
 */
function EditInput(i){
  document.getElementById('editName').value = `${contacts[i]['name']}`;
  document.getElementById('editEmail').value = `${contacts[i]['email']}`;
  document.getElementById('editNumber').value = `${contacts[i]['phone']}`;
}


/**
 * function to edit contacts
 * @param {number} i // number of array 
 */
function editContacts(i) {
  let name = document.getElementById('editName').value; 
  let email = document.getElementById('editEmail').value; 
  let number = document.getElementById('editNumber').value; 
  randomBgColor();
  contacts.splice(i,1);
  let contact = {
    'name': name.charAt(0).toUpperCase() + name.slice(1),
    'email': email,
    'phone': number,
    'bgcolor': result
  }
  addContact(contact);   
  sortArray();
  generateContactlist();
  showSingleContact(i);
  closeEditContact();
}


/**
 * delete contact
 */
async function deleteContact(i){
  contacts.splice(i,1);
  generateContactlist();
  await backend.setItem('contact', JSON.stringify(contacts));
}


/*Functions to hide or show different screens*/
function closeEditContact(){
  document.getElementById('lightboxEditContact').classList.add('d-none');
}


/**
 * Hide the mobile contact lightbox and reveal the main container.
 */
function hideMobileContacts(){
  document.getElementById('container').classList.remove('d-none');
  document.getElementById('lightboxMobileContact').classList.add('d-none');
}


/**
 * Shows the HTML element with the ID 'lightboxAddContact' by removing the 'd-none' class from its classList.
 */
function showNewContactContainer() {
  document.getElementById('lightboxAddContact').classList.remove('d-none');
}


/**
 * Hides the new contact container and clears input.
 */
function HideNewContactContainer() {
    document.getElementById('lightboxAddContact').classList.add('d-none');
    clearInput();
}


/**
 * Displays a single contact mobile screen by removing the "d-none" class from the respective element and adding it to another element.
 */
function MobileSingleContactScreen(){
  document.getElementById('lightboxMobileContact').classList.remove('d-none')
  document.getElementById('container').classList.add('d-none');
}