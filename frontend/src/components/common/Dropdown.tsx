import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

const Dropdown: React.FC<{ items: { label: string; onClick: () => void }[] }> = ({ items }) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="p-2 bg-blue-500 text-white rounded">
        Actions
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="bg-white shadow-md p-2 rounded">
        {items.map((item, index) => (
          <DropdownMenu.Item
            key={index}
            className="p-2 hover:bg-gray-100 cursor-pointer"
            onClick={item.onClick}
          >
            {item.label}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default Dropdown;
