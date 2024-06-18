import { insertTemplateElement } from '../utils/insertTemplateElement.js';
import { handleLogout } from './handleLogout.js';
import { authenticateUI } from './authenticateUI.js';
import { layoutTemplate } from './template.js';

class AuthLayout extends HTMLElement {
  constructor() {
    super();
    const template = document.createElement('template');
    template.innerHTML = layoutTemplate;
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.authControls = this.shadowRoot.querySelector('.auth-controls');
    this.checkAuthentication();
  }

  async checkAuthentication() {
    try {
      const response = await fetch('/api/users/me', { method: 'GET' });
      const authenticated = response.status !== 403;
      const data = authenticated && await response.json();        

      if ( data ) {
        authenticateUI({ 
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
