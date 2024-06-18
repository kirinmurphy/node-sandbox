export function buildMentionedEntitiesList({ roomId }) {
  const updatesDiv = document.getElementById('mentioned-entities');
  const eventSource = new EventSource(`/events?roomId=${roomId}`);
  eventSource.onmessage = function(event) {
    const data = JSON.parse(event.data);

    data.forEach(({ entity, fact }) => {
      const div = document.createElement('div');
      div.classList.add('mentioned-entity');
      const template = `<strong>${entity}</strong> ${fact}`;
      div.innerHTML = template;
      updatesDiv.insertBefore(div, updatesDiv.firstChild);
    });
  }

  eventSource.onerror = function(err) {
    console.error('EventSource failed:', err);
  };
}
