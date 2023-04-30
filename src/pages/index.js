import { DndContainer } from '@/components/dnd/DndContainer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Tooltip } from 'react-tooltip';
import parse from 'html-react-parser';

export default function Index() {
  return (
    <div className="flex flex-col h-full">

      <DndContainer
        scrollable={true}
      />

      <Tooltip
        id="tooltip"
        style={{ zIndex: 10000 }}
        render={({ content, activeAnchor }) => {
          const Content = () => {
            let result = null
            if (activeAnchor?.getAttribute('data-content'))
              result = parse(activeAnchor?.getAttribute('data-content'))
            return result
          }
          return (
            <span>
              <Content />
            </span>
          )
        }}
      />

      <ToastContainer
        position="bottom-right"
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={true}
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};
