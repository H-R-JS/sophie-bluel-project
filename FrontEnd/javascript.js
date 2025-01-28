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
      mapDataGallery(data);
    } else {
      const dataFilter = new Set();
      dataFilter.add(data.filter((n) => n.category.name == name));
      const dataArray = Array.from(dataFilter)[0];
      mapDataGallery(dataArray);
    }
  });
}

function mapDataGallery(data) {
  data.map((item) => {
    const figure = document.createElement("figure");
    const figcaption = document.createElement("figcaption");
    const img = document.createElement("img");
    figcaption.innerHTML = item.title;
    img.setAttribute("src", item.imageUrl);
    img.classList.add("gallery-img");
    figure.setAttribute("id", item.id);
    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
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
const btnLogin = document.querySelector(".menu-login-btn");

if (localStorage.getItem("user")) {
  editBar.style.display = "flex";
  editBtn.style.display = "flex";
  btnsBar.style.display = "none";
  btnLogin.innerHTML = "logout";

  btnLogin.addEventListener("click", () => {
    localStorage.removeItem("user");
  });
}

/** Modal */

const modal = document.querySelector(".modal");
const mdGallery = document.querySelector(".md-gallery");

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
  mapDataModal(data);
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
      if (res.status == 204) {
        getChildDelete(mdGallery, id);
        getChildDelete(gallery, id);
      }
    } catch (err) {
      console.error(err);
    }
  }
}

function getChildDelete(parent, id) {
  let test = Array.from(parent.children).filter(
    (n) => n.getAttribute("id") == id
  );
  parent.removeChild(test[0]);
}

function mapDataModal(data) {
  data.map((item) => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const i = document.createElement("i");
    i.classList.add("md-icon-trash", "fa-solid", "fa-trash-can");
    img.setAttribute("src", item.imageUrl);
    img.classList.add("md-img");
    i.setAttribute("id", item.id);
    figure.setAttribute("id", item.id);
    figure.appendChild(i);
    figure.appendChild(img);
    mdGallery.appendChild(figure);
  });
}

/** Modal add Data*/

const btnModalAddData = document.querySelector(".md-btn-add");
const modalAddData = document.querySelector(".modal-add-data");
const modalData = document.querySelector(".modal-data");

const barModalData = document.querySelector(".ma-bar");

btnModalAddData.addEventListener("click", showModalAdd);

function showModalAdd() {
  modalAddData.style.display = "flex";
  modalData.style.display = "none";
}

barModalData.addEventListener("click", closeAndBack);

function closeAndBack(e) {
  if (e.target.classList.contains("ma-icon-back")) {
    modalAddData.style.display = "none";
    modalData.style.display = "flex";
  } else if (e.target.classList.contains("ma-icon-close")) {
    closeModal();
  }
}

const select = document.querySelector(".select");

getData(`${API_URL}${PATH.CATEGORIES}`).then((data) => {
  data.map((item, index) => {
    const option = document.createElement("option");
    option.setAttribute("value", item.id);
    option.innerHTML = item.name;
    select.appendChild(option);
  });
});

/** Add and display file */

const btnAddData = document.querySelector(".md-btn-add.data");
const titleValue = document.querySelector(".ma-input.title");
const formImg = document.querySelector(".ma-form-img");

const iconImg = formImg.children[0];
const imgDisplay = formImg.children[1];
const fileInput = formImg.children[2];
const btnAddFile = formImg.children[3];
const imgInfo = formImg.children[4];

btnAddFile.addEventListener("click", () => {
  fileInput.click();
});

let file = "";

fileInput.addEventListener("change", () => {
  if (fileInput.files[0].name) {
    file = fileInput.files[0];
    imgDisplay.setAttribute("src", `/FrontEnd/assets/images/${file.name}`);
    imgDisplay.style.display = "inline-block";
    iconImg.style.display = "none";
    btnAddFile.style.display = "none";
    imgInfo.style.display = "none";
  } else {
    return;
  }
});

titleValue.addEventListener("input", checkValues);
select.addEventListener("change", checkValues);
fileInput.addEventListener("change", checkValues);

function checkValues() {
  if (titleValue.value !== "" && select.value !== "" && file !== "") {
    btnAddData.style.backgroundColor = "#1d6154";
  } else {
    btnAddData.style.backgroundColor = "#a7a7a7";
  }
}

btnAddData.addEventListener("click", postNewData);

const errorAddData = document.querySelector(".error.add-data");

async function postNewData(e) {
  e.preventDefault();
  const title = titleValue.value;
  const category = select.value;
  const formData = new FormData();
  formData.append("image", file);
  formData.append("title", title);
  formData.append("category", category);
  const user = JSON.parse(localStorage.getItem("user"));

  if (!title || !category || !file) {
    return errorCatch(errorAddData, "Une ou des informations sont manquantes");
  } else {
    try {
      const res = await fetch(`${API_URL}${PATH.POST_WORK}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });
      if (res.status !== 201) {
        return errorCatch(errorAddData, "Une erreur s'est produite");
      } else if (res.status == 201) {
        imgDisplay.setAttribute("src", "");
        imgDisplay.style.display = "none";
        iconImg.style.display = "inline-block";
        btnAddFile.style.display = "inline-block";
        imgInfo.style.display = "inline-block";

        titleValue.value = "";
        select.value = "";
      }
    } catch (err) {
      console.error(err);
    }
  }
}

/** Handle error */

function errorCatch(errorElement, text) {
  errorElement.innerHTML = `${text}`;
  errorElement.style.display = "inline-block";
}

function closeError(errorElement) {
  errorElement.style.display = "none";
}

/** Malt & Juniper - New York */
