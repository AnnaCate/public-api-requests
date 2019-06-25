const randomUserUrl = "https://randomuser.me/api/?results=12&nat=us";
const body = document.querySelector("body");
const gallery = document.getElementById("gallery");
let activeEmployees = [];

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
  // set global `activeEmployees` array to the 12 people returned, with all details
  activeEmployees = peopleJSON.results;

  const profiles = peopleJSON.results.map(async person => {
    const img = person.picture.large;
    const name = `${person.name.first} ${person.name.last}`;
    const email = person.email;
    const city = person.location.city;
    // const phone = person.phone;
    // const address = `${person.location.street}, ${city}, ${
    //   person.location.state
    // } ${person.location.postcode}`;
    // const birthday = new Date(person.dob.date);

    return { img, name, email, city };
  });

  return Promise.all(profiles);
}

// Generate the markup for each profile
function generateHTML(data) {
  data.map(person => {
    const card = document.createElement("div");
    card.setAttribute("id", `${data.indexOf(person)}`);
    card.classList.add("card");
    gallery.appendChild(card);

    // img
    const cardImg = document.createElement("div");
    cardImg.classList.add("card-img-container");
    card.appendChild(cardImg);
    cardImg.innerHTML = `<img class="card-img" 
            src=${person.img} 
            alt="profile picture">`;

    // info
    // REFACTOR: add leading zeroes to month and day of DOB
    const cardInfo = document.createElement("div");
    cardInfo.classList.add("card-info-container");
    card.appendChild(cardInfo);
    cardInfo.innerHTML = `
        <h3 id="name" class="card-name cap">${person.name}</h3>
        <p class="card-text">${person.email}</p>
        <p class="card-text cap">${person.city}</p>
        `;
  });
}

// create fn to convert string to Proper Case
function makeProperCase(string) {
  return string
    .split(" ")
    .map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

// create fn to convert full state name to abbreviation
// switch statement sourced from Jeff Bobish's answer in https://stackoverflow.com/questions/3925195/making-state-abbreviations-from-state-names
function abbreviateState(state) {
  switch (state.toUpperCase()) {
    case "ALABAMA":
      return "AL";
    case "ALASKA":
      return "AK";
    case "AMERICAN SAMOA":
      return "AS";
    case "ARIZONA":
      return "AZ";
    case "ARKANSAS":
      return "AR";
    case "CALIFORNIA":
      return "CA";
    case "COLORADO":
      return "CO";
    case "CONNECTICUT":
      return "CT";
    case "DELAWARE":
      return "DE";
    case "DISTRICT OF COLUMBIA":
      return "DC";
    case "FEDERATED STATES OF MICRONESIA":
      return "FM";
    case "FLORIDA":
      return "FL";
    case "GEORGIA":
      return "GA";
    case "GUAM":
      return "GU";
    case "HAWAII":
      return "HI";
    case "IDAHO":
      return "ID";
    case "ILLINOIS":
      return "IL";
    case "INDIANA":
      return "IN";
    case "IOWA":
      return "IA";
    case "KANSAS":
      return "KS";
    case "KENTUCKY":
      return "KY";
    case "LOUISIANA":
      return "LA";
    case "MAINE":
      return "ME";
    case "MARSHALL ISLANDS":
      return "MH";
    case "MARYLAND":
      return "MD";
    case "MASSACHUSETTS":
      return "MA";
    case "MICHIGAN":
      return "MI";
    case "MINNESOTA":
      return "MN";
    case "MISSISSIPPI":
      return "MS";
    case "MISSOURI":
      return "MO";
    case "MONTANA":
      return "MT";
    case "NEBRASKA":
      return "NE";
    case "NEVADA":
      return "NV";
    case "NEW HAMPSHIRE":
      return "NH";
    case "NEW JERSEY":
      return "NJ";
    case "NEW MEXICO":
      return "NM";
    case "NEW YORK":
      return "NY";
    case "NORTH CAROLINA":
      return "NC";
    case "NORTH DAKOTA":
      return "ND";
    case "NORTHERN MARIANA ISLANDS":
      return "MP";
    case "OHIO":
      return "OH";
    case "OKLAHOMA":
      return "OK";
    case "OREGON":
      return "OR";
    case "PALAU":
      return "PW";
    case "PENNSYLVANIA":
      return "PA";
    case "PUERTO RICO":
      return "PR";
    case "RHODE ISLAND":
      return "RI";
    case "SOUTH CAROLINA":
      return "SC";
    case "SOUTH DAKOTA":
      return "SD";
    case "TENNESSEE":
      return "TN";
    case "TEXAS":
      return "TX";
    case "UTAH":
      return "UT";
    case "VERMONT":
      return "VT";
    case "VIRGIN ISLANDS":
      return "VI";
    case "VIRGINIA":
      return "VA";
    case "WASHINGTON":
      return "WA";
    case "WEST VIRGINIA":
      return "WV";
    case "WISCONSIN":
      return "WI";
    case "WYOMING":
      return "WY";
  }
}

function formatPhoneNumber(phoneNumber) {
  const areaCode = phoneNumber.split("-").splice(0, 1);
  const rest = phoneNumber
    .split("-")
    .splice(1, 2)
    .join("-");
  areaCode.push(rest);
  areaCode.join(" ");
  //   const formattedNum = together.join(" ");
  console.log(areaCode);
}

function generateModal(index) {
  // create modal container and modal
  const modalContainer = document.createElement("div");
  modalContainer.classList.add("modal-container");
  gallery.parentNode.insertBefore(modalContainer, gallery.nextSibling);

  const modal = document.createElement("div");
  modal.classList.add("modal");
  modalContainer.appendChild(modal);

  // create info container
  const modalInfo = document.createElement("div");
  modalInfo.classList.add("modal-info-container");
  modal.appendChild(modalInfo);

  // get info that we'll need
  const photo = activeEmployees[index].picture.large;
  const name = makeProperCase(`
    ${activeEmployees[index].name.first} ${activeEmployees[index].name.last}`);
  const email = activeEmployees[index].email;
  const city = makeProperCase(activeEmployees[index].location.city);
  const phone = activeEmployees[index].phone;
  const address = makeProperCase(
    `${activeEmployees[index].location.street}, ${
      activeEmployees[index].location.city
    }, ${abbreviateState(activeEmployees[index].location.state)} ${
      activeEmployees[index].location.postcode
    }`
  );
  const dobFull = new Date(activeEmployees[index].dob.date);
  const dob = `${("0" + dobFull.getDate()).slice(-2)}/${(
    "0" + dobFull.getMonth()
  ).slice(-2)}/${dobFull.getYear()}`;

  // add info to DOM
  modalInfo.innerHTML = `<img class="modal-img" 
    src=${photo} alt="profile picture">
    <h3 id="name" class="modal-name cap">${name}</h3>
    <p class="modal-text">${email}</p>
    <p class="modal-text cap">${city}</p>
    <hr>
    <p class="modal-text">${phone}</p>
    <p class="modal-text">${address}</p>
    <p class="modal-text">Birthday: ${dob}</p>
  `;

  // function to remove model
  const removeModal = () => {
    body.removeChild(modalContainer);
  };

  // create button
  const btn = document.createElement("button");
  btn.setAttribute("type", "button");
  btn.setAttribute("id", "modal-close-btn");
  btn.setAttribute("class", "modal-close-btn");
  btn.innerHTML = "<strong>X</strong>";
  modal.appendChild(btn);
  btn.addEventListener("click", removeModal);
}

// .getMonth()}/${activeEmployees[
//     index
//   ].dob.date.getDay()}/${activeEmployees[index].dob.date.getYear()}

// on page load, fetch the users and put them on the page
document.addEventListener("DOMContentLoaded", () => {
  getUser(randomUserUrl)
    .then(generateHTML)
    // .then(getCards)
    // .then(addEventListenerList)
    .catch(e => {
      gallery.innerHTML = "<h3>Something went wrong!</h3>";
      console.error(e);
    });
});

// create fn to get cards
function getCards() {
  const cards = document.getElementsByClassName("card");
  return cards;
}

// add event listeners to nodelist
// function addEventListenerList(list) {
//     for (let i = 0; i < list.length; i++) {
//         let index = list[i].id;
//         list[i].addEventListener('click', generateModal(index), false);
//     }
// }

// add event listener to gallery
gallery.addEventListener("click", e => {
  if (e.target.className === "card") {
    let index = e.target.id;
    generateModal(index);
  }
});
