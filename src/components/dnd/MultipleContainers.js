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
    useSensors,
    useSensor,
    MeasuringStrategy,
    defaultDropAnimationSideEffects,
} from '@dnd-kit/core';

import { arrayMove, horizontalListSortingStrategy, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { createElement, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from 'react-dom';
import { Utils } from '@/helpers/utils';

import Item from "@/components/dndData/Item";
import Container from "@/components/dnd/Container";

import PreviewModal from "@/components/modal/PreviewModal";
import AddModal from "@/components/modal/AddModal";
import ModalId from "@/components/modal/ModalId";
import DeleteModal from "@/components/modal/DeleteModal";
import EditModal from "@/components/modal/EditModal";

import Header from "@/components/Header";
import TemplateItem from '../dndTemplate/TemplateItem';
import { TemplateContainer } from '../dndTemplate/TemplateContainer';
import { DataContainer } from '../dndData/DataContainer';
import AddTemplateModal from '../modal/AddTemplateModal';
import DeleteTemplateModal from '../modal/DeleteTemplateModal';
import { Tooltip } from 'react-tooltip';
import parse from 'html-react-parser';
import EditTemplateModal from '../modal/EditTemplateModal';

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
    coordinateGetter = Utils.multipleContainersCoordinateGetter,
    getItemStyles = () => ({}),
    wrapperStyle = () => ({}),
    minimal = false,
    modifiers,
    renderItem,
    scrollable,
    vertical = false
}) {
    const [items, setItems] = useState(
        () => ({
            Template: [
            ],
            Data: [
            ],
        })
    );

    const [containers, setContainers] = useState(Object.keys(items));
    const [activeItem, setActiveItem] = useState(null);
    const lastOverId = useRef(null);
    const recentlyMovedToNewContainer = useRef(false);
    const isSortingContainer = activeItem ? containers.includes(activeItem.id) : false;
    const [editCard, setEditCard] = useState(null);
    const [clonedItems, setClonedItems] = useState(null);
    const [isModifying, setModifying] = useState(false)
    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter,
        })
    );

    // useEffect(() => {
    //     if (process.env.NODE_ENV === 'development')
    //         console.log(items)
    // }, [items])

    useEffect(() => {

        // Load data
        (async () => {
            const template = await Utils.generateTemplate()
            const data = await Utils.generateData(itemCount)
            const newItems = { ...items, Template: template, Data: data }
            setItems(newItems)
        })()

    }, [])

    useEffect(() => {
        requestAnimationFrame(() => {
            recentlyMovedToNewContainer.current = false;
        });
    }, [items]);

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

            if (overId == null)
                return null;

            if (overId != null) {

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

    const findContainer = (id) => {

        if (id in items) {
            return id;
        }

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

    function onDragStart({ active }) {

        if (isModifying) return

        setActiveItem(active);
        setClonedItems(items);
    }

    function onDragEnd({ active, over }) {

        if (isModifying) return

        // if item was dropped outside of container
        if (active.data.current.invis && active.data.current.new) {
            setItems((items) => ({
                ...items,
                Data: items['Data'].filter((item) => item.id !== active.id),
            }));
        }

        if (active.data.current.new && !active.data.current.invis) {
            handleAddCard();
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

        const overContainer = findContainer(overId);

        if (overContainer === 'Template') {
            setActiveItem(null);
            return;
        }

        if (overContainer) {
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

        if (isModifying) return

        const overId = over?.id;

        // if item was dropped outside of container
        if ((over == null || items.length == 1) && active && active.data.current.new) {
            return setItems((items) => ({
                ...items,
                Data: items.Data.map(
                    (item) => {
                        const tempItem = { ...item };
                        if (item.id == activeItem.id)
                            tempItem.invis = true;
                        return tempItem;
                    }
                )
            }));
        }

        if (overId == null || active.id in items) {
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
                                    newItem.id = Utils.generateId();
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

        if (isModifying)
            return null

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
                label={`${activeContainer.id}`}
                columns={columns}
                style={{ height: '100%' }}
                shadow
                unstyled={false}
            >
                {items[activeContainer.id].map((data, index) => {
                    if (data.isTemplate === true)
                        return (
                            <TemplateItem
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
                        )
                    return (
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
                    )
                })}
            </Container>
        );
    }

    function handleRemoveTemplate(item) {

        setEditCard(item)

        setModifying(true);

        document.getElementById(ModalId.deletetemplate).checked = true;

    }

    function handleEditTemplate(item) {

        setEditCard(item)

        setModifying(true);

        document.getElementById(ModalId.edittemplate).checked = true;

    }

    function handleAddTemplate() {

        // Open modal to add template
        document.getElementById(ModalId.addtemplate).checked = true;

    }

    function handleAddCard() {

        // Add card to be added
        setEditCard(activeItem)

        // Open modal to add card
        document.getElementById(ModalId.addcard).checked = true;

    }

    function handleRemove(item) {

        // Add card to be removed
        setEditCard(item)

        // Set modifying to true to prevent card from being dragged when clicked
        setModifying(true);

        // Open modal to delete card
        document.getElementById(ModalId.deletecard).checked = true;

    }

    function handleEdit(item) {

        // Add card to edit
        setEditCard(item)

        // Set modifying to true to prevent card from being dragged when clicked
        setModifying(true);

        // Open modal to edit card
        document.getElementById(ModalId.editcard).checked = true;

    }

    return (
        <>
            <Tooltip
                id="tooltip"
                style={{ zIndex: 10000 }}
                render={({ content, activeAnchor }) => {
                    const Content = () => {
                        let result = null
                        if (activeAnchor?.getAttribute('data-content'))
                            result = parse(activeAnchor?.getAttribute('data-content'))
                        return result
                    }
                    return (
                        <span>
                            <Content />
                        </span>
                    )
                }}
            />

            <PreviewModal items={items} />

            <AddModal editCard={editCard} setItems={setItems} />
            <DeleteModal editCard={editCard} setItems={setItems} items={items} setModifying={setModifying} />
            <EditModal editCard={editCard} setItems={setItems} items={items} setModifying={setModifying} />

            <AddTemplateModal setItems={setItems} items={items} />
            <DeleteTemplateModal editCard={editCard} setItems={setItems} items={items} setModifying={setModifying} />
            <EditTemplateModal editCard={editCard} setItems={setItems} items={items} setModifying={setModifying} />

            <Header items={items} setItems={setItems} />

            <DndContext
                sensors={sensors}
                collisionDetection={collisionDetectionStrategy}
                measuring={{ droppable: { strategy: MeasuringStrategy.Always, }, }}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDragEnd={onDragEnd}
                cancelDrop={cancelDrop}
                onDragCancel={onDragCancel}
                modifiers={modifiers}
            >
                <div className="gap-9 xs:columns-1 lg:columns-2 h-full p-10">
                    <SortableContext
                        items={[...containers]}
                        strategy={vertical ? verticalListSortingStrategy : horizontalListSortingStrategy}
                    >

                        {/* using map so that container can be drag from left and right */}
                        {containers.map((containerId) => {
                            if (containerId == 'Template')
                                return (
                                    <TemplateContainer
                                        key={containerId}
                                        items={items}
                                        onAddTemplate={handleAddTemplate}
                                        disabled={isSortingContainer}
                                        columns={columns}
                                        scrollable={scrollable}
                                        containerStyle={containerStyle}
                                        getItemStyles={getItemStyles}
                                        handle={handle}
                                        wrapperStyle={wrapperStyle}
                                        renderItem={renderItem}
                                        getIndex={getIndex}
                                        onRemove={handleRemoveTemplate}
                                        onEdit={handleEditTemplate}
                                    />
                                )
                            return (
                                <DataContainer
                                    key={containerId}
                                    items={items}
                                    onAddTemplate={handleAddTemplate}
                                    disabled={isSortingContainer}
                                    columns={columns}
                                    scrollable={scrollable}
                                    containerStyle={containerStyle}
                                    getItemStyles={getItemStyles}
                                    handle={handle}
                                    wrapperStyle={wrapperStyle}
                                    renderItem={renderItem}
                                    getIndex={getIndex}
                                    isSortingContainer={isSortingContainer}
                                    handleRemove={handleRemove}
                                    handleEdit={handleEdit}
                                />
                            )

                        })}

                    </SortableContext>
                </div>

                {/* Dragging overlay */}
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

            </DndContext >


        </>
    );

}
