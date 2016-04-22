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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImV4cGVyaW1lbnRzL2RyYWdnYWJsZS1hbGxlbGVzL2RyYWdnYWJsZS1hbGxlbGVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLElBQUksa0JBQWtCLFNBQVMsZUFBVDtJQUNsQixVQUFVLG9CQUFWO0lBQ0EsaUJBQWlCLEtBQWpCO0lBRUEsVUFBVSxDQUFDLElBQUQsRUFBTyxJQUFQLENBQVY7SUFDQSxjQUFjLENBQUMsQ0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEdBQVgsRUFBZ0IsR0FBaEIsRUFBcUIsR0FBckIsRUFBMEIsR0FBMUIsRUFBK0IsR0FBL0IsQ0FBRCxFQUFzQyxDQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsR0FBWCxFQUFnQixHQUFoQixFQUFxQixHQUFyQixFQUEwQixHQUExQixFQUErQixHQUEvQixFQUFvQyxJQUFwQyxFQUEwQyxHQUExQyxFQUErQyxHQUEvQyxDQUF0QyxDQUFkO0lBQ0EsZ0JBQWdCLENBQUMsQ0FBQyxRQUFELEVBQVcsUUFBWCxDQUFELEVBQXNCLENBQUMsUUFBRCxFQUFXLFFBQVgsRUFBcUIsUUFBckIsRUFBK0IsUUFBL0IsQ0FBdEIsQ0FBaEI7SUFFQSxpQkFBaUIsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FBakI7SUFDQSxjQUFjLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLENBQWQ7SUFFQSxlQUFlLFNBQWYsWUFBZSxDQUFTLE9BQVQsRUFBa0IsUUFBbEIsRUFBNEIsU0FBNUIsRUFBdUMsbUJBQXZDLEVBQTREO0FBQ3pFLE9BQUssSUFBSSxJQUFJLENBQUosRUFBTyxLQUFLLFFBQVEsTUFBUixFQUFnQixJQUFJLEVBQUosRUFBUSxHQUE3QyxFQUFrRDtBQUNoRCxRQUFJLENBQUMsUUFBUSxDQUFSLENBQUQsSUFBZSxRQUFRLENBQVIsTUFBZSxRQUFmLElBQTJCLFFBQVEsQ0FBUixNQUFlLFFBQWYsRUFBeUIsT0FBdkU7R0FE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QUFLLElBQUksSUFBRSxDQUFGLEVBQUssS0FBRyxJQUFJLE1BQUosRUFBWSxJQUFJLEVBQUosRUFBUSxHQUFyQyxFQUEwQztBQUN4QyxRQUFJLGNBQUosRUFBb0I7QUFDbEIsVUFBSSxDQUFKLEVBQU8sU0FBUCxDQUFpQixHQUFqQixDQUFxQixNQUFyQixFQURrQjtLQUFwQixNQUVPO0FBQ0wsVUFBSSxDQUFKLEVBQU8sU0FBUCxDQUFpQixNQUFqQixDQUF3QixNQUF4QixFQURLO0tBRlA7R0FERjtDQUZGO0FBVUEsU0FBUyxjQUFULENBQXdCLFFBQXhCLEVBQWtDLE9BQWxDLEdBQTRDLFlBQVc7QUFDckQsTUFBSSxTQUFTLGNBQVQsQ0FBd0IsUUFBeEIsRUFBa0MsT0FBbEMsRUFBMkM7QUFDN0MscUJBQWlCLEtBQWpCLENBRDZDO0FBRTdDLG1CQUY2QztHQUEvQztDQUQwQztBQU01QyxTQUFTLGNBQVQsQ0FBd0IsUUFBeEIsRUFBa0MsT0FBbEMsR0FBNEMsWUFBVztBQUNyRCxNQUFJLFNBQVMsY0FBVCxDQUF3QixRQUF4QixFQUFrQyxPQUFsQyxFQUEyQztBQUM3QyxxQkFBaUIsSUFBakIsQ0FENkM7QUFFN0MsbUJBRjZDO0dBQS9DO0NBRDBDIiwiZmlsZSI6ImV4cGVyaW1lbnRzL2RyYWdnYWJsZS1hbGxlbGVzL2RyYWdnYWJsZS1hbGxlbGVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogZ2xvYmFsIFJlYWN0RG5ELCBSZWFjdERuREhUTUw1QmFja2VuZCwgQWxsZWxlQ29udGFpbmVyLCBQdW5uZXR0Q29udGFpbmVyICovXG52YXIgRHJhZ0Ryb3BDb250ZXh0ID0gUmVhY3REbkQuRHJhZ0Ryb3BDb250ZXh0LFxuICAgIEJhY2tlbmQgPSBSZWFjdERuREhUTUw1QmFja2VuZCxcbiAgICBsYXlvdXRBc0xhYmVscyA9IGZhbHNlLFxuXG4gICAgZHJhZ29ucyA9IFtudWxsLCBudWxsXSxcbiAgICBhbGxlbGVQb29scyA9IFtbXCJXXCIsIFwid1wiLCBcIldcIiwgXCJ3XCIsIFwid1wiLCBcIldcIiwgXCJXXCJdLCBbXCJXXCIsIFwiVFwiLCBcInRcIiwgXCJXXCIsIFwid1wiLCBcIldcIiwgXCJ3XCIsIFwiVGtcIiwgXCJ0XCIsIFwidFwiXV0sXG4gICAgYWxsZWxlVGFyZ2V0cyA9IFtbXCJjaXJjbGVcIiwgXCJjaXJjbGVcIl0sW1wiY2lyY2xlXCIsIFwiY2lyY2xlXCIsIFwic3F1YXJlXCIsIFwic3F1YXJlXCJdXSxcblxuICAgIHB1bm5ldHRBbGxlbGVzID0gW251bGwsIG51bGwsIG51bGwsIG51bGxdLFxuICAgIHB1bm5ldHRPcmdzID0gW251bGwsIG51bGwsIG51bGwsIG51bGxdLFxuXG4gICAgY3JlYXRlRHJhZ29uID0gZnVuY3Rpb24oYWxsZWxlcywgb3JnQXJyYXksIG9yZ051bWJlciwgaW5pdGlhbEFsbGVsZVN0cmluZykge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGlpID0gYWxsZWxlcy5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XG4gICAgICAgIGlmICghYWxsZWxlc1tpXSB8fCBhbGxlbGVzW2ldID09PSBcImNpcmNsZVwiIHx8IGFsbGVsZXNbaV0gPT09IFwic3F1YXJlXCIpIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHZhciBhbGxlbGVTdHJpbmcgPSBpbml0aWFsQWxsZWxlU3RyaW5nO1xuICAgICAgZm9yIChpID0gMCwgaWkgPSBhbGxlbGVzLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgdmFyIHNpZGUgPSBpICUgMiA/IFwiYjpcIiA6IFwiYTpcIjtcbiAgICAgICAgYWxsZWxlU3RyaW5nICs9IHNpZGUgKyBhbGxlbGVzW2ldICsgKGkgPT09IGlpIC0gMSA/IFwiXCIgOiBcIixcIik7XG4gICAgICB9XG4gICAgICBvcmdBcnJheVtvcmdOdW1iZXJdID0gQmlvTG9naWNhLk9yZ2FuaXNtLmNyZWF0ZUxpdmVPcmdhbmlzbShCaW9Mb2dpY2EuU3BlY2llcy5EcmFrZSwgYWxsZWxlU3RyaW5nLCAxKTtcbiAgICB9LFxuXG4gICAgbW92ZUFsbGVsZSA9IGZ1bmN0aW9uKHNvdXJjZUluZGV4LCBzb3VyY2VPcmcsIHRhcmdldEluZGV4LCB0YXJnZXRPcmcpIHtcbiAgICAgIHZhciBpbml0aWFsQWxsZWxlID0gYWxsZWxlVGFyZ2V0c1t0YXJnZXRPcmddW3RhcmdldEluZGV4XTtcbiAgICAgIGlmICgoaW5pdGlhbEFsbGVsZSA9PT0gXCJjaXJjbGVcIiB8fCBpbml0aWFsQWxsZWxlID09PSBcInNxdWFyZVwiKSkgaW5pdGlhbEFsbGVsZSA9IG51bGw7XG4gICAgICBhbGxlbGVUYXJnZXRzW3RhcmdldE9yZ11bdGFyZ2V0SW5kZXhdID0gYWxsZWxlUG9vbHNbc291cmNlT3JnXVtzb3VyY2VJbmRleF07XG4gICAgICBhbGxlbGVQb29sc1tzb3VyY2VPcmddW3NvdXJjZUluZGV4XSA9IGluaXRpYWxBbGxlbGU7XG4gICAgICBjcmVhdGVEcmFnb24oYWxsZWxlVGFyZ2V0c1t0YXJnZXRPcmddLCBkcmFnb25zLCB0YXJnZXRPcmcsIFwiXCIpO1xuICAgICAgcmVuZGVyKCk7XG4gICAgfSxcblxuICAgIGNyZWF0ZVB1bm5ldHREcmFnb25zID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaW5kZXggPSAwO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAyOyBpKyspIHtcbiAgICAgICAgZm9yICh2YXIgaiA9IDI7IGogPCA0OyBqKyspIHtcbiAgICAgICAgICB2YXIgYWxsZWxlcyA9IFtwdW5uZXR0QWxsZWxlc1tpXSwgcHVubmV0dEFsbGVsZXNbal1dO1xuICAgICAgICAgIGNyZWF0ZURyYWdvbihhbGxlbGVzLCBwdW5uZXR0T3JncywgaW5kZXgrKywgXCJhOm0sYjpNLGE6aCxiOmgsYTpDLGI6QyxhOmEsYjphLGE6YixiOmIsYTpELGI6RCxhOkZsLGI6RmwsYTpIbCxiOmhsLGE6VCxiOnQsYTpyaCxiOnJoLGE6Qm9nLGI6Qm9nXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIHBsYWNlQWxsZWxlSW5QdW5uZXR0U3F1YXJlID0gZnVuY3Rpb24oc291cmNlSW5kZXgsIHNvdXJjZU9yZywgdGFyZ2V0SW5kZXgpIHtcbiAgICAgIHZhciBpbml0aWFsQWxsZWxlID0gcHVubmV0dEFsbGVsZXNbdGFyZ2V0SW5kZXhdO1xuICAgICAgcHVubmV0dEFsbGVsZXNbdGFyZ2V0SW5kZXhdID0gYWxsZWxlUG9vbHNbc291cmNlT3JnXVtzb3VyY2VJbmRleF07XG4gICAgICBhbGxlbGVQb29sc1tzb3VyY2VPcmddW3NvdXJjZUluZGV4XSA9IGluaXRpYWxBbGxlbGU7XG4gICAgICBjcmVhdGVQdW5uZXR0RHJhZ29ucygpO1xuICAgICAgcmVuZGVyKCk7XG4gICAgfTtcblxuZnVuY3Rpb24gcmVuZGVyRHJhZ29uKGRyYWdvbikge1xuICBpZiAoZHJhZ29uKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoR2VuaUJsb2Nrcy5PcmdhbmlzbVZpZXcsIHtvcmc6IGRyYWdvbn0pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7Y2xhc3NOYW1lOiBcInVua25vd25cIn0sIFwiP1wiKTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZW5kZXIoKSB7XG4gIHZhciBnZW5vbWVzID0gZHJhZ29ucy5tYXAoZnVuY3Rpb24oZHJhZ29uLCBpKXtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudCgnZGl2Jywge2tleTogaX0sXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7Y2xhc3NOYW1lOiBcIm9yZ1wifSxcbiAgICAgICAgcmVuZGVyRHJhZ29uKGRyYWdvbilcbiAgICAgICksXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7Y2xhc3NOYW1lOiBcImNocm9tb3NvbWVzIGxhYmVsYWJsZVwifSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChHZW5pQmxvY2tzLkNocm9tb3NvbWVJbWFnZVZpZXcpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEdlbmlCbG9ja3MuQ2hyb21vc29tZUltYWdlVmlldylcbiAgICAgICksXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7Y2xhc3NOYW1lOiBcImFsbGVsZXNcIn0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQWxsZWxlQ29udGFpbmVyLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG9yZzogaSxcbiAgICAgICAgICAgIHBvb2w6IGFsbGVsZVBvb2xzW2ldLFxuICAgICAgICAgICAgdGFyZ2V0czogYWxsZWxlVGFyZ2V0c1tpXSxcbiAgICAgICAgICAgIG1vdmVBbGxlbGU6IG1vdmVBbGxlbGVcbiAgICAgICAgICB9XG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9KTtcblxuICB2YXIgZ2FtZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHt9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7Y2xhc3NOYW1lOiBcImdlbm9tZXNcIn0sXG4gICAgICAgICAgZ2Vub21lc1xuICAgICAgICApLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7fSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFB1bm5ldHRDb250YWluZXIsIHthbGxlbGVzOiBwdW5uZXR0QWxsZWxlcywgb3JnczogcHVubmV0dE9yZ3MsIG1vdmVBbGxlbGU6IHBsYWNlQWxsZWxlSW5QdW5uZXR0U3F1YXJlfSlcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9XG4gIH0pO1xuXG4gIHZhciBkcmFnZ2FibGVHYW1lID0gRHJhZ0Ryb3BDb250ZXh0KEJhY2tlbmQpKGdhbWUpO1xuXG4gIFJlYWN0RE9NLnJlbmRlcihcbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KGRyYWdnYWJsZUdhbWUpLFxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnYW1lJylcbiAgKTtcblxuICBsYXlvdXRMYWJlbHMoKTtcbn1cblxucmVuZGVyKCk7XG5cbmZ1bmN0aW9uIGxheW91dExhYmVscygpIHtcbiAgdmFyIGVscyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJsYWJlbGFibGVcIik7XG4gIGZvciAodmFyIGk9MCwgaWk9ZWxzLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICBpZiAobGF5b3V0QXNMYWJlbHMpIHtcbiAgICAgIGVsc1tpXS5jbGFzc0xpc3QuYWRkKFwid2lkZVwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWxzW2ldLmNsYXNzTGlzdC5yZW1vdmUoXCJ3aWRlXCIpO1xuICAgIH1cbiAgfVxufVxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzcGFjZXNcIikub25jbGljayA9IGZ1bmN0aW9uKCkge1xuICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzcGFjZXNcIikuY2hlY2tlZCkge1xuICAgIGxheW91dEFzTGFiZWxzID0gZmFsc2U7XG4gICAgbGF5b3V0TGFiZWxzKCk7XG4gIH1cbn07XG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxhYmVsc1wiKS5vbmNsaWNrID0gZnVuY3Rpb24oKSB7XG4gIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxhYmVsc1wiKS5jaGVja2VkKSB7XG4gICAgbGF5b3V0QXNMYWJlbHMgPSB0cnVlO1xuICAgIGxheW91dExhYmVscygpO1xuICB9XG59O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
