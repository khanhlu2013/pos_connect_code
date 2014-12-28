# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding field 'Store.display_is_report'
        db.add_column(u'store_store', 'display_is_report',
                      self.gf('django.db.models.fields.BooleanField')(default=True),
                      keep_default=False)

        # Adding field 'Store.display_type'
        db.add_column(u'store_store', 'display_type',
                      self.gf('django.db.models.fields.BooleanField')(default=True),
                      keep_default=False)

        # Adding field 'Store.display_tag'
        db.add_column(u'store_store', 'display_tag',
                      self.gf('django.db.models.fields.BooleanField')(default=True),
                      keep_default=False)

        # Adding field 'Store.display_group'
        db.add_column(u'store_store', 'display_group',
                      self.gf('django.db.models.fields.BooleanField')(default=True),
                      keep_default=False)

        # Adding field 'Store.display_deal'
        db.add_column(u'store_store', 'display_deal',
                      self.gf('django.db.models.fields.BooleanField')(default=True),
                      keep_default=False)

        # Adding field 'Store.display_vendor'
        db.add_column(u'store_store', 'display_vendor',
                      self.gf('django.db.models.fields.BooleanField')(default=True),
                      keep_default=False)

        # Adding field 'Store.display_buydown'
        db.add_column(u'store_store', 'display_buydown',
                      self.gf('django.db.models.fields.BooleanField')(default=True),
                      keep_default=False)

        # Adding field 'Store.display_vc_price'
        db.add_column(u'store_store', 'display_vc_price',
                      self.gf('django.db.models.fields.BooleanField')(default=True),
                      keep_default=False)

        # Adding field 'Store.display_stock'
        db.add_column(u'store_store', 'display_stock',
                      self.gf('django.db.models.fields.BooleanField')(default=True),
                      keep_default=False)


    def backwards(self, orm):
        # Deleting field 'Store.display_is_report'
        db.delete_column(u'store_store', 'display_is_report')

        # Deleting field 'Store.display_type'
        db.delete_column(u'store_store', 'display_type')

        # Deleting field 'Store.display_tag'
        db.delete_column(u'store_store', 'display_tag')

        # Deleting field 'Store.display_group'
        db.delete_column(u'store_store', 'display_group')

        # Deleting field 'Store.display_deal'
        db.delete_column(u'store_store', 'display_deal')

        # Deleting field 'Store.display_vendor'
        db.delete_column(u'store_store', 'display_vendor')

        # Deleting field 'Store.display_buydown'
        db.delete_column(u'store_store', 'display_buydown')

        # Deleting field 'Store.display_vc_price'
        db.delete_column(u'store_store', 'display_vc_price')

        # Deleting field 'Store.display_stock'
        db.delete_column(u'store_store', 'display_stock')


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
            'phone': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
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
        u'store.store': {
            'Meta': {'object_name': 'Store', '_ormbases': [u'bus.Business']},
            'api_key_name': ('django.db.models.fields.CharField', [], {'max_length': '25', 'blank': 'True'}),
            'api_key_pwrd': ('django.db.models.fields.CharField', [], {'max_length': '25', 'blank': 'True'}),
            u'business_ptr': ('django.db.models.fields.related.OneToOneField', [], {'to': u"orm['bus.Business']", 'unique': 'True', 'primary_key': 'True'}),
            'couch_admin_name': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'couch_admin_pwrd': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'couch_url': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'display_buydown': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'display_deal': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'display_group': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'display_is_report': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'display_stock': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'display_tag': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'display_type': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'display_vc_price': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'display_vendor': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'tax_rate': ('django.db.models.fields.DecimalField', [], {'max_digits': '5', 'decimal_places': '3'})
        }
    }

    complete_apps = ['store']