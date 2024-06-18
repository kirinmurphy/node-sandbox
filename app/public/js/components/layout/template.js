export const layoutTemplate = /*html*/ `
<style>
  .layout-container {
    display: none;
  }

  header {
    position: relative; 
    height: var(--site-header-height);
    z-index: 2;
    display:flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    background: var(--dark-color-a);
    color: #fff;
    padding: 0 10px;
  }

  header h1 {
    margin: 0;
    font-size: 1.2rem;          
  }

  .content {
    
  }

  .btn {
    display: inline-block;
    padding: .5rem 1rem;
    text-decoration: none;
    background: var(--button-color);
    color: var(--dark-color-a);
    font-size: .9rem;
    font-weight:bold;
  }
</style>

<div class="layout-container" id="layout-container">
  <div class="layout-content">
    <header>
      <h1>CincoChat</h1>
      <div class="auth-controls-wrapper">
        <template id="auth-controls-template">
          <div class="auth-controls">
            <span id="username"></span>
            <button id="logoutButton">Logout</button>
          </div>
        </template>  
        <template id="unauthed-controls-template">
          <div class="auth-controls">
            <a class="btn" href="/login">Log In</a>
            <a class="btn" href="/signup">Sign Up</a>
          </div>
        </template>
      </div>
    </header>
  
    <div class="content">
      <slot></slot>
    </div>
  </div>
</div>
`;
