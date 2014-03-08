from product.models import Product


# def exe(frequency):
    # #might be searching this list throught prod_sku_assoc
    # #get approve by override list
    # approve_override_lst = list(Product.objects.filter(is_approve_override = True))
    
    # #get approve dynamically list
    # approve_dynamic_lst = []
    # non_approve_override_lst = list(Product.objects.filter(is_approve_override = False).prefetch_related('prodskuassoc_set__store_product_lst'))
    # for product in non_approve_override_lst:
    #     if product.is_approve(frequency):
    #         approve_dynamic_lst.append(product)

    # #return combine list        
    # return approve_override_lst + approve_dynamic_lst


# def exe(frequency):
#     #does not work because it return a weird dictionary
#     return list(ProdSkuAssoc.objects.filter(is_approve_override = True).values('product').distinct())

def exe(frequency):
    product_lst = list(Product.objects.all())
    return [product for product in product_lst if product.is_approve(frequency) == True]
