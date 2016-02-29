<a name="Autocomplete list"></a>
## Autocomplete list
A better multiselect control that makes use of the material list element.

**Kind**: global variable  

| Param | Type | Description |
| --- | --- | --- |
| ngModel | <code>Array.&lt;Object&gt;</code> | Required. Array of selected objects. These are tracked via reference. |
| items | <code>Array.&lt;Object&gt;</code> | Entire list of items to select from. |
| itemText | <code>Expression</code> | Expression to convert an item object into a single string to be displayed in the autocomplete and the list. The item is accessed via the `item` property. |

**Example**  
```js
<autocomplete-list
      ng-model="ctrl.selectedPeople"
      items="ctrl.allPeople"
      item-text="item.firstName + ' ' + item.lastName">
    </autocomplete-list>
```
