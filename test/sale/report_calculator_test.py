from django_webtest import WebTest
from model_mommy import mommy
from sale import report_calculator
from sale.models import Receipt,Receipt_ln
from helper import test_helper
from store_product.models import Store_product
from decimal import Decimal

class test(WebTest):

    def setUp(self):
        test_helper.setup_test_couchdb()

    def tearDown(self):
        test_helper.teardown_test_couchdb()

    def test(self):
        """
            Report calculator take in a receipt list from master and calculate a report dictionary with keys: tax, nontax, ptype, undefined, non-sp-name 
                and value is the corresponding sum report. Notice there is no couch invovle here since receipt is cut and paste from couch to master


            Fixture: use mommy to create 2 receipts:
                .r1 (receipt 1)
                    . r1l1 (receipt 1, line 1): non sp              (qty,price,crv,discount) = (1 , 1.1 , 1.1 , null)
                    . r1l2 (receipt 1, line 2): tax , p_type = null (qty,price,crv,discount) = (2 , 2.2 , 2.2 , null)

                .r2
                    . r2l1: tax , p_type !=null                     (qty,price,crv,discount) = (3 , 3.3 , 3.3 , null)
                    . r2l2: non-tax , p_type != null                (qty,price,crv,discount) = (4 , 4.4 , 4.4 , null)
        """

        # foreman  run -e .env,test.env python manage.py test test.sale.report_calculator_test:test.test
        user,store = test_helper.create_user_then_store()
        tax_rate = 9.0


        # R1
        r1 = mommy.make(
             Receipt
            ,tax_rate = tax_rate
            ,store = store
        )

        # R1_L1_SP
        r1_l1_sp = None 

        # R1_L1
        r1_l1_qty               = 1
        r1_l1_price             = 1.1
        r1_l1_crv               = 1.1
        r1_l1_discount          = None
        r1_l1_non_product_name = 'r1_l1_non_product_name'
        r1_l1 = mommy.make(
             Receipt_ln
            ,receipt            = r1
            ,qty                = r1_l1_qty
            ,store_product      = r1_l1_sp
            ,price              = r1_l1_price
            ,crv                = r1_l1_crv
            ,discount           = r1_l1_discount
            ,non_product_name   = r1_l1_non_product_name
            ,is_taxable         = False
            ,p_type             = None
            ,p_tag              = None
            ,cost               = None
            ,buydown            = None
        )

        # R1_L2_SP - receipt 1, line 2
        r1_l2_sp_name           = 'r1_l2_sp_name'
        r1_l2_sp_price          = 2.2
        r1_l2_sp_crv            = 2.2
        r1_l2_sp_is_taxable     = True
        r1_l2_sp_is_sale_report = True
        r1_l2_sp_p_type         = None
        r1_l2_sp_p_tag          = None
        r1_l2_sp = mommy.make(
             Store_product
            ,store              = store
            ,name               = r1_l2_sp_name
            ,price              = r1_l2_sp_price
            ,crv                = r1_l2_sp_crv
            ,is_taxable         = r1_l2_sp_is_taxable
            ,is_sale_report     = r1_l2_sp_is_sale_report
            ,p_type             = r1_l2_sp_p_type
            ,p_tag              = r1_l2_sp_p_tag
        )

        # R1_L2
        r1_l2_qty               = 2
        r1_l2_price             = 2.2
        r1_l2_crv               = 2.2
        r1_l2_dicount           = None
        r1_l2_non_product_name  = None

        r1_l2 = mommy.make(
             Receipt_ln
            ,receipt            = r1
            ,qty                = r1_l2_qty
            ,store_product      = r1_l2_sp
            ,price              = r1_l2_price
            ,crv                = r1_l2_crv
            ,discount           = r1_l2_dicount
            ,non_product_name   = r1_l2_non_product_name
            ,is_taxable         = r1_l2_sp_is_taxable
            ,p_type             = r1_l2_sp_p_type
            ,p_tag              = r1_l2_sp_p_tag
            ,cost               = None
            ,buydown            = None            
        )        


        #---------------------------------------------------------------


        # R2
        r2 = mommy.make(
             Receipt
            ,tax_rate = tax_rate
            ,store = store
        )

        # R2_L1_SP
        r2_l1_sp_name           = 'r2_l1_sp_name'
        r2_l1_sp_price          = 3.3
        r2_l1_sp_crv            = 3.3
        r2_l1_sp_is_taxable     = True
        r2_l1_sp_is_sale_report = True
        r2_l1_sp_p_type         = 'r2_l1_p_type'
        r2_l1_sp_p_tag          = None
        r2_l1_sp = mommy.make(
             Store_product
            ,store              = store
            ,name               = r2_l1_sp_name
            ,price              = r2_l1_sp_price
            ,crv                = r2_l1_sp_crv
            ,is_taxable         = r2_l1_sp_is_taxable
            ,is_sale_report     = r2_l1_sp_is_sale_report
            ,p_type             = r2_l1_sp_p_type
            ,p_tag              = r2_l1_sp_p_tag
        )

        # R2_L1
        r2_l1_qty               = 3
        r2_l1_price             = 3.3
        r2_l1_crv               = 3.3
        r2_l1_discount          = None
        r2_l1_non_product_name  = None
        r2_l1 = mommy.make(
             Receipt_ln
            ,receipt            = r2
            ,qty                = r2_l1_qty
            ,store_product      = r2_l1_sp
            ,price              = r2_l1_price
            ,crv                = r2_l1_crv
            ,discount           = r2_l1_discount
            ,non_product_name   = r2_l1_non_product_name
            ,is_taxable         = r2_l1_sp_is_taxable
            ,p_type             = r2_l1_sp_p_type
            ,p_tag              = r2_l1_sp_p_tag    
            ,cost               = None
            ,buydown            = None                    
        )


        # R2_L2_SP
        r2_l2_sp_name           = 'r2_l2_sp_name'
        r2_l2_sp_price          = 4.4
        r2_l2_sp_crv            = 4.4
        r2_l2_sp_is_taxable     = False
        r2_l2_sp_is_sale_report = True
        r2_l2_sp_p_type         = 'r2_l2_p_type'
        r2_l2_sp_p_tag          = None
        r2_l2_sp = mommy.make(
             Store_product
            ,store              = store
            ,name               = r2_l2_sp_name
            ,price              = r2_l2_sp_price
            ,crv                = r2_l2_sp_crv
            ,is_taxable         = r2_l2_sp_is_taxable
            ,is_sale_report     = r2_l2_sp_is_sale_report
            ,p_type             = r2_l2_sp_p_type
            ,p_tag              = r2_l2_sp_p_tag
        )

        # R2_L2
        r2_l2_qty               = 4
        r2_l2_price             = 4.4
        r2_l2_crv               = 4.4
        r2_l2_discount          = None
        r2_l2_non_product_name  = None
        r2_l2 = mommy.make(
             Receipt_ln
            ,receipt            = r2
            ,qty                = r2_l2_qty
            ,store_product      = r2_l2_sp
            ,price              = r2_l2_price
            ,crv                = r2_l2_crv
            ,discount           = r2_l2_discount
            ,non_product_name   = r2_l2_non_product_name
            ,is_taxable         = r2_l2_sp_is_taxable
            ,p_type             = r2_l2_sp_p_type
            ,p_tag              = r2_l2_sp_p_tag   
            ,cost               = None
            ,buydown            = None                        
        )

        #---------------------------------------------------------------
        #RUN TEST CODE
        # receipt_lst = []
        receipt_lst = list(Receipt.objects.filter(store_id=store.id).prefetch_related('receipt_ln_set'))
        report_dic = report_calculator.exe(receipt_lst)

        print(report_dic)

        #TAX
        self.assertTrue('tax' in report_dic)
        self.assertTrue(report_dic['tax'] , Decimal('28.6')) # 2 * ( 2.2 + 2.2 ) + 3 * ( 3.3 + 3.3 ) 
        
        #NON-TAX
        self.assertTrue('non_tax' in report_dic)
        self.assertTrue(report_dic['non_tax'] == Decimal('35.2'))
        
        #P_TYPE
        self.assertTrue(r2_l1_sp_p_type in report_dic)
        self.assertTrue(report_dic[r2_l1_sp_p_type] == Decimal('19.8'))

        #P_TYPE
        self.assertTrue(r2_l2_sp_p_type in report_dic)
        self.assertTrue(report_dic[r2_l2_sp_p_type] == Decimal('35.2'))

        #UNDEFINED
        self.assertTrue('undefined' in report_dic)
        self.assertTrue(report_dic['undefined'] == Decimal('8.8'))

        #NON PRODUCT NAME
        self.assertTrue(r1_l1_non_product_name in report_dic)
        self.assertTrue(report_dic[r1_l1_non_product_name] == Decimal('2.2'))











