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
  async function getRooms () {
    try {
      const response = await fetch(API_PATH);
      const { collection } = await response.json();
      const template = ({ id, name }) => `<option vaule=${id}>${name}</option>`;
      elements.roomSelector.innerHTML = collection.map(template).join('');  
    } catch (err) {
      console.log('get rooms failed'); // TODO - what UX do we want here
    }
  }

  function onTriggerAddForm (event) {
    event.preventDefault();
    showAddForm();
  }

  async function onAddFormSubmit (event) {
    event.preventDefault();
    const url = getUrl(event, ['name', 'description']);
    await saveNewRoom(url);
    await getRooms();
    hideAddForm();
  }

  async function saveNewRoom (url) {
    try {
      await fetch(url, { method: 'POST' });
    } catch (err) {
      console.log('post room failed');  // TODO - what UX do we want here
    }
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

