# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Deleting model 'Receipt_ln'
        db.delete_table(u'sale_receipt_ln')

        # Deleting model 'Receipt'
        db.delete_table(u'sale_receipt')


    def backwards(self, orm):
        # Adding model 'Receipt_ln'
        db.create_table(u'sale_receipt_ln', (
            ('price', self.gf('django.db.models.fields.DecimalField')(max_digits=6, decimal_places=2)),
            ('receipt', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['sale.Receipt'])),
            ('store_product', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['store_product.Store_product'], null=True, blank=True)),
            ('qty', self.gf('django.db.models.fields.IntegerField')()),
            ('discount', self.gf('django.db.models.fields.DecimalField')(null=True, max_digits=6, decimal_places=2, blank=True)),
            ('cost', self.gf('django.db.models.fields.DecimalField')(null=True, max_digits=6, decimal_places=2, blank=True)),
            ('discount_mm_deal', self.gf('django.db.models.fields.DecimalField')(null=True, max_digits=6, decimal_places=2, blank=True)),
            ('p_tag', self.gf('django.db.models.fields.CharField')(max_length=100, null=True, blank=True)),
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('crv', self.gf('django.db.models.fields.DecimalField')(null=True, max_digits=6, decimal_places=3, blank=True)),
            ('p_type', self.gf('django.db.models.fields.CharField')(max_length=100, null=True, blank=True)),
            ('buydown', self.gf('django.db.models.fields.DecimalField')(null=True, max_digits=6, decimal_places=2, blank=True)),
            ('non_product_name', self.gf('django.db.models.fields.CharField')(max_length=30, null=True, blank=True)),
            ('is_taxable', self.gf('django.db.models.fields.BooleanField')()),
        ))
        db.send_create_signal(u'sale', ['Receipt_ln'])

        # Adding model 'Receipt'
        db.create_table(u'sale_receipt', (
            ('_receipt_doc_id', self.gf('django.db.models.fields.CharField')(max_length=40, unique=True)),
            ('tax_rate', self.gf('django.db.models.fields.DecimalField')(max_digits=6, decimal_places=4)),
            ('time_stamp', self.gf('django.db.models.fields.DateTimeField')()),
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('store', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['store.Store'])),
            ('collect_amount', self.gf('django.db.models.fields.DecimalField')(max_digits=6, decimal_places=2)),
        ))
        db.send_create_signal(u'sale', ['Receipt'])


    models = {
        
    }

    complete_apps = ['sale']