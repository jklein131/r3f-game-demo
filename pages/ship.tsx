import dynamic from 'next/dynamic';
import React from 'react';

const App = dynamic(import('../src/AppShip'), { ssr: false }); // Game cannot be server-side rendered

export default function Main() {
    return <App />;
}
