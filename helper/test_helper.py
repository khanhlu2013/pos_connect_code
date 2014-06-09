from model_mommy import mommy
from util.couch import user_util
from couch import couch_util
from couchdb import ResourceNotFound
from django.contrib.auth.models import User
import os
from store_product import new_sp_inserter

def create_bare_sp(store_id):
    return new_sp_inserter.exe(
         store_id = store_id
        ,name = 'x'
        ,price = 1
        ,value_customer_price = None
        ,crv = None
        ,is_taxable = False
        ,is_sale_report = False
        ,p_type = None
        ,p_tag = None
        ,sku_str = None
        ,cost = None
        ,vendor = None
        ,buydown = None
    )


def create_sp(store,product):
    return mommy.make('store_product.Store_product',product=product,store=store,is_taxable=False)

def associateProductAndBusiness(product,store):
    return mommy.make('store_product.Store_product',product=product,store=store,is_taxable=False)

def createProductWithSku(sku_str,is_approve_override=False):
    name = sku_str + '_' + str(is_approve_override)
    product = mommy.make('product.Product',_name_admin=name)
    sku = mommy.make('product.Sku',sku=sku_str,is_approved=False) # xxx we need to destroy is_approved
    prodSkuAssoc = mommy.make('product.ProdSkuAssoc',product=product,sku=sku,is_approve_override=is_approve_override)
    return prodSkuAssoc.product

def create_user_then_store_detail(user_name,user_password,store_name):
    #helper: create user belong to that single store
    store = mommy.make('store.Store',name=store_name)
    user = User.objects.create_user(username = user_name,password=user_password,first_name=user_name)
    membership = mommy.make('liqUser.Membership',business=store,user=user)
    return (membership.user,membership.user.business_set.all()[0])

def create_user_then_store():
    #helper: create user belong to that single store
    store = mommy.make('store.Store')
    user = mommy.make('auth.User')
    membership = mommy.make('liqUser.Membership',business=store,user=user)
    return (membership.user,membership.user.business_set.all()[0].store)

def _delete_liquor_db_and_user(store_id):
    store_db = couch_util.get_store_db(store_id)
    if store_db:    
        couch_util.delete_store_db(store_id)

def setup_test_couchdb():
    _delete_liquor_db_and_user(1)
    _delete_liquor_db_and_user(2)
    _delete_liquor_db_and_user(3)

def teardown_test_couchdb():
    _delete_liquor_db_and_user(1)
    _delete_liquor_db_and_user(2)
    _delete_liquor_db_and_user(3)
    #i expect test does not create more than 3 store

