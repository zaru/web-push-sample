require 'daybreak'

module Models
  class Store
    attr_reader :db

    def initialize
      @db = Daybreak::DB.new "webpush.db"
    end
  end
end
