export interface IAppConfig {
  settings: {
    imprint: boolean;
    'data-protection': boolean;
    'recently-purchased': boolean;
    history: boolean;
    money: boolean;
    title: string;
    currencySymbol: string;
  };
  api: string;
}
