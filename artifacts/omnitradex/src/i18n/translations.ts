export type LangCode = 'en' | 'el' | 'it' | 'de' | 'es';

export interface T {
  header: {
    brand: string;
    brand_sub: string;
    pill_allocation: string;
    pill_fca: string;
    btn_secure: string;
  };
  alerts: {
    launch_banner: string;
  };
  hero: {
    badge: string;
    title_1: string;
    title_highlight: string;
    title_2: string;
    subtitle: string;
    countdown_label: string;
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
    cta_primary: string;
    cta_secondary: string;
    trust_fca: string;
    trust_segregated: string;
    trust_buyback: string;
    trust_kyc: string;
  };
  inventory: {
    section_label: string;
    um_shares: string;
    alloc_shares: string;
    avail_shares: string;
    active_inv: string;
    spcx_shares: string;
    institutional_buyers: string;
    p_allocated: string;
    p_remaining: string;
    progress_title: string;
    total: string;
  };
  mission: {
    section_label: string;
    title: string;
    subtitle: string;
    falcon_name: string;
    falcon_stat1: string;
    falcon_stat2: string;
    falcon_desc: string;
    starlink_name: string;
    starlink_stat1: string;
    starlink_stat2: string;
    starlink_desc: string;
    starship_name: string;
    starship_stat1: string;
    starship_stat2: string;
    starship_desc: string;
  };
  investment: {
    section_label: string;
    title: string;
    entry_label: string;
    entry_value: string;
    entry_sub: string;
    min_label: string;
    min_value: string;
    min_sub: string;
    exit_label: string;
    exit_value: string;
    exit_sub: string;
    fee_label: string;
    fee_value: string;
    fee_sub: string;
    guarantee_title: string;
    guarantee_body: string;
    guarantee_1_title: string;
    guarantee_1_desc: string;
    guarantee_2_title: string;
    guarantee_2_desc: string;
    guarantee_3_title: string;
    guarantee_3_desc: string;
    guarantee_footnote: string;
  };
  calculator: {
    section_label: string;
    title: string;
    subtitle: string;
    parameters: string;
    lbl_shares: string;
    lbl_min: string;
    lbl_exit_price: string;
    lbl_target: string;
    entry_fixed: string;
    per_share: string;
    results_title: string;
    total_capital: string;
    gross_payout: string;
    gross_profit: string;
    performance_fee: string;
    net_profit: string;
    total_disbursed: string;
    projected_return: string;
    on_capital: string;
    scenario_title: string;
    col_exit: string;
    col_gross: string;
    col_fee: string;
    col_net: string;
    col_disbursed: string;
    target_badge: string;
  };
  demand: {
    section_label: string;
    title: string;
    total_volume: string;
    shares_sought: string;
    total_committed: string;
    bid_value: string;
    instruction_title: string;
    instruction_body: string;
    active_orders: string;
    live: string;
    col_buyer: string;
    col_region: string;
    col_shares: string;
    col_bid: string;
    col_premium: string;
    copy_id: string;
    copied: string;
  };
  footer: {
    trust_title: string;
    trust_body: string;
    fca_title: string;
    fca_desc: string;
    segregated_title: string;
    segregated_desc: string;
    custody_title: string;
    custody_desc: string;
    kyc_title: string;
    kyc_desc: string;
    entity_services: string;
    legal: string;
    link_spa: string;
    link_privacy: string;
    link_terms: string;
    link_risk: string;
    disclaimer: string;
  };
  toast: {
    secured: string;
    shares_at: string;
  };
  modal: {
    title: string;
    lbl_shares: string;
    lbl_fname: string;
    lbl_sname: string;
    lbl_email: string;
    lbl_country: string;
    btn_submit: string;
    loading: string;
    success_title: string;
    success_body: string;
    lbl_ref: string;
    capital_required: string;
    min_shares_error: string;
    required: string;
    invalid_email: string;
    select_country: string;
    legal_note: string;
  };
}

const localeMap: Record<LangCode, string> = {
  en: 'en-US',
  el: 'el-GR',
  it: 'it-IT',
  de: 'de-DE',
  es: 'es-ES',
};

export function getLocale(lang: LangCode) {
  return localeMap[lang];
}

export const translations: Record<LangCode, T> = {
  en: {
    header: {
      brand: 'OmniTradeX',
      brand_sub: 'by Omni Wealth Ltd',
      pill_allocation: 'SPCX Allocation',
      pill_fca: 'FCA · FRN 955451',
      btn_secure: 'Secure Allocation',
    },
    alerts: {
      launch_banner: 'Notice to Institutional Participants: Pre-IPO allocation booking portal goes live on 12/06/2026 for formal purchase allocations. Secure tracking reserves before closing vectors wrap.',
    },
    hero: {
      badge: 'Nasdaq Listing — Dec 9, 2026',
      title_1: 'Secure Your Institutional',
      title_highlight: 'Allocation',
      title_2: 'in the SpaceX IPO',
      subtitle: 'Exclusive pre-IPO placement for qualified institutional buyers. OmniTradeX is operated by Omni Wealth Ltd, FCA Authorised.',
      countdown_label: 'T-minus · Time Until NASDAQ Listing',
      days: 'Days',
      hours: 'Hours',
      minutes: 'Minutes',
      seconds: 'Seconds',
      cta_primary: 'Secure Allocation Now',
      cta_secondary: 'View Live Demand Board',
      trust_fca: 'FCA Authorised · FRN 955451',
      trust_segregated: 'Segregated Client Accounts',
      trust_buyback: '100% Contractual Buyback',
      trust_kyc: 'KYC / AML Compliant',
    },
    inventory: {
      section_label: 'Live Share Inventory',
      um_shares: 'Total Shares Under Management',
      alloc_shares: 'Shares Allocated',
      avail_shares: 'Shares Available',
      active_inv: 'Active Investors',
      spcx_shares: 'SPCX shares',
      institutional_buyers: 'institutional buyers',
      p_allocated: 'Allocated',
      p_remaining: 'remaining',
      progress_title: 'Allocation Progress',
      total: 'total',
    },
    mission: {
      section_label: 'Asset Underlying Strengths',
      title: 'SpaceX Mission Manifest',
      subtitle: 'Three commercial vectors generating revenue, establishing moats, and compounding enterprise value toward the NASDAQ debut.',
      falcon_name: 'Falcon Heavy',
      falcon_stat1: '27 Merlin Engines',
      falcon_stat2: '63t LEO Capacity',
      falcon_desc: "The world's most powerful operational rocket — 27 Merlin engines, fully reusable side boosters.",
      starlink_name: 'Starlink',
      starlink_stat1: '100+ Countries',
      starlink_stat2: '6,000+ Active Satellites',
      starlink_desc: 'Global high-speed satellite internet constellation powering connectivity for over 100 countries.',
      starship_name: 'Starship',
      starship_stat1: 'Fully Reusable',
      starship_stat2: '150t Payload to LEO',
      starship_desc: 'Fully reusable super-heavy spacecraft engineered for Mars colonisation and orbital point-to-point transit.',
    },
    investment: {
      section_label: 'Investment Parameters',
      title: 'Entry Terms & Protection Framework',
      entry_label: 'Entry Price',
      entry_value: '€117.00',
      entry_sub: 'per share',
      min_label: 'Min Purchase',
      min_value: '87 shares',
      min_sub: 'strictly enforced',
      exit_label: 'Target Exit',
      exit_value: '2–3 weeks',
      exit_sub: 'post-listing horizon',
      fee_label: 'Performance Fee',
      fee_value: '17%',
      fee_sub: 'on profits only · 0% management',
      guarantee_title: 'A Guaranteed Exit on Every Share',
      guarantee_body: 'SpaceX is heading toward its NASDAQ debut on December 9, 2026 — one of the most anticipated listings in market history, with private valuations climbing past $350 billion. The hardest part of pre-IPO investing isn\'t getting in — it\'s getting out. Every share you acquire through OmniTradeX is backed by a contractual buyback: we guarantee the sale of your entire allocation at the target exit window.',
      guarantee_1_title: '100% Guaranteed Buyback',
      guarantee_1_desc: 'We contractually repurchase your full allocation at the agreed exit window — you never have to find a buyer yourself.',
      guarantee_2_title: '+130% Defined Upside',
      guarantee_2_desc: 'Enter at €117 and exit at a €300 target — a projected net return of roughly 130% after our performance fee.',
      guarantee_3_title: 'T+0 Priority Contractual Exit',
      guarantee_3_desc: 'No lock-ups, no illiquid waiting. Your position converts to cash the moment the exit window opens.',
      guarantee_footnote: 'Buyback commitment provided under contract by Omni Wealth Ltd · FRN 955451. The guarantee covers the sale of your allocation; projected returns are targets and capital remains at risk.',
    },
    calculator: {
      section_label: 'Return Modelling',
      title: 'Interactive Profit Calculator',
      subtitle: 'Adjust your share count and estimated exit price to model your projected returns.',
      parameters: 'Parameters',
      lbl_shares: 'Number of Shares',
      lbl_min: 'Min: 87 shares',
      lbl_exit_price: 'Estimated Exit Price (€)',
      lbl_target: '€300 target',
      entry_fixed: 'Entry price is fixed at',
      per_share: '€117.00 / share',
      results_title: 'Projected Returns',
      total_capital: 'Total Capital Investment',
      gross_payout: 'Projected Gross Payout',
      gross_profit: 'Gross Profit',
      performance_fee: 'Firm Performance Fee (17%)',
      net_profit: 'Net Client Profit',
      total_disbursed: 'Total Disbursed to Client',
      projected_return: 'Projected net return:',
      on_capital: 'on capital deployed',
      scenario_title: 'Exit Scenario Matrix — 87 Shares Minimum Entry',
      col_exit: 'Exit Price',
      col_gross: 'Gross Profit',
      col_fee: 'Performance Fee',
      col_net: 'Net Profit',
      col_disbursed: 'Total Disbursed',
      target_badge: 'Target',
    },
    demand: {
      section_label: 'Live Institutional Demand',
      title: 'Active Buy Order Board',
      total_volume: 'Total Bid Volume',
      shares_sought: 'shares sought',
      total_committed: 'Total Committed',
      bid_value: 'bid value',
      instruction_title: 'How to use this board:',
      instruction_body: 'Find a buyer whose offer suits you, click Copy ID, then share the Buyer ID with your OmniTradeX account manager. All details are kept confidential — buyer names are not disclosed.',
      active_orders: 'Active Orders',
      live: 'Live feed active',
      col_buyer: 'Buyer ID',
      col_region: 'Region',
      col_shares: 'Shares Sought',
      col_bid: 'Bid Price',
      col_premium: 'Premium',
      copy_id: 'Copy ID',
      copied: 'Copied!',
    },
    footer: {
      trust_title: 'Institutional Trust & Custody —',
      trust_body: 'Client capital is protected through regulated, non-custodial arrangements. OmniTradeX, operating through Omni Wealth Ltd, coordinates execution and never takes direct possession of investor funds.',
      fca_title: 'FCA Authorised',
      fca_desc: 'Regulated by the Financial Conduct Authority · FRN 955451.',
      segregated_title: 'Segregated Accounts',
      segregated_desc: 'Client funds are ring-fenced from firm capital at all times.',
      custody_title: 'Independent Custody',
      custody_desc: 'Assets held by regulated third-party custodians.',
      kyc_title: 'KYC / AML Compliant',
      kyc_desc: 'Full identity verification and anti-money-laundering checks.',
      entity_services: 'Institutional Investment Services',
      legal: 'Legal',
      link_spa: 'Stock Purchase Agreement',
      link_privacy: 'Privacy Policy',
      link_terms: 'Terms of Service',
      link_risk: 'Risk Disclosure',
      disclaimer: 'This website has been prepared by Omni Wealth Ltd solely for informational and illustrative purposes and does not constitute investment advice, an offer to sell, or a solicitation to buy any security. Investing in pre-IPO securities involves significant risks including the total loss of capital. Past performance is not indicative of future results. © 2025 Omni Wealth Ltd. All rights reserved.',
    },
    toast: {
      secured: 'just secured',
      shares_at: 'shares @ €117',
    },
    modal: {
      title: 'Secure Institutional Allocation',
      lbl_shares: 'Number of Shares',
      lbl_fname: 'First Name',
      lbl_sname: 'Surname',
      lbl_email: 'Email Address',
      lbl_country: 'Country',
      btn_submit: 'Secure Allocation',
      loading: 'Encrypting transaction parameters...',
      success_title: 'Waiting List Position Secured',
      success_body: 'Please copy this tracking reference and provide it directly to your OmniTradeX account manager to finalize capital routing and complete your share purchase.',
      lbl_ref: 'Waiting List Reference ID:',
      capital_required: 'Capital required',
      min_shares_error: 'Minimum 87 shares required',
      required: 'Required',
      invalid_email: 'Enter a valid email address',
      select_country: 'Please select a country',
      legal_note: 'By submitting, you confirm you are a qualified institutional buyer. Capital remains at risk. Omni Wealth Ltd · FCA FRN 955451.',
    },
  },

  el: {
    header: {
      brand: 'OmniTradeX',
      brand_sub: 'από Omni Wealth Ltd',
      pill_allocation: 'Κατανομή SPCX',
      pill_fca: 'FCA · FRN 955451',
      btn_secure: 'Εξασφάλιση Κατανομής',
    },
    alerts: {
      launch_banner: 'Ειδοποίηση προς Θεσμικούς Συμμετέχοντες: Η πύλη κρατήσεων για την κατανομή προ-IPO θα ενεργοποιηθεί στις 12/06/2026 για επίσημες αγορές κατανομής. Εξασφαλίστε τις κρατήσεις παρακολούθησης πριν από το κλείσιμο.',
    },
    hero: {
      badge: 'Εισαγωγή στο Nasdaq — 9 Δεκ. 2026',
      title_1: 'Εξασφαλίστε τη Θεσμική σας',
      title_highlight: 'Κατανομή',
      title_2: 'στο IPO της SpaceX',
      subtitle: 'Αποκλειστική τοποθέτηση προ-IPO για εξειδικευμένους θεσμικούς αγοραστές. Η OmniTradeX λειτουργεί από την Omni Wealth Ltd, εξουσιοδοτημένη από την FCA.',
      countdown_label: 'T-minus · Χρόνος μέχρι την Εισαγωγή στο NASDAQ',
      days: 'Ημέρες',
      hours: 'Ώρες',
      minutes: 'Λεπτά',
      seconds: 'Δευτερόλεπτα',
      cta_primary: 'Εξασφαλίστε Κατανομή Τώρα',
      cta_secondary: 'Δείτε τον Πίνακα Ζήτησης',
      trust_fca: 'Εξουσιοδοτημένη FCA · FRN 955451',
      trust_segregated: 'Διαχωρισμένοι Λογαριασμοί Πελατών',
      trust_buyback: '100% Συμβατική Επαναγορά',
      trust_kyc: 'Συμμόρφωση KYC / AML',
    },
    inventory: {
      section_label: 'Απόθεμα Μετοχών σε Πραγματικό Χρόνο',
      um_shares: 'Συνολικές Μετοχές υπό Διαχείριση',
      alloc_shares: 'Μετοχές που Διατέθηκαν',
      avail_shares: 'Διαθέσιμες Μετοχές',
      active_inv: 'Ενεργοί Επενδυτές',
      spcx_shares: 'Μετοχές SPCX',
      institutional_buyers: 'θεσμικοί αγοραστές',
      p_allocated: 'Δεσμευμένες',
      p_remaining: 'απομένουν',
      progress_title: 'Πρόοδος Κατανομής',
      total: 'σύνολο',
    },
    mission: {
      section_label: 'Πλεονεκτήματα Υποκείμενου Ενεργητικού',
      title: 'Αποστολές SpaceX',
      subtitle: 'Τρεις εμπορικοί φορείς που δημιουργούν έσοδα, εδραιώνουν ανταγωνιστικά πλεονεκτήματα και αυξάνουν την εταιρική αξία προς το ντεμπούτο στο NASDAQ.',
      falcon_name: 'Falcon Heavy',
      falcon_stat1: '27 Κινητήρες Merlin',
      falcon_stat2: 'Χωρητικότητα 63τ LEO',
      falcon_desc: 'Ο πιο ισχυρός επιχειρησιακός πύραυλος στον κόσμο — 27 κινητήρες Merlin, πλήρως επαναχρησιμοποιήσιμοι πλευρικοί ενισχυτές.',
      starlink_name: 'Starlink',
      starlink_stat1: '100+ Χώρες',
      starlink_stat2: '6.000+ Ενεργοί Δορυφόροι',
      starlink_desc: 'Παγκόσμιος αστερισμός δορυφορικού internet υψηλής ταχύτητας που παρέχει συνδεσιμότητα σε πάνω από 100 χώρες.',
      starship_name: 'Starship',
      starship_stat1: 'Πλήρως Επαναχρησιμοποιήσιμο',
      starship_stat2: 'Ωφέλιμο Φορτίο 150τ σε LEO',
      starship_desc: 'Πλήρως επαναχρησιμοποιήσιμο υπερβαρύ διαστημόπλοιο σχεδιασμένο για αποικισμό του Άρη και τροχιακή μεταφορά σημείου-σε-σημείο.',
    },
    investment: {
      section_label: 'Παράμετροι Επένδυσης',
      title: 'Όροι Εισόδου & Πλαίσιο Προστασίας',
      entry_label: 'Τιμή Εισόδου',
      entry_value: '€117,00',
      entry_sub: 'ανά μετοχή',
      min_label: 'Ελάχιστη Αγορά',
      min_value: '87 μετοχές',
      min_sub: 'αυστηρά υποχρεωτικό',
      exit_label: 'Στόχος Εξόδου',
      exit_value: '2–3 εβδομάδες',
      exit_sub: 'ορίζοντας μετά την εισαγωγή',
      fee_label: 'Προμήθεια Απόδοσης',
      fee_value: '17%',
      fee_sub: 'μόνο επί κερδών · 0% διαχείριση',
      guarantee_title: 'Εγγυημένη Έξοδος σε Κάθε Μετοχή',
      guarantee_body: 'Η SpaceX κατευθύνεται προς το ντεμπούτο της στο NASDAQ στις 9 Δεκεμβρίου 2026 — μία από τις πιο αναμενόμενες εισαγωγές στην ιστορία της αγοράς, με ιδιωτικές αποτιμήσεις που ξεπερνούν τα $350 δισεκατομμύρια. Το πιο δύσκολο κομμάτι της επένδυσης προ-IPO δεν είναι η είσοδος — είναι η έξοδος. Κάθε μετοχή που αποκτάτε μέσω OmniTradeX υποστηρίζεται από συμβατική επαναγορά: εγγυόμαστε την πώληση ολόκληρης της κατανομής σας στο παράθυρο-στόχο εξόδου.',
      guarantee_1_title: '100% Εγγυημένη Επαναγορά',
      guarantee_1_desc: 'Επαναγοράζουμε συμβατικά ολόκληρη την κατανομή σας στο συμφωνημένο παράθυρο εξόδου — δεν χρειάζεται ποτέ να βρείτε αγοραστή μόνοι σας.',
      guarantee_2_title: '+130% Καθορισμένο Κέρδος',
      guarantee_2_desc: 'Είσοδος στα €117 και έξοδος στον στόχο €300 — μια προβλεπόμενη καθαρή απόδοση περίπου 130% μετά την προμήθεια απόδοσης.',
      guarantee_3_title: 'T+0 Συμβατική Έξοδος Προτεραιότητας',
      guarantee_3_desc: 'Χωρίς lock-up, χωρίς αναμονή ρευστότητας. Η θέση σας μετατρέπεται σε μετρητά τη στιγμή που ανοίγει το παράθυρο εξόδου.',
      guarantee_footnote: 'Δέσμευση επαναγοράς βάσει σύμβασης από την Omni Wealth Ltd · FRN 955451. Η εγγύηση καλύπτει την πώληση της κατανομής σας· οι προβλεπόμενες αποδόσεις είναι στόχοι και το κεφάλαιο παραμένει σε κίνδυνο.',
    },
    calculator: {
      section_label: 'Μοντελοποίηση Αποδόσεων',
      title: 'Διαδραστικός Υπολογιστής Κερδών',
      subtitle: 'Ρυθμίστε τον αριθμό μετοχών και την εκτιμώμενη τιμή εξόδου για να μοντελοποιήσετε τις προβλεπόμενες αποδόσεις σας.',
      parameters: 'Παράμετροι',
      lbl_shares: 'Αριθμός Μετοχών',
      lbl_min: 'Ελάχ: 87 μετοχές',
      lbl_exit_price: 'Εκτιμώμενη Τιμή Εξόδου (€)',
      lbl_target: '€300 στόχος',
      entry_fixed: 'Η τιμή εισόδου είναι σταθερή στα',
      per_share: '€117,00 / μετοχή',
      results_title: 'Προβλεπόμενες Αποδόσεις',
      total_capital: 'Συνολική Κεφαλαιακή Επένδυση',
      gross_payout: 'Προβλεπόμενη Μικτή Αποπληρωμή',
      gross_profit: 'Μικτό Κέρδος',
      performance_fee: 'Προμήθεια Απόδοσης (17%)',
      net_profit: 'Καθαρό Κέρδος Πελάτη',
      total_disbursed: 'Σύνολο Εκταμίευσης σε Πελάτη',
      projected_return: 'Προβλεπόμενη καθαρή απόδοση:',
      on_capital: 'επί επενδεδυμένου κεφαλαίου',
      scenario_title: 'Πίνακας Σεναρίων Εξόδου — Ελάχιστη Είσοδος 87 Μετοχών',
      col_exit: 'Τιμή Εξόδου',
      col_gross: 'Μικτό Κέρδος',
      col_fee: 'Προμήθεια',
      col_net: 'Καθαρό Κέρδος',
      col_disbursed: 'Σύνολο Εκταμίευσης',
      target_badge: 'Στόχος',
    },
    demand: {
      section_label: 'Θεσμική Ζήτηση σε Πραγματικό Χρόνο',
      title: 'Πίνακας Ενεργών Εντολών Αγοράς',
      total_volume: 'Συνολικός Όγκος Προσφορών',
      shares_sought: 'μετοχές ζητούμενες',
      total_committed: 'Σύνολο Δεσμευτικών',
      bid_value: 'αξία προσφορών',
      instruction_title: 'Πώς να χρησιμοποιήσετε αυτόν τον πίνακα:',
      instruction_body: 'Βρείτε έναν αγοραστή του οποίου η προσφορά σας ταιριάζει, κάντε κλικ στο Αντιγραφή ID, και μοιραστείτε το ID Αγοραστή με τον υπεύθυνο λογαριασμού σας στην OmniTradeX. Όλα τα στοιχεία παραμένουν εμπιστευτικά.',
      active_orders: 'Ενεργές Εντολές',
      live: 'Ζωντανή ροή',
      col_buyer: 'ID Αγοραστή',
      col_region: 'Περιοχή',
      col_shares: 'Μετοχές',
      col_bid: 'Τιμή Προσφοράς',
      col_premium: 'Ασφάλιστρο',
      copy_id: 'Αντιγραφή',
      copied: 'Αντιγράφηκε!',
    },
    footer: {
      trust_title: 'Θεσμική Εμπιστοσύνη & Φύλαξη —',
      trust_body: 'Το κεφάλαιο πελατών προστατεύεται μέσω ρυθμιζόμενων, μη θεματοφυλακτικών ρυθμίσεων. Η OmniTradeX, μέσω της Omni Wealth Ltd, συντονίζει την εκτέλεση και δεν κατέχει ποτέ άμεσα κεφάλαια επενδυτών.',
      fca_title: 'Εξουσιοδοτημένη FCA',
      fca_desc: 'Ρυθμιζόμενη από τη Financial Conduct Authority · FRN 955451.',
      segregated_title: 'Διαχωρισμένοι Λογαριασμοί',
      segregated_desc: 'Τα κεφάλαια πελατών είναι ξεχωριστά από το κεφάλαιο της εταιρείας ανά πάσα στιγμή.',
      custody_title: 'Ανεξάρτητη Φύλαξη',
      custody_desc: 'Τα περιουσιακά στοιχεία φυλάσσονται από ρυθμιζόμενους τρίτους θεματοφύλακες.',
      kyc_title: 'Συμμόρφωση KYC / AML',
      kyc_desc: 'Πλήρης επαλήθευση ταυτότητας και έλεγχοι κατά της νομιμοποίησης εσόδων.',
      entity_services: 'Υπηρεσίες Θεσμικών Επενδύσεων',
      legal: 'Νομικά',
      link_spa: 'Συμφωνία Αγοράς Μετοχών',
      link_privacy: 'Πολιτική Απορρήτου',
      link_terms: 'Όροι Χρήσης',
      link_risk: 'Γνωστοποίηση Κινδύνων',
      disclaimer: 'Αυτός ο ιστότοπος έχει ετοιμαστεί από την Omni Wealth Ltd αποκλειστικά για ενημερωτικούς και επεξηγηματικούς σκοπούς και δεν αποτελεί επενδυτική συμβουλή, προσφορά πώλησης ή πρόσκληση αγοράς τίτλου. Η επένδυση σε τίτλους προ-IPO ενέχει σημαντικούς κινδύνους συμπεριλαμβανομένης της ολικής απώλειας κεφαλαίου. © 2025 Omni Wealth Ltd. Με επιφύλαξη παντός δικαιώματος.',
    },
    toast: {
      secured: 'μόλις εξασφάλισε',
      shares_at: 'μετοχές @ €117',
    },
    modal: {
      title: 'Εξασφάλιση Θεσμικής Τοποθέτησης',
      lbl_shares: 'Αριθμός Μετοχών',
      lbl_fname: 'Όνομα',
      lbl_sname: 'Επώνυμο',
      lbl_email: 'Διεύθυνση Email',
      lbl_country: 'Χώρα',
      btn_submit: 'Εξασφάλιση Κατανομής',
      loading: 'Κρυπτογράφηση παραμέτρων συναλλαγής...',
      success_title: 'Η Θέση στη Λίστα Αναμονής Εξασφαλίστηκε',
      success_body: 'Αντιγράψτε αυτόν τον κωδικό παρακολούθησης και παραδώστε τον απευθείας στον υπεύθυνο λογαριασμού της OmniTradeX για την οριστικοποίηση της δρομολόγησης κεφαλαίων.',
      lbl_ref: 'Κωδικός Αναφοράς Λίστας Αναμονής:',
      capital_required: 'Απαιτούμενο κεφάλαιο',
      min_shares_error: 'Απαιτούνται τουλάχιστον 87 μετοχές',
      required: 'Απαιτείται',
      invalid_email: 'Εισαγάγετε μια έγκυρη διεύθυνση email',
      select_country: 'Παρακαλώ επιλέξτε χώρα',
      legal_note: 'Υποβάλλοντας, επιβεβαιώνετε ότι είστε εξειδικευμένος θεσμικός αγοραστής. Το κεφάλαιο παραμένει σε κίνδυνο. Omni Wealth Ltd · FCA FRN 955451.',
    },
  },

  it: {
    header: {
      brand: 'OmniTradeX',
      brand_sub: 'di Omni Wealth Ltd',
      pill_allocation: 'Allocazione SPCX',
      pill_fca: 'FCA · FRN 955451',
      btn_secure: "Garantire l'Allocazione",
    },
    alerts: {
      launch_banner: 'Avviso ai Partecipanti Istituzionali: Il portale di prenotazione delle allocazioni pre-IPO sarà attivo il 12/06/2026 per gli acquisti formali. Proteggi le riserve di tracciamento prima della chiusura.',
    },
    hero: {
      badge: 'Quotazione Nasdaq — 9 Dic 2026',
      title_1: "Garantisci la Tua Allocazione",
      title_highlight: 'Istituzionale',
      title_2: "nell'IPO di SpaceX",
      subtitle: "Collocamento esclusivo pre-IPO per acquirenti istituzionali qualificati. OmniTradeX è gestita da Omni Wealth Ltd, autorizzata FCA.",
      countdown_label: 'T-minus · Tempo alla Quotazione NASDAQ',
      days: 'Giorni',
      hours: 'Ore',
      minutes: 'Minuti',
      seconds: 'Secondi',
      cta_primary: "Garantire l'Allocazione Ora",
      cta_secondary: 'Visualizza il Pannello della Domanda',
      trust_fca: 'Autorizzata FCA · FRN 955451',
      trust_segregated: 'Conti Clienti Segregati',
      trust_buyback: 'Riacquisto Contrattuale 100%',
      trust_kyc: 'Conforme KYC / AML',
    },
    inventory: {
      section_label: 'Inventario Azioni in Tempo Reale',
      um_shares: 'Azioni Totali in Gestione',
      alloc_shares: 'Azioni Allocate',
      avail_shares: 'Azioni Disponibili',
      active_inv: 'Investitori Attivi',
      spcx_shares: 'Azioni SPCX',
      institutional_buyers: 'acquirenti istituzionali',
      p_allocated: 'Allocato',
      p_remaining: 'rimanente',
      progress_title: 'Progresso Allocazione',
      total: 'totale',
    },
    mission: {
      section_label: 'Punti di Forza del Sottostante',
      title: 'Manifesto Missioni SpaceX',
      subtitle: "Tre vettori commerciali che generano ricavi, stabiliscono barriere e compongono il valore aziendale verso il debutto al NASDAQ.",
      falcon_name: 'Falcon Heavy',
      falcon_stat1: '27 Motori Merlin',
      falcon_stat2: 'Capacità LEO 63t',
      falcon_desc: 'Il razzo operativo più potente del mondo — 27 motori Merlin, booster laterali completamente riutilizzabili.',
      starlink_name: 'Starlink',
      starlink_stat1: '100+ Paesi',
      starlink_stat2: '6.000+ Satelliti Attivi',
      starlink_desc: 'Costellazione globale di internet satellitare ad alta velocità che fornisce connettività in oltre 100 paesi.',
      starship_name: 'Starship',
      starship_stat1: 'Completamente Riutilizzabile',
      starship_stat2: 'Carico Utile 150t in LEO',
      starship_desc: 'Veicolo spaziale super-pesante completamente riutilizzabile progettato per la colonizzazione di Marte e il trasporto orbitale punto-a-punto.',
    },
    investment: {
      section_label: 'Parametri di Investimento',
      title: 'Termini di Ingresso & Quadro di Protezione',
      entry_label: 'Prezzo di Ingresso',
      entry_value: '€117,00',
      entry_sub: 'per azione',
      min_label: 'Acquisto Minimo',
      min_value: '87 azioni',
      min_sub: 'rigorosamente applicato',
      exit_label: 'Obiettivo di Uscita',
      exit_value: '2–3 settimane',
      exit_sub: 'orizzonte post-quotazione',
      fee_label: 'Commissione di Performance',
      fee_value: '17%',
      fee_sub: 'solo sui profitti · 0% gestione',
      guarantee_title: "Un'Uscita Garantita su Ogni Azione",
      guarantee_body: "SpaceX si dirige verso il suo debutto al NASDAQ il 9 dicembre 2026 — una delle quotazioni più attese nella storia del mercato, con valutazioni private che superano i $350 miliardi. La parte più difficile dell'investimento pre-IPO non è entrare — è uscire. Ogni azione acquisita tramite OmniTradeX è supportata da un riacquisto contrattuale: garantiamo la vendita dell'intera allocazione nella finestra di uscita target.",
      guarantee_1_title: 'Riacquisto Garantito 100%',
      guarantee_1_desc: "Riacquistiamo contrattualmente l'intera allocazione nella finestra di uscita concordata — non dovrai mai trovare un acquirente da solo.",
      guarantee_2_title: '+130% Rendimento Definito',
      guarantee_2_desc: "Ingresso a €117 e uscita a un target di €300 — un rendimento netto previsto di circa 130% dopo la commissione di performance.",
      guarantee_3_title: 'Uscita Contrattuale Prioritaria T+0',
      guarantee_3_desc: "Nessun lock-up, nessuna attesa illiquida. La tua posizione si converte in contanti nel momento in cui si apre la finestra di uscita.",
      guarantee_footnote: "Impegno di riacquisto fornito sotto contratto da Omni Wealth Ltd · FRN 955451. La garanzia copre la vendita della tua allocazione; i rendimenti previsti sono obiettivi e il capitale resta a rischio.",
    },
    calculator: {
      section_label: 'Modellazione dei Rendimenti',
      title: 'Calcolatore Interattivo dei Profitti',
      subtitle: "Regola il numero di azioni e il prezzo di uscita stimato per modellare i rendimenti previsti.",
      parameters: 'Parametri',
      lbl_shares: 'Numero di Azioni',
      lbl_min: 'Min: 87 azioni',
      lbl_exit_price: 'Prezzo di Uscita Stimato (€)',
      lbl_target: '€300 obiettivo',
      entry_fixed: 'Il prezzo di ingresso è fisso a',
      per_share: '€117,00 / azione',
      results_title: 'Rendimenti Previsti',
      total_capital: 'Investimento di Capitale Totale',
      gross_payout: 'Pagamento Lordo Previsto',
      gross_profit: 'Profitto Lordo',
      performance_fee: 'Commissione di Performance (17%)',
      net_profit: 'Profitto Netto Cliente',
      total_disbursed: 'Totale Erogato al Cliente',
      projected_return: 'Rendimento netto previsto:',
      on_capital: 'sul capitale investito',
      scenario_title: 'Matrice Scenari di Uscita — Ingresso Minimo 87 Azioni',
      col_exit: 'Prezzo Uscita',
      col_gross: 'Profitto Lordo',
      col_fee: 'Commissione',
      col_net: 'Profitto Netto',
      col_disbursed: 'Totale Erogato',
      target_badge: 'Obiettivo',
    },
    demand: {
      section_label: 'Domanda Istituzionale in Tempo Reale',
      title: "Pannello Ordini di Acquisto Attivi",
      total_volume: 'Volume Totale Offerte',
      shares_sought: 'azioni richieste',
      total_committed: 'Totale Impegnato',
      bid_value: 'valore offerte',
      instruction_title: 'Come usare questo pannello:',
      instruction_body: "Trova un acquirente la cui offerta ti soddisfa, clicca Copia ID, poi condividi l'ID Acquirente con il tuo account manager OmniTradeX. Tutti i dettagli rimangono riservati.",
      active_orders: 'Ordini Attivi',
      live: 'Feed attivo',
      col_buyer: 'ID Acquirente',
      col_region: 'Regione',
      col_shares: 'Azioni',
      col_bid: "Prezzo Offerta",
      col_premium: 'Premio',
      copy_id: 'Copia ID',
      copied: 'Copiato!',
    },
    footer: {
      trust_title: 'Fiducia Istituzionale & Custodia —',
      trust_body: "Il capitale dei clienti è protetto attraverso accordi regolamentati e non-custodiali. OmniTradeX, attraverso Omni Wealth Ltd, coordina l'esecuzione e non prende mai possesso diretto dei fondi degli investitori.",
      fca_title: 'Autorizzata FCA',
      fca_desc: 'Regolata dalla Financial Conduct Authority · FRN 955451.',
      segregated_title: 'Conti Segregati',
      segregated_desc: 'I fondi dei clienti sono separati dal capitale aziendale in ogni momento.',
      custody_title: 'Custodia Indipendente',
      custody_desc: "Asset detenuti da custodi terzi regolamentati.",
      kyc_title: 'Conforme KYC / AML',
      kyc_desc: 'Verifica completa dell\'identità e controlli antiriciclaggio.',
      entity_services: 'Servizi di Investimento Istituzionale',
      legal: 'Legale',
      link_spa: 'Contratto di Acquisto Azioni',
      link_privacy: 'Informativa sulla Privacy',
      link_terms: 'Termini di Servizio',
      link_risk: 'Informativa sui Rischi',
      disclaimer: "Questo sito è stato preparato da Omni Wealth Ltd esclusivamente a scopo informativo e illustrativo e non costituisce consulenza in materia di investimenti, un'offerta di vendita o una sollecitazione all'acquisto. L'investimento in titoli pre-IPO comporta rischi significativi inclusa la perdita totale del capitale. © 2025 Omni Wealth Ltd. Tutti i diritti riservati.",
    },
    toast: {
      secured: 'ha appena ottenuto',
      shares_at: 'azioni @ €117',
    },
    modal: {
      title: "Garantire l'Allocazione Istituzionale",
      lbl_shares: 'Numero di Azioni',
      lbl_fname: 'Nome',
      lbl_sname: 'Cognome',
      lbl_email: 'Indirizzo Email',
      lbl_country: 'Paese',
      btn_submit: "Garantire l'Allocazione",
      loading: 'Crittografia dei parametri di transazione...',
      success_title: "Posizione in Lista d'Attesa Garantita",
      success_body: "Copia questo riferimento e forniscilo direttamente al tuo account manager OmniTradeX per finalizzare il routing del capitale e completare l'acquisto.",
      lbl_ref: "ID Riferimento Lista d'Attesa:",
      capital_required: 'Capitale richiesto',
      min_shares_error: 'Minimo 87 azioni richieste',
      required: 'Obbligatorio',
      invalid_email: 'Inserire un indirizzo email valido',
      select_country: 'Selezionare un paese',
      legal_note: "Inviando, confermi di essere un acquirente istituzionale qualificato. Il capitale resta a rischio. Omni Wealth Ltd · FCA FRN 955451.",
    },
  },

  de: {
    header: {
      brand: 'OmniTradeX',
      brand_sub: 'von Omni Wealth Ltd',
      pill_allocation: 'SPCX-Allokation',
      pill_fca: 'FCA · FRN 955451',
      btn_secure: 'Allokation Sichern',
    },
    alerts: {
      launch_banner: 'Hinweis für institutionelle Teilnehmer: Das Buchungsportal für Pre-IPO-Allokationen geht am 12.06.2026 für formelle Kaufallokationen live. Sichern Sie sich Tracking-Reserven, bevor die Zuteilung schließt.',
    },
    hero: {
      badge: 'Nasdaq-Notierung — 9. Dez. 2026',
      title_1: 'Sichern Sie Ihre Institutionelle',
      title_highlight: 'Allokation',
      title_2: 'im SpaceX-IPO',
      subtitle: 'Exklusive Pre-IPO-Platzierung für qualifizierte institutionelle Käufer. OmniTradeX wird von Omni Wealth Ltd betrieben, FCA-autorisiert.',
      countdown_label: 'T-minus · Zeit bis zur NASDAQ-Notierung',
      days: 'Tage',
      hours: 'Stunden',
      minutes: 'Minuten',
      seconds: 'Sekunden',
      cta_primary: 'Jetzt Allokation Sichern',
      cta_secondary: 'Live-Nachfragetafel Ansehen',
      trust_fca: 'FCA-Autorisiert · FRN 955451',
      trust_segregated: 'Segregierte Kundenkonten',
      trust_buyback: '100% Vertraglicher Rückkauf',
      trust_kyc: 'KYC / AML Konform',
    },
    inventory: {
      section_label: 'Aktienbestand in Echtzeit',
      um_shares: 'Verwaltete Aktien Insgesamt',
      alloc_shares: 'Zugeteilte Aktien',
      avail_shares: 'Verfügbare Aktien',
      active_inv: 'Aktive Investoren',
      spcx_shares: 'SPCX-Aktien',
      institutional_buyers: 'institutionelle Käufer',
      p_allocated: 'Zugeteilt',
      p_remaining: 'verbleibend',
      progress_title: 'Allokationsfortschritt',
      total: 'gesamt',
    },
    mission: {
      section_label: 'Stärken des Basiswerts',
      title: 'SpaceX-Missionsmanifest',
      subtitle: 'Drei kommerzielle Vektoren, die Umsätze generieren, Wettbewerbsvorteile aufbauen und den Unternehmenswert zum NASDAQ-Debüt steigern.',
      falcon_name: 'Falcon Heavy',
      falcon_stat1: '27 Merlin-Triebwerke',
      falcon_stat2: '63t LEO-Kapazität',
      falcon_desc: 'Die leistungsstärkste operationelle Rakete der Welt — 27 Merlin-Triebwerke, vollständig wiederverwendbare Seitenbooster.',
      starlink_name: 'Starlink',
      starlink_stat1: '100+ Länder',
      starlink_stat2: '6.000+ aktive Satelliten',
      starlink_desc: 'Globale Hochgeschwindigkeits-Satelliten-Internet-Konstellation, die Konnektivität in über 100 Ländern ermöglicht.',
      starship_name: 'Starship',
      starship_stat1: 'Vollständig Wiederverwendbar',
      starship_stat2: '150t Nutzlast in LEO',
      starship_desc: 'Vollständig wiederverwendbares Superheavy-Raumschiff, entwickelt für die Mars-Kolonisierung und orbitalen Punkt-zu-Punkt-Transport.',
    },
    investment: {
      section_label: 'Investitionsparameter',
      title: 'Einstiegsbedingungen & Schutzrahmen',
      entry_label: 'Einstiegspreis',
      entry_value: '€117,00',
      entry_sub: 'pro Aktie',
      min_label: 'Mindestkauf',
      min_value: '87 Aktien',
      min_sub: 'streng durchgesetzt',
      exit_label: 'Zielausstieg',
      exit_value: '2–3 Wochen',
      exit_sub: 'Horizont nach Notierung',
      fee_label: 'Erfolgsgebühr',
      fee_value: '17%',
      fee_sub: 'nur auf Gewinne · 0% Verwaltung',
      guarantee_title: 'Ein Garantierter Ausstieg bei Jeder Aktie',
      guarantee_body: 'SpaceX steuert auf sein NASDAQ-Debüt am 9. Dezember 2026 zu — eine der am meisten erwarteten Notierungen der Marktgeschichte, mit privaten Bewertungen über $350 Milliarden. Der schwierigste Teil bei Pre-IPO-Investitionen ist nicht der Einstieg — sondern der Ausstieg. Jede Aktie, die Sie über OmniTradeX erwerben, ist durch einen vertraglichen Rückkauf abgesichert: Wir garantieren den Verkauf Ihrer gesamten Allokation im Zielausstiegsfenster.',
      guarantee_1_title: '100% Garantierter Rückkauf',
      guarantee_1_desc: 'Wir kaufen Ihre gesamte Allokation im vereinbarten Ausstiegsfenster vertraglich zurück — Sie müssen nie selbst einen Käufer finden.',
      guarantee_2_title: '+130% Definierte Rendite',
      guarantee_2_desc: 'Einstieg bei €117 und Ausstieg bei einem Ziel von €300 — eine prognostizierte Nettorendite von ca. 130% nach unserer Erfolgsgebühr.',
      guarantee_3_title: 'T+0 Prioritärer Vertragsausstieg',
      guarantee_3_desc: 'Keine Lock-ups, kein illiquides Warten. Ihre Position wird in dem Moment zu Bargeld, in dem das Ausstiegsfenster öffnet.',
      guarantee_footnote: 'Rückkaufverpflichtung vertraglich bereitgestellt von Omni Wealth Ltd · FRN 955451. Die Garantie deckt den Verkauf Ihrer Allokation ab; prognostizierte Renditen sind Ziele und das Kapital bleibt risikobehaftet.',
    },
    calculator: {
      section_label: 'Renditemodellierung',
      title: 'Interaktiver Gewinnrechner',
      subtitle: 'Passen Sie Ihre Aktienanzahl und den geschätzten Ausstiegspreis an, um Ihre prognostizierten Renditen zu modellieren.',
      parameters: 'Parameter',
      lbl_shares: 'Anzahl der Aktien',
      lbl_min: 'Min: 87 Aktien',
      lbl_exit_price: 'Geschätzter Ausstiegspreis (€)',
      lbl_target: '€300 Ziel',
      entry_fixed: 'Einstiegspreis ist fest bei',
      per_share: '€117,00 / Aktie',
      results_title: 'Prognostizierte Renditen',
      total_capital: 'Gesamtkapitalinvestition',
      gross_payout: 'Prognostizierte Bruttoauszahlung',
      gross_profit: 'Bruttogewinn',
      performance_fee: 'Erfolgsgebühr (17%)',
      net_profit: 'Nettogewinn Kunde',
      total_disbursed: 'Gesamtauszahlung an Kunde',
      projected_return: 'Prognostizierte Nettorendite:',
      on_capital: 'auf eingesetztes Kapital',
      scenario_title: 'Ausstiegsszenarien — Mindesteinstieg 87 Aktien',
      col_exit: 'Ausstiegspreis',
      col_gross: 'Bruttogewinn',
      col_fee: 'Gebühr',
      col_net: 'Nettogewinn',
      col_disbursed: 'Gesamtauszahlung',
      target_badge: 'Ziel',
    },
    demand: {
      section_label: 'Institutionelle Nachfrage in Echtzeit',
      title: 'Aktive Kaufaufträge',
      total_volume: 'Gesamtangebotsvolumen',
      shares_sought: 'Aktien gesucht',
      total_committed: 'Gesamt Gebunden',
      bid_value: 'Gebotswert',
      instruction_title: 'So nutzen Sie diese Tafel:',
      instruction_body: 'Finden Sie einen Käufer, dessen Angebot passt, klicken Sie auf ID Kopieren, und teilen Sie die Käufer-ID Ihrem OmniTradeX Account Manager mit. Alle Angaben bleiben vertraulich.',
      active_orders: 'Aktive Aufträge',
      live: 'Live-Feed aktiv',
      col_buyer: 'Käufer-ID',
      col_region: 'Region',
      col_shares: 'Aktien',
      col_bid: 'Gebotspreis',
      col_premium: 'Aufschlag',
      copy_id: 'Kopieren',
      copied: 'Kopiert!',
    },
    footer: {
      trust_title: 'Institutionelles Vertrauen & Verwahrung —',
      trust_body: 'Kundenkapital wird durch regulierte, nicht-verwahrende Vereinbarungen geschützt. OmniTradeX, über Omni Wealth Ltd, koordiniert die Ausführung und nimmt niemals direkten Besitz von Anlegergeldern.',
      fca_title: 'FCA-Autorisiert',
      fca_desc: 'Reguliert durch die Financial Conduct Authority · FRN 955451.',
      segregated_title: 'Segregierte Konten',
      segregated_desc: 'Kundengelder sind jederzeit vom Firmenkapital getrennt.',
      custody_title: 'Unabhängige Verwahrung',
      custody_desc: 'Vermögenswerte werden von regulierten Dritt-Verwahrern gehalten.',
      kyc_title: 'KYC / AML Konform',
      kyc_desc: 'Vollständige Identitätsprüfung und Geldwäschekontrollen.',
      entity_services: 'Institutionelle Anlageservices',
      legal: 'Rechtliches',
      link_spa: 'Aktienkaufvertrag',
      link_privacy: 'Datenschutzrichtlinie',
      link_terms: 'Nutzungsbedingungen',
      link_risk: 'Risikohinweis',
      disclaimer: 'Diese Website wurde von Omni Wealth Ltd ausschließlich zu Informations- und Veranschaulichungszwecken erstellt und stellt keine Anlageberatung, kein Verkaufsangebot oder keine Aufforderung zum Kauf dar. Die Investition in Pre-IPO-Wertpapiere birgt erhebliche Risiken einschließlich des vollständigen Kapitalverlustes. © 2025 Omni Wealth Ltd. Alle Rechte vorbehalten.',
    },
    toast: {
      secured: 'hat gerade gesichert',
      shares_at: 'Aktien @ €117',
    },
    modal: {
      title: 'Institutionelle Allokation Sichern',
      lbl_shares: 'Anzahl der Aktien',
      lbl_fname: 'Vorname',
      lbl_sname: 'Nachname',
      lbl_email: 'E-Mail-Adresse',
      lbl_country: 'Land',
      btn_submit: 'Allokation Sichern',
      loading: 'Transaktionsparameter werden verschlüsselt...',
      success_title: 'Wartelistenplatz Gesichert',
      success_body: 'Bitte kopieren Sie diese Tracking-Referenz und leiten Sie diese direkt an Ihren OmniTradeX Account Manager weiter, um das Kapital-Routing abzuschließen.',
      lbl_ref: 'Wartelisten-Referenz-ID:',
      capital_required: 'Erforderliches Kapital',
      min_shares_error: 'Mindestens 87 Aktien erforderlich',
      required: 'Erforderlich',
      invalid_email: 'Gültige E-Mail-Adresse eingeben',
      select_country: 'Bitte Land auswählen',
      legal_note: 'Mit der Übermittlung bestätigen Sie, dass Sie ein qualifizierter institutioneller Käufer sind. Kapital bleibt risikobehaftet. Omni Wealth Ltd · FCA FRN 955451.',
    },
  },

  es: {
    header: {
      brand: 'OmniTradeX',
      brand_sub: 'por Omni Wealth Ltd',
      pill_allocation: 'Asignación SPCX',
      pill_fca: 'FCA · FRN 955451',
      btn_secure: 'Asegurar Asignación',
    },
    alerts: {
      launch_banner: 'Aviso a Participantes Institucionales: El portal de reservas de asignación pre-IPO estará disponible el 12/06/2026 para compras formales. Asegure las reservas de seguimiento antes del cierre.',
    },
    hero: {
      badge: 'Cotización Nasdaq — 9 Dic 2026',
      title_1: 'Asegure Su Asignación',
      title_highlight: 'Institucional',
      title_2: 'en la IPO de SpaceX',
      subtitle: 'Colocación exclusiva pre-IPO para compradores institucionales cualificados. OmniTradeX es operada por Omni Wealth Ltd, autorizada por la FCA.',
      countdown_label: 'T-minus · Tiempo Hasta la Cotización en NASDAQ',
      days: 'Días',
      hours: 'Horas',
      minutes: 'Minutos',
      seconds: 'Segundos',
      cta_primary: 'Asegurar Asignación Ahora',
      cta_secondary: 'Ver Panel de Demanda',
      trust_fca: 'Autorizada FCA · FRN 955451',
      trust_segregated: 'Cuentas de Clientes Segregadas',
      trust_buyback: 'Recompra Contractual 100%',
      trust_kyc: 'Cumplimiento KYC / AML',
    },
    inventory: {
      section_label: 'Inventario de Acciones en Tiempo Real',
      um_shares: 'Total de Acciones Bajo Gestión',
      alloc_shares: 'Acciones Asignadas',
      avail_shares: 'Acciones Disponibles',
      active_inv: 'Inversores Activos',
      spcx_shares: 'Acciones SPCX',
      institutional_buyers: 'compradores institucionales',
      p_allocated: 'Asignado',
      p_remaining: 'restante',
      progress_title: 'Progreso de Asignación',
      total: 'total',
    },
    mission: {
      section_label: 'Fortalezas del Activo Subyacente',
      title: 'Manifiesto de Misiones SpaceX',
      subtitle: 'Tres vectores comerciales que generan ingresos, establecen ventajas competitivas y aumentan el valor empresarial hacia el debut en NASDAQ.',
      falcon_name: 'Falcon Heavy',
      falcon_stat1: '27 Motores Merlin',
      falcon_stat2: 'Capacidad LEO 63t',
      falcon_desc: 'El cohete operativo más potente del mundo — 27 motores Merlin, propulsores laterales totalmente reutilizables.',
      starlink_name: 'Starlink',
      starlink_stat1: '100+ Países',
      starlink_stat2: '6.000+ Satélites Activos',
      starlink_desc: 'Constelación global de internet satelital de alta velocidad que proporciona conectividad en más de 100 países.',
      starship_name: 'Starship',
      starship_stat1: 'Totalmente Reutilizable',
      starship_stat2: 'Carga Útil 150t a LEO',
      starship_desc: 'Nave espacial súper pesada totalmente reutilizable diseñada para la colonización de Marte y tránsito orbital punto a punto.',
    },
    investment: {
      section_label: 'Parámetros de Inversión',
      title: 'Términos de Entrada & Marco de Protección',
      entry_label: 'Precio de Entrada',
      entry_value: '€117,00',
      entry_sub: 'por acción',
      min_label: 'Compra Mínima',
      min_value: '87 acciones',
      min_sub: 'estrictamente aplicado',
      exit_label: 'Objetivo de Salida',
      exit_value: '2–3 semanas',
      exit_sub: 'horizonte post-cotización',
      fee_label: 'Comisión de Rendimiento',
      fee_value: '17%',
      fee_sub: 'solo sobre beneficios · 0% gestión',
      guarantee_title: 'Una Salida Garantizada en Cada Acción',
      guarantee_body: 'SpaceX se dirige hacia su debut en el NASDAQ el 9 de diciembre de 2026 — una de las cotizaciones más anticipadas en la historia del mercado, con valoraciones privadas que superan los $350 mil millones. La parte más difícil de la inversión pre-IPO no es entrar — es salir. Cada acción que adquiera a través de OmniTradeX está respaldada por una recompra contractual: garantizamos la venta de toda su asignación en la ventana de salida objetivo.',
      guarantee_1_title: 'Recompra Garantizada 100%',
      guarantee_1_desc: 'Recompramos contractualmente toda su asignación en la ventana de salida acordada — nunca tendrá que encontrar un comprador por su cuenta.',
      guarantee_2_title: '+130% Rendimiento Definido',
      guarantee_2_desc: 'Entrada a €117 y salida en un objetivo de €300 — un rendimiento neto proyectado de aproximadamente 130% después de nuestra comisión.',
      guarantee_3_title: 'Salida Contractual Prioritaria T+0',
      guarantee_3_desc: 'Sin bloqueos, sin espera ilíquida. Su posición se convierte en efectivo en el momento en que se abre la ventana de salida.',
      guarantee_footnote: 'Compromiso de recompra proporcionado bajo contrato por Omni Wealth Ltd · FRN 955451. La garantía cubre la venta de su asignación; los rendimientos proyectados son objetivos y el capital permanece en riesgo.',
    },
    calculator: {
      section_label: 'Modelado de Rendimientos',
      title: 'Calculadora Interactiva de Beneficios',
      subtitle: 'Ajuste su cantidad de acciones y el precio de salida estimado para modelar sus rendimientos proyectados.',
      parameters: 'Parámetros',
      lbl_shares: 'Número de Acciones',
      lbl_min: 'Mín: 87 acciones',
      lbl_exit_price: 'Precio de Salida Estimado (€)',
      lbl_target: '€300 objetivo',
      entry_fixed: 'El precio de entrada es fijo en',
      per_share: '€117,00 / acción',
      results_title: 'Rendimientos Proyectados',
      total_capital: 'Inversión de Capital Total',
      gross_payout: 'Pago Bruto Proyectado',
      gross_profit: 'Beneficio Bruto',
      performance_fee: 'Comisión de Rendimiento (17%)',
      net_profit: 'Beneficio Neto del Cliente',
      total_disbursed: 'Total Desembolsado al Cliente',
      projected_return: 'Rendimiento neto proyectado:',
      on_capital: 'sobre capital desplegado',
      scenario_title: 'Matriz de Escenarios de Salida — Entrada Mínima 87 Acciones',
      col_exit: 'Precio Salida',
      col_gross: 'Beneficio Bruto',
      col_fee: 'Comisión',
      col_net: 'Beneficio Neto',
      col_disbursed: 'Total Desembolsado',
      target_badge: 'Objetivo',
    },
    demand: {
      section_label: 'Demanda Institucional en Tiempo Real',
      title: 'Panel de Órdenes de Compra Activas',
      total_volume: 'Volumen Total de Ofertas',
      shares_sought: 'acciones buscadas',
      total_committed: 'Total Comprometido',
      bid_value: 'valor de ofertas',
      instruction_title: 'Cómo usar este panel:',
      instruction_body: 'Encuentre un comprador cuya oferta le convenga, haga clic en Copiar ID, luego comparta el ID del Comprador con su gestor de cuentas de OmniTradeX. Todos los detalles se mantienen confidenciales.',
      active_orders: 'Órdenes Activas',
      live: 'Feed en vivo',
      col_buyer: 'ID Comprador',
      col_region: 'Región',
      col_shares: 'Acciones',
      col_bid: 'Precio Oferta',
      col_premium: 'Prima',
      copy_id: 'Copiar ID',
      copied: 'Copiado!',
    },
    footer: {
      trust_title: 'Confianza Institucional & Custodia —',
      trust_body: 'El capital de los clientes está protegido a través de acuerdos regulados y no custodiales. OmniTradeX, a través de Omni Wealth Ltd, coordina la ejecución y nunca toma posesión directa de los fondos de los inversores.',
      fca_title: 'Autorizada FCA',
      fca_desc: 'Regulada por la Financial Conduct Authority · FRN 955451.',
      segregated_title: 'Cuentas Segregadas',
      segregated_desc: 'Los fondos de los clientes están separados del capital de la empresa en todo momento.',
      custody_title: 'Custodia Independiente',
      custody_desc: 'Activos custodiados por custodios terceros regulados.',
      kyc_title: 'Cumplimiento KYC / AML',
      kyc_desc: 'Verificación completa de identidad y controles contra el lavado de dinero.',
      entity_services: 'Servicios de Inversión Institucional',
      legal: 'Legal',
      link_spa: 'Contrato de Compra de Acciones',
      link_privacy: 'Política de Privacidad',
      link_terms: 'Términos de Servicio',
      link_risk: 'Divulgación de Riesgos',
      disclaimer: 'Este sitio web ha sido preparado por Omni Wealth Ltd únicamente con fines informativos e ilustrativos y no constituye asesoramiento de inversión, una oferta de venta o una solicitud de compra. Invertir en valores pre-IPO implica riesgos significativos incluyendo la pérdida total del capital. © 2025 Omni Wealth Ltd. Todos los derechos reservados.',
    },
    toast: {
      secured: 'acaba de asegurar',
      shares_at: 'acciones @ €117',
    },
    modal: {
      title: 'Asegurar Asignación Institucional',
      lbl_shares: 'Número de Acciones',
      lbl_fname: 'Nombre',
      lbl_sname: 'Apellido',
      lbl_email: 'Correo Electrónico',
      lbl_country: 'País',
      btn_submit: 'Asegurar Asignación',
      loading: 'Cifrando parámetros de transacción...',
      success_title: 'Puesto en Lista de Espera Asegurado',
      success_body: 'Copie esta referencia de seguimiento y entréguesela directamente a su gestor de cuentas de OmniTradeX para finalizar la transferencia de capital.',
      lbl_ref: 'ID de Referencia de Lista de Espera:',
      capital_required: 'Capital requerido',
      min_shares_error: 'Se requieren mínimo 87 acciones',
      required: 'Obligatorio',
      invalid_email: 'Ingrese una dirección de correo válida',
      select_country: 'Seleccione un país',
      legal_note: 'Al enviar, confirma que es un comprador institucional cualificado. El capital permanece en riesgo. Omni Wealth Ltd · FCA FRN 955451.',
    },
  },
};
