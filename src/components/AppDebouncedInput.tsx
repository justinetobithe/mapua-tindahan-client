import React, { FC } from 'react';
import { Input } from './ui/input';

const AppDebouncedInput: FC<
  {
    value: string | number;
    onChange: (value: string | number) => void;
    debounce?: number;
  } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>
> = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <Input
      /* value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
      onChange={(event) =>
        table.getColumn('email')?.setFilterValue(event.target.value)
      } */
      className='max-w-sm'
      value={value}
      onChange={(e) => setValue(e.target.value)}
      {...props}
    />
  );
};

export default AppDebouncedInput;
