define(
[
     'lib/async'
    ,'lib/error_lib'
    ,'lib/ui/ui'
    ,'lib/ajax_helper'
    ,'app/receipt/receipt_pusher' 
    ,'app/receipt/Receipt_json'
]
,function
(
     async
    ,error_lib
    ,ui
    ,ajax_helper
    ,receipt_pusher
    ,Receipt_json
)
{
    var STORE_ID = null;
    var COUCH_SERVER_URL = null;
    var RECEIPT_JSON_LST = null;/*Receipt_json list*/

    var refresh_btn = null;
    var receipt_tbl = null;

    function display_receipt_table(){
        receipt_tbl.innerHTML = "";
        var tr;var td;

        //columns
        tr = receipt_tbl.insertRow(-1);
        var columns = ['date','amount']
        for(var i = 0;i<columns.length;i++){
            td = tr.insertCell(-1);
            td.innerHTML = columns[i];
        }
        
        for(var i = 0;i<RECEIPT_JSON_LST.length;i++){

            tr = receipt_tbl.insertRow(-1);
            var cur_receipt = RECEIPT_JSON_LST[i];

            //date
            td = tr.insertCell(-1);
            td.innerHTML = new Date(cur_receipt.time_stamp).toString();

            //amount
            td = tr.insertCell(-1);
            td.innerHTML = cur_receipt.get_total();
        }
    }

    function refresh_btn_handler(){
        var from_date = $( "#from_date_txt" ).val();
        var to_date = $( "#to_date_txt" ).val();
        var time_zone_offset = new Date().getTimezoneOffset() / 60;

        var push_receipt_b = receipt_pusher.exe_if_nessesary.bind(receipt_pusher.exe_if_nessesary,STORE_ID,COUCH_SERVER_URL);
        var data = {from_date:from_date,to_date:to_date,time_zone_offset:time_zone_offset};
        var ajax_b = ajax_helper.exe.bind(ajax_helper.exe,'/receipt/get_receipt','GET','get receipts data',data);
        async.series([push_receipt_b,ajax_b],function(error,results){
            if(error){
                error_lib.alert_error(error);
                return;
            }
            var receipt_json_lst = results[1];
            RECEIPT_JSON_LST = [];
            for(var i = 0;i<receipt_json_lst.length;i++){
                RECEIPT_JSON_LST.push(new Receipt_json(receipt_json_lst[i]));
            }
            display_receipt_table();
        });
    }

    function exe(store_id,couch_server_url){
        
        var html_str = 
            '<div id="receipt_report_dlg">' +
                '<label for="from_date_txt">from</label><input id="from_date_txt" type="text">' +
                '<label for="to_date_txt">to</label><input id="to_date_txt" type="text">' +
                '<input id="refresh_btn" type="button" value="refresh">' +
                '<table id="receipt_tbl" border="1"></table>' +
            '</div>';

        $(html_str).appendTo('body')
            .dialog(
            {
                modal: true,
                title : 'receipt report',
                zIndex: 10000,
                autoOpen: true,
                width: 600,
                height: 600,
                buttons : [{text:'cancel', click: function(){$('#receipt_report_dlg').dialog('close');}}],
                open: function( event, ui ) 
                {
                    STORE_ID = store_id;
                    COUCH_SERVER_URL = couch_server_url;

                    $(function() {
                        $( "#from_date_txt" ).datepicker();
                        $( "#to_date_txt" ).datepicker();
                    });    

                    refresh_btn = document.getElementById('refresh_btn');
                    receipt_tbl = document.getElementById('receipt_tbl');            
                    refresh_btn.addEventListener("click",refresh_btn_handler);        
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