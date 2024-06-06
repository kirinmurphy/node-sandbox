class JoinFormComponent extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement('template');

    template.innerHTML = /*html*/ `
      <style>
        * {
          box-sizing: border-box;
        }

        .form-control {
          margin-bottom: 10px;
        }
        .form-control label {
          display: block;
          margin-bottom: 5px;
        }
        .form-control input, .form-control select, .form-control textarea {
          width: 100%;
          padding: 8px;
          margin-bottom: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        .link {
          text-decoration: underline;
          color: #fff;
          cursor: pointer;
        }
        
        .btn {
          background: #333;
          color: #fff;
          padding: 10px 15px;
          border: none;
          cursor: pointer;
        }
        .btn:hover {
          background: #555;
        }

        .link:hover {
          text-decoration: underline;
        }

        .btn[type="submit"] {
          width: 100%;
          padding; 1rem 2rem;
          font-size: 1.1rem;
        }

        /* .room-selector .row {
          display: flex;  
          flex-direction: row;   
          align-items: center;
          gap: 2rem;      
        } */

        .form-control footer {
          display: flex;
          justify-content: flex-end;
        }
      </style>

      <form id="join-form" action="chat.html" method="GET">
        <template id="username-input-template">
          <div class="form-control" id="username-container">
            <label for="username">Username</label>
            <input type="text" name="username" id="username" placeholder="Enter username..." required />
            <footer>
              <a class="link" href="/login">Log In</a>&nbsp;or&nbsp;<a class="link" href="/signup">Sign Up</a>
            </footer>
          </div>
        </template>
        <template id="hidden-username-template">
          <input type="hidden" name="username" id="hidden-username">
        </template>
        <div class="form-control room-selector">
          <div class="row">
            <label for="room">Room</label>
            <select name="room" id="room" required></select>
          </div>
          <footer>
            <a id="add-new-room" class="link" style="display:none;">Add New Room</a>
          </footer>        
        </div>
        <button type="submit" class="btn">Join Chat</button>
      </form>
      
      <form id="add-new-room-form" style="display:none;">
        <div class="form-control">
          <label for="room-name">Room Name</label>
          <input type="text" name="name" id="room-name" placeholder="Enter room name..." required />
        </div>
        <div class="form-control">
          <label for="room-description">Room Description</label>
          <textarea name="description" id="room-description" placeholder="Describe the room to potential users"></textarea>
        </div>
        <button type="submit" class="btn">Add New Room</button>
        <span id="cancel-add-room" class="link">Cancel</span>
      </form>
    `;
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
      console.log('collection', collection);
      const template = ({ id, name }) => {
        return `<option value=${id}>${name}</option>` 
      };
      this.roomSelector.innerHTML = collection.map(template).join('');
    } catch (err) {
      console.log('get rooms failed', err); // TODO - what UX do we want here
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
