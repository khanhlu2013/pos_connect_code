define(
    [
         'lib/number/number'
        ,'app/receipt/Receipt_ln_json'
    ]
    ,function
    (
         number
        ,Receipt_ln_json
    )
{
    function Receipt_json(receipt_json){
        var rj = receipt_json;

        this.time_stamp = rj.time_stamp;
        this.tax_rate = number.str_2_float(rj.tax_rate);
        this.tender_ln_lst = rj.tender_ln_set;
        
        //line
        var receipt_ln_lst = [];
        for(var i = 0;i<receipt_json.receipt_ln_set.length;i++){
            receipt_ln_lst.push(new Receipt_ln_json(receipt_json.receipt_ln_set[i]))
        }
        this.receipt_ln_lst = receipt_ln_lst;
    };

    Receipt_json.prototype = {
         constructor: Receipt_json
        ,get_total: function(){
            var result = 0.0;
            var ln_lst = this.receipt_ln_lst;
            for(var i = 0;i<ln_lst.length;i++){
                result += ln_lst[i].get_line_total(this.tax_rate);
            }
            return number.round_2_decimal(result);
        }
    }
    return Receipt_json;
});