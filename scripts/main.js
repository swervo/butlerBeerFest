var thisApp = (function() {
    var utils;
    var beerTiles = [];
    var DEBUG = true;
    var lastSheet = document.styleSheets[document.styleSheets.length - 1];
    var $mainContainer, $choiceDialog, $sortLinks, $dialogButtons, $navLinks;
    
    utils = ({
        randomiseArray: function(anArray) {
            for (var i = anArray.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = anArray[i];
                anArray[i] = anArray[j];
                anArray[j] = temp;
            }
            return anArray;
        },
        
        randomPrimeArrayPick: function(){
            var primeArray = this.randomiseArray([29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113]);
            print(primeArray);
            var primeIndex = -1;
            return function() {
                primeIndex += 1;
                return (primeArray[primeIndex]);
            };
        },
        
        randomRange: function(aMin, aMax) {
            return (Math.floor((Math.random() * (aMax - aMin))) + aMin);
        },
        
        init: function() {
            this.randomPrimeArrayPick = this.randomPrimeArrayPick();
            return this;
        }
    }).init();
    
    
    function init() {
        $mainContainer = $("#mainContainer");
        $choiceDialog = $("#choiceDialog");
        $navLinks = $(".mainNav a").on("click", switchPage);
        $dialogButtons = $(".buttons li").on("click", dialogAction);
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
    
    function switchPage() {
        var $this = $(this);
        var targetPage = $this.data().target;
        print(targetPage);
        if ($this.hasClass("selected")) {
            return false;
        } else {
            var $children = $this.parent().children();
            $children.each(function(idx, aNode){
                $(aNode).removeClass("selected");
            });
            $this.addClass("selected");
        }
        
        $(".view").toggleClass("selected");
        // HACK
        // do the isotope relayout thing
        $mainContainer.isotope("reLayout");
    }
    
    function dialogAction(e) {
        var animName = "oscillate";
        if (e.target.id === "tryAgain") {
            $choiceDialog.css("opacity", "0");
            $mainContainer.isotope({
                filter: "*"
            }, doAnimation);
        } else {
            // play the beer animation
        }
    }
    
    function doAnimation() {
        var animName = "oscillate"
        beerTiles.forEach(function(tile, idx){
            var extantTransform = tile.css("webkitTransform");
            tile.addClass("wobble");
            lastSheet.insertRule("@-webkit-keyframes " + animName + " { 0% { -webkit-transform: " + extantTransform + ";} 33% { -webkit-transform: " + extantTransform + "rotateZ(3deg);} 66% { -webkit-transform: " + extantTransform + "rotateZ(-3deg);} 100% { -webkit-transform: " + extantTransform + "; } }", lastSheet.cssRules.length);
            tile.css("webkitAnimationDuration", utils.randomPrimeArrayPick() * 10 + "ms");
            tile.css("webkitAnimationName", animName);
        });
        setTimeout(showRandomSelection, 3000);
    }
    
    function sortLayout() {
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
        if (nodeData.optionValue === "random") {
            doAnimation();
            return false;
        } else {
            // hide the dialog
            $choiceDialog.css("opacity", "0");
            $mainContainer.isotope({
                sortBy: nodeData.optionValue,
                sortAscending: nodeData.ascending,
                filter: "*"
            });
        }
        
    }
    
    function showRandomSelection() {
        var chosenTile;
        var chosenAle = utils.randomRange(0, beerTiles.length);
        beerTiles.forEach(function(tile, idx){
            tile.css("webkitAnimationName", "none");
            tile.removeClass("wobble");
            if (idx === chosenAle) {
                chosenTile = tile.addClass("chosen");
            }
        });
        $mainContainer.isotope({
            filter: ".chosen"
        }, function(){
            chosenTile.removeClass("chosen");
            setTimeout(function() {
                $choiceDialog.css("opacity", "1");
            }, 0);
        });
    }
    
    function initialiseLayout() {
        print("init");
        $mainContainer.isotope({
            itemSelector: ".beerTile",
            layoutMode: "fitRows",
            getSortData: {
                name: function ($elem) {
                    return $elem.find('.title').text();
                },
                strength: function($elem) {
                    return parseFloat($elem.find('.strength').text());
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
        
        reset: function() {
            
        }
    };
})();



$("document").ready(function(){
    thisApp.init();
});