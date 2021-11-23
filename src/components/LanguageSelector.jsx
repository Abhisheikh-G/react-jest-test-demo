import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  return (
    <>
      {i18n.language === 'en' ? (
        <img
          src="https://www.countryflags.io/tr/flat/24.png"
          title="Turkish"
          alt="turkish flag"
          onClick={() => i18n.changeLanguage('tr')}
        />
      ) : (
        <img
          src="https://www.countryflags.io/us/flat/24.png"
          title="English"
          alt="American flag"
          onClick={() => i18n.changeLanguage('en')}
        />
      )}
    </>
  );
};

export default LanguageSelector;
