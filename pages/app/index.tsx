import Page from "@/components/Page/Page";
import Wrapper from "@/components/Wrapper/Wrapper";
import AppLayout from "@/layout/AppLayout/AppLayout";

export default function App() {
  return (
    <AppLayout>
      <Wrapper>
        <Page>
          <h1>Organizations</h1>
        </Page>
        {/* <Page>
          <h1>Organizations</h1>
        </Page> */}
      </Wrapper>
    </AppLayout>
  );
}
