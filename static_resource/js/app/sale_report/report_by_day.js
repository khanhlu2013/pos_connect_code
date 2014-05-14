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
    var STORE_ID = MY_STORE_ID;
    var COUCH_SERVER_URL = MY_COUCH_SERVER_URL;
    csrf_ajax_protection_setup();
    
    $(function() {
        $( "#from_date_txt" ).datepicker();
        $( "#to_date_txt" ).datepicker();
    });    

    var refresh_btn = document.getElementById('refresh_btn');
    var report_tbl = document.getElementById('report_tbl')


    function display_report(data){
        $(report_tbl).empty();
        for(var key in data){
            if(data.hasOwnProperty(key)){
                var tr = report_tbl.insertRow(-1);
                var td;
                td = tr.insertCell(-1);
                td.innerHTML = (key);
                td = tr.insertCell(-1);
                td.innerHTML = (data[key]);                
            }
        }
    }

    function ajax_get_report(from_date,to_date,time_zone_offset,callback){
        ui.ui_block('getting report data ...')
        $.ajax({
             url : "/sale_report/get_report"
            ,type : "GET"
            ,dataType : "json"
            ,data : {from_date:from_date,to_date:to_date,time_zone_offset:time_zone_offset}
            ,success: function(data,status_str,xhr){
                ui.ui_unblock();
                callback(null,data);
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
        var ajax_get_report_b = ajax_get_report.bind(ajax_get_report,from_date,to_date,time_zone_offset);
        async.series([push_receipt_b,ajax_get_report_b],function(error,results){
            if(error){
                error_lib.alert_error(error);
                return;
            }
            var report_data = results[1];
            display_report(report_data);
        })

    }

    refresh_btn.addEventListener("click",refresh_btn_handler);
});







