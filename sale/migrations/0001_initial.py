# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Receipt'
        db.create_table(u'sale_receipt', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('time_stamp', self.gf('django.db.models.fields.IntegerField')()),
            ('collect_amount', self.gf('django.db.models.fields.DecimalField')(max_digits=6, decimal_places=2)),
            ('tax_rate', self.gf('django.db.models.fields.DecimalField')(max_digits=6, decimal_places=4)),
            ('store', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['store.Store'])),
        ))
        db.send_create_signal(u'sale', ['Receipt'])

        # Adding model 'Receipt_ln'
        db.create_table(u'sale_receipt_ln', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('receipt', self.gf('django.db.models.fields.related.ForeignKey')(related_name='receipt_ln_lst', to=orm['sale.Receipt'])),
        ))
        db.send_create_signal(u'sale', ['Receipt_ln'])


    def backwards(self, orm):
        # Deleting model 'Receipt'
        db.delete_table(u'sale_receipt')

        # Deleting model 'Receipt_ln'
        db.delete_table(u'sale_receipt_ln')


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
        u'sale.receipt': {
            'Meta': {'object_name': 'Receipt'},
            'collect_amount': ('django.db.models.fields.DecimalField', [], {'max_digits': '6', 'decimal_places': '2'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'store': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['store.Store']"}),
            'tax_rate': ('django.db.models.fields.DecimalField', [], {'max_digits': '6', 'decimal_places': '4'}),
            'time_stamp': ('django.db.models.fields.IntegerField', [], {})
        },
        u'sale.receipt_ln': {
            'Meta': {'object_name': 'Receipt_ln'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'receipt': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'receipt_ln_lst'", 'to': u"orm['sale.Receipt']"})
        },
        u'store.store': {
            'Meta': {'object_name': 'Store', '_ormbases': [u'bus.Business']},
            u'business_ptr': ('django.db.models.fields.related.OneToOneField', [], {'to': u"orm['bus.Business']", 'unique': 'True', 'primary_key': 'True'}),
            'tax_rate': ('django.db.models.fields.DecimalField', [], {'max_digits': '5', 'decimal_places': '3'})
        },
        u'vendor.vendor': {
            'Meta': {'object_name': 'Vendor', '_ormbases': [u'bus.Business']},
            u'business_ptr': ('django.db.models.fields.related.OneToOneField', [], {'to': u"orm['bus.Business']", 'unique': 'True', 'primary_key': 'True'}),
            'creator': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['store.Store']", 'null': 'True', 'blank': 'True'}),
            'is_approved': ('django.db.models.fields.BooleanField', [], {'default': 'False'})
        }
    }

    complete_apps = ['sale']