
import React, { useState, useEffect, useRef } from 'react';
import { X, Search, Loader2, AlertCircle } from 'lucide-react';
import { fetchSkillsSuggestions, addSkillToProfile, removeSkillFromProfile } from '../services';

interface Skill {
    name: string;
    slug: string;
}

interface SkillInputProps {
    initialSkills?: Skill[];
    onSkillsChange?: (skills: Skill[]) => void;
    persist?: boolean; // If false, only updates local state (for wizards/forms)
}

const SkillInput: React.FC<SkillInputProps> = ({ initialSkills = [], onSkillsChange, persist = true }) => {
    const [skills, setSkills] = useState<Skill[]>(initialSkills);
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState<Skill[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (inputValue.trim().length > 0) {
                fetchSuggestions(inputValue);
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [inputValue]);

    // Sync with parent if needed (optional, depends on usage)
    useEffect(() => {
        if (onSkillsChange) {
            onSkillsChange(skills);
        }
    }, [skills, onSkillsChange]);

    const fetchSuggestions = async (query: string) => {
        setIsLoading(true);
        try {
            const results = await fetchSkillsSuggestions(query);
            setSuggestions(results);
            setShowSuggestions(true);
        } catch (err) {
            console.error('Failed to fetch suggestions', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddSkill = async (skillName: string) => {
        const normalizedName = skillName.trim();
        if (!normalizedName) return;

        // Optimistic update
        const tempSlug = normalizedName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        // Check duplicate
        if (skills.some(s => s.slug === tempSlug)) {
            setError('Skill already added');
            setTimeout(() => setError(null), 3000);
            return;
        }

        const newSkill = { name: normalizedName, slug: tempSlug };
        const prevSkills = [...skills];
        setSkills([...skills, newSkill]);
        setInputValue('');
        setShowSuggestions(false);
        setError(null);

        // If persist is false, we are done (local only)
        if (!persist) return;

        try {
            // API Call
            const updatedSkills = await addSkillToProfile(normalizedName);
            setSkills(updatedSkills);
        } catch (err: any) {
            // Rollback
            setSkills(prevSkills);
            setError(err.response?.data?.message || 'Failed to add skill');
            setTimeout(() => setError(null), 3000);
        }
    };

    const handleRemoveSkill = async (slug: string) => {
        const prevSkills = [...skills];
        setSkills(skills.filter(s => s.slug !== slug));

        // If persist is false, we are done (local only)
        if (!persist) return;

        try {
            await removeSkillFromProfile(slug);
        } catch (err: any) {
            setSkills(prevSkills);
            setError('Failed to remove skill');
            setTimeout(() => setError(null), 3000);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveSuggestionIndex(prev =>
                prev < suggestions.length - 1 ? prev + 1 : prev
            );
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (activeSuggestionIndex >= 0 && suggestions[activeSuggestionIndex]) {
                handleAddSkill(suggestions[activeSuggestionIndex].name);
            } else if (inputValue) {
                handleAddSkill(inputValue);
            }
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
        } else if (e.key === 'Backspace' && !inputValue && skills.length > 0) {
            // Remove last skill on backspace if input empty
            const lastSkill = skills[skills.length - 1];
            handleRemoveSkill(lastSkill.slug);
        }
    };

    // Click outside to close suggestions
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
                inputRef.current && !inputRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="w-full">
            <div className="flex flex-wrap gap-2 mb-3">
                {skills.map((skill) => (
                    <span
                        key={skill.slug}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-brand-50 text-brand-700 border border-brand-100"
                    >
                        {skill.name}
                        <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill.slug)}
                            className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-brand-200 text-brand-500 transition-colors"
                        >
                            <X size={12} />
                        </button>
                    </span>
                ))}
            </div>

            <div className="relative">
                <div className="relative">
                    <input
                        ref={inputRef}
                        type="text"
                        className={`w-full px-4 py-2 pl-10 rounded-lg border ${error ? 'border-red-300 focus:ring-red-200' : 'border-slate-300 focus:ring-brand-100'} focus:border-brand-500 focus:ring-4 outline-none transition-all`}
                        placeholder="Add skill (e.g. React, Node.js)"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => inputValue && setShowSuggestions(true)}
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                    {isLoading && (
                        <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brand-500 animate-spin" size={18} />
                    )}
                </div>

                {error && (
                    <div className="absolute -bottom-6 left-0 text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle size={12} /> {error}
                    </div>
                )}

                {showSuggestions && suggestions.length > 0 && (
                    <div
                        ref={suggestionsRef}
                        className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-slate-100 max-h-60 overflow-auto"
                    >
                        {suggestions.map((suggestion, index) => (
                            <div
                                key={suggestion.slug}
                                className={`px-4 py-2 cursor-pointer text-sm flex items-center justify-between ${index === activeSuggestionIndex ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-50'
                                    }`}
                                onClick={() => handleAddSkill(suggestion.name)}
                                onMouseEnter={() => setActiveSuggestionIndex(index)}
                            >
                                <span>{suggestion.name}</span>
                                {suggestion.tagline && (
                                    <span className="text-xs text-slate-400 truncate max-w-[150px]">{suggestion.tagline}</span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <p className="text-xs text-slate-400 mt-2">
                Press <kbd className="font-sans px-1 py-0.5 bg-slate-100 border border-slate-300 rounded text-[10px]">Enter</kbd> to add
            </p>
        </div>
    );
};

export default SkillInput;
