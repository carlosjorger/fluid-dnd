// @ts-ignore  
import { Ref, ref, watch } from "vue";
import { Config } from "../core";
import HandlerPublisher from "../core/HandlerPublisher";
import { VueListCondig } from "./utils/VueListCondig";
import { dragAndDrop } from "../index";

/**
 * Create the parent element of the draggable children and all the drag and drop events and styles.
 *
 * @template T - Type of the items.
 * @param items - List of data to drag and drop.
 * @param config - Configuration of drag and drop tool.
 * @returns The reference of the parent element and function to remove an element.
 */

const handlerPublisher = new HandlerPublisher()
export default function useDragAndDrop<T>(items: Ref<T[]>, config?: Config<T>) {
  const parent = ref<HTMLElement | undefined>();
  var listCondig = new VueListCondig<T>(items, parent)

  const [removeAt, insertAt, onChangeParent] = dragAndDrop(listCondig, handlerPublisher, config)
 
  watch(parent, () => {
    onChangeParent(parent.value);
  });
  return [ parent, insertAt, removeAt ] as const;
}
