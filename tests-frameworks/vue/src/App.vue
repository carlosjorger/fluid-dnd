<script setup lang="ts">
import ExampleVerticalListWithChildElements from "./components/ExampleVerticalListWithChildElements.vue";
import ExampleHorizontalList from "./components/ExampleHorizontalList.vue";
import ExampleVertialScrollList from "./components/ExampleVertialScrollList.vue";
import ExampleHorizontalListWithMixedStyles from "./components/ExampleHorizontalListWithMixedStyles.vue";
import ExampleHorizontalScrollList from "./components/ExampleHorizontalScrollList.vue";
import ExampleCounterList from "./components/ExampleCounterList.vue";
import ExampleVerticalListWithHandler from "./components/ExampleVerticalListWithHandler.vue";
import ExampleGroupOflist from "./components/ExampleGroupOflist.vue";
import ExampleGroupOfListWithStyles from "./components/ExampleGroupOfListWithStyles.vue";
// import ExampleOfPokemonList from "./components/ExampleOfPokemonList.vue";
import ExampleTable from "./components/ExampleTable.vue";
import ExampleListWithRemove from "./components/ExampleListWithRemove.vue";
import ExampleListGroupDroppableAndDraggableClasses from './components/ExampleListGroupDroppableAndDraggableClasses.vue'
import ExampleCompoundDroppable from './components/ExampleCompoundDroppable.vue'
// import ExampleHorizontalCounterList from "./components/ExampleHorizontalCounterList.vue";
import ExampleInsertList from "./components/ExampleInsertList.vue";
import ExampleInsertHorizontalList from "./components/ExampleInsertHorizontalList.vue";
import ExampleCompoundDroppableEvent from './components/ExampleCompoundDroppableEvent.vue'
import ExampleInsideDialog from "./components/ExampleInsideDialog.vue";

</script>

<template>
  <ExampleVerticalListWithChildElements
    id="example-vertical-list-with-child-elements"
  />
  <ExampleHorizontalList id="example-horizontal-list-with-child-elements" />
  <ExampleVerticalListWithHandler id="example-horizontal-list-with-handler" />
  <ExampleVertialScrollList id="example-vertical-scroll-list" />
  <ExampleHorizontalScrollList id="example-horizontal-scroll-list" />
  <ExampleHorizontalListWithMixedStyles
    id="example-horizontal-with-mixed-styles"
  />
  <ExampleGroupOfListWithStyles id="example-vertical-with-mixed-styles-gaps" />
  <div class="example-cols">
    <ExampleCounterList id="example-counter-list" />
  </div>
  <ExampleGroupOflist id="example-group-list" />
  <ExampleTable />
  <ExampleListWithRemove id="example-lists-with-remove" />
  <ExampleListGroupDroppableAndDraggableClasses id="example-list-group-droppable-and-draggable-classes" />
  <ExampleCompoundDroppable id="example-compound-droppable" />
  <ExampleInsertList id="example-insert-list" />
  <ExampleInsertHorizontalList id="example-insert-horizontal-list" />
  <ExampleCompoundDroppableEvent id="example-compound-droppable" />
  <ExampleInsideDialog id="example-inside-dialog" />
  
</template>
<style>
.example-cols {
  display: flex;
  flex-direction: row;
  column-gap: 10px;
}
</style>
