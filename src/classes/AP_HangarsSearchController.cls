public class AP_HangarsSearchController {

    @AuraEnabled
    public static List<HangarLocationWrapper> searchHangars(String country, Integer capacity) {
        List<HangarLocationWrapper> locHangars = new List<HangarLocationWrapper>();
        capacity = (capacity == null) ? 0 : capacity;
        for (AP_Hangar__c apHangar : [ SELECT Name, Street__c, City__c, Country__c, Capacity__c FROM AP_Hangar__c WHERE Country__c=:country AND Capacity__c>=:capacity]) {
            HangarLocationWrapper hang = new HangarLocationWrapper();
            hang.hangar = apHangar;
            String address = apHangar.Street__c + ' ' + apHangar.City__c + ' ' + apHangar.Country__c;
            hang.loc = AP_Util.geolocate(address);
            locHangars.add(hang);
        }
        return locHangars;
    }
    @AuraEnabled
    public static HangarLocationWrapper fetchHangar(Id hangarId) {
        AP_Hangar__c ap_hangar = [ SELECT Name, Street__c, City__c, Country__c, Capacity__c FROM AP_Hangar__c WHERE Id=:hangarId];
        HangarLocationWrapper hang = new HangarLocationWrapper();
        hang.hangar = ap_hangar;
        hang.loc = AP_Util.geolocate(ap_hangar.Street__c + ' ' + ap_hangar.City__c + ' ' + ap_hangar.Country__c);
        return hang;
    }

    public class HangarLocationWrapper {
        @AuraEnabled
        public AP_Hangar__c hangar { get; set; }
        @AuraEnabled
        public AP_Util.Location loc { get; set; }
    }

    @AuraEnabled
    public static List<String> getPicklistValues(String objectType, String selectedField) {
        List<String> pickListValuesList = new List<String>();
        Schema.SObjectType convertToObj = Schema.getGlobalDescribe().get(objectType);
        Schema.DescribeSObjectResult res = convertToObj.getDescribe();
        Schema.DescribeFieldResult fieldResult = res.fields.getMap().get(selectedField).getDescribe();
        List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
        for (PicklistEntry picklistVal : ple) {
            pickListValuesList.add(pickListVal.getLabel());
        }
        return pickListValuesList;
    }
}