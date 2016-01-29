# web-push-sample
ServiceWorker WebPushNotification sample / demo script

## usage

```
$ php -S localhost:9999
```

open http://localhost:9999

```
$ curl --header "Authorization: key=API_KEY" --header Content-Type:"application/json" https://android.googleapis.com/gcm/send -d "{\"registration_ids\":[\"endpoint\"]}"
```
