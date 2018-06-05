
public with sharing class AP_SearchAirplaneController {

    @AuraEnabled
    public static List<Product2> searchAirplanes(String aFamily, String dType, String engNo, String name) {
        String fam = AP_Util.wrapToLike(aFamily);
        String drive = AP_Util.wrapToLike(dType);
        String engNumber = AP_Util.wrapToLike(engNo);
        String prodName = AP_Util.wrapToLike(name);
        try {

            List<Product2> airplanes = [
                    SELECT Name, Family, Wingspan__c, Length__c, Number_of_seats__c, Main_Engine__c, Number_of_engines__c, Drive_Type__c, (SELECT Id FROM Attachments WHERE Description='main')
                    FROM Product2
                    WHERE Family LIKE :fam AND Drive_Type__c LIKE :drive AND Number_of_engines__c LIKE :engNumber AND Name LIKE :prodName
            ];
            return airplanes;
        }catch(Exception exc) {
            AP_CustomExc custExc = new AP_CustomExc(exc.getTypeName(), exc.getMessage(), 0);
            throw new AuraHandledException(JSON.serialize(custExc));
        }
    }

}