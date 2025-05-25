export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">Tailwind CSS Test</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Test Component</h2>
          <p className="text-gray-600 mb-4">
            If you can see this styled text, Tailwind CSS is working correctly!
          </p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors">
            Test Button
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(item => (
            <div
              key={item}
              className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-medium text-gray-800 mb-2">Card {item}</h3>
              <p className="text-gray-500">
                This is a test card to demonstrate Tailwind CSS styling.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
