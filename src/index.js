const DOG_BAR = document.getElementById("dog-bar");
const DOG_INFO = document.getElementById("dog-info");
const FILTER_BTN = document.getElementById("good-dog-filter");

const BASE_URL = "http://localhost:3000/pups";

let filterOn = false;

// Fetch all dogs and render them
function loadDogs() {
  fetch(BASE_URL)
    .then(res => res.json())
    .then(dogs => {
      DOG_BAR.innerHTML = ""; // Clear bar
      const filteredDogs = filterOn ? dogs.filter(d => d.isGoodDog) : dogs;
      filteredDogs.forEach(renderDogSpan);
    })
    .catch(err => {
      DOG_BAR.innerHTML = "<span style='color:red'>Failed to load dogs.</span>";
      console.error(err);
    });
}

// Render a dog span in the dog bar
function renderDogSpan(dog) {
  const span = document.createElement("span");
  span.textContent = dog.name;
  span.addEventListener("click", () => showDogInfo(dog));
  DOG_BAR.appendChild(span);
}

// Show dog info (image, name, button)
function showDogInfo(dog) {
  DOG_INFO.innerHTML = `
    <img src="${dog.image}" alt="${dog.name}" />
    <h2>${dog.name}</h2>
    <button id="toggle-btn">${dog.isGoodDog ? "Good Dog!" : "Bad Dog!"}</button>
  `;

  document.getElementById("toggle-btn").addEventListener("click", () => toggleGoodness(dog));
}

// Toggle Good/Bad Dog and PATCH the change
function toggleGoodness(dog) {
  const newStatus = !dog.isGoodDog;

  fetch(`${BASE_URL}/${dog.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({ isGoodDog: newStatus })
  })
    .then(res => res.json())
    .then(updatedDog => {
      showDogInfo(updatedDog); // update info panel
      if (filterOn) loadDogs(); // refresh dog bar only if filter is ON
    })
    .catch(err => {
      alert("Failed to update dog status.");
      console.error(err);
    });
}

// Filter toggle button logic
FILTER_BTN.addEventListener("click", () => {
  filterOn = !filterOn;
  FILTER_BTN.textContent = `Filter good dogs: ${filterOn ? "ON" : "OFF"}`;
  loadDogs();
});

// Initial load
loadDogs();