/* eslint-disable react/display-name */
import styles from '@/styles/Container.module.css';
import classNames from 'classnames';
import { forwardRef } from 'react';
import { Handle } from '@/components/dndButton/Handle';
import { Remove } from '@/components/dndButton/Remove';
import { AddTemplate } from '../dndButton/AddTemplate';

const Container = forwardRef(
    (
        {
            children,
            columns = 1,
            handleProps,
            horizontal,
            hover,
            onClick,
            onRemove,
            label,
            style,
            scrollable,
            shadow,
            unstyled,
            items,
            id,
            onAddTemplate,
            ...props
        },
        ref
    ) => {
        const Component = onClick ? 'button' : 'div';

        return (
            <Component
                {...props}
                ref={ref}
                style={
                    {
                        ...style,
                        '--columns': columns,
                    }
                }
                className={classNames(
                    styles.Container,
                    unstyled && styles.unstyled,
                    horizontal && styles.horizontal,
                    hover && styles.hover,
                    scrollable && styles.scrollable,
                    shadow && styles.shadow
                )}
                onClick={onClick}
                tabIndex={onClick ? 0 : undefined}
            >
                {label ? (
                    <div className={styles.Header}>
                        {label}
                        <div className={styles.Actions}>
                            {onRemove ? <Remove onClick={onRemove} /> : undefined}
                            {id == 'Template' && onAddTemplate && <AddTemplate onClick={onAddTemplate} />}
                            <Handle {...handleProps} />
                        </div>
                    </div>
                ) : null}
                <ul className='h-full'>{children}</ul>
            </Component>
        );
    }
);

export default Container;