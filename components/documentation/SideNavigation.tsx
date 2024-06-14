import dynamic from 'next/dynamic';
import { useState } from 'react';

type SideNavigationProps = {
  setSelectedItem: (item: string) => void;
};

const SideNavigation: React.FC<SideNavigationProps> = ({ setSelectedItem }) => {
  const [selected, setSelected] = useState<string | null>('background'); // Set the default selected item to "installation"

  const handleNavClick = (item: string) => {
    setSelected(item);
    setSelectedItem(item);
  };

  const getItemClassNames = (item: string) => {
    const isActive = selected === item;
    return `pl-3 pr-3 pt-2 pb-2 rounded-md cursor-pointer ${
      isActive ? 'bg-primary dark:bg-primary-dark  shadow-md  opacity-100' : 'bg-transparent opacity-25'
    }`;
  };

  return (
    <section className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-3">
        <p className="font-medium">Introduction</p>
        <ul className="list-none">
          <li onClick={() => handleNavClick('background')} className={getItemClassNames('background')}>
            Background
          </li>
    
        </ul>
      </div>
      <div className="flex flex-col gap-3">
        <p className="font-medium">Frameworks</p>
        <ul className="list-none">
          <li onClick={() => handleNavClick('next')} className={getItemClassNames('next')}>
            Next.js
          </li>
       
         
        </ul>
      </div>
    </section>
  );
};

export default dynamic(() => Promise.resolve(SideNavigation), { ssr: false });
