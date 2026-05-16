export default function OfferFormInput({ label, type = 'text', value, onChange, placeholder }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-sm font-semibold text-gray-800">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full h-11 border border-gray-300 rounded-lg px-4 text-sm text-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors bg-white"
        placeholder={placeholder}
      />
    </div>
  );
}