import { getConfig } from "./utils/config";
import { ListCondig } from ".";
import { Config } from ".";
import useDroppable from "./useDroppable";
import HandlerPublisher from "@/core/HandlerPublisher";
import ConfigHandler from "./configHandler";
import { observeMutation } from "./utils/observer";
import { addClass } from "./utils/dom/classList";
import { DROPPABLE_CLASS } from "./utils/classes";
import { isTempElement } from "./utils/tempChildren";

export default function dragAndDrop<T>(listCondig:ListCondig<T>,handlerPublisher: HandlerPublisher, config?: Config<T>, indexAttr: string ='index' ) {
    let removeAtFromElements = [] as ((index: number) => void)[];
    let insertAtFromElements = [] as ((index: number, value: T) => void)[];

    const coreConfig = getConfig(listCondig, config)
      
    const removeAt = (index: number) => {
        for (const removeAtFromElement of removeAtFromElements) {
            removeAtFromElement(index);
        }
    }
    const insertAt = (index: number,  value: T) => {
        const listLegth = coreConfig.onGetLegth()
        if (listLegth === 0) {
            listCondig.insertToListEmpty(coreConfig, index, value)
        }
        else{
            for (const insertAtFromElement of insertAtFromElements) {
                insertAtFromElement(index, value);
            }
        }
    }
    const makeChildrensDraggable = (parent: HTMLElement|undefined) => {
        const [ removeAtFromElementList, insertAtFromElementList ] = useDroppable(coreConfig, handlerPublisher, parent, indexAttr)
        removeAtFromElements = removeAtFromElementList;
        insertAtFromElements = insertAtFromElementList;
    };
    const childrenMutationFilter = (mutation: MutationRecord) => {
        const addedNodes = mutation.addedNodes.values().filter((element) => !isTempElement(element)).toArray();
        const removedNodes = mutation.removedNodes.values().filter((element) => !isTempElement(element)).toArray();
        return addedNodes.length > 0 || removedNodes.length > 0
    };
    const observeChildrens = (parent: HTMLElement) => {
        observeMutation(
          () => {
            makeChildrensDraggable(parent)
          },
          parent,
          { childList: true },
          childrenMutationFilter
        );
    };
    const makeDroppable = (parent: HTMLElement) => {
        addClass(parent, DROPPABLE_CLASS)
    };
    const addConfigHandler = (parent: HTMLElement) => {
        ConfigHandler.addConfig(
            parent,
            coreConfig
        );
    };
    const onChangeParent = (parent: HTMLElement | undefined) => {
        if (!parent) {
            return;
        }
        makeDroppable(parent);
        addConfigHandler(parent);
        observeChildrens(parent);
        makeChildrensDraggable(parent)
        ConfigHandler.removeObsoleteConfigs();
    }
    return [removeAt, insertAt, onChangeParent] as const
}