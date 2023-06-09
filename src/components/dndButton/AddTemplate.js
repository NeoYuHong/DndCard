import { Action } from '@/components/dndButton/Action';

export function AddTemplate(props) {
    return (
        <Action
            {...props}
            active={{
                fill: 'rgba(255, 70, 70, 0.95)',
                background: 'rgba(255, 70, 70, 0.1)',
            }}
        >
            <svg width="20" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0h24v24H0z" fill="none" /><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
        </Action>
    );
}

