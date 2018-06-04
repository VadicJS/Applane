public with sharing class AP_NewAirplaneController {

    @AuraEnabled
    public static String createNewAirplane(Product2 plane, List<String> base64Data) {
        try {
            insert plane;
            saveAttachment(plane.Id, base64Data);
            return plane.Id;
        } catch (Exception exc) {
            AP_CustomExc custExc = new AP_CustomExc(exc.getTypeName(), exc.getMessage(), 0);
            throw new AuraHandledException(JSON.serialize(custExc));
        }
    }

    private static void saveAttachment(Id parentId, List<String> base64Data) {
        List<Attachment> atts = new List<Attachment>();
        for (String str : base64Data) {
            Attachment att = new Attachment();
            str = str.removeStart('data:image/jpeg;base64,');
            att.parentId = parentId;
            att.body = EncodingUtil.base64Decode(str);
            att.ContentType = 'image/jpeg;base64';
            att.Name = 'img ' + System.now();
            atts.add(att);
        }
        try {
            if (atts.size() > 0) {
                atts[0].Description = 'main';
            }
            insert atts;
        } catch (Exception exc) {
            AP_CustomExc custExc = new AP_CustomExc(exc.getTypeName(), exc.getMessage(), 0);
            throw new AuraHandledException(JSON.serialize(custExc));
        }
    }
}