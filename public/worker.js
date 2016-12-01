if (typeof window !== "undefined") {
  var btn = document.getElementById("btn-register");
  btn.addEventListener('click', function() {
    var publicKey = btn.getAttribute("data-public-key");
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then( function(r) {
        navigator.serviceWorker.register("/worker.js", { scope: "/" })
          .then( subscribe(publicKey) )
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

function subscribe(serverPublicKey) {
  navigator.serviceWorker.ready.then(function(sw) {
    Notification.requestPermission(function(permission) {
      if(permission !== 'denied') {
        sw.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: new Uint8Array(base64ToArrayBuffer(serverPublicKey))
        }).then(function(s) {
          var data = {
            endpoint: s.endpoint,
            p256dh: btoa(String.fromCharCode.apply(null, new Uint8Array(s.getKey('p256dh')))).replace(/\+/g, '-').replace(/\//g, '_'),
            auth: btoa(String.fromCharCode.apply(null, new Uint8Array(s.getKey('auth')))).replace(/\+/g, '-').replace(/\//g, '_')
          }
          document.getElementById("endpoint").textContent = data.endpoint;
          document.getElementById("auth").textContent = data.auth;
          document.getElementById("p256dh").textContent = data.p256dh;
        });
      }
    });
  });
}

function base64ToArrayBuffer(serverPublicKey) {
    var string =  window.atob(serverPublicKey.replace(/-/g, '+').replace(/_/g, '/'));
    var len = string.length;
    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++)        {
        bytes[i] = string.charCodeAt(i);
    }
    return bytes.buffer;
}
