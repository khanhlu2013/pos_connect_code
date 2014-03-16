from model_mommy import mommy
from util.couch import user_util
from store.couch import store_util
from couchdb import ResourceNotFound
from django.contrib.auth.models import User
from helper import approve_product_db_setup

def associateProductAndBusiness(product,business):
    return mommy.make('store_product.Store_product',product=product,business=business)

def createProductWithSku(sku_str,is_approve_override=False):
    name = sku_str + '_' + str(is_approve_override)
    product = mommy.make('product.Product',_name_admin=name)
    sku = mommy.make('product.Sku',sku=sku_str,is_approved=False) # xxx we need to destroy is_approved
    prodSkuAssoc = mommy.make('product.ProdSkuAssoc',product=product,sku=sku,is_approve_override=is_approve_override)
    return prodSkuAssoc.product

def create_category_then_department(business,cat_name,dep_name):
    category = mommy.make('product.Category',creator = business,name=cat_name)
    department = mommy.make('product.Department',category = category,name=dep_name)
    return (category,department)

def create_user_then_store_detail(user_name,user_password,store_name):
    #helper: create user belong to that single store
    store = mommy.make('store.Store',name=store_name)
    user = User.objects.create_user(username = user_name,password=user_password,first_name=user_name)
    membership = mommy.make('liqUser.Membership',business=store,user=user)
    return (membership.user,membership.user.business_lst.all()[0])

def create_user_then_store():
    #helper: create user belong to that single store
    store = mommy.make('store.Store')
    user = mommy.make('auth.User')
    membership = mommy.make('liqUser.Membership',business=store,user=user)
    return (membership.user,membership.user.business_lst.all()[0])

def _delete_liquor_db_and_user(store_id):
    # xxx
    client_user = user_util.get_client_user(store_id)
    if client_user:
        user_util.delete_client_user(store_id)

    store_db = store_util.get_store_db(store_id)
    if store_db:    
        store_util.delete_store_db(store_id)

def setup_test_couchdb():
    _delete_liquor_db_and_user(1)
    _delete_liquor_db_and_user(2)
    _delete_liquor_db_and_user(3)
    approve_product_db_setup.exe_create()


def teardown_test_couchdb():
    approve_product_db_setup.exe_delete()
    _delete_liquor_db_and_user(1)
    _delete_liquor_db_and_user(2)
    _delete_liquor_db_and_user(3)
    #i expect test does not create more than 3 store

