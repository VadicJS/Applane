public with sharing class AP_Util {

    public static Location geolocate(String address) {
        Http protocol = new Http();
        HttpRequest req = new HttpRequest();
        address = address.replace(' ', '+');
        req.setEndpoint('https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=AIzaSyCheV7GAMG6lKeG3GyKFyLg0Q9BUwjV8Zk');
        req.setMethod('GET');
        HttpResponse res = protocol.send(req);
        RootObject apiResults = (RootObject) System.JSON.deserialize(res.getBody(), RootObject.class);
        return apiResults.results[0].geometry.location;
    }


    public static String wrapToLike(String text) {
        return '%' + text + '%';
    }

    public class AddressComponent {
        public string long_name { get; set; }
        public string short_name { get; set; }
        public List<string> types { get; set; }
    }

    public with sharing class Location {
        @AuraEnabled
        public double lat { get; set; }
        @AuraEnabled
        public double lng { get; set; }
    }

    public class Northeast {
        public double lat { get; set; }
        public double lng { get; set; }
    }

    public class Southwest {
        public double lat { get; set; }
        public double lng { get; set; }
    }

    public class Viewport {
        public Northeast northeast { get; set; }
        public Southwest southwest { get; set; }
    }

    public class Geometry {
        public Location location { get; set; }
        public string location_type { get; set; }
        public Viewport viewport { get; set; }
    }

    public class Result {
        public string formatted_address { get; set; }
        public Geometry geometry { get; set; }
    }

    public class RootObject {
        public List<Result> results { get; set; }
        public string status { get; set; }
    }
}