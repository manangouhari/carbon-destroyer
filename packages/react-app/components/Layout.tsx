import { FC, ReactNode } from "react";
import Footer from "./Footer";
import Header from "./Header";

interface Props {
  children: ReactNode;
}
const Layout: FC<Props> = ({ children }) => {
  return (
    <>
      <div className="bg-snow overflow-hidden flex flex-col min-h-screen">
        <Header />
        <div className="py-12 max-w-7xl space-y-8 sm:px-14 lg:px-18 mx-auto">
          {children}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
