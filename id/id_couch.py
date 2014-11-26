from util import couch_util
from store.cm import insert_store_2_couch
from store.models import Store
from store_product.models import Store_product
from store_product import dao
from store_product.sp_couch.document import Store_product_document
from store_product.cm import insert_sp_2_couch
from store_product.models import Kit_breakdown_assoc
from django.conf import settings
from couchdb import Server,ResourceNotFound

def exe(store_id,switch_couch_admin_name=None,switch_couch_admin_pwrd=None,switch_couch_url=None):
    store = Store.objects.get(pk=store_id)

    if switch_couch_admin_name != None:
        couch_admin_name = switch_couch_admin_name
        couch_admin_pwrd = switch_couch_admin_pwrd
        couch_url = switch_couch_url
    else:
        couch_admin_name = store.couch_admin_name
        couch_admin_pwrd = store.couch_admin_pwrd
        couch_url = store.couch_url        

    db = _get_store_db(store_id,couch_admin_name,couch_admin_pwrd,couch_url)
    if db != None:
        return

    #insert store
    api_key_name,api_key_pwrd = insert_store_2_couch.exe(store_id,couch_admin_name,couch_admin_pwrd,couch_url)
    print('------')
    print(api_key_name)
    print(api_key_pwrd)
    if not settings.IS_LOCAL_ENV:
        store.pid_key_name = api_key_name
        store.pid_key_pwrd = api_key_pwrd
        if switch_couch_admin_name != None: 
            store.couch_admin_name = switch_couch_admin_name
            store.couch_admin_pwrd = switch_couch_admin_pwrd
            store.couch_url = switch_couch_url
        print('xxxxxx')
        print(store.api_key_name)
        print(store.api_key_pwrd)
        store.save()

    #insert product
    sp_lst = dao.get_lst(store_id)
    for sp in sp_lst:
        sku_assoc_lst = sp.product.prodskuassoc_set.all()
        sku_lst = [assoc.sku.sku for assoc in sku_assoc_lst if store_id in [sp_subscribed.store.id for sp_subscribed in assoc.store_product_set.all()] ]

        bd_assoc_lst = Kit_breakdown_assoc.objects.filter(kit=sp)
        bd_assoc_json_lst = [{'qty':assoc.qty,'product_id':assoc.breakdown.product.id} for assoc in bd_assoc_lst]

        insert_sp_2_couch.exe(
             id = sp.id
            ,store_id = store_id
            ,product_id = sp.product.id
            ,name = sp.name
            ,price = couch_util.decimal_2_str(sp.price)
            ,value_customer_price = couch_util.decimal_2_str(sp.value_customer_price)
            ,crv = couch_util.decimal_2_str(sp.crv)
            ,is_taxable = sp.is_taxable
            ,is_sale_report = sp.is_sale_report
            ,p_type = sp.p_type
            ,p_tag = sp.p_tag
            ,sku_lst = sku_lst
            ,cost = sp.cost
            ,vendor = sp.vendor
            ,buydown = sp.buydown
            ,breakdown_assoc_lst = bd_assoc_json_lst
        );

def _get_store_db(store_id,name,pwrd,url):

    try:
        url = couch_util.get_couch_access_url(name=name,pwrd=pwrd,url=url)
        server = Server(url)        
        store_db_name = couch_util.get_store_db_name(store_id)
        return server[store_db_name]
    except ResourceNotFound:
        return None        