define(
    [
         'lib/misc/csrf_ajax_protection_setup'
        ,'app/receipt/receipt_pusher' 
        ,'lib/async'
        ,'lib/error_lib'
        ,'lib/ui/ui'
        //-----------------
        ,'jquery'
        ,'jquery_block_ui'
        ,'jquery_ui'       
    ]
    ,function
    (
         csrf_ajax_protection_setup
        ,receipt_pusher
        ,async
        ,error_lib
        ,ui
    )
{
    csrf_ajax_protection_setup();
    var STORE_ID = MY_STORE_ID;
    var COUCH_SERVER_URL = MY_COUCH_SERVER_URL;

    $(function() {
        $( "#from_date_txt" ).datepicker();
        $( "#to_date_txt" ).datepicker();
    });    

    var refresh_btn = document.getElementById('refresh_btn');
    var receipt_tbl = document.getElementById('receipt_tbl')


    function display_receipt_table(receipt_lst){
        receipt_tbl.innerHTML = "";
        var tr;var td;

        //columns
        tr = receipt_tbl.insertRow(-1);
        var columns = ['date','amount']
        for(var i = 0;i<columns.length;i++){
            td = tr.insertCell(-1);
            td.innerHTML = columns[i];
        }
        
        for(var i = 0;i<receipt_lst.length;i++){

            tr = receipt_tbl.insertRow(-1);
            var cur_receipt = receipt_lst[i];

            //date
            td = tr.insertCell(-1);
            td.innerHTML = new Date(cur_receipt.time_stamp).toString();

            //amount
            td = tr.insertCell(-1);
            td.innerHTML = cur_receipt.collect_amount;
        }
    }

    function ajax_get_receipt(from_date,to_date,time_zone_offset,callback){
        ui.ui_block('get receipts data');
        $.ajax({
             url : "/receipt/get_receipt"
            ,type : "GET"
            ,dataType : "json"
            ,data : {from_date:from_date,to_date:to_date,time_zone_offset:time_zone_offset}
            ,success: function(data,status_str,xhr){
                ui.ui_unblock();
                callback(null,data)
            }
            ,error : function(xhr,status_str,err){
                ui.ui_unblock();
                callback(xhr);
            }
        });        
    }

    function refresh_btn_handler(){
        var from_date = $( "#from_date_txt" ).val();
        var to_date = $( "#to_date_txt" ).val();
        var time_zone_offset = new Date().getTimezoneOffset() / 60;

        var push_receipt_b = receipt_pusher.exe_if_nessesary.bind(receipt_pusher.exe_if_nessesary,STORE_ID,COUCH_SERVER_URL);
        var ajax_get_receipt_b = ajax_get_receipt.bind(ajax_get_receipt,from_date,to_date,time_zone_offset);
        async.series([push_receipt_b,ajax_get_receipt_b],function(error,results){
            if(error){
                error_lib.alert_error(error);
                return;
            }
            var receipt_data = results[1];
            display_receipt_table(receipt_data);
        });
    }

    refresh_btn.addEventListener("click",refresh_btn_handler);
});







