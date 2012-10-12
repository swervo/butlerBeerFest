var thisApp = (function() {
    var thisApp = {};
    var beerTiles = [];
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
                
                beerTiles.push(tile);
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
        if (nodeData.optionValue == "random") {
            console.log(beerTiles);
            beerTiles.forEach(function(tile, idx){
                var extantTransform = tile.css("webkitTransform");
                // console.log(idx, tile);
                tile.addClass("wobble");
                // console.log(tile.css("webkitTransform"));
                
                var animName = "crossFade";
                var lastSheet = document.styleSheets[document.styleSheets.length - 1];
                
                // lastSheet.insertRule("@-webkit-keyframes " + animName + " { 0% { opacity: 0.5; } 100% {opacity: 1;} }", lastSheet.cssRules.length);
                
                lastSheet.insertRule("@-webkit-keyframes " + animName + " { 0% { -webkit-transform: " + extantTransform + ";} 33% { -webkit-transform: " + extantTransform + "rotateZ(5deg);} 66% { -webkit-transform: " + extantTransform + "rotateZ(-5deg);} 100% { -webkit-transform: " + extantTransform + "; } }", lastSheet.cssRules.length);
                
                tile.css("webkitAnimationName", animName);
                
            });
            
            // var lastSheet = document.styleSheets[document.styleSheets.length - 1];
            //             lastSheet.insertRule("@-webkit-keyframes " + newName + " { from { top: 0px; } to {top: " + newHeight + "px;} }", lastSheet.cssRules.length);
            //             
            //             element.style.webkitAnimationName = newName;
            
            // need to create a keyframe rule for each element
            // where the keyframes contain the existing webkitTransform code
            
            // add a random animation class to each element
            // find a number between 0 and n
            // filter on that element
            
            return false;
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