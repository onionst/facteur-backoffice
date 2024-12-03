import '@/styles/globals.css';
import '@/styles/sass/style.scss';
import '@/styles/app/index.scss';
import { ConfigProvider, ThemeConfig } from 'antd';
import App, { AppContext, AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { ArticlesProvider } from '@/contexts/articles.context';
import { AuthProvider } from '@/contexts/auth.context';
import { FilesProvider } from '@/contexts/files.context';
import { HistoryProvider } from '@/contexts/history.context';
import { ModalProvider } from '@/contexts/modal.context';
import { OrganizationsProvider } from '@/contexts/organizations.context';
import { RepositoryProvider } from '@/contexts/repository.context';
import { TrendingsProvider } from '@/contexts/trendings.context';
import { UsersProvider } from '@/contexts/users.context';
import AppLayout from '@/layout/AppLayout/AppLayout';

const theme: ThemeConfig = {
  token: {
    fontSize: 14,

    colorPrimary: '#00986d'
  },
  components: {
    DatePicker: {
      motion: false,
      hoverBorderColor: '#DBDFE9',
      activeBorderColor: '#C4CADA',
      boxShadow: 'none',
      activeShadow: 'none',
      colorBgContainerDisabled: '#F1F1F4'
    },
    Input: {
      colorTextPlaceholder: '#99a1b7'
    },
    Tag: {
      boxShadow: 'none'
    },
    Select: {
      motion: false,
      colorText: '#4b5675',
      optionSelectedBg: '#f1f1f4',
      colorBgContainerDisabled: '#F1F1F4',
      colorTextPlaceholder: '#99a1b7'
    }
  }
};

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <ConfigProvider theme={theme}>
      <HistoryProvider>
        <RepositoryProvider>
          <FilesProvider>
            <TrendingsProvider>
              <ArticlesProvider>
                <OrganizationsProvider>
                  <UsersProvider>
                    <AuthProvider>
                      <ModalProvider>
                        {router.asPath.includes('/app') ? (
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
              </ArticlesProvider>
            </TrendingsProvider>
          </FilesProvider>
        </RepositoryProvider>
      </HistoryProvider>
    </ConfigProvider>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);
  return { ...appProps };
};
