import dynamic from 'next/dynamic';
import React from 'react';

const App2 = dynamic(import('../src/App'), { ssr: false }); // Async API cannot be server-side rendered

export default function Main() {
    return <App2 />;
}
