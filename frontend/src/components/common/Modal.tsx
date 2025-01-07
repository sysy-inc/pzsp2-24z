import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';

interface ModalProps {
  trigger: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ trigger, title, children }) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed bg-white rounded shadow-md p-6 w-96 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Dialog.Title className="text-lg font-bold">{title}</Dialog.Title>
          {children}
          <Dialog.Close asChild>
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Close</button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Modal;
