import "@/styles/globals.css";
import "@/styles/sass/style.scss";
import "@/styles/app/index.scss";
import type { AppProps } from "next/app";
import { ConfigProvider, ThemeConfig } from "antd";
import { ModalProvider } from "@/contexts/modal.context";
import { AuthProvider } from "@/contexts/auth.context";
import { useRouter } from "next/router";
import AppLayout from "@/layout/AppLayout/AppLayout";
import { OrganizationsProvider } from "@/contexts/organizations.context";
import { UsersProvider } from "@/contexts/users.context";

const theme: ThemeConfig = {
  token: {
    fontSize: 14,
    colorPrimary: "#00986d",
  },
};

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <ConfigProvider theme={theme}>
      <OrganizationsProvider>
        <UsersProvider>
          <AuthProvider>
            <ModalProvider>
              {router.asPath.includes("/app") ? (
                <AppLayout>
                  <Component {...pageProps} />
                </AppLayout>
              ) : (
                <Component {...pageProps} />
              )}
            </ModalProvider>
          </AuthProvider>
        </UsersProvider>
      </OrganizationsProvider>
    </ConfigProvider>
  );
}
