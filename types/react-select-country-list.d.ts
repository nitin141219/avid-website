declare module "react-select-country-list" {
  interface CountryData {
    label: string;
    value: string;
  }

  interface CountryList {
    getData: () => CountryData[];
  }

  function countryList(): CountryList;

  export default countryList;
}
