def exe(qty,price,discount,store_product,non_product_name):
    return {
         'qty':qty
        ,'store_product':store_product
        ,'price':price
        ,'crv':store_product['crv']
        ,'discount':discount
        ,'non_product_name':non_product_name
    } 