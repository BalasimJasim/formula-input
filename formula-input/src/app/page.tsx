import FormulaInput from '../components/FormulaInput';

export default function Home() {
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <header className="max-w-3xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Formula Input - Causal Clone</h1>
      </header>
      
      <main className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <FormulaInput />
      </main>
    </div>
  );
}
