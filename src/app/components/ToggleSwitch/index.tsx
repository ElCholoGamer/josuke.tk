import React from 'react';
import './ToggleSwitch.scss';

interface Props<T extends object> {
	data: T;
	name: keyof T;
	setData: (config: T) => void;
	disabled?: boolean;
}

const ToggleSwitch = <T extends object, _>({
	setData: setConfig,
	data: config,
	name,
	disabled = false,
}: Props<T>) => (
	<div
		onClick={() => {
			if (!disabled) {
				setConfig({
					...config,
					[name]: !config[name],
				});
			}
		}}
		className="switch-container"
		style={{
			backgroundColor: config[name] ? '#7289da' : '#868686',
			filter: disabled ? 'brightness(60%)' : 'none',
			cursor: !disabled ? 'pointer' : 'default',
		}}>
		<div
			style={{
				transform: config[name] ? 'translateX(117%)' : 'none',
			}}
		/>
	</div>
);

export default ToggleSwitch;
