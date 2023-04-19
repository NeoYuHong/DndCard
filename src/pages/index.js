/* eslint-disable react/display-name */
/* eslint-disable react/jsx-no-undef */

import { MultipleContainers } from '@/components/dnd/MultipleContainers';


export default function Index() {

  const Container = ({ children }) => {
    return (
      <div className="p-10 flex flex-col h-full gap-9">
        {children}
      </div>
    )
  }

  return (

    <Container>

      <MultipleContainers
        containerStyle={{ marginBottom: '2.5rem' }}
        scrollable={true}
      />

    </Container>
  );
};
