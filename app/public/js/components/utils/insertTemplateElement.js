export function insertTemplateElement({ shadowRoot, templateId, onBeforeInsert }) {
  const template = shadowRoot.getElementById(templateId);
  const clone = document.importNode(template.content, true);
  onBeforeInsert && onBeforeInsert(clone);
  template.parentElement.appendChild(clone);
}