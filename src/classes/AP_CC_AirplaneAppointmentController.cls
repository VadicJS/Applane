public with sharing class AP_CC_AirplaneAppointmentController {
    public static final String EVENT_SUBJECT = AP_Settings__c.getValues('Plane Showing').Plane_Showing_Event_Subject__c;
    public static final String BASIC_INSTANCE = AP_Settings__c.getValues('Plane Showing').basicInstance__c;
    @AuraEnabled
    public static List<AP_Hangar__c> getAvailableHangars(String typeId) {
        try {
            List<String> hangars = new List<String>();
            for (Product2 plane : [SELECT Hangar__c FROM Product2 WHERE Model__c = :typeId]) {
                hangars.add(plane.Hangar__c);
            }
            return [SELECT Id, Name, Country__c, City__c, Street__c, Property_number__c, Dealer__c FROM AP_Hangar__c WHERE Id IN :hangars];
        } catch (AP_CustomException exc) {
            throw new AuraHandledException(JSON.serialize(exc));
        }
    }
    @AuraEnabled
    public static List<CustomerEvent> saveToCacheEvents(AP_Hangar__c hang, Datetime dateOfEvent, AP_Model__c plane) {
        Datetime dt = datetime.now();
        if (dateOfEvent < dt) {
            AP_CustomExc exc = new AP_CustomExc(System.Label.AP_Date_Error, System.Label.AP_Date_not_in_future, 0);
            throw new AuraHandledException(JSON.serialize(exc));
        }
        Datetime dateBuffer = dateOfEvent;
        Datetime endTime = dateBuffer.addHours(3);
        Datetime threeHoursBefore = dateBuffer.addHours(-3);
        List<Event> evts = getEventsOverlappingTruApi( hang,  endTime,  dateOfEvent,  threeHoursBefore);
        if (!evts.isEmpty()) {
            AP_CustomExc exc = new AP_CustomExc(System.Label.AP_Date_Error, System.Label.AP_Date_Reserved, 0);
            throw new AuraHandledException(JSON.serialize(exc));
        }
        CustomerEvent custEvt = new CustomerEvent();
        custEvt.placeHangar = hang;
        custEvt.dateOfEvent = dateOfEvent;
        custEvt.plane = plane;
        List<CustomerEvent> listEvents = (List<CustomerEvent>) Cache.Session.get('EventCache');
        if (listEvents != null) {
            Boolean isError = false;
            for (CustomerEvent customerEvent : listEvents) {
                if (customerEvent.dateOfEvent == dateOfEvent) {
                    AP_CustomExc exc = new AP_CustomExc(System.Label.AP_Date_Error, System.Label.AP_You_have_meeting_to_confirm + ' ' + customerEvent.placeHangar.Name, 0);
                    throw new AuraHandledException(JSON.serialize(exc));
                }
            }
        }
        try {
            if (listEvents == null) {
                listEvents = new List<AP_CC_AirplaneAppointmentController.CustomerEvent>();
            }
            listEvents.add(custEvt);
            Cache.Session.put('EventCache', listEvents);
            System.debug(listEvents);
            return listEvents;
        } catch (Exception exc) {
            throw new AuraHandledException(JSON.serialize(exc));
        }
    }
    public static List<Event> getEventsOverlappingTruApi(AP_Hangar__c hang, Datetime endTime, Datetime dateOfEvent, Datetime threeHoursBefore) {
        Http protocol = new Http();
        HttpRequest req = new HttpRequest();
        String query = 'SELECT Id, StartDateTime FROM Event WHERE Subject = ' + EVENT_SUBJECT + ' AND OwnerId = \''+ hang.Dealer__c + '\'';
        query = query.replaceAll('\\s+', '+');
        req.setEndpoint(BASIC_INSTANCE + '/services/data/v40.0/query/?q=' + query);
        req.setHeader('Authorization', 'OAuth ' + AP_Util.login());
        req.setMethod('GET');
        HttpResponse res = protocol.send(req);
        AP_Util.ResponseJson resJson = new AP_Util.ResponseJson();
        List<Event> evts = new List<Event>();
        System.debug(res.getStatusCode());
        if (res.getStatusCode() == 200) {
            resJson = (AP_Util.ResponseJson) JSON.deserialize(res.getBody(), AP_Util.ResponseJson.class);
            evts = resJson.records;
        }
        List<Event> overlapped = new List<Event>();
        for (Event event : evts) {
            if((event.StartDateTime >= dateOfEvent && event.StartDateTime <= endTime) || (event.StartDateTime >= threeHoursBefore && event.StartDateTime <= dateOfEvent)) {
                overlapped.add(event);
            }
        }
        return overlapped;
    }
    @AuraEnabled
    public static List<CustomerEvent> getEvts() {
        try {
            List<CustomerEvent> listEvents = (List<CustomerEvent>) Cache.Session.get('EventCache');
            if(listEvents == null) {
                listEvents = new List<AP_CC_AirplaneAppointmentController.CustomerEvent>();
            }
            return listEvents;
        } catch (Exception exc) {
            AP_CustomExc cusExc = new AP_CustomExc(System.Label.AP_Error, exc.getMessage() , 0);
            throw new AuraHandledException(JSON.serialize(cusExc));
        }
    }

    @AuraEnabled
    public static void removeCustEvt(String indx) {
        List<CustomerEvent> listEvt = (List<CustomerEvent>) Cache.Session.get('EventCache');
        listEvt.remove(Integer.valueOf(indx));
        Cache.Session.remove('EventCache');
        Cache.Session.put('EventCache', listEvt);
    }

    @AuraEnabled
    public static void clearCache() {
        Cache.Session.remove('EventCache');
        List<CustomerEvent> listEvents = new List<AP_CC_AirplaneAppointmentController.CustomerEvent>();
        Cache.Session.put('EventCache', listEvents);
    }

    private static void insertEventTruApi(List<Event> evts) {
        Http protocol = new Http();
        HttpRequest req = new HttpRequest();
        req.setEndpoint(BASIC_INSTANCE + '/services/data/v34.0/composite/tree/Event');
        req.setHeader('Authorization', 'OAuth ' + AP_Util.login());
        req.setHeader('Content-Type', 'application/json');
        req.setMethod('POST');
        String bodyString = JSON.serialize(evts);
        bodyString = bodyString.replaceAll('"Event"}', '"Event","referenceId": "referenceBufferXXXXXXX"}');
        for (Integer i=0; i<evts.size(); i++) {
             bodyString = bodyString.replaceFirst('referenceBufferXXXXXXX', 'ref'+ i);
        }
        bodyString = '{"records" : ' + bodyString + '}';
        req.setBody(bodyString);
        try {
            HttpResponse res = protocol.send(req);
        } catch (Exception exc) {
            throw new AuraHandledException(JSON.serialize(exc));
        }
    }
    private static List<Event> getEventsTruApi(String contactId) {
        Http protocol = new Http();
        HttpRequest req = new HttpRequest();
        req.setEndpoint(BASIC_INSTANCE + '/services/data/v40.0/query/?q=SELECT+Description,+Location,+StartDateTime,+EndDateTime+FROM+Event+WHERE+WhoId=\'' + contactId + '\'');
        req.setHeader('Authorization', 'OAuth ' + AP_Util.login());
        req.setMethod('GET');
        HttpResponse res = protocol.send(req);
        AP_Util.ResponseJson resJson = new AP_Util.ResponseJson();
        List<Event> evts = new List<Event>();
        System.debug(res.getStatusCode());
        if (res.getStatusCode() == 200) {
            resJson = (AP_Util.ResponseJson) JSON.deserialize(res.getBody(), AP_Util.ResponseJson.class);
            evts = resJson.records;
        }
        return evts;
    }
    @AuraEnabled
    public static void insertAppointments() {
        List<CustomerEvent> listEvents = (List<CustomerEvent>) Cache.Session.get('EventCache');
        List<Event> evts = new List<Event>();
        for (CustomerEvent event : listEvents) {
            Datetime endTime = event.dateOfEvent.addHours(3);
            Datetime threeHoursBefore = event.dateOfEvent.addHours(-3);
            List<Event> overEvents = getEventsOverlappingTruApi( event.placeHangar,  endTime,  event.dateOfEvent,  threeHoursBefore);
            if (!overEvents.isEmpty()) {
                AP_CustomExc exc = new AP_CustomExc(System.Label.AP_Date_Error, System.Label.AP_Somebody_reserved_this_date + ' ' + event.dateOfEvent , 0);
                throw new AuraHandledException(JSON.serialize(exc));
            }
        }
        System.debug(listEvents[0].placeHangar);
        try {
            User currentUser = [SELECT Id, ContactId FROM User WHERE Id = :UserInfo.getUserId()][0];
            for (CustomerEvent cusEvt : listEvents) {
                Event evt = new Event();
                evt.OwnerId = cusEvt.placeHangar.Dealer__c;
                evt.WhoId = currentUser.ContactId;
                evt.Subject = EVENT_SUBJECT;
                evt.Description = cusEvt.plane.Name + ' ' + cusEvt.placeHangar.Name;
                evt.StartDateTime = cusEvt.dateOfEvent;
                evt.Airplane__c = [SELECT Id FROM Product2 WHERE Model__c =: cusEvt.plane.Id][0].Id;
                evt.Location = cusEvt.placeHangar.Country__c + ', ' + cusEvt.placeHangar.City__c + ', ' + cusEvt.placeHangar.Street__c + ' ' + cusEvt.placeHangar.Property_number__c;
                evt.DurationInMinutes = 360;
                evts.add(evt);

            }
            insertEventTruApi(evts);
        } catch (AP_CustomException exc) {
            throw new AuraHandledException(JSON.serialize(exc));
        }
    }
    @AuraEnabled
    public static List<Event> getExistingEvents() {
        try {
            User currentUser = [SELECT Id, ContactId FROM User WHERE Id = :UserInfo.getUserId()][0];
            return getEventsTruApi(currentUser.ContactId);
        } catch (Exception exc) {
            AP_CustomExc cusExc = new AP_CustomExc(System.Label.AP_Error, exc.getMessage() , 0);
            throw new AuraHandledException(JSON.serialize(cusExc));
        }
    }

    public class CustomerEvent {
        @AuraEnabled
        public Datetime dateOfEvent {
            get;
            set;
        }
        @AuraEnabled
        public AP_Hangar__c placeHangar {
            get;
            set;
        }
        @AuraEnabled
        public AP_Model__c plane {
            get;
            set;
        }
        public CustomerEvent() {
        }
    }
}