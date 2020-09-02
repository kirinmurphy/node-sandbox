(function () {
  const API_PATH = '/api/chatRooms';

  const elements = {
    roomSelector: document.getElementById('room'),
    joinForm: document.getElementById('join-form'),
    addNewRoomTrigger: document.getElementById('add-new-room'),
    addNewRoomForm: document.getElementById('add-new-room-form'),
    cancelNewRoomForm: document.getElementById('cancel-add-room')
  };

  getRooms();
  
  elements.addNewRoomTrigger.addEventListener('click', onTriggerAddForm);

  elements.addNewRoomForm.addEventListener('submit', onAddFormSubmit);

  elements.cancelNewRoomForm.addEventListener('click', hideAddForm);

  // HELPERS
  function getRooms () {
    return fetch(API_PATH).then((response) => {
      return response.json();
    }).then(({ collection }) => {
      const template = ({ id, name }) => `<option vaule=${id}>${name}</option>`;
      elements.roomSelector.innerHTML = collection.map(template).join('');
    }).catch(err => {
      console.log('err: ', err);
    });
  }

  function onTriggerAddForm (event) {
    event.preventDefault();
    showAddForm();
  }

  function onAddFormSubmit (event) {
    event.preventDefault();

    const url = getUrl(event, ['name', 'description']);

    fetch(url, { method: 'POST' }).then((response) => {
      return response.json();
    }).then(async () => {
      try {
        await getRooms();
        hideAddForm();  
      } catch (err) { 
        console.error(err);
      }
    }).catch(err => {
      console.log('err: ', err);
    });
  }

  function showAddForm () {
    elements.joinForm.style = 'display:none;';
    elements.addNewRoomForm.style = 'display:block;';
  }

  function hideAddForm () {
    elements.addNewRoomForm.style = 'display:none;';
    elements.joinForm.style = 'display:block;';
    // todo - reset form fields
  }

  function getUrl (event, params) {
    const elements = event.target.elements;
    return `${API_PATH}?` + params
      .map(key => `${key}=${elements[key].value.trim()}`)
      .join('&');
  }
})();

