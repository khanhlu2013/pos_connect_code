define(
[
     'lib/async'
    ,'lib/error_lib'
    ,'lib/ui/ui'
    ,'lib/ajax_helper'
    ,'app/receipt/receipt_pusher'     
]
,function
(
     async
    ,error_lib
    ,ui
    ,ajax_helper
    ,receipt_pusher
)
{
    var STORE_ID = null;
    var COUCH_SERVER_URL = null;
    var IS_SALE_REPORT = null;
    var refresh_btn = null;
    var today_btn = null;
    var report_tbl = null;


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

    function ajax_exe(from_date,to_date){
        var time_zone_offset = new Date().getTimezoneOffset() / 60;

        var push_receipt_b = receipt_pusher.exe_if_nessesary.bind(receipt_pusher.exe_if_nessesary,STORE_ID,COUCH_SERVER_URL);
        var data = {from_date:from_date,to_date:to_date,time_zone_offset:time_zone_offset,is_sale_report:IS_SALE_REPORT};
        var ajax_b = ajax_helper.exe.bind(ajax_helper.exe,'/sale_report/date_range','GET','getting report data ...',data)

        async.series([push_receipt_b,ajax_b],function(error,results){
            if(error){
                error_lib.alert_error(error);
                return;
            }
            var report_data = results[1];
            display_report(report_data);
        })
    }

    function refresh_btn_handler(){
        var from_date = $( "#from_date_txt" ).val();
        var to_date = $( "#to_date_txt" ).val();
        ajax_exe(from_date,to_date)
    }

    function exe(store_id,couch_server_url,is_sale_report){
        IS_SALE_REPORT = is_sale_report;
        STORE_ID = store_id;
        COUCH_SERVER_URL =couch_server_url;

        var html_str = 
            '<div id="date_range_report_dlg">' +
                '<label for="from_date_txt">from</label>' +
                '<input id="from_date_txt" type="text" max="10">' +
                '<label for="to_date_txt">to</label>' +
                '<input id="to_date_txt" type="text" max="10">' +
                '<input id="_refresh_btn" type="button" value="refresh">' +
                '<input id="_today_btn" type="button" value="today">' +

                '<table id="report_tbl" border="1"></table>' +
            '</div>';

        $(html_str).appendTo('body')
            .dialog(
            {
                modal: true,
                title : is_sale_report ? 'sale report' : 'non-sale report',
                zIndex: 10000,
                autoOpen: true,
                width: 650,
                height: 500,
                buttons : [{text:'exit', click: function(){$('#date_range_report_dlg').dialog('close');}}],
                open: function( event, ui ) 
                {
                    today_btn = document.getElementById('_today_btn');
                    refresh_btn = document.getElementById('_refresh_btn');
                    report_tbl = document.getElementById('report_tbl');    
                    $(function() {
                        $( "#from_date_txt" ).datepicker();
                        $( "#to_date_txt" ).datepicker();
                    });     
                    refresh_btn.addEventListener("click",refresh_btn_handler);  
                    today_btn.addEventListener("click",function(){
                        var today = new Date();
                        var dd = today.getDate();
                        var mm = today.getMonth()+1; //January is 0!
                        var yyyy = today.getFullYear();     
                        var today_str = mm + '/' + dd + '/' + yyyy;                   
                        ajax_exe(today_str,today_str);
                    });                               
                },
                close: function (event, ui) {
                    $(this).remove();
                }
            });  
    }

    return{
         exe:exe
    }
});