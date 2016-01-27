if (typeof window !== "undefined") {
  document.addEventListener('DOMContentLoaded', function() {

    // ServiceWorkerのインストール
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then( function(r) {
        navigator.serviceWorker.register("/worker.js", { scope: "/" })
          .then( subscribe )
          .catch( function(error) {
            console.log('インストールが正常にできませんでした');
          }
        );
      });
    }

  });
} else {
  self.addEventListener("push", function(event) {
    console.log(event);
    console.log(event.data);
    console.log(event.data.json());
    self.registration.showNotification("プッシュ通知だよ", {
      body: "通知メッセージ( ᐛ👐)パァ",
      icon: "https://pbs.twimg.com/profile_images/1303203427/zaru2png_400x400",
      tag: "tag",
      actions: [
        {action: 'action1', title: "ボタンだよ😀"},
        {action: 'action2', title: "こっちもボタン👻"}
      ]
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

// プッシュ通知の許可ダイアログ＆endpointを取得
function subscribe(registration) {
  navigator.serviceWorker.ready.then(function(sw) {
    Notification.requestPermission(function(permission) {
      if(permission !== 'denied') {
        sw.pushManager.subscribe({userVisibleOnly: true}).then(function(s) {
          console.log(s.endpoint);
        });
      }
    });
  });
}
