var base_path = './../../';
var lib = require(base_path + 'lib');

describe('sp page menu sync', function() {

    var Sp_page = require(base_path + 'page/sp/Sp_page.js');
    var Alert_dlg = require(base_path + 'page/ui/Alert_dlg.js');

    beforeEach(function(){
        lib.auth.login('1','1');
        lib.setup.init_data();
        lib.auth.logout();
    })

    it('can display no database warning',function(){
        lib.auth.login('1','1');
        Sp_page.menu_action_sync();
        expect(Alert_dlg.message_lbl.getText()).toEqual('there is no offline database to sync');
        
    },60000/*60 second timeout*/)
});