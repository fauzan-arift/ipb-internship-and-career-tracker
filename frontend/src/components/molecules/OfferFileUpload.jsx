import { UploadCloud, Trash2, File } from 'lucide-react';

export default function OfferFileUpload({ file, onFileSelect, onFileRemove }) {
  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onClick={() => document.getElementById('file-upload').click()}
        className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 mb-3">
          <UploadCloud size={24} />
        </div>
        <div className="text-sm font-semibold text-gray-800">
          Klik untuk memilih file
        </div>
        <div className="text-xs text-gray-500">
          atau drag and drop file di sini
        </div>
      </div>

      <input
        id="file-upload"
        type="file"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) onFileSelect(e.target.files[0]);
        }}
      />

      {/* File Preview */}
      {file && (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <File size={20} className="text-gray-500" />
            <div>
              <div className="text-sm font-medium text-gray-800">{file.name}</div>
              <div className="text-xs text-gray-500">{file.size}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={onFileRemove}
            className="text-gray-400 hover:text-red-500 transition-colors p-2"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )}
    </div>
  );
}