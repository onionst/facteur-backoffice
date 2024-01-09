import { DetailedHTMLProps, InputHTMLAttributes, useState } from 'react';
import { Eye, EyeOff } from 'react-feather';

export type InputProps = {
  label?: string;
};

export function Input(props: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & InputProps) {
  const [type, setType] = useState(props.type);
  return (
    <div className="w-full">
      {props.label && (
        <label className="form-label" style={{ marginBottom: 2 }}>
          {props.label} {props.required ? <span>*</span> : ''}
        </label>
      )}
      <div className="w-full" style={{ position: 'relative' }}>
        {props.children ? (
          props.children
        ) : (
          <>
            <input
              {...props}
              type={type}
              className={`form-control ${props.type === 'password' ? 'form-control__input' : ''} ${props.className || ''}`}
            />
            {props.type === 'password' && (
              <span
                onClick={() => {
                  setType(prev => (prev === 'password' ? 'text' : 'password'));
                }}
                style={{
                  position: 'absolute',
                  right: 16,
                  top: 42,
                  cursor: 'pointer',
                  transform: 'translateY(-31px)'
                }}
              >
                {type === 'password' ? <Eye color="#4b5675" size={20} /> : <EyeOff color="#00986d" size={20} />}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
