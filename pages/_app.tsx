import "@/styles/globals.css";
import "@/styles/sass/style.scss";
import "@/styles/app/index.scss";
import type { AppProps } from "next/app";
import { ConfigProvider, ThemeConfig } from "antd";
import { ModalProvider } from "@/contexts/modal.context";
import { AuthProvider } from "@/contexts/auth.context";

const theme: ThemeConfig = {
  token: {
    fontSize: 14,
    colorPrimary: "#00986d",
  },
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ConfigProvider theme={theme}>
      <ModalProvider>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </ModalProvider>
    </ConfigProvider>
  );
}
