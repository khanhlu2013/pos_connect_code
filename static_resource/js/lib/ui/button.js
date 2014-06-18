define(
[

]
,function
(

)
{
    function set_css(btn_id,color,glyphicon,is_dlg_btn,caption){

        var bootstrap_color = "";
        if(color == 'blue'){
            bootstrap_color = 'btn-primary';
        }else if(color == 'green'){
            bootstrap_color = 'btn-success';
        }else if(color == 'cyan'){
            bootstrap_color = 'btn-info';
        }else if(color == 'orange'){
            bootstrap_color = 'btn-warning';
        }else if(color == 'red'){
            bootstrap_color = 'btn-danger';
        }else{
            bootstrap_color = 'btn-default';
        }


        $('#' + btn_id).attr("class","btn " + bootstrap_color);
        if(glyphicon != null){
            $('#' + btn_id).append($('<span class="glyphicon glyphicon-' + glyphicon + '">' + (caption != undefined ? ' ' + caption : '') +'</span>'));
        }
        if(is_dlg_btn){
            $("#" + btn_id).mouseover(function() {$('button').removeClass("ui-state-hover ui-state-focus"); });
            $("#" + btn_id).mouseout(function() {$('button').removeClass("ui-state-hover ui-state-focus"); });              
        }
    }

    return{
        set_css:set_css
    }
})