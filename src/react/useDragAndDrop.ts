import { useEffect, useRef } from "react";
import { Config } from "../core";
import HandlerPublisher from "../core/HandlerPublisher";
import { dragAndDrop } from "../index";
import { useReactListConfig } from "./utils/ReactLilstConfig";

/**
 * Create the parent element of the draggable children and all the drag and drop events and styles.
 *
 * @template T - Type of the items.
 * @param items - List of data to drag and drop.
 * @param config - Configuration of drag and drop tool.
 * @returns The reference of the parent element and function to remove an element.
 */

const handlerPublisher = new HandlerPublisher()
export default function useDragAndDrop<T, E extends HTMLElement>( items: T[], config?: Config<T>) {
  const parent = useRef<E>(null);
  const [itemsState, setItemsState, listCondig] = useReactListConfig(items, parent)
  // TODO: test with useMemo
  const [removeAt, insertAt, onChangeParent] = dragAndDrop(listCondig, handlerPublisher, config, 'data-index', false)
  useEffect(() => {
    onChangeParent(parent.current);
  })
  return [parent, itemsState, setItemsState ,insertAt, removeAt] as const;
}
