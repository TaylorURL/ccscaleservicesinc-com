import FormField from './FormField';

/**
 * Name, company, email, phone: the same four fields, in the same order, with the
 * same autocomplete hints, on both request forms.
 *
 * The autocomplete tokens matter more here than on most forms - the visitor is
 * usually standing next to a broken scale, on a phone, and every field the
 * browser can fill is one they do not have to type one-handed.
 */
const FIELDS = [
  { name: 'name', label: 'Name', autoComplete: 'name', required: true },
  { name: 'company', label: 'Company', autoComplete: 'organization' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email', required: true },
  { name: 'phone', label: 'Phone', type: 'tel', autoComplete: 'tel' },
];

export default function ContactFields({ contact, errors, onChange, onBlur }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {FIELDS.map((field) => (
        <FormField
          key={field.name}
          id={field.name}
          label={field.label}
          type={field.type || 'text'}
          autoComplete={field.autoComplete}
          required={field.required}
          error={errors[field.name]}
          value={contact[field.name]}
          onChange={(event) => onChange(field.name, event.target.value)}
          onBlur={() => onBlur(field.name)}
        />
      ))}
    </div>
  );
}
