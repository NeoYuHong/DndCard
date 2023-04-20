/* eslint-disable react/display-name */
import classNames from "classnames";
import styles from '@/styles/Action.module.css';
import { forwardRef } from "react";

export const Action = forwardRef(
    ({ active, className, cursor, style, ...props }, ref) => {
        return (
            <button
                ref={ref}
                {...props}
                className={classNames(styles.Action, className)}
                tabIndex={0}
                style={
                    {
                        ...style,
                        cursor,
                        '--fill': active?.fill,
                        '--background': active?.background,
                    }
                }
            />
        );
    }
);