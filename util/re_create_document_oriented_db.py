from util import couch_db_util
from store.cm import insert_store_2_couch
from store.models import Store
from store_product.models import Store_product
from store_product import dao
from store_product.cm import insert_sp_2_couch
from store_product.models import Kit_breakdown_assoc
from django.conf import settings
from couchdb import Server,ResourceNotFound

def exe(store_id,switch_couch_admin_name=None,switch_couch_admin_pwrd=None,switch_couch_url=None):
    """
        . this is a util; it is call by a human, not code.
        . a human want to used this util when we want to generate document-oriented-db(couch) counterpart of relational-db. 
          this mean the document-oriented-db have to be NOT exist and the only way for it not to exist is when we DELETE it because when we create a store, we will have to create couchdb already
          The reason we want to delete it because something between document-db and relational-db is out of sync which is caused by a bug. 
          Another reason we want to delete it because we want to switch document-db to be hosted at another server (cloudant). So far, the reason we want to switch host is that we want to reduce hosting cost
    """

    store = Store.objects.get(pk=store_id)

    if switch_couch_admin_name != None:#we are switching host here; the use case for this so far is to reduce hosting cost
        couch_admin_name = switch_couch_admin_name
        couch_admin_pwrd = switch_couch_admin_pwrd
        couch_url = switch_couch_url
    else:#we are not switching host, we simply refresh document-oriented db at the same host. the use case for this is when document-oriented-db is out of sync with relational-db due to bug
        couch_admin_name = store.couch_admin_name
        couch_admin_pwrd = store.couch_admin_pwrd
        couch_url = store.couch_url        

    #either switching host or not, we are expecting the document-oriented-db is not exist as a precondition for this util. (we have to manually delete it first)
    db = _get_store_db(store_id,couch_admin_name,couch_admin_pwrd,couch_url)
    if db != None:
        return

    #insert store
    api_key_name,api_key_pwrd = insert_store_2_couch.exe(store_id,couch_admin_name,couch_admin_pwrd,couch_url)
    if not settings.IS_USE_COUCH_VS_BIG_COUCH:
        store.api_key_name = api_key_name
        store.api_key_pwrd = api_key_pwrd
        if switch_couch_admin_name != None: 
            store.couch_admin_name = switch_couch_admin_name
            store.couch_admin_pwrd = switch_couch_admin_pwrd
            store.couch_url = switch_couch_url
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
            ,price = couch_db_util.decimal_2_str(sp.price)
            ,value_customer_price = couch_db_util.decimal_2_str(sp.value_customer_price)
            ,crv = couch_db_util.decimal_2_str(sp.crv)
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
        url = couch_db_util.get_couch_access_url(name=name,pwrd=pwrd,url=url)
        server = Server(url)        
        store_db_name = couch_db_util.get_store_db_name(store_id)
        return server[store_db_name]
    except ResourceNotFound:
        return None        