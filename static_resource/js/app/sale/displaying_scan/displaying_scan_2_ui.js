define(
    [
         'lib/async'
        ,'app/sale/displaying_scan_modifier/displaying_scan_modifier'
        ,'app/sale/displaying_scan_modifier/Instruction'
        ,'app/sale/displaying_scan/displaying_scan_lst_getter'
        ,'lib/number/number'
        ,'app/sale/displaying_scan/displaying_scan_util'
        ,'app/store_product/sp_updator'
        ,'app/product/product_json_helper'
        ,'lib/error_lib'
        ,'app/store_product/sp_offline_updator'
    ]
    ,function(
         async
        ,ds_modifier
        ,Instruction
        ,ds_lst_getter
        ,number
        ,ds_util
        ,sp_updator
        ,product_json_helper
        ,error_lib
        ,sp_offline_updator
    )
{
    var column_name = ["qty", "product", "price", "line total", "X"];
    var MM_LST = null;
    var COUCH_SERVER_URL = null;
    var STORE_ID = null;
    var STORE_IDB = null;
    var STORE_PDB = null;
    var SALE_TABLE = null;
    var TOTAL_BUTTON = null;
    
    function exe_instruction(ds_index,instruction,ds_lst){
        var ds_modifier_b = ds_modifier.bind(ds_modifier,MM_LST,STORE_IDB,ds_index,instruction);
        var ds_lst_getter_b = ds_lst_getter.bind(ds_lst_getter,MM_LST,STORE_IDB);
        async.waterfall([ds_modifier_b,ds_lst_getter_b],function(error,result){
            if(error){
                error_lib.alert_error(error);
            }else{
                var new_ds_lst = result;
                ds_2_ui(new_ds_lst);
            }
        });
    }

    function _item_2_table(ds_index,ds_lst){
        var displaying_scan = ds_lst[ds_index];
        var tr = SALE_TABLE.insertRow(-1);
        var td;
        
        // ["qty", "product", "price", "line total", "X"]

        //-QTY
        td = tr.insertCell(-1);
        td.innerHTML = displaying_scan.qty;
        td.addEventListener("click", function() {
            var new_qty = number.prompt_integer('enter qty',displaying_scan.qty,'wrong input');
            if(new_qty == null){
                return;
            }
            var instruction = new Instruction(new_qty==0/*is_delete*/,new_qty,displaying_scan.price,displaying_scan.discount);
            exe_instruction(ds_index,instruction,ds_lst);
        });

        //-PRODUCT
        td = tr.insertCell(-1);
        td.innerHTML = displaying_scan.get_name();
        td.addEventListener("click", function() {
            if(displaying_scan.store_product==null){
                return;
            }
            var product_id = displaying_scan.store_product.product_id;
            if(product_id == null){
                if(!confirm('this product is created offline. Modification to this product will be saved offline until sale data is push. Continue?')){
                    return;
                }

                var sp_offline_updator_b = sp_offline_updator.bind(sp_offline_updator,displaying_scan.store_product,STORE_PDB);
                async.waterfall([sp_offline_updator_b],function(error,result){
                    if(error){
                        error_lib.alert_error(error);
                        return;
                    }else{
                        //hackish way to refresh the interface by pretending the price is change
                        var sp = result;
                        var hackish_new_price = sp.price;
                        var instruction = new Instruction(false/*is_delete*/,displaying_scan.qty,hackish_new_price,displaying_scan.discount);
                        exe_instruction(ds_index,instruction,ds_lst);                        
                    }
                });
            }else{
                var sp_updator_b = sp_updator.exe.bind(sp_updator.exe,product_id,STORE_ID,COUCH_SERVER_URL);
                async.waterfall([sp_updator_b],function(error,result){
                    if(error){
                        error_lib.alert_error(error);
                        return;
                    }else{
                        //hackish way to refresh the interface by pretending the price is change
                        var sp_updator_return_product = product_json_helper.get_sp_from_p(result,STORE_ID);
                        var hackish_new_price = sp_updator_return_product.price;
                        var instruction = new Instruction(false/*is_delete*/,displaying_scan.qty,hackish_new_price,displaying_scan.discount);
                        exe_instruction(ds_index,instruction,ds_lst);
                    }
                });                
            }
        });

        //-PRICE
        td = tr.insertCell(-1);
        td.innerHTML = displaying_scan.get_total_discount_price();
        td.addEventListener("click", function() {
            var msg = ""
            msg += 'price info:' + '\n';
            msg += '---------' + '\n';
            msg += 'regular price: ' + displaying_scan.price + '\n'
            
            //MIX MATCH DEAL
            if(displaying_scan.mix_match_deal){
                msg += 'Mix match discount' + '(' + displaying_scan.mix_match_deal.name + ')' + ':' + displaying_scan.mix_match_deal.unit_discount + '\n';
            }

            //CRV
            var crv = displaying_scan.get_crv();
            if(crv){
                msg += 'crv: ' + crv + '\n';
            }

            //BUYDOWN
            var buydown = displaying_scan.get_buydown();
            if(buydown){
                msg += 'buydown discount: ' + buydown + '\n';
            }

            //BUYDOWN TAX
            var buydown_tax = displaying_scan.get_buydown_tax(TAX_RATE);
            if(buydown_tax){
                msg += 'buydown tax: ' + buydown_tax + '\n';
            }

            //TAX
            var tax = displaying_scan.get_tax(TAX_RATE);
            msg += 'tax: ' + tax + '\n'
            

            msg += 'out the door price: ' + displaying_scan.get_otd_wt_price(TAX_RATE);
            msg += '\n\n\n';    
            msg += 'enter new ONE TIME regular price\n';
            msg += '-------------------';
            var new_price = number.prompt_positive_double(msg,displaying_scan.price,'wrong input');
            if(new_price == null){
                return;
            }
            var instruction = new Instruction(false/*is_delete*/,displaying_scan.qty,new_price,displaying_scan.discount);
            exe_instruction(ds_index,instruction,ds_lst);
        });

        //-LINE TOTAL
        td = tr.insertCell(-1);
        td.innerHTML = displaying_scan.get_line_total(TAX_RATE);

        //-REMOVE
        td = tr.insertCell(-1);
        td.innerHTML = 'x'
        td.addEventListener("click", function() {
            var instruction = new Instruction(true/*delete*/,null/*new_qty*/,null/*new_price*/,null/*new_discount*/);
            exe_instruction(ds_index,instruction,ds_lst);
        });
    }

    function ds_2_ui(ds_lst){

        SALE_TABLE.innerHTML = '';

        var tr = SALE_TABLE.insertRow(); var td;

        //table column
        for( var i = 0;i<column_name.length;i++){
            td = tr.insertCell(-1);
            td.innerHTML = column_name[i];
        }

        //table data
        for (var i = 0;i<ds_lst.length;i++){
            _item_2_table(i,ds_lst);
        }

        //total button
        var computed_total = ds_util.get_line_total(ds_lst,TAX_RATE);
        TOTAL_BUTTON.innerHTML = computed_total;
    }

    return function(mm_lst,store_idb,store_pdb,store_id,couch_server_url,tax_rate,table,total_button,callback){
        MM_LST = mm_lst;
        COUCH_SERVER_URL = couch_server_url;
        TAX_RATE = tax_rate;
        STORE_ID = store_id
        STORE_IDB = store_idb;
        STORE_PDB = store_pdb;
        SALE_TABLE = table;
        TOTAL_BUTTON = total_button;

        var ds_lst_getter_b = ds_lst_getter.bind(ds_lst_getter,MM_LST,STORE_IDB);
        async.waterfall([ds_lst_getter_b],function(error,result){
            var ds_lst = result;
            ds_2_ui(ds_lst);

            var result = {sale_table:SALE_TABLE,total_button:TOTAL_BUTTON}
            callback(error,result);
        });
    }
});

