// globals
var _MS_PER_DAY = 1000 * 60 * 60 * 24;
var _MS_PER_HR  = 1000 * 60 * 60;
var target = new Date(2014, 10, 21, 15, 0, 0, 0)

function dateDiffInHours(a, b) {
  // a and b are javascript Date objects
  // Discard the time and time-zone information.
  var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate(), a.getHours());
  var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate(), b.getHours());
  return Math.floor((utc2 - utc1) / _MS_PER_HR);
}

function dateDiffInDays(a, b) {
  // a and b are javascript Date objects
  // Discard the time and time-zone information.
  var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

Weekdays = new Meteor.Collection("weekdays");
Hotels      = new Meteor.Collection("hotels");
Churches    = new Meteor.Collection("churches");
Restaurants = new Meteor.Collection("restaurants");

if (Meteor.isClient) {
  Template.days.days_remaining = function()  {
    var today  = new Date();
    return dateDiffInDays(today, target);
  }

  Template.hours.hours_remaining = function()  {
    var today  = new Date();
    var result = dateDiffInHours(today, target);
    return result;
  }

  Template.week.weekdays = function () {
    return Weekdays.find({}, {sort: {date: -1}});
  };

  Template.hotels.all = function () {
    return Hotels.find({}, {sort: {name: 1}});
  };

  Template.churches.all = function () {
    return Churches.find({}, {sort: {name: 1}});
  };

  Template.restaurants.all = function () {
    return Restaurants.find({}, {sort: {name: 1}});
  };
  Template.venue_info.quick_time = function () {
    if (!this.time)
      return "";
    return moment(this.time).format('hA');
  };
}

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Weekdays.find().count() === 0) {
      for (var i = 0; i < 7; i++) {
        var tasks = {
          "22" : "Marriage+1; attending christening planned for lunchtime in Kilkenny",
          "21" : "The Big Day; wedding planned for 3pm, dinner at 5pm",
          "20" : "Rehearsal tentatively planned for evening/night time",
          "19" : "Day at home",
          "18" : "Return from Waterford to Kilkenny to present paperwork to the Registry office",
          "17" : "Attending friend's wedding, stay in Waterford that night",
          "16" : "Stay in Waterford ahead of wedding of a friend",
        };
        the_date = moment([2014, 10, 22-i, 15, 0, 0, 0]);
        Weekdays.insert({datestring: the_date.format("ddd D-MMM"), date: the_date, task: tasks[the_date.format("D")]});
      }
    }

    if (Hotels.find().count() === 0) {
      Hotels.insert({name: "Butler House",
                     url: "http://www.butler.ie/",
                     map_url: "https://goo.gl/maps/gIi9D",
                     maps_search: "Butler+House,Upper+Patricks+Street,Kilkenny,Ireland",
                     notes: "Historic Georgian Guesthouse, first preference right now",
                     question: "Where will we stay?",
                     time : null
                    });
    }

    if (Churches.find().count() === 0) {
      Churches.insert({name: "St. Canice's Church", 
                       url: "http://www.stcanicesparish.ie/",
                       map_url: "https://goo.gl/maps/pGn43",
                       maps_search: "Canice's+Church+19+Dean+Street,+Kilkenny,+Ireland",
                       notes: "This is the Catholic Church, St. Canice's Cathedral (nearby) is Protestant",
                       question: "Where will we pray?",
                       time : new Date(2014, 10, 21, 15, 0, 0, 0)
                      });
    }

    if (Restaurants.find().count() === 0) {
      Restaurants.insert({name: "Ristorante Rinuccini",
                          url: "http://www.rinuccini.com",
                          map_url: "https://goo.gl/maps/sQA5W",
                          maps_search: "Ristorante+Rinuccini,Kilkenny,Ireland",
                          notes: "Italian-style food",
                          question: "Where will we eat?",
                          time : new Date(2014, 10, 21, 17, 0, 0, 0)
                         });
    }

  });
}
