const { SortableContext, verticalListSortingStrategy } = require("@dnd-kit/sortable");

import DroppableContainer from "@/components/dnd/DroppableContainer";
import DraggableItem from "@/components/dndTemplate/DraggableItem";

export const TemplateContainer = ({
    items,
    onAddTemplate,
    disabled,
    columns,
    scrollable,
    getItemStyles,
    containerStyle,
    wrapperStyle,
    renderItem,
    handle,
    getIndex,
    onRemove,
    onEdit
}) => {

    const containerId = 'Template';

    return (
        <DroppableContainer
            key={containerId}
            id={containerId}
            label={containerId}
            columns={columns}
            items={items[containerId]}
            scrollable={scrollable}
            style={containerStyle}
            onAddTemplate={onAddTemplate}

        >
            <SortableContext items={items[containerId]} strategy={verticalListSortingStrategy}>
                {items[containerId].map((data, index) => {
                    data.isTemplate = true;
                    return (
                        <DraggableItem
                            disabled={disabled}
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
                            onRemove={() => onRemove(data)}
                            onEdit={() => onEdit(data)}
                        />
                    );
                })}
            </SortableContext>
        </DroppableContainer>
    )
}

