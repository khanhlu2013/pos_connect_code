requirejs.config({
     baseUrl: STATIC_URL + 'js'
    ,paths: {
         app : 'app'
        ,lib : 'lib'
        ,pouch_db : 'lib/db/pouchdb-2.0.1'
        ,jquery : 'lib/jquery/jquery-1_10_2'
        ,jquery_block_ui : 'lib/jquery/jquery_blockUI'
        ,jquery_ui : 'lib/jquery/jquery-ui'
    }
    ,shim: {
         'pouch_db': {
            exports: 'Pouch_db'
        }
        ,'jquery_block_ui': ['jquery']
        ,'jquery_ui' : ['jquery']
    }
});

require(
    [
         'lib/async'
        ,'app/sale/scan/scanner'
        ,'app/sale/displaying_scan/displaying_scan_2_ui'
        ,'app/sale/sale_finalizer/sale_finalizer'
        ,'lib/number/number'
        ,'app/sale/displaying_scan/displaying_scan_lst_and_tax_getter'
        ,'app/sale/discounter/alone_discounter'
        ,'lib/db/pouch_db_util'
        ,'app/sale/displaying_scan/displaying_scan_util'
        ,'constance'
        ,'app/sale/voider/voider'
        ,'lib/misc/csrf_ajax_protection_setup'
        ,'app/sale/receipt_pusher/receipt_pusher'
        ,'app/local_db_initializer/oneshot_sync'
        ,'app/local_db_initializer/customize_db'
        ,'app/sale_shortcut/parent_lst_getter'
        ,'app/sale_shortcut/sale_shortcut_util'
        ,'app/store_product/store_product_getter'
        ,'app/sale/pending_scan/Pending_scan'
        ,'app/sale/pending_scan/pending_scan_inserter'
        ,'app/sale/scan/sku_scan_not_found_handler'
        ,'lib/error_lib'

        //-----------------
        ,'jquery_block_ui'
        ,'jquery_ui'
    ],
    function
    (
         async
        ,scanner
        ,ds_2_ui
        ,sale_finalizer
        ,number
        ,ds_lst_and_tax_getter
        ,alone_discounter
        ,pouch_db_util
        ,ds_util
        ,constance
        ,voider
        ,csrf_ajax_protection_setup
        ,receipt_pusher
        ,oneshot_sync
        ,customize_db
        ,parent_lst_getter
        ,sale_shortcut_util
        ,sp_getter
        ,Pending_scan
        ,ps_inserter
        ,ssnf_handler
        ,error_lib
    )
    {
        //UI
        var table = document.getElementById("sale_table");
        var shortcut_table = document.getElementById("shortcut_tbl");
        var total_button = document.getElementById("total_button");
        var discount_button = document.getElementById("discount_button");
        var void_btn = document.getElementById("void_btn");
        var push_receipt_btn = document.getElementById("push_receipt_btn");

        //CREATE PRODUCT FORM
        var product_name_txt = document.getElementById("product_name_txt");
        var product_price_txt = document.getElementById("product_price_txt");
        var product_taxable_check = document.getElementById("product_taxable_check");
        var product_crv_txt = document.getElementById("product_crv_txt");
        var product_sku_txt = document.getElementById("product_sku_txt");

        //DB
        var STORE_PDB;
        var STORE_IDB;

        function hook_receipt_pusher_2_ui(){
            function exe(){
                var receipt_pusher_b = receipt_pusher.bind(receipt_pusher,STORE_IDB,STORE_PDB,STORE_ID,COUCH_SERVER_URL);
                                                                                
                $.blockUI({ message: 'saving sale data ...' });
                async.waterfall([receipt_pusher_b],function(error,result){
                    if(error){
                        alert(error);
                    }else{
                        alert(result);
                    }
                    $.unblockUI();
                });
            }
            push_receipt_btn.addEventListener("click", exe);
        }

        function hook_alone_discounter_2_ui(){

            function discount_button_function_handler(){
                var discount_input_str = prompt('enter discount amount or discount %. e.g. 5 or 5%',null/*prefill*/);
                if(discount_input_str == null){
                    return;
                }

                var ds_2_ui_b = ds_2_ui.bind(ds_2_ui,STORE_IDB,STORE_PDB,table,STORE_ID,COUCH_SERVER_URL);
                var alone_discounter_b = alone_discounter.bind(alone_discounter,STORE_IDB,discount_input_str);
                async.waterfall([alone_discounter_b,ds_2_ui_b],function(error,result){
                    if(error){alert(error);}
                });
            }
            discount_button.addEventListener("click", discount_button_function_handler);
        }

        function hook_sale_finalizer_2_ui(){
            function total_button_click_handler(){
                var ds_lst_and_tax_getter_b = ds_lst_and_tax_getter.bind(ds_lst_and_tax_getter,STORE_IDB)
                async.waterfall([ds_lst_and_tax_getter_b],function(error,result){
                    var ds_lst = result[0];
                    var tax_rate = result[1];

                    if(ds_lst.length != 0){
                        var line_total = ds_util.get_line_total(ds_lst,tax_rate);
                        var collected_amount = number.prompt_positive_double("amount: "/*message*/,line_total/*prefill*/,'wrong input'/*error_message*/)

                        if(collected_amount!=null){
                            if(collected_amount < line_total){
                                alert('collecting amount should be at least:' + line_total);
                                return;
                            }else if(confirm("Did you give the customer change: " + (number.trim(collected_amount - line_total)))) {
                                var sale_finalizer_b = sale_finalizer.bind(sale_finalizer,STORE_PDB,STORE_IDB,collected_amount);
                                async.waterfall([sale_finalizer_b],function(error,result){
                                    if(error){
                                        alert(error);
                                    }else{
                                        //refresh table
                                        var ds_2_ui_b = ds_2_ui.bind(ds_2_ui,STORE_IDB,STORE_PDB,table,STORE_ID,COUCH_SERVER_URL);
                                        async.waterfall([ds_2_ui_b],function(error,result){
                                            if(error){
                                                alert(error);
                                            }
                                        });                                    
                                    }
                                });   
                            }
                        }
                    }
                });
            }
            total_button.addEventListener("click", total_button_click_handler);
        }

        function hook_scanner_to_ui(){
            var ENTER_KEY = 13;
            var scan_textbox = document.getElementById('scan_text');
            function scan_text_enter_handler( event ) {
                if (event.keyCode !== ENTER_KEY) {
                    return;      
                }
                var scan_str = scan_textbox.value.trim();
                if(scan_str.length == 0){
                    return;
                }

                var scanner_b = scanner.exe.bind(scanner.exe,scan_str,STORE_IDB);
                var ds_2_ui_b = ds_2_ui.bind(ds_2_ui,STORE_IDB,STORE_PDB,table,STORE_ID,COUCH_SERVER_URL);

                async.waterfall([scanner_b,ds_2_ui_b],function(error,result){
                    if(error){
                        if(error == scanner.ERROR_STORE_PRODUCT_NOT_FOUND){
                            sku_str = scanner.get_sku_from_scan_str(scan_str);

                            var ssnf = ssnf_handler.exe.bind(ssnf_handler.exe,sku_str,STORE_ID,COUCH_SERVER_URL,STORE_PDB);
                            async.waterfall([ssnf,scanner_b,ds_2_ui_b],function(error,result){
                                if(error){
                                    error_lib.alert_error(error);                                   
                                }
                            });
                        }else{
                            error_lib.alert_error(error);
                        }
                    }
                });
            }
            scan_textbox.addEventListener('keypress', scan_text_enter_handler, false);
        }

        function hook_voider_2_ui(){
            function void_btn_click_handler(){

                var ds_lst_and_tax_getter_b = ds_lst_and_tax_getter.bind(ds_lst_and_tax_getter,STORE_IDB)
                async.waterfall([ds_lst_and_tax_getter_b],function(error,result){
                    var ds_lst = result[0];
                    var tax_rate = result[1];

                    if(ds_lst.length == 0){
                        return;
                    }else{
                        if(!confirm("clear all scan?")){
                            return;
                        }
                        
                        var voider_b = voider.bind(voider,STORE_IDB);
                        var ds_2_ui_b = ds_2_ui.bind(ds_2_ui,STORE_IDB,STORE_PDB,table,STORE_ID,COUCH_SERVER_URL);

                        async.waterfall([voider_b,ds_2_ui_b],function(error,result){
                            if(error){alert(error);}
                        });                        
                    }
                });
            }
            void_btn.addEventListener("click", void_btn_click_handler);            
        }

        var shortcut_lst;
        var cur_selected_parent_index = 0;

        function shortcut_press(child_position,store_idb){
            var cur_parent = sale_shortcut_util.get_parent(cur_selected_parent_index,shortcut_lst);
            if(cur_parent!=null){
                child = sale_shortcut_util.get_child(cur_parent,child_position);
                if(child!=null){

                    var sp_getter_b = sp_getter.by_product_id.bind(sp_getter.by_product_id,child.product_id,store_idb)
                    async.waterfall([sp_getter_b],function(error,result){
                        if(error){
                            alert(error);
                            return;
                        }
                        var sp = result;
                        var ps = new Pending_scan(null/*key*/,1/*qty*/,sp.price,null/*discount*/,sp._id,null/*non_product_name*/);
                        var ps_inserter_b = ps_inserter.bind(ps_inserter,store_idb,ps)
                        var ds_2_ui_b = ds_2_ui.bind(ds_2_ui,store_idb,STORE_PDB,table,STORE_ID,COUCH_SERVER_URL);
                        async.waterfall([ps_inserter_b,ds_2_ui_b],function(error,result){
                            if(error){alert(error);}
                        });
                    }); 
                }
            }
        }


        function refresh_row(cur_row,store_idb){
            var tr = shortcut_table.insertRow(-1);
            var td;
            

            //LEFT PARENT
            var left_parent_position = cur_row;
            var left_parent = sale_shortcut_util.get_parent(left_parent_position,shortcut_lst);
            td = tr.insertCell(-1);
            td.innerHTML = (left_parent == null ? null : left_parent.caption);   
            td.addEventListener("click", function() {
                cur_selected_parent_index = left_parent_position
                refresh_shortcut_table(store_idb);
            });

            //MIDDLE CHILDREN
            for(var cur_column = 0;cur_column<COLUMN_COUNT;cur_column++){
                td = tr.insertCell(-1);
                
                var child = null;
                var child_position = COLUMN_COUNT*cur_row+cur_column;
                var cur_parent = sale_shortcut_util.get_parent(cur_selected_parent_index,shortcut_lst);
                if(cur_parent!=null){
                    child = sale_shortcut_util.get_child(cur_parent,child_position);
                }
                
                td.innerHTML = (child == null ? null : child.caption);
                var shortcut_press_b = shortcut_press.bind(shortcut_press,child_position,store_idb)
                td.addEventListener("click", shortcut_press_b);
            }


            //RIGHT PARENT
            var right_parent_position = cur_row + ROW_COUNT;
            var right_parent = sale_shortcut_util.get_parent(right_parent_position,shortcut_lst);
            td = tr.insertCell(-1);
            td.innerHTML = (right_parent == null ? null : right_parent.caption);    
            td.addEventListener("click", function() {
                cur_selected_parent_index = right_parent_position
                refresh_shortcut_table(store_idb);
            });
        }

        function refresh_shortcut_table(store_idb){
            while(shortcut_table.hasChildNodes())
            {
               shortcut_table.removeChild(shortcut_table.firstChild);
            }  

            for(var cur_row = 0;cur_row<ROW_COUNT;cur_row++){
                refresh_row(cur_row,store_idb); 
            }                
        }

        function init_shortcut_table(store_idb,callback){
            async.waterfall([parent_lst_getter],function(error,result){
                if(error){
                    callback(error);
                    return;
                }

                shortcut_lst = result;
                refresh_shortcut_table(store_idb);
                callback(null)
            })
        }

        
        $.blockUI({ message: 'please wait for setup ...' });
        
        $( "#store_product_prompt_dialog" ).dialog({ autoOpen: false,modal:true });
        csrf_ajax_protection_setup();

        var oneshot_sync_b = oneshot_sync.bind(oneshot_sync,STORE_ID,COUCH_SERVER_URL);
        var customize_db_b =  customize_db.bind(customize_db,STORE_ID);
        async.waterfall([oneshot_sync_b,customize_db_b],function(error,result){
            if(error){
                $.unblockUI();
                alert("There is error initializing db: " + error);
                return;
            }

            STORE_IDB = result;
            STORE_PDB = pouch_db_util.get_store_db(STORE_ID);


            //init ui functionality
            hook_scanner_to_ui();
            hook_sale_finalizer_2_ui();
            hook_alone_discounter_2_ui();
            hook_voider_2_ui();
            hook_receipt_pusher_2_ui();
            
            //refresh ui
            var ds_2_ui_b = ds_2_ui.bind(ds_2_ui,STORE_IDB,STORE_PDB,table,STORE_ID,COUCH_SERVER_URL);
            var init_shortcut_table_b = init_shortcut_table.bind(init_shortcut_table,STORE_IDB);
            async.waterfall([init_shortcut_table_b,ds_2_ui_b],function(error,result){
                if(error){
                    $.unblockUI();
                    alert("There is error displaying scan: " + error);
                    return;
                } 
                $.unblockUI();
            });
        });
    }
);