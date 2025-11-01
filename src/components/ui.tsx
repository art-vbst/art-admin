import { Field, type UseFieldConfig, useField } from 'react-final-form';
import { cn } from '~/utils/format';

type LabelProps = {
  label: string;
} & React.LabelHTMLAttributes<HTMLLabelElement>;

export const Label = ({ label, className, ...props }: LabelProps) => {
  return (
    <label
      className={cn('mb-1 block font-medium text-gray-700 text-sm', className)}
      {...props}
    >
      {label}
    </label>
  );
};

type InputProps = {
  label: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const Input = ({ label, error, className, ...props }: InputProps) => {
  return (
    <div>
      <Label label={label} />
      <input
        {...props}
        className={cn(
          'w-full rounded border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100',
          error && 'border-red-500',
          className,
        )}
      />
      {error && <ErrorText message={error} />}
    </div>
  );
};

export const FileInput = ({
  name,
  ...props
}: InputProps & { name: string }) => {
  return (
    <Field name={name} {...props}>
      {({ input, meta }) => {
        const { value: _value, ...inputProps } = input;
        return (
          <Input
            {...inputProps}
            {...props}
            error={meta.touched && meta.error}
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              input.onChange(file);
            }}
          />
        );
      }}
    </Field>
  );
};

type InputFieldProps = {
  label: string;
  name: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const InputField = ({ label, name, ...props }: InputFieldProps) => {
  const config: UseFieldConfig = {};

  if (props.type === 'file') {
    throw new Error('File input is not supported');
  }

  if (props.type === 'number') {
    config.format = (value?: number) => value?.toString() ?? '';
    config.parse = (value?: string) => (value ? Number(value) : undefined);
  }

  const { input, meta } = useField(name, config);

  return (
    <Input
      {...input}
      {...props}
      label={label}
      error={meta.touched && meta.error}
    />
  );
};

type CheckboxProps = {
  label: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const Checkbox = ({
  label,
  error,
  className,
  ...props
}: CheckboxProps) => {
  return (
    <div>
      <Label label={label} />
      <input
        type="checkbox"
        {...props}
        className={cn('disabled:opacity-50', className)}
      />
      {error && <ErrorText message={error} />}
    </div>
  );
};

type CheckboxFieldProps = {
  label: string;
  name: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const CheckboxField = ({
  label,
  name,
  ...props
}: CheckboxFieldProps) => {
  const { input, meta } = useField(name, { type: 'checkbox' });

  return (
    <Checkbox
      {...input}
      {...props}
      label={label}
      error={meta.touched && meta.error}
    />
  );
};

type SelectProps = {
  label: string;
  options: { label: string; value: string }[];
  error?: string;
} & React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = ({
  label,
  options,
  error,
  className,
  ...props
}: SelectProps) => {
  return (
    <div>
      <Label label={label} />
      <select
        {...props}
        className={cn(
          'w-full rounded border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100',
          className,
        )}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <ErrorText message={error} />}
    </div>
  );
};

type SelectFieldProps = {
  label: string;
  name: string;
  options: { label: string; value: string }[];
} & React.SelectHTMLAttributes<HTMLSelectElement>;
export const SelectField = ({
  label,
  name,
  options,
  ...props
}: SelectFieldProps) => {
  const { input, meta } = useField(name, { type: 'select' });

  return (
    <Select
      {...input}
      {...props}
      label={label}
      options={options}
      error={meta.touched && meta.error}
    />
  );
};

type ButtonVariant = 'primary' | 'secondary' | 'danger';

type ButtonProps = {
  variant?: ButtonVariant;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
  variant = 'primary',
  className,
  ...props
}: ButtonProps) => {
  const variantClassNames = {
    primary: 'bg-gray-900 text-white hover:bg-gray-700',
    secondary: 'border border-gray-300 text-gray-700 hover:bg-gray-100',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  return (
    <button
      {...props}
      type={props.type ?? 'button'}
      className={cn(
        'cursor-pointer rounded px-4 py-2 font-medium text-sm disabled:opacity-50',
        variantClassNames[variant],
        className,
      )}
    />
  );
};

type Column<T> = {
  header: string;
  cell: (item: T) => TableCellProps;
};

export const processColumns = <T,>(columns: Column<T>[]) => {
  const headers = columns.map((c) => c.header);

  const render = (item: T) => {
    return columns.map((col) => col.cell(item));
  };

  return { headers, render };
};

type TableProps<T> = {
  data: T[];
  headers: string[];
  render: RowRenderer<T>;
  onRowClick?: (item: T) => void;
};

type RowRenderer<T> = (item: T) => TableCellProps[];

export const Table = <T,>({
  data,
  headers,
  render,
  onRowClick,
}: TableProps<T>) => {
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
          <tr
            key={i}
            onClick={() => onRowClick?.(item)}
            className={cn(onRowClick && 'cursor-pointer')}
          >
            {render(item).map((cell, i) => (
              <TableCell key={i} {...cell} />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

type TableCellProps = {
  th?: boolean;
  children: React.ReactNode;
} & React.TdHTMLAttributes<HTMLTableCellElement>;

export const TableCell = ({ th, ...props }: TableCellProps) => {
  const localProps = {
    ...props,
    className: cn('px-4 py-3', props.className),
  };

  return th ? <th {...localProps} /> : <td {...localProps} />;
};

export const ErrorText = ({
  message,
  className,
}: {
  message: string;
  className?: string;
}) => {
  const localClassName = cn(
    'rounded border border-red-200 bg-red-50 p-3 text-red-800 text-sm',
    className,
  );

  return <div className={localClassName}>{message}</div>;
};

type ModalProps = {
  children: React.ReactNode;
  onClose?: () => void;
};

export const Modal = ({ children, onClose }: ModalProps) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};
