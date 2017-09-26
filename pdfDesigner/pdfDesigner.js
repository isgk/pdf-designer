'use strict';

angular.module('myApp.pdfDesigner', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/pdf-designer', {
    templateUrl: 'pdfDesigner/pdf-designer.html',
    controller: 'PdfDesignerController'
  });
}])

.controller('PdfDesignerController',  ['$scope', 'dragulaService',
  function ($scope, dragulaService, dragula) {
    var designHelpers = {
      panelId : "panel",
      bagName: "firstBag",

      pushNewContainers : function () {
        var newContainers = document.getElementsByClassName('newContainer');
        var bag = dragulaService.find($scope, 'firstBag');
        for (var index = 0; index < newContainers.length; index++) {
          var element = newContainers[index];
          bag.drake.containers.push(element);
        }
      },

      deleteContainer : function(elemId) {
        var bag = dragulaService.find($scope, designHelpers.bagName);
        var containers = bag.drake.containers;
        containers.forEach(function(element, index, object) {
          if (element.id == elemId) {
            object.splice(index, 1);
          }
        }, this);
      },

      getRandomNumber : function () {
        return (Math.random()*1000000).toFixed();
      },

      getSibilings : function(elem) {
        var siblings = [];
        var sibling = elem.parentNode.firstChild;
        for (; sibling; sibling = sibling.nextSibling) {
            if (sibling.nodeType !== 1 || sibling === elem) continue;
            siblings.push(sibling);
        }
        return siblings;
      },

      buildHtmlTag: function(elem, elemId, elemClass, elemAttribute, elemAttributeValue, elemStyle) {
        var newElement = document.createElement(elem);
        newElement.id = elemId;
        newElement.className = elemClass;
        newElement.setAttribute(elemAttribute, elemAttributeValue);
        newElement.style = elemStyle;
        return newElement;
      }
    };

    var dragulaConfig = {
      copy: function (el, source) {  
        return source.id === designHelpers.panelId;
      },
      copySortSource: true,
      removeOnSpill: true,

      accepts: function(el, target, source, sibling) {
        if(target.id == designHelpers.panelId ) {
          return false;
        }
        else return true;
      }
    };

    dragulaService.options($scope, designHelpers.bagName, dragulaConfig);

    $scope.modifyLayout = function () { 
      console.log('Clicked');
    };

    $scope.menuOptions = [
        {
            text: 'Add Column',
            click: function ($itemScope, $event, modelValue, text, $li) {
              var elem = $event.toElement;
              var newContainerIds = [];
              newContainerIds.push(designHelpers.getRandomNumber());
              newContainerIds.push(designHelpers.getRandomNumber());
              
              var div = document.createElement('div');
              div.className = 'row';
              var childDiv = designHelpers.buildHtmlTag('div', newContainerIds[0], 'newContainer col-md-6 ng-isolate-scope', 'dragula', '"firstBag"', "border: 1px dashed #aaa; min-height: 10vh;");
              
              if (elem.id == 'scratch') {
                var elemParent = elem;
                for (var index = 0; index < elem.childNodes.length; index++) {
                  var element = elem.childNodes[index];
                  childDiv.appendChild(element.cloneNode(true));
                }

                while( elem.hasChildNodes()) {
                  elem.removeChild(elem.lastChild);
                }                
              }
              else {
              var elemParent = elem.parentNode;
                  for (var index = 0; index < elem.parentNode.childNodes.length; index++) {
                    var element = elem.parentNode.childNodes[index];
                    childDiv.appendChild(element.cloneNode(true));
                  }

                  while( elemParent.hasChildNodes()) {
                    elemParent.removeChild(elemParent.lastChild);
                  }
                }
                
                  div.appendChild(childDiv);
                  div.innerHTML += '\
                    <div id='+ newContainerIds[1] + ' class="newContainer col-md-6 ng-isolate-scope" dragula=\'"firstBag"\' style="border: 1px dashed #aaa; min-height: 10vh;"></div>\
                  ';
                  elemParent.appendChild(div);
                  designHelpers.pushNewContainers();
            }
        },
        {
            text: 'Remove Column',
            click: function ($itemScope, $event, modelValue, text, $li) {
              var elem = $event.toElement;
              if(elem.tagName !== "DIV") {
                elem = elem.parentNode;
              }
              designHelpers.deleteContainer(elem.id);
              var siblings = designHelpers.getSibilings(elem);
              var siblingChildren = siblings[0].childNodes;
              for (var index = 0; index < siblingChildren.length; index++) {
                var element = siblingChildren[index];
                elem.parentNode.parentNode.appendChild(element.cloneNode(true));
              }
              var elemParent = elem.parentNode;
              elem.parentNode.removeChild(elem);
              elemParent.parentNode.removeChild(elemParent);
            }
        },
        {
          text: 'Remove Row',
          click: function ($itemScope, $event, modelValue, text, $li) {
          }
        },
        {
          text: 'Add Row Above',
          click: function ($itemScope, $event, modelValue, text, $li) {
          }
        },
        {
          text: 'Add Row Below',
          click: function ($itemScope, $event, modelValue, text, $li) {
          }
        },
    ];
  }
]);