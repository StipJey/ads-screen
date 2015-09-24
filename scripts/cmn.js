define(function(){

    function Common(){
        var cmn = this;

        cmn.createElement = function(aType, aClass, aContainer, aID, aBeforeContainer) {
            var el = document.createElement(aType);
            if (!!aClass) el.className = aClass;
            if (!!aID) el.id = aID;

            function appendChild() {
                if (typeof aContainer !== 'string') {
                    aContainer.appendChild(el);
                } else {
                    document.getElementById(aContainer).appendChild(el);
                }
            }

            function appendChildBefore() {
                if (typeof aContainer !== 'string') {
                    aContainer.insertBefore(el, aBeforeContainer);
                } else {
                    document.getElementById(aContainer).insertBefore(el, aBeforeContainer);
                }
            }

            if (aContainer) {
                if (!aBeforeContainer)
                    appendChild();
                else
                    appendChildBefore();
            }

            return el;
        };

        cmn.getElement = function(aType, aClass, aContainer, aID, aBeforeContainer) {
            var d = document.getElementById(aID);
            if (d) {
                return d
            } else
                return cmn.createElement(aType, aClass, aContainer, aID, aBeforeContainer)
        };

        cmn.GetElement = function(el){
            var d;
            d = document.getElementById(el);
            if(d) return d;
            d = document.getElementsByClassName(el);
            if(d) return d[0];
            d = document.getElementsByTagName(el);
            if(d) return d[0];
            if(el.ATTRIBUTE_NODE) return el;
            return el;
        };

        cmn.deleteElement = function(anElement) {
            anElement.parentNode.removeChild(anElement);
        };
    }

    return Common
})
