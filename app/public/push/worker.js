// (function () {
  console.log('Service worker loaded');

  self.addEventListener('push', event => {
    const data = event.data.json();
    console.log('push received');
    self.registration.showNotifiaction(data.title, {
      body: 'Notified by Codethingers',
      icon: ''
    });
  });
// })();
