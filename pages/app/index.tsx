import Header from "@/components/Header/Header";
import Page from "@/components/Page/Page";
import Wrapper from "@/components/Wrapper/Wrapper";
import AppLayout from "@/layout/AppLayout/AppLayout";

export default function App() {
  return (
    <AppLayout>
      <Wrapper>
        <Header>Organizations</Header>
        <Page>test</Page>
      </Wrapper>
    </AppLayout>
  );
}
