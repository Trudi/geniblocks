"use strict";

var mother = new BioLogica.Organism(BioLogica.Species.Drake, "a:m,b:M,a:h,b:h,a:C,b:C,a:a,b:a,a:B,b:B,a:D,b:D,a:w,b:W,a:Fl,b:Fl,a:Hl,b:hl,a:T,b:t,a:rh,b:rh,a:Bog,b:Bog", 1),
    father = new BioLogica.Organism(BioLogica.Species.Drake, "a:M,a:h,b:h,a:C,b:C,a:a,b:a,a:B,a:D,a:W,a:fl,b:fl,a:Hl,a:t,b:T,a:rh,a:Bog,b:Bog", 0),
    hiddenAlleles = ['h', 'c', 'a', 'b', 'd', 'bog', 'rh'],
    motherDisabledAlleles = [],
    fatherDisabledAlleles = [],
    showFilters = false,
    gameteCount = 72,
    animStiffness = 100,
    gametePoolWidth = 300,
    gametePoolHeight = 350,
    filteredGameteCount = 35,
    filteredGametePoolHeight = 200,
    motherGametes,
    fatherGametes,
    prevSelectedMotherGameteId,
    selectedMotherGameteId,
    selectedMotherGamete,
    selectedMotherGameteSrcRect,
    prevSelectedFatherGameteId,
    selectedFatherGameteId,
    selectedFatherGamete,
    selectedFatherGameteSrcRect,
    fertilizationState = 'none',
    // 'none' -> 'fertilizing' -> 'fertilized' -> 'complete' -> 'none'
offspring;

function parseQueryString(queryString) {
  var params = {},
      queries,
      temp,
      i,
      l;

  // Split into key/value pairs
  queries = queryString.split('&');

  // Convert the array of strings into an object
  for (i = 0, l = queries.length; i < l; i++) {
    temp = queries[i].split('=');
    params[temp[0]] = temp[1];
  }

  return params;
}

var urlParams = parseQueryString(window.location.search.substring(1));
if (urlParams.filter && (urlParams.filter.toLowerCase() === "true" || Boolean(Number(urlParams.filter)))) {
  showFilters = true;
  gametePoolHeight = filteredGametePoolHeight;
  gameteCount = filteredGameteCount;
}
if (urlParams.count > 0) gameteCount = Number(urlParams.count);
if (urlParams.speed > 0) animStiffness = Number(urlParams.speed);

motherGametes = mother.createGametes(gameteCount);
fatherGametes = father.createGametes(gameteCount);

function isGameteDisabled(gamete, disabledAlleles) {
  for (var ch in gamete) {
    var chromosome = gamete[ch];
    for (var i = 0; i < chromosome.alleles.length; ++i) {
      var allele = chromosome.alleles[i];
      // if any allele is disabled, the gamete is disabled
      if (disabledAlleles.indexOf(allele) >= 0) return true;
    }
  }
  // if no alleles are disabled, the gamete is enabled
  return false;
}

function isMotherGameteDisabled(gamete) {
  return isGameteDisabled(gamete, motherDisabledAlleles);
}

function isFatherGameteDisabled(gamete) {
  return isGameteDisabled(gamete, fatherDisabledAlleles);
}

function render() {
  // Mother org
  ReactDOM.render(React.createElement(GeniBlocks.OrganismView, { org: mother }), document.getElementById('mother'));
  // Father org
  ReactDOM.render(React.createElement(GeniBlocks.OrganismView, { org: father }), document.getElementById('father'));

  // Mother gamete filters
  if (showFilters) {
    ReactDOM.render(React.createElement(GeniBlocks.AlleleFiltersView, {
      species: mother.species,
      hiddenAlleles: hiddenAlleles,
      disabledAlleles: motherDisabledAlleles,
      onFilterChange: function onFilterChange(evt, allele, isChecked) {
        evt;
        var alleleIndex = motherDisabledAlleles.indexOf(allele),
            wasChecked = alleleIndex < 0;
        if (isChecked !== wasChecked) {
          if (isChecked) motherDisabledAlleles.splice(alleleIndex, 1);else {
            motherDisabledAlleles.push(allele);
            if (selectedMotherGamete && isMotherGameteDisabled(selectedMotherGamete)) {
              selectedMotherGameteId = null;
              selectedMotherGamete = null;
            }
          }
        }
        render();
      }
    }), document.getElementById('mother-allele-filters'));
  } else {
    ReactDOM.unmountComponentAtNode(document.getElementById('mother-allele-filters'));
    document.getElementById('mother-allele-filters').style.display = 'none';
  }

  // Father gamete filters
  if (showFilters) {
    ReactDOM.render(React.createElement(GeniBlocks.AlleleFiltersView, {
      species: father.species,
      hiddenAlleles: hiddenAlleles,
      disabledAlleles: fatherDisabledAlleles,
      onFilterChange: function onFilterChange(evt, allele, isChecked) {
        evt;
        var alleleIndex = fatherDisabledAlleles.indexOf(allele),
            wasChecked = alleleIndex < 0;
        if (isChecked !== wasChecked) {
          if (isChecked) fatherDisabledAlleles.splice(alleleIndex, 1);else {
            fatherDisabledAlleles.push(allele);
            if (selectedFatherGamete && isFatherGameteDisabled(selectedFatherGamete)) {
              selectedFatherGameteId = null;
              selectedFatherGamete = null;
            }
          }
        }
        render();
      }
    }), document.getElementById('father-allele-filters'));
  } else {
    ReactDOM.unmountComponentAtNode(document.getElementById('father-allele-filters'));
    document.getElementById('father-allele-filters').style.display = 'none';
  }

  // Mother gametes
  ReactDOM.render(React.createElement(GeniBlocks.GametePoolView, {
    gametes: motherGametes,
    hiddenAlleles: hiddenAlleles,
    width: gametePoolWidth,
    height: gametePoolHeight,
    animStiffness: animStiffness,
    selectedId: selectedMotherGameteId,
    isGameteDisabled: isMotherGameteDisabled,
    onGameteSelected: function onGameteSelected(evt, id, gameteViewportRect) {
      if (selectedMotherGameteId !== id) {
        prevSelectedMotherGameteId = selectedMotherGameteId;
        selectedMotherGameteId = id;
        selectedMotherGamete = motherGametes[selectedMotherGameteId - 1];
        selectedMotherGameteSrcRect = gameteViewportRect;
        offspring = null;
        render();
      }
    }
  }), document.getElementById('mother-gametes'));

  // Father gametes
  ReactDOM.render(React.createElement(GeniBlocks.GametePoolView, {
    gametes: fatherGametes,
    hiddenAlleles: hiddenAlleles,
    width: gametePoolWidth,
    height: gametePoolHeight,
    animStiffness: animStiffness,
    selectedId: selectedFatherGameteId,
    isGameteDisabled: isFatherGameteDisabled,
    onGameteSelected: function onGameteSelected(evt, id, gameteViewportRect) {
      if (selectedFatherGameteId !== id) {
        prevSelectedFatherGameteId = selectedFatherGameteId;
        selectedFatherGameteId = id;
        selectedFatherGamete = fatherGametes[selectedFatherGameteId - 1];
        selectedFatherGameteSrcRect = gameteViewportRect;
        offspring = null;
        render();
      }
    }
  }), document.getElementById('father-gametes'));

  // Offspring org
  function renderOffspring() {
    var offspringOpacity = fertilizationState === 'fertilized' ? 1.0 : 0.0;
    if (offspring) {
      ReactDOM.render(React.createElement(GeniBlocks.AnimatedOrganismView, {
        org: offspring,
        initialOpacity: 0.0,
        opacity: offspringOpacity,
        onRest: function onRest() {
          selectedMotherGamete = selectedMotherGameteId = null;
          selectedFatherGamete = selectedFatherGameteId = null;
          fertilizationState = 'none';
          render();
        }
      }), document.getElementById('offspring'));
    } else {
      ReactDOM.unmountComponentAtNode(document.getElementById('offspring'));
    }
  }
  renderOffspring();

  // Mother selected gamete
  function renderSelectedMotherGamete() {
    if (!selectedMotherGameteId || selectedMotherGameteId !== prevSelectedMotherGameteId) {
      ReactDOM.unmountComponentAtNode(document.getElementById('mother-selected-gamete'));
    }
    if (selectedMotherGameteId) {
      var motherSelectedGameteViewportRect = document.getElementById('mother-selected-gamete').getBoundingClientRect();
      ReactDOM.render(React.createElement(GeniBlocks.FertilizingGameteView, {
        type: 'mother',
        gamete: selectedMotherGamete, id: selectedMotherGameteId,
        fertilizationState: fertilizationState,
        hiddenAlleles: hiddenAlleles,
        srcRect: selectedMotherGameteSrcRect,
        dstRect: motherSelectedGameteViewportRect,
        animStiffness: animStiffness,
        onRest: function onRest() {
          if (fertilizationState === 'fertilizing') {
            fertilizationState = 'fertilized';
            // currently we must unmount to trigger the next animation stage
            ReactDOM.unmountComponentAtNode(document.getElementById('mother-selected-gamete'));
            ReactDOM.unmountComponentAtNode(document.getElementById('father-selected-gamete'));
            renderSelectedMotherGamete();
            renderSelectedFatherGamete();
            renderOffspring();
          }
        }
      }), document.getElementById('mother-selected-gamete'));
      prevSelectedMotherGameteId = selectedMotherGameteId;
    }
  }
  renderSelectedMotherGamete();

  // Father selected gamete
  function renderSelectedFatherGamete() {
    if (!selectedFatherGameteId || selectedFatherGameteId !== prevSelectedFatherGameteId) {
      ReactDOM.unmountComponentAtNode(document.getElementById('father-selected-gamete'));
    }
    if (selectedFatherGameteId) {
      var fatherSelectedGameteViewportRect = document.getElementById('father-selected-gamete').getBoundingClientRect();
      ReactDOM.render(React.createElement(GeniBlocks.FertilizingGameteView, {
        type: 'father',
        gamete: selectedFatherGamete, id: selectedFatherGameteId,
        fertilizationState: fertilizationState,
        hiddenAlleles: hiddenAlleles,
        srcRect: selectedFatherGameteSrcRect,
        dstRect: fatherSelectedGameteViewportRect,
        animStiffness: animStiffness
      }), document.getElementById('father-selected-gamete'));
      prevSelectedFatherGameteId = selectedFatherGameteId;
    }
  }
  renderSelectedFatherGamete();
} // render()

function breed() {
  if (selectedMotherGamete && selectedFatherGamete) {
    fertilizationState = 'fertilizing';
    offspring = BioLogica.Organism.createFromGametes(mother.species, selectedMotherGamete, selectedFatherGamete);
    render();
  }
}

document.getElementById("breed-button").onclick = breed;

render();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImV4cGVyaW1lbnRzL21laW9zaXMvbWVpb3Npcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksU0FBUyxJQUFJLFVBQVUsUUFBZCxDQUF1QixVQUFVLE9BQVYsQ0FBa0IsS0FBekMsRUFBZ0QsMkdBQWhELEVBQTZKLENBQTdKLENBQWI7SUFDSSxTQUFTLElBQUksVUFBVSxRQUFkLENBQXVCLFVBQVUsT0FBVixDQUFrQixLQUF6QyxFQUFnRCxpRkFBaEQsRUFBbUksQ0FBbkksQ0FEYjtJQUVJLGdCQUFnQixDQUFDLEdBQUQsRUFBSyxHQUFMLEVBQVMsR0FBVCxFQUFhLEdBQWIsRUFBaUIsR0FBakIsRUFBcUIsS0FBckIsRUFBMkIsSUFBM0IsQ0FGcEI7SUFHSSx3QkFBd0IsRUFINUI7SUFJSSx3QkFBd0IsRUFKNUI7SUFLSSxjQUFjLEtBTGxCO0lBTUksY0FBYyxFQU5sQjtJQU9JLGdCQUFnQixHQVBwQjtJQVFJLGtCQUFrQixHQVJ0QjtJQVNJLG1CQUFtQixHQVR2QjtJQVVJLHNCQUFzQixFQVYxQjtJQVdJLDJCQUEyQixHQVgvQjtJQVlJLGFBWko7SUFhSSxhQWJKO0lBY0ksMEJBZEo7SUFlSSxzQkFmSjtJQWdCSSxvQkFoQko7SUFpQkksMkJBakJKO0lBa0JJLDBCQWxCSjtJQW1CSSxzQkFuQko7SUFvQkksb0JBcEJKO0lBcUJJLDJCQXJCSjtJQXNCSSxxQkFBcUIsTUF0QnpCOztBQXVCSSxTQXZCSjs7QUF5QkEsU0FBUyxnQkFBVCxDQUEwQixXQUExQixFQUF1QztBQUNuQyxNQUFJLFNBQVMsRUFBYjtNQUFpQixPQUFqQjtNQUEwQixJQUExQjtNQUFnQyxDQUFoQztNQUFtQyxDQUFuQzs7O0FBR0EsWUFBVSxZQUFZLEtBQVosQ0FBa0IsR0FBbEIsQ0FBVjs7O0FBR0EsT0FBTSxJQUFJLENBQUosRUFBTyxJQUFJLFFBQVEsTUFBekIsRUFBaUMsSUFBSSxDQUFyQyxFQUF3QyxHQUF4QyxFQUE4QztBQUMxQyxXQUFPLFFBQVEsQ0FB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QWxEOztBQUVBIiwiZmlsZSI6ImV4cGVyaW1lbnRzL21laW9zaXMvbWVpb3Npcy5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBtb3RoZXIgPSBuZXcgQmlvTG9naWNhLk9yZ2FuaXNtKEJpb0xvZ2ljYS5TcGVjaWVzLkRyYWtlLCBcImE6bSxiOk0sYTpoLGI6aCxhOkMsYjpDLGE6YSxiOmEsYTpCLGI6QixhOkQsYjpELGE6dyxiOlcsYTpGbCxiOkZsLGE6SGwsYjpobCxhOlQsYjp0LGE6cmgsYjpyaCxhOkJvZyxiOkJvZ1wiLCAxKSxcbiAgICBmYXRoZXIgPSBuZXcgQmlvTG9naWNhLk9yZ2FuaXNtKEJpb0xvZ2ljYS5TcGVjaWVzLkRyYWtlLCBcImE6TSxhOmgsYjpoLGE6QyxiOkMsYTphLGI6YSxhOkIsYTpELGE6VyxhOmZsLGI6ZmwsYTpIbCxhOnQsYjpULGE6cmgsYTpCb2csYjpCb2dcIiwgMCksXG4gICAgaGlkZGVuQWxsZWxlcyA9IFsnaCcsJ2MnLCdhJywnYicsJ2QnLCdib2cnLCdyaCddLFxuICAgIG1vdGhlckRpc2FibGVkQWxsZWxlcyA9IFtdLFxuICAgIGZhdGhlckRpc2FibGVkQWxsZWxlcyA9IFtdLFxuICAgIHNob3dGaWx0ZXJzID0gZmFsc2UsXG4gICAgZ2FtZXRlQ291bnQgPSA3MixcbiAgICBhbmltU3RpZmZuZXNzID0gMTAwLFxuICAgIGdhbWV0ZVBvb2xXaWR0aCA9IDMwMCxcbiAgICBnYW1ldGVQb29sSGVpZ2h0ID0gMzUwLFxuICAgIGZpbHRlcmVkR2FtZXRlQ291bnQgPSAzNSxcbiAgICBmaWx0ZXJlZEdhbWV0ZVBvb2xIZWlnaHQgPSAyMDAsXG4gICAgbW90aGVyR2FtZXRlcyxcbiAgICBmYXRoZXJHYW1ldGVzLFxuICAgIHByZXZTZWxlY3RlZE1vdGhlckdhbWV0ZUlkLFxuICAgIHNlbGVjdGVkTW90aGVyR2FtZXRlSWQsXG4gICAgc2VsZWN0ZWRNb3RoZXJHYW1ldGUsXG4gICAgc2VsZWN0ZWRNb3RoZXJHYW1ldGVTcmNSZWN0LFxuICAgIHByZXZTZWxlY3RlZEZhdGhlckdhbWV0ZUlkLFxuICAgIHNlbGVjdGVkRmF0aGVyR2FtZXRlSWQsXG4gICAgc2VsZWN0ZWRGYXRoZXJHYW1ldGUsXG4gICAgc2VsZWN0ZWRGYXRoZXJHYW1ldGVTcmNSZWN0LFxuICAgIGZlcnRpbGl6YXRpb25TdGF0ZSA9ICdub25lJywgIC8vICdub25lJyAtPiAnZmVydGlsaXppbmcnIC0+ICdmZXJ0aWxpemVkJyAtPiAnY29tcGxldGUnIC0+ICdub25lJ1xuICAgIG9mZnNwcmluZztcblxuZnVuY3Rpb24gcGFyc2VRdWVyeVN0cmluZyhxdWVyeVN0cmluZykge1xuICAgIHZhciBwYXJhbXMgPSB7fSwgcXVlcmllcywgdGVtcCwgaSwgbDtcblxuICAgIC8vIFNwbGl0IGludG8ga2V5L3ZhbHVlIHBhaXJzXG4gICAgcXVlcmllcyA9IHF1ZXJ5U3RyaW5nLnNwbGl0KCcmJyk7XG5cbiAgICAvLyBDb252ZXJ0IHRoZSBhcnJheSBvZiBzdHJpbmdzIGludG8gYW4gb2JqZWN0XG4gICAgZm9yICggaSA9IDAsIGwgPSBxdWVyaWVzLmxlbmd0aDsgaSA8IGw7IGkrKyApIHtcbiAgICAgICAgdGVtcCA9IHF1ZXJpZXNbaV0uc3BsaXQoJz0nKTtcbiAgICAgICAgcGFyYW1zW3RlbXBbMF1dID0gdGVtcFsxXTtcbiAgICB9XG5cbiAgICByZXR1cm4gcGFyYW1zO1xufVxuXG52YXIgdXJsUGFyYW1zID0gcGFyc2VRdWVyeVN0cmluZygod2luZG93LmxvY2F0aW9uLnNlYXJjaCkuc3Vic3RyaW5nKDEpKTtcbmlmICh1cmxQYXJhbXMuZmlsdGVyICYmICgodXJsUGFyYW1zLmZpbHRlci50b0xvd2VyQ2FzZSgpID09PSBcInRydWVcIikgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIEJvb2xlYW4oTnVtYmVyKHVybFBhcmFtcy5maWx0ZXIpKSkpIHtcbiAgc2hvd0ZpbHRlcnMgPSB0cnVlO1xuICBnYW1ldGVQb29sSGVpZ2h0ID0gZmlsdGVyZWRHYW1ldGVQb29sSGVpZ2h0O1xuICBnYW1ldGVDb3VudCA9IGZpbHRlcmVkR2FtZXRlQ291bnQ7XG59XG5pZiAodXJsUGFyYW1zLmNvdW50ID4gMClcbiAgZ2FtZXRlQ291bnQgPSBOdW1iZXIodXJsUGFyYW1zLmNvdW50KTtcbmlmICh1cmxQYXJhbXMuc3BlZWQgPiAwKVxuICBhbmltU3RpZmZuZXNzID0gTnVtYmVyKHVybFBhcmFtcy5zcGVlZCk7XG5cbm1vdGhlckdhbWV0ZXMgPSBtb3RoZXIuY3JlYXRlR2FtZXRlcyhnYW1ldGVDb3VudCk7XG5mYXRoZXJHYW1ldGVzID0gZmF0aGVyLmNyZWF0ZUdhbWV0ZXMoZ2FtZXRlQ291bnQpO1xuXG5mdW5jdGlvbiBpc0dhbWV0ZURpc2FibGVkKGdhbWV0ZSwgZGlzYWJsZWRBbGxlbGVzKSB7XG4gIGZvciAodmFyIGNoIGluIGdhbWV0ZSkge1xuICAgIHZhciBjaHJvbW9zb21lID0gZ2FtZXRlW2NoXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNocm9tb3NvbWUuYWxsZWxlcy5sZW5ndGg7ICsraSkge1xuICAgICAgdmFyIGFsbGVsZSA9IGNocm9tb3NvbWUuYWxsZWxlc1tpXTtcbiAgICAgIC8vIGlmIGFueSBhbGxlbGUgaXMgZGlzYWJsZWQsIHRoZSBnYW1ldGUgaXMgZGlzYWJsZWRcbiAgICAgIGlmIChkaXNhYmxlZEFsbGVsZXMuaW5kZXhPZihhbGxlbGUpID49IDApXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICAvLyBpZiBubyBhbGxlbGVzIGFyZSBkaXNhYmxlZCwgdGhlIGdhbWV0ZSBpcyBlbmFibGVkXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gaXNNb3RoZXJHYW1ldGVEaXNhYmxlZChnYW1ldGUpIHtcbiAgcmV0dXJuIGlzR2FtZXRlRGlzYWJsZWQoZ2FtZXRlLCBtb3RoZXJEaXNhYmxlZEFsbGVsZXMpO1xufVxuXG5mdW5jdGlvbiBpc0ZhdGhlckdhbWV0ZURpc2FibGVkKGdhbWV0ZSkge1xuICByZXR1cm4gaXNHYW1ldGVEaXNhYmxlZChnYW1ldGUsIGZhdGhlckRpc2FibGVkQWxsZWxlcyk7XG59XG5cbmZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgLy8gTW90aGVyIG9yZ1xuICBSZWFjdERPTS5yZW5kZXIoXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChHZW5pQmxvY2tzLk9yZ2FuaXNtVmlldywge29yZzogbW90aGVyfSksXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vdGhlcicpXG4gICk7XG4gIC8vIEZhdGhlciBvcmdcbiAgUmVhY3RET00ucmVuZGVyKFxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoR2VuaUJsb2Nrcy5PcmdhbmlzbVZpZXcsIHtvcmc6IGZhdGhlcn0pLFxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmYXRoZXInKVxuICApO1xuXG4gIC8vIE1vdGhlciBnYW1ldGUgZmlsdGVyc1xuICBpZiAoc2hvd0ZpbHRlcnMpIHtcbiAgICBSZWFjdERPTS5yZW5kZXIoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEdlbmlCbG9ja3MuQWxsZWxlRmlsdGVyc1ZpZXcsIHtcbiAgICAgICAgc3BlY2llczogbW90aGVyLnNwZWNpZXMsXG4gICAgICAgIGhpZGRlbkFsbGVsZXM6IGhpZGRlbkFsbGVsZXMsXG4gICAgICAgIGRpc2FibGVkQWxsZWxlczogbW90aGVyRGlzYWJsZWRBbGxlbGVzLFxuICAgICAgICBvbkZpbHRlckNoYW5nZTogZnVuY3Rpb24oZXZ0LCBhbGxlbGUsIGlzQ2hlY2tlZCkge1xuICAgICAgICAgIGV2dDtcbiAgICAgICAgICB2YXIgYWxsZWxlSW5kZXggPSBtb3RoZXJEaXNhYmxlZEFsbGVsZXMuaW5kZXhPZihhbGxlbGUpLFxuICAgICAgICAgICAgICB3YXNDaGVja2VkID0gYWxsZWxlSW5kZXggPCAwO1xuICAgICAgICAgIGlmIChpc0NoZWNrZWQgIT09IHdhc0NoZWNrZWQpIHtcbiAgICAgICAgICAgIGlmIChpc0NoZWNrZWQpXG4gICAgICAgICAgICAgIG1vdGhlckRpc2FibGVkQWxsZWxlcy5zcGxpY2UoYWxsZWxlSW5kZXgsIDEpO1xuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgIG1vdGhlckRpc2FibGVkQWxsZWxlcy5wdXNoKGFsbGVsZSk7XG4gICAgICAgICAgICAgIGlmIChzZWxlY3RlZE1vdGhlckdhbWV0ZSAmJiBpc01vdGhlckdhbWV0ZURpc2FibGVkKHNlbGVjdGVkTW90aGVyR2FtZXRlKSkge1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkTW90aGVyR2FtZXRlSWQgPSBudWxsO1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkTW90aGVyR2FtZXRlID0gbnVsbDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZW5kZXIoKTtcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW90aGVyLWFsbGVsZS1maWx0ZXJzJylcbiAgICApO1xuICB9XG4gIGVsc2Uge1xuICAgIFJlYWN0RE9NLnVubW91bnRDb21wb25lbnRBdE5vZGUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vdGhlci1hbGxlbGUtZmlsdGVycycpKTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW90aGVyLWFsbGVsZS1maWx0ZXJzJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgfVxuXG4gIC8vIEZhdGhlciBnYW1ldGUgZmlsdGVyc1xuICBpZiAoc2hvd0ZpbHRlcnMpIHtcbiAgICBSZWFjdERPTS5yZW5kZXIoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEdlbmlCbG9ja3MuQWxsZWxlRmlsdGVyc1ZpZXcsIHtcbiAgICAgICAgc3BlY2llczogZmF0aGVyLnNwZWNpZXMsXG4gICAgICAgIGhpZGRlbkFsbGVsZXM6IGhpZGRlbkFsbGVsZXMsXG4gICAgICAgIGRpc2FibGVkQWxsZWxlczogZmF0aGVyRGlzYWJsZWRBbGxlbGVzLFxuICAgICAgICBvbkZpbHRlckNoYW5nZTogZnVuY3Rpb24oZXZ0LCBhbGxlbGUsIGlzQ2hlY2tlZCkge1xuICAgICAgICAgIGV2dDtcbiAgICAgICAgICB2YXIgYWxsZWxlSW5kZXggPSBmYXRoZXJEaXNhYmxlZEFsbGVsZXMuaW5kZXhPZihhbGxlbGUpLFxuICAgICAgICAgICAgICB3YXNDaGVja2VkID0gYWxsZWxlSW5kZXggPCAwO1xuICAgICAgICAgIGlmIChpc0NoZWNrZWQgIT09IHdhc0NoZWNrZWQpIHtcbiAgICAgICAgICAgIGlmIChpc0NoZWNrZWQpXG4gICAgICAgICAgICAgIGZhdGhlckRpc2FibGVkQWxsZWxlcy5zcGxpY2UoYWxsZWxlSW5kZXgsIDEpO1xuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgIGZhdGhlckRpc2FibGVkQWxsZWxlcy5wdXNoKGFsbGVsZSk7XG4gICAgICAgICAgICAgIGlmIChzZWxlY3RlZEZhdGhlckdhbWV0ZSAmJiBpc0ZhdGhlckdhbWV0ZURpc2FibGVkKHNlbGVjdGVkRmF0aGVyR2FtZXRlKSkge1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkRmF0aGVyR2FtZXRlSWQgPSBudWxsO1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkRmF0aGVyR2FtZXRlID0gbnVsbDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZW5kZXIoKTtcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmF0aGVyLWFsbGVsZS1maWx0ZXJzJylcbiAgICApO1xuICB9XG4gIGVsc2Uge1xuICAgIFJlYWN0RE9NLnVubW91bnRDb21wb25lbnRBdE5vZGUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZhdGhlci1hbGxlbGUtZmlsdGVycycpKTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmF0aGVyLWFsbGVsZS1maWx0ZXJzJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgfVxuXG4gIC8vIE1vdGhlciBnYW1ldGVzXG4gIFJlYWN0RE9NLnJlbmRlcihcbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEdlbmlCbG9ja3MuR2FtZXRlUG9vbFZpZXcsIHtcbiAgICAgIGdhbWV0ZXM6IG1vdGhlckdhbWV0ZXMsXG4gICAgICBoaWRkZW5BbGxlbGVzOiBoaWRkZW5BbGxlbGVzLFxuICAgICAgd2lkdGg6IGdhbWV0ZVBvb2xXaWR0aCxcbiAgICAgIGhlaWdodDogZ2FtZXRlUG9vbEhlaWdodCxcbiAgICAgIGFuaW1TdGlmZm5lc3M6IGFuaW1TdGlmZm5lc3MsXG4gICAgICBzZWxlY3RlZElkOiBzZWxlY3RlZE1vdGhlckdhbWV0ZUlkLFxuICAgICAgaXNHYW1ldGVEaXNhYmxlZDogaXNNb3RoZXJHYW1ldGVEaXNhYmxlZCxcbiAgICAgIG9uR2FtZXRlU2VsZWN0ZWQ6IGZ1bmN0aW9uKGV2dCwgaWQsIGdhbWV0ZVZpZXdwb3J0UmVjdCkge1xuICAgICAgICBpZiAoc2VsZWN0ZWRNb3RoZXJHYW1ldGVJZCAhPT0gaWQpIHtcbiAgICAgICAgICBwcmV2U2VsZWN0ZWRNb3RoZXJHYW1ldGVJZCA9IHNlbGVjdGVkTW90aGVyR2FtZXRlSWQ7XG4gICAgICAgICAgc2VsZWN0ZWRNb3RoZXJHYW1ldGVJZCA9IGlkO1xuICAgICAgICAgIHNlbGVjdGVkTW90aGVyR2FtZXRlID0gbW90aGVyR2FtZXRlc1tzZWxlY3RlZE1vdGhlckdhbWV0ZUlkIC0gMV07XG4gICAgICAgICAgc2VsZWN0ZWRNb3RoZXJHYW1ldGVTcmNSZWN0ID0gZ2FtZXRlVmlld3BvcnRSZWN0O1xuICAgICAgICAgIG9mZnNwcmluZyA9IG51bGw7XG4gICAgICAgICAgcmVuZGVyKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KSxcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW90aGVyLWdhbWV0ZXMnKVxuICApO1xuXG4gIC8vIEZhdGhlciBnYW1ldGVzXG4gIFJlYWN0RE9NLnJlbmRlcihcbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEdlbmlCbG9ja3MuR2FtZXRlUG9vbFZpZXcsIHtcbiAgICAgIGdhbWV0ZXM6IGZhdGhlckdhbWV0ZXMsXG4gICAgICBoaWRkZW5BbGxlbGVzOiBoaWRkZW5BbGxlbGVzLFxuICAgICAgd2lkdGg6IGdhbWV0ZVBvb2xXaWR0aCxcbiAgICAgIGhlaWdodDogZ2FtZXRlUG9vbEhlaWdodCxcbiAgICAgIGFuaW1TdGlmZm5lc3M6IGFuaW1TdGlmZm5lc3MsXG4gICAgICBzZWxlY3RlZElkOiBzZWxlY3RlZEZhdGhlckdhbWV0ZUlkLFxuICAgICAgaXNHYW1ldGVEaXNhYmxlZDogaXNGYXRoZXJHYW1ldGVEaXNhYmxlZCxcbiAgICAgIG9uR2FtZXRlU2VsZWN0ZWQ6IGZ1bmN0aW9uKGV2dCwgaWQsIGdhbWV0ZVZpZXdwb3J0UmVjdCkge1xuICAgICAgICBpZiAoc2VsZWN0ZWRGYXRoZXJHYW1ldGVJZCAhPT0gaWQpIHtcbiAgICAgICAgICBwcmV2U2VsZWN0ZWRGYXRoZXJHYW1ldGVJZCA9IHNlbGVjdGVkRmF0aGVyR2FtZXRlSWQ7XG4gICAgICAgICAgc2VsZWN0ZWRGYXRoZXJHYW1ldGVJZCA9IGlkO1xuICAgICAgICAgIHNlbGVjdGVkRmF0aGVyR2FtZXRlID0gZmF0aGVyR2FtZXRlc1tzZWxlY3RlZEZhdGhlckdhbWV0ZUlkIC0gMV07XG4gICAgICAgICAgc2VsZWN0ZWRGYXRoZXJHYW1ldGVTcmNSZWN0ID0gZ2FtZXRlVmlld3BvcnRSZWN0O1xuICAgICAgICAgIG9mZnNwcmluZyA9IG51bGw7XG4gICAgICAgICAgcmVuZGVyKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KSxcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmF0aGVyLWdhbWV0ZXMnKVxuICApO1xuXG4gIC8vIE9mZnNwcmluZyBvcmdcbiAgZnVuY3Rpb24gcmVuZGVyT2Zmc3ByaW5nKCkge1xuICAgIHZhciBvZmZzcHJpbmdPcGFjaXR5ID0gKGZlcnRpbGl6YXRpb25TdGF0ZSA9PT0gJ2ZlcnRpbGl6ZWQnID8gMS4wIDogMC4wKTtcbiAgICBpZiAob2Zmc3ByaW5nKSB7XG4gICAgICBSZWFjdERPTS5yZW5kZXIoXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoR2VuaUJsb2Nrcy5BbmltYXRlZE9yZ2FuaXNtVmlldywge1xuICAgICAgICAgICAgb3JnOiBvZmZzcHJpbmcsIFxuICAgICAgICAgICAgaW5pdGlhbE9wYWNpdHk6IDAuMCxcbiAgICAgICAgICAgIG9wYWNpdHk6IG9mZnNwcmluZ09wYWNpdHksXG4gICAgICAgICAgICBvblJlc3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICBzZWxlY3RlZE1vdGhlckdhbWV0ZSA9IHNlbGVjdGVkTW90aGVyR2FtZXRlSWQgPSBudWxsO1xuICAgICAgICAgICAgICBzZWxlY3RlZEZhdGhlckdhbWV0ZSA9IHNlbGVjdGVkRmF0aGVyR2FtZXRlSWQgPSBudWxsO1xuICAgICAgICAgICAgICBmZXJ0aWxpemF0aW9uU3RhdGUgPSAnbm9uZSc7XG4gICAgICAgICAgICAgIHJlbmRlcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pLFxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnb2Zmc3ByaW5nJylcbiAgICAgICk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgUmVhY3RET00udW5tb3VudENvbXBvbmVudEF0Tm9kZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnb2Zmc3ByaW5nJykpO1xuICAgIH1cbiAgfVxuICByZW5kZXJPZmZzcHJpbmcoKTtcblxuICAvLyBNb3RoZXIgc2VsZWN0ZWQgZ2FtZXRlXG4gIGZ1bmN0aW9uIHJlbmRlclNlbGVjdGVkTW90aGVyR2FtZXRlKCkge1xuICAgIGlmICghc2VsZWN0ZWRNb3RoZXJHYW1ldGVJZCB8fCAoc2VsZWN0ZWRNb3RoZXJHYW1ldGVJZCAhPT0gcHJldlNlbGVjdGVkTW90aGVyR2FtZXRlSWQpKSB7XG4gICAgICBSZWFjdERPTS51bm1vdW50Q29tcG9uZW50QXROb2RlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb3RoZXItc2VsZWN0ZWQtZ2FtZXRlJykpO1xuICAgIH1cbiAgICBpZiAoc2VsZWN0ZWRNb3RoZXJHYW1ldGVJZCkge1xuICAgICAgdmFyIG1vdGhlclNlbGVjdGVkR2FtZXRlVmlld3BvcnRSZWN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vdGhlci1zZWxlY3RlZC1nYW1ldGUnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgUmVhY3RET00ucmVuZGVyKFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEdlbmlCbG9ja3MuRmVydGlsaXppbmdHYW1ldGVWaWV3LCB7XG4gICAgICAgICAgdHlwZTogJ21vdGhlcicsXG4gICAgICAgICAgZ2FtZXRlOiBzZWxlY3RlZE1vdGhlckdhbWV0ZSwgaWQ6IHNlbGVjdGVkTW90aGVyR2FtZXRlSWQsXG4gICAgICAgICAgZmVydGlsaXphdGlvblN0YXRlOiBmZXJ0aWxpemF0aW9uU3RhdGUsIFxuICAgICAgICAgIGhpZGRlbkFsbGVsZXM6IGhpZGRlbkFsbGVsZXMsXG4gICAgICAgICAgc3JjUmVjdDogc2VsZWN0ZWRNb3RoZXJHYW1ldGVTcmNSZWN0LFxuICAgICAgICAgIGRzdFJlY3Q6IG1vdGhlclNlbGVjdGVkR2FtZXRlVmlld3BvcnRSZWN0LFxuICAgICAgICAgIGFuaW1TdGlmZm5lc3M6IGFuaW1TdGlmZm5lc3MsXG4gICAgICAgICAgb25SZXN0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChmZXJ0aWxpemF0aW9uU3RhdGUgPT09ICdmZXJ0aWxpemluZycpIHtcbiAgICAgICAgICAgICAgZmVydGlsaXphdGlvblN0YXRlID0gJ2ZlcnRpbGl6ZWQnO1xuICAgICAgICAgICAgICAvLyBjdXJyZW50bHkgd2UgbXVzdCB1bm1vdW50IHRvIHRyaWdnZXIgdGhlIG5leHQgYW5pbWF0aW9uIHN0YWdlXG4gICAgICAgICAgICAgIFJlYWN0RE9NLnVubW91bnRDb21wb25lbnRBdE5vZGUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vdGhlci1zZWxlY3RlZC1nYW1ldGUnKSk7XG4gICAgICAgICAgICAgIFJlYWN0RE9NLnVubW91bnRDb21wb25lbnRBdE5vZGUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZhdGhlci1zZWxlY3RlZC1nYW1ldGUnKSk7XG4gICAgICAgICAgICAgIHJlbmRlclNlbGVjdGVkTW90aGVyR2FtZXRlKCk7XG4gICAgICAgICAgICAgIHJlbmRlclNlbGVjdGVkRmF0aGVyR2FtZXRlKCk7XG4gICAgICAgICAgICAgIHJlbmRlck9mZnNwcmluZygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSksXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb3RoZXItc2VsZWN0ZWQtZ2FtZXRlJylcbiAgICAgICk7XG4gICAgICBwcmV2U2VsZWN0ZWRNb3RoZXJHYW1ldGVJZCA9IHNlbGVjdGVkTW90aGVyR2FtZXRlSWQ7XG4gICAgfVxuICB9XG4gIHJlbmRlclNlbGVjdGVkTW90aGVyR2FtZXRlKCk7XG5cbiAgLy8gRmF0aGVyIHNlbGVjdGVkIGdhbWV0ZVxuICBmdW5jdGlvbiByZW5kZXJTZWxlY3RlZEZhdGhlckdhbWV0ZSgpIHtcbiAgICBpZiAoIXNlbGVjdGVkRmF0aGVyR2FtZXRlSWQgfHwgKHNlbGVjdGVkRmF0aGVyR2FtZXRlSWQgIT09IHByZXZTZWxlY3RlZEZhdGhlckdhbWV0ZUlkKSkge1xuICAgICAgUmVhY3RET00udW5tb3VudENvbXBvbmVudEF0Tm9kZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmF0aGVyLXNlbGVjdGVkLWdhbWV0ZScpKTtcbiAgICB9XG4gICAgaWYgKHNlbGVjdGVkRmF0aGVyR2FtZXRlSWQpIHtcbiAgICAgIHZhciBmYXRoZXJTZWxlY3RlZEdhbWV0ZVZpZXdwb3J0UmVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmYXRoZXItc2VsZWN0ZWQtZ2FtZXRlJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIFJlYWN0RE9NLnJlbmRlcihcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChHZW5pQmxvY2tzLkZlcnRpbGl6aW5nR2FtZXRlVmlldywge1xuICAgICAgICAgIHR5cGU6ICdmYXRoZXInLFxuICAgICAgICAgIGdhbWV0ZTogc2VsZWN0ZWRGYXRoZXJHYW1ldGUsIGlkOiBzZWxlY3RlZEZhdGhlckdhbWV0ZUlkLFxuICAgICAgICAgIGZlcnRpbGl6YXRpb25TdGF0ZTogZmVydGlsaXphdGlvblN0YXRlLCBcbiAgICAgICAgICBoaWRkZW5BbGxlbGVzOiBoaWRkZW5BbGxlbGVzLFxuICAgICAgICAgIHNyY1JlY3Q6IHNlbGVjdGVkRmF0aGVyR2FtZXRlU3JjUmVjdCxcbiAgICAgICAgICBkc3RSZWN0OiBmYXRoZXJTZWxlY3RlZEdhbWV0ZVZpZXdwb3J0UmVjdCxcbiAgICAgICAgICBhbmltU3RpZmZuZXNzOiBhbmltU3RpZmZuZXNzXG4gICAgICAgIH0pLFxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmF0aGVyLXNlbGVjdGVkLWdhbWV0ZScpXG4gICAgICApO1xuICAgICAgcHJldlNlbGVjdGVkRmF0aGVyR2FtZXRlSWQgPSBzZWxlY3RlZEZhdGhlckdhbWV0ZUlkO1xuICAgIH1cbiAgfVxuICByZW5kZXJTZWxlY3RlZEZhdGhlckdhbWV0ZSgpO1xufSAvLyByZW5kZXIoKVxuXG5mdW5jdGlvbiBicmVlZCgpIHtcbiAgaWYgKHNlbGVjdGVkTW90aGVyR2FtZXRlICYmIHNlbGVjdGVkRmF0aGVyR2FtZXRlKSB7XG4gICAgZmVydGlsaXphdGlvblN0YXRlID0gJ2ZlcnRpbGl6aW5nJztcbiAgICBvZmZzcHJpbmcgPSBCaW9Mb2dpY2EuT3JnYW5pc20uY3JlYXRlRnJvbUdhbWV0ZXMobW90aGVyLnNwZWNpZXMsIHNlbGVjdGVkTW90aGVyR2FtZXRlLCBzZWxlY3RlZEZhdGhlckdhbWV0ZSk7XG4gICAgcmVuZGVyKCk7XG4gIH1cbn1cblxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJicmVlZC1idXR0b25cIikub25jbGljayA9IGJyZWVkO1xuXG5yZW5kZXIoKTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
