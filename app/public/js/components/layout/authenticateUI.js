import { insertTemplateElement } from '../utils/insertTemplateElement.js';

export function authenticateUI({ data, shadowRoot, dispatch, onLogout }) {
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
