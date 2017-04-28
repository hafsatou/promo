module.exports = function Cart(oldCart) {
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    this.add = function(item, id) {
        var storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = {item: item, qty: 0, price: 0};
        }
        storedItem.qty++;
        if(storedItem.item.promo){

            storedItem.price = storedItem.item.promo_price * storedItem.qty;
            this.totalPrice += storedItem.item.promo_price;
        } else {
            storedItem.price = storedItem.item.price * storedItem.qty;
            this.totalPrice += storedItem.item.price;
        }
        this.totalQty++;
    };

    this.reduceByOne = function(id) {
        this.items[id].qty--;
        if(this.items[id].promo) {
            this.items[id].price -= this.items[id].item.promo_price;
            this.totalPrice -= this.items[id].item.promo_price;
        } else {
            this.items[id].price -= this.items[id].item.price;
            this.totalPrice -= this.items[id].item.price;
        }
        this.totalQty--;

        if (this.items[id].qty <= 0) {
            delete this.items[id];
        }
    };

    this.removeItem = function(id) {
        this.totalQty -= this.items[id].qty;
        if(this.items[id].promo) {
            this.totalPrice -= this.items[id].promo_price;
        } else {
            this.totalPrice -= this.items[id].price;
        }
        delete this.items[id];
    };
    
    this.generateArray = function() {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };
};