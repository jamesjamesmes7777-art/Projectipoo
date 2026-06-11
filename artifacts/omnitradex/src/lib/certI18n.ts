export type CertLang = 'en' | 'el' | 'fr' | 'de' | 'es' | 'it' | 'ar';

export const CERT_LANGS: { code: CertLang; label: string; flag: string }[] = [
  { code: 'en', label: 'English',  flag: '🇬🇧' },
  { code: 'el', label: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch',  flag: '🇩🇪' },
  { code: 'es', label: 'Español',  flag: '🇪🇸' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'ar', label: 'العربية',  flag: '🇸🇦' },
];

interface CertStrings {
  rtl: boolean;
  registry: string;
  certTitle1: string;
  certTitle2: string;
  verifiedBadge: string;
  certifyIntro: string;
  holderBody: (name: string, shares: number, secName: string, secCode: string) => string;
  sharesHeld: string;
  // Grid labels
  registeredHolder: string;
  allocationRef: string;
  registeredAddress: string;
  security: string;
  allocationPrice: string;
  totalConsideration: string;
  dateOfIssue: string;
  status: string;
  // Auth panel
  certNo: string;
  integrityHash: string;
  authenticated: string;
  authBody: (manager: string | null) => string;
  // Signature
  authorisedSig: string;
  nameLabel: string;
  titleLabel: string;
  dateLabel: string;
  // Security sub-label
  securitySub: string;
  // Date locale
  dateLocale: string;
}

export const CERT_I18N: Record<CertLang, CertStrings> = {
  en: {
    rtl: false,
    registry: 'OmniTradeX \u2022 Pre-IPO Securities Registry',
    certTitle1: 'Certificate of',
    certTitle2: 'Share Ownership',
    verifiedBadge: 'Verified Ledger Entry',
    certifyIntro: 'This is to certify that',
    holderBody: (name, shares, secName, secCode) =>
      `is the registered holder of ${shares.toLocaleString()} ${secName} (${secCode}) Pre-IPO ordinary Shares, duly allocated and settled through Omni Wealth Ltd and recorded in the securities register as set out below.`,
    sharesHeld: 'Shares Held',
    registeredHolder: 'Registered Holder',
    allocationRef: 'Allocation Reference',
    registeredAddress: 'Registered Address',
    security: 'Security',
    allocationPrice: 'Allocation Price',
    totalConsideration: 'Total Consideration',
    dateOfIssue: 'Date of Issue',
    status: 'Status',
    certNo: 'Certificate No.:',
    integrityHash: 'Integrity Hash',
    authenticated: 'Authenticated',
    authBody: m => `Authenticated electronic certificate. Validate this record through your assigned Account Manager${m ? `, ${m}` : ''}.`,
    authorisedSig: 'Authorised Signature',
    nameLabel: 'Name:',
    titleLabel: 'Title:',
    dateLabel: 'Date:',
    securitySub: 'Pre-IPO Ordinary Shares',
    dateLocale: 'en-GB',
  },

  el: {
    rtl: false,
    registry: 'OmniTradeX \u2022 Μητρώο Τίτλων Pre-IPO',
    certTitle1: 'Πιστοποιητικό',
    certTitle2: 'Κατοχής Μετοχών',
    verifiedBadge: 'Επαληθευμένη Εγγραφή',
    certifyIntro: 'Πιστοποιείται ότι',
    holderBody: (name, shares, secName, secCode) =>
      `είναι ο εγγεγραμμένος κάτοχος ${shares.toLocaleString('el-GR')} μετοχών Pre-IPO ${secName} (${secCode}), οι οποίες έχουν διατεθεί και διακανονιστεί μέσω της Omni Wealth Ltd και έχουν καταχωρηθεί στο μητρώο τίτλων όπως ορίζεται κατωτέρω.`,
    sharesHeld: 'Μετοχές',
    registeredHolder: 'Εγγεγραμμένος Κάτοχος',
    allocationRef: 'Αρ. Αναφοράς',
    registeredAddress: 'Καταχωρημένη Διεύθυνση',
    security: 'Τίτλος',
    allocationPrice: 'Τιμή Διάθεσης',
    totalConsideration: 'Συνολικό Ποσό',
    dateOfIssue: 'Ημερομηνία Έκδοσης',
    status: 'Κατάσταση',
    certNo: 'Αρ. Πιστοποιητικού:',
    integrityHash: 'Κωδικός Ακεραιότητας',
    authenticated: 'Πιστοποιημένο',
    authBody: m => `Πιστοποιημένο ηλεκτρονικό πιστοποιητικό. Επαληθεύστε αυτή την εγγραφή μέσω του υπεύθυνου λογαριασμού σας${m ? `, ${m}` : ''}.`,
    authorisedSig: 'Εξουσιοδοτημένη Υπογραφή',
    nameLabel: 'Όνομα:',
    titleLabel: 'Τίτλος:',
    dateLabel: 'Ημ/νία:',
    securitySub: 'Pre-IPO Κοινές Μετοχές',
    dateLocale: 'el-GR',
  },

  fr: {
    rtl: false,
    registry: 'OmniTradeX \u2022 Registre des Titres Pre-IPO',
    certTitle1: 'Certificat de',
    certTitle2: 'Propriété d\'Actions',
    verifiedBadge: 'Entrée Registre Vérifiée',
    certifyIntro: 'Il est certifié que',
    holderBody: (name, shares, secName, secCode) =>
      `est le détenteur enregistré de ${shares.toLocaleString('fr-FR')} actions ordinaires Pre-IPO ${secName} (${secCode}), dûment allouées et réglées par Omni Wealth Ltd et inscrites au registre des valeurs mobilières tel qu'indiqué ci-dessous.`,
    sharesHeld: 'Actions Détenues',
    registeredHolder: 'Détenteur Enregistré',
    allocationRef: 'Référence d\'Allocation',
    registeredAddress: 'Adresse Enregistrée',
    security: 'Titre',
    allocationPrice: 'Prix d\'Allocation',
    totalConsideration: 'Contrepartie Totale',
    dateOfIssue: 'Date d\'Émission',
    status: 'Statut',
    certNo: 'N° de Certificat :',
    integrityHash: 'Hash d\'Intégrité',
    authenticated: 'Authentifié',
    authBody: m => `Certificat électronique authentifié. Validez ce document auprès de votre gestionnaire de compte${m ? `, ${m}` : ''}.`,
    authorisedSig: 'Signature Autorisée',
    nameLabel: 'Nom :',
    titleLabel: 'Titre :',
    dateLabel: 'Date :',
    securitySub: 'Actions Ordinaires Pre-IPO',
    dateLocale: 'fr-FR',
  },

  de: {
    rtl: false,
    registry: 'OmniTradeX \u2022 Pre-IPO Wertpapierregister',
    certTitle1: 'Zertifikat über',
    certTitle2: 'Aktienbesitz',
    verifiedBadge: 'Geprüfter Registereintrag',
    certifyIntro: 'Hiermit wird bescheinigt, dass',
    holderBody: (name, shares, secName, secCode) =>
      `eingetragener Inhaber von ${shares.toLocaleString('de-DE')} Pre-IPO-Stammaktien ${secName} (${secCode}) ist, die ordnungsgemäß durch Omni Wealth Ltd zugeteilt, abgewickelt und im Wertpapierregister erfasst wurden, wie nachstehend ausgeführt.`,
    sharesHeld: 'Gehaltene Aktien',
    registeredHolder: 'Eingetragener Inhaber',
    allocationRef: 'Zuteilungsreferenz',
    registeredAddress: 'Eingetragene Adresse',
    security: 'Wertpapier',
    allocationPrice: 'Zuteilungspreis',
    totalConsideration: 'Gesamtbetrag',
    dateOfIssue: 'Ausgabedatum',
    status: 'Status',
    certNo: 'Zertifikat-Nr.:',
    integrityHash: 'Integritäts-Hash',
    authenticated: 'Authentifiziert',
    authBody: m => `Authentifiziertes elektronisches Zertifikat. Validieren Sie diesen Eintrag über Ihren zugewiesenen Kundenbetreuer${m ? `, ${m}` : ''}.`,
    authorisedSig: 'Bevollmächtigte Unterschrift',
    nameLabel: 'Name:',
    titleLabel: 'Titel:',
    dateLabel: 'Datum:',
    securitySub: 'Pre-IPO Stammaktien',
    dateLocale: 'de-DE',
  },

  es: {
    rtl: false,
    registry: 'OmniTradeX \u2022 Registro de Valores Pre-IPO',
    certTitle1: 'Certificado de',
    certTitle2: 'Propiedad de Acciones',
    verifiedBadge: 'Entrada de Registro Verificada',
    certifyIntro: 'Por la presente se certifica que',
    holderBody: (name, shares, secName, secCode) =>
      `es el titular registrado de ${shares.toLocaleString('es-ES')} acciones ordinarias Pre-IPO de ${secName} (${secCode}), debidamente asignadas y liquidadas a través de Omni Wealth Ltd y registradas en el registro de valores como se indica a continuación.`,
    sharesHeld: 'Acciones en Cartera',
    registeredHolder: 'Titular Registrado',
    allocationRef: 'Referencia de Asignación',
    registeredAddress: 'Dirección Registrada',
    security: 'Valor',
    allocationPrice: 'Precio de Asignación',
    totalConsideration: 'Contraprestación Total',
    dateOfIssue: 'Fecha de Emisión',
    status: 'Estado',
    certNo: 'N.° de Certificado:',
    integrityHash: 'Hash de Integridad',
    authenticated: 'Autenticado',
    authBody: m => `Certificado electrónico autenticado. Valide este registro a través de su gestor de cuenta asignado${m ? `, ${m}` : ''}.`,
    authorisedSig: 'Firma Autorizada',
    nameLabel: 'Nombre:',
    titleLabel: 'Cargo:',
    dateLabel: 'Fecha:',
    securitySub: 'Acciones Ordinarias Pre-IPO',
    dateLocale: 'es-ES',
  },

  it: {
    rtl: false,
    registry: 'OmniTradeX \u2022 Registro Titoli Pre-IPO',
    certTitle1: 'Certificato di',
    certTitle2: 'Proprietà Azionaria',
    verifiedBadge: 'Voce di Registro Verificata',
    certifyIntro: 'Si certifica che',
    holderBody: (name, shares, secName, secCode) =>
      `è il titolare registrato di ${shares.toLocaleString('it-IT')} azioni ordinarie Pre-IPO di ${secName} (${secCode}), debitamente assegnate e regolate tramite Omni Wealth Ltd e registrate nel registro dei titoli come indicato di seguito.`,
    sharesHeld: 'Azioni Detenute',
    registeredHolder: 'Titolare Registrato',
    allocationRef: 'Riferimento Allocazione',
    registeredAddress: 'Indirizzo Registrato',
    security: 'Titolo',
    allocationPrice: 'Prezzo di Allocazione',
    totalConsideration: 'Corrispettivo Totale',
    dateOfIssue: 'Data di Emissione',
    status: 'Stato',
    certNo: 'N. Certificato:',
    integrityHash: 'Hash di Integrità',
    authenticated: 'Autenticato',
    authBody: m => `Certificato elettronico autenticato. Convalidare questo documento tramite il proprio gestore di account assegnato${m ? `, ${m}` : ''}.`,
    authorisedSig: 'Firma Autorizzata',
    nameLabel: 'Nome:',
    titleLabel: 'Titolo:',
    dateLabel: 'Data:',
    securitySub: 'Azioni Ordinarie Pre-IPO',
    dateLocale: 'it-IT',
  },

  ar: {
    rtl: true,
    registry: 'OmniTradeX \u2022 سجل الأوراق المالية قبل الطرح العام',
    certTitle1: 'شهادة',
    certTitle2: 'ملكية الأسهم',
    verifiedBadge: 'إدخال سجل موثق',
    certifyIntro: 'يُشهد بأن',
    holderBody: (name, shares, secName, secCode) =>
      `هو المالك المسجل لـ ${shares.toLocaleString('ar-SA')} سهمًا عاديًا من أسهم ${secName} (${secCode}) قبل الطرح العام الأولي، المُخصصة والمُسوّاة بشكل رسمي عبر Omni Wealth Ltd والمُسجّلة في سجل الأوراق المالية على النحو الموضح أدناه.`,
    sharesHeld: 'الأسهم المحتفظ بها',
    registeredHolder: 'المالك المسجل',
    allocationRef: 'مرجع التخصيص',
    registeredAddress: 'العنوان المسجل',
    security: 'الورقة المالية',
    allocationPrice: 'سعر التخصيص',
    totalConsideration: 'إجمالي المبلغ',
    dateOfIssue: 'تاريخ الإصدار',
    status: 'الحالة',
    certNo: ':رقم الشهادة',
    integrityHash: 'رمز التحقق',
    authenticated: 'موثّق',
    authBody: m => `شهادة إلكترونية موثّقة. تحقق من هذه الوثيقة عبر مدير حسابك المعيّن${m ? `، ${m}` : ''}.`,
    authorisedSig: 'التوقيع المفوض',
    nameLabel: ':الاسم',
    titleLabel: ':المسمى',
    dateLabel: ':التاريخ',
    securitySub: 'أسهم عادية قبل الطرح العام',
    dateLocale: 'ar-SA',
  },
};

export function getCertStrings(lang: string): CertStrings {
  return CERT_I18N[(lang as CertLang) in CERT_I18N ? (lang as CertLang) : 'en'];
}

export function fmtDate(dateStr: string, locale: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString(locale, {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}
