// This "loading" variable beholds the loading screen at the start of the page, which will be deleted as soon as the fetching process is finished. This avoids us errors related to data that has not been fetched yet.
const loading = document.querySelector(".topLayer");

// This async function fetches the array that contains all the data that we need for our project and it works in two stages:
// First: It fetches the nessecary API key using the POST method and saves it in the "key" variable.
// Second: Using the "key" we call another fetch method this time with GET and the final data is an array that contains all the informations about the sun and the planets in our solar system. The array then is saved in the dataArray variable.
let dataArray = [];
const fetchingKey = async () => {
  try {
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

    // At this stage the data has been fetched and is saved in the dataArray variable. Next the loading screen gets deleted.
    dataArray = resp.bodies;
    loading.remove();
  } catch (error) {
    console.log(`Fetching error: ${error}`);
  }

  // Here we get all the elenets we will be needing to control our project. The "before" elements are the elements that will be seen before the user clicks on a btn element", likewise the "hidden" elements will be seen after when the users clicks on a btn (sun or planets).

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
    planets = document.querySelector(".planets");

  // This function switches displayed elemtens back and forth between the start page and the info pages using toggle on the classes.
  const switchScreen = () => {
    primaryElem.forEach((element) => {
      element.classList.toggle("hidden");
    });
    secondaryElem.forEach((element) => {
      element.classList.toggle("hidden");
    });
    sun.style.backgroundColor = "yellow";
  };

  // The map function here makes our website dynamic which means it doesn't matter how many planets are in my dataArray variable. they will all show up in the page.
  dataArray.map((plnt) => {
    // This line will skip the element with the id==0 (the sun), because it has it own HTML element and CSS.
    if (plnt.id == 0) return;

    const planetDiv = document.createElement("div");
    const ring = document.createElement("div");
    ring.classList = "ring";
    // This part takes care of the classes that each planet needs to have:
    // The classes "btn" and "planet" are self explanatory. The planet name is needed since eache planet has its own size and color, then "big" and "small" will give the plant diffrent hover effects depending on the size of the planet.
    planetDiv.classList = `btn planet ${plnt.name} ${
      plnt.circumference < 60590 ? "small" : "big"
    }`;
    planetDiv.id = plnt.id;

    // This appends Saturn element a child element (the ring)
    if (plnt.name === "Saturnus") planetDiv.appendChild(ring);

    planets.appendChild(planetDiv);
  });

  // This event listener is specific to the "Go back" arrow which uses the swicth screen function to swith back to the main screen.
  document.querySelector("a").addEventListener("click", () => {
    switchScreen();
  });

  // This gives each btn a event listener that will adapt the information screen to the specific clicked planet or sun.
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      // It starts by swicthing the screen.
      switchScreen();

      // Then it takes the color of the planet clicked and apply it to the previous sun element.
      sun.style.backgroundColor = `${
        window.getComputedStyle(e.target).backgroundColor
      }`;

      // the id of each element(target) help us determine which item in the DataArray we will be using
      name1.innerHTML = dataArray[e.target.id].name.toUpperCase();
      latinName.innerHTML = dataArray[e.target.id].latinName.toUpperCase();
      discription.innerHTML = dataArray[e.target.id].desc;
      circ.innerHTML =
        dataArray[e.target.id].circumference
          // This line will convert a number of this form: ddddddddd to this form ddd,ddd,ddd
          .toLocaleString()
          // Then the next two lines will replace the comma with a space to that this: ddd ddd ddd will be the final form of the number.
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
};
fetchingKey();

/*
The "CreateStars" function like it's name suggests, uses a for loop to create a given number of stars and placing them randomly in the screen and also gives them a random opacity percentage to give them a distance effect.
*/

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
