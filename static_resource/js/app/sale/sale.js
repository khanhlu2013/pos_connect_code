requirejs.config({
     baseUrl: STATIC_URL + 'js'
    ,paths: {
         app : 'app'
        ,lib : 'lib'
        // ,pouch_db : 'lib/db/pouchdb'
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
        ,'app/local_db_initializer/set_sync_status'
        ,'app/local_db_initializer/oneshot_sync'
        ,'app/local_db_initializer/customize_db'
        ,'app/store_product/store_product_creator'
        ,'app/sale_shortcut/parent_lst_getter'
        ,'app/sale_shortcut/sale_shortcut_util'
        ,'app/store_product/store_product_getter'
        ,'app/sale/pending_scan/Pending_scan'
        ,'app/sale/pending_scan/pending_scan_inserter'
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
        ,set_sync_status
        ,oneshot_sync
        ,customize_db
        ,sp_creator
        ,parent_lst_getter
        ,sale_shortcut_util
        ,sp_getter
        ,Pending_scan
        ,ps_inserter
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

        function listen_to_document_change_and_update_ui(store_idb,store_pdb){
            store_pdb.changes({
                 continuous: true
                ,include_docs: true
                // ,since: 20
                ,onChange: function(change) { 
                    if(change.doc.d_type != null && change.doc.d_type == constance.STORE_PRODUCT_TYPE){
                        var ds_2_ui_b = ds_2_ui.bind(ds_2_ui,store_idb,table);
                        async.waterfall([ds_2_ui_b],function(error,result){
                            if(error){
                                alert(error);
                                return;
                            }
                        });                        
                    }
                }
            });
        }

        function hook_receipt_pusher_2_ui(store_idb,store_pdb){
            function exe(){
                var receipt_pusher_nb = receipt_pusher.push_receipt;
                var receipt_pusher_b = receipt_pusher_nb.bind(receipt_pusher_nb,store_idb,store_pdb,STORE_DB_NAME,COUCH_SERVER_URL);
                                                                                
                var ask_server_to_process_sale_data = receipt_pusher.ask_server_to_process_sale_data;
                var ask_server_to_process_sale_data_b = ask_server_to_process_sale_data.bind(ask_server_to_process_sale_data,STORE_DB_NAME)

                $.blockUI({ message: 'saving sale data ...' });
                async.waterfall([receipt_pusher_b,ask_server_to_process_sale_data_b],function(error,result){
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

        function hook_alone_discounter_2_ui(store_idb){

            function discount_button_function_handler(store_idb){
                var discount_input_str = prompt('enter discount amount or discount %. e.g. 5 or 5%',null/*prefill*/);
                if(discount_input_str == null){
                    return;
                }

                var ds_2_ui_b = ds_2_ui.bind(ds_2_ui,store_idb,table);
                var alone_discounter_b = alone_discounter.bind(alone_discounter,store_idb,discount_input_str);
                async.waterfall([alone_discounter_b,ds_2_ui_b],function(error,result){
                    if(error){alert(error);}
                });
            }

            var discount_button_function_handler_b = discount_button_function_handler.bind(discount_button_function_handler,store_idb);
            discount_button.addEventListener("click", discount_button_function_handler_b);
        }

        function hook_sale_finalizer_2_ui(store_idb,store_pdb){
            function total_button_click_handler(store_idb){
                var ds_lst_and_tax_getter_b = ds_lst_and_tax_getter.bind(ds_lst_and_tax_getter,store_idb)
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
                                var sale_finalizer_b = sale_finalizer.bind(sale_finalizer,store_pdb,store_idb,collected_amount);
                                async.waterfall([sale_finalizer_b],function(error,result){
                                    if(error){
                                        alert(error);
                                    }else{
                                        //refresh table
                                        var ds_2_ui_b = ds_2_ui.bind(ds_2_ui,store_idb,table);
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
            var total_button_click_handler_b = total_button_click_handler.bind(total_button_click_handler,store_idb);
            total_button.addEventListener("click", total_button_click_handler_b);
        }

        function hook_scanner_to_ui(store_idb,store_pdb){
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

                var scanner_b = scanner.exe.bind(scanner.exe,scan_str,store_idb);
                var ds_2_ui_b = ds_2_ui.bind(ds_2_ui,store_idb,table);

                async.waterfall([scanner_b,ds_2_ui_b],function(error,result){
                    if(error){
                        if(error == scanner.ERROR_STORE_PRODUCT_NOT_FOUND){
                            // 111 to be implement: issue online search, create product product online, sync down, continue the scan 
                            sku_str = scanner.get_sku_from_scan_str(scan_str);
                            
                            // i need a popup, to display all result with option sort these product and user will select a product, or create new online


                        }
                        else if(error == scanner.ERROR_CANCEL_SHARE_SKU_BREAKER){
                            //do nothing
                        }else{
                            alert(error);
                        }
                    }
                });
            }
            scan_textbox.addEventListener('keypress', scan_text_enter_handler, false);
        }

        function hook_voider_2_ui(store_idb){
            function void_btn_click_handler(store_idb){

                var ds_lst_and_tax_getter_b = ds_lst_and_tax_getter.bind(ds_lst_and_tax_getter,store_idb)
                async.waterfall([ds_lst_and_tax_getter_b],function(error,result){
                    var ds_lst = result[0];
                    var tax_rate = result[1];

                    if(ds_lst.length == 0){
                        return;
                    }else{
                        if(!confirm("clear all scan?")){
                            return;
                        }
                        
                        var voider_b = voider.bind(voider,store_idb);
                        var ds_2_ui_b = ds_2_ui.bind(ds_2_ui,store_idb,table);

                        async.waterfall([voider_b,ds_2_ui_b],function(error,result){
                            if(error){alert(error);}
                        });                        
                    }
                });
            }

            var void_btn_click_handler_b = void_btn_click_handler.bind(void_btn_click_handler,store_idb);
            void_btn.addEventListener("click", void_btn_click_handler_b);            
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
                        var ds_2_ui_b = ds_2_ui.bind(ds_2_ui,store_idb,table);
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

        var oneshot_sync_b = oneshot_sync.bind(oneshot_sync,STORE_DB_NAME,COUCH_SERVER_URL);
        var customize_db_b =  customize_db.bind(customize_db,STORE_DB_NAME);
        async.waterfall([oneshot_sync_b,customize_db_b],function(error,result){
            if(error){
                $.unblockUI();
                alert("There is error initializing db: " + error);
                set_sync_status(false);
                return;
            }

            var store_idb = result;
            var store_pdb = pouch_db_util.get_db(STORE_DB_NAME);

            set_sync_status(true);
            listen_to_document_change_and_update_ui(store_idb,store_pdb);

            //init ui functionality
            hook_scanner_to_ui(store_idb,store_pdb);
            hook_sale_finalizer_2_ui(store_idb,store_pdb);
            hook_alone_discounter_2_ui(store_idb);
            hook_voider_2_ui(store_idb);
            hook_receipt_pusher_2_ui(store_idb,store_pdb);
            
            //refresh ui
            var ds_2_ui_b = ds_2_ui.bind(ds_2_ui,store_idb,table);
            var init_shortcut_table_b = init_shortcut_table.bind(init_shortcut_table,store_idb);
            async.waterfall([init_shortcut_table_b,ds_2_ui_b],function(error,result){
                if(error){
                    $.unblockUI();
                    alert("There is error displaying scan: " + error);
                    set_sync_status(false);
                    return;
                } 
                $.unblockUI();
                set_sync_status(true);
            });
        });
    }
);