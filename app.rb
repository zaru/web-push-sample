require 'sinatra'
require 'slim'
require 'webpush'

get '/' do
  @vapid_key = Webpush.generate_key
  slim :index
end

post '/push' do
  Webpush.payload_send(
    message: params[:message]
    endpoint: params[:subscription][:endpoint],
    p256dh: params[:subscription][:keys][:p256dh],
    auth: params[:subscription][:keys][:p256dh],
    vapid: {
      subject: "mailto:sender@example.com",
      public_key: ENV['VAPID_PUBLIC_KEY'],
      private_key: ENV['VAPID_PRIVATE_KEY']
    }
  )
end
