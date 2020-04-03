module.exports = function Cart(cart) {
    this.items = cart.items || {};
    this.totalItems = cart.totalItems || 0;
    this.totalPrice = cart.totalPrice || 0;

    this.add = function (item, id) {
        var cartItem = this.items[id];
        if (!cartItem) {
            cartItem = this.items[id] = { item: item, quantity: 0, price: 0 };
        }
        cartItem.quantity = item.quantity;
        cartItem.price = cartItem.item.price * cartItem.quantity;
        this.totalItems++;
        this.totalPrice += cartItem.price;
        console.log("CART ", this);
    };

    this.remove = function (id) {
        this.totalItems -= 1;
        this.totalPrice -= this.items[id].price;
        delete this.items[id];
    };

    this.update = function (item, id) {
        cartItem = this.items[id] = { item: item, quantity: item.quantity, price: item.price };
    }

    this.getItems = function () {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };
};