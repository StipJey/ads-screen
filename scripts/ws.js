/**
 * Created by Work on 24.09.2015.
 */
define(['esm', 'wf', 'cmn', 'config'], function (EasyStateMachine, WidgetFactory, Common, cfg) {

    function AdsScreen() {

        var wf = new WidgetFactory();
        var cmn = new Common();
        var webSocket = null;

        var sm, states = {
            closed: {},
            standby: {},
            order_process: {},
            payment: {}
        };

        var container = document.getElementById("container");
        var messageContainer, carouselContainer, orderItemsContainer, orderSumContainer;

        /*
         * State CLOSED
         */
        states.closed.init = function () {
            messageContainer = cmn.getElement('div', '', container, 'message');
            carouselContainer = cmn.getElement('div', '', container, 'carousel');
        };

        states.closed.entry = function () {
            $(messageContainer).show();
            $(carouselContainer).show();
            messageContainer.innerHTML = 'Перерыв на обед';
            carouselContainer.innerHTML = '';
        };

        states.closed.exit = function () {
            $(messageContainer).hide();
            $(carouselContainer).hide();
        };

        /*
         * state STANDBY
         */

        states.standby.init = function () {
            messageContainer = cmn.getElement('div', '', container, 'message');
            carouselContainer = cmn.getElement('div', '', container, 'carousel');
        };

        states.standby.entry = function (data) {
            $(messageContainer).show();
            $(carouselContainer).show();
            messageContainer.innerHTML = 'Добро пожаловать';
            carouselContainer.innerHTML = '';

            for (var item in data) {
                wf.ASDBItem(data[item], carouselContainer);
            }
        };

        states.standby.exit = function () {
            $(messageContainer).hide();
            $(carouselContainer).hide();
        };

        /*
         * state ORDER_PROCESS
         */
        states.order_process.init = function () {
            messageContainer = cmn.getElement('div', '', container, 'message');
            carouselContainer = cmn.getElement('div', '', container, 'carousel');
        };

        states.order_process.entry = function (aData) {
            $(messageContainer).show();
            $(carouselContainer).show();

        };

        states.order_process.exit = function () {
            $(messageContainer).hide();
            $(carouselContainer).hide();
            messageContainer.innerHTML = '';
            carouselContainer.innerHTML = '';

        };

        /*
         * state PAYMENT
         */

        states.payment.init = function () {
            orderItemsContainer = cmn.getElement('div', '', container, 'orderItems');
            orderSumContainer = cmn.getElement('div', '', container, 'orderSum');
        };

        states.payment.entry = function (aData) {
            $(orderItemsContainer).show();
            $(orderSumContainer).show();
        };

        states.payment.exit = function () {
            $(orderItemsContainer).hide();
            $(orderSumContainer).hide();
            orderItemsContainer.innerHTML = '';
            orderSumContainer.innerHTML = '';
        };

        /*
         * functions
         */
        function standByShow(){
            sm.setState('standby');
        }

        function closedShow(){
            sm.setState('closed');
        }

        function orderProcessShow(aData){
            sm.setState('order_process');
            messageContainer.innerHTML = aData.item_name;
            carouselContainer.innerHTML = '';
        }

        function paymentShow(aData) {
            sm.setState('payment');
            var od = aData.orderItems;
            var os = aData.orderSum;
            for (var id in od) {
                wf.ASOrderItem(od[id], orderItemsContainer);
            }
            wf.ASOrderSum(os, orderSumContainer);
        }

        /*
         * webSocket init
         */

        (function () {
            if (webSocket) {
                webSocket.close();
                webSocket = null;
            }

            webSocket = new WebSocket(cfg.protocol + "://" + cfg.host + ":" + cfg.port + "/" + cfg.pathname + "/" + cfg.feed);

            webSocket.onopen = function () {
                webSocket.send("display");
            };

            webSocket.onerror = function (aError) {
                console.log("WS Error: " + aError);
            };

            webSocket.onmessage = function (aEventData) {
                if (aEventData.data) {
                    console.log(aEventData.data);

                    var data = JSON.parse(aEventData.data);
                    if (data.order) {
                        paymentShow(data.order);
                    }
                    if (data.addedItem) {
                        orderProcessShow(data.addedItem);
                    }
                    if (data.logoff) {
                        closedShow();
                    }
                    if (data.logon) {
                        standByShow();
                    }
                    if (data.items) {
                        sm.setState('standby', data.items);
                    }
                }
            };

            webSocket.onclose = function () {

            };

        })();


        sm = new EasyStateMachine(states);
        sm.state = 'closed';
    }

    return AdsScreen;
});


