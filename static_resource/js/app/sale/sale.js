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
        ,'app/store_product/sp_search_ui'
        ,'app/sale/scan/pid_scanner'
        ,'app/sale/displaying_scan/displaying_scan_lst_getter'
        ,'lib/ui/ui'
        ,'app/tax/tax_manage_ui'
        ,'app/group/group_manage_ui'
        ,'app/sale_shortcut/sale_shortcut_manage_ui'
        ,'app/mix_match/mix_match_manage_ui'
        ,'app/sale_report/date_range_report_ui'
        ,'app/receipt/receipt_report_ui'        
        ,'app/sale/tender/tender_manage_ui'
        ,'app/payment_type/payment_type_manage_ui'
        ,'app/sale/hold/save_to_hold'
        ,'app/sale/hold/get_from_hold'
        ,'app/sale/scan/non_inventory_scanner'
        ,'app/sale/value_customer_price/toggle_value_customer_price'
        //-----------------
        ,'dropit'
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
        ,sp_search_ui
        ,pid_scanner
        ,ds_lst_getter
        ,ui
        ,tax_manage_ui
        ,group_manage_ui
        ,sale_shortcut_manage_ui
        ,mix_match_manage_ui
        ,date_range_report_ui
        ,receipt_report_ui   
        ,tender_manage_ui   
        ,payment_type_manage_ui  
        ,save_to_hold
        ,get_from_hold
        ,non_inventory_scanner
        ,toggle_value_customer_price
    )
    {
        //UI
        var table = document.getElementById("sale_table");
        var total_button = document.getElementById("total_button");
        var void_btn = document.getElementById("void_btn");
        var non_inventory_btn = document.getElementById("non_inventory_btn");
        var scan_textbox = document.getElementById('scan_text');
        var product_search_btn = document.getElementById("product_search_btn");
        var shortcut_tbl = document.getElementById("sale_shortcut_tbl");

        //DB
        var STORE_PDB;
        var STORE_IDB;

        //GLOBAL
        var CUR_SELECT_PARENT_SHORTCUT = 0;
        var TAX_RATE = parseFloat(localStorage.getItem('tax_rate'));
        var SHORTCUT_LST = MY_SHORTCUT_LST;
        var MM_LST = MY_MM_LST; 
        var PAYMENT_TYPE_LST = MY_PAYMENT_TYPE_LST;

        function hook_product_search_btn_2_ui(){
            product_search_btn.addEventListener("click", function(){
                var sp_search_ui_b = sp_search_ui.exe.bind(sp_search_ui.exe,false);
                async.waterfall([sp_search_ui_b],function(error,result){
                    if(error){
                        error_lib.alert_error(error);
                        return;
                    }
                    var product_json = result;
                    var pid_scanner_b = pid_scanner.exe.bind(pid_scanner.exe,product_json.product_id,1/*qty*/,STORE_IDB);
                    var ds_2_ui_b = ds_2_ui.exe.bind(ds_2_ui.exe,MM_LST,STORE_IDB,STORE_PDB,STORE_ID,COUCH_SERVER_URL,table,total_button);
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
                    var non_inventory_scanner_b = non_inventory_scanner.exe.bind(non_inventory_scanner.exe,result.price,result.description,STORE_IDB)
                    var ds_2_ui_b = ds_2_ui.exe.bind(ds_2_ui.exe,MM_LST,STORE_IDB,STORE_PDB,STORE_ID,COUCH_SERVER_URL,table,total_button);

                    async.waterfall([non_inventory_scanner_b,ds_2_ui_b],function(error,result){
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

        function hook_sale_finalizer_2_ui(){
            total_button.addEventListener("click", function(){

                var ds_lst_getter_b = ds_lst_getter.bind(ds_lst_getter,TAX_RATE,MM_LST,STORE_IDB);
                async.waterfall([ds_lst_getter_b],function(error,result){
                    var ds_lst = result;
                    if(ds_lst.length == 0){
                        return;
                    }

                    var due_amount = ds_util.get_line_total(ds_lst,TAX_RATE);
                    var tender_b = tender_manage_ui.exe.bind(tender_manage_ui.exe,PAYMENT_TYPE_LST,due_amount);
                    var sale_finalizer_b = sale_finalizer.bind(sale_finalizer,MM_LST,STORE_PDB,STORE_IDB,TAX_RATE);
                    async.waterfall([tender_b,sale_finalizer_b],function(error,result){
                        if(error){
                            error_lib.alert_error(error);
                            return;
                        }

                        refresh_sale_table();
                    })

                });
            });
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
                var ds_2_ui_b = ds_2_ui.exe.bind(ds_2_ui.exe,MM_LST,STORE_IDB,STORE_PDB,STORE_ID,COUCH_SERVER_URL,table,total_button);

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

                    var pid_scanner_b = pid_scanner.exe.bind(pid_scanner.exe,child.product_id,1/*qty*/,STORE_IDB);
                    var ds_2_ui_b = ds_2_ui.exe.bind(ds_2_ui.exe,MM_LST,STORE_IDB,STORE_PDB,STORE_ID,COUCH_SERVER_URL,table,total_button);
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
            var class_name = parent_position == CUR_SELECT_PARENT_SHORTCUT ? 'sale_shortcut_parent_selected' : 'sale_shortcut_parent_unselected'
            
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

                var ds_lst_getter_b = ds_lst_getter.bind(ds_lst_getter,TAX_RATE,MM_LST,STORE_IDB);
                async.waterfall([ds_lst_getter_b],function(error,result){
                    var ds_lst = result;

                    if(ds_lst.length == 0){
                        return;
                    }else{
                        ui.ui_confirm(
                            'remove all scan?'
                            ,function(){
                                var voider_b = voider.bind(voider,STORE_IDB,true/*reset is_use_value_customer_price*/);
                                var ds_2_ui_b = ds_2_ui.exe.bind(ds_2_ui.exe,MM_LST,STORE_IDB,STORE_PDB,STORE_ID,COUCH_SERVER_URL,table,total_button);

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
        
        function refresh_sale_table(){
            var ds_2_ui_b = ds_2_ui.exe.bind(ds_2_ui.exe,MM_LST,STORE_IDB,STORE_PDB,STORE_ID,COUCH_SERVER_URL,table,total_button);
            async.waterfall([ds_2_ui_b],function(error,result){
                if(error){
                    alert("There is error displaying scan: " + error);
                    return;
                } 
            });            
        }

        $('.menu').dropit();
        $('#tax_menu').click(function(e)
        { 
            async.waterfall([tax_manage_ui.exe],function(error,result){
                if(error){
                    error_lib.alert_error(error);
                    return;
                }
                refresh_sale_table();
            });
        });
        $('#group_menu').click(function(e)
        { 
            group_manage_ui.exe();
        });
        $('#sale_shortcut_menu').click(function(e)
        { 
            async.waterfall([sale_shortcut_manage_ui.exe],function(error,result){
                if(error){
                    error_lib.alert_error(error);
                    return;
                }

                SHORTCUT_LST = result;
                display_shortcut_table();     
            });
        });
        $('#mix_match_menu').click(function(e)
        { 
            async.waterfall([mix_match_manage_ui.exe],function(error,result){
                if(error){
                    error_lib.alert_error(error);
                    return;
                }

                MM_LST = result;
                refresh_sale_table();
            })             
        });    
        $('#sale_report_menu').click(function(e)
        { 
            date_range_report_ui.exe(STORE_ID,COUCH_SERVER_URL,true/*is_sale_report = true*/);
        });     
        $('#non_sale_report_menu').click(function(e)
        { 
            date_range_report_ui.exe(STORE_ID,COUCH_SERVER_URL,false/*is_sale_report = false*/);
        });             
        $('#receipt_report_menu').click(function(e)
        { 
            receipt_report_ui.exe(STORE_ID,COUCH_SERVER_URL);
        });   
        $('#payment_type_menu').click(function(e)
        { 
            async.waterfall([payment_type_manage_ui.exe],function(error,result){
                if(error){
                    error_lib.alert_error(error);
                    return;
                }

                PAYMENT_TYPE_LST = result;
            });
        });  

        function hold_handler(){
            var save_to_hold_b = save_to_hold.exe.bind(save_to_hold.exe,TAX_RATE,MM_LST,STORE_IDB);
            async.waterfall([save_to_hold_b],function(error,result){
                if(error){
                    if(error == save_to_hold.ERROR_nothing_to_hold){
                        ui.ui_alert('can not hold empty list');
                    }else{
                        error_lib.alert_error(error);
                    }
                    return;
                }

                refresh_sale_table();
            })            
        }
        $(document).bind('keydown', 'ctrl+h', hold_handler);
        $('#scan_text').bind('keydown', 'ctrl+h', hold_handler);         
        $('#save_to_hold_menu').click(function(e)
        { 
            hold_handler();
        }); 


        function get_hold_handler(){
            var get_from_hold_b = get_from_hold.exe.bind(get_from_hold.exe,TAX_RATE,MM_LST,STORE_IDB);
            async.waterfall([get_from_hold_b],function(error,result){
                if(error){
                    if(error == get_from_hold.ERROR_ds_lst_is_not_empty){
                        ui.ui_alert('to hold, current scan list must be empty');
                    }
                    else if(error == get_from_hold.ERROR_hold_lst_is_empty){
                        ui.ui_alert('there is nothing on hold');
                    }
                    else{
                        error_lib.alert_error(error);
                    }
                    return;
                }

                refresh_sale_table();
            })            
        }
        $(document).bind('keydown', 'ctrl+g', get_hold_handler);
        $('#scan_text').bind('keydown', 'ctrl+g', get_hold_handler);         
        $('#get_from_hold_menu').click(function(e)
        { 
            get_hold_handler()
        });
        $('#push_receipt_menu').click(function(e)
        { 
            var receipt_pusher_b = receipt_pusher.exe.bind(receipt_pusher.exe,STORE_IDB,STORE_PDB,STORE_ID,COUCH_SERVER_URL);
            async.waterfall([receipt_pusher_b],function(error,result){
                if(error){
                    if(error == receipt_pusher.ERROR_NO_SALE_DATA_TO_PUSH){
                        ui.ui_alert(receipt_pusher.ERROR_NO_SALE_DATA_TO_PUSH)
                    }else{
                        error_lib.alert_error(error);
                    }   
                    
                }else{
                    var receipt_saved_count = result;
                    ui.ui_alert(receipt_saved_count + ' receipt(s) are saved.')
                }
            });
        });       


        function toogle_value_customer_price_handler(){
            var toggle_value_customer_price_b = toggle_value_customer_price.exe.bind(toggle_value_customer_price.exe,TAX_RATE,MM_LST,STORE_IDB);
            async.waterfall([toggle_value_customer_price_b],function(error,result){
                if(error){
                    if(error = toggle_value_customer_price.ERROR_ds_lst_is_empty){
                        return;
                    }else{
                        error_lib.alert_error(error);
                    }
                    return;
                }

                refresh_sale_table();
            });             
        }
        $(document).bind('keydown', 'f5', toogle_value_customer_price_handler);
        $('#scan_text').bind('keydown', 'f5', toogle_value_customer_price_handler);         
        $('#toggle_value_customer_price_menu').click(function(e)
        { 
            toogle_value_customer_price_handler();
        });


        csrf_ajax_protection_setup();
        var oneshot_sync_b = oneshot_sync.bind(oneshot_sync,STORE_ID,COUCH_SERVER_URL);
        var customize_db_b =  customize_db.bind(customize_db,STORE_ID);
        async.waterfall([oneshot_sync_b,customize_db_b],function(error,result){
            if(error){
                alert("There is error initializing db: " + error);
                return;
            }
            STORE_IDB = result;
            STORE_PDB = pouch_db_util.get_store_db(STORE_ID);

            //init ui functionality
            hook_scanner_to_ui();
            hook_sale_finalizer_2_ui();
            hook_voider_2_ui();
            display_shortcut_table();
            hook_non_inventory_btn_2_ui();
            hook_product_search_btn_2_ui()
            refresh_sale_table();
        });
    }
);