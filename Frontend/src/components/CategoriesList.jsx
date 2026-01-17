import React from "react";

function CategoriesList({ categories, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          Categories List ({categories.length})
        </h3>
      </div>

      <div className="p-6">
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-gray-700 text-lg font-medium">No categories found</p>
            <p className="text-gray-500 text-sm mt-1">Add your first category using the button above</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {categories.map(cat => (
              <li key={cat._id} className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 overflow-hidden">
                <div className="flex flex-col lg:flex-row justify-between items-start p-5">
                  <div className="flex-1 w-full lg:w-auto">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <strong className="text-xl text-gray-900 font-semibold">{cat.name}</strong>
                      {cat.donationAmount && (
                        <span className="inline-flex items-center bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full border border-blue-600">
                          ₹{cat.donationAmount}
                        </span>
                      )}
                    </div>

                    {cat.sortDescription && (
                      <p className="text-gray-600 text-sm mb-3 leading-relaxed">{cat.sortDescription}</p>
                    )}

                    {/* Display additional descriptions */}
                    {cat.descriptions && cat.descriptions.length > 0 && cat.descriptions.some(d => d.trim()) && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-1">
                          <svg className="w-4 h-4 text-[#05699e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Additional Details
                        </p>
                        <ul className="space-y-2">
                          {cat.descriptions.filter(d => d.trim()).map((desc, idx) => (
                            <li key={idx} className="text-sm text-gray-700 flex items-start gap-3 bg-[#05699e]/10 rounded-lg p-3 border border-[#05699e]/20">
                              <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-[#05699e] rounded-full flex-shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span className="flex-1">{desc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4 lg:mt-0 lg:ml-6 w-full lg:w-auto">
                    <button
                      onClick={() => onEdit(cat)}
                      className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#05699e] hover:bg-[#044d73] text-white font-medium rounded-lg transition-colors duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(cat._id)}
                      className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default CategoriesList;

