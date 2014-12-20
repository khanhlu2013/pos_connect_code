import psycopg2
import pyodbc

#Export Sale 2 Access - aka export cur_stock to microsft access
"""
    . _get_cur_qty_data()
        . pycdbc_api.exe('select cur_qty from store_product where store_id = 17 and cur_qty != 0')
        . return_correct_format_xxx

    . _write_2_access_table(cur_qty_lst):
        . pyodbc_api.exe('CREATE TABLE inventory_cur_sale(sku varchar(30), qty integer)')
        . pyodbc_api.executemany("insert into inventory_cur_sale(sku, qty) values (?, ?)", cur_qty_lst)

    . _exe_import_script(): pyodbc_api
        . pyodbc_api.exe(item_number_query)
        . pyodbc_api.exe(alternative_sku_query)

    . _cleanup_cur_qty() python_db_api
        pycdbc_api.exe('update store_product set cur_qty = 0 where store_id = 17')

"""

STORE_ID = 17

def exe():
    #post
    post_con = psycopg2.connect(host="ec2-54-83-204-85.compute-1.amazonaws.com", port="5432", database="d20f3jt7rhhrjr", user="jeshirdagnztwa", password="1XQqauwNaGho-SW3tDYljzxDA4") 
    post_cursor = post_con.cursor()

    #access
    ACCESS_DATABASE_FILE = 'mdb.accdb'
    access_con = pyodbc.connect('DRIVER={Microsoft Access Driver (*.mdb, *.accdb)};DBQ=%s;' % ACCESS_DATABASE_FILE)
    access_cursor = access_con.cursor()

    cur_qty_lst = _get_cur_qty_data(post_cursor) #cur_qty_lst[(sku,qty),]
    _write_2_access_table(cur_qty_lst,access_cursor)
    _exe_import_script(access_cursor)
    _cleanup_cur_qty(post_con)

    post_con.commit()
    post_cursor.close()
    post_con.close()

    access_cursor.commit()
    access_cursor.close()
    access_con.close()

# -------------------------------------

def _get_cur_qty_data(post_cursor):
    sql = """
        select 
             DISTINCT ON(store_product_store_product.id)
             store_product_store_product.cur_stock
            ,product_sku.sku

        from
            store_product_store_product

        join product_product on
            store_product_store_product.product_id = product_product.id

        join product_prodskuassoc on 
            product_product.id = product_prodskuassoc.product_id

        join product_prodskuassoc_store_product_set on
            product_prodskuassoc_store_product_set.prodskuassoc_id = product_prodskuassoc.id

        join product_sku on 
            product_prodskuassoc.sku_id = product_sku.id

        where store_product_store_product.store_id = %s""" % STORE_ID

    post_cursor.execute(sql)
    return post_cursor.fetchmany()


def _write_2_access_table(cur_qty_lst,access_cursor):
    access_cursor.execute('CREATE TABLE inventory_cur_sale(sku varchar(30), qty integer)')
    access_cursor.executemany("insert into inventory_cur_sale(sku, qty) values (?, ?)", cur_qty_lst)    


def _exe_import_script(access_cursor):
    item_number_script = 'xxx'
    alternative_sku_script = 'xxx'
    access_cursor.execute(item_number_script)
    access_cursor.execute(alternative_sku_script)

def _cleanup_cur_qty(post_con):
    sql = """
        update store_product_store_product set cur_stock = 0 where store_id = %s
    """ % STORE_ID
    post_con.execute(sql)