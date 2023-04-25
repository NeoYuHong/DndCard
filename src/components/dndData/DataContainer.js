import DroppableContainer from "@/components/dnd/DroppableContainer";
import SortableItem from "./SortableItem";

const { SortableContext, verticalListSortingStrategy } = require("@dnd-kit/sortable");

export const DataContainer = ({
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
    isSortingContainer,
    handleRemove,
    handleEdit
}) => {

    const containerId = 'Data';

    return (
        <DroppableContainer
            key={containerId}
            id={containerId}
            label={`${containerId} (${items.Data.filter((data) => data.id != 'tempfix').length})`}
            columns={columns}
            items={items[containerId]}
            scrollable={scrollable}
            style={containerStyle}
            onAddTemplate={onAddTemplate}

        >
            <SortableContext items={items[containerId]} strategy={verticalListSortingStrategy}>
                {items[containerId].map((data, index) => {
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
    )
}

