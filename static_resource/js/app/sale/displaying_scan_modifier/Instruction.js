define(function(){

	return function Modify_instruction(is_delete,new_qty,new_price,new_discount){
		this.is_delete = is_delete;
		this.new_qty = new_qty;
		this.new_price = new_price;
		this.new_discount = new_discount;
 	};
});