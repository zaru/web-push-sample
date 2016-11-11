require 'sinatra'
require 'slim'
require 'webpush'
require 'pry'

require './models/store.rb'

class MainApp < Sinatra::Base
  before do
    @store = Models::Store.new
  end

  after do
    @store.db.close
  end

  get '/' do
    unless @store.db.keys.include?("vapid_public_key") || @store.db.keys.include?("vapid_private_key")
      vapid_key = Webpush.generate_key
      @store.db["vapid_public_key"] = vapid_key.public_key
      @store.db["vapid_private_key"] = vapid_key.private_key
    end
    @vapid = {
      public_key: @store.db["vapid_public_key"],
      private_key: @store.db["vapid_private_key"]
    }

    slim :index
  end

  post '/push' do
    Webpush.payload_send(
      message: params["message_json"],
      endpoint: params["endpoint"],
      p256dh: params["p256dh"],
      auth: params["auth"],
      vapid: {
        subject: "mailto:sender@example.com",
        public_key: @store.db["vapid_public_key"],
        private_key: @store.db["vapid_private_key"]
      }
    )
  end
end
