var thisApp = (function() {
    var thisApp = {};
    var DEBUG = true;
    var $mainContainer;
    
    
    function init(args) {
        $mainContainer = $("#mainContainer")
        $.getJSON("data/beers.json").success(function(aData) {
            $.each(aData, function(idx, aBeer){
                var tile = $("<div class='beerTile'>" + aBeer.beerName + "</div>");
                $mainContainer.append(tile);
            });
            
            initialiseLayout();
        })
        .error(function() {
             print("json load error"); 
        })
        .complete(function() {
            print("data load done");
        });
    }
    
    function initialiseLayout() {
        $mainContainer.isotope({
            itemSelector: ".beerTile",
            layoutMode: "fitRows"
        });
    }
    
    function print(aString) {
        if (DEBUG) {
            console.log(aString);
        }
        
    }
    
    
    
    return {
        init: function() {
            init();
        },
        
        reset: function(args) {
            
        }
    }
})()



$("document").ready(function(){
    thisApp.init();
});