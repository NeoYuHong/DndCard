import { DroppableContainer } from "./DroppableContainer";
import { Item } from "./Item";
import { Container } from "./Container";
import { SortableItem } from "./SortableItem";

import {
    closestCenter,
    pointerWithin,
    rectIntersection,
    DndContext,
    DragOverlay,
    getFirstCollision,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useDroppable,
    useSensors,
    useSensor,
    MeasuringStrategy,
    closestCorners,
    defaultDropAnimationSideEffects,
} from '@dnd-kit/core';

import { arrayMove, SortableContext, horizontalListSortingStrategy, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal, unstable_batchedUpdates } from 'react-dom';
import { Utils } from '@/helpers/utils';
import AddModal from "../../components/modal/AddModal";
import { multipleContainersCoordinateGetter } from "./multipleContainersCoordinateGetter";
import PreviewModal from "../modal/PreviewModal";
import { DraggableItem } from "./DraggableItem";
import ModalId from "../modal/ModalId";
import DeleteModal from "../modal/DeleteModal";
import EditModal from "../modal/EditModal";

const PLACEHOLDER_ID = 'placeholder';

const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
        styles: {
            active: {
                opacity: '0.5',
            },
        },
    }),
};

export function MultipleContainers({
    adjustScale = false,
    itemCount = 0,
    cancelDrop,
    columns,
    handle = false,
    containerStyle,
    coordinateGetter = multipleContainersCoordinateGetter,
    getItemStyles = () => ({}),
    wrapperStyle = () => ({}),
    minimal = false,
    modifiers,
    renderItem,
    strategy = verticalListSortingStrategy,
    trashable = false,
    vertical = false,
    scrollable,
}) {
    const [items, setItems] = useState(
        () => ({
            Template: [

            ],
            Data: [
            ],
        })
    );

    useEffect(() => {
        const _a = async () => {
            const template = await Utils.genTemplate()
            const data = await Utils.genData(itemCount)
            const newItems = { ...items, Template: template, Data: data }
            setItems(newItems)
        }
        _a();
        // Utils.genTemplate().then((Template) => {
        //     const newItems = { ...items, Template, }
        //     // items.Template = template;
        // })
    }, [])

    const [containers, setContainers] = useState(
        Object.keys(items)
    );
    const [activeItem, setActiveItem] = useState(null);
    const lastOverId = useRef(null);
    const recentlyMovedToNewContainer = useRef(false);
    const isSortingContainer = activeItem ? containers.includes(activeItem.id) : false;
    const [editCard, setEditCard] = useState(null);

    useEffect(() => {
        console.info(items)
    }, [items])

    const TRASH_ID = 'void';

    /**
     * Custom collision detection strategy optimized for multiple containers
     *
     * - First, find any droppable containers intersecting with the pointer.
     * - If there are none, find intersecting containers with the active draggable.
     * - If there are no intersecting containers, return the last matched intersection
     *
     */
    const collisionDetectionStrategy = useCallback(
        (args) => {
            if (activeItem && activeItem.id in items) {
                return closestCenter({
                    ...args,
                    droppableContainers: args.droppableContainers.filter(
                        (container) => container.id in items
                    ),
                });
            }

            // Start by finding any intersecting droppable
            const pointerIntersections = pointerWithin(args);
            const intersections =
                pointerIntersections.length > 0
                    ? // If there are droppables intersecting with the pointer, return those
                    pointerIntersections
                    : rectIntersection(args);
            let overId = getFirstCollision(intersections, 'id');

            // if (overId == null) {
            //     return []
            // }

            if (overId != null) {
                if (overId === TRASH_ID) {
                    // If the intersecting droppable is the trash, return early
                    // Remove this if you're not using trashable functionality in your app
                    return intersections;
                }

                if (overId in items) {
                    const containerItems = items[overId];

                    // If a container is matched and it contains items (columns 'A', 'B', 'C')
                    if (containerItems.length > 0) {
                        // Return the closest droppable within that container
                        overId = closestCenter({
                            ...args,
                            droppableContainers: args.droppableContainers.filter(
                                (container) => container.id !== overId &&
                                    containerItems.some(item => item.id === container.id)
                                // containerItems.includes(container.id)
                            ),
                        })[0]?.id;

                    }
                }

                lastOverId.current = overId;

                return [{ id: overId }];
            }

            // When a draggable item moves to a new container, the layout may shift
            // and the `overId` may become `null`. We manually set the cached `lastOverId`
            // to the id of the draggable item that was moved to the new container, otherwise
            // the previous `overId` will be returned which can cause items to incorrectly shift positions
            if (recentlyMovedToNewContainer.current) {
                lastOverId.current = activeItem.id;
            }

            // If no droppable is matched, return the last match
            return lastOverId.current ? [{ id: lastOverId.current }] : [];
        },
        [activeItem, items]
    );
    const [clonedItems, setClonedItems] = useState(null);
    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter,
        })
    );
    const findContainer = (id) => {

        if (id in items) {
            return id;
        }

        // return Object.keys(items).find((key) => items[key].includes(id));
        return Object.keys(items).find((key) => items[key].some(item => item.id === id));
    };

    const getIndex = (id) => {

        const container = findContainer(id);

        if (!container) {
            return -1;
        }

        const index = items[container].indexOf(id);

        return index;
    };

    const onDragCancel = () => {
        if (clonedItems) {
            // Reset items to their original state in case items have been
            // Dragged across containers
            setItems(clonedItems);
        }

        setActiveItem(null);
        setClonedItems(null);
    };

    useEffect(() => {
        requestAnimationFrame(() => {
            recentlyMovedToNewContainer.current = false;
        });
    }, [items]);

    return (
        <>
            <PreviewModal items={items} />
            <DeleteModal editCard={editCard} setItems={setItems} items={items} />
            <EditModal editCard={editCard} setItems={setItems} items={items} />
            <AddModal editCard={editCard} setItems={setItems} items={items} />
            {/* <div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                <a class="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
                    dw
                </a>
                <div class="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
                    <a class="mr-5">First Link</a>
                    <a class="mr-5">Second Link</a>
                    <a class="mr-5">Third Link</a>
                    <a class="mr-5">Fourth Link</a>
                </div>
                <button class="inline-flex items-center bg-yellow-500 border-0 py-1 px-3 mt-4 md:mt-0">Click Me</button>
            </div> */}

            <div class="bg-[#2a303c] rounded-xl p-6 h-fit flex-wrap flex-col md:flex-row items-center">

                <div class="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center sm:justify-end">
                    <div className="mr-5">
                        <label htmlFor="previewcard" className="btn w-full">View Table</label>
                    </div>

                    <div className="mr-5">
                        <button className={`btn w-full`} disabled={items.length < 1} onClick={() => {

                            // const parsed = cards.map(({ title, description, value }, index) => ({ title, description, value, SN: index + 1 }));
                            Utils.exportToExcel(Utils.parseCardData(items.Data))
                        }}>Export</button>
                    </div>
                </div>
            </div>

            {/* <div className="overflow-hidden flex-1"> */}
            <div className="xl:pb-10">
                <DndContext
                    sensors={sensors}
                    collisionDetection={collisionDetectionStrategy}
                    measuring={{
                        droppable: {
                            strategy: MeasuringStrategy.Always,
                        },
                    }}
                    onDragStart={onDragStart}
                    onDragOver={onDragOver}
                    onDragEnd={onDragEnd}
                    cancelDrop={cancelDrop}
                    onDragCancel={onDragCancel}
                    modifiers={modifiers}
                >
                    <div
                        style={{
                            // display: 'inline-grid',
                            // display: 'flex',
                            // boxSizing: 'border-box',
                            // padding: 20,
                            // gridAutoFlow: vertical ? 'row' : 'column',
                            height: '100%',
                        }}
                        className="gap-9 sm:columns-1 xl:columns-2"
                    >
                        <SortableContext
                            items={[...containers, PLACEHOLDER_ID]}
                            strategy={
                                vertical
                                    ? verticalListSortingStrategy
                                    : horizontalListSortingStrategy
                            }
                        >
                            {containers.map((containerId) => (
                                <DroppableContainer
                                    key={containerId}
                                    id={containerId}
                                    label={minimal ? undefined : `${containerId} ${containerId === 'Data' ? `(${items.Data.length - 1})` : ''}`}
                                    columns={columns}
                                    items={items[containerId]}
                                    scrollable={scrollable}
                                    style={containerStyle}
                                    unstyled={minimal}
                                // onRemove={() => handleRemove(containerId)}
                                >
                                    <SortableContext items={items[containerId]} strategy={strategy}>
                                        {items[containerId].map((data, index) => {
                                            if (containerId === 'Template') {
                                                data.isTemplate = true;
                                                return (
                                                    <DraggableItem
                                                        disabled={isSortingContainer}
                                                        key={data.id}
                                                        id={data.id}
                                                        data={data}
                                                        index={index}
                                                        handle={handle}
                                                        style={getItemStyles}
                                                        wrapperStyle={wrapperStyle}
                                                        renderItem={renderItem}
                                                        containerId={containerId}
                                                        getIndex={getIndex}
                                                        onRemove={() => handleRemove(data)}
                                                        onEdit={() => handleEdit(data)}
                                                    />
                                                );
                                            }
                                            return (
                                                <SortableItem
                                                    disabled={isSortingContainer}
                                                    key={data.id}
                                                    id={data.id}
                                                    data={data}
                                                    index={index}
                                                    handle={handle}
                                                    style={getItemStyles}
                                                    wrapperStyle={wrapperStyle}
                                                    renderItem={renderItem}
                                                    containerId={containerId}
                                                    getIndex={getIndex}
                                                    onRemove={() => handleRemove(data)}
                                                    onEdit={() => handleEdit(data)}
                                                />
                                            );
                                        })}
                                    </SortableContext>
                                </DroppableContainer>
                            ))}

                        </SortableContext>
                    </div>
                    {typeof document !== 'undefined' && createPortal(
                        <DragOverlay adjustScale={adjustScale} dropAnimation={dropAnimation}>
                            {activeItem
                                ? containers.includes(activeItem.id)
                                    ? renderContainerDragOverlay(activeItem)
                                    : renderSortableItemDragOverlay(activeItem)
                                : null}
                        </DragOverlay>,
                        document.body
                    )}
                    {trashable && activeItem && !containers.includes(activeItem.id) ? (
                        <Trash id={TRASH_ID} />
                    ) : null}
                </DndContext >
            </div >

        </>
    );

    function onDragStart({ active, over }) {
        setActiveItem(active);
        setClonedItems(items);
    }

    function onDragEnd({ active, over }) {

        // const _item = items.Data.find((data) => data.id === active.id);
        // if (_item.invis && _item.new) {
        if (active.data.current.invis && active.data.current.new) {
            setItems((items) => ({
                ...items,
                Data: items['Data'].filter((data) => data.id !== active.id),
            }));
        }

        if (active.data.current.new && !active.data.current.invis) {

            handleAddCard();

            // Add without modal
            // setItems((items) => ({
            //     ...items,
            //     Data: items['Data'].map((data) => {
            //         delete data.new;
            //         return data;
            //     }),
            // }));
        }

        if (active.id in items && over?.id) {
            setContainers((containers) => {

                const activeIndex = containers.indexOf(active.id);
                const overIndex = containers.indexOf(over.id);

                return arrayMove(containers, activeIndex, overIndex);
            });
        }

        const activeContainer = findContainer(active.id);

        if (!activeContainer) {
            setActiveItem(null);
            return;
        }

        const overId = over?.id;

        if (overId == null) {
            setActiveItem(null);
            return;
        }

        if (overId === TRASH_ID) {
            setItems((items) => ({
                ...items,
                [activeContainer]: items[activeContainer].filter(
                    (data) => data.id !== activeItem.id
                ),
            }));
            setActiveItem(null);
            return;
        }

        if (overId === PLACEHOLDER_ID) {
            const newContainerId = getNextContainerId();

            unstable_batchedUpdates(() => {
                setContainers((containers) => [...containers, newContainerId]);
                setItems((items) => ({
                    ...items,
                    [activeContainer]: items[activeContainer].filter(
                        (data) => data.id !== activeItem.id
                    ),
                    [newContainerId]: [active.id],
                }));
                setActiveItem(null);
            });
            return;
        }

        const overContainer = findContainer(overId);

        // Template block
        if (overContainer === 'Template') {
            setActiveItem(null);
            return;
        }

        if (overContainer) {
            // const activeIndex = items[activeContainer].indexOf(active.id);
            // const overIndex = items[overContainer].indexOf(overId);
            const overIndex = items[overContainer].findIndex(item => item.id === overId);
            const activeIndex = items[activeContainer].findIndex(item => item.id === active.id);

            if (activeIndex !== overIndex) {
                setItems((items) => ({
                    ...items,
                    [overContainer]: arrayMove(
                        items[overContainer],
                        activeIndex,
                        overIndex
                    ),
                }));
            }
        }

        setActiveItem(null);
    }

    function onDragOver({ active, over }) {

        const overId = over?.id;

        // || over?.id == 'Data'
        if ((over == null || items.length == 1) && active && active.data.current.new) {
            return setItems((items) => {
                return {
                    ...items,
                    Data: items.Data.map(
                        (item) => {
                            const tempItem = { ...item };
                            if (item.id == activeItem.id) {
                                tempItem.invis = true;
                            }
                            return tempItem;
                        }
                    ),
                };
            });
        }

        if (overId == null || overId === TRASH_ID || active.id in items) {
            return;
        }

        const overContainer = findContainer(overId);
        const activeContainer = findContainer(active.id);

        if (!overContainer || !activeContainer) {
            return;
        }

        const activeIndex = items[activeContainer].findIndex(item => item.id === active.id);
        if (items[activeContainer][activeIndex].invis) {

            setItems((items) => {
                return ({
                    ...items,
                    [activeContainer]: items[activeContainer].map((item) => {
                        if (item.id == active.id)
                            item.invis = false;
                        return item
                    })
                })
            });
        }

        if (activeContainer !== overContainer) {

            setItems((items) => {
                const activeItems = items[activeContainer];
                const overItems = items[overContainer];
                let overIndex = overItems.findIndex(item => item.id === overId);
                const activeIndex = activeItems.findIndex(item => item.id === active.id);

                let newIndex;

                if (overId in items) {
                    newIndex = overItems.length + 1;
                } else {
                    const isBelowOverItem = over &&
                        active.rect.current.translated &&
                        active.rect.current.translated.top >
                        over.rect.top + over.rect.height;

                    const modifier = isBelowOverItem ? 1 : 0;

                    newIndex =
                        overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
                }

                recentlyMovedToNewContainer.current = true;

                // Template block
                if (overContainer == 'Template')
                    return items;

                if (items[activeContainer][activeIndex].isTemplate && items) {

                    const tempItems = { ...items };

                    tempItems[activeContainer][activeIndex].isTemplate = false;
                    tempItems[activeContainer][activeIndex].new = true;

                    // Create new item to replace template card
                    return {
                        ...items,
                        [activeContainer]: items[activeContainer].map(
                            (item) => {
                                const newItem = { ...item };
                                if (item.id == active.id) {
                                    newItem.id = Utils.genId();
                                    newItem.isTemplate = true;
                                    delete newItem.new;
                                }
                                return newItem;
                            }
                        ),
                        [overContainer]: [
                            ...items[overContainer].slice(0, newIndex),
                            tempItems[activeContainer][activeIndex],
                            ...items[overContainer].slice(
                                newIndex,
                                items[overContainer].length
                            ),
                        ],
                    };
                }

                return {
                    ...items,
                    [activeContainer]: items[activeContainer].filter(
                        (item) => item.id !== active.id
                    ),
                    [overContainer]: [
                        ...items[overContainer].slice(0, newIndex),
                        tempItems[activeContainer][activeIndex],
                        ...items[overContainer].slice(
                            newIndex,
                            items[overContainer].length
                        ),
                    ],
                };
            });
        };
    }

    function renderSortableItemDragOverlay(active) {

        const { id, } = active

        const data = { ...active.data.current }
        delete data.sortable

        return (
            <Item
                data={data}
                id={id}
                handle={handle}
                style={getItemStyles({
                    containerId: findContainer(id),
                    overIndex: -1,
                    index: getIndex(id),
                    value: data,
                    isSorting: true,
                    isDragging: true,
                    isDragOverlay: true,
                })}
                color={Utils.getColor(data.color)}
                wrapperStyle={wrapperStyle({ index: 0 })}
                renderItem={renderItem}
                dragOverlay
            />
        );
    }

    function renderContainerDragOverlay(activeContainer) {

        return (
            <Container
                label={`Column ${activeContainer.id}`}
                columns={columns}
                style={{
                    height: '100%',
                }}
                shadow
                unstyled={false}
            >
                {items[activeContainer.id].map((data, index) => (
                    <Item
                        key={data.id}
                        id={data.id}
                        data={data}
                        handle={handle}
                        style={getItemStyles({
                            containerId: activeContainer.id,
                            overIndex: -1,
                            index: getIndex(data.id),
                            value: data,
                            isDragging: false,
                            isSorting: false,
                            isDragOverlay: false,
                        })}
                        color={Utils.getColor(data.color)}
                        wrapperStyle={wrapperStyle({ index })}
                        renderItem={renderItem}
                    />
                ))}
            </Container>
        );
    }

    function handleAddCard() {
        setEditCard(activeItem)
        document.getElementById(ModalId.addcard).checked = true;
    }

    function handleRemove(item) {
        setEditCard(item)
        document.getElementById(ModalId.deletecard).checked = true;
    }

    function handleEdit(item) {
        setEditCard(item)
        document.getElementById(ModalId.editcard).checked = true;
        // setItems((items) => ({
        //     ...items,
        //     Data: items['Data'].filter((data) => data.id !== id),
        // }));
    }

    function getNextContainerId() {
        const containerIds = Object.keys(items);
        const lastContainerId = containerIds[containerIds.length - 1];

        return String.fromCharCode(lastContainerId.charCodeAt(0) + 1);
    }

    function Trash({ id }) {
        const { setNodeRef, isOver } = useDroppable({
            id,
        });

        return (
            <div
                ref={setNodeRef}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'fixed',
                    left: '50%',
                    marginLeft: -150,
                    bottom: 20,
                    width: 300,
                    height: 60,
                    borderRadius: 5,
                    border: '1px solid',
                    borderColor: isOver ? 'red' : '#DDD',
                }}
            >
                Drop here to delete
            </div>
        );
    }

}


