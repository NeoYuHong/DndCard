import styles from '@/styles/Item.module.css';
import { Handle } from '@/components/dndButton/Handle';
import { Remove } from '@/components/dndButton/Remove';
import { Edit } from '@/components/dndButton/Edit';
import { forwardRef, memo, useEffect } from 'react';
import classNames from 'classnames';
import { useDndContext } from '@dnd-kit/core';

const TemplateItem = memo(
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
                            styles.Item + ' p-2 px-3 ms:p-4 ms:px-5 w-full grid grid-cols-12 ',
                            dragging && styles.dragging,
                            handle && styles.withHandle,
                            dragOverlay && styles.dragOverlay,
                            disabled && styles.disabled,
                            // color && styles.color
                        )}
                        style={style}
                        data-cypress="draggable-item"
                        {...(!handle ? listeners : undefined)}
                        {...props}
                        tabIndex={!handle ? 0 : undefined}
                    >

                        <div className='ms:text-base text-[10px] w-full col-span-12 xxs:col-span-10'>

                            <p>
                                <span className="font-bold">Title</span>: {data.title}
                            </p>

                            <p style={{

                            }}>
                                <span className="font-bold">Description</span>: {data.description}
                            </p>

                            {/* <p>
                                <span className="font-bold">Expression</span>: {data.expression}
                            </p> */}

                        </div>

                        <div className={styles.Actions + ' col-span-12 xxs:col-span-2'}>
                            {!active && !data.isTemplate && <Edit className={styles.Remove} onMouseDown={onEdit} />}
                            {onRemove ? (
                                <Remove className={styles.Remove} onMouseDown={onRemove} />
                            ) : null}
                            {handle ? <Handle {...handleProps} {...listeners} /> : null}
                        </div>

                    </div>
                </li >
            );
        }
    )
);

export default TemplateItem;