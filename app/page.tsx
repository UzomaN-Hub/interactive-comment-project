// app/page.tsx

export default function Home() {
  return (
    <main style={{ padding: '4rem', fontFamily: 'sans-serif', backgroundColor: '#f1f5f9', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Test Page</h1>
      <p style={{ marginTop: '1rem' }}>If you can see this text on your deployed Vercel site, the basic routing is working.</p>
      <p style={{ marginTop: '1rem' }}>The problem is inside one of the imported components.</p>
    </main>
  );
}