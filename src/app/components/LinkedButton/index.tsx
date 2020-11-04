import React from 'react';
import { useHistory } from 'react-router-dom';
import './LinkedButton.scss';

interface Props {
  label?: string;
  to: string;
  external?: boolean;
  newTab?: boolean;
  style?: React.CSSProperties | undefined;
}

const LinkedButton: React.FC<Props> = ({
  label,
  children = '',
  to,
  external = false,
  newTab = false,
  style,
}) => {
  const history = useHistory();
  return (
    <input
      className="linked-button"
      type="button"
      value={label || children?.toString()}
      style={{
        width: '150px',
        height: '50px',
        fontSize: '20px',
        ...style,
      }}
      onClick={() => {
        if (external) {
          if (newTab) window.open(to);
          else window.location.href = to;
        } else history.push(to);
      }}
    />
  );
};

export default LinkedButton;
