const randomUserUrl = 'https://randomuser.me/api/?results=12&nat=us';
const body = document.querySelector('body');
const gallery = document.getElementById('gallery');
// ⚠️ need to define an empty array to hold the list of active employees
// update list in getUser fn
// use the user's index in the array for the modal window

// Handle all fetch requests
async function getJSON(url) {
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

// get users
async function getUser(url) {
    const peopleJSON = await getJSON(url);

    const profiles = peopleJSON.results.map(async (person) => {
        const img = person.picture.large;
        const name = `${person.name.first} ${person.name.last}`;
        const email = person.email;
        const city = person.location.city;
        const phone = person.phone;
        const address = `${person.location.street}, ${city}, ${person.location.state} ${person.location.postcode}`;
        const birthday = new Date(person.dob.date);

        return {img, name, email, city, phone, address, birthday};
    });

    return Promise.all(profiles);
}

// Generate the markup for each profile
function generateHTML(data) {
    data.map(person => {
        const card = document.createElement('div');
        card.classList.add('card');
        gallery.appendChild(card);

        // img
        const cardImg = document.createElement('div');
        cardImg.classList.add('card-img-container');
        card.appendChild(cardImg);
        cardImg.innerHTML = `<img class="card-img" 
            src=${person.img} 
            alt="profile picture">`;

        // info
        // REFACTOR: add leading zeroes to month and day of DOB
        const cardInfo = document.createElement('div');
        cardInfo.classList.add('card-info-container');
        card.appendChild(cardInfo);
        cardInfo.innerHTML = `
        <h3 id="name" class="card-name cap">${person.name}</h3>
        <p class="card-text">${person.email}</p>
        <p class="card-text cap">${person.city}</p>
        `;
    });

    addEventListenerList(getCards());
}

function generateModal(data) {
    data.map(person => {

        // create modal container and modal
        const modalContainer = document.createElement('div');
        modalContainer.classList.add('modal-container');
        gallery.parentNode.insertBefore(modalContainer, gallery.nextSibling);

        const modal = document.createElement('div');
        modal.classList.add('modal');
        modalContainer.appendChild(modal);

        // create button
        const btn = document.createElement('button');
        btn.setAttribute('type', 'button');
        btn.setAttribute('id', 'modal-close-btn');
        btn.setAttribute('class', 'modal-close-btn');
        btn.innerHTML = '<strong>X</strong>';
        modal.appendChild(btn);
        // ADD EVENT LISTENER TO BUTTON

        // create info container
        const modalInfo = document.createElement('div');
        modalInfo.classList.add('modal-info-container');
        modal.appendChild(modalInfo);
        // get info that we'll need
        modalInfo.innerHTML = `<img class="modal-img" 
            src=${person.img} alt="profile picture">
            <h3 id="name" class="modal-name cap">${person.name}</h3>
            <p class="modal-text">${person.email}</p>
            <p class="modal-text cap">${person.city}</p>
            <hr>
            <p class="modal-text">${person.phone}</p>
            <p class="modal-text">${person.address}</p>
            <p class="modal-text">Birthday: ${person.birthday.getMonth()}/${person.birthday.getDay()}/${person.birthday.getYear()}/p>
        `;
    });
}

// on page load, fetch the users and put them on the page
document.addEventListener('DOMContentLoaded', () => {
    getUser(randomUserUrl)
        .then(generateHTML)
        .catch(e => {
            gallery.innerHTML = '<h3>Something went wrong!</h3>';
            console.error(e);
          });           
});

// create fn to get cards
function getCards() {
    const cards = document.getElementsByClassName('card');
    return cards;
}

// add event listeners to nodelist
function addEventListenerList(list) {
    for (let i = 0; i < list.length; i++) {
        list[i].addEventListener('click', generateModal(data), false);
    }
}