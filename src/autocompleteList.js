(function() {
  'use strict';

  /**
   * A better multiSelect control that makes use of the material list element.
   *
   * Attributes:
   *  - ngModel:
   *     ngModel can either be an array of objects or a single object.
   *     If it is an array, each object should be in the form:
   *         {
   *             text: 'Text to display on the control',
   *             value: 'The default value of the item'
   *         }
   *     If it is an object, each key value pair becomes an option in the
   *     list such that the key represents the text value and the paired
   *     value is the default value of the item.
   *     Eg:
   *         {
   *             'Text to display on the control': 'Default value of the item'
   *             ....
   *         }
   * - options:
   *     If options is present, a select control is added to each item instead
   *     of a checkbox. options should be a plain object where each key becomes
   *     the text content of the <option> element and the value becomes the
   *     value attribute.
   */
  angular.module('autocompleteList', ['ngMaterial']).directive('autocompleteList', autocompleteList);


  function autocompleteList() {
    return {
      restrict: 'EA',
      templateUrl: templateUrlFunc,
      require: {
        ngModel: 'ngModel',
        autocompleteList: 'autocompleteList'
      },
      controllerAs: 'aclCtrl',
      bindToController: true,
      scope: {
        // Full list of all items
        items: '=',
        // An expression that converts an item into a text string
        itemText: '&'
      },
      compile: compileFunc,
      controller: ctrlFunc
    };
  }


  function templateUrlFunc(element, attrs) {
    // Clone the user's element, and save it
    // After stripping all empty text nodes from it.
    var clone = element.clone();

    attrs.$mdUserTemplate = clone;
    return 'autocompleteList.html';
  }


  function compileFunc(element, attrs) {
    // The place to insert the contents
    var listElement = element[0].querySelector('md-list-item');
    // The user's original content filtered to only return elements
    var userListContent = attrs.$mdUserTemplate[0].querySelectorAll('*');

    // Append the user's content to the template
    if (userListContent.length > 0) {
      for (var i = 0; i < userListContent.length; ++i) {
        listElement.appendChild(userListContent[i]);
      }
    }
    // If no list contents has been specified, fill it with the default
    else {
      angular.element(listElement).attr('ng-include', "'autocompleteListContents.html'");
    }

    return linkFunc;
  }


  function linkFunc(scope, element, attrs, ctrls, transclude) {
    // Attach the model controller to this directive's controller
    ctrls.autocompleteList.modelCtrl = ctrls.ngModel;
  }


  function ctrlFunc() {
    // jshint validthis: true

    //-- private variables
    var ctrl = this;

    //-- public variables
    ctrl.searchText = "";
    ctrl.modelCtrl = null;

    //-- public methods
    ctrl.selectedItemChange = selectedItemChange;
    ctrl.matchingItems = matchingItems;
    ctrl.deselectItem = deselectItem;
    ctrl.selectedItems = selectedItems;
    ctrl.itemText = ctrl.itemText || function(item) { return item; };


    function selectedItems() {
      return ctrl.modelCtrl.$modelValue;
    }


    // Called when an item is selected via the autocomplete
    function selectedItemChange(item) {
      // If the item has not been cleared
      if (item) {
        // Add the item to the model
        var value = ctrl.selectedItems().concat(item);
        ctrl.modelCtrl.$setViewValue(value);

        // Clear the selectedItem
        ctrl.searchText = '';
      }
    }


    // Iterates through all the items and checks if their text representation
    // contains the search string.
    // Automatically filters out selected items
    function matchingItems(string) {
      // Lowercase String
      string = string.toLowerCase();

      var items = [];
      ctrl.items.forEach(function(item) {
        // Skip selectedItems

        if (ctrl.selectedItems().indexOf(item) !== -1) {
          return;
        }

        // Check if the search string could be contained in the item text
        if (itemMatchesString(item, string)) {
          items.push(item);
        }
      });

      return items;
    }


    function itemMatchesString(item, string) {
      if (ctrl.itemText({item: item}).toLowerCase().indexOf(string) !== -1) {
        return true;
      }
    }


    // Called to remove an item from selectedItems
    function deselectItem(item) {
      for (var i = 0; i < ctrl.selectedItems().length; ++i) {
        if (ctrl.selectedItems()[i] === item) {
          ctrl.selectedItems().splice(i, 1);
          return;
        }
      }
    }
  }
})();
