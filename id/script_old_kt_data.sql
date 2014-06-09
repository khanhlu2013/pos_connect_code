select product.pid,sku.sku,CONCAT(product.name,' ',product.size),latest_layer.price,crv/pack,productoption.istaxable,product.cat,product.dep,(case_ - disc)/(pack*convertnum)
from latest_layer 
join product on latest_layer.pid = product.pid
join sku on sku.pid = latest_layer.pid
join productoption on latest_layer.store = productoption.store and latest_layer.pid = productoption.pid
where latest_layer.store = 15 