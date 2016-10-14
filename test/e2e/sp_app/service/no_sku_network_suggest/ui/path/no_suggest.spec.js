var base_path = './../../../../../'
var lib = require(base_path + 'lib');

describe('no_sku_network_suggest_path -> no suggest', function() {
    var Sp_page = require(base_path + 'page/sp/Sp_page.js');
    var Sp_prompt_dlg = require(base_path + 'page/sp/Sp_prompt_dlg.js');

    beforeEach(function(){
        lib.auth.login('1','1');
        lib.setup.init_data();
        lib.auth.logout();
    })

    it('can go stratight to create new if there is no add sku or add product suggestion',function(){
        lib.auth.login('1','1');
        Sp_page.sku_search('111');
        expect(Sp_prompt_dlg.self.isPresent()).toEqual(true);
    })
});