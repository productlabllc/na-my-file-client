import { ReactNode } from 'react';

function TopLinksContainer({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-between py-5 px-8">
      {children}
    </div>
  );
}

export default TopLinksContainer;
