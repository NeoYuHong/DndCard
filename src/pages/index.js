import { MultipleContainers } from '@/components/dnd/MultipleContainers';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Index() {
  return (
    <div className="p-10 flex flex-col h-full gap-9">
      <MultipleContainers
        // containerStyle={{ marginBottom: '2.5rem' }}
        scrollable={true}
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
