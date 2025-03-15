import FormulaInput from '../components/FormulaInput';

export default function Home() {
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <header className="max-w-3xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Formula Input - Causal Clone</h1>
        <p className="text-gray-600">
          A clone of Causal&apos;s formula input functionality using Next.js, Tailwind CSS, React Query, and Zustand.
        </p>
      </header>
      
      <main className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <FormulaInput />
      </main>
      
      <footer className="max-w-3xl mx-auto mt-8 text-center text-gray-500 text-sm">
        <p>
          Built as a coding exercise. Inspired by{' '}
          <a 
            href="https://causal.app" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Causal
          </a>
        </p>
      </footer>
    </div>
  );
}
