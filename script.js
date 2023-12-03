const loading = document.querySelector(".topLayer");

// This async function fetches the array that contains all the data that we need for our project and it works in two stages:
// First: It fetches the nessecary API key using the POST method and saves it in the "key" variable.
// Second: Using the "key" we call another fetch method this time with GET and the final data is an array that contains all the informations about the sun and the planets in our solar system. The array then is saved in the dataArray variable.
let dataArray = [];
const fetchingKey = async () => {
  const key = (
    await (
      await fetch(
        "https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/keys",
        {
          method: "POST",
        }
      )
    ).json()
  ).key;

  let resp = await (
    await fetch(
      "https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/bodies",
      {
        method: "GET",
        headers: { "x-zocom": key },
      }
    )
  ).json();
  dataArray = resp.bodies;
  loading.remove();
};

fetchingKey();

function createStars(numberOfStars) {
  for (let i = 0; i < numberOfStars; i++) {
    const main = document.querySelector("main");
    const star = document.createElement("div");
    star.className = "star hidden";

    const xPos = Math.random() * window.innerWidth;
    const yPos = Math.random() * window.innerHeight;

    star.style.left = `${xPos}px`;
    star.style.top = `${yPos}px`;
    star.style.backgroundColor = `rgba(255, 255, 255, ${Math.random()})`;

    main.appendChild(star);
  }
}

createStars(100);

// Event listener
const primaryElem = document.querySelectorAll(".before"),
  secondaryElem = document.querySelectorAll(".hidden"),
  name1 = document.querySelector("#name"),
  latinName = document.querySelector("#latinName"),
  discription = document.querySelector("#discription"),
  circ = document.querySelector("#circ"),
  km = document.querySelector("#km"),
  maxTemp = document.querySelector("#maxTemp"),
  minTemp = document.querySelector("#minTemp"),
  moons = document.querySelector(".moons"),
  sun = document.querySelector(".sun"),
  stars = document.querySelectorAll(".star");

const switchScreen = () => {
  primaryElem.forEach((element) => {
    element.classList.toggle("hidden");
  });
  secondaryElem.forEach((element) => {
    element.classList.toggle("hidden");
  });
  sun.style.backgroundColor = "yellow";
};

document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    switchScreen();

    sun.style.backgroundColor = `${
      window.getComputedStyle(e.target).backgroundColor
    }`;

    name1.innerHTML = dataArray[e.target.id].name.toUpperCase();
    latinName.innerHTML = dataArray[e.target.id].latinName.toUpperCase();
    discription.innerHTML = dataArray[e.target.id].desc;
    circ.innerHTML =
      dataArray[e.target.id].circumference
        .toLocaleString()
        .split(",")
        .join(" ") + " KM";
    km.innerHTML =
      dataArray[e.target.id].distance.toLocaleString().split(",").join(" ") +
      " KM";
    maxTemp.innerHTML = dataArray[e.target.id].temp.day + "C";
    minTemp.innerHTML = dataArray[e.target.id].temp.night + "C";
    moons.innerHTML =
      ` ${dataArray[e.target.id].moons.length}: ` +
      dataArray[e.target.id].moons.join(", ");
  });
});
