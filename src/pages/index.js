/* eslint-disable react/display-name */
/* eslint-disable react/jsx-no-undef */

import { MultipleContainers } from '@/components/dnd/MultipleContainers';


export default function Index() {

  const Container = ({ children }) => {
    return (
      <div className="p-10 flex h-full flex-col gap-9">
        {children}
      </div>
    )
  }

  return (
    <>

      <Container>

        <MultipleContainers
          containerStyle={{ flex: 1 }}
          scrollable={true}
          itemCount={0}
        />

      </Container>

      {/* <AddModal editCard={editCard} setCards={setCards} cards={cards} />
            <EditModal editCard={editCard} setCards={setCards} cards={cards} />
            <DeleteModal editCard={editCard} setCards={setCards} cards={cards} />
            <PreviewModal cards={cards} /> */}
    </>
  );
};
