import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe, Check } from 'lucide-react';
import { useTranslation, type SupportedLanguage } from '@/services/TranslationService';

interface LanguageSelectorProps {
  className?: string;
  variant?: 'default' | 'compact';
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  className = '', 
  variant = 'default' 
}) => {
  const { language, changeLanguage, availableLanguages } = useTranslation();

  const currentLanguage = availableLanguages.find(lang => lang.code === language);

  if (variant === 'compact') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className={`${className}`}>
            <Globe className="h-4 w-4 mr-2" />
            {currentLanguage?.flag} {currentLanguage?.name}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {availableLanguages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => changeLanguage(lang.code as SupportedLanguage)}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{lang.flag}</span>
                <span>{lang.name}</span>
              </div>
              {language === lang.code && (
                <Check className="h-4 w-4 text-green-600" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center gap-2">
        <Globe className="h-5 w-5 text-blue-600" />
        <span className="text-sm font-medium text-gray-700">Language:</span>
      </div>
      <div className="flex gap-2">
        {availableLanguages.map((lang) => (
          <Button
            key={lang.code}
            variant={language === lang.code ? "default" : "outline"}
            size="sm"
            onClick={() => changeLanguage(lang.code as SupportedLanguage)}
            className={`flex items-center gap-2 ${
              language === lang.code 
                ? 'bg-blue-600 text-white' 
                : 'hover:bg-blue-50'
            }`}
          >
            <span className="text-base">{lang.flag}</span>
            <span className="text-sm">{lang.name}</span>
            {language === lang.code && (
              <Check className="h-3 w-3" />
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;