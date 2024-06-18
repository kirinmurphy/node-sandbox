import { joinFormTemplate } from "./template.js";

class JoinFormComponent extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement('template');
    template.innerHTML = joinFormTemplate;
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    document.addEventListener('user-data', (event) => {
      const { username } = event.detail;
      this.setUsername(username);
    });    
  }

  connectedCallback() {
    const joinForm = this.shadowRoot.getElementById('join-form');
    const isAuthenticated = this.getAttribute('isAuthenticated') === 'true';
    const templateId = isAuthenticated ? 'hidden-username-template' : 'username-input-template';
    const template = this.shadowRoot.getElementById(templateId).content.cloneNode(true);
    joinForm.insertBefore(template, joinForm.firstChild);

    this.roomSelector = this.shadowRoot.getElementById('room');
    this.addNewRoomButton = this.shadowRoot.getElementById('add-new-room');
    this.addNewRoomForm = this.shadowRoot.getElementById('add-new-room-form');
    this.cancelNewRoomForm = this.shadowRoot.getElementById('cancel-add-room');

    joinForm.addEventListener('submit', this.onJoinFormSubmit.bind(this));
    this.addNewRoomForm.addEventListener('submit', this.onAddFormSubmit.bind(this));
    this.cancelNewRoomForm.addEventListener('click', this.hideAddForm.bind(this));

    if (isAuthenticated) {
      this.addNewRoomButton.style.display = 'inline-block';
      this.addNewRoomButton.addEventListener('click', (event) => {
        event.preventDefault();
        this.showAddForm();
      });
    }

    this.getRooms();
  }

  async getRooms() {
    try {
      const response = await fetch('/api/chatRooms');
      const { collection } = await response.json();
      const template = ({ id, name }) => `<option value=${id}>${name}</option>`;
      this.roomSelector.innerHTML = collection.map(template).join('');
    } catch (err) {
      console.log('get rooms failed'); // TODO - what UX do we want here
    }
  }

  setUsername(username) {
    const isAuthenticated = this.getAttribute('isAuthenticated') === 'true';
    if (isAuthenticated) {
      const usernameInput = this.shadowRoot.getElementById('hidden-username');
      usernameInput.value = username;
    }
  }  

  onJoinFormSubmit(event) {
    // const isAuthenticated = this.getAttribute('isAuthenticated') === 'true';
    // if (isAuthenticated) {
    //   const usernameInput = this.shadowRoot.getElementById('hidden-username');
    //   usernameInput.value = 'user123'; // Replace 'user123' with the actual username value
    // }
  }

  async onAddFormSubmit(event) {
    event.preventDefault();
    const url = this.getUrl(event, ['name', 'description']);
    await this.saveNewRoom(url);
    await this.getRooms();
    this.hideAddForm();
  }

  async saveNewRoom(url) {
    try {
      await fetch(url, { method: 'POST' });
    } catch (err) {
      console.log('post room failed'); // TODO - what UX do we want here
    }
  }

  showAddForm() {
    this.shadowRoot.getElementById('join-form').style.display = 'none';
    this.addNewRoomForm.style.display = 'block';
  }

  hideAddForm() {
    this.addNewRoomForm.style.display = 'none';
    this.shadowRoot.getElementById('join-form').style.display = 'block';
    // todo - reset form fields
  }

  getUrl(event, params) {
    const elements = event.target.elements;
    return `/api/chatRooms?` + params.map(key => `${key}=${elements[key].value.trim()}`).join('&');
  }
}

customElements.define('join-form-component', JoinFormComponent);
