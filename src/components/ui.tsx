import { useCallback, useMemo } from 'react';
import { cn } from '~/utils/format';

type LabelProps = {
  label: string;
} & React.LabelHTMLAttributes<HTMLLabelElement>;

export const Label = ({ label, ...props }: LabelProps) => {
  return (
    <label className="mb-1 block font-medium text-gray-700 text-sm" {...props}>
      {label}
    </label>
  );
};

type InputProps = {
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const Input = ({ label, ...props }: InputProps) => {
  return (
    <div>
      <Label label={label} />
      <input
        {...props}
        className="w-full rounded border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100"
        disabled={props.disabled ?? props.readOnly}
      />
    </div>
  );
};

type CheckboxProps = {
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const Checkbox = ({ label, ...props }: CheckboxProps) => {
  return (
    <div>
      <Label label={label} />
      <input type="checkbox" {...props} className="disabled:opacity-50" />
    </div>
  );
};

type SelectProps = {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { label: string; value: string }[];
} & React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = ({ label, options, ...props }: SelectProps) => {
  return (
    <div>
      <Label label={label} />
      <select
        {...props}
        className="w-full rounded border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

type ButtonProps = {
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({ children, ...props }: ButtonProps) => {
  return (
    <button
      className="rounded bg-gray-900 px-4 py-2 font-medium text-sm text-white hover:bg-gray-700 disabled:opacity-50"
      {...props}
    >
      {children}
    </button>
  );
};

type TableCellProps = {
  th?: boolean;
  children: React.ReactNode;
} & React.TdHTMLAttributes<HTMLTableCellElement>;

type TableProps<T> = {
  headers: string[];
  data: T[];
  render: RowRenderer<T>;
};

type RowRenderer<T> = (item: T) => TableCellProps[];

type TableColumn = {
  header: string;
} & TableCellProps;

export const useTableColumns = <T,>(columns: TableColumn[]) => {
  const headers = useMemo(
    () => columns.map((column) => column.header),
    [columns],
  );

  const render = useCallback(
    (item: T): TableCellProps[] => {
      return columns.map(({ header, ...cellProps }: TableColumn) => cellProps);
    },
    [columns],
  );

  return { headers, render };
};

export const TableCell = ({ th, ...props }: TableCellProps) => {
  const localProps = {
    ...props,
    className: cn('px-4 py-3', props.className),
  };

  return th ? <th {...localProps} /> : <td {...localProps} />;
};

export const Table = <T,>({ headers, data, render }: TableProps<T>) => {
  return (
    <table className="w-full text-left text-sm">
      <thead className="border-gray-200 border-b bg-gray-50">
        <tr>
          {headers.map((header, i) => (
            <TableCell key={i} className="font-medium text-gray-900" th>
              {header}
            </TableCell>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, i) => (
          <tr key={i}>
            {render(item).map((cell, i) => (
              <TableCell key={i} {...cell} />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
