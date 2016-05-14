'use strict';

var thisApp = (function() {
    var utils;
    var beerTiles = [];
    var DEBUG = true;
    var lastSheet = document.styleSheets[document.styleSheets.length - 1];
    var $mainContainer, chosenTile, $choiceDialog, $sort, $sortLinks,
        $serving, $dialogButtons, $cheersButton, $navLinks;
    
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
            var primeArray = this.randomiseArray([
                29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113
            ]);
            this.print(primeArray);
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
        },
        print: function(aString) {
            if (DEBUG) {
                console.log(aString);
            }
        }
    }).init();
    
    
    function init() {
        $mainContainer = $('#mainContainer');
        $choiceDialog = $('#choiceDialog');
        $serving = $('#serving');
        $navLinks = $('#mainNav').on('click', '.js-navItem', switchPage);
        $dialogButtons = $('button', $choiceDialog).on('click', dialogAction);
        $cheersButton = $('#cheers', $serving).on('click', resetView);
        $sort = $('#sortBy').on('click', '.js-navItem', sortLayout);
        $sortLinks = $('.js-navItem', $sort);

        
        $.getJSON('data/beers.json').success(function(aData) {
            // sort the data array alphabetically initially
            aData.sort(function(a, b){
                return (a.beerName < b.beerName) ? -1 : 1;
            });
            $.each(aData, function(idx, aBeer){
                var tile = $('<div class="BeerTile"></div>').css(
                    'background-image',
                    'url(assets/' + aBeer.image + ')'
                );
                var beerName = $('<div class="BeerTile--title">'+ aBeer.beerName +'</div>');
                var beerDetails = $('<p class="BeerTile--notes">' + aBeer.notes + '</p>');
                var beerStrength = $('<span class="BeerTile--strength">' + aBeer.strength + '%' + '</span>');
                var brewer = $('<span class="BeerTile--brewer">' + aBeer.brewery + '</span>');
                
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
            utils.print('json load error');
        })
        .complete(function() {
            utils.print('data load done');
        });
    }
    
    function switchPage() {
        var $this = $(this);
        var targetPage = $this.data().target;
        utils.print(targetPage);
        if ($this.hasClass('selected')) {
            return false;
        } else {
            var $children = $this.parent().children();
            $children.each(function(idx, aNode){
                $(aNode).removeClass('selected');
            });
            $this.addClass('selected');
        }
        
        $('.view').toggleClass('selected');
        // HACK
        // do the isotope relayout thing
        $mainContainer.isotope('reLayout');
    }
    
    function dialogAction(e) {
        if (e.target.id === 'tryAgain') {
            $choiceDialog.css('opacity', '0');
            $mainContainer.isotope({
                filter: '*'
            });
            setTimeout(function() {
                doAnimation();
            }, 800);
        } else {
            // hide the dialog show the serving acknowlegement
            $serving.removeClass('hidden');
            $choiceDialog.css('opacity', '0');
            setTimeout(function(){
                $serving.css('opacity', '1');
            }, 0);
            chosenTile.css({
                webkitTransitionDuration: '2000ms',
                webkitTransform: 'translate3d(2000px, 0px, 0px)'
            });
        }
    }
    
    function resetView() {
        function resetNav() {
            // remove selection
            $sortLinks.removeClass('selected');
            // set the selection to alpha
            $sortLinks.first().addClass('selected');
        }
        // hide the cheers dialog
        $serving.on('webkitTransitionEnd', function() {
            $(this).addClass('hidden').off('webkitTransitionEnd').css('opacity', '');
            chosenTile.css({webkitTransitionDuration: '', webkitTransform: ''});
            $mainContainer.isotope({
                filter: '*'
            }, resetNav);
            // reset the navigation if the isotope callback (above) doesn't fire
            // this is a hack until the issues with isotope are resolved.
            setTimeout(function() {
                resetNav();
            }, 500);
        }).css('opacity', '0');
    }
    
    function doAnimation() {
        var animName = 'oscillate';
        beerTiles.forEach(function(tile){
            var extantTransform = tile.css('webkitTransform');
            tile.addClass('wobble');
            lastSheet.insertRule('@-webkit-keyframes ' + animName + ' { 0% { -webkit-transform: '
                + extantTransform + ';} 33% { -webkit-transform: '
                + extantTransform + 'rotateZ(3deg);} 66% { -webkit-transform: '
                + extantTransform + 'rotateZ(-3deg);} 100% { -webkit-transform: '
                + extantTransform + '; } }', lastSheet.cssRules.length);
            tile.css('webkitAnimationDuration', utils.randomPrimeArrayPick() * 10 + 'ms');
            tile.css('webkitAnimationName', animName);
        });
        setTimeout(showRandomSelection, 3000);
    }
    
    function sortLayout() {
        var $this = $(this);
        var nodeData = $this.data();
        if ($this.hasClass('selected')) {
            return false;
        } else {
            var $children = $this.parent().children();
            $children.each(function(idx, aNode){
                $(aNode).removeClass('selected');
            });
            $this.addClass('selected');
        }
        if (nodeData.optionValue === 'random') {
            doAnimation();
            return false;
        } else {
            // hide the dialog
            $choiceDialog.css('opacity', '0');
            $mainContainer.isotope({
                sortBy: nodeData.optionValue,
                sortAscending: nodeData.ascending,
                filter: '*'
            });
        }
    }
    
    function showRandomSelection() {
        function showDialog () {
            chosenTile.removeClass('chosen');
            setTimeout(function() {
                $choiceDialog.css('opacity', '1');
            }, 0);
        }
        // var chosenTile;
        var chosenAle = utils.randomRange(0, beerTiles.length);
        beerTiles.forEach(function(tile, idx){
            tile.css('webkitAnimationName', 'none');
            tile.removeClass('wobble');
            if (idx === chosenAle) {
                chosenTile = tile.addClass('chosen');
            }
        });
        $mainContainer.isotope({
            filter: '.chosen'
        }, showDialog);
        // HACK //
        // As the isotope callbacks are no longer being fired
        // Set a timeout instead
        // (800 being the transition time in isotopeStyles.css)
        setTimeout(showDialog, 800);
    }
    
    function initialiseLayout() {
        utils.print('init');
        
        $mainContainer.isotope({
            itemSelector: '.BeerTile',
            layoutMode: 'fitRows',
            getSortData: {
                // name: function ($elem) {
                //     return $elem.find('.BeerTile--title').text();
                // },
                // strength: function($elem) {
                //     return parseFloat($elem.find('.BeerTile--strength').text());
                // }
            }
        });
    }
    
    
    return {
        init: function() {
            init();
        },
        
        reset: function() {
            
        }
    };
})();

$('document').ready(function(){
    thisApp.init();
});
