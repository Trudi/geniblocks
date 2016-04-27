"use strict";

/* global ReactDnD, ReactDnDHTML5Backend, AlleleContainer, PunnettContainer */
var DragDropContext = ReactDnD.DragDropContext,
    Backend = ReactDnDHTML5Backend,
    layoutAsLabels = false,
    dragons = [null, null],
    allelePools = [["W", "w", "W", "w", "w", "W", "W"], ["W", "T", "t", "W", "w", "W", "w", "Tk", "t", "t"]],
    alleleTargets = [["circle", "circle"], ["circle", "circle", "square", "square"]],
    punnettAlleles = [null, null, null, null],
    punnettOrgs = [null, null, null, null],
    createDragon = function createDragon(alleles, orgArray, orgNumber, initialAlleleString) {
  for (var i = 0, ii = alleles.length; i < ii; i++) {
    if (!alleles[i] || alleles[i] === "circle" || alleles[i] === "square") return;
  }
  var alleleString = initialAlleleString;
  for (i = 0, ii = alleles.length; i < ii; i++) {
    var side = i % 2 ? "b:" : "a:";
    alleleString += side + alleles[i] + (i === ii - 1 ? "" : ",");
  }
  orgArray[orgNumber] = BioLogica.Organism.createLiveOrganism(BioLogica.Species.Drake, alleleString, 1);
},
    moveAllele = function moveAllele(sourceIndex, sourceOrg, targetIndex, targetOrg) {
  var initialAllele = alleleTargets[targetOrg][targetIndex];
  if (initialAllele === "circle" || initialAllele === "square") initialAllele = null;
  alleleTargets[targetOrg][targetIndex] = allelePools[sourceOrg][sourceIndex];
  allelePools[sourceOrg][sourceIndex] = initialAllele;
  createDragon(alleleTargets[targetOrg], dragons, targetOrg, "");
  render();
},
    createPunnettDragons = function createPunnettDragons() {
  var index = 0;
  for (var i = 0; i < 2; i++) {
    for (var j = 2; j < 4; j++) {
      var alleles = [punnettAlleles[i], punnettAlleles[j]];
      createDragon(alleles, punnettOrgs, index++, "a:m,b:M,a:h,b:h,a:C,b:C,a:a,b:a,a:b,b:b,a:D,b:D,a:Fl,b:Fl,a:Hl,b:hl,a:T,b:t,a:rh,b:rh,a:Bog,b:Bog");
    }
  }
},
    placeAlleleInPunnettSquare = function placeAlleleInPunnettSquare(sourceIndex, sourceOrg, targetIndex) {
  var initialAllele = punnettAlleles[targetIndex];
  punnettAlleles[targetIndex] = allelePools[sourceOrg][sourceIndex];
  allelePools[sourceOrg][sourceIndex] = initialAllele;
  createPunnettDragons();
  render();
};

function renderDragon(dragon) {
  if (dragon) {
    return React.createElement(GeniBlocks.OrganismView, { org: dragon });
  } else {
    return React.createElement('div', { className: "unknown" }, "?");
  }
}

function render() {
  var genomes = dragons.map(function (dragon, i) {
    return React.createElement('div', { key: i }, React.createElement('div', { className: "org" }, renderDragon(dragon)), React.createElement('div', { className: "chromosomes labelable" }, React.createElement(GeniBlocks.ChromosomeImageView), React.createElement(GeniBlocks.ChromosomeImageView)), React.createElement('div', { className: "alleles" }, React.createElement(AlleleContainer, {
      org: i,
      pool: allelePools[i],
      targets: alleleTargets[i],
      moveAllele: moveAllele
    })));
  });

  var game = React.createClass({
    displayName: "game",

    render: function render() {
      return React.createElement('div', {}, React.createElement('div', { className: "genomes" }, genomes), React.createElement('div', {}, React.createElement(PunnettContainer, { alleles: punnettAlleles, orgs: punnettOrgs, moveAllele: placeAlleleInPunnettSquare })));
    }
  });

  var draggableGame = DragDropContext(Backend)(game);

  ReactDOM.render(React.createElement(draggableGame), document.getElementById('game'));

  layoutLabels();
}

render();

function layoutLabels() {
  var els = document.getElementsByClassName("labelable");
  for (var i = 0, ii = els.length; i < ii; i++) {
    if (layoutAsLabels) {
      els[i].classList.add("wide");
    } else {
      els[i].classList.remove("wide");
    }
  }
}
document.getElementById("spaces").onclick = function () {
  if (document.getElementById("spaces").checked) {
    layoutAsLabels = false;
    layoutLabels();
  }
};
document.getElementById("labels").onclick = function () {
  if (document.getElementById("labels").checked) {
    layoutAsLabels = true;
    layoutLabels();
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImV4cGVyaW1lbnRzL2RyYWdnYWJsZS1hbGxlbGVzL2RyYWdnYWJsZS1hbGxlbGVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLElBQUksa0JBQWtCLFNBQVMsZUFBL0I7SUFDSSxVQUFVLG9CQURkO0lBRUksaUJBQWlCLEtBRnJCO0lBSUksVUFBVSxDQUFDLElBQUQsRUFBTyxJQUFQLENBSmQ7SUFLSSxjQUFjLENBQUMsQ0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEdBQVgsRUFBZ0IsR0FBaEIsRUFBcUIsR0FBckIsRUFBMEIsR0FBMUIsRUFBK0IsR0FBL0IsQ0FBRCxFQUFzQyxDQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsR0FBWCxFQUFnQixHQUFoQixFQUFxQixHQUFyQixFQUEwQixHQUExQixFQUErQixHQUEvQixFQUFvQyxJQUFwQyxFQUEwQyxHQUExQyxFQUErQyxHQUEvQyxDQUF0QyxDQUxsQjtJQU1JLGdCQUFnQixDQUFDLENBQUMsUUFBRCxFQUFXLFFBQVgsQ0FBRCxFQUFzQixDQUFDLFFBQUQsRUFBVyxRQUFYLEVBQXFCLFFBQXJCLEVBQStCLFFBQS9CLENBQXRCLENBTnBCO0lBUUksaUJBQWlCLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLENBUnJCO0lBU0ksY0FBYyxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixDQVRsQjtJQVdJLGVBQWUsU0FBZixZQUFlLENBQVMsT0FBVCxFQUFrQixRQUFsQixFQUE0QixTQUE1QixFQUF1QyxtQkFBdkMsRUFBNEQ7QUFDekUsT0FBSyxJQUFJLElBQUksQ0FBUixFQUFXLEtBQUssUUFBUSxNQUE3QixFQUFxQyxJQUFJLEVBQXpDLEVBQTZDLEdBQTdDLEVBQWtEO0FBQ2hELFFBQUksQ0FBQyxRQUFRLENBQVIsQ0FBRCxJQUFlLFFBQVEsQ0FBUixNQUFlLFFBQTlCLElBQTBDLFFBQVEsQ0FBUixNQUFlLFFBQTdELEVBQXVFO0FB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QixDQUFxQixNQUFyQjtBQUNELEtBRkQsTUFFTztBQUNMLFVBQUksQ0FBSixFQUFPLFNBQVAsQ0FBaUIsTUFBakIsQ0FBd0IsTUFBeEI7QUFDRDtBQUNGO0FBQ0Y7QUFDRCxTQUFTLGNBQVQsQ0FBd0IsUUFBeEIsRUFBa0MsT0FBbEMsR0FBNEMsWUFBVztBQUNyRCxNQUFJLFNBQVMsY0FBVCxDQUF3QixRQUF4QixFQUFrQyxPQUF0QyxFQUErQztBQUM3QyxxQkFBaUIsS0FBakI7QUFDQTtBQUNEO0FBQ0YsQ0FMRDtBQU1BLFNBQVMsY0FBVCxDQUF3QixRQUF4QixFQUFrQyxPQUFsQyxHQUE0QyxZQUFXO0FBQ3JELE1BQUksU0FBUyxjQUFULENBQXdCLFFBQXhCLEVBQWtDLE9BQXRDLEVBQStDO0FBQzdDLHFCQUFpQixJQUFqQjtBQUNBO0FBQ0Q7QUFDRixDQUxEIiwiZmlsZSI6ImV4cGVyaW1lbnRzL2RyYWdnYWJsZS1hbGxlbGVzL2RyYWdnYWJsZS1hbGxlbGVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogZ2xvYmFsIFJlYWN0RG5ELCBSZWFjdERuREhUTUw1QmFja2VuZCwgQWxsZWxlQ29udGFpbmVyLCBQdW5uZXR0Q29udGFpbmVyICovXG52YXIgRHJhZ0Ryb3BDb250ZXh0ID0gUmVhY3REbkQuRHJhZ0Ryb3BDb250ZXh0LFxuICAgIEJhY2tlbmQgPSBSZWFjdERuREhUTUw1QmFja2VuZCxcbiAgICBsYXlvdXRBc0xhYmVscyA9IGZhbHNlLFxuXG4gICAgZHJhZ29ucyA9IFtudWxsLCBudWxsXSxcbiAgICBhbGxlbGVQb29scyA9IFtbXCJXXCIsIFwid1wiLCBcIldcIiwgXCJ3XCIsIFwid1wiLCBcIldcIiwgXCJXXCJdLCBbXCJXXCIsIFwiVFwiLCBcInRcIiwgXCJXXCIsIFwid1wiLCBcIldcIiwgXCJ3XCIsIFwiVGtcIiwgXCJ0XCIsIFwidFwiXV0sXG4gICAgYWxsZWxlVGFyZ2V0cyA9IFtbXCJjaXJjbGVcIiwgXCJjaXJjbGVcIl0sW1wiY2lyY2xlXCIsIFwiY2lyY2xlXCIsIFwic3F1YXJlXCIsIFwic3F1YXJlXCJdXSxcblxuICAgIHB1bm5ldHRBbGxlbGVzID0gW251bGwsIG51bGwsIG51bGwsIG51bGxdLFxuICAgIHB1bm5ldHRPcmdzID0gW251bGwsIG51bGwsIG51bGwsIG51bGxdLFxuXG4gICAgY3JlYXRlRHJhZ29uID0gZnVuY3Rpb24oYWxsZWxlcywgb3JnQXJyYXksIG9yZ051bWJlciwgaW5pdGlhbEFsbGVsZVN0cmluZykge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGlpID0gYWxsZWxlcy5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgIGlmICghYWxsZWxlc1tpXSB8fCBhbGxlbGVzW2ldID09PSBcImNpcmNsZVwiIHx8IGFsbGVsZXNbaV0gPT09IFwic3F1YXJlXCIpIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHZhciBhbGxlbGVTdHJpbmcgPSBpbml0aWFsQWxsZWxlU3RyaW5nO1xuICAgICAgZm9yIChpID0gMCwgaWkgPSBhbGxlbGVzLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgdmFyIHNpZGUgPSBpICUgMiA/IFwiYjpcIiA6IFwiYTpcIjtcbiAgICAgICAgYWxsZWxlU3RyaW5nICs9IHNpZGUgKyBhbGxlbGVzW2ldICsgKGkgPT09IGlpIC0gMSA/IFwiXCIgOiBcIixcIik7XG4gICAgICB9XG4gICAgICBvcmdBcnJheVtvcmdOdW1iZXJdID0gQmlvTG9naWNhLk9yZ2FuaXNtLmNyZWF0ZUxpdmVPcmdhbmlzbShCaW9Mb2dpY2EuU3BlY2llcy5EcmFrZSwgYWxsZWxlU3RyaW5nLCAxKTtcbiAgICB9LFxuXG4gICAgbW92ZUFsbGVsZSA9IGZ1bmN0aW9uKHNvdXJjZUluZGV4LCBzb3VyY2VPcmcsIHRhcmdldEluZGV4LCB0YXJnZXRPcmcpIHtcbiAgICAgIHZhciBpbml0aWFsQWxsZWxlID0gYWxsZWxlVGFyZ2V0c1t0YXJnZXRPcmddW3RhcmdldEluZGV4XTtcbiAgICAgIGlmICgoaW5pdGlhbEFsbGVsZSA9PT0gXCJjaXJjbGVcIiB8fCBpbml0aWFsQWxsZWxlID09PSBcInNxdWFyZVwiKSkgaW5pdGlhbEFsbGVsZSA9IG51bGw7XG4gICAgICBhbGxlbGVUYXJnZXRzW3RhcmdldE9yZ11bdGFyZ2V0SW5kZXhdID0gYWxsZWxlUG9vbHNbc291cmNlT3JnXVtzb3VyY2VJbmRleF07XG4gICAgICBhbGxlbGVQb29sc1tzb3VyY2VPcmddW3NvdXJjZUluZGV4XSA9IGluaXRpYWxBbGxlbGU7XG4gICAgICBjcmVhdGVEcmFnb24oYWxsZWxlVGFyZ2V0c1t0YXJnZXRPcmddLCBkcmFnb25zLCB0YXJnZXRPcmcsIFwiXCIpO1xuICAgICAgcmVuZGVyKCk7XG4gICAgfSxcblxuICAgIGNyZWF0ZVB1bm5ldHREcmFnb25zID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaW5kZXggPSAwO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAyOyBpKyspIHtcbiAgICAgICAgZm9yICh2YXIgaiA9IDI7IGogPCA0OyBqKyspIHtcbiAgICAgICAgICB2YXIgYWxsZWxlcyA9IFtwdW5uZXR0QWxsZWxlc1tpXSwgcHVubmV0dEFsbGVsZXNbal1dO1xuICAgICAgICAgIGNyZWF0ZURyYWdvbihhbGxlbGVzLCBwdW5uZXR0T3JncywgaW5kZXgrKywgXCJhOm0sYjpNLGE6aCxiOmgsYTpDLGI6QyxhOmEsYjphLGE6YixiOmIsYTpELGI6RCxhOkZsLGI6RmwsYTpIbCxiOmhsLGE6VCxiOnQsYTpyaCxiOnJoLGE6Qm9nLGI6Qm9nXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIHBsYWNlQWxsZWxlSW5QdW5uZXR0U3F1YXJlID0gZnVuY3Rpb24oc291cmNlSW5kZXgsIHNvdXJjZU9yZywgdGFyZ2V0SW5kZXgpIHtcbiAgICAgIHZhciBpbml0aWFsQWxsZWxlID0gcHVubmV0dEFsbGVsZXNbdGFyZ2V0SW5kZXhdO1xuICAgICAgcHVubmV0dEFsbGVsZXNbdGFyZ2V0SW5kZXhdID0gYWxsZWxlUG9vbHNbc291cmNlT3JnXVtzb3VyY2VJbmRleF07XG4gICAgICBhbGxlbGVQb29sc1tzb3VyY2VPcmddW3NvdXJjZUluZGV4XSA9IGluaXRpYWxBbGxlbGU7XG4gICAgICBjcmVhdGVQdW5uZXR0RHJhZ29ucygpO1xuICAgICAgcmVuZGVyKCk7XG4gICAgfTtcblxuZnVuY3Rpb24gcmVuZGVyRHJhZ29uKGRyYWdvbikge1xuICBpZiAoZHJhZ29uKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoR2VuaUJsb2Nrcy5PcmdhbmlzbVZpZXcsIHtvcmc6IGRyYWdvbn0pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7Y2xhc3NOYW1lOiBcInVua25vd25cIn0sIFwiP1wiKTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZW5kZXIoKSB7XG4gIHZhciBnZW5vbWVzID0gZHJhZ29ucy5tYXAoZnVuY3Rpb24oZHJhZ29uLCBpKXtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2Jywge2tleTogaX0sXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7Y2xhc3NOYW1lOiBcIm9yZ1wifSxcbiAgICAgICAgcmVuZGVyRHJhZ29uKGRyYWdvbilcbiAgICAgICksXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7Y2xhc3NOYW1lOiBcImNocm9tb3NvbWVzIGxhYmVsYWJsZVwifSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChHZW5pQmxvY2tzLkNocm9tb3NvbWVJbWFnZVZpZXcpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEdlbmlCbG9ja3MuQ2hyb21vc29tZUltYWdlVmlldylcbiAgICAgICksXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7Y2xhc3NOYW1lOiBcImFsbGVsZXNcIn0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQWxsZWxlQ29udGFpbmVyLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG9yZzogaSxcbiAgICAgICAgICAgIHBvb2w6IGFsbGVsZVBvb2xzW2ldLFxuICAgICAgICAgICAgdGFyZ2V0czogYWxsZWxlVGFyZ2V0c1tpXSxcbiAgICAgICAgICAgIG1vdmVBbGxlbGU6IG1vdmVBbGxlbGVcbiAgICAgICAgICB9XG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9KTtcblxuICB2YXIgZ2FtZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHt9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7Y2xhc3NOYW1lOiBcImdlbm9tZXNcIn0sXG4gICAgICAgICAgZ2Vub21lc1xuICAgICAgICApLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7fSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFB1bm5ldHRDb250YWluZXIsIHthbGxlbGVzOiBwdW5uZXR0QWxsZWxlcywgb3JnczogcHVubmV0dE9yZ3MsIG1vdmVBbGxlbGU6IHBsYWNlQWxsZWxlSW5QdW5uZXR0U3F1YXJlfSlcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9XG4gIH0pO1xuXG4gIHZhciBkcmFnZ2FibGVHYW1lID0gRHJhZ0Ryb3BDb250ZXh0KEJhY2tlbmQpKGdhbWUpO1xuXG4gIFJlYWN0RE9NLnJlbmRlcihcbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KGRyYWdnYWJsZUdhbWUpLFxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lJylcbiAgKTtcblxuICBsYXlvdXRMYWJlbHMoKTtcbn1cblxucmVuZGVyKCk7XG5cbmZ1bmN0aW9uIGxheW91dExhYmVscygpIHtcbiAgdmFyIGVscyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJsYWJlbGFibGVcIik7XG4gIGZvciAodmFyIGk9MCwgaWk9ZWxzLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICBpZiAobGF5b3V0QXNMYWJlbHMpIHtcbiAgICAgIGVsc1tpXS5jbGFzc0xpc3QuYWRkKFwid2lkZVwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWxzW2ldLmNsYXNzTGlzdC5yZW1vdmUoXCJ3aWRlXCIpO1xuICAgIH1cbiAgfVxufVxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzcGFjZXNcIikub25jbGljayA9IGZ1bmN0aW9uKCkge1xuICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzcGFjZXNcIikuY2hlY2tlZCkge1xuICAgIGxheW91dEFzTGFiZWxzID0gZmFsc2U7XG4gICAgbGF5b3V0TGFiZWxzKCk7XG4gIH1cbn07XG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxhYmVsc1wiKS5vbmNsaWNrID0gZnVuY3Rpb24oKSB7XG4gIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxhYmVsc1wiKS5jaGVja2VkKSB7XG4gICAgbGF5b3V0QXNMYWJlbHMgPSB0cnVlO1xuICAgIGxheW91dExhYmVscygpO1xuICB9XG59O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
