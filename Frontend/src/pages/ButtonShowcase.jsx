import React, { useState } from 'react';
import Button from '../components/Button';

/**
 * Button Showcase - Demonstrates all Button component variants and features
 * This can be temporarily added to your routes to test the new Tailwind Button
 */
function ButtonShowcase() {
  const [loading, setLoading] = useState(false);

  const handleLoadingDemo = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Button Component Showcase
          </h1>
          <p className="text-gray-600 mb-8">
            All variants and sizes of the new Tailwind-based Button component
          </p>

          {/* Variants Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-1 h-8 bg-blue-600 rounded"></span>
              Button Variants
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 block">Primary</label>
                <Button variant="primary">Primary Button</Button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 block">Secondary</label>
                <Button variant="secondary">Secondary Button</Button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 block">Outline</label>
                <Button variant="outline">Outline Button</Button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 block">Success</label>
                <Button variant="success">Success Button</Button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 block">Error</label>
                <Button variant="error">Error Button</Button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 block">Warning</label>
                <Button variant="warning">Warning Button</Button>
              </div>
            </div>
          </section>

          {/* Sizes Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-1 h-8 bg-green-600 rounded"></span>
              Button Sizes
            </h2>

            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm" variant="primary">Small</Button>
              <Button size="md" variant="primary">Medium (Default)</Button>
              <Button size="lg" variant="primary">Large</Button>
              <Button size="xl" variant="primary">Extra Large</Button>
            </div>
          </section>

          {/* States Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-1 h-8 bg-purple-600 rounded"></span>
              Button States
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 block">Normal</label>
                <Button variant="primary">Normal Button</Button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 block">Loading</label>
                <Button variant="primary" loading={loading}>
                  {loading ? 'Loading...' : 'Click to Load'}
                </Button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 block">Disabled</label>
                <Button variant="primary" disabled>Disabled Button</Button>
              </div>
            </div>

            <div className="mt-4">
              <Button variant="secondary" onClick={handleLoadingDemo}>
                Click to Test Loading State (3s)
              </Button>
            </div>
          </section>

          {/* Full Width Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-1 h-8 bg-red-600 rounded"></span>
              Full Width Buttons
            </h2>

            <div className="space-y-3">
              <Button variant="primary" fullWidth>
                Primary Full Width
              </Button>
              <Button variant="success" fullWidth>
                Success Full Width
              </Button>
              <Button variant="outline" fullWidth>
                Outline Full Width
              </Button>
            </div>
          </section>

          {/* Practical Examples */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-1 h-8 bg-yellow-600 rounded"></span>
              Practical Examples
            </h2>

            <div className="space-y-6">
              {/* Login Form Example */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Login Form</h3>
                <div className="space-y-3 max-w-md">
                  <Button variant="primary" size="lg" fullWidth>
                    Sign In
                  </Button>
                  <Button variant="outline" size="lg" fullWidth>
                    Sign Up
                  </Button>
                </div>
              </div>

              {/* Action Buttons Example */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Action Buttons</h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant="success" size="md">Save Changes</Button>
                  <Button variant="outline" size="md">Cancel</Button>
                  <Button variant="error" size="md">Delete</Button>
                </div>
              </div>

              {/* Submit Form Example */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Form Submission</h3>
                <div className="flex justify-end gap-3">
                  <Button variant="outline">Back</Button>
                  <Button variant="primary" loading={loading}>
                    {loading ? 'Submitting...' : 'Submit'}
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Custom Classes Example */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-1 h-8 bg-indigo-600 rounded"></span>
              Custom Classes
            </h2>

            <div className="space-y-3">
              <Button variant="primary" className="shadow-2xl">
                Extra Shadow
              </Button>
              <Button variant="success" className="rounded-full">
                Rounded Full
              </Button>
              <Button variant="error" className="uppercase tracking-wider">
                Uppercase
              </Button>
            </div>
          </section>
        </div>

        {/* Footer Note */}
        <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            ✅ Migration Complete
          </h3>
          <p className="text-blue-800">
            The Button component has been successfully migrated from custom CSS to Tailwind utility classes.
            All functionality is preserved with improved maintainability and smaller bundle size.
          </p>
          <p className="text-blue-700 text-sm mt-2">
            See <code className="bg-blue-100 px-2 py-1 rounded">BUTTON_MIGRATION.md</code> for detailed documentation.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ButtonShowcase;

