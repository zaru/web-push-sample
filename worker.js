if (typeof window !== "undefined") {
  document.addEventListener('DOMContentLoaded', function() {

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then( function(r) {
        navigator.serviceWorker.register("/worker.js", { scope: "/" })
          .then( subscribe )
          .catch( function(error) {
            console.log(error);
          }
        );
      });
    }

  });
} else {
  self.addEventListener("push", function(event) {
    var json = event.data.json();
    self.registration.showNotification(json.title, {
      body: json.body,
      icon: json.icon,

      // tag: "tag",
      // actions: [
      //   {action: 'action1', title: "button 1"},
      //   {action: 'action2', title: "button 2"}
      // ]
    });
  });

  self.addEventListener('notificationclick', function(event) {
    event.notification.close();

    if (event.action === 'action1') {
      clients.openWindow("/action1");
    } else if (event.action === 'action2') {
      clients.openWindow("/action2");
    } else {
      clients.openWindow("/");
    }
  }, false);
}

function subscribe(registration) {
  navigator.serviceWorker.ready.then(function(sw) {
    Notification.requestPermission(function(permission) {
      if(permission !== 'denied') {
        sw.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: new Uint8Array([4, 127, 0, 249, 93, 16, 236, 156, 61, 38, 26, 228, 251, 236, 246, 251, 38, 173, 31, 163, 46, 212, 105, 52, 17, 220, 139, 241, 168, 207, 213, 48, 133, 30, 102, 125, 64, 137, 187, 144, 42, 157, 116, 205, 182, 237, 204, 81, 175, 174, 24, 210, 235, 14, 150, 118, 20, 118, 245, 32, 40, 147, 7, 154, 131])
        }).then(function(s) {
          var data = {
            endpoint: s.endpoint,
            p256dh: btoa(String.fromCharCode.apply(null, new Uint8Array(s.getKey('p256dh')))).replace(/\+/g, '-').replace(/\//g, '_'),
            auth: btoa(String.fromCharCode.apply(null, new Uint8Array(s.getKey('auth')))).replace(/\+/g, '-').replace(/\//g, '_')
          }
          console.log(data);
        });
      }
    });
  });
}
