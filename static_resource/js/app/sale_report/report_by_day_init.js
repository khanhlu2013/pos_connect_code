requirejs.config({
     baseUrl: '/static/js'
    ,paths: {
         app : 'app/'
        ,lib : 'lib/'
        ,jquery : 'lib/jquery/jquery-1_10_2'
        ,jquery_block_ui : 'lib/jquery/jquery_blockUI'
        ,jquery_ui : 'lib/jquery/jquery-ui'
        // ,pouch_db : 'lib/db/pouchdb'
    }
    ,shim: {

         'jquery_block_ui': ['jquery']
        ,'jquery_ui' : ['jquery']
        // ,'pouch_db': {
        //     exports: 'Pouch_db'
        // }        

    }
});

require(
    [
         'lib/misc/csrf_ajax_protection_setup'
        //-----------------
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
             url : "/product/updator_ajax"
            ,type : "POST"
            ,dataType : "json"
            ,data : {from_day:from_day,to_day:to_day}
            ,success: function(data){
                if(data.error!=null){
                    alert(data.error)
                }else{
                    display_report(data);
                }
            }
            ,error : function(xhr,errmsg,err){
                var error = xhr.status + ':' + xhr.responseText;
                alert(error);
            }
        });
    }

    refresh_btn.addEventListener("click",refresh_btn_handler);
});







