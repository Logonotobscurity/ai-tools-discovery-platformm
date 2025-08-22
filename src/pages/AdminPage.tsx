import React from 'react';
import FileUpload from '@/components/FileUpload';
import Header from '@/components/header';
import { Link } from 'react-router-dom';

export default function AdminPage() {
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
            <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">Manage your tool dataset.</p>
             <Link to="/" className="text-blue-500 hover:underline mt-4 inline-block">
              &larr; Back to Home
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 p-6 rounded-xl shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Upload Tool Data</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Upload a new JSON file to replace the current tool dataset. The platform will automatically clean and process the data. The changes will be reflected for your current session.
            </p>
            <FileUpload />
          </div>
        </div>
      </main>
    </>
  );
}
