const formatYearLevel = (value: string): string => {
  switch (value) {
    case '5':
      return '5th Year';
    case '4':
      return '4th Year';
    case '3':
      return '3rd Year';
    case '2':
      return '2nd Year';
    default:
      return '1st Year';
  }
};

export default formatYearLevel;
