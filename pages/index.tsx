import Logo from '@/bases/logo';

export default function Index() {
  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        backgroundColor: '#FFF',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Logo size="M" />
    </div>
  );
}
