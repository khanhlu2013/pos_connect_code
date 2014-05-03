define(
    [
         'lib/misc/csrf_ajax_protection_setup'
        //-----------------
        ,'jquery'
        ,'jquery_block_ui'
        ,'jquery_ui'       
    ]
    ,function
    (
        csrf_ajax_protection_setup
    )
{
    csrf_ajax_protection_setup();
    
    $(function() {
        $( "#from_day_txt" ).datepicker();
        $( "#to_day_txt" ).datepicker();
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


    function refresh_btn_handler(){

        var from_day = $( "#from_day_txt" ).val();
        var to_day = $( "#to_day_txt" ).val();

        $.ajax({
             url : "/sale/get_report_by_day"
            ,type : "POST"
            ,dataType : "json"
            ,data : {from_day:from_day,to_day:to_day}
            ,success: function(data,status_str,xhr){
                display_report(data);
            }
            ,error : function(xhr,status_str,err){
                alert(xhr);
            }
        });
    }

    refresh_btn.addEventListener("click",refresh_btn_handler);
});







