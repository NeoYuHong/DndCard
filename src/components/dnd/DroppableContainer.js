import Container from '@/components/dnd/Container';
import { defaultAnimateLayoutChanges, useSortable, } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';

const animateLayoutChanges = (args) =>
    defaultAnimateLayoutChanges({ ...args, wasDragging: true });

export default function DroppableContainer({
    children,
    columns = 1,
    disabled,
    id,
    items,
    onAddTemplate,
    style,
    ...props
}) {
    const {
        active,
        attributes,
        isDragging,
        listeners,
        over,
        setNodeRef,
        transition,
        transform,
    } = useSortable({
        id,
        data: {
            type: 'container',
            children: items,
        },
        animateLayoutChanges,
    });
    const isOverContainer = over
        ? (id === over.id && active?.data.current?.type !== 'container') ||
        items.includes(over.id)
        : false;

    return (
        <Container
            ref={disabled ? undefined : setNodeRef}
            style={{
                ...style,
                transition,
                transform: CSS.Translate.toString(transform),
                opacity: isDragging ? 0.5 : undefined,
            }}
            hover={isOverContainer}
            handleProps={{
                ...attributes,
                ...listeners,
            }}
            id={id}
            items={items}
            onAddTemplate={onAddTemplate}
            columns={columns}
            {...props}
        >
            {children}
        </Container >
    );
}
