import styles from '@/styles/Item.module.css';
import { Remove } from './Remove';
import { Handle } from './Handle';
import { forwardRef, memo, useEffect } from 'react';
import classNames from 'classnames';
import { Edit } from './Edit';
import { useDndContext } from '@dnd-kit/core';

export const Item = memo(
    forwardRef(
        (
            {
                color,
                dragOverlay,
                dragging,
                disabled,
                fadeIn,
                handle,
                handleProps,
                height,
                index,
                listeners,
                onRemove,
                onEdit,
                renderItem,
                sorting,
                style,
                transition,
                transform,
                data,
                id,
                wrapperStyle,
                ...props
            },
            ref
        ) => {

            const { active, } = useDndContext();


            useEffect(() => {
                if (!dragOverlay) {
                    return;
                }

                document.body.style.cursor = 'grabbing';

                return () => {
                    document.body.style.cursor = '';
                };
            }, [dragOverlay]);

            return renderItem ? (
                renderItem({
                    dragOverlay: Boolean(dragOverlay),
                    dragging: Boolean(dragging),
                    sorting: Boolean(sorting),
                    index,
                    fadeIn: Boolean(fadeIn),
                    listeners,
                    ref,
                    style,
                    transform,
                    transition,
                    data,
                })
            ) : (
                <li
                    className={classNames(
                        data.isTemplate ? styles.WrapperTemplate : styles.Wrapper,
                        fadeIn && styles.fadeIn,
                        sorting && styles.sorting,
                        dragOverlay && styles.dragOverlay
                    )}
                    style={
                        {
                            ...wrapperStyle,
                            transition: [transition, wrapperStyle?.transition]
                                .filter(Boolean)
                                .join(', '),
                            '--translate-x': transform
                                ? `${Math.round(transform.x)}px`
                                : undefined,
                            '--translate-y': transform
                                ? `${Math.round(transform.y)}px`
                                : undefined,
                            '--scale-x': transform?.scaleX
                                ? `${transform.scaleX}`
                                : undefined,
                            '--scale-y': transform?.scaleY
                                ? `${transform.scaleY}`
                                : undefined,
                            '--index': index,
                            '--color': color,
                            display: `${data.invis ? 'none' : ''}`
                        }
                    }
                    ref={ref}
                >
                    <div
                        className={classNames(
                            styles.Item,
                            dragging && styles.dragging,
                            handle && styles.withHandle,
                            dragOverlay && styles.dragOverlay,
                            disabled && styles.disabled,
                            color && styles.color
                        )}
                        style={style}
                        data-cypress="draggable-item"
                        {...(!handle ? listeners : undefined)}
                        {...props}
                        tabIndex={!handle ? 0 : undefined}
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
                        {/* {data.title} {data.id} {data.invis ? 'invis' : 'not'} */}

                        <span className={styles.Actions}>
                            {!active && !data.isTemplate && <Edit className={styles.Remove} onMouseDown={onEdit} />}
                            {!data.isTemplate && onRemove ? (
                                <Remove className={styles.Remove} onMouseDown={onRemove} />
                            ) : null}
                            {handle ? <Handle {...handleProps} {...listeners} /> : null}
                        </span>

                    </div>
                </li>
            );
        }
    )
);
