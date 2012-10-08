var thisApp = (function() {
    var thisApp = {};
    var DEBUG = true;
    var $mainContainer, $sortLinks;
    
    
    function init(args) {
        $mainContainer = $("#mainContainer");
        
        $sortLinks = $('#sortBy li').on("click", changeLayout);
        
        $.getJSON("data/beers.json").success(function(aData) {
            $.each(aData, function(idx, aBeer){
                var tile = $("<div class='beerTile'></div>").css("background-image", "url(assets/" + aBeer.image + ")");
                var beerName = $("<h3 class='title'>"+ aBeer.beerName +"</h3>");
                var beerDetails = $("<p>" + aBeer.notes + "</p>");
                var beerStrength = $("<span class='strength'>" + aBeer.strength + "%" + "</span>");
                
                // tile.append(bottleShot);
                tile.append(beerName);
                tile.append(beerDetails);
                tile.append(beerStrength);
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
        var nodeData = $(this).data();
        var sortObj = {};
        sortObj.sortBy = nodeData.optionValue;
        sortObj.sortAscending = nodeData.ascending;
        // $mainContainer.isotope(sortObj);
        $mainContainer.isotope({
            sortBy: nodeData.optionValue,
            sortAscending: nodeData.ascending
        });
    }
    
    function initialiseLayout() {
        $mainContainer.isotope({
            itemSelector: ".beerTile",
            layoutMode: "fitRows",
            getSortData: {
                name: function ($elem) {
                    return $elem.find('.title').text();
                },
                strength: function($elem) {
                    return parseFloat($elem.find('.strength').text());
                },
                
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