# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Deleting field 'Receipt_ln.price'
        db.delete_column(u'receipt_receipt_ln', 'price')

        # Deleting field 'Receipt_ln.store_product'
        db.delete_column(u'receipt_receipt_ln', 'store_product_id')

        # Deleting field 'Receipt_ln.cost'
        db.delete_column(u'receipt_receipt_ln', 'cost')

        # Deleting field 'Receipt_ln.discount_mm_deal'
        db.delete_column(u'receipt_receipt_ln', 'discount_mm_deal')

        # Deleting field 'Receipt_ln.p_tag'
        db.delete_column(u'receipt_receipt_ln', 'p_tag')

        # Deleting field 'Receipt_ln.crv'
        db.delete_column(u'receipt_receipt_ln', 'crv')

        # Deleting field 'Receipt_ln.p_type'
        db.delete_column(u'receipt_receipt_ln', 'p_type')

        # Deleting field 'Receipt_ln.buydown'
        db.delete_column(u'receipt_receipt_ln', 'buydown')

        # Deleting field 'Receipt_ln.non_product_name'
        db.delete_column(u'receipt_receipt_ln', 'non_product_name')

        # Deleting field 'Receipt_ln.is_taxable'
        db.delete_column(u'receipt_receipt_ln', 'is_taxable')

        # Adding field 'Receipt_ln.override_price'
        db.add_column(u'receipt_receipt_ln', 'override_price',
                      self.gf('django.db.models.fields.DecimalField')(null=True, max_digits=6, decimal_places=3, blank=True),
                      keep_default=False)

        # Adding field 'Receipt_ln.date'
        db.add_column(u'receipt_receipt_ln', 'date',
                      self.gf('django.db.models.fields.DateTimeField')(default=datetime.datetime(2014, 9, 26, 0, 0)),
                      keep_default=False)

        # Adding field 'Receipt_ln.sp_stamp_name'
        db.add_column(u'receipt_receipt_ln', 'sp_stamp_name',
                      self.gf('django.db.models.fields.CharField')(max_length=100, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Receipt_ln.sp_stamp_price'
        db.add_column(u'receipt_receipt_ln', 'sp_stamp_price',
                      self.gf('django.db.models.fields.DecimalField')(null=True, max_digits=6, decimal_places=2, blank=True),
                      keep_default=False)

        # Adding field 'Receipt_ln.sp_stamp_value_customer_price'
        db.add_column(u'receipt_receipt_ln', 'sp_stamp_value_customer_price',
                      self.gf('django.db.models.fields.DecimalField')(null=True, max_digits=6, decimal_places=2, blank=True),
                      keep_default=False)

        # Adding field 'Receipt_ln.sp_stamp_crv'
        db.add_column(u'receipt_receipt_ln', 'sp_stamp_crv',
                      self.gf('django.db.models.fields.DecimalField')(null=True, max_digits=6, decimal_places=2, blank=True),
                      keep_default=False)

        # Adding field 'Receipt_ln.sp_stamp_is_taxable'
        db.add_column(u'receipt_receipt_ln', 'sp_stamp_is_taxable',
                      self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True),
                      keep_default=False)

        # Adding field 'Receipt_ln.sp_stamp_p_type'
        db.add_column(u'receipt_receipt_ln', 'sp_stamp_p_type',
                      self.gf('django.db.models.fields.CharField')(max_length=100, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Receipt_ln.sp_stamp_p_tag'
        db.add_column(u'receipt_receipt_ln', 'sp_stamp_p_tag',
                      self.gf('django.db.models.fields.CharField')(max_length=100, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Receipt_ln.sp_stamp_cost'
        db.add_column(u'receipt_receipt_ln', 'sp_stamp_cost',
                      self.gf('django.db.models.fields.DecimalField')(null=True, max_digits=6, decimal_places=2, blank=True),
                      keep_default=False)

        # Adding field 'Receipt_ln.sp_stamp_vendor'
        db.add_column(u'receipt_receipt_ln', 'sp_stamp_vendor',
                      self.gf('django.db.models.fields.CharField')(max_length=100, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Receipt_ln.sp_stamp_buydown'
        db.add_column(u'receipt_receipt_ln', 'sp_stamp_buydown',
                      self.gf('django.db.models.fields.DecimalField')(null=True, max_digits=6, decimal_places=2, blank=True),
                      keep_default=False)

        # Adding field 'Receipt_ln.mm_deal_discount'
        db.add_column(u'receipt_receipt_ln', 'mm_deal_discount',
                      self.gf('django.db.models.fields.DecimalField')(null=True, max_digits=6, decimal_places=2, blank=True),
                      keep_default=False)

        # Adding field 'Receipt_ln.mm_deal_name'
        db.add_column(u'receipt_receipt_ln', 'mm_deal_name',
                      self.gf('django.db.models.fields.CharField')(max_length=100, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Receipt_ln.non_inventory_name'
        db.add_column(u'receipt_receipt_ln', 'non_inventory_name',
                      self.gf('django.db.models.fields.CharField')(max_length=100, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Receipt_ln.non_inventory_price'
        db.add_column(u'receipt_receipt_ln', 'non_inventory_price',
                      self.gf('django.db.models.fields.DecimalField')(null=True, max_digits=6, decimal_places=2, blank=True),
                      keep_default=False)


    def backwards(self, orm):

        # User chose to not deal with backwards NULL issues for 'Receipt_ln.price'
        raise RuntimeError("Cannot reverse this migration. 'Receipt_ln.price' and its values cannot be restored.")
        
        # The following code is provided here to aid in writing a correct migration        # Adding field 'Receipt_ln.price'
        db.add_column(u'receipt_receipt_ln', 'price',
                      self.gf('django.db.models.fields.DecimalField')(max_digits=6, decimal_places=2),
                      keep_default=False)

        # Adding field 'Receipt_ln.store_product'
        db.add_column(u'receipt_receipt_ln', 'store_product',
                      self.gf('django.db.models.fields.related.ForeignKey')(to=orm['store_product.Store_product'], null=True, blank=True),
                      keep_default=False)

        # Adding field 'Receipt_ln.cost'
        db.add_column(u'receipt_receipt_ln', 'cost',
                      self.gf('django.db.models.fields.DecimalField')(null=True, max_digits=6, decimal_places=2, blank=True),
                      keep_default=False)

        # Adding field 'Receipt_ln.discount_mm_deal'
        db.add_column(u'receipt_receipt_ln', 'discount_mm_deal',
                      self.gf('django.db.models.fields.DecimalField')(null=True, max_digits=6, decimal_places=2, blank=True),
                      keep_default=False)

        # Adding field 'Receipt_ln.p_tag'
        db.add_column(u'receipt_receipt_ln', 'p_tag',
                      self.gf('django.db.models.fields.CharField')(max_length=100, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Receipt_ln.crv'
        db.add_column(u'receipt_receipt_ln', 'crv',
                      self.gf('django.db.models.fields.DecimalField')(null=True, max_digits=6, decimal_places=3, blank=True),
                      keep_default=False)

        # Adding field 'Receipt_ln.p_type'
        db.add_column(u'receipt_receipt_ln', 'p_type',
                      self.gf('django.db.models.fields.CharField')(max_length=100, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Receipt_ln.buydown'
        db.add_column(u'receipt_receipt_ln', 'buydown',
                      self.gf('django.db.models.fields.DecimalField')(null=True, max_digits=6, decimal_places=2, blank=True),
                      keep_default=False)

        # Adding field 'Receipt_ln.non_product_name'
        db.add_column(u'receipt_receipt_ln', 'non_product_name',
                      self.gf('django.db.models.fields.CharField')(max_length=30, null=True, blank=True),
                      keep_default=False)


        # User chose to not deal with backwards NULL issues for 'Receipt_ln.is_taxable'
        raise RuntimeError("Cannot reverse this migration. 'Receipt_ln.is_taxable' and its values cannot be restored.")
        
        # The following code is provided here to aid in writing a correct migration        # Adding field 'Receipt_ln.is_taxable'
        db.add_column(u'receipt_receipt_ln', 'is_taxable',
                      self.gf('django.db.models.fields.BooleanField')(),
                      keep_default=False)

        # Deleting field 'Receipt_ln.override_price'
        db.delete_column(u'receipt_receipt_ln', 'override_price')

        # Deleting field 'Receipt_ln.date'
        db.delete_column(u'receipt_receipt_ln', 'date')

        # Deleting field 'Receipt_ln.sp_stamp_name'
        db.delete_column(u'receipt_receipt_ln', 'sp_stamp_name')

        # Deleting field 'Receipt_ln.sp_stamp_price'
        db.delete_column(u'receipt_receipt_ln', 'sp_stamp_price')

        # Deleting field 'Receipt_ln.sp_stamp_value_customer_price'
        db.delete_column(u'receipt_receipt_ln', 'sp_stamp_value_customer_price')

        # Deleting field 'Receipt_ln.sp_stamp_crv'
        db.delete_column(u'receipt_receipt_ln', 'sp_stamp_crv')

        # Deleting field 'Receipt_ln.sp_stamp_is_taxable'
        db.delete_column(u'receipt_receipt_ln', 'sp_stamp_is_taxable')

        # Deleting field 'Receipt_ln.sp_stamp_p_type'
        db.delete_column(u'receipt_receipt_ln', 'sp_stamp_p_type')

        # Deleting field 'Receipt_ln.sp_stamp_p_tag'
        db.delete_column(u'receipt_receipt_ln', 'sp_stamp_p_tag')

        # Deleting field 'Receipt_ln.sp_stamp_cost'
        db.delete_column(u'receipt_receipt_ln', 'sp_stamp_cost')

        # Deleting field 'Receipt_ln.sp_stamp_vendor'
        db.delete_column(u'receipt_receipt_ln', 'sp_stamp_vendor')

        # Deleting field 'Receipt_ln.sp_stamp_buydown'
        db.delete_column(u'receipt_receipt_ln', 'sp_stamp_buydown')

        # Deleting field 'Receipt_ln.mm_deal_discount'
        db.delete_column(u'receipt_receipt_ln', 'mm_deal_discount')

        # Deleting field 'Receipt_ln.mm_deal_name'
        db.delete_column(u'receipt_receipt_ln', 'mm_deal_name')

        # Deleting field 'Receipt_ln.non_inventory_name'
        db.delete_column(u'receipt_receipt_ln', 'non_inventory_name')

        # Deleting field 'Receipt_ln.non_inventory_price'
        db.delete_column(u'receipt_receipt_ln', 'non_inventory_price')


    models = {
        u'auth.group': {
            'Meta': {'object_name': 'Group'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '80'}),
            'permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'})
        },
        u'auth.permission': {
            'Meta': {'ordering': "(u'content_type__app_label', u'content_type__model', u'codename')", 'unique_together': "((u'content_type', u'codename'),)", 'object_name': 'Permission'},
            'codename': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'content_type': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['contenttypes.ContentType']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        u'auth.user': {
            'Meta': {'object_name': 'User'},
            'date_joined': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'email': ('django.db.models.fields.EmailField', [], {'max_length': '75', 'blank': 'True'}),
            'first_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'groups': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'related_name': "u'user_set'", 'blank': 'True', 'to': u"orm['auth.Group']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'is_staff': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'is_superuser': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'last_login': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'last_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'password': ('django.db.models.fields.CharField', [], {'max_length': '128'}),
            'user_permissions': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'related_name': "u'user_set'", 'blank': 'True', 'to': u"orm['auth.Permission']"}),
            'username': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '30'})
        },
        u'bus.business': {
            'Meta': {'object_name': 'Business'},
            'city': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'state': ('django.db.models.fields.CharField', [], {'max_length': '2', 'blank': 'True'}),
            'street': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'user_set': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['auth.User']", 'through': u"orm['liqUser.Membership']", 'symmetrical': 'False'}),
            'zip_code': ('django.db.models.fields.IntegerField', [], {'max_length': '5', 'null': 'True', 'blank': 'True'})
        },
        u'contenttypes.contenttype': {
            'Meta': {'ordering': "('name',)", 'unique_together': "(('app_label', 'model'),)", 'object_name': 'ContentType', 'db_table': "'django_content_type'"},
            'app_label': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'model': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        u'liqUser.membership': {
            'Meta': {'object_name': 'Membership'},
            'business': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['bus.Business']"}),
            'date_join': ('django.db.models.fields.DateField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'user': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['auth.User']"})
        },
        u'payment_type.payment_type': {
            'Meta': {'object_name': 'Payment_type'},
            'active': ('django.db.models.fields.BooleanField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '100'}),
            'sort': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'store': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['store.Store']"})
        },
        u'receipt.receipt': {
            'Meta': {'object_name': 'Receipt'},
            '_receipt_doc_id': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '40'}),
            'date': ('django.db.models.fields.DateTimeField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'store': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['store.Store']"}),
            'tax_rate': ('django.db.models.fields.DecimalField', [], {'max_digits': '6', 'decimal_places': '4'})
        },
        u'receipt.receipt_ln': {
            'Meta': {'object_name': 'Receipt_ln'},
            'date': ('django.db.models.fields.DateTimeField', [], {}),
            'discount': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '6', 'decimal_places': '2', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'mm_deal_discount': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '6', 'decimal_places': '2', 'blank': 'True'}),
            'mm_deal_name': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'non_inventory_name': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'non_inventory_price': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '6', 'decimal_places': '2', 'blank': 'True'}),
            'override_price': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '6', 'decimal_places': '3', 'blank': 'True'}),
            'qty': ('django.db.models.fields.IntegerField', [], {}),
            'receipt': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['receipt.Receipt']"}),
            'sp_stamp_buydown': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '6', 'decimal_places': '2', 'blank': 'True'}),
            'sp_stamp_cost': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '6', 'decimal_places': '2', 'blank': 'True'}),
            'sp_stamp_crv': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '6', 'decimal_places': '2', 'blank': 'True'}),
            'sp_stamp_is_taxable': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'sp_stamp_name': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'sp_stamp_p_tag': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'sp_stamp_p_type': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'sp_stamp_price': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '6', 'decimal_places': '2', 'blank': 'True'}),
            'sp_stamp_value_customer_price': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '6', 'decimal_places': '2', 'blank': 'True'}),
            'sp_stamp_vendor': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'})
        },
        u'receipt.tender_ln': {
            'Meta': {'object_name': 'Tender_ln'},
            'amount': ('django.db.models.fields.DecimalField', [], {'max_digits': '6', 'decimal_places': '2'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'payment_type': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['payment_type.Payment_type']", 'null': 'True', 'blank': 'True'}),
            'receipt': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['receipt.Receipt']"})
        },
        u'store.store': {
            'Meta': {'object_name': 'Store', '_ormbases': [u'bus.Business']},
            'api_key_name': ('django.db.models.fields.CharField', [], {'max_length': '25', 'blank': 'True'}),
            'api_key_pwrd': ('django.db.models.fields.CharField', [], {'max_length': '25', 'blank': 'True'}),
            u'business_ptr': ('django.db.models.fields.related.OneToOneField', [], {'to': u"orm['bus.Business']", 'unique': 'True', 'primary_key': 'True'}),
            'tax_rate': ('django.db.models.fields.DecimalField', [], {'max_digits': '5', 'decimal_places': '3'})
        }
    }

    complete_apps = ['receipt']