export const joinFormTemplate = /*html*/ `
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
`