const studentdb = (dbname, table) => {
  const db = new Dexie(dbname);
  db.version(1).stores(table);
  db.open();

  return db;
};

const bulkcreate = (dbtable, data) => {
  let flag = empty(data);
  if (flag) {
    dbtable.bulkAdd([data]);

  } else {
    console.log("No data found...!");
  }
  return flag;
};

// add table elements
const createEle = (tagname, appendTo, fn) => {
  const element = document.createElement(tagname);
  if (appendTo) appendTo.appendChild(element);
  if (fn) fn(element);
};

// add checker
const empty = object => {
  let flag = false;
  for (const value in object) {
    if (object[value] != "" && object.hasOwnProperty(value)) {
      flag = true;
    } else {
      flag = false;
    }
  }
  return flag;
};

// fetch db data
const getData = (dbname, fn) => {
  let index = 0;
  let obj = {};
  dbname.count(count => {
    if (count) {
      dbname.each(table => {
        obj = SortObj(table);
        fn(obj, index++);
      });
    } else {
      fn(0);
    }
  });
};

const SortObj = (sortobj) => {
  let obj = {};
  obj = {
    id: sortobj.id,
    nom: sortobj.nom,
    prenoms: sortobj.prenoms,
    adresse: sortobj.adresse
  };
  return obj;
}


export default studentdb;
export {
  bulkcreate,
  createEle,
  getData,
  SortObj
};