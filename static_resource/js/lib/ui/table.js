define(
[
    'lib/number/number'
]
,function
(
    number
)
{
    function set_header(col_info_lst,tbl){
        var column_html = "";

        var total_percentage = 0.0;

        for( var i = 0;i<col_info_lst.length;i++){
            total_percentage += col_info_lst[i].width;
        } 

        for( var i = 0;i<col_info_lst.length;i++){
            var col_info = col_info_lst[i];
            var scaled_percentage = number.round_2_decimal(((col_info.width/total_percentage) * 100));
            column_html += '<th style=' + '"' + 'width: ' + scaled_percentage + '%' + '"' + '>' + col_info.caption + '</th>';
        }    
        tbl.createTHead();        
        tbl.tHead.innerHTML= '<tr>' + column_html + '</tr>';        
    }

    return{
        set_header:set_header
    }
})