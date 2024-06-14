import { useState, useEffect } from 'react';

type SideNavigationProps = {
  setSelectedItem: (item: string) => void;
};

const SideNavigation: React.FC<SideNavigationProps> = ({ setSelectedItem }) => {
  const [selected, setSelected] = useState<string | null>('installation'); // Set the default selected item to "installation"

  const handleNavClick = (item: string) => {
    setSelected(item);
    setSelectedItem(item);
  };

  const getItemClassNames = (item: string) => {
    const isActive = selected === item;
    return `pl-3 pr-3 pt-2 pb-2 rounded-md cursor-pointer ${
      isActive ? 'bg-primary  shadow-md dark:bg-primary-dark opacity-100' : 'bg-transparent opacity-25'
    }`;
  };

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // empty dependency array to run this effect only once on mount

  return (
    <section className={`flex flex-col gap-4 p-4 ${isScrolled ? 'sticky top-0' : ''}`}>
      <div className="flex flex-col gap-3">
        <p className="font-medium">Getting Started</p>
        <ul className="list-none">
          <li onClick={() => handleNavClick('installation')} className={getItemClassNames('installation')}>
            Installation
          </li>
          <li onClick={() => handleNavClick('usage')} className={getItemClassNames('usage')}>
            Basic Usage
          </li>
        </ul>
      </div>
      <div className="flex flex-col gap-3">
        <p className="font-medium">Customisation</p>
        <ul className="list-none">
          <li onClick={() => handleNavClick('parameters')} className={getItemClassNames('parameters')}>
            Parameters & Options
          </li>
          <li onClick={() => handleNavClick('methods')} className={getItemClassNames('methods')}>
            Methods & Properties
          </li>
          <li onClick={() => handleNavClick('events')} className={getItemClassNames('events')}>
            Events
          </li>
          <li onClick={() => handleNavClick('styles')} className={getItemClassNames('styles')}>
            Styles
          </li>
          <li onClick={() => handleNavClick('typescript')} className={getItemClassNames('typescript')}>
            Using Typescript
          </li>
        </ul>
      </div>
    </section>
  );
};

export default SideNavigation;
