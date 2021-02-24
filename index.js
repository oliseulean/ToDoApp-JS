window.addEventListener('DOMContentLoaded', (event) => { // get elements from localstorage and create list
    updateListInHtml();
});

function updateListInHtml() {
    deleteContentOfUnorderedList();
    const listOfObjects = getListOfObjectsFromLocalStorage();
    createListOfObjects(listOfObjects);
}

function getListOfObjectsFromLocalStorage() {
    const listString = localStorage.getItem('list');
    if (!listString) {
        return [];
    }
    return JSON.parse(listString);
}

function createListOfObjects(listOfObjects) {
    createUnorderedListIfNotExists();

    listOfObjects.forEach(obj => {
        createElementInUnorderedList(obj);
    })
}

function addItemToLocalAndUpdateHtml(item) {
    addItemToLocalStorage(item);
    updateListInHtml();
}

function addItemToLocalStorage(item) {
    const listOfItems = getListOfObjectsFromLocalStorage();
    listOfItems.unshift(item);
    saveElementToLocalStorage('list', JSON.stringify(listOfItems));
}

function triggerAdd(event) {
    const keyCode = event.keyCode;
    if (keyCode === 13) { // enter pressed
        addItemFromInput();
    }
}

function addItemFromInput() {
    const valueAdd = document.querySelector(".box").value.trim();
    if (valueAdd === '') {
        return;
    }
    const uniqueId = uuidv4();
    const obj = {
        id: uniqueId,
        name: valueAdd,
        completed: false,
    }

    addItemToLocalAndUpdateHtml(obj);
    document.querySelector(".box").value = ''; // clear input
    setNumberOfElementsInView(getNumberOfElementsFromList());
}

function createUnorderedListIfNotExists() {
    const unorderedListIfNotExists = document.querySelector(".todo-list");
    if (!unorderedListIfNotExists) { // if <ul> list doesn't exist, create one
        createUnorderedList();
    }
}

function deleteContentOfUnorderedList() {
    const clearList = document.querySelector(".todo-list");

    if (clearList) {
        clearList.innerHTML = '';
    }
}

function createUnorderedList() {
    const newUnorderedList = document.createElement("ul");
    newUnorderedList.setAttribute("class", "todo-list");
    document.querySelector(".items").appendChild(newUnorderedList);
}

function createElementInUnorderedList(obj) {
    const newItem = document.createElement("li");
    newItem.setAttribute("data-id", obj.id);

    const newDiv = document.createElement("div");
    newDiv.setAttribute("class", "view");
    newItem.appendChild(newDiv); // added div in li

    const newCheckBox = document.createElement("input");
    newCheckBox.setAttribute('type', 'checkbox');
    newDiv.appendChild(newCheckBox);

    if (obj.completed) {
        newItem.setAttribute("class", "completed");
        newCheckBox.checked = true;
    }

    newCheckBox.onclick = function () {
        const listItems = getListOfObjectsFromLocalStorage();
        const foundIndexItem = listItems.findIndex(elem => elem.id === obj.id);
        const foundItem = listItems[foundIndexItem];
        foundItem.completed = this.checked;
        listItems.splice(foundIndexItem, 1, foundItem);
        saveListOfObjectsToLocalStorage(listItems);
        updateListInHtml();
        setNumberOfElementsInView(getNumberOfElementsFromList());
    }

    const newLabel = document.createElement("label"); // add label with value to div
    newLabel.innerHTML = obj.name;
    newDiv.appendChild(newLabel);

    const newDeleteButton = document.createElement("button");
    newDeleteButton.setAttribute("class", "delete");
    newDeleteButton.innerHTML = 'x';
    newDiv.appendChild(newDeleteButton);

    // listen to click event on button
    newDeleteButton.addEventListener('click', event => {
        const list = getListOfObjectsFromLocalStorage();
        const foundIndexItem = list.findIndex(elem => elem.id === obj.id);
        list.splice(foundIndexItem, 1);
        saveListOfObjectsToLocalStorage(list);
        updateListInHtml();
        setNumberOfElementsInView(getNumberOfElementsFromList());
    });

    document.querySelector(".todo-list").appendChild(newItem);
    setNumberOfElementsInView(getNumberOfElementsFromList());
}

function getNumberOfElementsFromList() {
    const list = getListOfObjectsFromLocalStorage();
    return list.length;
}

function setNumberOfElementsInView(value) {
    let text = '';
    if (value === 0 || value === 1) {
        text = `<strong>${value}</strong> <span>item left.</span>`;
    } else if (value > 1) {
        text = `<strong>${value}</strong> <span>items left.</span>`;
    }
    document.querySelector(".nrOfItems").innerHTML = text;
}

function saveElementToLocalStorage(key, value) {
    localStorage.setItem(key, value);
}

function filterListOfObjects(list, all, completed) {
    if (!all) {
        var list = list.filter(elem => {
            if (!completed) {
                return !elem.completed;
            }
            if (completed) {
                return elem.completed;
            }
        })
    }
    return list;
}

function activeFilter() {
    createFilter(false, false);
}

function allFilter() {
    createFilter(true, true);
}

function completedFilter() {
    createFilter(false, true);
}

function createFilter(all, completed) {
    let list = getListOfObjectsFromLocalStorage();
    list = filterListOfObjects(list, all, completed);
    deleteContentOfUnorderedList();
    createListOfObjects(list);
    setNumberOfElementsInView(list.length);
}

function clearCompleted() {
    let list = getListOfObjectsFromLocalStorage();
    //data attribute from each element-> completed
    let listOfActiveItems = list.filter(key => {
        return !key.completed;
    });

    saveListOfObjectsToLocalStorage(listOfActiveItems);
    updateListInHtml();
    setNumberOfElementsInView(listOfActiveItems.length);
}

function saveListOfObjectsToLocalStorage(objects) {
    saveElementToLocalStorage('list', JSON.stringify(objects));
}

function uuidv4() { // generates a v4 uuid
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function addActiveClass(e) {
    const elements = document.querySelector(".active");
    if (elements !== null) {
        elements.classList.remove("active");
    }
    e.target.className = "active";
}

function clearAllItems() {
    let list = getListOfObjectsFromLocalStorage();
    list = [];
    deleteContentOfUnorderedList();
    saveListOfObjectsToLocalStorage(list);
    setNumberOfElementsInView(list.length);
}