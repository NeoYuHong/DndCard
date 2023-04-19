import { Utils } from "@/helpers/utils";
import { useDraggable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";

const { Item } = require("./Item");

export function DraggableItem({
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
    } = useDraggable({
        id,
        data
    })


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
            {/* {isDragging && data.isTemplate &&
                <li
                    className={classNames(
                    )}
                    style={
                        {
                            '--color': Utils.getColor(data.color),
                        }
                    }
                >
                    <div
                        className={classNames(
                            styles.Item,
                            isDragging && styles.dragging,
                            Utils.getColor(data.color) && styles.color
                        )}
                    >

                        <div className="col-span-10">
                            <div>

                                <p>
                                    <span className="font-bold">Title</span>: {data.title}
                                </p>

                                <p>
                                    <span className="font-bold">Description</span>: {data.description}
                                </p>

                                <p>
                                    <span className="font-bold">Value</span>: {data.value * data.multiplier}
                                </p>
                            </div>

                        </div>

                    </div>
                </li>} */}
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


