# web-push-sample
ServiceWorker WebPushNotification sample / demo script.

WebPush ruby gem here.
https://github.com/zaru/webpush

## usage

```
$ php -S localhost:9999
```

open http://localhost:9999

```
$ curl --header "Authorization: key=API_KEY" --header Content-Type:"application/json" https://android.googleapis.com/gcm/send -d "{\"registration_ids\":[\"endpoint\"]}"
```
