var thisApp = (function() {
    var thisApp = {};
    var DEBUG = true;
    var $mainContainer, $sortLinks;
    
    
    function init(args) {
        $mainContainer = $("#mainContainer");
        
        $sortLinks = $('#sortBy li').on("click", changeLayout);
        
        console.log($sortLinks);
        
        $.getJSON("data/beers.json").success(function(aData) {
            $.each(aData, function(idx, aBeer){
                var tile = $("<div class='beerTile'></div>").css("background-image", "url(assets/" + aBeer.image + ")");
                var beerName = $("<h3 class='title'>"+ aBeer.beerName +"</h3>");
                var beerDetails = $("<p>" + aBeer.notes + "</p>")
                
                // tile.append(bottleShot);
                tile.append(beerName);
                tile.append(beerDetails);
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
    
    function changeLayout(e) {
        console.log($(this).data());
        $mainContainer.isotope({
            sortBy: "name"
        });
    }
    
    function initialiseLayout() {
        $mainContainer.isotope({
            itemSelector: ".beerTile",
            layoutMode: "fitRows",
            getSortData : {
                name : function ( $elem ) {
                    return $elem.find('.title').text();
                }
            }
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