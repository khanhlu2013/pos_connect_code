from product.models import Product,Unit,ProdSkuAssoc,Sku
from django.contrib.auth.models import User
from store.models import Store
from model_mommy import mommy
from helper import test_helper
from util.couch import master_account_util,old_security_4_test_purpose
import json
from couch import couch_util,couch_constance
import requests
from group.models import Group
from mix_match.models import Mix_match,Mix_match_child


def p():
    print("refresh fixture: production")

    delete_data()
    # user1,store1=test_helper.create_user_then_store_detail(user_name = "w",user_password="w",store_name="w")
    user1,store1=test_helper.create_user_then_store_detail(user_name = "x",user_password="x",store_name="x")
    user2,store2=test_helper.create_user_then_store_detail(user_name = "y",user_password="y",store_name="y")
    user3,store3=test_helper.create_user_then_store_detail(user_name = "z",user_password="z",store_name="z") 
    print("load approve product data")
    json_file = open('./id/liquor.json')   
    data = json.load(json_file)
    import_json_data(data)
    json_file.close()

    print("completed")



def d():
    print("refresh fixture: staging ")

    delete_data()

    print("create 1 approve product with sku = 123")
    test_helper.createProductWithSku(sku_str='123',is_approve_override=True)

    print("create 3 sample store x,y,z")
    user1,store1=test_helper.create_user_then_store_detail(user_name = "x",user_password="x",store_name="x")
    user2,store2=test_helper.create_user_then_store_detail(user_name = "y",user_password="y",store_name="y")
    user3,store3=test_helper.create_user_then_store_detail(user_name = "z",user_password="z",store_name="z")

    print("completed")


def import_json_data(data):
    product_lst = []
    sku_lst = []
    unit_lst = []
    prod_sku_assoc_lst = []

    for item in data:
        model_name = item['model']
        if model_name == 'product.unit':
            unit_lst.append(item)
        elif model_name == 'product.product':
            product_lst.append(item)
        elif model_name == 'product.sku':
            sku_lst.append(item)
        elif model_name == 'product.prodskuassoc':
            prod_sku_assoc_lst.append(item)
        else:
            raise Exception('unexpected model name ' + model_name)


    #INSERT UNIT
    unit_lst_django = [Unit(name=unit['fields']['name'],abbreviate=unit['fields']['abbreviate'],is_approved=True,_old_id=unit['pk']) for unit in unit_lst]
    Unit.objects.bulk_create(unit_lst_django)
    unit_lst_django = list(Unit.objects.all())

    
    #INSERT PRODUCT
    product_lst_django = []
    for product in product_lst:
        unit_lst = [unit for unit in unit_lst_django if unit._old_id == product['fields']['unit']]
        if len(unit_lst) !=1:
            raise Exception('bug')

        product_django = Product(_name_admin=product['fields']['name'],_size_admin=product['fields']['size'],_unit_admin_id=unit_lst[0].id,_old_id=product['pk'])
        product_lst_django.append(product_django)
    Product.objects.bulk_create(product_lst_django)
    product_lst_django = list(Product.objects.all())


    #INSERT SKU
    sku_lst_django = [Sku(sku=sku['fields']['sku'],is_approved=True,_old_id=sku['pk']) for sku in sku_lst if len(sku['fields']['sku']) == 6 or len(sku['fields']['sku']) == 12]
    Sku.objects.bulk_create(sku_lst_django)
    sku_lst_django = list(Sku.objects.all())


    #INSERT PROD_SKU_ASSOC
    prod_sku_assoc_lst_django = []
    for prod_sku_assoc in prod_sku_assoc_lst:
        
        temp_product_lst = [i for i in product_lst_django if i._old_id == prod_sku_assoc['fields']['product']]
        if len(temp_product_lst)!=1:
            raise Exception('bug')

        temp_sku_lst = [i for i in sku_lst_django if i._old_id == prod_sku_assoc['fields']['sku']]
        if len(temp_sku_lst)>1:
            raise Exception('bug')
        elif len(temp_sku_lst) == 0:
            continue        
       
        prod_sku_assoc_lst_django.append(ProdSkuAssoc(sku_id=temp_sku_lst[0].id,product_id=temp_product_lst[0].id,is_approve_override=True))
    ProdSkuAssoc.objects.bulk_create(prod_sku_assoc_lst_django)


    #CLEAN UP: since we only select sku = 12 or 6 in length, we clean up product and unit that does not match this sku criteria
    Product.objects.filter(sku_set=None).delete()
    Unit.objects.filter(product=None).delete()


def delete_data():
    Group.objects.all().delete()
    Mix_match_child.objects.all().delete()
    Mix_match.objects.all().delete()    
    Product.objects.all().delete()
    Unit.objects.all().delete()
    ProdSkuAssoc.objects.all().delete()
    User.objects.all().delete()
    Sku.objects.all().delete()


    #delete store on couch
    store_lst = list(Store.objects.all())
    for store in store_lst:
        store_db = couch_util.get_store_db(store.id)
        if store_db:    
            couch_util.delete_store_db(store.id)

    #delete store on master
    Store.objects.all().delete()


