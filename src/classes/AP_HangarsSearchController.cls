public class AP_HangarsSearchController {
    @AuraEnabled
    public static List<AP_Hangar__c> searchHangars(String country, Integer capacity) {
        List<AP_Hangar__c> searchResults = new List<AP_Hangar__c>();
        capacity = (capacity == null) ? 0 : capacity;
        searchResults = [ SELECT Name, Street__c, City__c, Country__c, Capacity__c FROM AP_Hangar__c WHERE Country__c=:country AND Capacity__c>=:capacity];
        return searchResults;
    }
}