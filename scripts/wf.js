define(['cmn'], function(Common) {
    var cmn = new Common();

    function WidgetFactory() {
        var wf = this;

        wf.ASDBItem = function (anItem, aContainer) {
            var itemPanel = cmn.createElement("div", "panel panel-primary " + (anItem.item_color ? " color " + anItem.item_color : ""), aContainer);
            var itemContent = cmn.createElement("div", "panel-body", itemPanel);
            var itemDesc = cmn.createElement("h3", "item-desc", itemContent);
            var itemCost = cmn.createElement("h1", "item-cost", itemContent);
            var limit = cmn.createElement("div", "item-limit", itemContent);

            itemCost.innerHTML = anItem.item_cost;
            itemDesc.innerHTML = anItem.item_name;
        };


        wf.ASOrderItem = function (anItem, aContainer) {
            var container = aContainer ? aContainer : orderList.oliContainer;
            var divEl = cmn.getElement("div", "orderItem", container);
            var itemName = cmn.getElement("h4", "itemName", divEl);
            var itemCount = cmn.getElement("h4", "itemCount", divEl);

            this.updateText = this.show = function () {
                itemName.innerHTML = anItem.item_name;
                itemCount.innerHTML = anItem.quantity + ' '
                    + (anItem.measure ? anItem.measure : 'шт')
                    + ' x ' + (+anItem.price).toFixed(2) + " р."
                    + ' = ' + (+anItem.cost).toFixed(2) + " р.";
            };

            this.show();
        };

        wf.ASOrderSum = function (aSum, aContainer) {
            var summ = cmn.getElement("h2", "summ", aContainer);

            this.updateText = this.show = function () {
                summ.innerHTML = 'Итог: ' + aSum + 'рублей';
            };

            this.show();
        };

        wf.ASMessage = function (aMsg, aContainer) {

            this.update = this.show = function () {
                aContainer.innerHTML = aMsg;
            };

            this.show();
        }

    }

    return WidgetFactory;
});
