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
    case 'installation':
      return (
        <div className="VStack gap-3 pl-5">
          <p className="font-medium">Shortcuts</p>
          <ul className="list-none">
            <li onClick={() => scrollToSection(npmRef, 'npm')} className={getItemClassNames('npm')}>
              NPM Installation
            </li>
            <li onClick={() => scrollToSection(cdnRef, 'cdn')} className={getItemClassNames('cdn')}>
              CDN Installation
            </li>
          </ul>
        </div>
      );
    case 'usage':
      return (
        <div className="VStack gap-3 pl-5">
          <p className="font-medium">Shortcuts</p>
          <ul className="list-none">
            <li onClick={() => scrollToSection(npmRef, 'import')} className={getItemClassNames('import')}>
              Import
            </li>
            <li onClick={() => scrollToSection(cdnRef, 'script')} className={getItemClassNames('script')}>
              Script
            </li>
            <li onClick={() => scrollToSection(cdnRef, 'body')} className={getItemClassNames('body')}>
              Body
            </li>
          </ul>
        </div>
      );
    default:
      return <div>Select an item from the menu.</div>;
  }
};

export default ShortCut;
