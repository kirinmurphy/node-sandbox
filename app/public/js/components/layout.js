import { handleLogout } from '../utils/handleLogout.js';
import { insertTemplateElement } from '../utils/insertTemplateElement.js';

class AuthLayout extends HTMLElement {
  constructor() {
    super();
    const template = document.createElement('template');
    template.innerHTML = /*html*/ `
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
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    // handleLogout();
    this.authControls = this.shadowRoot.querySelector('.auth-controls');
    this.checkAuthentication();
  }

  async checkAuthentication() {
    try {
      const response = await fetch('/api/users/me', { method: 'GET' });
      const authenticated = response.status !== 403;
      const data = authenticated && await response.json();        

      if ( data ) {
        authenticate({ 
          data, 
          shadowRoot: this.shadowRoot,
          dispatch: this.dispatchEvent.bind(this), 
          onLogout: this.handleLogout.bind(this)
        });


      } else {
        insertTemplateElement({ 
          shadowRoot: this.shadowRoot,
          templateId:  'unauthed-controls-template', 
        });
      }

      this.shadowRoot.getElementById('layout-container').style.display = 'block';

    } catch (err) {
      alert('failed to connect to server');
      console.error('Failed to connect to server:', err);
    }
  }

  handleLogout() {
    handleLogout();
  }
}


customElements.define('auth-layout', AuthLayout);


function authenticate({ data, shadowRoot, dispatch, onLogout }) {
  const username = data.username;

  insertTemplateElement({ 
    shadowRoot,
    templateId:  'auth-controls-template', 
    onBeforeInsert: (clone) => {
      clone.querySelector('#username').textContent = username;
      clone.querySelector('#logoutButton').addEventListener('click', onLogout);
    }
  });
  
  dispatch(new CustomEvent('user-data', { detail: { username }, bubbles: true, composed: true }));
}
