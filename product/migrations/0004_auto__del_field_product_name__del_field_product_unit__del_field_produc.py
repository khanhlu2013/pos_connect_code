# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Deleting field 'Product.name'
        db.delete_column(u'product_product', 'name')

        # Deleting field 'Product.unit'
        db.delete_column(u'product_product', 'unit_id')

        # Deleting field 'Product.size'
        db.delete_column(u'product_product', 'size')

        # Adding field 'Product._name_admin'
        db.add_column(u'product_product', '_name_admin',
                      self.gf('django.db.models.fields.CharField')(max_length=255, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Product._size_admin'
        db.add_column(u'product_product', '_size_admin',
                      self.gf('django.db.models.fields.CharField')(max_length=10, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Product._unit_admin'
        db.add_column(u'product_product', '_unit_admin',
                      self.gf('django.db.models.fields.related.ForeignKey')(to=orm['product.Unit'], null=True, blank=True),
                      keep_default=False)


    def backwards(self, orm):
        # Adding field 'Product.name'
        db.add_column(u'product_product', 'name',
                      self.gf('django.db.models.fields.CharField')(max_length=255, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Product.unit'
        db.add_column(u'product_product', 'unit',
                      self.gf('django.db.models.fields.related.ForeignKey')(to=orm['product.Unit'], null=True, blank=True),
                      keep_default=False)

        # Adding field 'Product.size'
        db.add_column(u'product_product', 'size',
                      self.gf('django.db.models.fields.CharField')(max_length=10, null=True, blank=True),
                      keep_default=False)

        # Deleting field 'Product._name_admin'
        db.delete_column(u'product_product', '_name_admin')

        # Deleting field 'Product._size_admin'
        db.delete_column(u'product_product', '_size_admin')

        # Deleting field 'Product._unit_admin'
        db.delete_column(u'product_product', '_unit_admin_id')


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
            'groups': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['auth.Group']", 'symmetrical': 'False', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'is_staff': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'is_superuser': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'last_login': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'last_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'password': ('django.db.models.fields.CharField', [], {'max_length': '128'}),
            'user_permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'}),
            'username': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '30'})
        },
        u'bus.business': {
            'Meta': {'object_name': 'Business'},
            'city': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '255'}),
            'state': ('django.db.models.fields.CharField', [], {'max_length': '2', 'blank': 'True'}),
            'street': ('django.db.models.fields.CharField', [], {'max_length': '255', 'blank': 'True'}),
            'sub_vendors': ('django.db.models.fields.related.ManyToManyField', [], {'blank': 'True', 'related_name': "'sub_stores'", 'null': 'True', 'symmetrical': 'False', 'to': u"orm['vendor.Vendor']"}),
            'user_lst': ('django.db.models.fields.related.ManyToManyField', [], {'related_name': "'business_lst'", 'symmetrical': 'False', 'through': u"orm['liqUser.Membership']", 'to': u"orm['auth.User']"}),
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
        u'product.category': {
            'Meta': {'unique_together': "(('creator', 'name'),)", 'object_name': 'Category'},
            'creator': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['bus.Business']", 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '30'})
        },
        u'product.department': {
            'Meta': {'unique_together': "(('category', 'name'),)", 'object_name': 'Department'},
            'category': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['product.Category']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '30'})
        },
        u'product.prodskuassoc': {
            'Meta': {'unique_together': "(('sku', 'product'),)", 'object_name': 'ProdSkuAssoc'},
            'creator': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['bus.Business']", 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_approve_override': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'product': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['product.Product']"}),
            'sku': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['product.Sku']"}),
            'store_product_lst': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['store_product.Store_product']", 'symmetrical': 'False'})
        },
        u'product.product': {
            'Meta': {'object_name': 'Product'},
            '_name_admin': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            '_size_admin': ('django.db.models.fields.CharField', [], {'max_length': '10', 'null': 'True', 'blank': 'True'}),
            '_unit_admin': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['product.Unit']", 'null': 'True', 'blank': 'True'}),
            'bus_lst': ('django.db.models.fields.related.ManyToManyField', [], {'related_name': "'private_prod_lst'", 'symmetrical': 'False', 'through': u"orm['store_product.Store_product']", 'to': u"orm['bus.Business']"}),
            'creator': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'created_prod_lst'", 'null': 'True', 'to': u"orm['bus.Business']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_approve_override': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'sku_lst': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['product.Sku']", 'through': u"orm['product.ProdSkuAssoc']", 'symmetrical': 'False'}),
            'temp_name': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'})
        },
        u'product.sku': {
            'Meta': {'object_name': 'Sku'},
            'creator': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['bus.Business']", 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_approved': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'sku': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '30'})
        },
        u'product.unit': {
            'Meta': {'object_name': 'Unit'},
            'abbreviate': ('django.db.models.fields.CharField', [], {'max_length': '20'}),
            'creator': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['bus.Business']", 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_approved': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        u'store.store': {
            'Meta': {'object_name': 'Store', '_ormbases': [u'bus.Business']},
            u'business_ptr': ('django.db.models.fields.related.OneToOneField', [], {'to': u"orm['bus.Business']", 'unique': 'True', 'primary_key': 'True'}),
            'tax_rate': ('django.db.models.fields.DecimalField', [], {'max_digits': '5', 'decimal_places': '3'})
        },
        u'store_product.store_product': {
            'Meta': {'unique_together': "(('product', 'business'),)", 'object_name': 'Store_product'},
            'business': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['bus.Business']"}),
            'crv': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '5', 'decimal_places': '3', 'blank': 'True'}),
            'department': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['product.Department']", 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'isSaleReport': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'isTaxReport': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'isTaxable': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'price': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '6', 'decimal_places': '2', 'blank': 'True'}),
            'product': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['product.Product']"})
        },
        u'vendor.vendor': {
            'Meta': {'object_name': 'Vendor', '_ormbases': [u'bus.Business']},
            u'business_ptr': ('django.db.models.fields.related.OneToOneField', [], {'to': u"orm['bus.Business']", 'unique': 'True', 'primary_key': 'True'}),
            'creator': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['store.Store']", 'null': 'True', 'blank': 'True'}),
            'is_approved': ('django.db.models.fields.BooleanField', [], {'default': 'False'})
        }
    }

    complete_apps = ['product']