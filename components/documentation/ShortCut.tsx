import React, { useState } from 'react';

type ShortCutProps = {
  selectedItem: string | null;
  scrollToSection: (ref: React.RefObject<HTMLDivElement>, item: string) => void;
  getItemClassNames: (item: string) => string;
  npmRef: React.RefObject<HTMLDivElement>;
  cdnRef: React.RefObject<HTMLDivElement>;
};

const ShortCut: React.FC<ShortCutProps> = ({ selectedItem, scrollToSection, getItemClassNames, npmRef, cdnRef }) => {
  switch (selectedItem) {
    case 'background':
      return (
        <div className="VStack gap-3 pl-5">
          <p className="font-medium">Shortcuts</p>
          <ul className="list-none">
            <li onClick={() => scrollToSection(npmRef, 'what')} className={getItemClassNames('what')}>
              What
            </li>
            <li onClick={() => scrollToSection(cdnRef, 'where')} className={getItemClassNames('where')}>
              Where
            </li>
            <li onClick={() => scrollToSection(cdnRef, 'when')} className={getItemClassNames('when')}>
              When
            </li>
            <li onClick={() => scrollToSection(cdnRef, 'why')} className={getItemClassNames('why')}>
              Why
            </li>
            <li onClick={() => scrollToSection(cdnRef, 'how')} className={getItemClassNames('how')}>
              How
            </li>
          </ul>
        </div>
      );
    case 'vite':
      return (
        <div className="VStack gap-3 pl-5">
          <p className="font-medium">Shortcuts</p>
          <ul className="list-none">
            <li onClick={() => scrollToSection(npmRef, 'import')} className={getItemClassNames('import')}>
              Vite
            </li>
          
          </ul>
        </div>
      );
      case 'next':
      return (
        <div className="VStack gap-3 pl-5">
          <p className="font-medium">Shortcuts</p>
          <ul className="list-none">
            <li onClick={() => scrollToSection(npmRef, 'import')} className={getItemClassNames('import')}>
              Next
            </li>
           
          </ul>
        </div>
      );
    default:
      return <div>There is no content!</div>;
  }
};

export default ShortCut;
