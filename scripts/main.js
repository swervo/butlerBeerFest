var thisApp = (function() {
    var thisApp = {};
    var DEBUG = true;
    var $mainContainer, $sortLinks;
    
    
    function init(args) {
        $mainContainer = $("#mainContainer");
        
        $sortLinks = $('#sortBy li').on("click", sortLayout);
        
        $.getJSON("data/beers.json").success(function(aData) {
            // sort the data array alphabetically initially
            aData.sort(function(a, b){
                return (a.beerName < b.beerName) ? -1 : 1;
            });
            $.each(aData, function(idx, aBeer){
                var tile = $("<div class='beerTile'></div>").css("background-image", "url(assets/" + aBeer.image + ")");
                var beerName = $("<h3 class='title'>"+ aBeer.beerName +"</h3>");
                var beerDetails = $("<p>" + aBeer.notes + "</p>");
                var beerStrength = $("<span class='strength'>" + aBeer.strength + "%" + "</span>");
                var brewer = $("<span class='brewer'>" + aBeer.brewery + "</span>");
                
                // tile.append(bottleShot);
                tile.append(beerName);
                tile.append(beerDetails);
                tile.append(beerStrength);
                tile.append(brewer);
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
    
    function sortLayout(e) {
        var $this = $(this);
        var nodeData = $this.data();
        if ($this.hasClass("selected")) {
            return false;
        } else {
            var $children = $this.parent().children();
            $children.each(function(idx, aNode){
                $(aNode).removeClass("selected");
            });
            $this.addClass("selected");
        }
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