global class AutocreatedRegHandler1528099682912 implements Auth.RegistrationHandler {
    class RegHandlerException extends Exception{}
    global User createUser(Id portalId, Auth.UserData data) {
        Account acc = new Account();
        List<User> us = [SELECT Id FROM User WHERE Email=:data.email];
        if(!us.isEmpty()){
            throw new RegHandlerException('This user already exists');
        }
        String entryEmail = data.email;
        entryEmail = entryEmail.substring(entryEmail.indexOf('@') + 1);
        entryEmail = entryEmail.substring(0, entryEmail.indexOf('.'));
        entryEmail = '%' + entryEmail + '%';
        List<Account> accs = [SELECT Id, OwnerId FROM Account WHERE IsPartner = true AND Website LIKE :entryEmail];
        if(!accs.isEmpty()) {
            acc = accs[0];
        }
        if(acc.OwnerId == null) {
            acc = [SELECT Id, IsPartner, OwnerId FROM account WHERE Name = 'Unassigned Community Users'];
        }
        Contact c = new Contact();
        c.accountId = acc.Id;
        c.email = data.email;
        c.firstName = data.firstName;
        c.lastName = data.lastName;
        insert(c);

        User u = new User();
        Profile p = [SELECT Id FROM profile WHERE name = 'AP_Client'];
        u.username = data.email.substring(0, data.email.indexOf('@')) + '@applaneCommunity.com';
        u.email = data.email;
        u.lastName = data.lastName;
        u.firstName = data.firstName;
        String alias = data.firstName.substring(0, 1) + data.lastName.substring(0, 1);
        System.debug('ALIAS' + alias);
        if (alias.length() > 8) {
            alias = alias.substring(0, 8);
        }
        u.alias = alias;
        u.languagelocalekey = 'en_US';
        u.localesidkey = 'en_GB';
        u.emailEncodingKey = 'UTF-8';
        u.timeZoneSidKey = 'America/Los_Angeles';
        u.IsActive = true;
        u.profileId = p.Id;
        u.contactId = c.Id;
        return u;
    }

    global void updateUser(Id userId, Id portalId, Auth.UserData data) {
        User u = new User(id = userId);
        u.username = data.email.substring(0, data.email.indexOf('@')) + '@applaneCommunity.com';
        u.email = data.email;
        u.lastName = data.lastName;
        u.firstName = data.firstName;
        update(u);
    }
}