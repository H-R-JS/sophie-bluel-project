/*** Url and path for fetch */
const API_URL = "http://localhost:5678/api/";

const PATH = {
  CATEGORIES: "categories",
  GET_WORK: "works",
  POST_WORK: "works",
  DELETE_WORK: (id) => `works/${id}`,
};

/** GET data db */

async function getData(url) {
  const request = new Request(url, {
    method: "GET",
  });
  try {
    const res = await fetch(request);
    const result = await res.json();
    console.log(result);
    return result;
  } catch (err) {
    console.error(err);
  }
}

/** Display data */

const gallery = document.querySelector(".gallery");

function getAndDisplay(name) {
  gallery.replaceChildren();
  getData(`${API_URL}${PATH.GET_WORK}`).then((data) => {
    if (!name) {
      data.map((item) => {
        const figure = document.createElement("figure");
        const figcaption = document.createElement("figcaption");
        const img = document.createElement("img");
        figcaption.innerHTML = item.title;
        img.setAttribute("src", item.imageUrl);
        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
      });
    } else {
      const dataFilter = new Set();
      dataFilter.add(data.filter((n) => n.category.name == name));
      const dataArray = Array.from(dataFilter)[0];
      dataArray.map((item) => {
        const figure = document.createElement("figure");
        const figcaption = document.createElement("figcaption");
        const img = document.createElement("img");
        figcaption.innerHTML = item.title;
        img.setAttribute("src", item.imageUrl);
        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
      });
    }
  });
}

getAndDisplay();

/** Events btns filter */

const btnsBar = document.querySelector(".btns-filter-bar");

btnsBar.addEventListener("click", filterFunction);

function filterFunction(e) {
  Array.from(btnsBar.children).map((item) => {
    item.style.backgroundColor = "#fff";
    item.style.color = "#1d6154";
  });
  if (e.target.innerHTML.length <= 24) {
    e.target.style.backgroundColor = "#1d6154";
    e.target.style.color = "#fff";
  }
  console.log();
  if (e.target.innerHTML == "Tous") {
    getAndDisplay(undefined);
  } else if (e.target.innerHTML.toString().charAt(0) == "H") {
    const name = e.target.innerHTML.replace("&amp;", "&");
    getAndDisplay(name);
  }
  getAndDisplay(e.target.innerHTML);
}

/** Mod Editor */

if (localStorage.getItem("user")) {
  console.log("it's okay !");
}
