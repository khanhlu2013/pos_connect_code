from django.http import HttpResponse
import datetime
from django.core.serializers.json import DjangoJSONEncoder
import json
from receipt.receipt_serializer import Receipt_serializer
from django.core.paginator import Paginator
from receipt.models import Receipt,Receipt_ln,Tender_ln
from payment_type.models import Payment_type
from store_product.cm import insert_new
from store_product.models import Store_product
import datetime

def _iso_date_str_to_python_date(iso_date_str):
    fmt="%Y-%m-%dT%H:%M:%S.%fZ"
    return datetime.datetime.strptime(iso_date_str, fmt)

def _extract_sp_json_from_receipt_lst_json_base_on_sp_doc_id_lst(sp_doc_id_lst,receipt_lst_json):
    sp_json_lst = []
    for receipt_json in receipt_lst_json:
        for receipt_ln_json in receipt_json['receipt_ln_lst']:
            if receipt_ln_json['store_product_stamp'] != None:
                if receipt_ln_json['store_product_stamp']['doc_id'] in sp_doc_id_lst:
                    if receipt_ln_json['store_product_stamp']['doc_id'] not in [sp_json['doc_id'] for sp_json in sp_json_lst]:
                        sp_json_lst.append(receipt_ln_json['store_product_stamp'])
    return sp_json_lst


def _create_sp(sp_lst_json,store_id):
    if len(sp_lst_json) == 0:
        raise Exception

    for sp_json in sp_lst_json:
        sp_master = insert_new.exe(
             store_id = store_id
            ,name = sp_json['name']
            ,price = sp_json['price']
            ,value_customer_price = sp_json['value_customer_price']
            ,crv = sp_json['crv']
            ,is_taxable = sp_json['is_taxable']
            ,is_sale_report = sp_json['is_sale_report']
            ,p_type = sp_json['p_type']
            ,p_tag = sp_json['p_tag']
            ,sku_str = sp_json['offline_create_sku']
            ,cost = sp_json['cost']
            ,vendor = sp_json['vendor']
            ,buydown = sp_json['buydown']
            ,offline_doc_id = sp_json['doc_id']
        )

def _get_sp_django_base_on_doc_id(doc_id,sp_lst_django):
    result = None
    for sp_django in sp_lst_django:
        if sp_django.sp_doc_id == doc_id:
            result = sp_django
            break
    return result

def _update(receipt_lst_json,sp_lst_django):
    for receipt_json in receipt_lst_json:
        for receipt_ln_json in receipt_json['receipt_ln_lst']:
            if receipt_ln_json['store_product_stamp'] != None:
                if receipt_ln_json['store_product_stamp']['sp_id'] == None:
                    sp_django = _get_sp_django_base_on_doc_id(receipt_ln_json['store_product_stamp']['doc_id'],sp_lst_django)
                    receipt_ln_json['store_product_stamp']['sp_id'] = sp_django.id

def _get_sp_doc_id_lst_withoutProductId(receipt_lst_json):
    result = []
    for receipt_json in receipt_lst_json:
        for receipt_ln_json in receipt_json['receipt_ln_lst']:
            if receipt_ln_json['store_product_stamp'] != None:
                if receipt_ln_json['store_product_stamp']['sp_id'] == None:
                    if receipt_ln_json['store_product_stamp']['doc_id'] not in result:
                        result.append(receipt_ln_json['store_product_stamp']['doc_id'])
    return result


def _get_receipt_django_base_on_doc_id(doc_id,receipt_django_lst):
    receipt_django = None
    for receipt in receipt_django_lst:
        if receipt._receipt_doc_id == doc_id:
            receipt_django = receipt
            break
    return receipt_django

def _get_pt_base_on_id(pt_id,pt_lst):
    result_pt = None
    for pt in pt_lst:
        if pt.id == pt_id:
            result_pt = pt
            break
    return result_pt

def _create_receipt(receipt__json__lst,store_id):
    receipt_django_b4_create_lst = []
    for receipt_json in receipt__json__lst:
        receipt_django = Receipt(
             date = _iso_date_str_to_python_date(receipt_json['date'])
            ,tax_rate = receipt_json['tax_rate']
            ,store_id = store_id
            ,_receipt_doc_id = receipt_json['doc_id']
        )
        receipt_django_b4_create_lst.append(receipt_django)
    
    Receipt.objects.bulk_create(receipt_django_b4_create_lst)
    receipt_django_after_create_lst = Receipt.objects.filter(_receipt_doc_id__in = [receipt['doc_id'] for receipt in receipt__json__lst])
    if len(receipt_django_b4_create_lst) != len(receipt_django_after_create_lst):
        raise Exception

    #create receipt_ln
    receipt_ln_django_lst = []
    for receipt_json in receipt__json__lst:
        receipt_django = _get_receipt_django_base_on_doc_id(receipt_json['doc_id'],receipt_django_after_create_lst)
        if receipt_django == None:
            raise Exception
        for receipt_ln_json in receipt_json['receipt_ln_lst']:
            sp_stamp_sp_id = None
            sp_stamp_name = None
            sp_stamp_price = None
            sp_stamp_value_customer_price = None
            sp_stamp_crv = None
            sp_stamp_is_taxable = None
            sp_stamp_is_sale_report = None
            sp_stamp_p_type = None
            sp_stamp_p_tag = None
            sp_stamp_cost = None
            sp_stamp_vendor = None
            sp_stamp_buydown = None
            mm_deal_discount = None
            mm_deal_name = None
            non_inventory_name = None
            non_inventory_price = None

            if receipt_ln_json['store_product_stamp'] != None:
                sp_stamp_sp_id = receipt_ln_json['store_product_stamp']['sp_id']
                sp_stamp_name = receipt_ln_json['store_product_stamp']['name']
                sp_stamp_price = receipt_ln_json['store_product_stamp']['price']
                sp_stamp_value_customer_price = receipt_ln_json['store_product_stamp']['value_customer_price']
                sp_stamp_crv = receipt_ln_json['store_product_stamp']['crv']
                sp_stamp_is_taxable = receipt_ln_json['store_product_stamp']['is_taxable']
                sp_stamp_is_sale_report = receipt_ln_json['store_product_stamp']['is_sale_report']
                sp_stamp_p_type = receipt_ln_json['store_product_stamp']['p_type']
                sp_stamp_p_tag = receipt_ln_json['store_product_stamp']['p_tag']
                sp_stamp_cost = receipt_ln_json['store_product_stamp']['cost']
                sp_stamp_vendor = receipt_ln_json['store_product_stamp']['vendor']
                sp_stamp_buydown = receipt_ln_json['store_product_stamp']['buydown']
            if receipt_ln_json['mm_deal_info_stamp'] != None:                
                mm_deal_discount = receipt_ln_json['mm_deal_info_stamp']['unit_discount']
                mm_deal_name = receipt_ln_json['mm_deal_info_stamp']['name']
            if receipt_ln_json['non_inventory'] != None:                       
                non_inventory_name = receipt_ln_json['non_inventory']['name']
                non_inventory_price = receipt_ln_json['non_inventory']['price']

            receipt_ln_django = Receipt_ln(
                 receipt = receipt_django
                ,qty = receipt_ln_json['qty']
                ,discount = receipt_ln_json['discount']
                ,override_price = receipt_ln_json['override_price']
                ,date = _iso_date_str_to_python_date(receipt_ln_json['date'])
                ,store_product_id = sp_stamp_sp_id
                ,sp_stamp_name = sp_stamp_name
                ,sp_stamp_price = sp_stamp_price
                ,sp_stamp_value_customer_price = sp_stamp_value_customer_price
                ,sp_stamp_crv = sp_stamp_crv
                ,sp_stamp_is_taxable = sp_stamp_is_taxable
                ,sp_stamp_is_sale_report = sp_stamp_is_sale_report
                ,sp_stamp_p_type = sp_stamp_p_type
                ,sp_stamp_p_tag = sp_stamp_p_tag
                ,sp_stamp_cost = sp_stamp_cost
                ,sp_stamp_vendor = sp_stamp_vendor
                ,sp_stamp_buydown = sp_stamp_buydown
                ,mm_deal_discount = mm_deal_discount
                ,mm_deal_name = mm_deal_name
                ,non_inventory_name = non_inventory_name
                ,non_inventory_price = non_inventory_price
            )
            receipt_ln_django_lst.append(receipt_ln_django)
    Receipt_ln.objects.bulk_create(receipt_ln_django_lst)

    #create tender_ln
    payment_type_lst = Payment_type.objects.filter(store_id=store_id)
    tender_ln_django_lst = []
    for receipt_json in receipt__json__lst:
        receipt_django = _get_receipt_django_base_on_doc_id(receipt_json['doc_id'],receipt_django_after_create_lst)
        if receipt_django == None:
            raise Exception
        
        for tender_ln_json in receipt_json['tender_ln_lst']:
            pt = None
            if tender_ln_json['pt'] != None:
                pt = _get_pt_base_on_id(tender_ln_json['pt']['id'],payment_type_lst)

            tender_ln_django = Tender_ln(
                 receipt = receipt_django
                ,payment_type = pt
                ,amount = tender_ln_json['amount']
                ,name = tender_ln_json['name']
            )
            tender_ln_django_lst.append(tender_ln_django)    
    Tender_ln.objects.bulk_create(tender_ln_django_lst)


def _previouslyCreatedReceipt_filter(receipt_lst_json):
    receipt_doc_id_lst = [receipt['doc_id'] for receipt in receipt_lst_json]
    receipt_lst_django_previouslyCreated = Receipt.objects.filter(_receipt_doc_id__in = receipt_doc_id_lst);
    receipt_doc_id_lst_previouslyCreated = [receipt_django._receipt_doc_id for receipt_django in receipt_lst_django_previouslyCreated]
    receipt_lst_json_needToCreate = [receipt_json for receipt_json in receipt_lst_json if receipt_json['doc_id'] not in receipt_doc_id_lst_previouslyCreated]
    return receipt_lst_json_needToCreate


def _create_sp_n_update_receipt_lst_json(receipt_lst_json,store_id):
    """
        the param is the receipt_lst that satisfy PREcondition that they are not yet created. 
        we are about to create these receipts on master
        this method will find out any of the sp from the receipt_lst param that are created offline. there will be 2 cases for these offline created product
            . they are already created on master previously but client failed to clean up and post them again. we dont re-create these sp, but simply find and update product_id for receipt_lst posted param
            . they are never created on master. we need to create them now. and update posted receipt lst param
    """
    sp_doc_id_lst_withoutProductId = _get_sp_doc_id_lst_withoutProductId(receipt_lst_json)
    if len(sp_doc_id_lst_withoutProductId) == 0:
        return

    #sp previously created
    sp_lst_django_previouslyCreated = Store_product.objects.filter(sp_doc_id__in = sp_doc_id_lst_withoutProductId)
    sp_doc_id_lst_previouslyCreated = [sp.sp_doc_id for sp in sp_lst_django_previouslyCreated]
    if len(sp_doc_id_lst_previouslyCreated) != 0:
        _update(receipt_lst_json,sp_lst_django_previouslyCreated)

    #sp need to create this time
    sp_doc_id_lst_needToCreatNow = [sp_doc_id for sp_doc_id in sp_doc_id_lst_withoutProductId if sp_doc_id not in sp_doc_id_lst_previouslyCreated]
    if len(sp_doc_id_lst_needToCreatNow) != 0:
        sp_lst_json_needToCreateNow = _extract_sp_json_from_receipt_lst_json_base_on_sp_doc_id_lst(sp_doc_id_lst_needToCreatNow,receipt_lst_json)
        _create_sp(sp_lst_json_needToCreateNow,store_id)
        sp_lst_django = Store_product.objects.filter(sp_doc_id__in = sp_doc_id_lst_needToCreatNow)
        _update(receipt_lst_json,sp_lst_django)


def exe(request):
    cur_login_store = request.session.get('cur_login_store')
    receipt_lst_json = json.loads(request.POST['receipt_lst'])
    receipt_lst_json_needToCreate = _previouslyCreatedReceipt_filter(receipt_lst_json)
    
    _create_sp_n_update_receipt_lst_json(receipt_lst_json_needToCreate,cur_login_store.id)#we need to report this list back to the client so that the client can clean up these sp_doc. we hide from the client which one in this list is already created or newly created. 
    _create_receipt(receipt_lst_json_needToCreate,cur_login_store.id)
    
    res = {
         'sp_doc_id_lst' : _get_sp_doc_id_lst_withoutProductId(receipt_lst_json)
        ,'receipt_doc_id_lst' : [receipt_json['doc_id'] for receipt_json in receipt_lst_json]
    }
    return HttpResponse(json.dumps(res),mimetype="application/javascript")