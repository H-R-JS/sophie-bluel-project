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

const editBar = document.querySelector(".editor-bar");
const editBtn = document.querySelector(".btn-modal-editor");

if (localStorage.getItem("user")) {
  editBar.style.display = "flex";
  editBtn.style.display = "flex";
  btnsBar.style.display = "none";
}

/** Modal */

const modal = document.querySelector(".modal");
const mdGallery = document.querySelector(".md-gallery");
const modalAddData = document.querySelector(".modal-add-data");

const mdIconClose = document.querySelector(".md-icon-close ");

editBtn.addEventListener("click", showModal);
mdIconClose.addEventListener("click", closeModal);

function showModal() {
  modal.style.display = "flex";
}

function closeModal() {
  modal.style.display = "none";
}

getData(`${API_URL}${PATH.GET_WORK}`).then((data) => {
  data.map((item) => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const i = document.createElement("i");
    i.classList.add("md-icon-trash", "fa-solid", "fa-trash-can");
    img.setAttribute("src", item.imageUrl);
    img.classList.add("md-img");
    figure.classList.add("md-figure");
    i.setAttribute("id", item.id);
    figure.appendChild(i);
    figure.appendChild(img);
    mdGallery.appendChild(figure);
  });
});

mdGallery.addEventListener("click", deleteData);
async function deleteData(e) {
  const user = JSON.parse(localStorage.getItem("user"));
  const id = e.target.id;
  if (id !== "") {
    try {
      const res = await fetch(`${API_URL}${PATH.DELETE_WORK(id)}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      console.log(res);
    } catch (err) {
      console.error(err);
    }
  }
  /** Modal add Data*/
}
