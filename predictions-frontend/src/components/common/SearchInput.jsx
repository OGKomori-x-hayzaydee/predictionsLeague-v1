import { useState, useRef, useEffect } from "react";
import { MagnifyingGlassIcon, Cross2Icon } from "@radix-ui/react-icons";

const SearchInput = ({ value, onChange, onClear, placeholder = "Search..." }) => {
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  
  const handleClear = () => {
    onClear();
    inputRef.current?.focus();
  };
  
  // Escape key to clear
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        handleClear();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClear]);
  
  return (
    <div className={`relative flex items-center transition-all ${
      isFocused ? 'ring-2 ring-teal-500/50 rounded-md' : ''
    }`}>
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
      <input 
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-700/30 border border-slate-600/30 rounded-md py-2 pl-10 pr-10 text-white placeholder:text-white/40 focus:outline-none"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {value && (
        <button 
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors p-1 rounded-full hover:bg-white/10"
        >
          <Cross2Icon className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;