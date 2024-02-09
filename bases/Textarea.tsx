import { DetailedHTMLProps, InputHTMLAttributes, useState } from 'react';
import { Eye, EyeOff } from 'react-feather';

export type TextAreaProps = {
  label?: string;
  withIcon?: any;
  requiredHide?: boolean;
  onIconClick?: () => void;
};

export function TextArea(props: DetailedHTMLProps<InputHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> & TextAreaProps) {
  const [type, setType] = useState(props.type);
  return (
    <div className="w-full">
      {props.label && (
        <label className="form-label" style={{ marginBottom: 2 }}>
          {props.label} {props.required && !props.requiredHide ? <span>*</span> : ''}
        </label>
      )}
      <div className="w-full" style={{ position: 'relative' }}>
        {props.children ? (
          props.children
        ) : (
          <>
            <textarea
              {...props}
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
            {props.withIcon && (
              <span
                onClick={props.onIconClick}
                style={{
                  position: 'absolute',
                  right: 16,
                  top: 42,
                  cursor: 'pointer',
                  transform: 'translateY(-31px)'
                }}
              >
                {props.withIcon}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
