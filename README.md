# Section Change

The Section Change plugin can be used when you have multiple section in one single page and want to change the url and meta datas dinamicly, based on user interaction.

## Setup

Include the jQuery library and the section_change.js file to your page:

```html
<!-- jQuery library (served from Google) -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js"></script>
<!-- inSlider Javascript file -->
<script src="section_change.js"></script>
``` 

## Markup

### Step 1

Create a main container and give it an identifier, then you can create as many children as you wish, to be the row section items.

```html
<div id="section-change">
  <div class="row row-1">
    ...
  </div>
  <div class="row row-2">
      ...
  </div>
  ...
</div>
``` 

### Step 2

Inside of each row, add a new div selector with a data section attribute.

```html
<div id="section-change">
  <div class="row row-1">
    <div class="section" data-section="section-1">
    ...
    </div>
  </div>
  <div class="row row-2">
    <div class="section" data-section="section-2">
      ...
    </div>
  </div>
  ...
</div>
```

### Step 3

To accomplish the metadata changes, create inside of each section, an empty div with the title and description values of this section.

```html
<div id="section-change">
  <div class="row row-1">
    <div class="section" data-section="section-1">
    ...
      <div class="meta-data" style="display: none;">
        <div class="title">Title: Section 1</div>
        <div class="description">Description: Section 1</div>
      </div>
    </div>
  </div>
  <div class="row row-2">
    <div class="section" data-section="section-2">
      ...
      <div class="meta-data" style="display: none;">
        <div class="title">Title: Section 4</div>
        <div class="description">Description: Section 4</div>
      </div>
    </div>
  </div>
  ...
</div>
```

### Usage

Use the .sectionChange() function to trigger the plugin on your sections main container. Make sure to use the window load function to prevent the script to be executed before the rest of the content has being created.

```javascript
$(window).on('load', function() {
  $('#section-change').sectionChange();
});
```

## Plugin Options

| Name               |  Type   | Default Value  | Description       |
| :----------------- |:-------:|:--------------:| -----------------:|
| animationTime      | number  | 500            | The animation time |
| changePath         | boolean | false          | If setted to true, the plugin will change the path instead of hash. In order to the initial loading of the page work properly, you will need to create by your own, the redirects pointing to the main url plus hash. Ex: http://www.site.com/section-1 > http://www.site.com/#section-1 |
| dataSectionName    | string  | "section"      | Define the data name to be find inside the section row |
| discount           | string, number, function | 0              | Sets a discount to be calculated to the section top position. Usually used with fixed menu. If setted as function, make sure to return a numeric value. |
| ignore             | string  | ""             | The section row selector to be ignored. |
| linksSelector      | string  | ""             | The selector of any anchor to the sections. Ex: if you have a link like <a id="anchor" href="#section-1">, set this option to "#anchor".  |
| rowDescription     | string  | ".description" | The selector where the section description is defined. |
| rowTitle           | string  | ".title"       | The selector where the section title is defined. |
| sectionRowSelector | string  | ".row"         | The section row selector. |

### Events

When the section is changed, the `sc.changed` event fired and the default `event.relatedTarget` is updated to the new section row. To use it, do the following.

```javascript
$(document).ready(function(){
  $('#section-change').on("sc.changed", function(e) {
    console.log(e.relatedTarget);
  });
});
```