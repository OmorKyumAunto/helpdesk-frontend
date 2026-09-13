
import { App } from "antd";
import { RouterProvider } from "react-router";
import { routers } from "./router";
import { ConfigProvider, theme } from "antd";
import { useAppSelector } from "./app/store/store";
import { globalTheme } from "./app/slice/themeSlice";
import { useRef } from "react";
import "./App.css";
import CommonModal from "./components/modal/CommonModal";
import useAppScale from "./hooks/useAppScale";

function MyApp() {
  const themeApp = useAppSelector(globalTheme);
  // Renders the app at a fixed design width on every desktop size.
  useAppScale();
  const modalContainerRef = useRef<HTMLDivElement>(null);
  return (
    <ConfigProvider
      theme={{
        // algorithm: themeApp.theme,
        token: {
          colorPrimary: "#1775BB",
          colorBgContainer:
            themeApp.theme === theme.defaultAlgorithm ? "#ffffff" : "#ffffff", //#0b1120cc, #0d1117,#121212
        },
      }}
      getPopupContainer={(triggerNode) =>
        (triggerNode?.parentElement as HTMLElement) ||
        (modalContainerRef.current as HTMLElement) ||
        document.body
      }
    >
      <App>
        <div ref={modalContainerRef}>
          <RouterProvider router={routers} />
          <CommonModal />
        </div>
      </App>
    </ConfigProvider>
  );
}
export default MyApp;