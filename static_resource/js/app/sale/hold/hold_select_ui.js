define(
[
     'lib/error_lib'
    ,'lib/async'
    ,'lib/ajax_helper'
    ,'lib/ui/ui'
    ,'constance'
]
,function
(
     error_lib
    ,async
    ,ajax_helper
    ,ui
    ,constance
)
{
    var RET_HOLD = null;
    var HOLD_LST = null;

    function exe(hold_lst,callback){
        HOLD_LST = hold_lst;

        var html_str = 
            '<div id="_hold_select_dlg">' +
                '<table id="_hold_select_tbl" border="1"></table>' +
            '</div>';

        $(html_str).appendTo('body')
            .dialog(
            {
                modal: true,
                title : 'select holds',
                zIndex: 10000,
                autoOpen: true,
                width: 500,
                height: 500,
                buttons : 
                [
                    {
                        text:'exit',
                        click: function(){
                            $('#_hold_select_dlg').dialog('close');
                            callback('ERROR_CANCEL_');
                        }
                    }
                ],
                open: function( event, ui ) 
                {
                    var tbl = document.getElementById('_hold_select_tbl');
                    tbl.innerHTML = '';

                    var tr;var td;
                    var column_name = ['date','select'];
                    tr = tbl.insertRow(-1);
                    for(var i = 0;i<column_name.length;i++){
                        td = tr.insertCell(-1);
                        td.innerHTML = column_name[i];
                    }

                    for(var i = 0;i<HOLD_LST.length;i++){
                        tr = tbl.insertRow(-1);
                        var hold = HOLD_LST[i];

                        td = tr.insertCell(-1);
                        td.innerHTML = new Date(hold.date);

                        td = tr.insertCell(-1);
                        td.innerHTML = 'select';     
                        (function(hold){
                            td.addEventListener('click',function(){
                                $('#_hold_select_dlg').dialog('close');
                                callback(null,hold); 
                            });
                        })(hold)
                    }
                },
                close: function (event, ui) {
                    $(this).remove();
                }
            });          
    }

    return{
        exe:exe
    }
})