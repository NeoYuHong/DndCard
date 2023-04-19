import { Utils } from "@/helpers/utils";
import { useDraggable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";

const { Item } = require("./Item");

export function SortableItem({
    disabled,
    id,
    data,
    index,
    handle,
    renderItem,
    style,
    containerId,
    getIndex,
    wrapperStyle,
    onRemove,
    onEdit
}) {
    const {
        setNodeRef,
        setActivatorNodeRef,
        listeners,
        isDragging,
        isSorting,
        over,
        overIndex,
        transform,
        transition,
    } = useSortable({
        id,
        data
    });

    const mounted = useMountStatus();
    const mountedWhileDragging = isDragging && !mounted;

    return (
        <>
            <Item
                ref={disabled ? undefined : setNodeRef}
                data={data}
                id={id}
                dragging={isDragging}
                sorting={isSorting}
                handle={handle}
                handleProps={handle ? { ref: setActivatorNodeRef } : undefined}
                index={index}
                wrapperStyle={wrapperStyle({ index })}
                style={style({
                    index,
                    value: id,
                    isDragging,
                    isSorting,
                    overIndex: over ? getIndex(over.id) : overIndex,
                    containerId,
                })}
                color={Utils.getColor(data.color)}
                transition={transition}
                transform={transform}
                fadeIn={mountedWhileDragging}
                listeners={listeners}
                renderItem={renderItem}
                onRemove={onRemove}
                onEdit={onEdit}
            />
        </>
    );
}

function useMountStatus() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setIsMounted(true), 500);

        return () => clearTimeout(timeout);
    }, []);

    return isMounted;
}


