define(
    [
         'lib/async'
        ,'app/sale/scan/scanner'
        ,'app/sale/displaying_scan/displaying_scan_2_ui'
        ,'app/sale/sale_finalizer/sale_finalizer'
        ,'lib/number/number'
        ,'lib/db/pouch_db_util'
        ,'app/sale/displaying_scan/displaying_scan_util'
        ,'constance'
        ,'app/sale/voider/voider'
        ,'lib/misc/csrf_ajax_protection_setup'
        ,'app/receipt/receipt_pusher'
        ,'app/local_db_initializer/oneshot_sync'
        ,'app/local_db_initializer/customize_db'
        ,'app/sale_shortcut/sale_shortcut_util'
        ,'app/store_product/store_product_getter'
        ,'app/sale/pending_scan/Pending_scan'
        ,'app/sale/pending_scan/pending_scan_inserter'
        ,'app/sale/scan/sku_scan_not_found_handler'
        ,'lib/error_lib'
        ,'app/sale/non_inventory/non_inventory_prompt'
        ,'app/store_product/sp_online_name_search_ui'
        ,'app/sale/scan/pid_scanner'
        ,'app/sale/displaying_scan/displaying_scan_lst_getter'
        ,'lib/ui/ui'
        //-----------------
        ,'jquery'
        ,'jquery_block_ui'
        ,'jquery_ui'
        ,'lib/jquery/jquery.hotkeys'

    ],
    function
    (
         async
        ,scanner
        ,ds_2_ui
        ,sale_finalizer
        ,number
        ,pouch_db_util
        ,ds_util
        ,constance
        ,voider
        ,csrf_ajax_protection_setup
        ,receipt_pusher
        ,oneshot_sync
        ,customize_db
        ,sale_shortcut_util
        ,sp_getter
        ,Pending_scan
        ,ps_inserter
        ,ssnf_handler
        ,error_lib
        ,non_inventory_prompt
        ,sp_online_name_search_ui
        ,pid_scanner
        ,ds_lst_getter
        ,ui
    )
    {
        //UI
        var table = document.getElementById("sale_table");
        var total_button = document.getElementById("total_button");
        var void_btn = document.getElementById("void_btn");
        var push_receipt_btn = document.getElementById("push_receipt_btn");
        var non_inventory_btn = document.getElementById("non_inventory_btn");
        var scan_textbox = document.getElementById('scan_text');
        var product_search_btn = document.getElementById("product_search_btn");

        //CREATE PRODUCT FORM
        var product_name_txt = document.getElementById("product_name_txt");
        var product_price_txt = document.getElementById("product_price_txt");
        var product_taxable_check = document.getElementById("product_taxable_check");
        var product_crv_txt = document.getElementById("product_crv_txt");
        var product_sku_txt = document.getElementById("product_sku_txt");

        //DB
        var STORE_PDB;
        var STORE_IDB;

        //shortcut
        var TAX_RATE = MY_TAX_RATE;
        var SHORTCUT_LST = MY_SHORTCUT_LST;
        var MM_LST = MY_MM_LST;
        var CUR_SELECT_PARENT_SHORTCUT = 0;
        var shortcut_tbl = document.getElementById("shortcut_tbl");

        function hook_product_search_btn_2_ui(){
            product_search_btn.addEventListener("click", function(){
                var sp_online_name_search_ui_b = sp_online_name_search_ui.exe.bind(sp_online_name_search_ui.exe);
                async.waterfall([sp_online_name_search_ui_b],function(error,result){
                    if(error){
                        error_lib.alert_error(error);
                        return;
                    }
                    var product_json = result;
                    var pid_scanner_b = pid_scanner.exe.bind(pid_scanner.exe,product_json.product_id,STORE_IDB);
                    var ds_2_ui_b = ds_2_ui.bind(ds_2_ui,MM_LST,STORE_IDB,STORE_PDB,STORE_ID,COUCH_SERVER_URL,TAX_RATE,table,total_button);
                    async.waterfall([pid_scanner_b,ds_2_ui_b],function(error,result){
                        if(error){
                            error_lib.alert_error(error);
                            return;
                        }                        
                    });                    
                })
            });
        }

        function hook_non_inventory_btn_2_ui(){
            function non_inventory_handler(){
                async.waterfall([non_inventory_prompt.exe],function(error,result){
                    if(error){
                        error_lib.alert_error(error);
                        return;
                    }

                    var amount = result.price;
                    var inserting_ps = new Pending_scan(null/*key*/,1/*qty*/,amount,null/*discount*/,null/*sp_doc_id*/,result.description/*non_product_name*/);
                    var ps_inserter_b = ps_inserter.bind(ps_inserter,STORE_IDB,inserting_ps);
                    var ds_2_ui_b = ds_2_ui.bind(ds_2_ui,MM_LST,STORE_IDB,STORE_PDB,STORE_ID,COUCH_SERVER_URL,TAX_RATE,table,total_button);

                    async.waterfall([ps_inserter_b,ds_2_ui_b],function(error,result){
                        if(error){
                            error_lib.alert_error(error);
                            return;
                        }
                    });                    
                })
            }
            $(document).bind('keydown', 'ctrl+n', non_inventory_handler);
            $('#scan_text').bind('keydown', 'ctrl+n', non_inventory_handler);
            non_inventory_btn.addEventListener("click", non_inventory_handler);
        }

        function hook_receipt_pusher_2_ui(){
            push_receipt_btn.addEventListener("click", function(){
                var receipt_pusher_b = receipt_pusher.exe.bind(receipt_pusher.exe,STORE_IDB,STORE_PDB,STORE_ID,COUCH_SERVER_URL);
                                                                                
                $.blockUI({ message: 'saving sale data ...' });
                async.waterfall([receipt_pusher_b],function(error,result){
                    if(error){
                        if(error == receipt_pusher.ERROR_NO_SALE_DATA_TO_PUSH){
                            alert(receipt_pusher.ERROR_NO_SALE_DATA_TO_PUSH)
                        }else{
                            error_lib.alert_error(error);
                        }   
                        
                    }else{
                        var receipt_saved_count = result;
                        alert(receipt_saved_count + ' receipt(s) are saved.');
                    }
                    $.unblockUI();
                });
            });
        }

        function hook_sale_finalizer_2_ui(){
            function total_button_click_handler(){
                var ds_lst_getter_b = ds_lst_getter.bind(ds_lst_getter,MM_LST,STORE_IDB);
                async.waterfall([ds_lst_getter_b],function(error,result){
                    var ds_lst = result;

                    if(ds_lst.length != 0){
                        var line_total = ds_util.get_line_total(ds_lst,TAX_RATE);
                        var collect_amount = number.prompt_positive_double("amount: "/*message*/,line_total/*prefill*/,'wrong input'/*error_message*/)

                        if(collect_amount!=null){
                            if(collect_amount < line_total){
                                alert('collecting amount should be at least:' + line_total);
                                return;
                            }else{
                                var msg = "Did you give the customer change: " + (number.trim(collect_amount - line_total));
                                ui.ui_confirm(
                                     msg
                                    ,function(){
                                        var sale_finalizer_b = sale_finalizer.bind(sale_finalizer,MM_LST,STORE_PDB,STORE_IDB,collect_amount,TAX_RATE);
                                        async.waterfall([sale_finalizer_b],function(error,result){
                                            if(error){
                                                alert(error);
                                            }else{
                                                //refresh table
                                                var ds_2_ui_b = ds_2_ui.bind(ds_2_ui,MM_LST,STORE_IDB,STORE_PDB,STORE_ID,COUCH_SERVER_URL,TAX_RATE,table,total_button);
                                                async.waterfall([ds_2_ui_b],function(error,result){
                                                    if(error){
                                                        alert(error);
                                                    }
                                                });                                    
                                            }
                                        });                                         
                                    }
                                    ,function(){

                                    }
                                );
                            }
                        }
                    }
                });
            }
            total_button.addEventListener("click", total_button_click_handler);
        }

        function hook_scanner_to_ui(){
            var ENTER_KEY = 13;
            
            function scan_text_enter_handler( event ) {
                if (event.keyCode !== ENTER_KEY) {
                    return;      
                }

                scan_textbox.select();
                var scan_str = scan_textbox.value.trim();
                if(scan_str.length == 0){
                    return;
                }

                var scanner_b = scanner.exe.bind(scanner.exe,scan_str,STORE_IDB);
                var ds_2_ui_b = ds_2_ui.bind(ds_2_ui,MM_LST,STORE_IDB,STORE_PDB,STORE_ID,COUCH_SERVER_URL,TAX_RATE,table,total_button);

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

        function shortcut_child_press_handler(child_position){
            var cur_parent = sale_shortcut_util.get_parent(CUR_SELECT_PARENT_SHORTCUT,SHORTCUT_LST);
            if(cur_parent!=null){
                child = sale_shortcut_util.get_child(cur_parent,child_position);
                if(child!=null){

                    var pid_scanner_b = pid_scanner.exe.bind(pid_scanner.exe,child.product_id,STORE_IDB);
                    var ds_2_ui_b = ds_2_ui.bind(ds_2_ui,MM_LST,STORE_IDB,STORE_PDB,STORE_ID,COUCH_SERVER_URL,TAX_RATE,table,total_button);
                    async.waterfall([pid_scanner_b,ds_2_ui_b],function(error,result){
                        if(error){
                            error_lib.alert_error(error);
                            return;
                        }                        
                    });  
                }
            }
        }

        function refresh_shortcut_parent_button(tr,parent_position){
            var parent = sale_shortcut_util.get_parent(parent_position,SHORTCUT_LST);
            var class_name = parent_position == CUR_SELECT_PARENT_SHORTCUT ? 'parent_selected' : 'parent_unselected'
            
            //MAIN
            td = tr.insertCell(-1);
            td.innerHTML = (parent == null ? null : parent.caption);   
            td.addEventListener("click", function() {
                CUR_SELECT_PARENT_SHORTCUT = parent_position;
                display_shortcut_table();
            });
            td.className = class_name;
        }

        function refresh_shortcut_children(tr,row){
            var cur_parent = sale_shortcut_util.get_parent(CUR_SELECT_PARENT_SHORTCUT,SHORTCUT_LST);
            
            for(var cur_column = 0;cur_column<COLUMN_COUNT;cur_column++){
                td = tr.insertCell(-1);
                
                var child_position = COLUMN_COUNT*row+cur_column
                if(cur_parent!=null){
                    var child = sale_shortcut_util.get_child(cur_parent,child_position);
                    if(child != null){
                        td.innerHTML = child.caption;
                    }
                }
                
                var handler_b = shortcut_child_press_handler.bind(shortcut_child_press_handler,child_position);
                td.addEventListener("click", handler_b);            
            }
        }

        function display_shortcut_table(){
            shortcut_tbl.innerHTML = "";

            for(var cur_row = 0;cur_row<ROW_COUNT;cur_row++){

                var tr = shortcut_tbl.insertRow(-1);

                refresh_shortcut_parent_button(tr,cur_row);
                refresh_shortcut_children(tr,cur_row);
                refresh_shortcut_parent_button(tr,cur_row + ROW_COUNT);
            }
        }

        function hook_voider_2_ui(){
            function void_btn_click_handler(){

                var ds_lst_getter_b = ds_lst_getter.bind(ds_lst_getter,MM_LST,STORE_IDB);
                async.waterfall([ds_lst_getter_b],function(error,result){
                    var ds_lst = result;

                    if(ds_lst.length == 0){
                        return;
                    }else{
                        ui.ui_confirm(
                            'remove all scan?'
                            ,function(){
                                var voider_b = voider.bind(voider,STORE_IDB);
                                var ds_2_ui_b = ds_2_ui.bind(ds_2_ui,MM_LST,STORE_IDB,STORE_PDB,STORE_ID,COUCH_SERVER_URL,TAX_RATE,table,total_button);

                                async.waterfall([voider_b,ds_2_ui_b],function(error,result){
                                    if(error){alert(error);}
                                });                                  
                            }
                            ,function(){
                                //do nothing
                            }
                        )
                    }
                });
            }
            void_btn.addEventListener("click", void_btn_click_handler);            
        }
        $("#block_message_label").html('please wait for setup ...');
        $.blockUI({ message: $('#block_message_label') });
        
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
            hook_voider_2_ui();
            hook_receipt_pusher_2_ui();
            display_shortcut_table();
            hook_non_inventory_btn_2_ui();
            hook_product_search_btn_2_ui()

            //refresh ui
            var ds_2_ui_b = ds_2_ui.bind(ds_2_ui,MM_LST,STORE_IDB,STORE_PDB,STORE_ID,COUCH_SERVER_URL,TAX_RATE,table,total_button);
            async.waterfall([ds_2_ui_b],function(error,result){
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