import studentdb, {
  bulkcreate,
  createEle,
  getData,
  SortObj
} from "./module.js";


let db = studentdb("student_db", {
  etudiant: `++id, nom, prenoms, adresse`
});

// input tags
const userid = document.getElementById("userid");
const nom = document.getElementById("nom");
const prenoms = document.getElementById("prenoms");
const adresse = document.getElementById("adresse");

// create button
const btncreate = document.getElementById("btn-create");
const btnread = document.getElementById("btn-read");
const btnupdate = document.getElementById("btn-update");
const btndelete = document.getElementById("btn-delete");


btncreate.onclick = event => {

  let flag = bulkcreate(db.etudiant, {
    nom: nom.value,
    prenoms: prenoms.value,
    adresse: adresse.value
  });
  nom.value = prenoms.value = adresse.value = "";

  // set id textbox value
  getData(db.etudiant, data => {
    userid.value = data.id + 1 || 1;
  });
  table();

  let insertmsg = document.querySelector(".insertmsg");
  getMsg(flag, insertmsg);
};

btnread.onclick = table;

btnupdate.onclick = () => {
  const id = parseInt(userid.value || 0);
  if (id) {
    db.etudiant.update(id, {
      nom: nom.value,
      prenoms: prenoms.value,
      adresse: adresse.value
    }).then((updated) => {
      let get = updated ? true : false;

      // display message
      let updatemsg = document.querySelector(".updatemsg");
      getMsg(get, updatemsg);

      nom.value = prenoms.value = adresse.value = "";
      //console.log(get);
    })
  } else {
    console.log(`Azafady mba m-selectioneva ID ray: ${id}`);
  }
}

// delete button
btndelete.onclick = () => {
  db.delete();
  db = studentdb("student_db", {
    etudiant: `++id, nom, prenoms, adresse`
  });
  db.open();
  table();
  textID(userid);
  // display message
  let deletemsg = document.querySelector(".deletemsg");
  getMsg(true, deletemsg);
}

window.onload = event => {
  textID(userid);
};




// create dynamic table
function table() {
  const tbody = document.getElementById("tbody");
  const notfound = document.getElementById("notfound");
  notfound.textContent = "";
  while (tbody.hasChildNodes()) {
    tbody.removeChild(tbody.firstChild);
  }


  getData(db.etudiant, (data, index) => {
    if (data) {
      createEle("tr", tbody, tr => {
        for (const value in data) {
          createEle("td", tr, td => {
            td.textContent = data.price === data[value] ? `$ ${data[value]}` : data[value];
          });
        }
        createEle("td", tr, td => {
          createEle("i", td, i => {
            i.className += "fas fa-edit btnedit";
            i.setAttribute(`data-id`, data.id);
            // store number of edit buttons
            i.onclick = editbtn;
          });
        })
        createEle("td", tr, td => {
          createEle("i", td, i => {
            i.className += "fas fa-trash-alt btndelete";
            i.setAttribute(`data-id`, data.id);
            // store number of edit buttons
            i.onclick = deletebtn;
          });
        })
      });
    } else {
      notfound.textContent = "L'enregistrement est vide...!";
    }

  });
}

const editbtn = (event) => {
  let id = parseInt(event.target.dataset.id);
  db.etudiant.get(id, function (data) {
    let newdata = SortObj(data);
    userid.value = newdata.id || 0;
    nom.value = newdata.nom || "";
    prenoms.value = newdata.prenoms || "";
    adresse.value = newdata.adresse || "";
  });
}

// delete icon remove element 
const deletebtn = event => {
  let id = parseInt(event.target.dataset.id);
  db.etudiant.delete(id);
  table();
}

// textbox id
function textID(textboxid) {
  getData(db.etudiant, data => {
    textboxid.value = data.id + 1 || 1;
  });
}

function getMsg(flag, element) {
  if (flag) {
    // call msg 
    element.className += " movedown";
    setTimeout(() => {
      element.classList.forEach(classname => {
        classname == "movedown" ? undefined : element.classList.remove('movedown');
      })
    }, 2500);
  }
}