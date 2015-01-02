var base_path = './../';
var lib = require(base_path + 'lib');

describe('store', function() {
    var Sale_page = require(base_path + 'page/sale/Sale_page');
    var Tender_ui = require(base_path + 'page/sale/Tender_dlg');
    var Sp_info_dlg = require(base_path + 'page/sp/Sp_info_dlg');
    var Network_product_partial = require(base_path + 'page/product/network_product_partial');
    var Sp_page = require(base_path + 'page/sp/Sp_page');
    var Alert_dlg = require(base_path + 'page/ui/Alert_dlg');
    var Store_edit_dlg = require(base_path + 'page/store/Edit_dlg');

    beforeEach(function(){
        lib.auth.login('1','1');
        lib.setup.init_data();
        lib.auth.logout();
    })

    it('can participate or not with profit information exchange',function(){
        //--------------------------------------------------------
        // fixture: 3 stores all have some sale data for a product
        //--------------------------------------------------------
        lib.auth.login('1','1');
        var sku='111';var product_name='product name';var price=1;var cost_1=1;var cost_2=2;var cost_3=3;
        var vc_price=null;var crv=null;var is_taxable=true;var is_sale_report=true;var p_type=null;var p_tag=null;var vendor=null;var buydown = null;
        var qty_1=1;var qty_2=2;var qty_3=3;
        var sp = null;
        lib.api.insert_new(sku,product_name,price,vc_price,crv,is_taxable,is_sale_report,p_type,p_tag,cost_1,vendor,buydown).then(
            function(created_sp){
                sp = created_sp;
            }
        )
        Sale_page.visit(); Sale_page.scan(qty_1 + ' ' + sku);Sale_page.tender();Tender_ui.ok();
        lib.api_receipt.get_lst().then(
            function(lst){
                lib.api_receipt.edit_date(lst[0],-21)
            }
        )
        Sale_page.menu_action_sync();Alert_dlg.ok();

        browser.wait(function(){
            return sp !== null
        }).then(
            function(){
                lib.auth.login('2','2');
                lib.api.insert_old(sp.product_id,sku,product_name,price,vc_price,crv,is_taxable,is_sale_report,p_type,p_tag,cost_2,vendor,buydown);
                Sale_page.visit(); Sale_page.scan(qty_2 + ' ' + sku);Sale_page.tender();Tender_ui.ok();
                lib.api_receipt.get_lst().then(
                    function(lst){
                        lib.api_receipt.edit_date(lst[0],-21)
                    }
                )
                Sale_page.menu_action_sync();Alert_dlg.ok();

                lib.auth.login('3','3');
                lib.api.insert_old(sp.product_id,sku,product_name,price,vc_price,crv,is_taxable,is_sale_report,p_type,p_tag,cost_3,vendor,buydown);
                Sale_page.visit(); Sale_page.scan(qty_3 + ' ' + sku);Sale_page.tender();Tender_ui.ok();
                lib.api_receipt.get_lst().then(
                    function(lst){
                        lib.api_receipt.edit_date(lst[0],-21)
                    }
                )
                Sale_page.menu_action_sync();Alert_dlg.ok();  

                //-------------------------------------------------------------------------------------------------------------------------------------------------------
                // store 1 is the guy who will drop out of profit-info-exchange, but since we are at store 3, lets verify store 3 can see store 1 before store 1 drop out
                //-------------------------------------------------------------------------------------------------------------------------------------------------------
                Sale_page.visit_product();
                Sp_page.sku_search(sku);
                Sp_page.click_col(0,'name');
                Sp_info_dlg.switch_tab('network_product');
                lib.click(Sp_info_dlg.get_network_product_btn);
                expect(Network_product_partial.detail.cost_price_sale.lst.count()).toEqual(3);
                expect(Network_product_partial.detail.cost_price_sale.get_col(0,'sale')).toEqual(qty_1.toString());

                //----------------------------------------------------------------
                // before store 1 drop out, make sure store 1 can also see store 3
                //----------------------------------------------------------------         
                lib.auth.login('1','1');
                Sp_page.sku_search(sku);
                Sp_page.click_col(0,'info');
                Sp_info_dlg.switch_tab('network_product');
                lib.click(Sp_info_dlg.get_network_product_btn);
                expect(Network_product_partial.detail.cost_price_sale.lst.count()).toEqual(3);
                expect(Network_product_partial.detail.cost_price_sale.get_col(2,'sale')).toEqual(qty_3.toString());
                Sp_info_dlg.exit();
                
                //------------------------------------------------
                // store 1 drop out of profit-information-exchange
                //------------------------------------------------
                Sp_page.menu_setting_store();          
                lib.click(Store_edit_dlg.is_profit_information_exchange_check);
                Store_edit_dlg.ok();

                //----------------------------------------------
                // after store 1 drop out it can not see store 3
                //----------------------------------------------               
                Sp_page.sku_search(sku);
                Sp_page.click_col(0,'info');
                Sp_info_dlg.switch_tab('network_product');
                lib.click(Sp_info_dlg.get_network_product_btn);
                expect(Network_product_partial.detail.cost_price_sale.lst.count()).toEqual(3);
                expect(Network_product_partial.detail.cost_price_sale.get_col(2,'sale')).toEqual(undefined);
                Sp_info_dlg.exit();

                //-------------------------------------------------------------
                // and store 3 will not see store 1 but store 3 can see store 2
                //-------------------------------------------------------------           
                lib.auth.login('3','3');
                Sp_page.sku_search(sku);
                Sp_page.click_col(0,'info');
                Sp_info_dlg.switch_tab('network_product');
                lib.click(Sp_info_dlg.get_network_product_btn);
                expect(Network_product_partial.detail.cost_price_sale.lst.count()).toEqual(3);
                expect(Network_product_partial.detail.cost_price_sale.get_col(0,'sale')).toEqual('');
                expect(Network_product_partial.detail.cost_price_sale.get_col(1,'sale')).toEqual(qty_2.toString());
                Sp_info_dlg.exit();                       
            }
        )

    },60000)
});